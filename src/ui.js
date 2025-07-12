// src/ui.js

function app() {
    return {
        // --- State ---
        primaryData: null,
        reserveData: null,
        headers: [],
        primaryHeaders: null,
        reserveHeaders: null,
        selected: {}, 
        isCategorical: {}, // New state for categorical toggles

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

        isLikelyCategorical(header) {
            // Smart detection: check the first few rows of the primary data.
            // If a value is not a number, we assume the column is categorical.
            for (let i = 0; i < Math.min(5, this.primaryData.length); i++) {
                const value = this.primaryData[i][header];
                if (value && isNaN(parseFloat(value))) {
                    return true;
                }
            }
            return false;
        },

        validateHeaders() {
            if (this.primaryHeaders.length !== this.reserveHeaders.length || 
                !this.primaryHeaders.every(h => this.reserveHeaders.includes(h))) {
                
                alert('Header mismatch: The column names in the two files do not match.');
                this.headers = [];
                return;
            }

            console.log('Headers validated successfully!');
            this.headers = this.primaryHeaders;
            
            // Initialize the state for both selections and categorical toggles
            this.selected = {};
            this.isCategorical = {};
            this.headers.forEach(header => {
                this.selected[header] = true; // Select all by default
                this.isCategorical[header] = this.isLikelyCategorical(header); // Auto-detect type
            });
        }
    };
}