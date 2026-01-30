# Project Structure

This document describes the file organization and architecture of the Agent Skill Builder application.

## Directory Layout

```
skill-forge/
├── index.html              # Main application HTML
├── validate.sh             # Validation script for automated checks
├── css/
│   └── styles.css         # Custom CSS styles
├── js/
│   ├── app.js             # Application initialization and UI interactions
│   ├── validation.js      # Validation rules and field validation
│   ├── generator.js       # File generation and ZIP creation
│   └── wizard.js          # Multi-step wizard state management
├── assets/                 # Static assets (future use)
├── README.md              # Project documentation
├── PROJECT_STRUCTURE.md   # This file
├── TESTING.md             # Testing checklist and debugging guide
├── HOW_TO_RUN.md          # Local development server options
├── AGENTS.md              # AI agent development notes and session context
├── DECISIONS.md           # Architectural decisions
├── ROADMAP.md             # Future enhancements
└── CHANGELOG.md           # Version history and changes
```

## File Descriptions

### Root Files

#### `index.html` (7KB, ~600 lines)
The main and only HTML file for the application. Contains:
- Complete semantic HTML structure
- All 5 wizard steps with form fields
- Step progress indicators
- Modal for file viewing
- CDN links for Tailwind CSS, JSZip, and FileSaver.js
- Script includes for all JavaScript modules

**Key sections:**
- Header with branding and clear draft button
- Draft restored notification
- Progress step indicators (5 steps)
- Step 1: Basic Information (name, description)
- Step 2: Main Instructions (markdown editor)
- Step 3: Optional Metadata (license, compatibility, metadata pairs, allowed-tools)
- Step 4: Additional Components (scripts, references, assets)
- Step 5: Review & Generate (validation summary, directory preview, file summary)
- Navigation buttons (Previous/Next)
- Generation buttons (Download ZIP, Copy SKILL.md, View Files)
- File viewer modal
- Tooltip container

### CSS Directory

#### `css/styles.css` (5KB, ~250 lines)
Custom styles that supplement Tailwind CSS. Includes:
- Step indicator styles (active, completed states)
- Form step transitions (fade-in animations)
- Validation feedback colors (success, error, warning)
- Input focus and validation states
- Tooltip styles
- Modal animations
- Code block styling
- Dynamic component item styles
- Button loading states
- Success message animations
- Responsive adjustments
- Custom scrollbar styling
- Accessibility focus-visible styles
- Print media styles

### JavaScript Directory

#### `js/validation.js` (8KB, ~350 lines)
Validation logic based on Agent Skills specification.

**Exports:**
- `ValidationRules` object with validation methods for:
  - `name`: Skill name format and constraints
  - `description`: Description length and quality
  - `instructions`: Instructions completeness
  - `compatibility`: Compatibility field constraints
  - `filename`: Script/reference/asset filename validation
  - `metadataKey`: Metadata key format validation

**Functions:**
- `validateAll(formData)`: Validates entire form data structure
- `displayValidationFeedback(element, result)`: Renders validation UI
- `updateInputBorder(element, result)`: Updates input border colors

**Validation patterns:**
- Name: `/^[a-z0-9]+(-[a-z0-9]+)*$/`
- Filename: `/^[a-zA-Z0-9_.-]+$/`
- MetadataKey: `/^[a-zA-Z0-9_-]+$/`

#### `js/generator.js` (10KB, ~450 lines)
File generation and ZIP creation logic.

**Key functions:**
- `generateSkillMd(formData)`: Creates SKILL.md with YAML frontmatter + markdown body
- `generateDirectoryStructure(formData)`: Creates ASCII directory tree preview
- `generateZip(formData)`: Uses JSZip to create downloadable ZIP
- `downloadZip(formData)`: Triggers ZIP download via FileSaver
- `copySkillMdToClipboard(formData)`: Copies SKILL.md to clipboard with fallback
- `generateFileViewerContent(formData)`: Creates HTML for all files preview
- `generateFilePreviewItem(filename, content, language)`: Single file preview
- `generateSummaryContent(formData)`: Creates review step summary HTML
- `escapeHtml(text)`: Security helper for HTML escaping
- `getLanguageFromFilename(filename)`: Maps extensions to language identifiers

**Output structure:**
```
skill-name/
├── SKILL.md
├── LICENSE.txt (optional)
├── scripts/ (optional)
├── references/ (optional)
└── assets/ (optional)
```

#### `js/wizard.js` (15KB, ~700 lines)
Multi-step wizard controller and state management.

**Class: `SkillWizard`**

**Properties:**
- `currentStep`: Current wizard step (1-5)
- `totalSteps`: Total number of steps (5)
- `formData`: Complete form state object
- `autoSaveInterval`: Auto-save timer reference

**Core methods:**
- `init()`: Initialize wizard and event listeners
- `setupEventListeners()`: Attach all UI event handlers
- `attachFormListeners()`: Listen to form field changes
- `validateField(fieldName, value)`: Real-time field validation
- `updateCharCount(elementId, current, max)`: Update character counters
- `nextStep()`: Navigate forward with validation
- `previousStep()`: Navigate backward
- `validateCurrentStep()`: Step-specific validation gates
- `updateView()`: Show/hide steps, update indicators
- `updateStepIndicators()`: Visual progress indicator updates
- `updateNavigationButtons()`: Enable/disable nav buttons
- `populateReviewStep()`: Generate review content

**Dynamic component methods:**
- `addMetadataField(key, value)`: Add metadata key-value pair
- `addScriptField(filename, content)`: Add script file
- `addReferenceField(filename, content)`: Add reference file
- `addAssetField(filename, content)`: Add asset file

**Persistence methods:**
- `saveDraft()`: Save to localStorage
- `restoreDraft()`: Restore from localStorage
- `clearDraft()`: Clear saved data
- `startAutoSave()`: Debounced auto-save (2 seconds)

**Form data structure:**
```javascript
{
    name: string,
    description: string,
    instructions: string,
    license: string,
    licenseFile: string,
    compatibility: string,
    allowedTools: string,
    metadata: [{key, value}, ...],
    scripts: [{filename, content}, ...],
    references: [{filename, content}, ...],
    assets: [{filename, content}, ...]
}
```

#### `js/app.js` (5KB, ~250 lines)
Main application entry point and UI interactions.

**Key features:**
- Tooltip content definitions (specification details)
- Wizard initialization
- Tooltip positioning and display
- Generation button handlers
- File viewer modal setup
- Success/error message toasts
- Keyboard navigation (Escape key)
- Copy-to-clipboard for individual files

**Tooltip topics:**
- name, description, instructions
- license, compatibility, allowed-tools
- metadata, scripts, references, assets

**UI helpers:**
- `setupTooltips()`: Initialize tooltip triggers
- `positionTooltip(trigger, tooltip)`: Smart tooltip positioning
- `setupGenerationButtons()`: Attach generation handlers
- `setupFileViewer()`: Modal lifecycle management
- `showFileViewer()`: Display all files with copy buttons
- `showSuccessMessage(message)`: Toast notification (3s)
- `showErrorMessage(message)`: Error toast notification (3s)

## Data Flow

### 1. Initialization
```
DOMContentLoaded
  → Initialize SkillWizard class
  → Restore draft from localStorage (if exists)
  → Setup all event listeners
  → Update UI to match state
```

### 2. User Input
```
User types in field
  → Input event fires
  → Update formData in wizard
  → Run field validation
  → Display feedback
  → Update visual indicators
  → Debounced auto-save to localStorage (2s)
```

### 3. Navigation
```
User clicks Next
  → validateCurrentStep()
  → If valid: currentStep++
  → updateView()
  → Hide current step, show next
  → Update step indicators
  → Update button states
  → Scroll to top
```

### 4. Generation
```
User clicks Download ZIP
  → Validate all fields
  → Generate SKILL.md content
  → Create JSZip instance
  → Add all files to ZIP
  → Generate blob
  → Trigger download via FileSaver
  → Show success message
```

## State Management

### localStorage Schema
```javascript
// Draft data
'agentskill-builder-draft': JSON.stringify(formData)

// Current step
'agentskill-builder-step': '1' | '2' | '3' | '4' | '5'
```

### In-Memory State
- Managed by `SkillWizard` class
- Single source of truth in `formData` object
- Updated on every input event
- Persisted to localStorage via debounced auto-save

## Dependencies

### External Libraries (CDN)
1. **Tailwind CSS** - v3.x
   - Source: `https://cdn.tailwindcss.com`
   - Purpose: Utility-first styling
   - Load: Blocking (in `<head>`)

2. **JSZip** - v3.10.1
   - Source: `https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js`
   - Purpose: Client-side ZIP generation
   - Load: Async (before app scripts)

3. **FileSaver.js** - v2.0.5
   - Source: `https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js`
   - Purpose: File download triggering
   - Load: Async (before app scripts)

### Load Order
```html
1. Tailwind CSS (blocking, in head)
2. JSZip (async)
3. FileSaver.js (async)
4. validation.js
5. generator.js
6. wizard.js
7. app.js
```

## Browser APIs Used

- **localStorage**: Draft persistence
- **Clipboard API**: Copy to clipboard with fallback
- **File API**: Blob creation for downloads
- **DOM API**: Dynamic content generation
- **Events**: Input, click, keyboard, scroll
- **Fetch** (future): Validation API integration

## Performance Considerations

### Bundle Sizes
- HTML: ~35KB (single file, all steps)
- CSS: ~3KB (custom styles)
- JS Total: ~38KB (4 files)
- Total (excluding CDN): ~76KB
- First load (with CDN): ~200KB

### Optimization Strategies
1. **No build process**: Instant development feedback
2. **CDN dependencies**: Cached across sites
3. **Debounced auto-save**: Reduces localStorage writes
4. **Progressive disclosure**: Only show current step
5. **Lazy validation**: Only validate on input/navigation
6. **Minimal DOM updates**: Update only changed elements

### Memory Usage
- Form data: ~1-50KB (depends on content)
- localStorage: ~1-50KB (draft)
- ZIP generation: Temporary memory spike (< 1MB typical)

## Accessibility

- Semantic HTML structure
- Proper label associations
- ARIA attributes (implicit via HTML5)
- Keyboard navigation (Tab, Enter, Escape)
- Focus-visible indicators
- Color contrast compliance (WCAG AA)
- Screen reader friendly error messages

## Security

- All user input is escaped before rendering (XSS prevention)
- No server communication (no CSRF/injection risks)
- No eval() or dangerous APIs
- Content Security Policy compatible
- localStorage scoped to origin

## Testing Strategy

### Manual Testing Checklist
- [ ] All 5 steps load correctly
- [ ] Validation feedback appears in real-time
- [ ] Character counters update accurately
- [ ] Navigation buttons enable/disable correctly
- [ ] Auto-save persists data across page reload
- [ ] Clear draft removes localStorage
- [ ] ZIP download contains correct files
- [ ] Copy to clipboard works (with fallback)
- [ ] File viewer displays all files
- [ ] Tooltips appear on hover
- [ ] Mobile responsive on small screens
- [ ] Works without JavaScript (graceful degradation)

### Browser Testing
- Chrome/Edge (latest): Primary target
- Firefox (latest): Full support
- Safari (latest): Full support

## Future Enhancements

See ROADMAP.md for detailed future plans.

**Quick list:**
- Example skill templates
- Export/import JSON
- Markdown preview with syntax highlighting
- Dark mode
- Offline PWA support
- Validation API integration
- Multi-language support
