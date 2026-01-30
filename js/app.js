/**
 * app.js
 * Main application entry point and UI interactions
 */

// Tooltip content definitions
const tooltipContent = {
    name: `
        <strong>Skill Name Requirements:</strong><br>
        • 1-64 characters<br>
        • Lowercase letters, numbers, and hyphens only<br>
        • Cannot start or end with a hyphen<br>
        • No consecutive hyphens (--)<br>
        • Must match the directory name<br><br>
        <strong>Example:</strong> pdf-processing, mcp-builder
    `,
    description: `
        <strong>Description Best Practices:</strong><br>
        • Describe what the skill does<br>
        • Explain when to use it<br>
        • Include specific keywords for discoverability<br>
        • 1-1024 characters<br><br>
        <strong>Example:</strong> "Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF documents."
    `,
    instructions: `
        <strong>Instructions Guide:</strong><br>
        • Write step-by-step instructions<br>
        • Include examples of inputs/outputs<br>
        • Document common edge cases<br>
        • Use Markdown formatting<br>
        • Recommended: Keep under 500 lines<br>
        • Move detailed content to reference files
    `,
    license: `
        <strong>License Field:</strong><br>
        • Optional field<br>
        • Use short names like "MIT" or "Apache-2.0"<br>
        • Or reference a file: "See LICENSE.txt"<br><br>
        <strong>Example:</strong> MIT, Apache-2.0, Proprietary
    `,
    compatibility: `
        <strong>Compatibility Field:</strong><br>
        • Optional - only include if specific requirements exist<br>
        • Max 500 characters<br>
        • Indicate intended product, system packages, network access<br><br>
        <strong>Example:</strong> "Requires git, docker, jq, and internet access"
    `,
    'allowed-tools': `
        <strong>Allowed Tools (Experimental):</strong><br>
        • Space-delimited list of pre-approved tools<br>
        • Support varies by agent implementation<br><br>
        <strong>Example:</strong> Bash(git:*) Bash(jq:*) Read
    `,
    metadata: `
        <strong>Custom Metadata:</strong><br>
        • Add arbitrary key-value pairs<br>
        • Common keys: author, version<br>
        • Use descriptive, unique keys to avoid conflicts<br><br>
        <strong>Example:</strong> author: "example-org", version: "1.0"
    `,
    scripts: `
        <strong>Scripts Directory:</strong><br>
        • Executable code (Python, Bash, JavaScript, etc.)<br>
        • Should be self-contained or document dependencies<br>
        • Include helpful error messages<br>
        • Handle edge cases gracefully<br><br>
        <strong>Example:</strong> extract.py, process.sh
    `,
    references: `
        <strong>References Directory:</strong><br>
        • Additional documentation loaded on demand<br>
        • Keep files focused and under 500 lines<br>
        • Use Markdown format<br><br>
        <strong>Common files:</strong> REFERENCE.md, FORMS.md, domain-specific guides
    `,
    assets: `
        <strong>Assets Directory:</strong><br>
        • Static resources: templates, images, data files<br>
        • Document templates, configuration templates<br>
        • Lookup tables, schemas<br><br>
        <strong>Example:</strong> template.json, config.yaml, schema.json
    `
};

// Initialize wizard when DOM is loaded
let wizard;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the wizard
    wizard = new SkillWizard();
    
    // Setup tooltips
    setupTooltips();
    
    // Setup generation buttons
    setupGenerationButtons();
    
    // Setup file viewer modal
    setupFileViewer();
});

/**
 * Setup tooltip functionality
 */
function setupTooltips() {
    const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
    const tooltipContainer = document.getElementById('tooltipContainer');
    const tooltipContentDiv = document.getElementById('tooltipContent');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function(e) {
            const tooltipKey = this.getAttribute('data-tooltip');
            const content = tooltipContent[tooltipKey];
            
            if (content) {
                tooltipContentDiv.innerHTML = content;
                tooltipContainer.classList.remove('hidden');
                positionTooltip(this, tooltipContainer);
            }
        });
        
        trigger.addEventListener('mouseleave', function() {
            tooltipContainer.classList.add('hidden');
        });
    });
}

/**
 * Position tooltip relative to trigger element
 */
function positionTooltip(trigger, tooltip) {
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX - (tooltipRect.width / 2) + (rect.width / 2);
    
    // Keep tooltip within viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
}

/**
 * Setup generation buttons
 */
function setupGenerationButtons() {
    // Download ZIP button
    document.getElementById('downloadZipBtn').addEventListener('click', async function() {
        this.disabled = true;
        this.classList.add('btn-loading');
        
        const success = await downloadZip(wizard.formData);
        
        this.disabled = false;
        this.classList.remove('btn-loading');
        
        if (success) {
            showSuccessMessage('ZIP file downloaded successfully!');
        } else {
            showErrorMessage('Error generating ZIP file. Please try again.');
        }
    });
    
    // Copy SKILL.md button
    document.getElementById('copySkillBtn').addEventListener('click', async function() {
        this.disabled = true;
        
        const success = await copySkillMdToClipboard(wizard.formData);
        
        this.disabled = false;
        
        if (success) {
            showSuccessMessage('SKILL.md copied to clipboard!');
        } else {
            showErrorMessage('Error copying to clipboard. Please try again.');
        }
    });
    
    // View files button
    document.getElementById('viewFilesBtn').addEventListener('click', function() {
        showFileViewer();
    });
}

/**
 * Setup file viewer modal
 */
function setupFileViewer() {
    const modal = document.getElementById('fileViewerModal');
    const closeBtn = document.getElementById('closeFileViewer');
    
    closeBtn.addEventListener('click', function() {
        modal.classList.add('hidden');
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
}

/**
 * Show file viewer modal with generated files
 */
function showFileViewer() {
    const modal = document.getElementById('fileViewerModal');
    const contentDiv = document.getElementById('fileViewerContent');
    
    // Generate file viewer content
    contentDiv.innerHTML = generateFileViewerContent(wizard.formData);
    
    // Setup copy buttons for individual files
    const copyButtons = contentDiv.querySelectorAll('.copy-file-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            const fileId = this.getAttribute('data-file-id');
            const fileContent = document.getElementById(fileId).textContent;
            
            try {
                await navigator.clipboard.writeText(fileContent);
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = 'Copy';
                }, 2000);
            } catch (error) {
                console.error('Copy failed:', error);
                this.textContent = 'Failed';
                setTimeout(() => {
                    this.textContent = 'Copy';
                }, 2000);
            }
        });
    });
    
    // Show modal
    modal.classList.remove('hidden');
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 success-message';
    messageDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 success-message';
    messageDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Log initialization
console.log('Agent Skill Builder initialized');
console.log('For more information about Agent Skills, visit: https://github.com/agentskills/agentskills');
