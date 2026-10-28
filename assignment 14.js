/* =====================================================================
   JAVASCRIPT ASSIGNMENT 5 - ALL ANSWERS IN ONE FILE
   Topics: callbacks, this, constructors, prototypes, inheritance,
           closures, custom prototype methods, ES6 classes
   Run with Node.js:  node js_assignment_5_all_answers.js
   Each question lives in its own function (q1 ... q9) so names such as
   Person and Student can be reused without clashing.
   ===================================================================== */

function heading(title) {
  console.log(`\n===== ${title} =====`);
}


/* ---------------------------------------------------------------------
   Q1. greetUser(name, callback)
   --------------------------------------------------------------------- */
function q1() {
  heading("Q1 - Callback flow");

  // The callback: runs AFTER the greeting
  function showEndMessage() {
    console.log("Welcome to the course!");
  }

  // greetUser receives a function as an argument and calls it when it is done
  function greetUser(name, callback) {
    console.log(`Hello ${name}`);   // step 1: greeting
    callback();                     // step 2: execute the callback
  }

  console.log("Before calling greetUser");
  greetUser("Kaushlendra", showEndMessage);  // pass the function itself (no parentheses!)
  console.log("After greetUser finished");
  // Flow: Before -> Hello -> Welcome (callback) -> After
}


/* ---------------------------------------------------------------------
   Q2. applyOperation(numbers, operation)
   --------------------------------------------------------------------- */
function q2() {
  heading("Q2 - applyOperation with callbacks");

  // Applies the callback `operation` to every number and returns a new array
  function applyOperation(numbers, operation) {
    const result = [];
    for (let i = 0; i < numbers.length; i++) {
      result.push(operation(numbers[i]));
    }
    return result;
  }

  const numbers = [1, 2, 3, 4];

  const doubled = applyOperation(numbers, num => num * 2);
  const squared = applyOperation(numbers, num => num * num);

  console.log("Original:", numbers);
  console.log("Doubled :", doubled);  // [2, 4, 6, 8]
  console.log("Squared :", squared);  // [1, 4, 9, 16]
}


/* ---------------------------------------------------------------------
   Q3. Arrow function method and `this`
   --------------------------------------------------------------------- */
function q3() {
  heading("Q3 - Arrow function vs normal function (this)");

  // Arrow function version
  const user = {
    name: "Aarav",
    showName: () => {
      // Arrow functions do NOT have their own `this`. They use the `this`
      // of the place where they were written (the surrounding scope), NOT
      // the object that calls them. Here that surrounding `this` is the
      // global/module scope, which has no `name` property.
      // (In a browser, `this` is window and window.name is "" (empty);
      // in Node it is undefined.)
      try {
        console.log("Arrow function  ->", this.name); // undefined
      } catch (error) {
        // If the file runs as a strict ES module, `this` is undefined itself
        console.log(`Arrow function  -> ${error.name}: ${error.message}`);
      }
    }
  };
  user.showName();

  // Fix: use a normal function (method shorthand also works).
  // A normal function gets `this` from HOW it is called. `user.showName()`
  // means `this` = user, so this.name works.
  const fixedUser = {
    name: "Aarav",
    showName: function () {
      console.log("Normal function ->", this.name); // Aarav
    }
  };
  fixedUser.showName();
}


/* ---------------------------------------------------------------------
   Q4. Car constructor with a prototype method
   --------------------------------------------------------------------- */
function q4() {
  heading("Q4 - Constructor function and prototype method");

  function Car(brand, model) {
    this.brand = brand;
    this.model = model;
  }

  // Added ONCE to the prototype and shared by every Car
  Car.prototype.getDetails = function () {
    console.log(`Car: ${this.brand} ${this.model}`);
  };

  const car1 = new Car("Toyota", "Fortuner");
  const car2 = new Car("Hyundai", "Creta");

  car1.getDetails();
  car2.getDetails();

  // Proof of method sharing
  console.log("car1.getDetails === car2.getDetails ->", car1.getDetails === car2.getDetails); // true
  console.log("Own property on car1?", car1.hasOwnProperty("getDetails"));                    // false
  console.log("Found on Car.prototype?", Car.prototype.hasOwnProperty("getDetails"));         // true
}


/* ---------------------------------------------------------------------
   Q5. Person -> Student inheritance with prototypes
   --------------------------------------------------------------------- */
function q5() {
  heading("Q5 - Prototype inheritance (Person -> Student)");

  function Person(name) {
    this.name = name;
  }
  Person.prototype.printName = function () {
    console.log(`Name: ${this.name}`);
  };

  function Student(name, branch) {
    Person.call(this, name);   // reuse Person's constructor to set this.name
    this.branch = branch;
  }

  // Link the prototype chain: Student.prototype -> Person.prototype
  Student.prototype = Object.create(Person.prototype);
  Student.prototype.constructor = Student;   // restore the constructor reference

  Student.prototype.printBranch = function () {
    console.log(`Branch: ${this.branch}`);
  };
  Student.prototype.printDetails = function () {
    this.printName();     // inherited from Person.prototype
    this.printBranch();   // from Student.prototype
  };

  const student = new Student("Riya", "Computer Science");
  student.printDetails();

  // Prototype chain: student -> Student.prototype -> Person.prototype -> Object.prototype -> null
  console.log("student instanceof Student:", student instanceof Student);
  console.log("student instanceof Person :", student instanceof Person);
  console.log("Student.prototype is student's prototype:", Object.getPrototypeOf(student) === Student.prototype);
  console.log("Person.prototype is next in chain       :", Object.getPrototypeOf(Student.prototype) === Person.prototype);
  console.log("printName is own property of student?   :", student.hasOwnProperty("printName")); // false (inherited)
}


/* ---------------------------------------------------------------------
   Q6. Prototype chain: Person -> Faculty -> Professor
   --------------------------------------------------------------------- */
function q6() {
  heading("Q6 - Person -> Faculty -> Professor");

  // Level 1: Person (property: name, method: introduce)
  function Person(name) {
    this.name = name;
  }
  Person.prototype.introduce = function () {
    console.log(`Hi, I am ${this.name}.`);
  };

  // Level 2: Faculty (property: department, method: teach)
  function Faculty(name, department) {
    Person.call(this, name);
    this.department = department;
  }
  Faculty.prototype = Object.create(Person.prototype);
  Faculty.prototype.constructor = Faculty;
  Faculty.prototype.teach = function () {
    console.log(`${this.name} teaches in the ${this.department} department.`);
  };

  // Level 3: Professor (property: researchArea, method: research)
  function Professor(name, department, researchArea) {
    Faculty.call(this, name, department);
    this.researchArea = researchArea;
  }
  Professor.prototype = Object.create(Faculty.prototype);
  Professor.prototype.constructor = Professor;
  Professor.prototype.research = function () {
    console.log(`${this.name} researches ${this.researchArea}.`);
  };

  const prof = new Professor("Dr. Mehta", "Physics", "Quantum Computing");

  // A Professor can use every method up the chain
  prof.introduce();   // from Person.prototype
  prof.teach();       // from Faculty.prototype
  prof.research();    // from Professor.prototype

  console.log("prof instanceof Professor:", prof instanceof Professor);
  console.log("prof instanceof Faculty  :", prof instanceof Faculty);
  console.log("prof instanceof Person   :", prof instanceof Person);
}


/* ---------------------------------------------------------------------
   Q7. makeMultiplier and closures
   --------------------------------------------------------------------- */
function q7() {
  heading("Q7 - Closure: makeMultiplier");

  function makeMultiplier(multiplier) {
    // The returned function "closes over" the variable `multiplier`
    return function (number) {
      return number * multiplier;
    };
  }

  const triple = makeMultiplier(3);
  const double = makeMultiplier(2);

  console.log("triple(5) =", triple(5));  // 15
  console.log("double(5) =", double(5));  // 10

  /* HOW THE CLOSURE WORKS:
     - makeMultiplier(3) runs, creating its own scope where multiplier = 3.
     - It returns the inner function and then finishes. Normally its
       variables would be thrown away.
     - But the inner function still refers to `multiplier`, so JavaScript
       keeps that scope alive. The inner function "remembers" it.
     - That is a closure: a function plus the variables from the scope
       where it was created.
     - Each call to makeMultiplier creates a separate scope, so triple
       remembers 3 and double remembers 2 independently. */
}


/* ---------------------------------------------------------------------
   Q8. Custom Array.prototype.myMap
   --------------------------------------------------------------------- */
function q8() {
  heading("Q8 - Custom myMap on Array.prototype");

  // Only add if it doesn't exist. defineProperty makes it non-enumerable,
  // so it won't show up in for...in loops over arrays (unlike plain assignment).
  if (!Array.prototype.myMap) {
    Object.defineProperty(Array.prototype, "myMap", {
      value: function (callback, thisArg) {
        if (typeof callback !== "function") {
          throw new TypeError(`${callback} is not a function`);
        }
        const result = [];
        for (let i = 0; i < this.length; i++) {
          // `this` is the array myMap was called on.
          // Like the built-in map, callback gets (value, index, array).
          if (i in this) {   // skip empty slots in sparse arrays
            result[i] = callback.call(thisArg, this[i], i, this);
          }
        }
        return result;
      },
      writable: true,
      configurable: true,
      enumerable: false
    });
  }

  console.log("[1,2,3].myMap(num => num * 2) =", [1, 2, 3].myMap(num => num * 2)); // [2,4,6]
  console.log("['a','b'].myMap((v, i) => v + i) =", ["a", "b"].myMap((v, i) => v + i));

  // Same result as the built-in map
  const sample = [5, 10, 15];
  console.log("myMap :", sample.myMap(n => n / 5));
  console.log("map   :", sample.map(n => n / 5));
}


/* ---------------------------------------------------------------------
   Q9. Person -> Student with ES6 classes, compared with prototypes
   --------------------------------------------------------------------- */
function q9() {
  heading("Q9 - ES6 classes vs prototype version");

  // ----- ES6 class version -----
  class PersonClass {
    constructor(name) {
      this.name = name;
    }
    printName() {
      console.log(`Name: ${this.name}`);
    }
  }

  class StudentClass extends PersonClass {
    constructor(name, branch) {
      super(name);          // calls the parent constructor (like Person.call)
      this.branch = branch;
    }
    printBranch() {
      console.log(`Branch: ${this.branch}`);
    }
    printDetails() {
      this.printName();
      this.printBranch();
    }
  }

  // ----- Prototype version (same as Q5) -----
  function PersonProto(name) {
    this.name = name;
  }
  PersonProto.prototype.printName = function () {
    console.log(`Name: ${this.name}`);
  };

  function StudentProto(name, branch) {
    PersonProto.call(this, name);
    this.branch = branch;
  }
  StudentProto.prototype = Object.create(PersonProto.prototype);
  StudentProto.prototype.constructor = StudentProto;
  StudentProto.prototype.printBranch = function () {
    console.log(`Branch: ${this.branch}`);
  };
  StudentProto.prototype.printDetails = function () {
    this.printName();
    this.printBranch();
  };

  const classStudent = new StudentClass("Riya", "Computer Science");
  const protoStudent = new StudentProto("Riya", "Computer Science");

  console.log("--- class version ---");
  classStudent.printDetails();
  console.log("--- prototype version ---");
  protoStudent.printDetails();

  // Show that the structure is the same
  console.log("--- comparison ---");
  console.log("Both are instanceof their Person  :",
    classStudent instanceof PersonClass, protoStudent instanceof PersonProto);
  console.log("Methods live on the prototype     :",
    !classStudent.hasOwnProperty("printName") && !protoStudent.hasOwnProperty("printName"));
  console.log("Chain: Student.prototype -> Person.prototype:",
    Object.getPrototypeOf(StudentClass.prototype) === PersonClass.prototype,
    Object.getPrototypeOf(StudentProto.prototype) === PersonProto.prototype);
  console.log("typeof class is 'function' (just syntax sugar):",
    typeof StudentClass, typeof StudentProto);

  // The one real difference: a class cannot be called without `new`
  try {
    StudentClass("Test", "CSE");
  } catch (error) {
    console.log(`Class called without new -> ${error.name}: ${error.message}`);
  }
}


/* =====================================================================
   RUN EVERYTHING
   ===================================================================== */
q1();
q2();
q3();
q4();
q5();
q6();
q7();
q8();
q9();
