export function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  
  return a;
}

export function moveItemInArray(array, old_index, new_index) {
  if (new_index >= array.length) {
    var k = new_index - array.length;
    while ((k--) + 1) {
      array.push(undefined);
    }
  }
  array.splice(new_index, 0, array.splice(old_index, 1)[0]);
  return array; // for testing purposes
}

export function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

// These are used instead of directly using .key because a) it's
// easier to understand what's going on and b) browsers are
// inconsistient about keys (firefox: "ArrowLeft", ie: "Left")
const KEYCODES_OF_UNPRINTABLE_KEYPRESSES = {
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


/**
 * Transforms a jQueryLite keyboard event into the
 * key syntax used internally.
 */
export function eventToKeybindKey($event) {
  let modifiers = "";

  if ($event.ctrlKey)
    modifiers += "C-";

  if ($event.altKey)
    modifiers += "M-";

  const translatedKeyCode =
          KEYCODES_OF_UNPRINTABLE_KEYPRESSES[$event.keyCode];

  if (translatedKeyCode === undefined)
    return modifiers + $event.key;
  else return modifiers + translatedKeyCode;
}

/**
 * Create a prompt that allows the user to save the data to a
 * location on their disk.
 *
 * @param {string} fileName - Proposed name of the file to save.
 * @param {string} contentType - The content-type of the data (e.g. "text/csv;charset=utf-8;".
 * @param {byte} data - The data to save.
 */
export function promptUserToSaveData(fileName, contentType, data) {
  const blob = new Blob([data], { type: contentType });

  // If it's shitty IE
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    const blobUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = fileName;
    downloadLink.visibility = "hidden";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}

/**
 * Copy text to the user's clipboard.
 *
 * @param {string} text - The text to copy.
 */
export function copyTextToClipboard(text) {
  const $textElement = document.createElement("textarea");
  $textElement.visibility = "hidden";
  $textElement.value = text;
  document.body.appendChild($textElement);
  $textElement.select();
  document.execCommand("copy");
  document.body.removeChild($textElement);
}

/**
 * Prompt the user to browse for files on their filesystem.
 *
 * @param {string} mimeTypes - A comma-delimited list of MIME
 * types the file dialog should filter against.
 * @param {boolean} multipleFiles - If the dialog should allow
 * the user to select multiple files.
 * @return {Promise.<Array.<File>>} A promise that will resolve
 * with the selected files after the user clicks OK in the file
 * dialog. The promise will reject if the user cancels out of the
 * dialog.
 */
export function promptUserForFiles(mimeTypes = "", allowMultipleFiles = true) {
  return $q((resolve, reject) => {
    const fileInputEl = document.createElement("input");
    if (allowMultipleFiles) fileInputEl.multiple = "multiple";
    fileInputEl.visibility = "hidden";
    fileInputEl.type = "file";
    fileInputEl.accept = mimeTypes;

    const onBodyFocus = () => {
      fileInputEl.removeEventListener("change", onChange);

      reject("User cancelled out of dialog");
    };

    const onChange = () => {
      document.removeEventListener("focus", onBodyFocus);

      if (fileInputEl.files.length === 1)
        resolve(fileInputEl.files);
      else reject("User did not select a file");
    };

    fileInputEl.addEventListener("change", onChange, false, true);
    document.addEventListener("focus", onBodyFocus, false, true);

    // Otherwise, the click will propagate upto the root click
    // handler and angular will cry
    fileInputEl.onclick = (e) => e.stopPropagation();

    document.body.appendChild(fileInputEl);

    fileInputEl.click();

    document.body.removeChild(fileInputEl);
  });
}

/**
 * Prompt the user to browse for a single file on their filesystem.
 *
 * @param {string} mimeTypes - A comma-delimited list of MIME
 * types the file dialog should filter against
 * @return {Promise.<File>} A promise that will resolve with the
 * selected file after the user clicks OK in the file dialog. The
 * promise will reject if the user cancels out of the dialog.
 */
export function promptUserForFile(mimeTypes = "") {
  return promptUserForFiles(mimeTypes, false)
    .then(files => files[0]);
}

/**
 * Reads a file's content as text.
 *
 * @param {File} file - The File object to read
 * @return {Promise.<string>} A promise that will resolve with
 * the file's content as text.
 */
export function readFileAsText(file) {
  return $q((resolve, reject) => {
    const textReader = new FileReader();
    textReader.onload = (e) => resolve(e.target.result);
    textReader.onerror = (e) => reject(e.target.error);
    textReader.readAsText(file);
  });
}

