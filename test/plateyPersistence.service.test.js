import angular from "lib/angular";
import "lib/angular-mocks";
import { Validator } from "lib/jsonschema";
import "platey";

describe("plateyAPI", function() {
  let plateyPersistence, $httpBackend;

  beforeEach(angular.mock.module("apitypes"));

  beforeEach(inject(function($injector) {
    fixture.setBase("src/documents");
    const defaultDocument = fixture.load("default.json");
    $httpBackend = $injector.get("$httpBackend");
    $httpBackend.when("GET", "documents/default.json").respond(defaultDocument);

    fixture.setBase("src/configurations");
    const defaultConfiguration = fixture.load("default.json");
    $httpBackend.when("GET", "configurations/default.json").respond(defaultConfiguration);
    plateyPersistence = $injector.get("plateyPersistence");
  }));

  function isPromise(p) {
    return p.then !== undefined;
  }

  it("exists", function() {
    expect(plateyPersistence).toBeDefined();
  });

  describe("fetchConfiguration", function() {
    it("exists", function() {
      expect(plateyPersistence.fetchConfiguration).toBeDefined();
    });

    it("is a function", function() {
      expect(typeof plateyPersistence.fetchConfiguration).toBe("function");
    });

    it("when called, returns a promise", function() {
      const ret = plateyPersistence.fetchConfiguration();
      expect(isPromise(ret)).toBe(true);
    });

    it("the promise resolves with an object", function(done) {
      const p = plateyPersistence.fetchConfiguration();

      p.then(ret => {
        expect(ret).toBeDefined();
        expect(typeof ret).toBe("object");
        done();
      });

      $httpBackend.flush();
    });

    it("the resolved object has a configuration schema", function(done) {
      plateyPersistence
        .fetchConfiguration()
        .then(conf => {
          assertHasConfigurationSchema(conf);
          done();
        });

      $httpBackend.flush();
    });

    function assertHasConfigurationSchema(configurationObj) {
      const expectations = [
        { key: "keybinds", type: "object" },
        { key: "defaultPlateTemplateId", type: "string" },
        { key: "defaultDocument", type: "string" }
      ];

      expectations.forEach(expectation => {
        expect(configurationObj[expectation.key]).toBeDefined();
        expect(typeof configurationObj[expectation.key]).toBe(expectation.type);
      });
    }
  });

  describe("fetchDocument", function() {
    let documentSchema;

    beforeEach(inject(function($injector) {
      fixture.setBase("src/schemas");
      documentSchema = fixture.load("plateydocument.json");
    }));

    it("exists", function() {
      expect(plateyPersistence.fetchDocument).toBeDefined();
    });

    it("is a function", function() {
      expect(typeof plateyPersistence.fetchDocument).toBe("function");
    });

    const EXAMPLE_DOCUMENT_ID = "default.json";

    it("takes a document id as an argument", function() {
      expect(function() {
        plateyPersistence.fetchDocument(EXAMPLE_DOCUMENT_ID);
      }).not.toThrow();
    });

    it("returns a promise", function() {
      const ret = plateyPersistence.fetchDocument(EXAMPLE_DOCUMENT_ID);

      expect(isPromise(ret)).toBe(true);
    });

    it("the promise resolves with an object", function(done) {
      const ret = plateyPersistence.fetchDocument(EXAMPLE_DOCUMENT_ID);

      ret.then(document => {
        expect(typeof document).toBe("object");
        done();
      });

      $httpBackend.flush();
    });

    it("the object follows the platey document schema", function(done) {
      const validator = new Validator();

      const promise = plateyPersistence.fetchDocument(EXAMPLE_DOCUMENT_ID);

      promise.then(defaultDocument => {
        const validatorResult = validator.validate(defaultDocument, documentSchema);
        expect(validatorResult.errors.length).toBe(0);
        done();
      });

      $httpBackend.flush();
    });
  });
});
