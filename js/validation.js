/**
 * validation.js
 * Validation rules and helpers for Agent Skill Builder
 * Based on the Agent Skills specification
 */

const ValidationRules = {
    // Skill name validation
    name: {
        pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/,
        minLength: 1,
        maxLength: 64,
        
        validate: function(value) {
            const errors = [];
            const warnings = [];
            
            // Required check
            if (!value || value.trim() === '') {
                errors.push('Skill name is required');
                return { valid: false, errors, warnings };
            }
            
            const trimmed = value.trim();
            
            // Length check
            if (trimmed.length < this.minLength) {
                errors.push('Skill name must be at least 1 character');
            }
            if (trimmed.length > this.maxLength) {
                errors.push(`Skill name must not exceed ${this.maxLength} characters`);
            }
            
            // Pattern check
            if (!this.pattern.test(trimmed)) {
                if (/[A-Z]/.test(trimmed)) {
                    errors.push('Skill name must be lowercase only');
                }
                if (/^-/.test(trimmed)) {
                    errors.push('Skill name cannot start with a hyphen');
                }
                if (/-$/.test(trimmed)) {
                    errors.push('Skill name cannot end with a hyphen');
                }
                if (/--/.test(trimmed)) {
                    errors.push('Skill name cannot contain consecutive hyphens');
                }
                if (/[^a-z0-9-]/.test(trimmed)) {
                    errors.push('Skill name can only contain lowercase letters, numbers, and hyphens');
                }
            }
            
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    },
    
    // Description validation
    description: {
        minLength: 1,
        maxLength: 1024,
        
        validate: function(value) {
            const errors = [];
            const warnings = [];
            
            // Required check
            if (!value || value.trim() === '') {
                errors.push('Description is required');
                return { valid: false, errors, warnings };
            }
            
            const trimmed = value.trim();
            
            // Length check
            if (trimmed.length < this.minLength) {
                errors.push('Description must be at least 1 character');
            }
            if (trimmed.length > this.maxLength) {
                errors.push(`Description must not exceed ${this.maxLength} characters (currently ${trimmed.length})`);
            }
            
            // Quality checks (warnings)
            if (trimmed.length < 50) {
                warnings.push('Consider adding more detail about what the skill does and when to use it');
            }
            
            const lowerDesc = trimmed.toLowerCase();
            if (!lowerDesc.includes('when') && !lowerDesc.includes('use')) {
                warnings.push('Consider including when to use this skill');
            }
            
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    },
    
    // Instructions validation
    instructions: {
        recommendedMaxLines: 500,
        
        validate: function(value) {
            const errors = [];
            const warnings = [];
            
            // Required check
            if (!value || value.trim() === '') {
                errors.push('Instructions are required');
                return { valid: false, errors, warnings };
            }
            
            const trimmed = value.trim();
            const lineCount = trimmed.split('\n').length;
            
            // Line count recommendation
            if (lineCount > this.recommendedMaxLines) {
                warnings.push(`Instructions exceed ${this.recommendedMaxLines} lines. Consider moving detailed content to reference files.`);
            }
            
            // Quality checks (warnings)
            if (lineCount < 10) {
                warnings.push('Consider adding more detailed instructions, examples, and edge cases');
            }
            
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    },
    
    // Compatibility validation
    compatibility: {
        maxLength: 500,
        
        validate: function(value) {
            const errors = [];
            const warnings = [];
            
            // Optional field - skip if empty
            if (!value || value.trim() === '') {
                return { valid: true, errors, warnings };
            }
            
            const trimmed = value.trim();
            
            // Length check
            if (trimmed.length > this.maxLength) {
                errors.push(`Compatibility must not exceed ${this.maxLength} characters (currently ${trimmed.length})`);
            }
            
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    },
    
    // Filename validation for scripts, references, and assets
    filename: {
        pattern: /^[a-zA-Z0-9_.-]+$/,
        
        validate: function(value, type = 'file') {
            const errors = [];
            const warnings = [];
            
            if (!value || value.trim() === '') {
                errors.push('Filename is required');
                return { valid: false, errors, warnings };
            }
            
            const trimmed = value.trim();
            
            // Pattern check
            if (!this.pattern.test(trimmed)) {
                errors.push('Filename can only contain letters, numbers, underscores, dots, and hyphens');
            }
            
            // Extension checks
            if (!trimmed.includes('.')) {
                warnings.push('Consider adding a file extension');
            }
            
            // Path check
            if (trimmed.includes('/') || trimmed.includes('\\')) {
                errors.push('Filename should not include path separators');
            }
            
            // Reserved names
            const reserved = ['SKILL.md', 'LICENSE.txt', 'README.md'];
            if (reserved.includes(trimmed)) {
                warnings.push(`${trimmed} is a reserved filename`);
            }
            
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    },
    
    // Metadata key validation
    metadataKey: {
        pattern: /^[a-zA-Z0-9_-]+$/,
        
        validate: function(value) {
            const errors = [];
            const warnings = [];
            
            if (!value || value.trim() === '') {
                errors.push('Metadata key is required');
                return { valid: false, errors, warnings };
            }
            
            const trimmed = value.trim();
            
            // Pattern check
            if (!this.pattern.test(trimmed)) {
                errors.push('Metadata key can only contain letters, numbers, underscores, and hyphens');
            }
            
            // Recommendations
            if (trimmed.length > 50) {
                warnings.push('Consider using a shorter metadata key');
            }
            
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    }
};

/**
 * Validates all form data
 * @param {Object} formData - The complete form data
 * @returns {Object} Validation results with overall validity and field-specific results
 */
function validateAll(formData) {
    const results = {
        valid: true,
        fields: {}
    };
    
    // Validate required fields
    results.fields.name = ValidationRules.name.validate(formData.name);
    results.fields.description = ValidationRules.description.validate(formData.description);
    results.fields.instructions = ValidationRules.instructions.validate(formData.instructions);
    
    // Validate optional fields if present
    if (formData.compatibility) {
        results.fields.compatibility = ValidationRules.compatibility.validate(formData.compatibility);
    }
    
    // Validate metadata keys
    if (formData.metadata && Array.isArray(formData.metadata)) {
        formData.metadata.forEach((item, index) => {
            if (item.key) {
                const keyResult = ValidationRules.metadataKey.validate(item.key);
                if (!keyResult.valid) {
                    results.fields[`metadata_key_${index}`] = keyResult;
                }
            }
        });
    }
    
    // Validate scripts filenames
    if (formData.scripts && Array.isArray(formData.scripts)) {
        formData.scripts.forEach((script, index) => {
            if (script.filename) {
                const filenameResult = ValidationRules.filename.validate(script.filename, 'script');
                if (!filenameResult.valid) {
                    results.fields[`script_filename_${index}`] = filenameResult;
                }
            }
        });
    }
    
    // Validate references filenames
    if (formData.references && Array.isArray(formData.references)) {
        formData.references.forEach((ref, index) => {
            if (ref.filename) {
                const filenameResult = ValidationRules.filename.validate(ref.filename, 'reference');
                if (!filenameResult.valid) {
                    results.fields[`reference_filename_${index}`] = filenameResult;
                }
            }
        });
    }
    
    // Validate assets filenames
    if (formData.assets && Array.isArray(formData.assets)) {
        formData.assets.forEach((asset, index) => {
            if (asset.filename) {
                const filenameResult = ValidationRules.filename.validate(asset.filename, 'asset');
                if (!filenameResult.valid) {
                    results.fields[`asset_filename_${index}`] = filenameResult;
                }
            }
        });
    }
    
    // Check overall validity
    results.valid = Object.values(results.fields).every(field => field.valid);
    
    return results;
}

/**
 * Display validation feedback for a field
 * @param {HTMLElement} feedbackElement - The element to display feedback in
 * @param {Object} validationResult - The validation result object
 */
function displayValidationFeedback(feedbackElement, validationResult) {
    if (!feedbackElement) return;
    
    feedbackElement.innerHTML = '';
    
    if (validationResult.errors.length > 0) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.innerHTML = validationResult.errors.map(err => 
            `<div class="flex items-start mt-1">
                <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <span>${err}</span>
            </div>`
        ).join('');
        feedbackElement.appendChild(errorDiv);
    } else if (validationResult.warnings.length > 0) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'validation-warning';
        warningDiv.innerHTML = validationResult.warnings.map(warn => 
            `<div class="flex items-start mt-1">
                <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <span>${warn}</span>
            </div>`
        ).join('');
        feedbackElement.appendChild(warningDiv);
    } else {
        const successDiv = document.createElement('div');
        successDiv.className = 'validation-success flex items-center mt-1';
        successDiv.innerHTML = `
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>Looks good!</span>
        `;
        feedbackElement.appendChild(successDiv);
    }
}

/**
 * Update input border color based on validation
 * @param {HTMLElement} inputElement - The input element
 * @param {Object} validationResult - The validation result
 */
function updateInputBorder(inputElement, validationResult) {
    if (!inputElement) return;
    
    inputElement.classList.remove('input-success', 'input-error');
    
    if (validationResult.errors.length > 0) {
        inputElement.classList.add('input-error');
    } else if (inputElement.value.trim() !== '') {
        inputElement.classList.add('input-success');
    }
}
