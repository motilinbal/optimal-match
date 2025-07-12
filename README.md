# Optimal Match Finder

A lightweight, client-side web application for researchers to find optimal replacements for missing items in a sample. The app is built with vanilla JavaScript, runs entirely in the browser, and is suitable for hosting on static platforms like GitHub Pages.

## 🚀 Features

-   **Client-Side Processing:** No server required. All calculations happen in your browser.
-   **CSV Upload:** Easily upload your "primary" (missing) and "reserve" (pool) data files.
-   **Interactive Configuration:** Visually select which data columns to use for matching and define their data types (categorical or numerical).
-   **Optimal Matching:** Uses the Gower distance metric to handle mixed data types and the Hungarian algorithm to find the globally optimal one-to-one assignments.
-   **Non-Blocking UI:** Leverages Web Workers to perform heavy calculations in the background, ensuring the user interface never freezes.
-   **Export Results:** Download the final list of matched pairs as a new CSV file.

## 🛠️ How It Works

1.  **Upload Files:** Provide two CSV files: one with the items to be replaced, and one with the pool of potential replacements. The files must have identical column headers.
2.  **Configure Columns:** After the files are validated, all column headers appear as tags.
    -   Click a tag to include or exclude it from the matching calculation.
    -   Use the "Categorical" checkbox to define the data type for each column. The app attempts to auto-detect this based on the data.
3.  **Find Matches:** Click the "Find Matches" button to start the calculation.
4.  **View & Export:** The results are displayed in a table, and you can download them as a CSV file.

## 💻 Tech Stack

-   **Core Logic:** Vanilla JavaScript (ES6 Modules)
-   **UI Framework:** [Alpine.js](https://alpinejs.dev/) for lightweight reactivity.
-   **CSV Parsing:** [PapaParse](https://www.papaparse.com/)
-   **Assignment Algorithm:** An efficient, bundled implementation of the Hungarian algorithm from `@munkres/munkres`.
-   **Asynchronous Processing:** Web Workers

This project was developed without any build tools (like Webpack or Vite) to maintain a simple, transparent architecture.