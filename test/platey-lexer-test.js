import PlateyLexer from "scripting/platey-lexer";

describe("PlateyLexer", function() {
  it("Exists", function() {
    expect(PlateyLexer).toBeDefined();
  });

  it("is a functiono", function() {
    expect(typeof PlateyLexer).toBe("function");
  });

  it("can be constructed with no parameters", function() {
    expect(() => new PlateyLexer()).not.toThrow();
  });

  describe("upon construction", function() {
    beforeEach(function() {
      this.lexer = new PlateyLexer();
    });

    describe("lex method", function() {

      it("exists", function() {
        expect(this.lexer.lex).toBeDefined();
      });

      it("is a function", function() {
        expect(typeof this.lexer.lex).toBe("function");
      });

      it("takes a string", function() {
        expect(() => this.lexer.lex("(a)")).not.toThrow();
      });

      it("returns an array", function() {
        expect(this.lexer.lex("(a)") instanceof Array).toBe(true);
      });

      it("throws if the text input is malformed", function() {
        const malformedText = "$"; // the $ symbol isn't supported

        expect(() => this.lexer.lex(malformedText)).toThrow();
      });

      it("returns a ( text token for an opening parenthesis", function() {
        const ret = this.lexer.lex("(");

        expect(ret.length).toBe(1);
        expect(ret[0].text).toBeDefined();
        expect(ret[0].text).toBe("(");
      });

      it("returns an index for the opening parenthesis", function() {
        const ret = this.lexer.lex("(");

        expect(ret.length).toBe(1);
        expect(ret[0].index).toBeDefined();
        expect(ret[0].index).toBe(0);
      });

      it("returns a ) text token for a closing parenthesis", function() {
        const ret = this.lexer.lex(")");

        expect(ret.length).toBe(1);
        expect(ret[0].text).toBeDefined();
        expect(ret[0].text).toBe(")");
      });

      it("returns an index for the closing parenthesis", function() {
        const ret = this.lexer.lex(")");

        expect(ret.length).toBe(1);
        expect(ret[0].index).toBeDefined();
        expect(ret[0].index).toBe(0);
      });

      it("returns a symbol token for a symbol", function() {
        const symbol = "foo";
        const ret = this.lexer.lex(symbol);

        expect(ret.length).toBe(1);
        expect(ret[0].isSymbol).toBe(true);
        expect(ret[0].text).toBe(symbol);
      });

      it("returns the index at the start of the symbol", function() {
        const symbol = "foo";
        const ret = this.lexer.lex(symbol);

        // Sanity
        expect(ret.length).toBe(1);
        expect(ret[0].isSymbol).toBe(true);
        expect(ret[0].index).toBeDefined();
        expect(ret[0].index).toBe(0);
      });

      it("returns two tokens for a parenthesis pair", function() {
        const ret = this.lexer.lex("()");

        expect(ret.length).toBe(2);
        expect(ret[0].index).toBeDefined();
        expect(ret[0].index).toBe(0);
        expect(ret[0].text).toBeDefined();
        expect(ret[0].text).toBe("(");
        expect(ret[1].index).toBeDefined();
        expect(ret[1].index).toBe(1);
        expect(ret[1].text).toBeDefined();
        expect(ret[1].text).toBe(")");
      });

      it("returns three tokens for a single-element list expression", function() {
        const expr = "(foo)";
        const ret = this.lexer.lex(expr);

        expect(ret.length).toBe(3);
        expect(ret[0].index).toBe(0);
        expect(ret[0].text).toBe("(");
        expect(ret[1].index).toBe(1);
        expect(ret[1].isSymbol).toBe(true);
        expect(ret[1].text).toBe("foo");
        expect(ret[2].index).toBe(4);
        expect(ret[2].text).toBe(")");
      });

      it("does not count whitespace", function() {
        const expr = "( foo )";
        const ret = this.lexer.lex(expr);

        expect(ret.length).toBe(3);
        expect(ret[0].index).toBe(0);
        expect(ret[0].text).toBe("(");
        expect(ret[1].index).toBe(2);
        expect(ret[1].text).toBe("foo");
        expect(ret[1].isSymbol).toBe(true);
        expect(ret[2].index).toBe(6);
        expect(ret[2].text).toBe(")");
      });

      it("allows hyphens in symbols", function() {
        const symbol = "hello-world";
        const ret = this.lexer.lex(symbol);

        expect(ret.length).toBe(1);
        expect(ret[0].text).toBe(symbol);
      });

      it("accepts string literals", function() {
        const symbol = '"foo"';

        const ret = this.lexer.lex(symbol);

        expect(ret.length).toBe(1);
        expect(ret[0].index).toBe(0);
        expect(ret[0].isString).toBe(true);
        expect(ret[0].text).toBe("foo");
      });

      it("accepts string literals, even if they appear in lists", function() {
        const expr = '(f "foo")';
        const ret = this.lexer.lex(expr);

        expect(ret.length).toBe(4);
        expect(ret[2].isString).toBe(true);
        expect(ret[2].text).toBe("foo");
      });

      it("allows for blank strings", function() {
        const expr = '""';
        const ret = this.lexer.lex(expr);

        expect(ret.length).toBe(1);
        expect(ret[0].isString).toBe(true);
        expect(ret[0].index).toBe(0);
        expect(ret[0].text).toBe("");
      });

      it("allows symbols beggining with a period", function() {
        const expr = ".";
        let ret;

        expect(() => ret = this.lexer.lex(expr)).not.toThrow();

        expect(ret.length).toBe(1);
        expect(ret[0].index).toBe(0);
        expect(ret[0].isSymbol).toBe(true);
      });
    });
  });
});
