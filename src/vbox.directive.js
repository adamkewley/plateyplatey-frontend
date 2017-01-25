// From http://stackoverflow.com/questions/14594497/how-to-prevent-angularjs-from-making-lowercase-html-attributes
angular.module("vbox", []).directive('vbox', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('vbox', function(value) {
        if (value !== "")
          element.attr('viewBox', value);
      })
    }
  };
});