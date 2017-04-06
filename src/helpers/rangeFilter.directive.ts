/**
 * Create a range from the supplied number.
 */
export const rangeFilter = [function() {
  return function(val: number[], range: string) {
    const parsedRange = parseInt(range);
    for (var i=0; i<parsedRange; i++)
      val.push(i);
    return val;
  };
}];
