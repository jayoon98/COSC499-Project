import React, { useState } from 'react';
import './App.css';

// Part A
//   1. const, let, var (scopes) (===)
//   2. lambdas
//   3. array deconstruction
//   4* spread operator
// Part B TS
//   1. variables, params, returns
//   2. types
//   3. optional
//   4* alegebraic types (type unions, strings as types)
//   5* structured typing
// Part C React
//   1. components (functional components) (hooks)
//   2. state + events (counter) (states are async)
//   3. todo app (exports, props and stuff)


// Structured typing: How we handle inheritance in typescript
// similar to Duck Typing: "if it walks like a duck and it quacks like a duck, then it's a duck."

// People only have names
type Person = {
  name: string;
};

// Customer have names and ids. Note we never explicitly inherited from 'Person'
type Customer = {
  name: string;
  id: number;
};

// This function only takes People.
function printName(person: Person) {
  console.log(person.name);
}

const person: Person = { name: 'Lucas' };
// As expected we can pass a Person into printName
printName(person);

// But we can also pass a customer, even though it is not directly
// declared as a person.
const customer: Customer = { name: 'Lucas', id: 0 };
// Since customer has everything that a Person has (ie a name), we can use
// it as if it were a Person. Customer is like a superset of Person, it
// has at least all fields required by Person.
printName(customer);

type TaskProps = {
  name: string;
  // onRemove is function that takes a name and returns void.
  // this is just the function type, not the actual function
  // declaration.
  onRemove: (name: string) => void;
};

// Using object deconstructor on the parameters of this function (for convenience).
// This lets us extract the fields from an object into separate variables.
// const cust = { name: 'Lucas', id: 0 };
//
// deconstructing cust into name and id
// const { name, id } = cust;
//
// Some codebases do this for props, some prefer explicitly using props.value.
function TaskCard({ name, onRemove }: TaskProps) {
  return (
    <div className="taskCard">
      {name}
      <button onClick={() => onRemove(name)}>X</button>
    </div>
  );
}

export function App() {
  // The 'as' operator is how we can cast values in typescript
  const [tasks, setTasks] = useState([] as string[]);
  const [inputText, setInputText] = useState('');

  const onInputChange = (e: any) => {
    setInputText(e.target.value);
  }

  const onAddTask = () => {
    // The spread operator lets us copy arrays and combine them
    // const a = [1, 2, 3];
    // const b = [...a, 4, 5, 6];
    // b is now equal to [1, 2, 3, 4, 5, 6];
    //
    // This can also be used with objects
    // const a = { name: 'Lucas', id: 0 };
    // const b = { ...a, id: 10 };
    // b has the same name as a, but a different value for id.
    // b is equal to { name: 'Lucas', id: 10 };
    setTasks([...tasks, inputText]);
    setInputText('');
  }

  const onRemoveTask = (name: string) => {
    // The child component calls this function and passes their
    // name. We can use the filter function to filter out the
    // task matching the name given to us. This lets us remove
    // a task from the tasks array.
    setTasks(tasks.filter(t => name !== t));
  }

  const renderTasks = () => {
    return tasks.map((t, index) => (
      // Passing the onRemoveTask function into the child component
      // as a way for the child to communicate back to the parent. We're doing
      // this because the button to remove the task is in the child component
      // and we have no direct access to it. We want the child to call
      // us back and provide some sort of identification (name) so we know which
      // child is calling us.
      //
      // Communicating between components:
      //   parent -> child: parent passes a prop to the child, like 'name'
      //   child -> parent: parent passes a function callback to the child,
      //     the child can then use the function to call the parent.
      <TaskCard name={t} key={index} onRemove={onRemoveTask} />
    ));
  }

  return (
    <div className="App">
      <h1>Todo App</h1>
      <input onChange={onInputChange} value={inputText}/>
      <button onClick={onAddTask}>Add Task</button>
      {renderTasks()}
    </div>
  );
}
