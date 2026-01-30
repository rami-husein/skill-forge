# Changelog

All notable changes to the Agent Skill Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (2026-01-30)
- Created comprehensive TESTING.md with 280+ line testing guide
  - Complete step-by-step testing checklist for all 5 wizard steps
  - Edge case and error handling scenarios
  - Browser compatibility testing guidelines
  - Performance testing checklist
  - Debugging tips and troubleshooting guide
  - Known limitations documentation
- Created automated validation script (validate.sh)
  - JavaScript syntax checking for all 4 JS files
  - HTML structure validation (balanced tags)
  - Required element ID verification (9 critical elements)
  - Documentation completeness check (6 docs)
  - Directory structure verification
  - Web server status check
  - Color-coded output with ✅/❌ indicators

### Fixed (2026-01-30)
- Fixed Step 2 textarea to use starter text content instead of placeholder attribute
  - Changed from empty textarea with placeholder to pre-filled content
  - Added markdown template with helpful section headers
  - Improves UX by providing structure guidance immediately
- Added missing `skillInstructionsFeedback` div element in index.html
  - Prevents JavaScript initialization errors in wizard.js:101
  - Ensures validation feedback can be displayed for instructions field
- Fixed HTML structure in Step 2 (missing closing `</textarea>` tag)
  - Resolved malformed HTML that caused parsing issues
  - Verified all textarea tags are properly balanced (3 opening, 3 closing)
- Updated wizard.js initialization to populate instructions field with starter content
  - Modified `getDefaultFormData()` to include starter markdown template
  - Added line count initialization in `init()` method
  - Ensures consistency between HTML and JavaScript state

### Changed (2026-01-30)
- Updated README.md with testing section and quick test command
- Updated PROJECT_STRUCTURE.md to include validate.sh and TESTING.md
- Enhanced documentation cross-references for better discoverability

## [1.0.0] - 2026-01-30

### Added

#### Core Features
- **Multi-step wizard interface** with 5 intuitive steps
  - Step 1: Basic Information (name, description)
  - Step 2: Main Instructions (markdown editor)
  - Step 3: Optional Metadata (license, compatibility, custom fields, allowed-tools)
  - Step 4: Additional Components (scripts, references, assets)
  - Step 5: Review & Generate (validation summary, directory preview)

- **Real-time validation** based on Agent Skills specification
  - Skill name format validation (lowercase, hyphens, 1-64 chars)
  - Description length validation (1-1024 chars)
  - Compatibility length validation (max 500 chars)
  - Filename validation for scripts/references/assets
  - Metadata key validation
  - Visual feedback with colored borders and icons

- **Auto-save functionality** with localStorage
  - Debounced auto-save (2 seconds after last input)
  - Draft restoration on page reload
  - "Draft restored" notification
  - "Clear draft" button in header

- **File generation**
  - SKILL.md generation with proper YAML frontmatter
  - ZIP file download with complete directory structure
  - Copy SKILL.md to clipboard (with fallback for older browsers)
  - View all files modal with individual copy buttons
  - Directory structure preview in ASCII format

- **Inline help system**
  - Contextual tooltips on all form fields
  - Specification details and examples
  - Hover to display, positioned intelligently
  - Mobile-friendly (tap to show)

- **Dynamic component management**
  - Add/remove custom metadata key-value pairs
  - Add/remove script files with syntax highlighting awareness
  - Add/remove reference files (markdown)
  - Add/remove asset files
  - Real-time updates to directory structure

- **User interface**
  - Clean, minimal design aesthetic
  - Progress indicators with visual states (active, completed)
  - Character counters on text fields
  - Line counter on instructions field
  - Validation feedback (success, error, warning)
  - Step-by-step navigation with validation gates
  - Success/error toast notifications

- **Mobile responsiveness**
  - Fully responsive on all screen sizes
  - Touch-friendly buttons and inputs
  - Stacked layout on small screens
  - Mobile-optimized tooltips

#### Technical Implementation
- Pure HTML/CSS/JavaScript (no build process)
- Tailwind CSS via CDN for styling
- JSZip for client-side ZIP generation
- FileSaver.js for download triggering
- No backend or server required
- Works completely offline (after initial load)

#### Documentation
- Comprehensive README.md with usage instructions
- PROJECT_STRUCTURE.md with detailed architecture
- DECISIONS.md documenting architectural choices
- ROADMAP.md with future enhancement plans
- CHANGELOG.md (this file)

### Technical Details

#### Dependencies
- Tailwind CSS v3.x (CDN)
- JSZip v3.10.1 (CDN)
- FileSaver.js v2.0.5 (CDN)

#### Browser Support
- Chrome/Edge (latest) - Fully supported
- Firefox (latest) - Fully supported
- Safari (latest) - Fully supported

#### File Structure
```
skill-forge/
├── index.html           (35KB, ~600 lines)
├── css/
│   └── styles.css      (3KB, ~250 lines)
├── js/
│   ├── app.js          (5KB, ~250 lines)
│   ├── validation.js   (8KB, ~350 lines)
│   ├── generator.js    (10KB, ~450 lines)
│   └── wizard.js       (15KB, ~700 lines)
└── [documentation files]
```

#### Performance
- Total bundle size: ~76KB (excluding CDN)
- First load: ~200KB (including CDN assets)
- localStorage usage: ~1-50KB (depends on skill complexity)

### Known Limitations

1. **File size limits**: Skills with very large scripts/assets may hit browser memory limits
2. **localStorage limits**: Browser-dependent, typically 5-10MB
3. **No synchronization**: Drafts don't sync across devices
4. **No validation API**: Validation is client-side only (no skills-ref integration yet)
5. **No example skills**: Starting from blank slate only (examples planned for v1.1)
6. **Basic markdown editor**: No syntax highlighting or live preview (planned for v1.2)

### Security

- All user input is HTML-escaped before rendering (XSS prevention)
- No server communication (no CSRF/injection risks)
- No eval() or dangerous APIs used
- Content Security Policy compatible
- localStorage scoped to origin

### Accessibility

- Semantic HTML structure
- Proper label associations
- Keyboard navigation support (Tab, Enter, Escape)
- Focus-visible indicators
- Color contrast compliance (WCAG AA)
- Screen reader friendly error messages

## Future Releases

See [ROADMAP.md](ROADMAP.md) for planned features and enhancements.

---

[Unreleased]: https://github.com/rami-husein/skill-forge/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/rami-husein/skill-forge/releases/tag/v1.0.0
