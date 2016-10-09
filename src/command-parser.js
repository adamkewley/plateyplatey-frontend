/**
 * Platey expression parser. LL(1) recursive-descent style. Grammar
 * rules are:
 *
 * program -> sexp* empty
 * sexp -> symbol | list
 * list -> '(' sexp* ')'
 * symbol -> letter rest
 * letter -> [A-Za-z]
 * rest -> letter | [1-9\-_+-*]
 *
 * Only lists/symbols are supported. This is not a full lisp grammar
 * implementation.
 */

class PlateyLexer {
  lex(text) {
    this.text = text;
    this.index = 0;
    this.tokens = [];

    while (this.index < this.text.length) {
      const ch = this.text.charAt(this.index);

      if (ch === "(" || ch === ")") {
        this.tokens.push({ index: this.index, text: ch });
        this.index++;
      } else if (this._isSymbolStart(ch))
        this._readSymbol();
      else if (this._isWhitespace(ch))
        this.index++; // Discard
      else throw `Unexpected character, ${this.ch}, enountered at index ${this.index}`;
    }

    return this.tokens;
  }

  _isSymbolStart(ch) { return ch.match(/[A-Za-z]/); }

  _isWhitespace(ch) { return ch.match(/[ \n\t]/); }

  _isSymbolCharacter(ch) { return ch.match(/[A-Za-z1-9\-\+\*_/]/); }

  _readSymbol() {
    const start = this.index;

    while (this.index < this.text.length) {
      const ch = this.text.charAt(this.index);

      if (this._isSymbolCharacter(ch)) {
         this.index++;
      } else break;
    }

    const end = this.index;

    const symbolText = this.text.slice(start, end);

    this.tokens.push({ index: start, text: symbolText, isSymbol: true });
  }
}

class PlateyParser {
  parse(tokens) {
    this._tokens = tokens;

    const ast = this._program();

    if(this._tokens.length > 0)
      throw "Unexepcted tokens remaining after parsing a platey expression";
    else return ast;
  }

  _program() {
    const body = [];

    while (true) {
      if (this._tokens.length > 0) {
        if (this._peek(")"))
          throw "Mis-matched parenthesis encountered when parsing the expression";
        else body.push(this._sexp());
      } else return { type: PlateyParser.PROGRAM, body: body };
    }
  }

  _sexp() {
    const body = this._peek("(") ? this._list() : this._symbol();

    return { type: PlateyParser.SEXP, body: body };
  }

  _list() {
    const body = [];

    this._consume("(");

    while (true) {
      if (this._tokens.length === 0)
        throw "Parse error: Unexpected end of expression when parsing a list";
      else if (this._peek(")")) {
        this._consume(")");
        break;
      } else body.push(this._sexp());
    }

    return { type: PlateyParser.LIST, elements: body };
  }

  _symbol() {
    const token = this._peekToken();

    if (token.isSymbol) {
      this._tokens.shift();
      return { type: PlateyParser.SYMBOL, text: token.text };
    } else throw "Parse error: Unexpected token encountered when parsing a symbol.";
  }

  _consume(str) {
    const token = this._tokens.shift();

    if (token.text === str)
      return true;
    else throw "Unexpected token encountered when shifting " + str;
  }

  _peekToken() {
    if (this._tokens.length === 0)
      throw "Parse error: Unexpected end of expression";
    else return this._tokens[0];
  }

  _peek(str) {
    const token = this._peekToken();

    return token.text === str;
  }
}

PlateyParser.PROGRAM = "program";
PlateyParser.SEXP = "sexp";
PlateyParser.LIST = "list";
PlateyParser.SYMBOL = "symbol";

function plateyEval(text, ...scopes) {
  function evalAST(ast) {
    switch (ast.type) {
      case PlateyParser.PROGRAM:
      if (ast.body.length > 0) {
        const results = ast.body.map(evalAST);
        return results[results.length - 1];
      } else return undefined;

      case PlateyParser.SEXP:
      return evalAST(ast.body);

      case PlateyParser.LIST:
      if (ast.elements.length === 0)
        return undefined;
      else {
        [f, ...funcArgs] = ast.elements.map(evalAST);
        return f.apply(null, funcArgs);
      }

      case PlateyParser.SYMBOL:
      const symbolText = ast.text;
      let symbolValue;

      // Scopes are right-priority
      for (let len = scopes.length, i = len - 1; i >= 0; i--) {
        let scope = scopes[i];

        if (scope[symbolText] !== undefined) {
          symbolValue = scope[symbolText];
          break;
        }
      }

      if (symbolValue === undefined)
        throw "Symbol, " + symbolText + ", is void";
      else return symbolValue;

      default:
      throw "Unknown AST node encountered when walking an AST";
    }
  }

  const lexer = new PlateyLexer();
  const parser = new PlateyParser();

  const tokens = lexer.lex(text);
  const ast = parser.parse(tokens);

  return evalAST(ast);
}

function getFirstSymbolName(text) {
  function getFirstSymbol(ast) {
    switch(ast.type) {
      case PlateyParser.PROGRAM:
      let symbol;
      for (let i = 0, len = ast.body.length; i < len; i++) {
        const sexp = ast.body[i];
        symbol = getFirstSymbol(sexp);
        if (symbol !== undefined) break;
      }
      return symbol;

      case PlateyParser.SEXP:
      return getFirstSymbol(ast.body);

      case PlateyParser.LIST:
      let listSymbol;
      for (let i = 0, len = ast.elements.length; i < len; i++) {
        const sexp = ast.elements[i];
        listSymbol = getFirstSymbol(sexp);
        if (listSymbol !== undefined) break;
      }
      return listSymbol;

      case PlateyParser.SYMBOL:
      return ast.text;

      default:
      throw "Unknown AST node encountered when walking an AST";
    }
  }

  const lexer = new PlateyLexer();
  const parser = new PlateyParser();
  const tokens = lexer.lex(text);
  const ast = parser.parse(tokens);

  return getFirstSymbol(ast);
}