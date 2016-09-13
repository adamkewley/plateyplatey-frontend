describe('Platey', function() {
  function constructValidPlateyInstance() {
    const wells = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
    ];

    return new Platey(wells);
  }

  function generateValidWellDefinition(override) {
    var ret = { x: 1, y: 1 };

    if(override !== undefined) {
      Object.keys(override).forEach(function(key) {
        ret[key] = override[key];
      });
    }

    return ret;
  }

  function generatePlateWithNoWells() {
    return new Platey([]);
  }

  function generatePlateWithNWells(n) {
    var wells = [];

    for (var i = 0; i < n; i++) {
      wells.push(generateValidWellDefinition());
    }

    return new Platey(wells);
  }

  describe('static methods', function() {
    it('has a deserialize method', function() {
      expect(Platey.deserialize).toBeDefined();

      expect(typeof Platey.deserialize).toBe('function');
    });
  });

  describe('to construct', function() {
    it('constructor exists', function() {
      expect(Platey).toBeDefined();
      expect(typeof Platey).toBe('function');
    });

    it('constructor throws if wells are not provided', function() {
      expect(function() { new Platey(); }).toThrow();
    });

    it('constructor does not throw if empty well array is provided', function() {
      expect(function() { new Platey([]); }).not.toThrow();
    });

    it('constructor does not throw if no options are provided', function() {
      expect(function() { new Platey([]); }).not.toThrow();
    });

    it('constructor throws if options are not an object', function() {
      // JavaScript has 5 primitive datatypes: string, number,
      // boolean, null, undefined. see:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Glossary

      expect(function() { new Platey([], "not an object"); });
    });

    it('constructor throws if a well entry does not have an x property', function() {
      const invalidWellDefinition = { somePointlessProperty: "somePointlessValue" };

      expect(function() { new Platey([invalidWellDefinition]); }).toThrow();
    });

    it('constructor throws if even a single well entry does not have an x property', function() {
      const invalidWellDefinition = { somePointlessProperty: "somePointlessValue" };

      const wells = [
        generateValidWellDefinition(),
        generateValidWellDefinition(),
        invalidWellDefinition
      ];

      expect(function() { new Platey(wells); }).toThrow();
    });

    it('constructor throws if a well entry does not have a y property', function() {
      const invalidWellDefinition = { aPropertyThatIsntY: "a pointless value" };

      expect(function() { new Platey([invalidWellDefinition]); }).toThrow();
    });

    it('constructor throws if even a single well entry does not have a y property', function() {
      const invalidWellDefinition = { aPropertyThatIsntY: "a pointless value" };

      const wells = [
        generateValidWellDefinition(),
        generateValidWellDefinition(),
        invalidWellDefinition
      ];

      expect(function() { new Platey(wells); }).toThrow();
    });

    it('constructor throws if non-unique ids are provided', function() {
      const id = "b95a94f9-d092-9da5-e372-c23ee80c4586";

      const well1 = generateValidWellDefinition({ id: id });
      const well2 = generateValidWellDefinition({ id: id });

      expect(function() { new Platey([well1, well2]); }).toThrow();
    });
  });

  describe('after construction', function() {
    beforeEach(function() {
      this.plate = constructValidPlateyInstance();
    });

    describe('htmlElement getter', function() {
      it('does not throw', function() {
        expect(() => { this.plate.htmlElement; }).not.toThrow();
      });

      it('returns something', function() {
        expect(this.plate.htmlElement).toBeDefined();
      });

      it('returns a HTMLElement', function() {
        expect(this.plate.htmlElement instanceof HTMLElement).toBe(true);
      });
    });

    describe('hasWells getter', function() {
      it('does not throw', function() {
        expect(() => { this.plate.hasWells; }).not.toThrow();
      });

      it('returns a boolean', function() {
        expect(typeof this.plate.hasWells === 'boolean').toBe(true);
      });

      it('returns true if the plate was constructed with wells', function() {
        const plateWithWells = new Platey([generateValidWellDefinition()]);

        expect(plateWithWells.hasWells).toBe(true);
      });

      it('returns false if the plate was constructed with no wells', function() {
        const plateWithNoWells = new Platey([]);

        expect(plateWithNoWells.hasWells).toBe(false);
      });
    });

    describe('numberOfWells getter', function() {
      it('does not throw', function() {
        expect(() => { this.plate.numberOfWells; }).not.toThrow();
      });

      it('returns a number', function() {
        expect(typeof this.plate.numberOfWells === 'number').toBe(true);
      });

      it('returns zero if no wells were supplied on construction', function() {
        const plateWithZeroWells = new Platey([]);

        expect(plateWithZeroWells.numberOfWells).toBe(0);
      });

      it('returns the number of wells supplied on construction', function() {
        const plateWithOneWell = new Platey([generateValidWellDefinition()]);

        expect(plateWithOneWell.numberOfWells).toBe(1);

        const plateWithThreeWells = new Platey([
          generateValidWellDefinition(),
          generateValidWellDefinition(),
          generateValidWellDefinition(),
        ]);

        expect(plateWithThreeWells.numberOfWells).toBe(3);
      });
    });

    describe('wellIds getter', function() {
      it('does not throw', function() {
        expect(() => { this.plate.wellIds; }).not.toThrow();
      });

      it('returns an array', function() {
        expect(this.plate.wellIds instanceof Array).toBe(true);
      });

      it('returns an empty array if no wells were provided on construction', function() {
        var plateWithNoWells = generatePlateWithNoWells();

        expect(plateWithNoWells.wellIds.length).toBe(0);
      });

      it('returns an array containing as many ids as there were wells provided on construction', function() {
        var plateWith3Wells = generatePlateWithNWells(3);

        expect(plateWith3Wells.wellIds.length).toBe(3);
      });

      it('returns an array containing the supplied id if a well id was provided on construction',
         function() {
           const id = "6d84c049-ca67-21e8-b072-f3dfca8d0af2";

           const wellWithAnId = { x: 1, y: 2, id: id };

           const plate = new Platey([wellWithAnId]);

           // Sanity check
           expect(plate.wellIds.length).toBe(1);

           expect(plate.wellIds.includes(id)).toBe(true);
         });

      it('returns an array containing the supplied well id even if other wells did not provide an id',
         function() {

           function generateWellWithNoId() {
             var generatedWell = generateValidWellDefinition();
             delete generatedWell.id;

             return generatedWell;
           }

           const id = "caac3083-efdd-03b0-9e13-7156d06e8a32";

           var wellWithId = generateValidWellDefinition({ id: id });

           var wells = [
               generateWellWithNoId(),
               generateWellWithNoId(),
               wellWithId,
               generateWellWithNoId(),
           ];

           var plate = new Platey(wells);

           // Platey should assign ids if they weren't
           // supplied.
           expect(plate.wellIds.length).toBe(wells.length);

           expect(plate.wellIds.indexOf(id)).not.toBe(-1);
         });
    });

    describe('hasWells getter', function() {
      it('does not throw', function() {
        expect(() => { this.plate.hasWells; }).not.toThrow();
      });

      it('returns a boolean', function() {
        expect(typeof this.plate.hasWells).toBe('boolean');
      });

      it('returns false if no wells were provided to the constructor', function() {
        var plate = new Platey([]);

        expect(plate.hasWells).toBe(false);
      });
    });

    describe('numberOfWells getter', function() {
      it('does not throw', function() {
        expect(() => { this.plate.numberOfWells; }).not.toThrow();
      });

      it('returns a number', function() {
        expect(typeof this.plate.numberOfWells).toBe('number');
      });

      it('returns zero if no wells were provided on construction', function() {
        const plateWithNoWells = new Platey([]);

        expect(plateWithNoWells.numberOfWells).toBe(0);
      });

      it('returns the number of wells provided on construction', function() {
        const plateWith3Wells = new Platey([
          generateValidWellDefinition(),
          generateValidWellDefinition(),
          generateValidWellDefinition(),
        ]);
      });
    });

    describe('wellIds getter', function() {
      it('does not throw', function() {
        expect(() => { this.plate.wellIds; }).not.toThrow();
      });

      it('returns an array', function() {
        expect(this.plate.wellIds instanceof Array).toBe(true);
      });

      it('returns an empty array if no wells were provided on construction', function() {
        const plateWithNoWells = new Platey([]);

        expect(plateWithNoWells.wellIds.length).toBe(0);
      });

      it('returns an array containing the same number of elements as provided on construction', function() {
        const plateWith5Wells = new Platey([
          generateValidWellDefinition(),
          generateValidWellDefinition(),
          generateValidWellDefinition(),
          generateValidWellDefinition(),
          generateValidWellDefinition(),
        ]);

        expect(plateWith5Wells.wellIds.length).toBe(5);
      });

      it('returns an array containing the an id provided on construction', function() {
        const id = "8974fe79-9683-67d5-b07d-1b13dd7e1d64";
        const wellWithAnId = generateValidWellDefinition({ id:  id });
        const plate = new Platey([wellWithAnId]);

        expect(plate.wellIds.indexOf(id)).not.toBe(-1);
      });
    });

    it('has a selectedWellIds getter', function() {
      expect(this.plate.selectedWellIds).toBeDefined();
    });

    it('has a notSelectedWellIds getter', function() {
      expect(this.plate.notSelectedWellIds).toBeDefined();
    });

    it('has a selectWell method', function() {
      expect(this.plate.selectWell).toBeDefined();

      expect(typeof this.plate.selectWell).toBe('function');
    });

    it('has a selectWells method', function() {
      expect(this.plate.selectWells).toBeDefined();

      expect(typeof this.plate.selectWells).toBe('function');
    });

    describe('deSelectWell', function() {
      it("exists", function() {
        expect(this.plate.deSelectWell).toBeDefined();
      });

      it("takes a wellId as an argument", function() {
        const wellIdToDeSelect = this.plate.wellIds[0];

        expect(() => this.plate.deSelectWell(wellIdToDeSelect)).not.toThrow();
      });

      it("does not change the selection if the well wasn't initially selected", function() {
        const selectionBefore = this.plate.selectedWellIds;

        const wellIdToDeSelect = this.plate.wellIds[0];

        this.plate.deSelectWell(wellIdToDeSelect);

        const selectionAfter = this.plate.selectedWellIds;

        expect(JSON.stringify(selectionAfter)).toBe(JSON.stringify(selectionBefore));
      });

      it("deselects a selected well", function() {
        const wellId = this.plate.wellIds[0];

        this.plate.selectWell(wellId);

        // Sanity
        expect(this.plate.selectedWellIds.indexOf(wellId)).not.toBe(-1);

        this.plate.deSelectWell(wellId);

        expect(this.plate.selectedWellIds.indexOf(wellId)).toBe(-1);
      });

      it("triggers onSelectionChanged if it deselected a well", function() {
        const wellId = this.plate.wellIds[0];

        let callbackWasTriggered = false;

        const callback = function(arg) { callbackWasTriggered = true; };

        this.plate.selectWell(wellId);

        this.plate.onSelectionChanged.add(callback);

        this.plate.deSelectWell(wellId);

        expect(callbackWasTriggered).toBe(true);
      });

      it("does not trigger an onSelectionChanged if it did not deSelect a well", function() {
        const wellId = this.plate.wellIds[0];

        let callbackWasTriggered = false;

        const callback = function() { callbackWasTriggered = true; };

        // Sanity
        expect(this.plate.selectedWellIds.length).toBe(0);

        this.plate.onSelectionChanged.add(callback);

        this.plate.deSelectWell(wellId);

        expect(callbackWasTriggered).toBe(false);
      });
    });

    describe("deSelectWells", function() {
      it("exists", function() {
        expect(this.plate.deSelectWells).toBeDefined();
      });

      it("is a function", function() {
        expect(typeof this.plate.deSelectWells).toBe("function");
      });

      it("accepts an array", function() {
        expect(() => { this.plate.deSelectWells([]); }).not.toThrow();
      });

      it("deselects each selected wellId in the array", function() {
        // Select everything in the plate
        const wellIds = this.plate.wellIds;

        // Sanity
        expect(this.plate.selectedWellIds.length).toBe(0);

        this.plate.selectWells(wellIds);

        // Another sanity
        expect(this.plate.selectedWellIds.length).toBe(wellIds.length);

        this.plate.deSelectWells(wellIds);

        expect(this.plate.selectedWellIds.length).toBe(0);
      });

      it("triggers onSelectionChanged", function() {
        let callbackWasTriggered = false;

        const callback = function() { callbackWasTriggered = true; };

        // Select everything in the plate
        const wellIds = this.plate.wellIds;

        this.plate.selectWells(wellIds);

        this.plate.onSelectionChanged.add(callback);

        // Should trigger the callback
        this.plate.deSelectWells(wellIds);

        expect(callbackWasTriggered).toBe(true);
      });
    });

    it('has a deSelectWells method', function() {
      expect(this.plate.deSelectWells).toBeDefined();

      expect(typeof this.plate.deSelectWells).toBe('function');
    });

    it('has a clearSelection method', function() {
      expect(this.plate.clearSelection).toBeDefined();

      expect(typeof this.plate.clearSelection).toBe('function');
    });

    it('has a serialize method', function() {
      expect(this.plate.serialize).toBeDefined();

      expect(typeof this.plate.serialize).toBe('function');
    });

    describe("selectWellsWithinRectangle", function() {
      it("exists", function() {
        expect(this.plate.selectWellsWithinRectangle).toBeDefined();
      });

      it("is a function", function() {
        expect(typeof this.plate.selectWellsWithinRectangle).toBe("function");
      });

      it("takes a paperjs rectangle as an argument", function() {
        const selectionArea = new paper.Rectangle(0, 0, 1000, 1000);

        expect(() => this.plate.selectWellsWithinRectangle).not.toThrow();
      });

      it("selects wells within the provided rectangle", function() {
        const selectionArea = new paper.Rectangle(0, 0, 2000, 2000);

        // Sanity
        expect(this.plate.selectedWellIds.length).toBe(0);

        this.plate.selectWellsWithinRectangle(selectionArea);

        expect(this.plate.selectedWellIds.length).not.toBe(0);
      });

      it("triggers the onSelectionChanged event", function() {
        let callbackTriggered = false;

        function callback() { callbackTriggered = true; }

        this.plate.onSelectionChanged.add(callback);

        const selectionArea = new paper.Rectangle(0, 0, 2000, 2000);

        this.plate.selectWellsWithinRectangle(selectionArea);

        expect(callbackTriggered).toBe(true);
      });

      it("only triggers the onSelectionChanged event once", function() {
        let numTimesCallbackTriggered = 0;

        function callback() { numTimesCallbackTriggered++; }

        this.plate.onSelectionChanged.add(callback);

        const selectionArea = new paper.Rectangle(0, 0, 2000, 2000);

        this.plate.selectWellsWithinRectangle(selectionArea);

        expect(numTimesCallbackTriggered).toBe(1);
      });
    });

    describe("onSelectionChanged getter", function() {
      it("exists", function() {
        expect(this.plate.onSelectionChanged).toBeDefined();
      });

      it("is an object", function() {
        expect(this.plate.onSelectionChanged instanceof Object).toBe(true);
      });

      describe("add method", function() {
        it("exists", function() {
          expect(this.plate.onSelectionChanged.add).toBeDefined();
        });

        it("is a function", function() {
          expect(typeof this.plate.onSelectionChanged.add).toBe("function");
        });

        it("accepts a callback function", function() {
          function blankCallback() {}

          expect(() => this.plate.onSelectionChanged.add(blankCallback)).not.toThrow();
        });

        it("the callback function is triggered whenever a well is selected", function() {
          let callbackTriggered = false;

          function callback() {
            callbackTriggered = true;
          }

          this.plate.onSelectionChanged.add(callback);

          // Select the first well in the plate
          this.plate.selectWell(this.plate.wellIds[0]);

          expect(callbackTriggered).toBe(true);
        });

        it("the callback function is triggered whenever multiple wells are selected", function() {
          let callbackTriggered = false;

          function callback() {
            callbackTriggered = true;
          }

          this.plate.onSelectionChanged.add(callback);

          // Select all wells in the plate
          this.plate.selectWells(this.plate.wellIds);

          expect(callbackTriggered).toBe(true);
        });

        describe("the callback recieves", function() {
          it("an object", function () {
            function callback(arg) {
              expect(arg instanceof Object).toBe(true);
            }

            this.plate.onSelectionChanged.add(callback);

            // Select all wells in the plate
            this.plate.selectWells(this.plate.wellIds);
          });

          it("the object has a newItems property", function() {
            function callback(arg) {
              expect(arg.newItems).toBeDefined();
            }

            this.plate.onSelectionChanged.add(callback);

            // Select all well in the plate
            this.plate.selectWells(this.plate.wellIds);
          });

          it("the newItems property is an array", function() {
            function callback(arg) {
              expect(arg.newItems instanceof Array).toBe(true);
            }

            this.plate.onSelectionChanged.add(callback);

            // Select all wells in the plate
            this.plate.selectWells(this.plate.wellIds);
          });

          it("the newItems property is an array even if selecting only one well", function() {
            function callback(arg) {
              expect(arg.newItems instanceof Array).toBe(true);
            }

            this.plate.onSelectionChanged.add(callback);

            // Select the first well in the plate
            this.plate.selectWell(this.plate.wellIds[0]);
          });

          it("the newItems array contains the well IDs of the newly selected items", function() {
            const wellIdToSelect = this.plate.wellIds[0];

            const callback = function(arg) {
                               expect(arg.newItems.length).toBe(1);
                               expect(arg.newItems[0]).toBe(wellIdToSelect);
                             };

            this.plate.onSelectionChanged.add(callback);

            this.plate.selectWell(wellIdToSelect);
          });

          it("the object has a deSelectedItems property", function() {
            function callback(arg) {
              expect(arg.deSelectedItems).toBeDefined();
            }

            this.plate.onSelectionChanged.add(callback);

            // Select all wells in the plate (to trigger the event)
            this.plate.selectWells(this.plate.wellIds);
          });

          it("the deSelectedItems property is an array", function() {
            function callback(arg) {
              expect(arg.deSelectedItems instanceof Array).toBe(true);
            }

            this.plate.onSelectionChanged.add(callback);

            // Select all wells in the plate (to trigger the event)
            this.plate.selectWells(this.plate.wellIds);
          });

          it("the deSelectedItems property contains the wellIds of deSelected wells", function() {
            const wellIdToDeselect = this.plate.wellIds[0];

            let callbackTriggered = false;
            const callback = function(arg) {
                               expect(arg.deSelectedItems.length).toBe(1);
                               expect(arg.deSelectedItems[0]).toBe(wellIdToDeselect);
                               callbackTriggered = true;
                             };

             // Initially select the well
             this.plate.selectWell(wellIdToDeselect);

             this.plate.onSelectionChanged.add(callback);

             // Should trigger the event + assertions
             this.plate.deSelectWell(wellIdToDeselect);

            expect(callbackTriggered).toBe(true);
          });
        });
      });

      it("does not trigger if the selection did not change; for example, if selecting a well that was already selected", function() {
        const wellIdToSelect = this.plate.wellIds[0];
        let numTimesCallbackWasCalled = 0;

        const callback = function() { numTimesCallbackWasCalled++; };

        this.plate.onSelectionChanged.add(callback);

        // Should trigger it - the well wasn't initially selected
        this.plate.selectWell(wellIdToSelect);

        // Shouldn't trigger it - the well is already selected (no
        // change in selection)
        this.plate.selectWell(wellIdToSelect);

        expect(numTimesCallbackWasCalled).toBe(1);
      });
    });
  });
});