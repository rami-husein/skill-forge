/**
 * wizard.js
 * Multi-step wizard controller and state management
 */

class SkillWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.formData = this.getDefaultFormData();
        this.autoSaveInterval = null;
        
        this.init();
    }
    
    /**
     * Get default/empty form data structure
     */
    getDefaultFormData() {
        return {
            name: '',
            description: '',
            instructions: `# Overview

## When to use this skill

## Step-by-step instructions

## Examples

## Common edge cases

## Next steps
`,
            license: '',
            licenseFile: '',
            compatibility: '',
            allowedTools: '',
            metadata: [],
            scripts: [],
            references: [],
            assets: []
        };
    }
    
    /**
     * Initialize the wizard
     */
    init() {
        this.setupEventListeners();
        this.updateStepIndicators();
        this.restoreDraft();
        this.startAutoSave();
        
        // Initialize line count for default instructions
        const lineCount = this.formData.instructions.split('\n').length;
        document.getElementById('instructionsLineCount').textContent = `${lineCount} lines`;
    }
    
    /**
     * Set up event listeners for wizard navigation
     */
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousStep());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        
        // Clear draft button
        document.getElementById('clearDraft').addEventListener('click', () => this.clearDraft());
        document.getElementById('dismissDraftNotif').addEventListener('click', () => {
            document.getElementById('draftNotification').classList.add('hidden');
        });
        
        // Form field listeners for auto-save
        this.attachFormListeners();
    }
    
    /**
     * Attach listeners to all form fields
     */
    attachFormListeners() {
        // Basic fields
        document.getElementById('skillName').addEventListener('input', (e) => {
            this.formData.name = e.target.value;
            this.validateField('name', e.target.value);
        });
        
        document.getElementById('skillDescription').addEventListener('input', (e) => {
            this.formData.description = e.target.value;
            this.validateField('description', e.target.value);
            this.updateCharCount('descriptionCharCount', e.target.value.length, 1024);
        });
        
        document.getElementById('skillInstructions').addEventListener('input', (e) => {
            this.formData.instructions = e.target.value;
            this.validateField('instructions', e.target.value);
            const lineCount = e.target.value.split('\n').length;
            document.getElementById('instructionsLineCount').textContent = `${lineCount} lines`;
        });
        
        document.getElementById('skillLicense').addEventListener('input', (e) => {
            this.formData.license = e.target.value;
        });
        
        document.getElementById('skillCompatibility').addEventListener('input', (e) => {
            this.formData.compatibility = e.target.value;
            this.validateField('compatibility', e.target.value);
            this.updateCharCount('compatibilityCharCount', e.target.value.length, 500);
        });
        
        document.getElementById('skillAllowedTools').addEventListener('input', (e) => {
            this.formData.allowedTools = e.target.value;
        });
        
        // Add metadata button
        document.getElementById('addMetadata').addEventListener('click', () => this.addMetadataField());
        
        // Add component buttons
        document.getElementById('addScript').addEventListener('click', () => this.addScriptField());
        document.getElementById('addReference').addEventListener('click', () => this.addReferenceField());
        document.getElementById('addAsset').addEventListener('click', () => this.addAssetField());
    }
    
    /**
     * Validate a field and display feedback
     */
    validateField(fieldName, value) {
        let result;
        const inputElement = document.getElementById(`skill${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
        const feedbackElement = document.getElementById(`skill${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}Feedback`);
        
        switch(fieldName) {
            case 'name':
                result = ValidationRules.name.validate(value);
                break;
            case 'description':
                result = ValidationRules.description.validate(value);
                break;
            case 'instructions':
                result = ValidationRules.instructions.validate(value);
                break;
            case 'compatibility':
                result = ValidationRules.compatibility.validate(value);
                break;
            default:
                return;
        }
        
        if (feedbackElement) {
            displayValidationFeedback(feedbackElement, result);
        }
        if (inputElement) {
            updateInputBorder(inputElement, result);
        }
    }
    
    /**
     * Update character count display
     */
    updateCharCount(elementId, current, max) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = `${current} / ${max}`;
            if (current > max) {
                element.classList.add('text-red-500');
                element.classList.remove('text-gray-500');
            } else {
                element.classList.remove('text-red-500');
                element.classList.add('text-gray-500');
            }
        }
    }
    
    /**
     * Navigate to next step
     */
    nextStep() {
        // Validate current step
        if (!this.validateCurrentStep()) {
            return;
        }
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateView();
        }
    }
    
    /**
     * Navigate to previous step
     */
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateView();
        }
    }
    
    /**
     * Validate the current step
     */
    validateCurrentStep() {
        switch(this.currentStep) {
            case 1: // Basic Information
                const nameResult = ValidationRules.name.validate(this.formData.name);
                const descResult = ValidationRules.description.validate(this.formData.description);
                
                if (!nameResult.valid || !descResult.valid) {
                    // Show validation errors
                    this.validateField('name', this.formData.name);
                    this.validateField('description', this.formData.description);
                    return false;
                }
                return true;
                
            case 2: // Instructions
                const instrResult = ValidationRules.instructions.validate(this.formData.instructions);
                
                if (!instrResult.valid) {
                    this.validateField('instructions', this.formData.instructions);
                    return false;
                }
                return true;
                
            case 3: // Metadata (all optional, always valid)
                return true;
                
            case 4: // Components (all optional, always valid)
                return true;
                
            case 5: // Review
                return true;
                
            default:
                return true;
        }
    }
    
    /**
     * Update the view when navigating steps
     */
    updateView() {
        // Hide all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            document.getElementById(`step${i}`).classList.add('hidden');
        }
        
        // Show current step
        document.getElementById(`step${this.currentStep}`).classList.remove('hidden');
        
        // Update step indicators
        this.updateStepIndicators();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // If on review step, populate review content
        if (this.currentStep === 5) {
            this.populateReviewStep();
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    /**
     * Update step indicator visuals
     */
    updateStepIndicators() {
        const indicators = document.querySelectorAll('.step-indicator');
        const connectors = document.querySelectorAll('.step-connector');
        
        indicators.forEach((indicator, index) => {
            const step = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (step < this.currentStep) {
                indicator.classList.add('completed');
            } else if (step === this.currentStep) {
                indicator.classList.add('active');
            }
        });
        
        connectors.forEach((connector, index) => {
            const step = index + 1;
            if (step < this.currentStep) {
                connector.classList.add('completed');
            } else {
                connector.classList.remove('completed');
            }
        });
    }
    
    /**
     * Update navigation button states
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const generateButtons = document.getElementById('generateButtons');
        
        // Previous button
        prevBtn.disabled = this.currentStep === 1;
        
        // Next button and generate buttons
        if (this.currentStep === this.totalSteps) {
            nextBtn.classList.add('hidden');
            generateButtons.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            generateButtons.classList.add('hidden');
            nextBtn.textContent = 'Next';
        }
    }
    
    /**
     * Populate the review step with summary data
     */
    populateReviewStep() {
        // Validation summary
        const validationResult = validateAll(this.formData);
        const validationSummary = document.getElementById('validationSummary');
        
        if (validationResult.valid) {
            validationSummary.className = 'p-4 rounded-lg border bg-green-50 border-green-200';
            validationSummary.innerHTML = `
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                        <h4 class="text-sm font-semibold text-green-900">All validations passed!</h4>
                        <p class="text-sm text-green-800 mt-1">Your skill is ready to generate.</p>
                    </div>
                </div>
            `;
        } else {
            validationSummary.className = 'p-4 rounded-lg border bg-red-50 border-red-200';
            const errors = Object.values(validationResult.fields)
                .filter(f => !f.valid)
                .flatMap(f => f.errors);
            validationSummary.innerHTML = `
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                        <h4 class="text-sm font-semibold text-red-900">Validation errors found:</h4>
                        <ul class="text-sm text-red-800 mt-1 list-disc list-inside">
                            ${errors.map(err => `<li>${err}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        // Directory structure
        document.getElementById('directoryPreview').textContent = generateDirectoryStructure(this.formData);
        
        // Summary content
        document.getElementById('summaryContent').innerHTML = generateSummaryContent(this.formData);
    }
    
    /**
     * Add a metadata field
     */
    addMetadataField(key = '', value = '') {
        const container = document.getElementById('metadataContainer');
        const index = this.formData.metadata.length;
        
        const metadataItem = document.createElement('div');
        metadataItem.className = 'flex gap-2 items-start';
        metadataItem.innerHTML = `
            <input 
                type="text" 
                placeholder="key" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm metadata-key"
                value="${key}"
                data-index="${index}"
            >
            <input 
                type="text" 
                placeholder="value" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm metadata-value"
                value="${value}"
                data-index="${index}"
            >
            <button type="button" class="px-3 py-2 text-red-600 hover:text-red-800 remove-metadata">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;
        
        container.appendChild(metadataItem);
        
        // Add to formData
        this.formData.metadata.push({ key, value });
        
        // Add event listeners
        const keyInput = metadataItem.querySelector('.metadata-key');
        const valueInput = metadataItem.querySelector('.metadata-value');
        const removeBtn = metadataItem.querySelector('.remove-metadata');
        
        keyInput.addEventListener('input', (e) => {
            this.formData.metadata[index].key = e.target.value;
        });
        
        valueInput.addEventListener('input', (e) => {
            this.formData.metadata[index].value = e.target.value;
        });
        
        removeBtn.addEventListener('click', () => {
            metadataItem.remove();
            this.formData.metadata.splice(index, 1);
        });
    }
    
    /**
     * Add a script field
     */
    addScriptField(filename = '', content = '') {
        const container = document.getElementById('scriptsContainer');
        const index = this.formData.scripts.length;
        
        const scriptItem = document.createElement('div');
        scriptItem.className = 'component-item';
        scriptItem.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <input 
                    type="text" 
                    placeholder="script.py" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono script-filename"
                    value="${filename}"
                    data-index="${index}"
                >
                <button type="button" class="ml-2 px-3 py-2 text-red-600 hover:text-red-800 remove-script">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
            <textarea 
                placeholder="# Your script code here" 
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono script-content"
                data-index="${index}"
            >${content}</textarea>
        `;
        
        container.appendChild(scriptItem);
        
        // Add to formData
        this.formData.scripts.push({ filename, content });
        
        // Add event listeners
        const filenameInput = scriptItem.querySelector('.script-filename');
        const contentInput = scriptItem.querySelector('.script-content');
        const removeBtn = scriptItem.querySelector('.remove-script');
        
        filenameInput.addEventListener('input', (e) => {
            this.formData.scripts[index].filename = e.target.value;
        });
        
        contentInput.addEventListener('input', (e) => {
            this.formData.scripts[index].content = e.target.value;
        });
        
        removeBtn.addEventListener('click', () => {
            scriptItem.remove();
            this.formData.scripts.splice(index, 1);
        });
    }
    
    /**
     * Add a reference field
     */
    addReferenceField(filename = '', content = '') {
        const container = document.getElementById('referencesContainer');
        const index = this.formData.references.length;
        
        const refItem = document.createElement('div');
        refItem.className = 'component-item';
        refItem.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <input 
                    type="text" 
                    placeholder="REFERENCE.md" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono reference-filename"
                    value="${filename}"
                    data-index="${index}"
                >
                <button type="button" class="ml-2 px-3 py-2 text-red-600 hover:text-red-800 remove-reference">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
            <textarea 
                placeholder="# Reference documentation (Markdown)" 
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono reference-content"
                data-index="${index}"
            >${content}</textarea>
        `;
        
        container.appendChild(refItem);
        
        // Add to formData
        this.formData.references.push({ filename, content });
        
        // Add event listeners
        const filenameInput = refItem.querySelector('.reference-filename');
        const contentInput = refItem.querySelector('.reference-content');
        const removeBtn = refItem.querySelector('.remove-reference');
        
        filenameInput.addEventListener('input', (e) => {
            this.formData.references[index].filename = e.target.value;
        });
        
        contentInput.addEventListener('input', (e) => {
            this.formData.references[index].content = e.target.value;
        });
        
        removeBtn.addEventListener('click', () => {
            refItem.remove();
            this.formData.references.splice(index, 1);
        });
    }
    
    /**
     * Add an asset field
     */
    addAssetField(filename = '', content = '') {
        const container = document.getElementById('assetsContainer');
        const index = this.formData.assets.length;
        
        const assetItem = document.createElement('div');
        assetItem.className = 'component-item';
        assetItem.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <input 
                    type="text" 
                    placeholder="template.json" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono asset-filename"
                    value="${filename}"
                    data-index="${index}"
                >
                <button type="button" class="ml-2 px-3 py-2 text-red-600 hover:text-red-800 remove-asset">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
            <textarea 
                placeholder="Asset content (text-based files only)" 
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono asset-content"
                data-index="${index}"
            >${content}</textarea>
        `;
        
        container.appendChild(assetItem);
        
        // Add to formData
        this.formData.assets.push({ filename, content });
        
        // Add event listeners
        const filenameInput = assetItem.querySelector('.asset-filename');
        const contentInput = assetItem.querySelector('.asset-content');
        const removeBtn = assetItem.querySelector('.remove-asset');
        
        filenameInput.addEventListener('input', (e) => {
            this.formData.assets[index].filename = e.target.value;
        });
        
        contentInput.addEventListener('input', (e) => {
            this.formData.assets[index].content = e.target.value;
        });
        
        removeBtn.addEventListener('click', () => {
            assetItem.remove();
            this.formData.assets.splice(index, 1);
        });
    }
    
    /**
     * Save form data to localStorage
     */
    saveDraft() {
        try {
            localStorage.setItem('agentskill-builder-draft', JSON.stringify(this.formData));
            localStorage.setItem('agentskill-builder-step', this.currentStep.toString());
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    }
    
    /**
     * Restore form data from localStorage
     */
    restoreDraft() {
        try {
            const savedData = localStorage.getItem('agentskill-builder-draft');
            const savedStep = localStorage.getItem('agentskill-builder-step');
            
            if (savedData) {
                this.formData = JSON.parse(savedData);
                
                // Restore form field values
                document.getElementById('skillName').value = this.formData.name || '';
                document.getElementById('skillDescription').value = this.formData.description || '';
                document.getElementById('skillInstructions').value = this.formData.instructions || '';
                document.getElementById('skillLicense').value = this.formData.license || '';
                document.getElementById('skillCompatibility').value = this.formData.compatibility || '';
                document.getElementById('skillAllowedTools').value = this.formData.allowedTools || '';
                
                // Update character counts
                this.updateCharCount('descriptionCharCount', this.formData.description?.length || 0, 1024);
                this.updateCharCount('compatibilityCharCount', this.formData.compatibility?.length || 0, 500);
                
                // Update line count
                const lineCount = (this.formData.instructions || '').split('\n').length;
                document.getElementById('instructionsLineCount').textContent = `${lineCount} lines`;
                
                // Restore metadata
                if (this.formData.metadata) {
                    this.formData.metadata.forEach(m => this.addMetadataField(m.key, m.value));
                }
                
                // Restore scripts
                if (this.formData.scripts) {
                    this.formData.scripts.forEach(s => this.addScriptField(s.filename, s.content));
                }
                
                // Restore references
                if (this.formData.references) {
                    this.formData.references.forEach(r => this.addReferenceField(r.filename, r.content));
                }
                
                // Restore assets
                if (this.formData.assets) {
                    this.formData.assets.forEach(a => this.addAssetField(a.filename, a.content));
                }
                
                // Restore step
                if (savedStep) {
                    this.currentStep = parseInt(savedStep, 10);
                    this.updateView();
                }
                
                // Show notification
                document.getElementById('draftNotification').classList.remove('hidden');
                document.getElementById('clearDraft').classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error restoring draft:', error);
        }
    }
    
    /**
     * Clear saved draft
     */
    clearDraft() {
        if (confirm('Are you sure you want to clear your draft? This cannot be undone.')) {
            localStorage.removeItem('agentskill-builder-draft');
            localStorage.removeItem('agentskill-builder-step');
            location.reload();
        }
    }
    
    /**
     * Start auto-save timer
     */
    startAutoSave() {
        // Debounced auto-save every 2 seconds
        let timeout;
        const autoSave = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.saveDraft();
            }, 2000);
        };
        
        // Listen to all input events
        document.addEventListener('input', autoSave);
    }
}
