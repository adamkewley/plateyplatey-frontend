// From http://stackoverflow.com/questions/14594497/how-to-prevent-angularjs-from-making-lowercase-html-attributes
import {IAttributes, IScope} from "angular";

export const vbox = [function() {
  return {
    link: function(scope: IScope, element: JQuery, attrs: IAttributes) {
      attrs.$observe('vbox', function(value: string) {
        if (value !== "")
          element.attr('viewBox', value);
      })
    }
  };
}];