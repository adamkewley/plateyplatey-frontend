import Rx from "lib/rxjs";
import plateyEval from "platey-lang/platey-eval";

export default [
  function() {
    const afterExecPlateyExpressionSubject = new Rx.Subject();

    this.executePlateyExpression = function(plateyExpression, ...scopes) {
      plateyEval(plateyExpression, ...scopes);

      afterExecPlateyExpressionSubject.next(plateyExpression);
    };

    this.onAfterExecutingPlateyExpression = afterExecPlateyExpressionSubject;
  }];
