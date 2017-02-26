import Rx from "rxjs/Rx";

export default class ObjectAccessor {

  constructor() {
    this.id = ".";
    this.title = "Access Property";
    this.description = "Access the property of an object";
  }

  execute(instance, memberSymbol, args) {
    const member = instance[memberSymbol];

    if (member !== undefined && args !== undefined) {
      return member.apply(member, args);
    } else return member;
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}