import Rx from "lib/rxjs";
import plateyEval from "scripting/plateyEval";

export class PlateyCommandController {

  constructor() {
    this.afterExecPlateyExpression = new Rx.Subject();
  }

  executePlateyExpression(plateyExpression, ...scopes) {
    plateyEval(plateyExpression, ...scopes);

    this.afterExecPlateyExpression.next(plateyExpression);
  };
}