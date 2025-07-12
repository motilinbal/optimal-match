# Optimal-Match: Project Master Plan

This document outlines the development phases for the `optimal-match` application. It will serve as our guide throughout the project lifecycle, ensuring a structured and focused development process.

---

## Phase 1: Core Algorithm Development (The "Engine") ⚙️

**Goal:** Implement and rigorously test the core data matching logic in isolation. The UI is not a concern at this stage. All work will be done in plain JavaScript.

* **Task 1.1: Setup Test Harness:** Create a `tests` directory with a simple HTML file (`test-runner.html`) to run our JavaScript test files and log results to the console. We will use this to verify our logic.
* **Task 1.2: Implement Gower Distance:**
    * Create a dedicated file `src/gower.js`.
    * Develop the Gower distance function based on our research blueprint.
    * Create `tests/gower.test.js` to perform test-driven development (TDD), comparing our JS output against canonical Python results with sample data.
* **Task 1.3: Integrate Assignment Algorithm:**
    * Install the `@munkres/munkres` library.
    * Create `src/matcher.js` which will import the Gower function and the Munkres library. This module will orchestrate the full matching process (create cost matrix -> find assignments).
    * Create `tests/matcher.test.js` to validate the end-to-end matching logic.

---

## Phase 2: UI Scaffolding and File Handling 뼈대

**Goal:** Build the basic user interface and handle file inputs, but without connecting the core matching logic yet.

* **Task 2.1: Create Basic HTML Structure:** Develop `index.html` with placeholders for the two file inputs, the column selection area, and the results table.
* **Task 2.2: Implement File Parsing:**
    * Install `papaparse`.
    * Write the JavaScript in `src/ui.js` to handle file selection events, parse the uploaded CSVs using PapaParse, and log the parsed data to the console.
    * Implement header validation to ensure both files have identical columns.

---

## Phase 3: Interactive UI and Column Selection 🖱️

**Goal:** Implement the interactive column selection and data-type definition UI.

* **Task 3.1: Install UI Framework:** Install `Alpine.js`.
* **Task 3.2: Implement Column Tagging:** After a file is parsed, dynamically display its column headers as selectable "tags" using Alpine.js.
* **Task 3.3: Implement Categorical Toggles:** For each selected column tag, add the "Categorical" toggle switch. Implement the logic to pre-select toggles based on column content (e.g., if it contains non-numeric values).

---

## Phase 4: Integration with Web Workers 🧵

**Goal:** Connect the UI to the core matching engine via a Web Worker to ensure a non-blocking experience.

* **Task 4.1: Create the Web Worker:** Create `src/worker.js`. Move the logic from `src/matcher.js` into this worker file.
* **Task 4.2: Orchestrate the Data Flow:** In `src/ui.js`, add the logic to:
    1.  Send the parsed data and column configurations to the worker.
    2.  Display a loading indicator.
    3.  Listen for results back from the worker.
* **Task 4.3: Display Results:** Once results are received from the worker, use Alpine.js to dynamically render the final matching table in the UI.

---

## Phase 5: Finalization and Deployment 🚀

**Goal:** Polish the application and deploy it to GitHub Pages.

* **Task 5.1: Implement CSV Export:** Add the "Download Results as CSV" functionality.
* **Task 5.2: Styling and UX Polish:** Apply simple, clean CSS to make the application presentable. Add clear instructions, error messages, and progress indicators.
* **Task 5.3: Deploy to GitHub Pages:** Configure the repository to build and deploy the `main` branch using GitHub Pages.
* **Task 5.4: Final Documentation:** Create a `README.md` file with clear instructions on how to use the application, its limitations, and the technologies used.