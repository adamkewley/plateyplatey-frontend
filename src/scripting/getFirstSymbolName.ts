import {PlateyLexer} from "./PlateyLexer";
import {PlateyParser} from "./PlateyParser";

export default function getFirstSymbolName(text: string): string {

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
    const tokens = lexer.lex(text);
    const ast = parser.parse(tokens);

    return getFirstSymbol(ast);
}
