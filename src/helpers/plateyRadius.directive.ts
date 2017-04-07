import {IAttributes, IScope} from "@types/angular";

export const plateyRadius = [() => {
  return {
    link: <IDirectiveLinkFn>(scope: IScope, el: JQuery, attrs: IAttributes) => {
      attrs.$observe("plateyRadius", (val: string) => {
        if (val !== "") el.attr("r", val);
      });
    }
  };
}];