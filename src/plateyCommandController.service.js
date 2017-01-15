angular
.module("plateyCommandController", [])
.service("plateyCommandController", [
  function() {
    const afterExecPlateyExpressionSubject = new Rx.Subject();

    this.executePlateyExpression = function(plateyExpression, ...scopes) {
      plateyEval(plateyExpression, ...scopes);

      afterExecPlateyExpressionSubject.onNext(plateyExpression);
    };

    this.onAfterExecutingPlateyExpression = afterExecPlateyExpressionSubject;
  }]);