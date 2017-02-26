/**
 * Create a range from the supplied number.
 */
export default [function() {
  return function(val, range) {
    range = parseInt(range);
    for (var i=0; i<range; i++)
      val.push(i);
    return val;
  };
}];
