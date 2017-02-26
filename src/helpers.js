export function shuffle(ary) {
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
