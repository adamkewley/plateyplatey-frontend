// From http://stackoverflow.com/questions/14594497/how-to-prevent-angularjs-from-making-lowercase-html-attributes
export const vbox = [function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('vbox', function(value) {
        if (value !== "")
          element.attr('viewBox', value);
      })
    }
  };
}];