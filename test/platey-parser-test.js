import { PlateyLexer } from "../src/core/scripting/PlateyLexer";
import { PlateyParser } from "../src/core/scripting/PlateyParser";

describe("PlateyParser", function() {

  describe("constructor", function() {
    it("exists", function() {
      expect(PlateyParser).toBeDefined();
    });

    it("is a function", function() {
      expect(typeof PlateyParser).toBe("function");
    });

    it("works without any arguments", function() {
      expect(() => new PlateyParser()).not.toThrow();
    });
  });

  describe("parse", function() {
    beforeEach(function() {
      this.lexer = new PlateyLexer();
      this.parser = new PlateyParser();
    });

    it("exists", function() {
      expect(this.parser.parse).toBeDefined();
    });

    it("is a function", function() {
      expect(typeof this.parser.parse).toBe("function");
    });

    it("accepts an array of tokens", function() {
      const tokens = this.lexer.lex("(f x)");

      expect(() => this.parser.parse(tokens)).not.toThrow();
    });

    it("accepts a standalone symbol token", function() {
      const tokens = this.lexer.lex("foo");

      expect(() => this.parser.parse(tokens)).not.toThrow();
    });

    it("accepts multiple symbol tokens", function() {
      const tokens = this.lexer.lex("foo bar");

      expect(() => this.parser.parse(tokens)).not.toThrow();
    });

    it("does not throw if it recieves a list of symbols", function() {
      const tokens = this.lexer.lex("(foo bar)");

      expect(() => this.parser.parse(tokens)).not.toThrow();
    });

    it("accepts a mixture of lists and symbols", function() {
      const tokens = this.lexer.lex("a b (f x)");
      expect(() => this.parser.parse(tokens)).not.toThrow();
    });

    describe("returns", function() {
      it("an object", function() {
        const validTokens = this.lexer.lex("(f x)");
        const ret = this.parser.parse(validTokens);

        expect(ret instanceof Object).toBe(true);
      });

      it("with a type property", function() {
        const validTokens = this.lexer.lex("(f x)");

        const ret = this.parser.parse(validTokens);

        expect(ret.type).toBeDefined();
        expect(typeof ret.type).toBe("string");
      });

      it("the type of the root is a program", function() {
        const tokens = this.lexer.lex("x");
        const ret = this.parser.parse(tokens);

        expect(ret.type).toBe(PlateyParser.PROGRAM);
      });

      it("if supplied a lone symbol, the body of the program node is a lone sexp", function() {
        const tokens = this.lexer.lex("x");
        const ret = this.parser.parse(tokens);

        expect(ret.type).toBe(PlateyParser.PROGRAM);
        expect(ret.body.length).toBe(1);
        expect(ret.body[0].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.type).toBe(PlateyParser.SYMBOL);
      });

      it("if supplied a list, the body should be a list sexp with the correct number of symbols", function() {
        const tokens = this.lexer.lex("(x y z)");
        const ret = this.parser.parse(tokens);

        expect(ret.type).toBe(PlateyParser.PROGRAM);
        expect(ret.body.length).toBe(1);
        expect(ret.body[0].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.type).toBe(PlateyParser.LIST);
        expect(ret.body[0].body.elements.length).toBe(3);

        expect(ret.body[0].body.elements[0].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.elements[0].body.type).toBe(PlateyParser.SYMBOL);
        expect(ret.body[0].body.elements[0].body.text).toBe("x");

        expect(ret.body[0].body.elements[1].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.elements[1].body.type).toBe(PlateyParser.SYMBOL);
        expect(ret.body[0].body.elements[1].body.text).toBe("y");

        expect(ret.body[0].body.elements[2].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.elements[2].body.type).toBe(PlateyParser.SYMBOL);
        expect(ret.body[0].body.elements[2].body.text).toBe("z");
      });

      it("if supplied a nested list, the returned ast should contain the nested list", function() {
        const tokens = this.lexer.lex("(x (y z))");

        const ret = this.parser.parse(tokens);

        expect(ret.type).toBe(PlateyParser.PROGRAM);
        expect(ret.body.length).toBe(1);
        expect(ret.body[0].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.type).toBe(PlateyParser.LIST);
        expect(ret.body[0].body.elements.length).toBe(2);
        expect(ret.body[0].body.elements[0].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.elements[0].body.type).toBe(PlateyParser.SYMBOL);
        expect(ret.body[0].body.elements[0].body.text).toBe("x");
        expect(ret.body[0].body.elements[1].body.type).toBe(PlateyParser.LIST);
        expect(ret.body[0].body.elements[1].body.elements.length).toBe(2);
        expect(ret.body[0].body.elements[1].body.elements[0].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.elements[1].body.elements[0].body.type).toBe(PlateyParser.SYMBOL);
        expect(ret.body[0].body.elements[1].body.elements[0].body.text).toBe("y");
        expect(ret.body[0].body.elements[1].body.elements[1].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.elements[1].body.elements[1].body.type).toBe(PlateyParser.SYMBOL);
        expect(ret.body[0].body.elements[1].body.elements[1].body.text).toBe("z");
      });

      it("accepts a lone string token", function() {
        const tokens = this.lexer.lex('"a lone string"');

        const ret = this.parser.parse(tokens);

        expect(ret.type).toBe(PlateyParser.PROGRAM);
        expect(ret.body.length).toBe(1);
        expect(ret.body[0].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.type).toBe(PlateyParser.STRING);
        expect(ret.body[0].body.text).toBe("a lone string");
      });

      it("accepts a string token within a list", function() {
        const tokens = this.lexer.lex('(x y "str")');

        const ret = this.parser.parse(tokens);

        expect(ret.type).toBe(PlateyParser.PROGRAM);
        expect(ret.body.length).toBe(1);
        expect(ret.body[0].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.type).toBe(PlateyParser.LIST);
        expect(ret.body[0].body.elements.length).toBe(3);
        expect(ret.body[0].body.elements[2].type).toBe(PlateyParser.SEXP);
        expect(ret.body[0].body.elements[2].body.type).toBe(PlateyParser.STRING);
        expect(ret.body[0].body.elements[2].body.text).toBe("str");
      });
    });
  });
});
