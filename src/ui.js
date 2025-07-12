// src/ui.js

function app() {
    return {
        // --- State ---
        primaryData: null,
        reserveData: null,
        headers: [],
        primaryHeaders: null,
        reserveHeaders: null,
        selected: {}, // Object to track selected state of each header

        // --- Methods ---
        toggleSelection(header) {
            this.selected[header] = !this.selected[header];
        },

        handleFileUpload(event, type) {
            const file = event.target.files[0];
            if (!file) return;

            console.log(`Parsing ${type} file: ${file.name}`);
            
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log(`${type} data parsed successfully.`);
                    
                    if (type === 'primary') {
                        this.primaryData = results.data;
                        this.primaryHeaders = results.meta.fields;
                    } else {
                        this.reserveData = results.data;
                        this.reserveHeaders = results.meta.fields;
                    }

                    if (this.primaryHeaders && this.reserveHeaders) {
                        this.validateHeaders();
                    }
                },
                error: (error) => {
                    console.error(`Error parsing ${type} file:`, error);
                    alert(`An error occurred while parsing ${file.name}.`);
                }
            });
        },

        validateHeaders() {
            if (this.primaryHeaders.length !== this.reserveHeaders.length || 
                !this.primaryHeaders.every(h => this.reserveHeaders.includes(h))) {
                
                alert('Header mismatch: The column names in the two files do not match.');
                this.headers = []; // Clear headers on mismatch
                return;
            }

            console.log('Headers validated successfully!');
            this.headers = this.primaryHeaders;
            
            // Initialize the 'selected' state: all columns are selected by default
            this.selected = this.headers.reduce((acc, header) => {
                acc[header] = true;
                return acc;
            }, {});
        }
    };
}