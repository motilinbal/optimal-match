# Optimal Match Finder: A Detailed User Guide

Welcome to the Optimal Match Finder! This guide will walk you through the entire process of using the application, from preparing your data to interpreting the results.

## 1. Background: The Challenge of Missing Samples

In research, we often draw a **sample** from a larger population to make our studies manageable. To ensure the sample accurately represents the population, it's often divided into subgroups based on shared characteristics. Each subgroup is called a **stratum**.

For example, a stratum could be "all 3rd-grade classes in the Northern geographical district under public supervision." Stratifying ensures that different groups are properly represented.

A common problem arises when items from the original sample become unavailable (e.g., a school declines to participate). Simply picking a random replacement can skew the data. The goal is to find a replacement from the **same stratum** that is as similar as possible to the one that went missing. This application automates that process.

---

## 2. Preparing Your Data Files

The application requires two CSV files. Both files **must have the exact same column structure and headers**. The tool operates on one stratum at a time.

### The ID Column

**Crucially, the application assumes the very first (leftmost) column in both your files is the unique identifier for each item** (e.g., `class_id`, `student_id`). This ID is used to generate the final report, so ensure your data follows this structure.

### The Two Files Explained

1.  **Primary File (`primary.csv`)**
    * **What it is:** This file contains the list of items that *were* selected for your original sample but are now missing or non-responsive.
    * **Content:** Each row represents one missing item from the stratum.

2.  **Reserve File (`reserve.csv`)**
    * **What it is:** This file is the pool of all available replacements.
    * **Content:** It should contain all other items from the *same stratum* that were *not* chosen for the original sample.

---

## 3. Using the Application: Step-by-Step

### Step 1: Upload Your Files

Use the two upload boxes to select your Primary and Reserve CSV files. The application will immediately parse them. If the headers don't match perfectly, you will receive an error message.

### Step 2: Configure Matching Features

Once the files are validated, a list of all column headers will appear as selectable tags. This is the most important configuration step.

* **What it does:** You are telling the Gower distance algorithm which characteristics are important for determining similarity.
* **How to use it:** By default, all columns are selected (blue). To **exclude** a column from the matching calculation, simply click on its tag. It will turn grey, indicating it will be ignored.

**Example:** You might want to find a replacement class based on its educational characteristics (`Sector`, `Grade`) but not its specific `school_id`. In this case, you would deselect the `school_id` column.

### Step 3: Define Column Types (Categorical vs. Numerical)

Below each selected column tag is a "Categorical" checkbox. This tells the algorithm *how* to compare the values in that column.

* **Numerical Columns:** These are measurable quantities (e.g., `assigned_and_approved_students`, `age`). The application will calculate similarity based on how close the numbers are. **For these columns, leave the box unchecked.**

* **Categorical Columns:** These are labels, groups, or identifiers (e.g., `Geographical_District`, `Sector`, `school_id`). The application will check if the labels are an exact match (Yes/No). **For these columns, check the box.**

The application will try to **auto-detect** which columns are categorical by checking for non-numeric text. However, you should **always verify** that its selections are correct for your specific data. For example, a `school_id` might look like a number, but since you are matching on the exact ID, it should be treated as a **categorical** variable.

### Step 4: Run the Match

Once your configuration is set, click the **"Find Matches"** button. A progress bar will appear to provide feedback during the calculation.

---

## 4. Interpreting and Using the Results

### The Output

After the calculation is complete, a results table will appear on the page. This table shows the optimal one-to-one pairings found by the algorithm.

* **Primary ID:** The ID from the first column of your Primary file.
* **Matched Reserve ID:** The ID from the first column of the Reserve file that was found to be the best possible match for that primary item.

You can then click the **"Download Results as CSV"** button to save this list of pairs.

### Downstream Processing

The downloaded CSV file is your final action plan. You can now use this list to update your master dataset for the study. For each `primary_class_id` in the results file, you will replace it with its corresponding `reserve_class_id`. This restores your sample to its intended size while ensuring the replacements are as statistically similar to the originals as possible, maintaining the integrity of your research.