import PlateyLexer from "platey-lang/platey-lexer";
import PlateyParser from "platey-lang/platey-parser";

/**
 * Evaluate a platey expression (e.g. (f x)). Variables
 * and functions that appear in the expression are dereferenced
 * from the provided scopes.
 */
export default function plateyEval(text, ...scopes) {

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
            let f, funcArgs;
            [f, ...funcArgs] = ast.elements.map(evalAST);
            return f.apply(f, funcArgs);
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
