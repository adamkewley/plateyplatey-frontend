/**
 * Create a range from the supplied number.
 */
export const rangeFilter = [function() {
  return function(val, range) {
    range = parseInt(range);
    for (var i=0; i<range; i++)
      val.push(i);
    return val;
  };
}];
