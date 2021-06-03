// Array functions (map, filter, reduce, forEach)
// These are functions that have been in the JavaScript API for a long time.
// They are a way to iterate over an array, performing some operation.
//
// They always take a callback (a lambda in these examples) with the code
// that will execute for every element.
//
// You can always use a for loop to achieve the same effect, but these
// functions can be more readable.

let a = [1, 2, 3, 4, 5, 6];
let b: number[]; // I'll reuse this in examples


// 1. map
// This function maps the values of array into another.
// For every element in `a`, multiply it by 2 and add it into a new array `b`
b = a.map(x => x * 2);
// b => [2, 4, 6, 8, 10, 12];

// If you need the index of the element as well you can get it as an argument.
b = a.map((x, index) => x * index);
// b => [0, 2, 6, 12, 20, 30];

// To 'demistify' these functions, here is how you could implement your own map
function myMap(src: any[], fn: (x: any, i?: number) => any): any[] {
  const dst: any[] = [];
  for (let i = 0; i < src.length; i++) {
    dst.push(fn(src[i], i));
  }
  return dst;
}
b = myMap(a, x => x * 2);
// b => [2, 4, 6, 8, 10, 12];


// 2. filter
// This function iterates through all elements in 'a' and compares it to some
// condition (defined in the lambda), and only pushes the elements that satisfy
// the condition into 'b'
// In this case we will filter only even numbers into b
b = a.filter(x => x % 2 === 0);
// b => [2, 4, 6, 8, 10, 12];

// Again here is how filter may be implemented, this time using generics
// instead of 'any'.
function myFilter<T>(src: T[], fn: (x: T) => boolean): T[] {
  const dst: T[] = [];
  for (const x of src) {
    if (fn(x)) {
      dst.push(x);
    }
  }
  return dst;
}
b = myFilter(a, x => (x & 1) === 0);
// b => [2, 4, 6, 8, 10, 12];


// 3. reduce.
// This function 'reduces' all elements from an array into a single value.
// Here's an example that sums all elements in a.
const sum = a.reduce((x, y) => x + y);


// 4. forEach
// This one is literally just a for loop, it iterates through all elements
// and calls your function with the value. It does not return anything like
// the other functions.
// This prints all values of a
a.forEach(x => console.log(x));


// Exporting something to supress warnings
export let tmp = 0;
