describe('PlateyTable', function() {
  // HELPERS

  const validRowDefinitions = [
    "row1",
    "row2",
    "row3",
  ];

  const validColumnDefinitions = [
      { id: "column 1", header: "Column 1" },
      { id: "column 2", header: "Column 2" },
  ];

  /**
   * Generate a random column definition
   * @return {ColumnDefinition}
   */
  function generateRandomColumnDefinition() {
    return { id: generateRandomString(), header: generateRandomString() };
  }

  /**
   * Generate an array of random column definitions.
   * @return {Array.<ColumnDefinition>}
   */
  function generateRandomColumnDefinitions(len) {
    return createArray(len).map(generateRandomColumnDefinition);
  }

  /**
   * Construct a len-element array of random strings.
   * @param {number} len
   * @return {Array.<string>}
   */
  function generateArrayOfRandomStrings(len) {
    return Array.apply(null, { length: len }).map(_ => generateRandomString());
  }

  /**
   * Construct an empty array of length len.
   * @param {number} len
   * @return {Array}
   */
  function createArray(len) {
    return Array.apply(null, { length: len });
  }

  /**
   * Returns true if both arrays are equal.
   * @param {Array.<object>} a
   * @param {Array.<object>} b
   * @return {bool}
   */
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

  /**
   * Construct a valid platey table instance that uses the
   * provided rowIds
   * @param {Array.<string>} rowIds
   * @return {PlateyTable}
   */
  function constructPlateyInstanceWithRowIds(rowIds) {
    return new PlateyTable(rowIds, validColumnDefinitions);
  }

  /**
   * Construct a valid platey instance that uses the provided
   * columnDefinitions
   * @param {Array.<ColumnDefinition>} columnDefinitions
   * @return {PlateyTable}
   */
  function constructPlateyInstanceWithColumnDefinitions(columnDefinitions) {
    return new PlateyTable(validRowDefinitions, columnDefinitions);
  }

  /**
   * Generate a random integer between n and m.
   * @param {number} n
   * @param {number} m
   * @return {number}
   */
  function generateIntegerBetween(n, m) {
    return Math.floor(Math.random() * (m - n) + n);
  }

  /**
   * Generate a random string.
   * @return {string}
   */
  function generateRandomString() {
    // Ripped this code from platey (guids)
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  /**
   * Construct a valid platey table instance.
   * @return {PlateyTable}
   */
  function constructValidPlateyTableInstance() {
    return new PlateyTable(validRowDefinitions, validColumnDefinitions);
  }

  function getRandomElementInArray(arr) {
    const randomIndex = generateIntegerBetween(0, arr.length);

    return arr[randomIndex];
  }

  // TESTS

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
        const rowIds = generateArrayOfRandomStrings(numRows);

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
           const rowIds = generateArrayOfRandomStrings(numRows);

           const table = constructPlateyInstanceWithRowIds(rowIds);

           expect(table.rowIds.length).toBe(numRows);
         });

      it("returns an array containing the same IDs are provided through the constructor",
         function() {
           const numRows = generateIntegerBetween(50, 100);

           const rowIds = generateArrayOfRandomStrings(numRows);

           const table = constructPlateyInstanceWithRowIds(rowIds);

           const returnedRowIds = table.rowIds;

           rowIds.forEach(providedRowId => {
             expect(returnedRowIds.indexOf(providedRowId)).not.toBe(-1);
           });
         });

      it("returns an array containing the same IDs in the same order as provided through the constructor",
         function() {
           const numRows = generateIntegerBetween(50, 100);
           const rowIds = generateArrayOfRandomStrings(numRows);

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
        const rowIds = generateArrayOfRandomStrings(numRows);

        const table = constructPlateyInstanceWithRowIds(rowIds);

        expect(table.rowData.length).toBe(numRows);
      });

      it('all array elements have an id property', function() {
        const numRows = generateIntegerBetween(50, 100);
        const rowIds = generateArrayOfRandomStrings(numRows);

        const table = constructPlateyInstanceWithRowIds(rowIds);

        const allHaveIdProperty =
             table.rowData.every(data => data.id !== undefined);

        expect(allHaveIdProperty).toBe(true);
      });

      it("all array elements have a columnData property", function() {
        const numRows = generateIntegerBetween(50, 100);
        const rowIds = generateArrayOfRandomStrings(numRows);

        const table = constructPlateyInstanceWithRowIds(rowIds);

        const allHaveColumnDataProperty =
          table.rowData.every(data => data.columnData !== undefined);

        expect(allHaveColumnDataProperty).toBe(true);
      });

      it("the columnData property is an array", function() {
        const numRows = generateIntegerBetween(50, 100);
        const rowIds = generateArrayOfRandomStrings(numRows);
        const table = constructPlateyInstanceWithRowIds(rowIds);

        const columnDataPropertyIsAnArray =
          table.rowData.every(rowData => (rowData.columnData instanceof Array));

        expect(columnDataPropertyIsAnArray).toBe(true);
      });

      it("each element of the columnData array has a columnId property", function() {
        const numRows = generateIntegerBetween(50, 100);
        const rowIds = generateArrayOfRandomStrings(numRows);

        const table = constructPlateyInstanceWithRowIds(rowIds);

        const everyColumnDataEntryHasColumnId =
          table.rowData.every(rowData => {
            return rowData.columnData.every(columnData => columnData.columnId !== undefined);
          });

        expect(everyColumnDataEntryHasColumnId).toBe(true);
      });

      it("each element of the columnData array has a value property", function() {
        const numRows = generateIntegerBetween(50, 100);
        const rowIds = generateArrayOfRandomStrings(numRows);

        const table = constructPlateyInstanceWithRowIds(rowIds);

        const everyColumnDataEntryHasAValue =
          table.rowData.every(rowData => {
            return rowData.columnData.every(data => data.value !== undefined);
          });

        expect(everyColumnDataEntryHasAValue).toBe(true);
      });

      it("each columnData array has same number of elements as columnDefinitions provided in constructor",
         function() {
           const numColumnDefinitions = generateIntegerBetween(10, 20);
           const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

           const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

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
           const numColumnDefinitions = generateIntegerBetween(10, 20);
           const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

           const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

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
        expect(this.table.columnIds.every(id => (typeof id === "string"))).toBe(true);
      });

      it("returns an array containing the same number of elements as columnDefinitions provided in constructor",
         function() {
           const numColumnDefinitions = generateIntegerBetween(10, 20);
           const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

           const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

           expect(table.columnIds.length).toBe(numColumnDefinitions);
         });

      it("returns an array containing the same column ids as provided via the columnDefinitions through the constructor",
         function() {
           const numColumnDefinitions = generateIntegerBetween(10, 20);
           const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

           const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

           const suppliedColumnIds = columnDefinitions.map(definition => definition.id);
           const returnedColumnIds = table.columnIds;

           suppliedColumnIds.forEach(suppliedColumnId => {
             expect(returnedColumnIds.indexOf(suppliedColumnId)).not.toBe(-1);
           });
         });
    });

    describe("get columnHeaders", function() {
      it("exists", function() {
        expect(this.table.columnHeaders).toBeDefined();
      });

      it("returns an array", function() {
        expect(this.table.columnHeaders instanceof Array).toBe(true);
      });

      it("returns an array containing only strings", function() {
        const everyElementIsString =
          this.table.columnHeaders.every(columnHeader => typeof columnHeader === "string");

        expect(everyElementIsString).toBe(true);
      });

      it("returns an array containing the same number of elements as columnDefinitions provided in constructor",
         function() {
           const numColumnDefinitions = generateIntegerBetween(10, 20);
           const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

           const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

           expect(table.columnHeaders.length).toBe(numColumnDefinitions);
         });

      it("returns an array containing the same headers as provided via the columnDefinitions through the constructor",
         function() {
           const numColumnDefinitions = generateIntegerBetween(10, 20);
           const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

           const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

           const providedHeaders = columnDefinitions.map(columnDefinition => columnDefinition.header);
           const returnedHeaders = table.columnHeaders;

           providedHeaders.forEach(providedHeader => {
             expect(returnedHeaders.indexOf(providedHeader)).not.toBe(-1);
           });
         });
    });

    describe("get numberOfCells", function() {
      it("exists", function() {
        expect(this.table.numberOfCells).toBeDefined();
      });

      it("returns a number", function() {
        expect(typeof this.table.numberOfCells).toBe("number");
      });

      it("returns 0 if there are no rows in the table", function() {
        const table = constructPlateyInstanceWithRowIds([]);

        expect(table.numberOfCells).toBe(0);
      });

      it("returns 0 if there are no columns in the table", function() {
        const numRows = generateIntegerBetween(50, 100);
        const rowIds = generateArrayOfRandomStrings(numRows);

        const table = new PlateyTable(rowIds, []);

        expect(table.numberOfCells).toBe(0);
      });

      it("returns the number of rows multiplied by the number of columns", function() {
        const numRows = generateIntegerBetween(50, 100);
        const rowIds = generateArrayOfRandomStrings(numRows);
        const numColumnDefinitions = generateIntegerBetween(10, 20);
        const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

        const table = new PlateyTable(rowIds, columnDefinitions);

        expect(table.numberOfCells).toBe(numRows * numColumnDefinitions);
      });
    });

    describe("get cellIds", function() {
      it("exists", function() {
        expect(this.table.cellIds).toBeDefined();
      });

      it("returns an array", function() {
        expect(this.table.cellIds instanceof Array).toBe(true);
      });

      it("the array contains the same number of elements as the number of cells",
         function() {
           const numberOfCells = this.table.numberOfCells;

           expect(this.table.cellIds.length).toBe(numberOfCells);
         });

      it("each element of the array has a rowId property", function() {
        this.table.cellIds.forEach(cellId => {
          expect(cellId.rowId).toBeDefined();
        });
      });

      it("the rowId property of each element is a string", function() {
        this.table.cellIds.forEach(cellId => {
          expect(typeof cellId.rowId).toBe("string");
        });
      });

      it("each element of the array has a columnId property", function() {
        this.table.cellIds.forEach(cellId => {
          expect(cellId.columnId).toBeDefined();
        });
      });

      it("the columnId property of each element is a string", function() {
        this.table.cellIds.forEach(cellId => {
          expect(typeof cellId.columnId).toBe("string");
        });
      });

      it("the rowId property of each element contains a rowId that is one of the rowIds provided through the constructor",
         function() {
           const numRows = generateIntegerBetween(50, 100);
           const rowIds = generateArrayOfRandomStrings(numRows);

           const table = constructPlateyInstanceWithRowIds(rowIds);

           const cellRowIds = table.cellIds.map(cellId => cellId.rowId);

           cellRowIds.forEach(cellRowId => {
             expect(rowIds.indexOf(cellRowId)).not.toBe(-1);
           });
         });

      it("the columnId property of each element contains a columnId that is one of the columnIds provided through the constructor",
         function() {
           const numColumns = generateIntegerBetween(50, 100);
           const columnDefinitions = generateRandomColumnDefinitions(numColumns);

           const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

           const providedColumnIds = columnDefinitions.map(columnDefinition => columnDefinition.id);
           const returnedColumnIds = table.cellIds.map(cellId => cellId.columnId);

           returnedColumnIds.forEach(returnedColumnId => {
             expect(providedColumnIds.indexOf(returnedColumnId)).not.toBe(-1);
           });
         });
    });

    describe("get cellData", function() {
      it("exists", function() {
        expect(this.table.cellData).toBeDefined();
      });

      it("returns an array", function() {
        expect(this.table.cellData instanceof Array).toBe(true);
      });

      it("returns an array containing as many elements as cells in the table",
         function() {
           const numberOfCellsInTable = this.table.numberOfCells;

           expect(this.table.cellData.length).toBe(numberOfCellsInTable);
         });

      it("each element of the array has an id property", function() {
        this.table.cellData.forEach(cellDataEntry => {
          expect(cellDataEntry.id).toBeDefined();
        });
      });

      it("the id is a CellId, which has a rowId and columnId respectively", function() {
        this.table.cellData.forEach(cellDataEntry => {
          expect(cellDataEntry.id.rowId).toBeDefined();
          expect(cellDataEntry.id.columnId).toBeDefined();
        });
      });

      it("each element of the array has a data property", function() {
        this.table.cellData.forEach(cellDataEntry => {
          expect(cellDataEntry.data).toBeDefined();
        });
      });

      it("the data property is an object", function() {
        this.table.cellData.forEach(cellDataEntry => {
          expect(cellDataEntry instanceof Object).toBe(true);
        });
      });

      it("the data object has keys for each columnId provided through the constructor", function() {
        const numColumnDefinitions = generateIntegerBetween(10, 20);
        const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

        const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

        const providedColumnIds = columnDefinitions.map(columnDefinition => columnDefinition.id);

        table.cellData.forEach(cellDataEntry => {
          expect(providedColumnIds.indexOf(cellDataEntry.id.columnId)).not.toBe(-1);
        });
      });
    });

    describe("selectColumnById", function() {
      it("exists", function() {
        expect(this.table.selectColumnById).toBeDefined();
      });

      it("is a function", function() {
        expect(typeof this.table.selectColumnById).toBe("function");
      });

      it("takes a column ID as a parameter", function() {
        const numColumnDefinitions = generateIntegerBetween(10, 20);
        const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

        const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

        // Shouldn't throw
        columnDefinitions
        .map(columnDefinition => columnDefinition.id)
        .forEach(id => table.selectColumnById(id));
      });

      it("shouldn't throw if the ID is invalid", function() {
        const idDefinitelyNotInTable = generateRandomString();

        // Shouldn't throw
        this.table.selectColumnById(idDefinitelyNotInTable);
      });

      it("should select the column, making it appear in `get selectedColumnIds", function() {
        const numColumnDefinitions = generateIntegerBetween(10, 20);
        const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

        const columnIdToSelect = getRandomElementInArray(columnDefinitions).id;

        const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

        // Sanity check - shouldn't initially be selected
        expect(table.selectedColumnIds.indexOf(columnIdToSelect)).toBe(-1);

        table.selectColumnById(columnIdToSelect);

        expect(table.selectedColumnIds.indexOf(columnIdToSelect)).not.toBe(-1);
      });
    });

    describe("selectColumnsById", function() {
      it("exists", function() {
        expect(this.table.selectColumnsById).toBeDefined();
      });

      it("is a function", function() {
        expect(typeof this.table.selectColumnsById).toBe("function");
      });

      it("accepts an array of column ids", function() {
        const numColumnDefinitions = generateIntegerBetween(10, 20);
        const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

        const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

        // Shouldn't throw
        table.selectColumnsById(columnDefinitions.map(columnDefinition => columnDefinition.id));
      });

      it("shouldn't throw if the ID isn't a valid column definition id", function() {
        const anIdThatIsntAColumnId = generateRandomString();

        // Shouldn't throw
        this.table.selectColumnsById([anIdThatIsntAColumnId]);
      });

      it("should add all the specified columnIds to the selectedColumnIds getter", function() {
        const numColumnDefinitions = generateIntegerBetween(10, 20);
        const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);
        const allColumnIds = columnDefinitions.map(columnDefinition => columnDefinition.id);

        const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

        table.selectColumnsById(allColumnIds);

        const selectedColumns = table.selectedColumnIds;

        expect(selectedColumns.length).toBe(allColumnIds.length);

        allColumnIds.forEach(specifiedColumnId => {
          expect(selectedColumns.indexOf(specifiedColumnId)).not.toBe(-1);
        });
      });
    });

    describe("get selectedColumnIds", function() {
      it("exists", function() {
        expect(this.table.selectedColumnIds).toBeDefined();
      });

      it("returns an array", function() {
        expect(this.table.selectedColumnIds instanceof Array).toBe(true);
      });

      it("initially returns an empty array", function() {
        expect(this.table.selectedColumnIds.length).toBe(0);
      });

      it("returns a non-empty array after a column has been selected", function() {
        const numColumnDefinitions = generateIntegerBetween(10, 20);
        const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

        const columnIdToSelect = getRandomElementInArray(columnDefinitions).id;

        const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

        table.selectColumnById(columnIdToSelect);

        expect(table.selectedColumnIds.length).not.toBe(0);
      });

      it("returns an array containing the selected column ID after selecting a column", function() {
        const numColumnDefinitions = generateIntegerBetween(10, 20);
        const columnDefinitions = generateRandomColumnDefinitions(numColumnDefinitions);

        const columnIdToSelect = getRandomElementInArray(columnDefinitions).id;

        const table = constructPlateyInstanceWithColumnDefinitions(columnDefinitions);

        table.selectColumnById(columnIdToSelect);

        expect(table.selectedColumnIds.indexOf(columnIdToSelect)).not.toBe(-1);
      });
    });
  });
});