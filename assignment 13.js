/* =====================================================================
   JAVASCRIPT ASSIGNMENT 3 - ALL ANSWERS IN ONE FILE
   Run with Node.js:  node js_assignment_3_all_answers.js
   (Q6 accepts an optional row count:  node js_assignment_3_all_answers.js 7)

   IMPORTANT - why there is no "use strict" at the top of the file:
   Q4, Q5 and Q8 need to compare strict and non-strict behaviour, and
   some strict-mode violations (duplicate parameters, delete on a
   variable) are SyntaxErrors that would stop the WHOLE file from
   loading. So "use strict" is placed inside each function that needs it
   (function-level strict mode), and the strict-only errors in Q8 are
   triggered through new Function(...) so they can be caught.

   DEBUGGING: lines containing `debugger;` are breakpoints. They do
   nothing in a normal run. To use them in VS Code, press F5 (Run and
   Debug > Node.js) or run: node --inspect-brk js_assignment_3_all_answers.js
   Add the variables mentioned in the comments to the WATCH panel and
   look at the CALL STACK panel.
   ===================================================================== */

// Small helper to print a heading for every question
function heading(title) {
  console.log(`\n===== ${title} =====`);
}


/* ---------------------------------------------------------------------
   Q1 - Dynamic Data Parser
   --------------------------------------------------------------------- */
function q1() {
  "use strict";
  heading("Q1 - Dynamic Data Parser");

  const apiData = ["25", "true", "false", "NaN", " ", "100px", "3.14", null, undefined];

  const validNumbers = [];    // numeric values that are safe to use
  const invalidEntries = [];  // entries skipped, logged separately

  // Gotcha: Number(" ") is 0 and Number(null) is 0, which would look
  // "valid". The assignment treats blank strings as invalid, and null /
  // undefined mean "no data", so we validate the raw value ourselves.
  function isValidNumeric(value) {
    if (typeof value !== "string") return false;   // null / undefined
    if (value.trim() === "") return false;         // blank string
    return Number.isFinite(Number(value));         // rejects NaN, "100px", "true"
  }

  function invalidReason(value) {
    if (value === null || value === undefined) return "no data";
    if (typeof value === "string" && value.trim() === "") return "blank string";
    return "not a number";
  }

  for (let i = 0; i < apiData.length; i++) {
    const raw = apiData[i];

    // Conversions to the three forms
    const asNumber = Number(raw);
    const asBoolean = Boolean(raw);   // note: Boolean("false") is TRUE (non-empty string)
    const asString = String(raw);

    const shown = raw === undefined ? "undefined" : JSON.stringify(raw);

    if (isValidNumeric(raw)) {
      validNumbers.push(asNumber);
      console.log(`[${i}] ${shown.padEnd(9)} -> VALID   | Number: ${asNumber} | Boolean: ${asBoolean} | String: "${asString}"`);
    } else {
      invalidEntries.push({ index: i, value: raw, reason: invalidReason(raw) });
      console.log(`[${i}] ${shown.padEnd(9)} -> INVALID | Number: ${asNumber} | Boolean: ${asBoolean} | String: "${asString}" (${invalidReason(raw)})`);
    }
  }

  console.log("\nValid numeric data  :", validNumbers);
  console.log("Invalid entries     :", invalidEntries.map(e => `#${e.index} (${e.reason})`).join(", "));
  console.log(`Summary: ${validNumbers.length} valid, ${invalidEntries.length} invalid`);
}


/* ---------------------------------------------------------------------
   Q2 - Employee Bonus Calculator
   --------------------------------------------------------------------- */
function q2() {
  "use strict"; // no implicit globals: every variable below is declared
  heading("Q2 - Employee Bonus Calculator");

  const employees = [
    { name: "Amit", salary: "45000", years: "5" },
    { name: "Sara", salary: "38000", years: "2" },
    { name: "Kiran", salary: "52000", years: "7" }
  ];

  // Extra records to demonstrate the error handling
  const badEmployees = [
    { name: "Ravi", salary: "abc", years: "4" },  // conversion error
    { name: "Neha", years: "3" }                  // missing property
  ];

  // Converts a field to a number or throws a clear error
  function toNumberStrict(value, fieldName) {
    if (value === undefined || value === null) {
      throw new Error(`Missing property: ${fieldName}`);
    }
    if (String(value).trim() === "") {
      throw new Error(`Empty value for: ${fieldName}`);
    }
    const num = Number(value);
    if (Number.isNaN(num)) {
      throw new TypeError(`Cannot convert ${fieldName} ("${value}") to a number`);
    }
    return num;
  }

  function printBonus(emp) {
    try {
      const salary = toNumberStrict(emp.salary, "salary");
      const years = toNumberStrict(emp.years, "years");

      // bonus = 10% if years > 3, otherwise 5%
      const bonus = years > 3 ? salary * 0.1 : salary * 0.05;

      console.log(`Employee: ${emp.name} | Salary: ${salary.toFixed(2)} | Years: ${years} | Bonus: ${bonus.toFixed(2)} | Total: ${(salary + bonus).toFixed(2)}`);
    } catch (error) {
      console.log(`Error for ${emp.name}: ${error.name} - ${error.message}`);
    }
  }

  employees.forEach(printBonus);
  console.log("--- records with problems ---");
  badEmployees.forEach(printBonus);
}


/* ---------------------------------------------------------------------
   Q3 - Transaction Validator
   --------------------------------------------------------------------- */
function q3() {
  "use strict";
  heading("Q3 - Transaction Validator");

  // Custom error types so each failure can be categorized
  class NegativeAmountError extends Error {
    constructor(message) { super(message); this.name = "NegativeAmountError"; }
  }
  class MissingFieldError extends Error {
    constructor(message) { super(message); this.name = "MissingFieldError"; }
  }
  class NullTransactionError extends Error {
    constructor(message) { super(message); this.name = "NullTransactionError"; }
  }

  const transactions = [
    { id: 1, amount: 2000 },
    { id: 2, amount: -500 },
    { id: 3 },
    null
  ];

  function validateTransaction(tx) {
    if (tx === null || tx === undefined) {
      throw new NullTransactionError("Transaction entry is null");
    }
    const missing = [];
    if (tx.id === undefined) missing.push("id");
    if (tx.amount === undefined) missing.push("amount");
    if (missing.length > 0) {
      throw new MissingFieldError(`Missing field(s): ${missing.join(", ")}`);
    }
    if (tx.amount < 0) {
      throw new NegativeAmountError(`Negative amount: ${tx.amount}`);
    }
    return true;
  }

  const valid = [];
  const invalid = [];
  const errorTypeCounts = {};

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];

    // BREAKPOINT: set a watch on `i`, `tx`, `valid`, `invalid` and step
    // through (F10). Watch how control jumps to `catch` when a throw happens.
    debugger;

    try {
      validateTransaction(tx);
      valid.push(tx);
      console.log(`Transaction #${i}: OK`);
    } catch (error) {
      // Categorize by error type
      invalid.push({ entry: tx, errorType: error.name, message: error.message });
      errorTypeCounts[error.name] = (errorTypeCounts[error.name] || 0) + 1;
      console.log(`Transaction #${i}: FAILED -> ${error.name}: ${error.message}`);
    }
  }

  console.log("\n--- Final Report ---");
  console.log(`Successful transactions: ${valid.length}`);
  console.log(`Failed transactions    : ${invalid.length}`);
  console.log("Failures by type       :", errorTypeCounts);
}


/* ---------------------------------------------------------------------
   Q4 - Debugging Mystery
   --------------------------------------------------------------------- */
function q4() {
  heading("Q4 - Debugging Mystery");

  // 1. Why does the original throw?
  // Under "use strict", assigning to a variable that was never declared
  // (greeting = "Welcome") is NOT allowed. Without strict mode JavaScript
  // would silently create a global variable `greeting`; strict mode turns
  // that typo-prone behaviour into a ReferenceError.
  function showMessageBroken() {
    "use strict";
    greeting = "Welcome"; // undeclared -> ReferenceError
    console.log(greeting);
  }

  try {
    showMessageBroken();
  } catch (error) {
    console.log(`Original code threw -> ${error.name}: ${error.message}`);
  }

  // 2. The fix: declare the variable with let (or const).
  // `greeting` is now a local, block-scoped variable that lives only inside
  // showMessage(). It no longer leaks into the global scope, and strict
  // mode is satisfied because the declaration exists before the assignment.
  function showMessage() {
    "use strict";
    let greeting = "Welcome";

    // 3. DEBUGGING: add `greeting` to the WATCH panel. At this breakpoint
    // the CALL STACK shows: showMessage -> q4 -> (main script).
    debugger;

    console.log(greeting);
  }

  showMessage();
  console.log(`typeof greeting outside the function: ${typeof greeting}`); // undefined
}


/* ---------------------------------------------------------------------
   Q5 - Hoisting Lab: The Sequence Trap
   --------------------------------------------------------------------- */
function q5() {
  heading("Q5 - Hoisting Lab: The Sequence Trap");

  /* PREDICTION for the original code:
       console.log(score);   -> undefined      (var is hoisted, value not yet assigned)
       announce();           -> "Game started" (function declaration is fully hoisted)
       var score = 50;
       let status = "ready";
       startGame();          -> "ready"        (status is initialized BEFORE the call)

     MEMORY STATE of each hoisted element (during the creation phase):
       - var score        : created and set to undefined
       - function announce: created and holds the whole function body
       - let status       : created but UNINITIALIZED (Temporal Dead Zone)
                            until the line `let status = "ready"` runs
       - function startGame: created and holds the whole function body
  */

  console.log("--- Original sequence ---");
  console.log(score);       // undefined, NOT 50
  announce();               // works, function declarations are hoisted
  var score = 50;
  function announce() { console.log("Game started"); }
  let status = "ready";
  startGame();              // works because status is already initialized
  function startGame() { console.log(status); }

  // Demonstrate the Temporal Dead Zone for let
  console.log("--- Temporal Dead Zone for let ---");
  try {
    console.log(lateLet);   // lateLet exists but is uninitialized
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  }
  let lateLet = "now initialized";

  // 2. FIXED version: declare and assign before use, call functions after setup
  console.log("--- Fixed version ---");
  {
    const fixedScore = 50;                 // declared before it is read
    const fixedStatus = "ready";
    function announceFixed() { console.log("Game started"); }
    function startGameFixed() { console.log(fixedStatus); }

    console.log(fixedScore);               // 50
    announceFixed();
    startGameFixed();
  }

  // 3. Arrow function comparison.
  // Arrow functions are stored in variables, so they follow VARIABLE hoisting
  // rules, not function-declaration rules.
  console.log("--- Arrow functions ---");

  try {
    announceArrow();       // const is in the TDZ
  } catch (error) {
    console.log(`const arrow called early -> ${error.name}: ${error.message}`);
  }
  const announceArrow = () => console.log("Game started (arrow)");
  announceArrow();         // fine after the definition

  try {
    announceVarArrow();    // var is hoisted as undefined, so it is not a function yet
  } catch (error) {
    console.log(`var arrow called early   -> ${error.name}: ${error.message}`);
  }
  var announceVarArrow = () => console.log("Game started (var arrow)");
  announceVarArrow();
}


/* ---------------------------------------------------------------------
   Q6 - Pyramid Pattern Generator
   --------------------------------------------------------------------- */
function q6() {
  "use strict";
  heading("Q6 - Pyramid Pattern Generator");

  // 3. Row count from user input (default = 5).
  // Node: node file.js 7   |  Browser: replace with Number(prompt("Rows?"))
  function getRowLimit() {
    const arg = typeof process !== "undefined" && process.argv ? process.argv[2] : undefined;
    const rows = Number(arg);
    return Number.isInteger(rows) && rows > 0 ? rows : 5;
  }

  const rowLimit = getRowLimit();
  console.log(`Rows: ${rowLimit}`);

  // Version with let: loop variables exist only inside their loops
  function pyramidLet(rows) {
    for (let row = 1; row <= rows; row++) {
      let line = "";
      for (let col = 1; col <= row; col++) {
        line += "* ";
      }
      console.log(line.trimEnd());
    }
    // `row` and `col` are gone here (block scoped)
    console.log(`After loop (let): typeof row = ${typeof row}, typeof col = ${typeof col}`);
  }

  // 1. Version with var: SAME printed pyramid, but the variables leak.
  function pyramidVar(rows) {
    for (var row = 1; row <= rows; row++) {
      var line = "";
      for (var col = 1; col <= row; col++) {
        line += "* ";
      }
      console.log(line.trimEnd());
    }
    // var is function scoped, so the loop counters survive after the loops
    console.log(`After loop (var): row = ${row}, col = ${col}`);
  }

  console.log("--- let version ---");
  pyramidLet(rowLimit);
  console.log("--- var version ---");
  pyramidVar(rowLimit);

  // 2. Variable re-use: where var and let really differ (closures)
  const withVar = [];
  const withLet = [];
  for (var v = 0; v < 3; v++) withVar.push(() => v);   // all share ONE v
  for (let l = 0; l < 3; l++) withLet.push(() => l);   // each loop gets its OWN l
  console.log("Closures with var:", withVar.map(fn => fn()).join(", "));  // 3, 3, 3
  console.log("Closures with let:", withLet.map(fn => fn()).join(", "));  // 0, 1, 2

  // Step-by-step debug: watch `row`, `col` and `line` change.
  // With var there is one `col` for the whole function that is reset each
  // row; with let a fresh `col` is created for every outer iteration.
  for (let row = 1; row <= 2; row++) {
    debugger; // watch: row, col, line
    for (let col = 1; col <= row; col++) {
      console.log(`  trace: row=${row}, col=${col}`);
    }
  }

  // 4. "use strict" catches an undeclared loop variable
  function undeclaredLoopVar() {
    "use strict";
    for (k = 1; k <= 3; k++) { /* k was never declared */ }
  }
  try {
    undeclaredLoopVar();
  } catch (error) {
    console.log(`Strict mode caught -> ${error.name}: ${error.message}`);
  }
}


/* ---------------------------------------------------------------------
   Q7 - Smart Calculator
   --------------------------------------------------------------------- */
function q7() {
  "use strict";
  heading("Q7 - Smart Calculator");

  // Custom errors
  class DivisionByZeroError extends Error {
    constructor(message) { super(message); this.name = "DivisionByZeroError"; }
  }
  class NegativeRootError extends Error {
    constructor(message) { super(message); this.name = "NegativeRootError"; }
  }
  class InvalidOperationError extends Error {
    constructor(message) { super(message); this.name = "InvalidOperationError"; }
  }

  function calculate(operation, a, b) {
    switch (operation) {
      case "add":
        return a + b;
      case "subtract":
        return a - b;
      case "divide":
        if (b === 0) throw new DivisionByZeroError("Cannot divide by zero");
        return a / b;
      case "power":
        return Math.pow(a, b);
      case "root":
        // square root of the first number
        if (a < 0) throw new NegativeRootError("Cannot take the root of a negative number");
        return Math.sqrt(a);
      default:
        throw new InvalidOperationError(`Unknown operation: "${operation}"`);
    }
  }

  const operations = ["add", "divide", "power", "root", "subtract"];
  const num1 = 25, num2 = 0;

  console.log(`Inputs: num1 = ${num1}, num2 = ${num2}`);
  console.log("--- Calculator Summary ---");

  // Extra cases to show every custom error
  const allTests = [
    ...operations.map(op => [op, num1, num2]),
    ["root", -9, 0],        // negative root
    ["modulus", num1, 3]    // unrecognized operation
  ];

  for (const [op, a, b] of allTests) {
    try {
      const result = calculate(op, a, b);
      console.log(`${op.padEnd(9)} (${a}, ${b}) = ${result}`);
    } catch (error) {
      console.log(`${op.padEnd(9)} (${a}, ${b}) -> ${error.name}: ${error.message}`);
    }
  }
}


/* ---------------------------------------------------------------------
   Q8 - Strict Mode Showdown
   --------------------------------------------------------------------- */
function q8() {
  heading("Q8 - Strict Mode Showdown");

  /* The original code:
       function demo(a, a) { total = 10; delete total; }
       demo(5, 10);
     Problems it contains:
       1. Duplicate parameter names (a, a)
       2. total = 10     -> assignment to an undeclared variable
       3. delete total   -> deleting a plain variable/identifier
     In strict mode, #1 and #3 are SyntaxErrors (found before any code runs,
     so the whole function/script refuses to load) and #2 is a ReferenceError.
     To demonstrate this safely, the code is compiled with new Function().
  */

  // 1. WITHOUT "use strict": it runs, quietly doing odd things
  console.log("--- Without 'use strict' ---");
  const sloppyDemo = new Function(
    "a", "a",
    "total = 10; var wasDeleted = delete total; " +
    "return { a: a, wasDeleted: wasDeleted, totalAfter: typeof total };"
  );
  const sloppyResult = sloppyDemo(5, 10);
  console.log(`demo(5, 10) ran fine. a = ${sloppyResult.a} (the LAST duplicate wins, 5 is lost)`);
  console.log(`total = 10 silently created a global; delete returned ${sloppyResult.wasDeleted}; typeof total afterwards: ${sloppyResult.totalAfter}`);

  // 2. WITH "use strict": every problem is reported
  console.log("--- With 'use strict' ---");
  const strictTests = [
    ["Duplicate parameter names  ", () => new Function("a", "a", '"use strict"; return a;')],
    ["Assign to undeclared var   ", () => new Function('"use strict"; total = 10;')()],
    ["delete on a variable       ", () => new Function('"use strict"; var x = 1; delete x;')],
    ["Original demo(a, a) as-is  ", () => new Function("a", "a", '"use strict"; total = 10; delete total;')]
  ];

  for (const [label, test] of strictTests) {
    try {
      test();
      console.log(`${label}: no error`);
    } catch (error) {
      console.log(`${label}: ${error.name} - ${error.message}`);
    }
  }

  /* 3. WHY strict mode makes these illegal:
       - Duplicate parameters: it is almost always a typo, and it makes the
         first argument impossible to reach, so the language bans it.
       - Undeclared assignment: a misspelled name would silently create a
         global variable (a very hard bug to find). Strict mode forces
         every variable to be declared.
       - delete on a variable: variables are not meant to be removed;
         delete is only meant for object properties. It also blocks
         engine optimizations, so it is rejected.
  */

  // 4. Correct version using ES6 rules
  console.log("--- Correct ES6 version ---");
  function demo(a, b) {                 // unique parameter names
    "use strict";
    const data = { total: 10 };         // declared, scoped to this function
    data.total += a + b;
    console.log(`total = ${data.total}`);
    delete data.total;                  // delete is valid on an object property
    console.log(`'total' still in data after delete: ${"total" in data}`);
  }
  demo(5, 10);
}


/* ---------------------------------------------------------------------
   Q9 - JSON Audit
   --------------------------------------------------------------------- */
function q9() {
  "use strict";
  heading("Q9 - JSON Audit");

  const rawData = [
    '{"user":"Alex","age":25}',
    '{"id":2}',
    '{invalid}',
    '{"user":"Mina","age":"22"}'
  ];

  const cleanData = [];
  const requiredKeys = ["user", "age"];

  for (let i = 0; i < rawData.length; i++) {
    const lineNumber = i + 1;

    // BREAKPOINT: watch `i`, `lineNumber`, `rawData[i]`, `cleanData`.
    // When JSON.parse fails, step over (F10) and see execution jump
    // straight into the catch block, skipping the rest of the try block.
    debugger;

    try {
      const parsed = JSON.parse(rawData[i]);   // throws SyntaxError on bad JSON

      // Valid JSON, but is it an object with the keys we need?
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("JSON is not an object");
      }
      const missingKeys = requiredKeys.filter(key => !(key in parsed));
      if (missingKeys.length > 0) {
        throw new Error(`Missing key(s): ${missingKeys.join(", ")}`);
      }

      cleanData.push(parsed);
      console.log(`Line ${lineNumber}: valid`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log(`Line ${lineNumber}: INVALID JSON -> ${error.message}`);
      } else {
        console.log(`Line ${lineNumber}: INVALID DATA -> ${error.message}`);
      }
    }
  }

  console.log("\nClean array:", cleanData);

  // Bonus: convert age to Number and keep only users aged 18 or over
  const convertAges = users => users.map(u => ({ ...u, age: Number(u.age) }));
  const adultsOnly = users => convertAges(users).filter(u => u.age >= 18);

  console.log("Adults from clean data:", adultsOnly(cleanData));

  // Extra check with an under-18 user so the filter visibly does something
  const withMinor = [...cleanData, { user: "Tom", age: "15" }];
  console.log("With an extra minor (Tom, 15) filtered out:", adultsOnly(withMinor));
}


/* ---------------------------------------------------------------------
   Q10 - Nested Hoisting and Closures
   --------------------------------------------------------------------- */
function q10() {
  heading("Q10 - Nested Hoisting and Closures");

  /* 1. PREDICTION for the original code:
        outer() prints : undefined   (outer's own `var count` is hoisted, not yet 5)
        inner() prints : undefined   (inner's OWN `var count` is hoisted, so it
                                      does NOT see outer's count = 5)

     2. Each function call gets its own execution context with its own
        memory. During the creation phase of each one:
          outer context: count = undefined, inner = <function>
          inner context: count = undefined   <- a separate variable that
                                                shadows outer's count
        Because inner declares its own `count`, the name never "falls
        through" to outer's count, even though outer's count would be 5
        by then.
  */

  console.log("--- Original ---");
  function outer() {
    console.log("outer, before assignment:", count); // undefined
    var count = 5;

    function inner() {
      console.log("inner, before assignment:", count); // undefined (own hoisted var)
      var count = 10;
      console.log("inner, after assignment :", count);  // 10
    }

    // CALL STACK when stopped inside inner(): inner -> outer -> q10 -> (main).
    // WATCH `count`: inside inner it shows the inner variable, not outer's.
    debugger;

    inner();
    console.log("outer, after inner()     :", count);   // still 5, untouched by inner
  }
  outer();

  // 3. inner as an arrow function.
  // The hoisting of `var count` inside it is IDENTICAL: an arrow function
  // still creates its own function scope. The differences are elsewhere:
  //   - it is a const variable, so it cannot be called before its definition
  //   - it has no own `this` or `arguments`
  console.log("--- inner as an arrow function ---");
  function outerArrow() {
    console.log("outerArrow, before assignment:", count); // undefined
    var count = 5;

    try {
      innerArrow();   // TDZ: const not initialized yet
    } catch (error) {
      console.log(`calling arrow before its definition -> ${error.name}`);
    }

    const innerArrow = () => {
      console.log("innerArrow, before assignment:", count); // undefined (own hoisted var)
      var count = 10;
      console.log("innerArrow, after assignment :", count);
    };

    innerArrow();
  }
  outerArrow();

  // Closure: if inner does NOT declare its own count, it uses outer's
  console.log("--- closure (no inner var) ---");
  function outerClosure() {
    var count = 5;
    const innerClosure = () => console.log("inner reads outer's count:", count); // 5
    innerClosure();
  }
  outerClosure();
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
q10();
