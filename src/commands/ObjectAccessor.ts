import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class ObjectAccessor implements Command {

  id: string;
  title: string;
  description: string;

  constructor() {
    this.id = ".";
    this.title = "Access Property";
    this.description = "Access the property of an object";
  }

  execute(instance: any, memberSymbol: string, args: any[]) {
    const member = instance[memberSymbol];

    if (member !== undefined && args !== undefined) {
      return member.apply(member, args);
    } else return member;
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
