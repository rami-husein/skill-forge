# Agent Skill Builder

A static website for building AI agent skills with an interactive wizard interface. Create properly formatted agent skill directories that comply with the [Agent Skills specification](https://github.com/agentskills/agentskills).

## Features

- **Multi-step wizard interface** - Progressive disclosure with 5 intuitive steps
- **Real-time validation** - Instant feedback on name format, character limits, and requirements
- **Auto-save functionality** - Never lose your work with automatic localStorage drafts
- **ZIP download** - Generate complete skill directory as a downloadable ZIP file
- **Copy to clipboard** - Quick copy of SKILL.md content for skeptical users
- **File preview** - View and copy all generated files before downloading
- **Inline help** - Contextual tooltips throughout with specification details
- **Mobile responsive** - Works seamlessly on all device sizes
- **No backend required** - Pure client-side static website

## Quick Start

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **Fill in the wizard**: Follow the 5-step process to define your agent skill
3. **Download your skill**: Get a properly formatted skill directory as a ZIP file

No installation, no build process, no server required!

## Usage

### Step 1: Basic Information
- Enter a skill name (lowercase, hyphens, 1-64 chars)
- Write a clear description (1-1024 chars, include what and when)

### Step 2: Main Instructions
- Write comprehensive markdown instructions
- Include step-by-step guides, examples, and edge cases
- Recommended: Keep under 500 lines

### Step 3: Optional Metadata
- Add license information (optional)
- Specify compatibility requirements (optional)
- Define custom metadata key-value pairs (optional)
- List allowed tools (optional, experimental)

### Step 4: Additional Components
- Add scripts (Python, Bash, JavaScript, etc.)
- Include reference documentation files
- Attach asset files (templates, configs, data)

### Step 5: Review & Generate
- Review your configuration
- See validation results
- Preview directory structure
- Download as ZIP or copy files

## Validation Rules

Based on the [Agent Skills specification](https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx):

### Skill Name
- 1-64 characters
- Lowercase letters (a-z), numbers (0-9), and hyphens (-) only
- Cannot start or end with a hyphen
- No consecutive hyphens (--)
- Must match directory name

### Description
- 1-1024 characters
- Should describe what the skill does and when to use it
- Include specific keywords for agent discoverability

### Instructions
- Required markdown content
- Recommended: < 500 lines
- Move detailed content to reference files

### Compatibility (optional)
- Max 500 characters
- Indicate environment requirements if needed

## Output Format

The generated skill follows this structure:

```
skill-name/
├── SKILL.md              # Required: metadata + instructions
├── LICENSE.txt           # Optional: license content
├── scripts/              # Optional: executable code
│   └── script.py
├── references/           # Optional: additional docs
│   └── REFERENCE.md
└── assets/               # Optional: static resources
    └── template.json
```

## Technology Stack

- **HTML/CSS/JavaScript** - Pure vanilla, no frameworks
- **Tailwind CSS** - Utility-first styling via CDN
- **JSZip** - Client-side ZIP generation
- **FileSaver.js** - File download functionality
- **localStorage** - Auto-save draft persistence

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires JavaScript enabled and localStorage support.

## Development

This is a static website with no build process:

1. Clone the repository
2. Open `index.html` in a browser
3. Make changes to HTML/CSS/JS files
4. Refresh browser to see changes

### Testing

See [TESTING.md](TESTING.md) for comprehensive testing instructions and checklist.

Quick test:
```bash
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

### File Structure

```
skill-forge/
├── index.html           # Main HTML with all form steps
├── css/
│   └── styles.css      # Custom styles supplementing Tailwind
├── js/
│   ├── app.js          # Main application logic and UI
│   ├── validation.js   # Validation rules and helpers
│   ├── generator.js    # File/ZIP generation logic
│   └── wizard.js       # Wizard navigation and state
├── assets/             # Future: logos, images
├── README.md           # This file
├── PROJECT_STRUCTURE.md # Detailed structure documentation
├── DECISIONS.md        # Architecture decisions
└── ROADMAP.md          # Future enhancements

```

## Agent Skills Specification

This tool implements the Agent Skills format specification maintained at:
- https://github.com/agentskills/agentskills
- https://modelcontextprotocol.io (related MCP protocol)

Key specification documents:
- [Specification](https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx)
- [What are skills?](https://github.com/agentskills/agentskills/blob/main/docs/what-are-skills.mdx)
- [Integrate skills](https://github.com/agentskills/agentskills/blob/main/docs/integrate-skills.mdx)

## Contributing

Contributions welcome! This project follows:
- Clarity over cleverness
- Minimal dependencies
- No build process requirement
- Accessibility best practices

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Agent Skills specification by [Anthropic](https://www.anthropic.com/)
- [Agent Skills community](https://github.com/agentskills/agentskills)
- Example skills from [Anthropic's skills repository](https://github.com/anthropics/skills)

## Support

For issues or questions:
- Open an issue on GitHub
- Check the [Agent Skills documentation](https://github.com/agentskills/agentskills/tree/main/docs)
- Review [example skills](https://github.com/anthropics/skills) for reference

---

Built with care for the AI agent ecosystem 🤖