/**
 * generator.js
 * File and ZIP generation logic for Agent Skill Builder
 */

/**
 * Generate SKILL.md content from form data
 * @param {Object} formData - The complete form data
 * @returns {string} The SKILL.md file content
 */
function generateSkillMd(formData) {
    let content = '---\n';
    
    // Required fields
    content += `name: ${formData.name}\n`;
    content += `description: ${formData.description}\n`;
    
    // Optional fields
    if (formData.license && formData.license.trim()) {
        content += `license: ${formData.license}\n`;
    }
    
    if (formData.compatibility && formData.compatibility.trim()) {
        content += `compatibility: ${formData.compatibility}\n`;
    }
    
    // Metadata
    if (formData.metadata && formData.metadata.length > 0) {
        const validMetadata = formData.metadata.filter(m => m.key && m.value);
        if (validMetadata.length > 0) {
            content += 'metadata:\n';
            validMetadata.forEach(m => {
                content += `  ${m.key}: "${m.value}"\n`;
            });
        }
    }
    
    // Allowed tools
    if (formData.allowedTools && formData.allowedTools.trim()) {
        content += `allowed-tools: ${formData.allowedTools}\n`;
    }
    
    content += '---\n\n';
    
    // Instructions body
    content += formData.instructions || '';
    
    return content;
}

/**
 * Generate directory structure preview text
 * @param {Object} formData - The complete form data
 * @returns {string} The directory structure as text
 */
function generateDirectoryStructure(formData) {
    let structure = `${formData.name}/\n`;
    structure += '├── SKILL.md\n';
    
    // Check if license file should be included
    if (formData.licenseFile && formData.licenseFile.trim()) {
        structure += '├── LICENSE.txt\n';
    }
    
    // Scripts
    if (formData.scripts && formData.scripts.length > 0) {
        const validScripts = formData.scripts.filter(s => s.filename && s.content);
        if (validScripts.length > 0) {
            structure += '├── scripts/\n';
            validScripts.forEach((script, index) => {
                const isLast = index === validScripts.length - 1 && 
                              (!formData.references || formData.references.length === 0) &&
                              (!formData.assets || formData.assets.length === 0);
                const prefix = isLast ? '└──' : '├──';
                structure += `│   ${prefix} ${script.filename}\n`;
            });
        }
    }
    
    // References
    if (formData.references && formData.references.length > 0) {
        const validReferences = formData.references.filter(r => r.filename && r.content);
        if (validReferences.length > 0) {
            structure += '├── references/\n';
            validReferences.forEach((ref, index) => {
                const isLast = index === validReferences.length - 1 && 
                              (!formData.assets || formData.assets.length === 0);
                const prefix = isLast ? '└──' : '├──';
                structure += `│   ${prefix} ${ref.filename}\n`;
            });
        }
    }
    
    // Assets
    if (formData.assets && formData.assets.length > 0) {
        const validAssets = formData.assets.filter(a => a.filename && a.content);
        if (validAssets.length > 0) {
            structure += '└── assets/\n';
            validAssets.forEach((asset, index) => {
                const isLast = index === validAssets.length - 1;
                const prefix = isLast ? '└──' : '├──';
                structure += `    ${prefix} ${asset.filename}\n`;
            });
        }
    }
    
    return structure;
}

/**
 * Generate a ZIP file containing the skill directory
 * @param {Object} formData - The complete form data
 * @returns {Promise<Blob>} The ZIP file as a Blob
 */
async function generateZip(formData) {
    const zip = new JSZip();
    const skillFolder = zip.folder(formData.name);
    
    // Add SKILL.md
    const skillMdContent = generateSkillMd(formData);
    skillFolder.file('SKILL.md', skillMdContent);
    
    // Add LICENSE.txt if provided
    if (formData.licenseFile && formData.licenseFile.trim()) {
        skillFolder.file('LICENSE.txt', formData.licenseFile);
    }
    
    // Add scripts
    if (formData.scripts && formData.scripts.length > 0) {
        const scriptsFolder = skillFolder.folder('scripts');
        formData.scripts.forEach(script => {
            if (script.filename && script.content) {
                scriptsFolder.file(script.filename, script.content);
            }
        });
    }
    
    // Add references
    if (formData.references && formData.references.length > 0) {
        const referencesFolder = skillFolder.folder('references');
        formData.references.forEach(ref => {
            if (ref.filename && ref.content) {
                referencesFolder.file(ref.filename, ref.content);
            }
        });
    }
    
    // Add assets
    if (formData.assets && formData.assets.length > 0) {
        const assetsFolder = skillFolder.folder('assets');
        formData.assets.forEach(asset => {
            if (asset.filename && asset.content) {
                assetsFolder.file(asset.filename, asset.content);
            }
        });
    }
    
    // Generate the ZIP
    return await zip.generateAsync({ type: 'blob' });
}

/**
 * Download the generated ZIP file
 * @param {Object} formData - The complete form data
 */
async function downloadZip(formData) {
    try {
        const zipBlob = await generateZip(formData);
        saveAs(zipBlob, `${formData.name}.zip`);
        return true;
    } catch (error) {
        console.error('Error generating ZIP:', error);
        return false;
    }
}

/**
 * Copy SKILL.md content to clipboard
 * @param {Object} formData - The complete form data
 */
async function copySkillMdToClipboard(formData) {
    try {
        const skillMdContent = generateSkillMd(formData);
        await navigator.clipboard.writeText(skillMdContent);
        return true;
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        
        // Fallback method
        try {
            const textArea = document.createElement('textarea');
            textArea.value = generateSkillMd(formData);
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (fallbackError) {
            console.error('Fallback copy failed:', fallbackError);
            return false;
        }
    }
}

/**
 * Generate HTML preview of all files
 * @param {Object} formData - The complete form data
 * @returns {string} HTML content for file viewer
 */
function generateFileViewerContent(formData) {
    let html = '';
    
    // SKILL.md
    html += generateFilePreviewItem('SKILL.md', generateSkillMd(formData), 'yaml');
    
    // LICENSE.txt
    if (formData.licenseFile && formData.licenseFile.trim()) {
        html += generateFilePreviewItem('LICENSE.txt', formData.licenseFile, 'text');
    }
    
    // Scripts
    if (formData.scripts && formData.scripts.length > 0) {
        formData.scripts.forEach(script => {
            if (script.filename && script.content) {
                html += generateFilePreviewItem(
                    `scripts/${script.filename}`, 
                    script.content, 
                    getLanguageFromFilename(script.filename)
                );
            }
        });
    }
    
    // References
    if (formData.references && formData.references.length > 0) {
        formData.references.forEach(ref => {
            if (ref.filename && ref.content) {
                html += generateFilePreviewItem(
                    `references/${ref.filename}`, 
                    ref.content, 
                    'markdown'
                );
            }
        });
    }
    
    // Assets
    if (formData.assets && formData.assets.length > 0) {
        formData.assets.forEach(asset => {
            if (asset.filename && asset.content) {
                html += generateFilePreviewItem(
                    `assets/${asset.filename}`, 
                    asset.content, 
                    'text'
                );
            }
        });
    }
    
    return html;
}

/**
 * Generate a single file preview item
 * @param {string} filename - The filename
 * @param {string} content - The file content
 * @param {string} language - The language for syntax highlighting
 * @returns {string} HTML for the file preview
 */
function generateFilePreviewItem(filename, content, language) {
    const escapedContent = escapeHtml(content);
    const fileId = `file-${filename.replace(/[^a-zA-Z0-9]/g, '-')}`;
    
    return `
        <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-200">
                <span class="font-mono text-sm font-medium text-gray-700">${escapeHtml(filename)}</span>
                <button class="copy-file-btn text-xs text-blue-600 hover:text-blue-800 font-medium" data-file-id="${fileId}">
                    Copy
                </button>
            </div>
            <div class="bg-white p-4">
                <pre id="${fileId}" class="text-sm text-gray-800 font-mono whitespace-pre-wrap break-words custom-scrollbar overflow-x-auto">${escapedContent}</pre>
            </div>
        </div>
    `;
}

/**
 * Escape HTML special characters
 * @param {string} text - The text to escape
 * @returns {string} The escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Get language identifier from filename
 * @param {string} filename - The filename
 * @returns {string} The language identifier
 */
function getLanguageFromFilename(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const languageMap = {
        'py': 'python',
        'js': 'javascript',
        'ts': 'typescript',
        'sh': 'bash',
        'md': 'markdown',
        'json': 'json',
        'yaml': 'yaml',
        'yml': 'yaml',
        'xml': 'xml',
        'html': 'html',
        'css': 'css'
    };
    return languageMap[ext] || 'text';
}

/**
 * Generate summary content for review step
 * @param {Object} formData - The complete form data
 * @returns {string} HTML content for summary
 */
function generateSummaryContent(formData) {
    let html = '<div class="space-y-4">';
    
    // Basic Info
    html += `
        <div class="border-b border-gray-200 pb-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Basic Information</h3>
            <dl class="grid grid-cols-1 gap-2 text-sm">
                <div>
                    <dt class="text-gray-600 font-medium">Name:</dt>
                    <dd class="text-gray-900 font-mono">${escapeHtml(formData.name)}</dd>
                </div>
                <div>
                    <dt class="text-gray-600 font-medium">Description:</dt>
                    <dd class="text-gray-900">${escapeHtml(formData.description)}</dd>
                </div>
            </dl>
        </div>
    `;
    
    // Instructions
    const lineCount = (formData.instructions || '').split('\n').length;
    html += `
        <div class="border-b border-gray-200 pb-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Instructions</h3>
            <p class="text-sm text-gray-600">${lineCount} lines of markdown content</p>
        </div>
    `;
    
    // Optional Metadata
    const hasOptionalData = formData.license || formData.compatibility || 
                           (formData.metadata && formData.metadata.length > 0) || 
                           formData.allowedTools;
    
    if (hasOptionalData) {
        html += `
            <div class="border-b border-gray-200 pb-4">
                <h3 class="text-sm font-semibold text-gray-900 mb-2">Optional Metadata</h3>
                <dl class="grid grid-cols-1 gap-2 text-sm">
        `;
        
        if (formData.license) {
            html += `
                <div>
                    <dt class="text-gray-600 font-medium">License:</dt>
                    <dd class="text-gray-900">${escapeHtml(formData.license)}</dd>
                </div>
            `;
        }
        
        if (formData.compatibility) {
            html += `
                <div>
                    <dt class="text-gray-600 font-medium">Compatibility:</dt>
                    <dd class="text-gray-900">${escapeHtml(formData.compatibility)}</dd>
                </div>
            `;
        }
        
        if (formData.allowedTools) {
            html += `
                <div>
                    <dt class="text-gray-600 font-medium">Allowed Tools:</dt>
                    <dd class="text-gray-900 font-mono text-xs">${escapeHtml(formData.allowedTools)}</dd>
                </div>
            `;
        }
        
        if (formData.metadata && formData.metadata.length > 0) {
            html += `
                <div>
                    <dt class="text-gray-600 font-medium">Custom Metadata:</dt>
                    <dd class="text-gray-900">
            `;
            formData.metadata.forEach(m => {
                if (m.key && m.value) {
                    html += `<div class="ml-2"><code>${escapeHtml(m.key)}</code>: ${escapeHtml(m.value)}</div>`;
                }
            });
            html += `
                    </dd>
                </div>
            `;
        }
        
        html += `
                </dl>
            </div>
        `;
    }
    
    // Components
    const hasComponents = (formData.scripts && formData.scripts.length > 0) ||
                         (formData.references && formData.references.length > 0) ||
                         (formData.assets && formData.assets.length > 0);
    
    if (hasComponents) {
        html += `
            <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-2">Additional Components</h3>
                <ul class="text-sm text-gray-600 space-y-1">
        `;
        
        if (formData.scripts && formData.scripts.length > 0) {
            const count = formData.scripts.filter(s => s.filename && s.content).length;
            html += `<li>${count} script${count !== 1 ? 's' : ''}</li>`;
        }
        
        if (formData.references && formData.references.length > 0) {
            const count = formData.references.filter(r => r.filename && r.content).length;
            html += `<li>${count} reference file${count !== 1 ? 's' : ''}</li>`;
        }
        
        if (formData.assets && formData.assets.length > 0) {
            const count = formData.assets.filter(a => a.filename && a.content).length;
            html += `<li>${count} asset${count !== 1 ? 's' : ''}</li>`;
        }
        
        html += `
                </ul>
            </div>
        `;
    }
    
    html += '</div>';
    
    return html;
}
