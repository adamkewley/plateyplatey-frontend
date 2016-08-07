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

           expect(plate.wellIds[0]).toBe(id);
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

    describe('wellPositions getter', function() {
      it('does not throw', function() {
        expect(() => { this.plate.wellPositions; }).not.toThrow();
      });

      it('returns an array', function() {
        expect(this.plate.wellPositions instanceof Array).toBe(true);
      });

      describe('each element of the returned array', function() {
        // Make sure the plate has at least a few elements
        beforeEach(function() {
          this.plate = new Platey([
            generateValidWellDefinition(),
            generateValidWellDefinition(),
            generateValidWellDefinition(),
          ]);
        });

        it('is an object', function() {
          function testIfObject(obj) { expect(typeof obj).toBe('object'); }

          this.plate.wellPositions.forEach(testIfObject);
        });

        describe('x property', function() {
          it('exists', function() {
            function testHasXProperty(obj) { expect(obj.x).toBeDefined(); }

            this.plate.wellPositions.forEach(testHasXProperty);
          });

          it('is a number', function() {
            function testIsNumeric(n) {
              // From:
              // http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric#1830844
              expect(!isNaN(parseFloat(n)) && isFinite(n)).toBe(true);
            }

            this.plate.wellPositions.map(wellPos => wellPos.x).forEach(testIsNumeric);
          });

          it('is between 0 and 100', function() {
            function testIsBetween0and100(n) {
              expect(n <= 100).toBe(true);
              expect(n >= 0).toBe(true);
            }

            this.plate.wellPositions.map(wellPos => wellPos.x).forEach(testIsBetween0and100);
          });
        });

        describe('y property', function() {
          it('exists', function() {
            function testHasYProperty(obj) { expect(obj.y).toBeDefined(); }

            this.plate.wellPositions.forEach(testHasYProperty);
          });

          it('is a number', function() {
            function testIsNumeric(n) {
              // From:
              // http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric#1830844
              expect(!isNaN(parseFloat(n)) && isFinite(n)).toBe(true);
            }

            this.plate.wellPositions.map(wellPos => wellPos.y).forEach(testIsNumeric);
          });

          it('is between 0 and 100', function() {
            function testIsBetween0and100(n) {
              expect(n <= 100).toBe(true);
              expect(n >= 0).toBe(true);
            }

            this.plate.wellPositions.map(wellPos => wellPos.y).forEach(testIsBetween0and100);
          });
        });

        describe('id property', function() {
          it('exists', function() {
            function testHasIdProperty(obj) { expect(obj.id).toBeDefined(); }

            this.plate.wellPositions.forEach(testHasIdProperty);
          });
        });
      });
    });

    it('has a isInFocus getter', function() {
      expect(this.plate.isInFocus).toBeDefined();
    });

    it('has a focusedWellId getter', function() {
      expect(this.plate.focusedWellId).toBeDefined();
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

    it('has a deSelectWell method', function() {
      expect(this.plate.deSelectWell).toBeDefined();

      expect(typeof this.plate.deSelectWell).toBe('function');
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
  });
});