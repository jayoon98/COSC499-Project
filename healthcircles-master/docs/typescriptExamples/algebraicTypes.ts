// These are relatively fancy things, you might not use them
// often. These are like set operations on your types
// (like in math)

// Union Types (| operator):
// These allows you to create a new type that is either type
// A or type B.

// This value can be either a string or a number.
let numOrString: number | string = 12;
numOrString = '2';

// This is commonly used to make things optionally null
// This variable is null now but might be a number later
let maybeNum: number | null = null;
// We cannot use maybeNum as a regular number until we've proven to
// the compiler that it's safe to do so. Here we can check if it's
// null.
if (maybeNum !== null) {
  console.log(maybeNum * 2);
}

// Type unions are one way implement Enums in TypeScript.
type Color =
  | 'red'
  | 'green'
  | 'blue'
  | 'purple';

// but there's also the enum keyword.
enum Color2 {
  Red,
  Green,
  Blue,
  Purple,
}
console.log(Color2.Blue);


// Intersection Types (& operator)
// These are rarely used. They allow you to create a type that is a combination
// of both A and B.
// It's basically a way to merge types together.

// Say we define a car to be a combination of a chassis and an engine
type Chassis = {
  color: Color;
  model: string;
};

type Engine = {
  horsepower: number;
  transmission: 'manual' | 'auto';
}

// Now we can combine these together into Car
type Car = Chassis & Engine;

const car: Car = {
  color: 'blue',
  model: 'xx',
  horsepower: 400,
  transmission: 'auto'
};

// Note that because of how structured typing works, you can pass Car
// into functions that only accept Chassis for example. This is not
// exclusive to intersection types.
function printColor(chassis: Chassis) {
  console.log(chassis.color);
}
printColor(car);

// Note that you can run into issues if you try to combine types that don't
// make sense together.
//
// This variable can never be assigned, it has the type 'never'
let neverVariable: number & string;


// Gets rid of warnings.
export const tmp = 0;
