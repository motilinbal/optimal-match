# Optimal-Match: Application Overview

## 1. Purpose

The **Optimal-Match** application is a client-side tool for researchers and data analysts. Its purpose is to find the best possible one-to-one replacements for missing items in a sample from a larger pool of reserve items.

It solves a common research problem: when individuals, schools, or other entities in a planned sample are non-responsive or drop out, a method is needed to select the most similar substitutes from a reserve pool to maintain the sample's integrity. This tool automates that matching process in a robust and accessible way.

---

## 2. Core Functionality

The application performs a sophisticated matching process based on user-provided data and configurations. The core logic finds the set of pairs that minimizes the overall "distance" or dissimilarity between the missing items and their replacements.

* **Input**: Two CSV files with identical column structures.
    * **Primary File**: Contains rows of missing items that need replacements.
    * **Reserve File**: Contains rows of all available items that can serve as replacements.
* **Engine**:
    1.  Calculates a **Gower distance** matrix. Gower's distance is a metric that measures the dissimilarity between two items, effectively handling both numerical (e.g., number of students) and categorical (e.g., district, sector) data.
    2.  Solves the assignment problem using the **Hungarian algorithm** to find the optimal pairings that result in the lowest possible total Gower distance across all matches.
* **Output**: A downloadable CSV file containing the final list of matched pairs, including the IDs of the primary item, the chosen reserve item, and the match distance score for each pair.

---

## 3. User Interaction Flow (A to Z)

1.  **Welcome Screen**: The user is greeted with a clean interface and two distinct upload boxes: one for the "Primary/Missing" file and one for the "Reserve/Pool" file.
2.  **File Upload**: The user uploads both CSV files. The application immediately parses the files in the browser.
    * **Validation**: The app checks if the column headers in both files are identical. If not, it displays a clear error message.
3.  **Column Configuration**:
    * **Matching Features**: After a successful upload, all column names appear as selectable "tags". The user can deselect any columns they wish to *exclude* from the matching calculation.
    * **Categorical Features**: Next to each selected column tag, a "Categorical" toggle switch is displayed. The app pre-selects these toggles for columns that appear to be text-based, but the user has the final say to ensure data types are correctly defined.
4.  **Initiate Matching**: The user clicks a "Find Matches" button.
5.  **Processing**: A loading indicator appears, assuring the user that the calculation is in progress. All heavy computation happens in a background Web Worker to keep the UI responsive.
6.  **Display Results**: Once the matching is complete, a results table is displayed directly on the page. This table shows the primary item, its matched reserve item, and the calculated distance score.
7.  **Export**: The user can click a "Download Results" button to save the complete results table as a new CSV file.