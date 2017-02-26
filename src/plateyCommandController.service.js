import Rx from "rxjs";
import plateyEval from "platey-lang/platey-eval";

export default [
  function() {
    const afterExecPlateyExpressionSubject = new Rx.Subject();

    this.executePlateyExpression = function(plateyExpression, ...scopes) {
      plateyEval(plateyExpression, ...scopes);

      afterExecPlateyExpressionSubject.onNext(plateyExpression);
    };

    this.onAfterExecutingPlateyExpression = afterExecPlateyExpressionSubject;
  }];
