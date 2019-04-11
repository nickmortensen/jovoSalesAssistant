
/**
 * Sort an Array of Objects by the value of a given key
 * Sort an array of objects by a value inside fo the objects
 * 
 * @link https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
 * @note a8m's answer
 * @param {array} array The array containing the many objects that I'd like to sort out.
 * @param {*} attrs property or properties in the order of which I'd like to sort them
 * @returns
 */
exports.sortByAttribute = (array, ...attrs) => {
  // generate an array of predicate-objects contains
  // property getter, and descending indicator
  const predicates = attrs.map((pred) => {
    const descending = pred.charAt(0) === '-' ? -1 : 1;
    const predicate  = pred.replace(/^-/, '');
    return { getter: o => o[predicate], descend: descending };
  });
  // schwartzian transform idiom implementation. aka: "decorate-sort-undecorate"
  return array.map(item => ({
    src: item,
    compareValues: predicates.map(predicate => predicate.getter(item)),
  }))
    .sort((o1, o2) => {
      let i = -1;
      let result = 0;
      while (++i < predicates.length) {
        if (o1.compareValues[i] < o2.compareValues[i]) result = -1;
        if (o1.compareValues[i] > o2.compareValues[i]) result = 1;
        if (result *= predicates[i].descend) break;
      }
      return result;
    })
    .map(item => item.src);
};
// end function sortByAttribute(array, ...attrs)
