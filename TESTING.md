# Testing Guide for Agent Skill Builder

## Quick Start Testing

### 1. Start Local Server
```bash
python3 -m http.server 8000
```
Then open: http://localhost:8000

### 2. Automated Checks (Pass ✅)
- [x] JavaScript syntax validation - All files OK
- [x] HTML element IDs verified - All present
- [x] Textarea tags balanced - 3 opening, 3 closing
- [x] Feedback divs present - All 3 required divs exist
- [x] Form elements verified - All critical elements found

## Manual Testing Checklist

### Step 1: Basic Information
- [ ] Load page - should show Step 1 by default
- [ ] Enter skill name - validation feedback should appear
- [ ] Enter description - character counter should update
- [ ] Test validation:
  - [ ] Empty name → error message
  - [ ] Name with special chars → error message
  - [ ] Valid name → success indicator
  - [ ] Description under 50 chars → warning
  - [ ] Description over 500 chars → error
- [ ] Click "Next" - should move to Step 2

### Step 2: Main Instructions
- [ ] Textarea should contain starter text (not placeholder):
  ```markdown
  # Overview
  ## When to use this skill
  ## Step-by-step instructions
  ## Examples
  ## Common edge cases
  ## Next steps
  ```
- [ ] Type in textarea - line counter should update
- [ ] Test validation:
  - [ ] Delete all text → error message
  - [ ] Add some text → validation feedback updates
- [ ] Click "Back" - should return to Step 1 with data preserved
- [ ] Click "Next" - should move to Step 3

### Step 3: Optional Metadata
- [ ] All fields should be optional
- [ ] Test license dropdown - should have common options
- [ ] Test compatibility field - character counter should work
- [ ] Test allowed_tools field
- [ ] Test "Add Custom Metadata" button:
  - [ ] Click → should show new key/value input pair
  - [ ] Add multiple metadata entries
  - [ ] Remove metadata entry using × button
- [ ] Click "Next" - should move to Step 4

### Step 4: Additional Components
- [ ] Test "Add Script" button:
  - [ ] Click → file input and description fields appear
  - [ ] Add script file
  - [ ] Enter description
  - [ ] Remove using × button
- [ ] Test "Add Reference" button:
  - [ ] Click → URL/path and description fields appear
  - [ ] Enter reference details
  - [ ] Remove using × button
- [ ] Test "Add Asset" button:
  - [ ] Click → file input and description fields appear
  - [ ] Add asset file
  - [ ] Remove using × button
- [ ] Click "Next" - should move to Step 5

### Step 5: Review & Generate
- [ ] Should show validation summary
- [ ] Should show all warnings/errors if any
- [ ] Test "View SKILL.md Preview" button:
  - [ ] Click → modal should open
  - [ ] Preview should show formatted markdown
  - [ ] "Copy to Clipboard" should work
  - [ ] Close modal with X or outside click
- [ ] Test "View File Structure" button:
  - [ ] Click → modal should open
  - [ ] Should show directory tree structure
  - [ ] Close modal
- [ ] Test "Download ZIP" button:
  - [ ] Click → should download `[skill-name].zip`
  - [ ] Extract ZIP and verify structure:
    ```
    skill-name/
    ├── SKILL.md
    ├── scripts/ (if any)
    ├── references/ (if any)
    └── assets/ (if any)
    ```
  - [ ] Open SKILL.md - should be valid markdown
  - [ ] Verify all entered data is present
- [ ] Click "Start Over" - should reset form (after confirmation)

### Auto-Save Feature
- [ ] Fill out some fields in Step 1
- [ ] Wait 2-3 seconds for auto-save
- [ ] Refresh page
- [ ] Check if "Resume" button appears
- [ ] Click "Resume" - should restore previous data
- [ ] Click "Start Fresh" - should clear saved data

### Edge Cases & Error Handling
- [ ] Try to proceed with invalid data - should show errors and prevent advancement
- [ ] Test browser back/forward buttons - should maintain state
- [ ] Test on mobile viewport - should be responsive
- [ ] Test with very long text (>1000 lines) - should handle gracefully
- [ ] Test with special characters in fields - should handle properly
- [ ] Test file uploads with large files - should validate size if applicable
- [ ] Test without internet (after initial load) - should still work (offline capable)

### Browser Compatibility
- [ ] Chrome/Chromium - Latest
- [ ] Firefox - Latest
- [ ] Safari - Latest (if available)
- [ ] Edge - Latest

### Performance Checks
- [ ] Page load time - should be < 2 seconds
- [ ] Real-time validation - should be instant (< 100ms)
- [ ] Auto-save debounce - should trigger after 2 seconds of inactivity
- [ ] ZIP generation - should complete in < 5 seconds for typical skills
- [ ] No console errors on any step
- [ ] No memory leaks (test by going through wizard multiple times)

## Known Limitations
1. Browser storage limits: localStorage can store ~5-10MB depending on browser
2. File upload size: No hard limit enforced (relies on browser memory)
3. ZIP generation: Large files may cause performance issues in older browsers

## Debugging Tips

### If Page Doesn't Load
1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab to verify all resources loaded
4. Verify web server is running on correct port

### If Validation Doesn't Work
1. Check Console for JavaScript errors
2. Verify element IDs match between HTML and JS
3. Check that validation.js is loaded
4. Test with simpler input first

### If Auto-Save Doesn't Work
1. Check if localStorage is enabled (some browsers block in private mode)
2. Open Application/Storage tab in DevTools
3. Look for 'agentSkillBuilder_draft' key
4. Check Console for any localStorage errors

### If ZIP Download Fails
1. Check Console for errors
2. Verify JSZip library loaded correctly
3. Test with minimal skill (no scripts/assets)
4. Check browser popup/download blocker settings

## Reporting Issues
If you find bugs or have suggestions, please note:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots (if helpful)

## Test Environment
- Tested on: [Date]
- Browser: [Browser name + version]
- Operating System: [OS]
- Issues Found: [List or "None"]
- Status: [Pass/Fail]
