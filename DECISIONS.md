# Architectural Decisions

This document records key architectural and design decisions made during the development of the Agent Skill Builder.

## ADR-001: Static Website with No Build Process

**Status:** Accepted

**Context:**
We needed to decide between a modern framework with a build process (React, Vue, Svelte) or a simple static website approach.

**Decision:**
Use plain HTML/CSS/JavaScript with no build process or framework.

**Consequences:**

**Positive:**
- Zero setup friction - users can immediately open index.html
- No npm dependencies to install or maintain
- No build step failures or configuration issues
- Instant development feedback (edit and refresh)
- Easy to host (any static file server)
- Easy to understand and contribute to
- Smaller total bundle size
- Works offline immediately

**Negative:**
- No component reusability (accepted - single page app)
- No TypeScript type safety (mitigated with JSDoc comments)
- Manual DOM manipulation (acceptable for this scale)
- No hot module replacement (page refresh is fast enough)

**Alternatives Considered:**
- React + Vite: Rejected due to build complexity
- Vue + Vite: Rejected due to build complexity
- Svelte: Rejected due to build complexity

---

## ADR-002: Tailwind CSS via CDN

**Status:** Accepted

**Context:**
We needed a styling approach that provides rapid development without requiring a build process.

**Decision:**
Use Tailwind CSS via CDN with custom CSS for specific components.

**Consequences:**

**Positive:**
- Rapid UI development with utility classes
- Consistent design system out of the box
- No build process required for CSS
- Smaller custom CSS file to maintain
- Mobile-responsive utilities built-in

**Negative:**
- Larger initial CSS bundle (~50KB from CDN)
- Cannot purge unused classes (not a major issue)
- Mixing utility and custom CSS (acceptable)

**Alternatives Considered:**
- Custom CSS only: More work, less consistent
- Bootstrap: Heavier, less flexible
- No CSS framework: Too much manual styling work

---

## ADR-003: Client-Side ZIP Generation

**Status:** Accepted

**Context:**
We needed to generate a downloadable directory structure for the skill files.

**Decision:**
Use JSZip library to generate ZIP files entirely in the browser.

**Consequences:**

**Positive:**
- No server required
- Immediate download
- Works offline
- User data never leaves their browser (privacy)
- Simple implementation

**Negative:**
- Requires JavaScript library dependency
- Memory usage spike during ZIP generation
- Limited to files that fit in browser memory

**Alternatives Considered:**
- Server-side generation: Rejected (no backend requirement)
- Separate file downloads: Less convenient for users
- Copy to clipboard only: Requires manual directory setup

---

## ADR-004: localStorage for Auto-Save

**Status:** Accepted

**Context:**
Users might lose their work if they accidentally close the browser or navigate away.

**Decision:**
Implement auto-save functionality using localStorage with 2-second debouncing.

**Consequences:**

**Positive:**
- User work is preserved across sessions
- No backend storage required
- Fast and synchronous
- Privacy-friendly (data stays local)
- Easy to clear via "Clear Draft" button

**Negative:**
- Limited to ~5-10MB storage (sufficient for text)
- Not synced across devices
- Can be cleared by browser
- Only works in same browser/device

**Alternatives Considered:**
- No auto-save: Rejected (too risky for users)
- Server-side storage: Rejected (no backend)
- IndexedDB: Overkill for simple key-value storage

---

## ADR-005: Multi-Step Wizard Interface

**Status:** Accepted

**Context:**
The skill creation form has many fields across required and optional sections.

**Decision:**
Implement a 5-step wizard with progressive disclosure and step validation.

**Consequences:**

**Positive:**
- Reduces cognitive load (one section at a time)
- Clear progress indication
- Step-by-step validation prevents errors
- Natural flow from required to optional
- Better mobile experience

**Negative:**
- Cannot see all fields at once
- Requires navigation between steps
- More complex state management

**Alternatives Considered:**
- Single-page form: Too overwhelming
- Accordion sections: Less clear progression
- Tabbed interface: Less mobile-friendly

---

## ADR-006: Real-Time Validation

**Status:** Accepted

**Context:**
Users need immediate feedback on whether their input meets specification requirements.

**Decision:**
Implement real-time validation on input events with visual feedback (borders, icons, messages).

**Consequences:**

**Positive:**
- Immediate user feedback
- Prevents invalid data entry
- Reduces frustration at submission
- Teaches specification requirements
- Visual indicators (green/red borders)

**Negative:**
- Can be annoying during typing (mitigated with debouncing)
- More complex validation logic
- Performance consideration for large content

**Alternatives Considered:**
- Validation only on blur: Less immediate
- Validation only on submit: Too late
- No validation: Breaks specification compliance

---

## ADR-007: Inline Help via Tooltips

**Status:** Accepted

**Context:**
Users need guidance on specification requirements without cluttering the interface.

**Decision:**
Implement hover tooltips with detailed help content extracted from the specification.

**Consequences:**

**Positive:**
- Help is contextual and on-demand
- Doesn't clutter the main interface
- Can include detailed specification quotes
- Mobile users can tap to see tooltips

**Negative:**
- Not immediately visible (discovery issue)
- Requires hover interaction
- Not accessible to keyboard-only users (mitigated with focus)

**Alternatives Considered:**
- Separate help page: Too far from context
- Always-visible help text: Too cluttered
- Modal dialogs: Interrupts flow

---

## ADR-008: Minimal Design Aesthetic

**Status:** Accepted

**Context:**
We needed to choose a visual design direction.

**Decision:**
Use a minimal, utilitarian design focused on functionality over visual flair.

**Consequences:**

**Positive:**
- Fast to implement
- Doesn't distract from content
- Professional appearance
- Works for any audience
- Easy to customize later

**Negative:**
- May seem plain or boring
- Less "delightful" user experience
- Fewer visual cues

**Alternatives Considered:**
- Friendly/approachable: More work, subjective taste
- Professional/enterprise: Too formal for open source
- Colorful/playful: Doesn't match technical nature

---

## ADR-009: Copy-to-Clipboard as Secondary Option

**Status:** Accepted

**Context:**
Some users may be skeptical of downloading ZIP files from websites.

**Decision:**
Provide "Copy SKILL.md to Clipboard" as an alternative to ZIP download, with "View All Files" for manual copying.

**Consequences:**

**Positive:**
- Accommodates cautious users
- Quick access to SKILL.md content
- Can paste directly into editor
- No download required

**Negative:**
- Requires manual directory setup
- Only copies one file at a time (SKILL.md)
- More effort for users with many files

**Alternatives Considered:**
- ZIP download only: Doesn't serve skeptical users
- Clipboard only: Too manual for complex skills
- GitHub gist generation: Requires backend

---

## ADR-010: No Example Skills in Initial Version

**Status:** Accepted (Temporary)

**Context:**
We considered including pre-built example skills users could load as templates.

**Decision:**
Launch without example skills, add them in a future version.

**Consequences:**

**Positive:**
- Faster initial launch
- Simpler codebase initially
- Can iterate based on user feedback
- Blank slate encourages creativity

**Negative:**
- Users have no starting point
- More intimidating for beginners
- Misses learning opportunity

**Future Plan:**
- Add example skills in v1.1
- Include button to "Load Example"
- Provide templates for common skill types

---

## ADR-011: Form Data Structure

**Status:** Accepted

**Context:**
We needed to decide how to structure the form data in memory.

**Decision:**
Use a flat object structure with arrays for dynamic components (metadata, scripts, references, assets).

```javascript
{
    name: string,
    description: string,
    instructions: string,
    license: string,
    compatibility: string,
    allowedTools: string,
    metadata: [{key, value}, ...],
    scripts: [{filename, content}, ...],
    references: [{filename, content}, ...],
    assets: [{filename, content}, ...]
}
```

**Consequences:**

**Positive:**
- Simple to serialize to JSON/localStorage
- Easy to validate each field
- Clear mapping to SKILL.md structure
- Easy to add/remove dynamic items

**Negative:**
- No nested structure (not needed)
- Duplicates some data (accepted)

**Alternatives Considered:**
- Nested objects: More complex, not needed
- Separate state for each step: Harder to validate
- Form serialization: Less control

---

## ADR-012: Debounced Auto-Save at 2 Seconds

**Status:** Accepted

**Context:**
We needed to balance data safety with performance.

**Decision:**
Debounce auto-save to localStorage with a 2-second delay after user stops typing.

**Consequences:**

**Positive:**
- Reduces localStorage write frequency
- Avoids performance issues
- Still captures work quickly
- User doesn't notice the delay

**Negative:**
- 2 seconds of work could be lost in edge case
- More complex implementation than immediate save

**Alternatives Considered:**
- Immediate save: Too many writes
- 5-second delay: Too risky
- Save only on navigation: Too late

---

## ADR-013: Validation Based on Specification

**Status:** Accepted

**Context:**
We needed validation rules that match the Agent Skills specification exactly.

**Decision:**
Implement validation rules directly from the specification with clear error messages.

**Consequences:**

**Positive:**
- Guarantees specification compliance
- Educational for users
- Prevents invalid skills
- Clear error messages

**Negative:**
- Tightly coupled to specification
- Must update if spec changes
- May reject creative uses

**Future Consideration:**
- Add "relaxed mode" for experimentation
- Link to specification in error messages

---

## ADR-014: Single HTML File

**Status:** Accepted

**Context:**
We could split the HTML into multiple files or keep it in one.

**Decision:**
Keep all HTML in a single index.html file with all steps included.

**Consequences:**

**Positive:**
- Single file to serve
- No routing required
- Simple deployment
- Easy to understand structure
- Fast initial load (no network requests)

**Negative:**
- Larger single file (~35KB)
- All steps loaded upfront (acceptable)
- Harder to maintain if much larger

**Alternatives Considered:**
- Separate HTML per step: Requires routing
- Template system: Adds complexity
- HTML in JS: Harder to read/edit

---

## ADR-015: No Server-Side Validation

**Status:** Accepted

**Context:**
We could use the skills-ref validation library via an API.

**Decision:**
Implement all validation client-side based on specification rules.

**Consequences:**

**Positive:**
- Works offline
- No backend required
- Instant feedback
- No network latency
- Privacy (data stays local)

**Negative:**
- Validation logic duplicated
- May diverge from official validator
- Cannot use skills-ref library directly

**Future Enhancement:**
- Optional: Call validation API for verification
- Display "Validated with skills-ref" badge

---

## ADR-016: Starter Text Instead of Placeholder for Instructions

**Status:** Accepted

**Context:**
The instructions textarea (Step 2) initially used a placeholder attribute to guide users on structure. However, placeholders disappear when users click into the field, and users often needed to reference the structure while writing.

**Decision:**
Use pre-filled starter text content in the textarea instead of a placeholder attribute. The starter text includes markdown section headers that provide structure guidance.

**Consequences:**

**Positive:**
- Users can see and modify the suggested structure
- Structure remains visible while typing
- Provides concrete starting point rather than empty field
- Users can delete sections they don't need
- Reduces "blank page syndrome" for new users
- More intuitive for first-time users

**Negative:**
- Users must delete starter text if they want completely custom structure
- Slightly more text to manage initially
- Could be seen as prescriptive rather than suggestive

**Implementation:**
```html
<textarea>
# Overview

## When to use this skill

## Step-by-step instructions

## Examples

## Common edge cases

## Next steps
</textarea>
```

**Alternatives Considered:**
- Keep placeholder only: Rejected (disappears on focus)
- Add "Insert Template" button: More complex, less discoverable
- Show template in sidebar: Takes up screen space
- No guidance: Too intimidating for new users

---

## Summary of Key Principles

Based on these decisions, our key principles are:

1. **Simplicity**: No build process, no backend, no framework
2. **Accessibility**: Works everywhere, loads fast, mobile-friendly
3. **Privacy**: All data stays in the browser
4. **Specification Compliance**: Strict validation based on official spec
5. **User Safety**: Auto-save, clear feedback, validation
6. **Developer Experience**: Easy to understand, modify, and deploy

## Consequences

These decisions result in:
- **Fast development**: New features can be added quickly
- **Easy deployment**: Copy files to any static host
- **Good UX**: Fast, responsive, helpful
- **Maintainable**: Simple codebase, clear organization
- **Future-proof**: Easy to enhance incrementally
