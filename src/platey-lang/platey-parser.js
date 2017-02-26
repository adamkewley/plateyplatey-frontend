/**
 * Resursive-descent LR(1) parser.
 */
export default class PlateyParser {
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
    const nextToken = this._peekToken();
    let body;

    if (nextToken.isString) body = this._string();
    else if (nextToken.text === "(") body = this._list();
    else body = this._symbol();

    return { type: PlateyParser.SEXP, body: body };
  }

  _string() {
    const token = this._peekToken();

    if (token.isString) {
      this._tokens.shift();
      return { type: PlateyParser.STRING, text: token.text };
    }
    else throw "Parse error: Unexpected token encountered when parsing a string";
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
PlateyParser.STRING = "string";
