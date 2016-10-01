const plateyModule = angular.module("plateyApp", ["plateyController"]);

/**
 * Create a range from the supplied number.
 */
plateyModule.filter("range", function() {
  return function(val, range) {
    range = parseInt(range);
    for (var i=0; i<range; i++)
      val.push(i);
    return val;
  };
});

// From http://stackoverflow.com/questions/14594497/how-to-prevent-angularjs-from-making-lowercase-html-attributes
plateyModule.directive('vbox', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('vbox', function(value) {
        element.attr('viewBox', value);
      })
    }
  };
});