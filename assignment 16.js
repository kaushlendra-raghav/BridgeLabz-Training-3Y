/* =========================================================================
   ASSIGNMENT 6 - Asynchronous JavaScript (all 10 questions in one file)

   How to run:
     Node.js (v18+ needed for fetch in Q6):  node assignment6.js
     Browser: paste the whole file into the console (Q6 will also add
              product cards to the page).

   The questions run one after another (see main() at the bottom) so that
   their console logs do not get mixed up.

   Failures are random. To test, change FAILURE_RATE below:
     0 = never fail, 1 = always fail.
   ========================================================================= */

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
const FAILURE_RATE = 0.2; // 20% chance of a simulated failure

// Returns a Promise that resolves after `ms` milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Random delay between 1000 ms and 2000 ms
const randomDelay = () => 1000 + Math.random() * 1000;

// Returns true with probability `rate`
const shouldFail = (rate = FAILURE_RATE) => Math.random() < rate;


/* =========================================================================
   Q1 - The Startup Morning: Async Coffee Maker
   Three async steps chained with .then(), failures handled with .catch()
   ========================================================================= */
function boilWater() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) return reject(new Error("Kettle broke while boiling water"));
      console.log("Step 1: Water boiled");
      resolve("hot water");
    }, randomDelay());
  });
}

function brewCoffee(water) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) return reject(new Error("Coffee machine jammed"));
      console.log(`Step 2: Coffee brewed using ${water}`);
      resolve("brewed coffee");
    }, randomDelay());
  });
}

function pourIntoCup(coffee) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) return reject(new Error("Cup slipped while pouring"));
      console.log(`Step 3: ${coffee} poured into cup`);
      resolve("cup of coffee");
    }, randomDelay());
  });
}

function q1() {
  // Returning the chain lets main() wait until it finishes
  return boilWater()
    .then((water) => brewCoffee(water))   // each .then receives the previous result
    .then((coffee) => pourIntoCup(coffee))
    .then(() => console.log("Coffee ready for the team!"))
    .catch((error) => console.log("Coffee process failed:", error.message)); // any step's rejection lands here
}


/* =========================================================================
   Q2 - Task Scheduler: Micro vs Macro Challenge
   Expected output order:
     Start
     Synchronous log
     End
     Promise.then callback (microtask)
     setTimeout callback (macrotask)

   WHY microtasks run before macrotasks:
   The event loop runs ALL synchronous code on the call stack first. When the
   stack is empty, it drains the ENTIRE microtask queue (Promise.then,
   queueMicrotask) before it picks up the next macrotask (setTimeout, I/O,
   UI events). So even a setTimeout of 0 ms has to wait: its callback is placed
   in the macrotask queue, while the resolved promise's callback is placed in
   the microtask queue, which always has priority after the current script.
   ========================================================================= */
function q2() {
  // The Promise executor runs synchronously, so the logs below behave exactly
  // like top-level script code. The Promise only lets main() know when we're done.
  return new Promise((resolve) => {
    console.log("Start");                                           // 1 (sync)

    setTimeout(() => {
      console.log("setTimeout callback (macrotask)");               // 5 (macrotask)
      resolve();
    }, 0);

    Promise.resolve().then(() => {
      console.log("Promise.then callback (microtask)");             // 4 (microtask)
    });

    console.log("Synchronous log");                                 // 2 (sync)
    console.log("End");                                             // 3 (sync)
  });
}


/* =========================================================================
   Q3 - Bug Tracker: Callback to Promise Migration
   ========================================================================= */

// Original callback-based function (kept for reference)
function fetchBugs(callback) {
  setTimeout(() => callback(["UI glitch", "API timeout", "Login failure"]), 1000);
}

// Promise-based version. `apiShouldFail` is the boolean that simulates an API error.
function getBugs(apiShouldFail = false) {
  return new Promise((resolve, reject) => {
    if (apiShouldFail) {
      // Simulated failure: reject after the same 1 second delay
      setTimeout(() => reject(new Error("API request failed")), 1000);
      return;
    }
    // Reuse the old callback function: resolve when its callback fires
    fetchBugs((bugs) => resolve(bugs));
  });
}

function q3() {
  const apiShouldFail = Math.random() < 0.3; // random boolean
  console.log(`API will ${apiShouldFail ? "FAIL" : "succeed"} this time`);

  return getBugs(apiShouldFail)
    .then((bugs) => {
      // Turn the array into rows with an index and a description
      console.table(bugs.map((bug, index) => ({ id: index + 1, bug })));
    })
    .catch((error) => console.log("Could not fetch bugs:", error.message));
}


/* =========================================================================
   Q4 - DevOps Delay: Async Timeout Race
   Server A = 2 s, Server B = 3 s
   ========================================================================= */
function deployToServer(name, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) return reject(new Error(`${name} failed to respond`));
      resolve(`${name} responded`);
    }, ms);
  });
}

function q4() {
  // Both servers start at the same time (concurrently)
  const serverA = deployToServer("Server A", 2000);
  const serverB = deployToServer("Server B", 3000);

  // Promise.all waits for BOTH (rejects as soon as one fails)
  const allDone = Promise.all([serverA, serverB])
    .then((results) => {
      console.log("Deployment completed for all servers");
      console.log("Details:", results);
    })
    .catch((error) => console.log("Deployment error (all):", error.message));

  // Promise.race settles with the FIRST promise to settle
  const firstDone = Promise.race([serverA, serverB])
    .then((winner) => console.log("Fastest response:", winner))
    .catch((error) => console.log("Deployment error (race):", error.message));

  // Wait for both handlers so main() moves on only when everything is printed
  return Promise.all([allDone, firstDone]);
}


/* =========================================================================
   Q5 - Frontend Rush: Avoiding Callback Hell
   design -> build -> test -> deploy -> celebrate (1 second each)
   ========================================================================= */

// ---- Version 1: nested callbacks (callback hell) ----
function stageWithCallback(name, callback) {
  setTimeout(() => {
    console.log(`  ${name}`);
    callback();
  }, 1000);
}

function pipelineWithCallbacks() {
  return new Promise((done) => {
    stageWithCallback("Design", () => {
      stageWithCallback("Build", () => {
        stageWithCallback("Test", () => {
          stageWithCallback("Deploy", () => {
            stageWithCallback("Celebrate", () => {
              done(); // the "pyramid of doom" ends here
            });
          });
        });
      });
    });
  });
}

// ---- Version 2: async/await ----
function stage(name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`  ${name}`);
      resolve();
    }, 1000);
  });
}

/*
  WHY async/await is more readable:
  - The code reads top to bottom, like synchronous code, instead of drifting
    to the right with every nested callback.
  - Adding, removing or reordering a stage is a one-line change.
  - One try/catch can handle errors from every stage, whereas callbacks
    need error handling repeated at every level.
*/
async function pipelineWithAsyncAwait() {
  await stage("Design");
  await stage("Build");
  await stage("Test");
  await stage("Deploy");
  await stage("Celebrate");
}

async function q5() {
  console.log("Using nested callbacks:");
  await pipelineWithCallbacks();
  console.log("Using async/await:");
  await pipelineWithAsyncAwait();
}


/* =========================================================================
   Q6 - E-Commerce Dashboard: Product Card Fetcher (Fake Store API)
   ========================================================================= */

// Bonus: build product cards with document.createElement (browser only)
function renderProductCards(products) {
  const container = document.createElement("div");
  Object.assign(container.style, {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "16px",
    padding: "16px",
    fontFamily: "Arial, sans-serif"
  });

  products.forEach((product) => {
    const card = document.createElement("div");
    Object.assign(card.style, {
      background: "#fff", borderRadius: "8px", padding: "12px",
      boxShadow: "0 1px 4px rgba(0,0,0,.2)", textAlign: "center"
    });

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    Object.assign(img.style, { height: "120px", objectFit: "contain" });

    const title = document.createElement("h4");
    title.textContent = product.title;
    title.style.fontSize = "13px";

    const price = document.createElement("p");
    price.textContent = `$${product.price}`;
    price.style.color = "green";
    price.style.fontWeight = "bold";

    card.append(img, title, price);
    container.appendChild(card);
  });

  document.body.appendChild(container);
}

async function q6() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`); // fetch does not reject on 404/500
    }
    const products = await response.json();

    products.forEach((product) => {
      console.log(`Product: ${product.title}`);
      console.log(`Price: $${product.price}`);
      console.log(`Image: ${product.image}`);
      console.log("---");
    });

    // Only run the DOM bonus when a page exists (not in Node.js)
    if (typeof document !== "undefined") {
      renderProductCards(products);
    }
  } catch (error) {
    console.log("Failed to load products. Please try again.");
    console.log("(Reason:", error.message + ")");
    if (typeof document !== "undefined") {
      const msg = document.createElement("p");
      msg.textContent = "Failed to load products. Please try again.";
      msg.style.color = "red";
      document.body.appendChild(msg);
    }
  }
}


/* =========================================================================
   Q7 - The Lazy Loader: Promise.allSettled()
   Same loaders as the question, plus an optional `fail` flag so that one of
   them can be rejected randomly.
   ========================================================================= */
function loadProfile(fail = false) {
  return new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("Profile failed")) : resolve("Profile Loaded")), 2000));
}
function loadPosts(fail = false) {
  return new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("Posts failed")) : resolve("Posts Loaded")), 1500));
}
function loadMessages(fail = false) {
  return new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("Messages failed")) : resolve("Messages Loaded")), 1000));
}

async function q7() {
  const startTime = Date.now();

  // Randomly pick which one of the three modules (0, 1 or 2) will reject
  const failingIndex = Math.floor(Math.random() * 3);
  const moduleNames = ["Profile", "Posts", "Messages"];
  console.log(`${moduleNames[failingIndex]} is set to fail this run`);

  // All three load at the same time; allSettled NEVER rejects, it reports every outcome
  const results = await Promise.allSettled([
    loadProfile(failingIndex === 0),
    loadPosts(failingIndex === 1),
    loadMessages(failingIndex === 2)
  ]);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`${moduleNames[index]}: SUCCESS -> ${result.value}`);
    } else {
      console.log(`${moduleNames[index]}: FAILED  -> ${result.reason.message}`);
    }
  });

  // Because they run in parallel, total time is about the slowest one (~2000 ms)
  console.log(`Total time taken: ${Date.now() - startTime} ms`);
}


/* =========================================================================
   Q8 - Order Processing Flow: Async Retry Mechanism
   ========================================================================= */

// Fails 50% of the time
function submitOrder() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) resolve("Order submitted");
      else reject(new Error("Server error"));
    }, 500);
  });
}

async function processOrder() {
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await submitOrder();                       // pause here until the promise settles
      console.log(`Attempt ${attempt}: Success`);
      return "Order processed";                  // success -> stop retrying
    } catch (error) {
      console.log(`Attempt ${attempt}: Failed`); // failure -> loop continues
    }
  }

  // Only reached when all attempts failed
  throw new Error("Order could not be processed");
}

async function q8() {
  try {
    const result = await processOrder();
    console.log("Result:", result);
  } catch (error) {
    console.log("Final failure:", error.message); // graceful handling
  }
}


/* =========================================================================
   Q9 - Debugging the Event Loop
   PREDICTED output order (written BEFORE running):
     1. Script start
     2. Script end
     3. Promise callback
     4. Timeout callback

   ACTUAL output: identical to the prediction.

   EXPLANATION:
   - "Script start" and "Script end" are synchronous, so they run first, in
     order, on the call stack.
   - setTimeout(..., 0) hands its callback to the timer; once due, it goes
     into the MACROTASK queue.
   - Promise.resolve().then(...) puts its callback straight into the
     MICROTASK queue.
   - When the script finishes, the event loop empties the microtask queue
     completely before taking the next macrotask. So "Promise callback" runs
     before "Timeout callback", even though the timeout was registered first
     and has a 0 ms delay.
   ========================================================================= */
function q9() {
  return new Promise((resolve) => {   // executor is synchronous, like top-level code
    console.log("Script start");

    setTimeout(() => {
      console.log("Timeout callback");
      resolve();                      // tell main() we're finished
    }, 0);

    Promise.resolve().then(() => console.log("Promise callback"));

    console.log("Script end");
  });
}


/* =========================================================================
   Q10 - The Final Delivery: Async Pipeline Debugger
   takeOrder -> prepare -> pack -> dispatch -> deliver

   EVENT LOOP NOTES:
   - Each step returns a Promise and uses setTimeout (a macrotask) to simulate
     1-2 seconds of work. While a timer is waiting, the call stack is empty,
     so the program is NOT blocked and other code could still run.
   - `await` pauses only runPipeline(), not the whole program. When the
     promise settles, its continuation is queued as a microtask and the
     function resumes from the same line.
   - If a promise rejects, `await` throws at that line and control jumps to
     the catch block, so later steps never run.
   ========================================================================= */

// Factory: builds a step that finishes after 1-2 s and may fail randomly
function makeStep(successMessage, failureMessage) {
  return function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail(FAILURE_RATE / 2)) reject(new Error(failureMessage));
        else resolve(successMessage);
      }, randomDelay());
    });
  };
}

const takeOrder = makeStep("Order taken", "Could not take the order");
const prepare   = makeStep("Food prepared", "Kitchen failed to prepare the food");
const pack      = makeStep("Package ready", "Packing failed");
const dispatch  = makeStep("Out for delivery", "No delivery partner available");
const deliver   = makeStep("Delivered", "Delivery failed");

async function runPipeline() {
  console.log("Start Pipeline");
  try {
    console.log(`Step 1: ${await takeOrder()}`);
    console.log(`Step 2: ${await prepare()}`);
    console.log(`Step 3: ${await pack()}`);
    console.log(`Step 4: ${await dispatch()}`);
    await deliver();
    console.log("Delivery completed!");
  } catch (error) {
    console.log("Pipeline failed!");
    console.log("Reason:", error.message);
  }
}

async function q10() {
  await runPipeline();
}


/* =========================================================================
   Runner: executes Q1 - Q10 one after another
   ========================================================================= */
async function main() {
  const questions = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];

  for (let i = 0; i < questions.length; i++) {
    console.log(`\n========== Q${i + 1} ==========`);
    try {
      await questions[i]();
    } catch (error) {
      // Safety net so one broken question never stops the rest
      console.log(`Unexpected error in Q${i + 1}:`, error.message);
    }
  }

  console.log("\nAll questions finished.");
}

main();
