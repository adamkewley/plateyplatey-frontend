export interface Token {
  index: number;
  text: string;
  isSymbol?: boolean;
  isString?: boolean;
}

export class PlateyLexer {

  text: string;
  index: number;
  tokens: Token[];

  lex(text: string): Token[] {
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

  _isSymbolStart(ch: string) { return ch.match(/[A-Za-z\.]/); }

  _isWhitespace(ch: string) { return ch.match(/[ \n\t]/); }

  _isSymbolCharacter(ch: string) { return ch.match(/[A-Za-z\.1-9\-\+\*_/]/); }

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
