import {PlateyParser} from "./PlateyParser";
import {PlateyLexer} from "./PlateyLexer";

export class PlateyScript {

  static eval(text: string, ...scopes: any[]) {
    function evalAST(ast: any): any {

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
            let f, funcArgs;
            [f, ...funcArgs] = ast.elements.map(evalAST);
            return f.execute(...funcArgs);
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

        case PlateyParser.STRING:
          return ast.text;

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

  static getFirstSymbolName(expr: string): string {

    function getFirstSymbol(ast: any): string {

      switch (ast.type) {

        case PlateyParser.PROGRAM:
          let symbol;
          for (let i = 0, len = ast.body.length; i < len; i++) {
            const sexp = ast.body[i];
            symbol = getFirstSymbol(sexp);

            if (symbol !== undefined)
              return symbol;
          }

        case PlateyParser.SEXP:
          return getFirstSymbol(ast.body);

        case PlateyParser.LIST:
          let listSymbol;
          for (let i = 0, len = ast.elements.length; i < len; i++) {
            const sexp = ast.elements[i];
            listSymbol = getFirstSymbol(sexp);
            if (listSymbol !== undefined)
              return listSymbol;
          }

        case PlateyParser.SYMBOL:
          return ast.text;

        default:
          throw "Unknown AST node encountered when walking an AST";
      }
    }

    const lexer = new PlateyLexer();
    const parser = new PlateyParser();
    const tokens = lexer.lex(expr);
    const ast = parser.parse(tokens);

    return getFirstSymbol(ast);
  }
}