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
        isNumerical: {}, // Changed from isCategorical - now tracks numerical columns
        isTextOnly: {}, // To disable checkbox for text-only columns
        isLoading: false, // For the loading indicator
        results: null, // To store the final results
        progressMessage: '', // New state for progress
        progressPercent: 0,  // New state for progress

        // --- Methods ---
        runMatch() {
            this.isLoading = true;
            this.results = null;
            this.progressMessage = 'Preparing calculation...';
            this.progressPercent = 0;
            console.log('UI: Starting match process...');

            const config = {
                features: this.headers.filter(h => this.selected[h]),
                isCategorical: this.headers
                    .filter(h => this.selected[h])
                    .map(h => !this.isNumerical[h]) // Invert: if not numerical, then categorical
            };

            const worker = new Worker('src/worker.js', { type: 'module' });

            worker.onmessage = (event) => {
                const { type, message, percent, assignments } = event.data;

                if (type === 'progress') {
                    // Update progress state
                    this.progressMessage = message;
                    this.progressPercent = percent;
                } else if (type === 'complete') {
                    // Final result received
                    this.results = assignments;
                    this.isLoading = false;
                    worker.terminate();
                    console.log('Final Assignments:', this.results);
                }
            };

            // FIX: Create plain copies of the data to remove the Alpine Proxy wrapper.
            const plainPrimaryData = JSON.parse(JSON.stringify(this.primaryData));
            const plainReserveData = JSON.parse(JSON.stringify(this.reserveData));

            // Send the clean data to the worker.
            worker.postMessage({
                primaryData: plainPrimaryData,
                reserveData: plainReserveData,
                config: config
            });
        },

        exportResults() {
            if (!this.results || this.results.length === 0) {
                alert('No results to export.');
                return;
            }
            
            // 1. Create a new array of objects for the CSV data.
            const exportData = this.results.map(match => {
                const primaryIndex = match[0];
                const reserveIndex = match[1];
                return {
                    primary_class_id: this.primaryData[primaryIndex].class_id,
                    reserve_class_id: this.reserveData[reserveIndex].class_id,
                    // You can add any other columns you want here, for example:
                    // primary_school_id: this.primaryData[primaryIndex].school_id,
                    // reserve_school_id: this.reserveData[reserveIndex].school_id,
                };
            });

            // 2. Convert the data to a CSV string using PapaParse.
            const csvString = Papa.unparse(exportData);

            // 3. Create a blob and trigger a download.
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'optimal-match-results.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

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

        detectColumnTypes() {
            const numericalFlags = {};
            const textOnlyFlags = {};
            const combinedData = [...this.primaryData, ...this.reserveData];

            this.headers.forEach(header => {
                const values = combinedData.map(d => d[header]).filter(v => v !== null && v !== '' && v !== undefined);

                // Tier 1: Text-based check
                const hasText = values.some(v => isNaN(parseFloat(v)));
                if (hasText) {
                    numericalFlags[header] = false; // Categorical
                    textOnlyFlags[header] = true; // Disable checkbox - definitely categorical
                    return;
                }
                
                textOnlyFlags[header] = false; // Enable checkbox

                // Tier 2: Sequential integer check
                const uniqueNumbers = [...new Set(values.map(v => parseInt(v, 10)))];
                if (uniqueNumbers.every(n => Number.isInteger(n))) {
                    uniqueNumbers.sort((a, b) => a - b);
                    const isSequential = uniqueNumbers.length > 1 && 
                                         uniqueNumbers[0] === 1 && 
                                         uniqueNumbers[uniqueNumbers.length - 1] === uniqueNumbers.length;
                    if (isSequential) {
                        numericalFlags[header] = false; // Likely categorical (sequential integers)
                        return;
                    }
                }

                // Tier 3: Default to numerical
                numericalFlags[header] = true;
            });
            
            this.isNumerical = numericalFlags;
            this.isTextOnly = textOnlyFlags;
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
            
            // Initialize selection state - all columns selected by default
            this.selected = this.headers.reduce((acc, h) => ({...acc, [h]: true}), {});
            
            // Run the new, sophisticated auto-detection
            this.detectColumnTypes();
        }
    };
}