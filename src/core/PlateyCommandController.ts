import {Subject} from "rxjs";
import {PlateyScript} from "./scripting/PlateyScript"

export class PlateyCommandController {

  afterExecPlateyExpression: Subject<string>;

  constructor() {
    this.afterExecPlateyExpression = new Subject();
  }

  executePlateyExpression(plateyExpression: string, ...scopes: object[]) {
    PlateyScript.eval(plateyExpression, ...scopes);

    this.afterExecPlateyExpression.next(plateyExpression);
  };
}