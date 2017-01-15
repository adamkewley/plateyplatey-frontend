angular.module("plateyRadius", []).directive("plateyRadius", () => {
  return {
    link: (scope, el, attrs) => {
      attrs.$observe("plateyRadius", (val) => {
        if (val !== "") el.attr("r", val);
      });
    }
  };
});