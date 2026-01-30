# Agent Development Notes

This file contains session notes and context for AI agents working on this project.

## Project Context

**Agent Skill Builder** is a static website that helps users create AI agent skills following the [Agent Skills specification](https://github.com/agentskills/agentskills). The tool provides an interactive 5-step wizard to generate properly formatted skill directories.

### Key Characteristics
- **Zero dependencies**: Pure HTML/CSS/JS, no build process, no backend
- **Specification compliant**: Strict validation based on Agent Skills spec
- **Privacy-first**: All processing happens client-side, data stays local
- **Fully documented**: 6 tracking docs maintained per engineering standards

## Current Status

### Version: 1.0.0 (Functionally Complete)
- ✅ All core features implemented (5-step wizard, validation, auto-save, ZIP generation)
- ✅ All tracking docs current and complete
- ✅ Automated validation script created (validate.sh)
- ✅ Comprehensive testing guide created (TESTING.md)
- ⏳ Pending manual browser testing by user

## Recent Development Sessions

### Session 2026-01-30: Bug Fixes and Testing Infrastructure

**What was accomplished:**
1. **Fixed critical HTML/JS initialization errors**:
   - Added missing `skillInstructionsFeedback` div element
   - Fixed missing `</textarea>` closing tag in Step 2
   - Corrected HTML structure that was causing JavaScript errors

2. **Improved UX for instructions field**:
   - Changed Step 2 textarea from placeholder to pre-filled starter text
   - Added markdown template with section headers as guidance
   - Updated wizard.js to initialize with starter content
   - Decision documented in ADR-016

3. **Created testing infrastructure**:
   - Added TESTING.md (280+ lines) with comprehensive testing checklist
   - Created validate.sh automated validation script
   - Covers syntax checking, HTML validation, element verification

4. **Updated all tracking docs**:
   - CHANGELOG.md: Documented all changes with detailed descriptions
   - DECISIONS.md: Added ADR-016 about starter text approach
   - README.md: Added testing section
   - PROJECT_STRUCTURE.md: Updated file listing
   - ROADMAP.md: Already current
   - AGENTS.md: Created this file

**Files modified:**
- index.html (fixed HTML structure)
- js/wizard.js (updated initialization)
- CHANGELOG.md (session changes)
- DECISIONS.md (ADR-016 added)
- README.md (testing section)
- PROJECT_STRUCTURE.md (file listing)
- TESTING.md (created)
- validate.sh (created)
- AGENTS.md (created)

**Technical decisions made:**
- Use starter text content instead of placeholder for instructions field
- Provide structured markdown template to reduce "blank page syndrome"
- Create automated validation script for pre-commit checks

**No issues or blockers**: All validation checks pass, ready for user testing

## Architecture Overview

### File Structure (10 files + 3 directories)
```
skill-forge/
├── index.html           # Single-page application (800 lines)
├── validate.sh          # Automated validation script
├── css/styles.css       # Custom styles (250 lines)
├── js/                  # JavaScript modules (4 files, ~2600 lines total)
│   ├── app.js          # Entry point, UI interactions
│   ├── validation.js   # Specification-based validation
│   ├── generator.js    # File/ZIP generation
│   └── wizard.js       # Multi-step wizard controller
├── assets/             # Empty (future use)
└── [6 tracking docs]   # README, CHANGELOG, DECISIONS, ROADMAP, PROJECT_STRUCTURE, TESTING
```

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript ES6+
- **Styling**: Tailwind CSS v3 (CDN)
- **Libraries**: JSZip v3.10.1, FileSaver.js v2.0.5 (both via CDN)
- **Storage**: localStorage for draft persistence
- **Testing**: Manual + automated validation script

### Key Design Patterns
1. **Single-page application** with step-based progressive disclosure
2. **Wizard pattern** for complex form with validation gates
3. **Real-time validation** with debounced localStorage auto-save
4. **Client-side file generation** using JSZip for ZIP creation

## Development Guidelines

### Working with This Project

**Before making changes:**
1. Run `./validate.sh` to ensure current state is valid
2. Read DECISIONS.md to understand architectural choices
3. Check ROADMAP.md to see if feature is already planned
4. Review relevant code in js/ directory

**While developing:**
1. Test locally with `python3 -m http.server 8000`
2. Check browser console for JavaScript errors
3. Use validation script during development
4. Keep changes focused and single-purpose

**After making changes:**
1. Run `./validate.sh` to verify no regressions
2. Test all affected wizard steps manually
3. Update tracking docs in the SAME commit (per AGENTS.md standards):
   - CHANGELOG.md: Document what changed
   - DECISIONS.md: Document WHY decisions were made
   - README.md: If high-level concepts changed
   - PROJECT_STRUCTURE.md: If files/folders added/removed/moved
   - ROADMAP.md: Mark completed items, add new ideas
4. Follow Conventional Commits for commit messages

### Code Organization

**JavaScript modules are independent:**
- `validation.js`: Pure functions, no DOM manipulation
- `generator.js`: Pure functions, returns strings/blobs
- `wizard.js`: State management, DOM updates
- `app.js`: Entry point, glues everything together

**To add a new field:**
1. Add HTML in index.html (in appropriate step)
2. Add validation rule in validation.js
3. Add to formData structure in wizard.js
4. Add to generation logic in generator.js
5. Test validation feedback displays correctly

**To add a new wizard step:**
1. Add step HTML in index.html
2. Update `totalSteps` in wizard.js
3. Add step indicator in progress bar
4. Add validation logic in `validateCurrentStep()`
5. Update navigation button logic

## Common Tasks

### Running Tests
```bash
# Automated checks
./validate.sh

# Manual browser testing
python3 -m http.server 8000
# Open http://localhost:8000
# Follow TESTING.md checklist
```

### Adding Example Skills
See ROADMAP.md v1.1 - planned for Q1 2026. Would require:
1. Create `examples/` directory with JSON configs
2. Add "Load Example" UI in Step 1
3. Add example loading logic in wizard.js
4. Update DECISIONS.md with ADR about example format

### Debugging Tips

**If JavaScript errors occur:**
1. Check browser console (F12)
2. Verify all element IDs exist in HTML
3. Check validation.js for syntax errors
4. Use `node --check js/*.js` to validate syntax

**If validation doesn't work:**
1. Check console for errors in validation.js
2. Verify ValidationRules object is exported
3. Test with simple input first
4. Check feedback div elements exist

**If auto-save doesn't work:**
1. Check localStorage is enabled (not in private mode)
2. Open DevTools > Application > Local Storage
3. Look for 'agentSkillBuilder_draft' key
4. Check console for localStorage errors

## Future Development Notes

### Planned Enhancements (see ROADMAP.md)
- **v1.1 (Q1 2026)**: Example skills and templates
- **v1.2 (Q2 2026)**: Markdown editor with live preview
- **v1.3 (Q3 2026)**: Sharing and collaboration features
- **v2.0 (Q4 2026)**: Dark mode, PWA, multi-language

### Technical Debt
None currently. Project is clean and well-organized.

### Known Limitations
1. Browser localStorage limits (~5-10MB)
2. Large file uploads may impact performance
3. No cross-device sync (localStorage is local only)
4. Client-side validation only (no server verification)

### Potential Risks
1. **Specification changes**: Validation rules tightly coupled to spec
2. **Browser API changes**: Depends on localStorage, Clipboard API
3. **CDN reliability**: Tailwind, JSZip, FileSaver from CDN

## Dependencies

### External (CDN)
- Tailwind CSS v3.x: `https://cdn.tailwindcss.com`
- JSZip v3.10.1: `https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js`
- FileSaver.js v2.0.5: `https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js`

### Internal (None)
No npm packages, no build dependencies, no dev dependencies.

## Testing Strategy

### Current Approach
- **Manual testing**: Follow TESTING.md checklist
- **Automated validation**: Run validate.sh before commits
- **Browser testing**: Chrome, Firefox, Safari (latest)

### What to Test
1. All 5 wizard steps load and function
2. Validation feedback appears correctly
3. Auto-save persists across page reload
4. ZIP download contains correct structure
5. Copy to clipboard works (with fallback)
6. Mobile responsive design works
7. Tooltips display specification details

### Test Data
Use realistic skill examples from:
- https://github.com/anthropics/skills
- Agent Skills specification examples

## Specification Reference

**Agent Skills Specification:**
- Main repo: https://github.com/agentskills/agentskills
- Specification: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
- Examples: https://github.com/anthropics/skills

**Key requirements validated:**
- Skill name: 1-64 chars, lowercase, hyphens, no consecutive hyphens
- Description: 1-1024 chars, descriptive with keywords
- Instructions: Required markdown, recommended < 500 lines
- Compatibility: Optional, max 500 chars
- File structure: SKILL.md + optional scripts/references/assets

## Contact & Support

**For AI Agents:**
- All context needed is in this file and other tracking docs
- Check DECISIONS.md for "why" behind architectural choices
- Check ROADMAP.md for planned features
- Check CHANGELOG.md for what changed when

**For Humans:**
- GitHub issues for bugs/features
- Agent Skills community: https://github.com/agentskills/agentskills

## Session Handoff Checklist

When ending a development session, always:
- [ ] Run `./validate.sh` to verify state
- [ ] Update CHANGELOG.md with what changed
- [ ] Update DECISIONS.md if architectural decisions made
- [ ] Update README.md if high-level changes
- [ ] Update PROJECT_STRUCTURE.md if files/folders changed
- [ ] Update ROADMAP.md if new features discussed
- [ ] Update this file (AGENTS.md) with session notes
- [ ] Commit with Conventional Commits format
- [ ] Push to origin (if ready)

---

**Last updated:** 2026-01-30
**Project status:** v1.0.0 - Functionally complete, pending user testing
**Next milestone:** Manual testing, then v1.1 planning
