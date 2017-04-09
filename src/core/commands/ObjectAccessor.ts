import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class ObjectAccessor implements Command {

  id = ".";
  title = "Access Property";
  description = "Access the property of an object";
  disabledSubject = new BehaviorSubject<DisabledMessage>({ isDisabled: false });

  constructor() {}

  execute(instance: any, memberSymbol: string, args: any[]) {
    const member = instance[memberSymbol];

    if (member !== undefined && args !== undefined) {
      return member.apply(member, args);
    } else return member;
  }
}
