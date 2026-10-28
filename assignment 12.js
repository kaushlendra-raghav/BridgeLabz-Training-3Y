/* =====================================================================
   JAVASCRIPT ASSIGNMENT 2 - ALL ANSWERS IN ONE FILE
   Run with Node.js:  node js_assignment_2_all_answers.js
   (or paste into the browser console)
   Each question is wrapped in its own { } block so variable and
   function names don't clash between questions.
   ===================================================================== */


/* ---------------------------------------------------------------------
   Q1. Scope Conflict Resolver
   --------------------------------------------------------------------- */
console.log("\n===== Q1. Scope Conflict Resolver =====");
{
  // Global variable (accessible everywhere)
  var bonus = 5000;

  function calculateSalary(isPermanent) {
    // Local variable - exists only inside this function
    let salary = 40000;

    // Bonus is added only for permanent employees
    if (isPermanent) {
      salary += bonus; // function reads the global 'bonus'
    }

    console.log(`isPermanent = ${isPermanent} -> Total salary: ${salary}`);
  }

  // Changing isPermanent changes only the function's result...
  calculateSalary(true);   // 45000
  calculateSalary(false);  // 40000

  // ...the global variable is never modified by it
  console.log(`Global bonus after both calls: ${bonus}`);

  // 'salary' and 'isPermanent' are local, so they don't exist outside
  console.log(`typeof salary outside the function: ${typeof salary}`); // undefined
}


/* ---------------------------------------------------------------------
   Q2. String Manipulation Report
   --------------------------------------------------------------------- */
console.log("\n===== Q2. String Manipulation Report =====");
{
  const productName = "  wireless headphones PRO  ";

  // Step 1: trim extra spaces and convert to lowercase
  let cleaned = productName.trim().toLowerCase();

  // Step 2: replace "pro" with "Pro Edition"
  // (done before capitalizing; \b makes sure only the whole word "pro" matches)
  cleaned = cleaned.replace(/\bpro\b/, "Pro Edition");

  // Step 3: capitalize the first letter of each word
  const title = cleaned
    .split(" ")                                          // split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
    .join(" ");                                          // join back

  console.log(`Cleaned Title : ${title}`);
  console.log(`Length        : ${title.length}`);
}


/* ---------------------------------------------------------------------
   Q3. Math Utility Dashboard
   --------------------------------------------------------------------- */
console.log("\n===== Q3. Math Utility Dashboard =====");
{
  const x = 16.75;

  const roundedValue = Math.round(x);
  const squareRoot = Math.sqrt(x);
  const power = Math.pow(x, 3);
  const randomNumber = Math.floor(Math.random() * 41) + 10; // 10 - 50

  console.log(`
--- Math Summary for x = ${x} ---
Rounded value  : ${roundedValue}
Square root    : ${squareRoot.toFixed(4)}
Power (x^3)    : ${power}
Random (10-50) : ${randomNumber}
`);
}


/* ---------------------------------------------------------------------
   Q4. Array Performance Analyzer
   --------------------------------------------------------------------- */
console.log("\n===== Q4. Array Performance Analyzer =====");
{
  // 8 random scores between 30 and 100
  const scores = Array.from({ length: 8 }, () => Math.floor(Math.random() * 71) + 30);

  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);

  // reduce() sums all scores
  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = total / scores.length;

  // filter() keeps only passing scores (>= 50)
  const passedCount = scores.filter(score => score >= 50).length;

  // map() creates a Pass/Fail label for every score
  const results = scores.map(score => (score >= 50 ? "Pass" : "Fail"));

  console.log(`Scores         : ${scores.join(", ")}`);
  console.log(`Results        : ${results.join(", ")}`);
  console.log(`Highest Score  : ${highest}`);
  console.log(`Lowest Score   : ${lowest}`);
  console.log(`Average Score  : ${average.toFixed(2)}`);
  console.log(`Students Passed: ${passedCount} out of ${scores.length}`);
}


/* ---------------------------------------------------------------------
   Q5. Boolean Logic Access System
   --------------------------------------------------------------------- */
console.log("\n===== Q5. Boolean Logic Access System =====");
{
  // Returns "Secure" only when ALL conditions are met:
  // alarm on AND door locked AND window closed AND owner inside
  function checkSecurity(isDoorLocked, isWindowClosed, isAlarmOn, isOwnerInside) {
    const accessGranted = isAlarmOn && isDoorLocked && isWindowClosed && isOwnerInside;
    return accessGranted ? "Secure" : "Unsafe";
  }

  // Test multiple scenarios by changing the values
  const testCases = [
    { isDoorLocked: true,  isWindowClosed: true,  isAlarmOn: true,  isOwnerInside: true  },
    { isDoorLocked: false, isWindowClosed: true,  isAlarmOn: true,  isOwnerInside: true  },
    { isDoorLocked: true,  isWindowClosed: false, isAlarmOn: true,  isOwnerInside: true  },
    { isDoorLocked: true,  isWindowClosed: true,  isAlarmOn: false, isOwnerInside: true  },
    { isDoorLocked: true,  isWindowClosed: true,  isAlarmOn: true,  isOwnerInside: false },
  ];

  testCases.forEach((t, i) => {
    const status = checkSecurity(t.isDoorLocked, t.isWindowClosed, t.isAlarmOn, t.isOwnerInside);
    console.log(`Test ${i + 1}: ${JSON.stringify(t)} -> ${status}`);
  });
}


/* ---------------------------------------------------------------------
   Q6. Event-Based Counter Simulation
   --------------------------------------------------------------------- */
console.log("\n===== Q6. Event-Based Counter Simulation =====");
{
  let count = 0;

  function increment() {
    // Nested function: it can read and update 'count' from the outer scope
    function updateCount(change) {
      count += change;
      console.log(`Current count: ${count}`);
    }
    updateCount(1);
  }

  function decrement() {
    function updateCount(change) {
      count += change;
      console.log(`Current count: ${count}`);
    }
    updateCount(-1);
  }

  // Simulate button "click" events by calling the functions manually
  console.log("Click: +");
  increment();
  increment();
  increment();
  console.log("Click: -");
  decrement();
}


/* ---------------------------------------------------------------------
   Q7. Customer Feedback Processor
   --------------------------------------------------------------------- */
console.log("\n===== Q7. Customer Feedback Processor =====");
{
  const feedback = "Great product! Fast delivery and amazing sound quality!";

  // Count words: split on one or more spaces
  const wordCount = feedback.trim().split(/\s+/).length;

  // Lowercase first so "Bad"/"POOR" are also detected
  const lowerFeedback = feedback.toLowerCase();
  const hasNegativeWord = lowerFeedback.includes("bad") || lowerFeedback.includes("poor");

  console.log(`Feedback   : "${feedback}"`);
  console.log(`Word Count : ${wordCount}`);

  if (!hasNegativeWord) {
    console.log("Positive Feedback");
  } else {
    console.log("Needs Improvement");
  }
}


/* ---------------------------------------------------------------------
   Q8. Dynamic Discount Evaluator
   --------------------------------------------------------------------- */
console.log("\n===== Q8. Dynamic Discount Evaluator =====");
{
  function evaluateCart(cart) {
    const discountedPrices = [];

    // Loop: apply category discount to each item
    for (let i = 0; i < cart.length; i++) {
      let price = cart[i].price;

      if (cart[i].category === "electronics") {
        price -= price * 0.10;   // 10% off
      } else if (cart[i].category === "fashion") {
        price -= price * 0.05;   // 5% off
      }

      discountedPrices.push(price);
    }

    // reduce(): original cart value and total after category discounts
    const originalTotal = cart.reduce((sum, product) => sum + product.price, 0);
    let finalTotal = discountedPrices.reduce((sum, price) => sum + price, 0);

    // Extra 5% overall discount if the original cart value is above 50000
    if (originalTotal > 50000) {
      finalTotal -= finalTotal * 0.05;
      console.log("Extra 5% overall discount applied!");
    }

    console.log(`Original Total : ${originalTotal.toFixed(2)}`);
    console.log(`Final Total    : ${finalTotal.toFixed(2)}`);
  }

  // Cart given in the question (original total 48100 -> no extra discount)
  const cart = [
    { item: "Laptop", category: "electronics", price: 45000 },
    { item: "Shoes", category: "fashion", price: 2500 },
    { item: "Book", category: "education", price: 600 }
  ];
  console.log("-- Given cart --");
  evaluateCart(cart);

  // Bigger cart to demonstrate the extra 5% discount
  const bigCart = [...cart, { item: "Headphones", category: "electronics", price: 10000 }];
  console.log("-- Cart with extra item (total > 50000) --");
  evaluateCart(bigCart);
}


/* ---------------------------------------------------------------------
   Q9. Odd-Even Number Analyzer
   --------------------------------------------------------------------- */
console.log("\n===== Q9. Odd-Even Number Analyzer =====");
{
  // Build array of numbers 1-30 using a loop
  const numbers = [];
  for (let i = 1; i <= 30; i++) {
    numbers.push(i);
  }

  // Classify each number and store results in a new array
  const results = [];
  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];

    if (num % 3 === 0 && num % 5 === 0) {
      results.push("FizzBuzz");
    } else if (num % 2 === 0) {
      results.push("Even");
    } else {
      results.push("Odd");
    }
  }

  console.log(results);
}


/* ---------------------------------------------------------------------
   Q10. Departmental Employee Evaluator
   --------------------------------------------------------------------- */
console.log("\n===== Q10. Departmental Employee Evaluator =====");
{
  const departments = [
    ["HR", 72],
    ["Finance", 88],
    ["Tech", 95],
    ["Support", 63]
  ];

  for (let i = 0; i < departments.length; i++) {
    const name = departments[i][0];
    const score = departments[i][1];
    let rating;

    // Nested if-else with comparison operators
    if (score >= 75) {
      if (score >= 90) {
        rating = "Excellent";
      } else {
        rating = "Good";       // 75 - 89
      }
    } else {
      if (score >= 60) {
        rating = "Average";    // 60 - 74
      } else {
        rating = "Needs Improvement";
      }
    }

    console.log(`${name} (${score}): ${rating}`);
  }
}
