import {BehaviorSubject} from "rxjs";
import {PlateyDocument} from "./core/document/PlateyDocument";
import {DisabledMessage} from "./core/commands/DisabledMessage";

export class Helpers {

  // These are used instead of directly using .key because a) it's
  // easier to understand what's going on and b) browsers are
  // inconsistient about keys (firefox: "ArrowLeft", ie: "Left")
  private static KEYCODES_OF_UNPRINTABLE_KEYPRESSES: { [keyCode: string]: string } = {
    "8": "<backspace>",
    "9": "<tab>",
    "13": "<return>",
    "27": "<escape>",
    "33": "<prior>",
    "34": "<next>",
    "35": "<end>",
    "36": "<home>",
    "37": "<left>",
    "38": "<up>",
    "39": "<right>",
    "40": "<down>",
    "45": "<insert>",
    "46": "<delete>"
  };

  public static shuffle<T>(a: T[]): T[] {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }

    return a;
  }

  public static moveItemInArray<T>(array: T[], old_index: number, new_index: number): T[] {
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    return array; // for testing purposes
  }

  public static generateGuid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  public static eventToKeybindKey($event: KeyboardEvent): string {
    let modifiers = "";

    if ($event.ctrlKey)
      modifiers += "C-";

    if ($event.altKey)
      modifiers += "M-";

    const translatedKeyCode =
      Helpers.KEYCODES_OF_UNPRINTABLE_KEYPRESSES[$event.keyCode];

    if (translatedKeyCode === undefined)
      return modifiers + $event.key;
    else return modifiers + translatedKeyCode;
  }

  public static promptUserToSaveData(fileName: string, contentType: string, data: any): void {

    const blob = new Blob([data], { type: contentType });

    // If it's shitty IE
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      const blobUrl = URL.createObjectURL(blob);
      Helpers.clickTemporaryLink(blobUrl, fileName);
    }
  }

  public static clickTemporaryLink(url: string, fileName: string|null = null) {
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    if (fileName !== null) downloadLink.download = fileName;
    downloadLink.style.visibility = "hidden";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  public static copyTextToClipboard(text: string): void {
    const $textElement = document.createElement("textarea");
    $textElement.style.visibility = "hidden";
    $textElement.value = text;
    document.body.appendChild($textElement);
    $textElement.select();
    document.execCommand("copy");
    document.body.removeChild($textElement);
  }

  public static promptUserForFiles(mimeTypes = "", allowMultipleFiles = true): Promise<FileList> {

    return new Promise((resolve, reject) => {
      const fileInputEl = document.createElement("input");

      if (allowMultipleFiles)
        fileInputEl.multiple = true;

      fileInputEl.style.visibility = "hidden";
      fileInputEl.type = "file";
      fileInputEl.accept = mimeTypes;

      const onBodyFocus = () => {
        fileInputEl.removeEventListener("change", onChange);

        reject("User cancelled out of dialog");
      };

      const onChange = () => {
        document.removeEventListener("focus", onBodyFocus);

        if (fileInputEl.files !== null && fileInputEl.files.length === 1)
          resolve(fileInputEl.files);
        else reject("User did not select a file");
      };

      fileInputEl.addEventListener("change", onChange, false);
      document.addEventListener("focus", onBodyFocus, false);

      // Otherwise, the click will propagate upto the root click
      // handler and angular will cry
      fileInputEl.onclick = (e) => e.stopPropagation();

      document.body.appendChild(fileInputEl);

      fileInputEl.click();

      document.body.removeChild(fileInputEl);
    });
  }

  public static promptUserForFile(mimeTypes = ""): Promise<File> {
    return Helpers.promptUserForFiles(mimeTypes, false).then(files => files[0]);
  }

  public static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const textReader = new FileReader();
      textReader.onload = (e) => resolve(textReader.result);
      textReader.onerror = (e) => reject(textReader.error);
      textReader.readAsText(file);
    });
  }

  public static behaviorMap<T, R> (bh: BehaviorSubject<T>, f: (val: T) => R): BehaviorSubject<R> {
    const ret = new BehaviorSubject<R>(f(bh.getValue()));

    const subscription = bh.subscribe(
      next => { ret.next(f(next)) },
      err => { ret.error(err); },
      () => { subscription.unsubscribe(); });

    return ret;
  }

  public static disabledIfNull(bh: BehaviorSubject<PlateyDocument | null>): BehaviorSubject<DisabledMessage> {
    return Helpers.behaviorMap(bh, document => {
      if (document === null) {
        return {
          isDisabled: true,
          reason: "No document currently open"
        }
      } else {
        return { isDisabled: false };
      }
    });
  }

  static generateRandomColorHexString() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  static allArrayValuesTheSame<T>(ary: T[]) {
    for(let i = 1; i < ary.length; i++) {
      if(ary[i] !== ary[0])
        return false;
    }

    return true;
  }
}
