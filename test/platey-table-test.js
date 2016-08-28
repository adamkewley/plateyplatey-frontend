describe('PlateyTable', function() {
  describe('static methods', function() {
  });

  describe('constructor', function() {
    it('exists', function() {
      expect(PlateyTable).toBeDefined();
      expect(typeof PlateyTable).toBe('function');
    });

    it('does not throw if no arguments are provided', function() {
      expect(() => new PlateyTable()).not.toThrow();
    });

    it('throws if rowIds are not an array', function() {
      const invalidRowIds = "I'm not an array";

      expect(() => new PlateyTable(invalidRowIds)).toThrow();
    });

    it('throws if non-unique row IDs are present in rowIds', function() {
      const id = "duped";

      const ids = [id, id, id];

      expect(() => new PlateyTable(ids)).toThrow();
    });

    it('throws if columnDefinitions is not an array', function() {
      const notAnArray = "I'm not an array";

      expect(() => new PlateyTable([], notAnArray)).toThrow();
    });

    it('throws if supplied column definition does not have an id', function() {
      const invalidColumnDefinition = { header: "Need an ID also.." };

      expect(() => new PlateyTable([], [invalidColumnDefinition])).toThrow();
    });

    it('throws if any supplied column definition does not have a header property', function() {
      const invalidColumnDefinition = { id: "Also need a header definition..." };

      expect(() => new PlateyTable([], [invalidColumnDefinition])).toThrow();
    });

    it('throws if duplicate column ids are supplied in the column definitions', function() {
      const id = "some duped id";
      const columnDefinitions = [
        { id: id, header: "header 1" },
        { id: id, header: "header 2" }
      ];

      expect(() => new PlateyTable([], columnDefinitions)).toThrow();
    });
  });

  const validRowDefinitions = [
    "row1",
    "row2",
    "row3",
  ];

  const validColumnDefinitions = [
      { id: "column 1", header: "Column 1" },
      { id: "column 2", header: "Column 2" },
  ];

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function constructPlateyInstanceWithRowIds(rowIds) {
    return new PlateyTable(rowIds, validColumnDefinitions);
  }

  function generateIntegerBetween(n, m) {
    return Math.floor(Math.random() * (m - n) + n);
  }

  function generateRandomString() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function constructValidPlateyTableInstance() {
    return new PlateyTable(validRowDefinitions, validColumnDefinitions);
  }

  describe('after construction', function() {
    beforeEach(function() {
      this.table = constructValidPlateyTableInstance();
    });

    describe('get numberOfRows', function() {
      it('exists', function() {
        expect(this.table.numberOfRows).toBeDefined();
      });

      it('returns a number', function() {
        expect(typeof this.table.numberOfRows).toBe("number");
      });

      it("returns same number of rows as provided through the constructor", function() {
        const numRows = generateIntegerBetween(50, 100);

        const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

        const table = constructPlateyInstanceWithRowIds(rowIds);

        expect(table.numberOfRows).toBe(numRows);
      });
    });

    describe("get rowIds", function() {
      it("exists", function() {
        expect(this.table.rowIds).toBeDefined();
      });

      it("returns an array", function() {
        expect(this.table.rowIds instanceof Array).toBe(true);
      });

      it("returns an array that has the same number of elements as provided through the constructor",
         function() {
           const numRows = generateIntegerBetween(50, 100);

           const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

           const table = constructPlateyInstanceWithRowIds(rowIds);

           expect(table.rowIds.length).toBe(numRows);
         });

      it("returns an array containing the same IDs are provided through the constructor",
         function() {
           const numRows = generateIntegerBetween(50, 100);

           const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

           const table = constructPlateyInstanceWithRowIds(rowIds);

           const returnedRowIds = table.rowIds;

           rowIds.forEach(providedRowId => {
             expect(returnedRowIds.indexOf(providedRowId)).not.toBe(-1);
           });
         });

      it("returns an array containing the same IDs in the same order as provided through the constructor",
         function() {
           const numRows = generateIntegerBetween(50, 100);

           const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

           const table = constructPlateyInstanceWithRowIds(rowIds);

           const returnedRowIds = table.rowIds;

           expect(arraysEqual(rowIds, returnedRowIds)).toBe(true);
         });
    });

    describe('get rowData', function() {
      it('exists', function() {
        expect(this.table.rowData).toBeDefined();
      });

      it('returns an array', function() {
        expect(this.table.rowData instanceof Array).toBe(true);
      });

      it('array contains as many elements as rows provided through constructor', function() {
        const numRows = generateIntegerBetween(50, 100);

        const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

        const table = constructPlateyInstanceWithRowIds(rowIds);

        expect(table.rowData.length).toBe(numRows);
      });

      it('all array elements have an id property', function() {
        const numRows = generateIntegerBetween(50, 100);

        const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

        const table = constructPlateyInstanceWithRowIds(rowIds);

        const allHaveIdProperty =
             table.rowData.every(data => data.id !== undefined);

        expect(allHaveIdProperty).toBe(true);
      });

      it("all array elements have a columnData property", function() {
        const numRows = generateIntegerBetween(50, 100);

        const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

        const table = constructPlateyInstanceWithRowIds(rowIds);

        const allHaveColumnDataProperty =
          table.rowData.every(data => data.columnData !== undefined);

        expect(allHaveColumnDataProperty).toBe(true);
      });

      it("the columnData property is an array", function() {
        const numRows = generateIntegerBetween(50, 100);

        const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

        const table = constructPlateyInstanceWithRowIds(rowIds);

        const columnDataPropertyIsAnArray =
          table.rowData.every(rowData => (rowData.columnData instanceof Array));

        expect(columnDataPropertyIsAnArray).toBe(true);
      });

      it("each element of the columnData array has a columnId property", function() {
        const numRows = generateIntegerBetween(50, 100);

        const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

        const table = constructPlateyInstanceWithRowIds(rowIds);

        const everyColumnDataEntryHasColumnId =
          table.rowData.every(rowData => {
            return rowData.columnData.every(columnData => columnData.columnId !== undefined);
          });

        expect(everyColumnDataEntryHasColumnId).toBe(true);
      });

      it("each element of the columnData array has a value property", function() {
        const numRows = generateIntegerBetween(50, 100);

        const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());

        const table = constructPlateyInstanceWithRowIds(rowIds);

        const everyColumnDataEntryHasAValue =
          table.rowData.every(rowData => {
            return rowData.columnData.every(data => data.value !== undefined);
          });

        expect(everyColumnDataEntryHasAValue).toBe(true);
      });

      it("each columnData array has same number of elements as columnDefinitions provided in constructor",
         function() {
           const numRows = generateIntegerBetween(50, 100);
           const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());
           const numColumnDefinitions = generateIntegerBetween(10, 20);
           const columnDefinitions = Array.apply(null, { length: numColumnDefinitions}).map(_ => {
             return { id: generateRandomString(), header: generateRandomString() };
           });

           const table = new PlateyTable(rowIds, columnDefinitions);

           table.rowData.forEach(rowData => {
             expect(rowData.columnData.length).toBe(numColumnDefinitions);
           });
         });
    });

    describe("get numberOfColumns", function() {
      it("exists", function() {
        expect(this.table.numberOfColumns).toBeDefined();
      });

      it("returns a number", function() {
        expect(typeof this.table.numberOfColumns).toBe("number");
      });

      it("returns the same number of columns as columnDefinitions provided in the constructor",
         function() {
           const numRows = generateIntegerBetween(50, 100);
           const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());
           const numColumnDefinitions = generateIntegerBetween(10, 20);
           const columnDefinitions = Array.apply(null, { length: numColumnDefinitions}).map(_ => {
             return { id: generateRandomString(), header: generateRandomString() };
           });

           const table = new PlateyTable(rowIds, columnDefinitions);

           expect(table.numberOfColumns).toBe(numColumnDefinitions);
         });
    });

    describe("get columnIds", function() {
      it("exists", function() {
        expect(this.table.columnIds).toBeDefined();
      });

      it("returns an array", function() {
        expect(this.table.columnIds instanceof Array).toBe(true);
      });

      it("returns an array of strings", function() {
        expect(this.table.columnIds.every(id => (id instanceof String))).toBe(true);
      });

      it("returns an array containing the same number of elements as columnDefinitions provided in constructor",
         function() {
           const numRows = generateIntegerBetween(50, 100);
           const rowIds = Array.apply(null, { length: numRows }).map(_ => generateRandomString());
           const numColumnDefinitions = generateIntegerBetween(10, 20);
           const columnDefinitions = Array.apply(null, { length: numColumnDefinitions}).map(_ => {
             return { id: generateRandomString(), header: generateRandomString() };
           });

           const table = new PlateyTable(rowIds, columnDefinitions);

           expect(table.columnIds.length).toBe(numColumnDefinitions);
         });
    });
  });
});