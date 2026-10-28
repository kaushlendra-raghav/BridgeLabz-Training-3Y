/* =====================================================================
   JAVASCRIPT ASSIGNMENT 1 - ALL ANSWERS IN ONE FILE
   Run with Node.js:  node js_assignment_1_all_answers.js
   (or paste into the browser console)
   Each question is wrapped in its own { } block so variable names
   don't clash between questions.
   ===================================================================== */


/* ---------------------------------------------------------------------
   Q1. Personalized Login Greeting
   --------------------------------------------------------------------- */
console.log("\n===== Q1. Personalized Login Greeting =====");
{
  const userName = "Kaushlendra";
  const currentHour = new Date().getHours(); // 0 - 23

  let greeting;

  if (currentHour < 12) {
    greeting = `Good Morning ${userName}!`;
  } else if (currentHour >= 12 && currentHour <= 17) {
    greeting = `Good Afternoon ${userName}!`;
  } else {
    greeting = `Good Evening ${userName}!`;
  }

  console.log(greeting);
}


/* ---------------------------------------------------------------------
   Q2. Multi-Type Data Summary
   --------------------------------------------------------------------- */
console.log("\n===== Q2. Multi-Type Data Summary =====");
{
  // Variables of different data types
  const userName = "Aarav Sharma";                 // string
  const age = 24;                                  // number
  const isActive = true;                           // boolean
  const hobbies = ["reading", "cricket", "coding"]; // array
  const address = { city: "Meerut", pin: 250001 }; // object
  const middleName = null;                         // null
  let phoneNumber;                                 // undefined

  // Helper: returns an accurate type label.
  // typeof gives "object" for arrays and null, so we handle them separately.
  function getType(value) {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    return typeof value;
  }

  // Build the report as an array of objects (label + value + type)
  const report = [
    { label: "userName",    value: userName,    type: getType(userName) },
    { label: "age",         value: age,         type: getType(age) },
    { label: "isActive",    value: isActive,    type: getType(isActive) },
    { label: "hobbies",     value: JSON.stringify(hobbies), type: getType(hobbies) },
    { label: "address",     value: JSON.stringify(address), type: getType(address) },
    { label: "middleName",  value: String(middleName),      type: getType(middleName) },
    { label: "phoneNumber", value: String(phoneNumber),     type: getType(phoneNumber) },
  ];

  // One console.table() statement prints the whole report
  console.table(report);
}


/* ---------------------------------------------------------------------
   Q3. Monthly Expense Tracker
   --------------------------------------------------------------------- */
console.log("\n===== Q3. Monthly Expense Tracker =====");
{
  // Expenses for 5 categories: food, travel, rent, bills, leisure
  const expenses = [4500, 2000, 12000, 3000, 1500];

  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i];            // assignment operator (+=)
  }

  const average = total / expenses.length;

  // Add 10% tax using arithmetic + assignment operators
  let finalAmount = total;
  finalAmount += total * 0.10;       // same as total + 10% tax

  console.log(`Total Expenses      : ${total.toFixed(2)}`);
  console.log(`Average Expense     : ${average.toFixed(2)}`);
  console.log(`Final Amount (+10%) : ${finalAmount.toFixed(2)}`);
}


/* ---------------------------------------------------------------------
   Q4. Academic Performance Evaluator
   --------------------------------------------------------------------- */
console.log("\n===== Q4. Academic Performance Evaluator =====");
{
  // Marks of 5 subjects (each out of 100)
  const marks = [88, 92, 79, 85, 90];

  let totalMarks = 0;
  for (let i = 0; i < marks.length; i++) {
    totalMarks += marks[i];
  }

  const average = totalMarks / marks.length;
  const percentage = (totalMarks / (marks.length * 100)) * 100;

  // Validation: any subject < 35 -> automatically Detained
  let anySubjectFailed = false;
  for (let i = 0; i < marks.length; i++) {
    if (marks[i] < 35) {
      anySubjectFailed = true;
      break;
    }
  }

  console.log(`Average    : ${average.toFixed(2)}`);
  console.log(`Percentage : ${percentage.toFixed(2)}%`);

  if (anySubjectFailed || percentage < 50) {
    console.log("Detained");
  } else if (percentage >= 85) {
    console.log("Promoted with Distinction");
  } else if (percentage >= 50 && percentage < 85) {
    console.log("Promoted");
  }
}


/* ---------------------------------------------------------------------
   Q5. Weather Activity Planner
   --------------------------------------------------------------------- */
console.log("\n===== Q5. Weather Activity Planner =====");
{
  const temperature = 38;   // in °C
  const isRaining = false;
  const windSpeed = 10;     // in km/h

  if (isRaining) {
    console.log("Stay indoors with hot coffee.");
  } else if (temperature > 35) {
    console.log("Go swimming.");
  } else if (temperature < 15 && windSpeed > 20) {
    console.log("Too cold and windy — stay home.");
  } else {
    console.log("Perfect day for a walk.");
  }
}


/* ---------------------------------------------------------------------
   Q6. Progressive Discount System
   --------------------------------------------------------------------- */
console.log("\n===== Q6. Progressive Discount System =====");
{
  const totalAmount = 7500; // total purchase amount
  let discountPercent;

  if (totalAmount >= 10000) {
    discountPercent = 25;
  } else if (totalAmount >= 5000) {
    discountPercent = 15;
  } else if (totalAmount >= 2000) {
    discountPercent = 5;
  } else {
    discountPercent = 0;
  }

  const finalPrice = Math.round(totalAmount - (totalAmount * discountPercent) / 100);

  console.log(`Original Total      : ${totalAmount}`);
  console.log(`Discount Percentage : ${discountPercent}%`);
  console.log(`Final Price         : ${finalPrice}`);
}


/* ---------------------------------------------------------------------
   Q7. Smart Guessing Game (Number Range)
   --------------------------------------------------------------------- */
console.log("\n===== Q7. Smart Guessing Game =====");
{
  const secretNumber = Math.floor(Math.random() * 50) + 1; // 1 - 50
  const userGuess = 25;                                    // test value

  console.log(`Secret: ${secretNumber}, Your guess: ${userGuess}`);

  if (userGuess === secretNumber) {
    console.log("Correct guess!");
  } else {
    // Not exact - check whether it's within ±3
    if (userGuess >= secretNumber - 3 && userGuess <= secretNumber + 3) {
      console.log("Very close!");
    } else if (userGuess > secretNumber) {
      console.log("Too high");
    } else {
      console.log("Too low");
    }
  }
}


/* ---------------------------------------------------------------------
   Q8. Employee Salary Projection
   --------------------------------------------------------------------- */
console.log("\n===== Q8. Employee Salary Projection =====");
{
  let currentSalary = 50000;     // starting salary
  const incrementRate = 8;       // annual increment in %
  const projection = [];

  for (let year = 1; year <= 5; year++) {
    currentSalary += (currentSalary * incrementRate) / 100; // assignment operator
    projection.push({
      Year: year,
      Salary: Math.round(currentSalary), // rounded to nearest whole number
    });
  }

  console.table(projection);
}


/* ---------------------------------------------------------------------
   Q9. Random Math Quiz Generator
   --------------------------------------------------------------------- */
console.log("\n===== Q9. Random Math Quiz Generator =====");
{
  const operators = ["+", "-", "*", "/"];

  // Two random numbers between 1 and 20
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;

  // Random operator from the array
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let correctAnswer;

  switch (operator) {
    case "+":
      correctAnswer = num1 + num2;
      break;
    case "-":
      correctAnswer = num1 - num2;
      break;
    case "*":
      correctAnswer = num1 * num2;
      break;
    case "/":
      correctAnswer = (num1 / num2).toFixed(2); // rounded to 2 decimals
      break;
  }

  console.log(`Question       : ${num1} ${operator} ${num2} = ?`);
  console.log(`Correct Answer : ${correctAnswer}`);
}


/* ---------------------------------------------------------------------
   Q10. Citizen Eligibility Validator
   NOTE: The assignment's first two conditions overlap (a citizen aged
   18-20 also satisfies "citizen and age >= 18"). To make them
   mutually exclusive, "all services" is applied for citizens aged 21+
   (e.g., driving/passport thresholds), and "vote only" for citizens
   aged 18-20.
   --------------------------------------------------------------------- */
console.log("\n===== Q10. Citizen Eligibility Validator =====");
{
  const age = 19;
  const isCitizen = true;

  if (isCitizen) {
    if (age >= 21) {
      console.log("Eligible for all services.");
    } else if (age >= 18 && age <= 20) {
      console.log("Eligible to vote only.");
    } else {
      console.log("Not eligible yet.");
    }
  } else {
    if (age >= 18) {
      console.log("Only age criteria met.");
    } else {
      console.log("Not eligible yet.");
    }
  }
}
