angular
.module("plateyKeyup", [])
.directive("plateyKeyup", function() {
  function link(scope, element, attrs) {
    const el = element[0];
    const expr = attrs.plateyKeyup;

    el.addEventListener("keyup", (e) => {
      scope.$apply(() => {
        scope.exec(expr, scope, scope.commands, { "e": e });
      });
    });
  }

  return { link: link };
});