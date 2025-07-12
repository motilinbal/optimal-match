// src/ui.js

// --- DOM Elements ---
const primaryFileInput = document.getElementById('primary-file');
const reserveFileInput = document.getElementById('reserve-file');

// --- State Management ---
let primaryData = null;
let reserveData = null;
let primaryHeaders = null;
let reserveHeaders = null;

// --- Event Handlers ---
primaryFileInput.addEventListener('change', (event) => {
    handleFileUpload(event.target.files[0], 'primary');
});

reserveFileInput.addEventListener('change', (event) => {
    handleFileUpload(event.target.files[0], 'reserve');
});

// --- Functions ---
function handleFileUpload(file, type) {
    if (!file) return;

    console.log(`Parsing ${type} file: ${file.name}`);

    Papa.parse(file, {
        header: true, // Treat the first row as headers
        skipEmptyLines: true,
        complete: (results) => {
            console.log(`${type} data parsed successfully.`);
            
            if (type === 'primary') {
                primaryData = results.data;
                primaryHeaders = results.meta.fields;
            } else {
                reserveData = results.data;
                reserveHeaders = results.meta.fields;
            }

            // Once both files are uploaded, validate the headers
            if (primaryHeaders && reserveHeaders) {
                validateHeaders();
            }
        },
        error: (error) => {
            console.error(`Error parsing ${type} file:`, error);
            alert(`An error occurred while parsing ${file.name}.`);
        }
    });
}

function validateHeaders() {
    if (primaryHeaders.length !== reserveHeaders.length) {
        alert('Header mismatch: The two files have a different number of columns.');
        return false;
    }

    const allMatch = primaryHeaders.every(header => reserveHeaders.includes(header));

    if (!allMatch) {
        alert('Header mismatch: The column names in the two files do not match.');
        return false;
    }

    console.log('✅ Headers validated successfully!');
    // In the future, we will enable the "Find Matches" button here.
    return true;
}