import {BehaviorSubject} from "rxjs";
import {DisabledMessage} from "./DisabledMessage";

export interface Command {
    id: string;
    title: string;
    description: string;
    execute: (e: any, ...args: any[]) => any;
    disabledSubject: BehaviorSubject<DisabledMessage>;
}