import {Subject} from "rxjs";
import plateyEval from "./scripting/plateyEval";

export class PlateyCommandController {

  afterExecPlateyExpression: Subject<string>;

  constructor() {
    this.afterExecPlateyExpression = new Subject();
  }

  executePlateyExpression(plateyExpression: string, ...scopes: object[]) {
    plateyEval(plateyExpression, ...scopes);

    this.afterExecPlateyExpression.next(plateyExpression);
  };
}