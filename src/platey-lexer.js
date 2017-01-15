/**
 * Platey expression parser. LL(1) recursive-descent style. Grammar
 * rules are:
 *
 * program -> sexp* empty
 * sexp -> symbol | list | string
 * list -> '(' sexp* ')'
 * symbol -> start rest
 * start -> [A-Za-z\.]
 * rest -> start | [1-9\-_+-*]
 * string -> '"' ( ~'"' | '\' '"' ) '"'
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
      else if (ch === '"')
        this._readString();
      else if (this._isWhitespace(ch))
        this.index++; // Discard
      else throw `Unexpected character, ${ch}, enountered at index ${this.index}`;
    }

    return this.tokens;
  }

  _isSymbolStart(ch) { return ch.match(/[A-Za-z\.]/); }

  _isWhitespace(ch) { return ch.match(/[ \n\t]/); }

  _isSymbolCharacter(ch) { return ch.match(/[A-Za-z\.1-9\-\+\*_/]/); }

  _readString() {
    const tokenStart = this.index;
    const stringStart = this.index + 1;

    let previous = "";
    let len = 0;

    this.index++; // skip the opening quote

    for (; this.index < this.text.length; this.index++, len++) {
      const current = this.text.charAt(this.index);

      if (current === '"' && previous !== "\\") {
        this.index++; // skip closing quote
        const stringContent = this.text.substring(stringStart, stringStart + len);
        this.tokens.push({ index: tokenStart, text: stringContent, isString: true });
        return;
      }

      previous = current;
    }
  }

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