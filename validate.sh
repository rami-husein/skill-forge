#!/bin/bash
# Quick validation script for Agent Skill Builder

echo "🔍 Agent Skill Builder - Validation Script"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Run this script from the project root."
    exit 1
fi

echo "✅ Found index.html"

# Check JavaScript syntax
echo ""
echo "📝 Checking JavaScript syntax..."
for file in js/*.js; do
    if node --check "$file" 2>/dev/null; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - Syntax error!"
        exit 1
    fi
done

# Check HTML structure
echo ""
echo "📄 Checking HTML structure..."

# Count textarea tags
OPEN_TEXTAREA=$(grep -c "<textarea" index.html)
CLOSE_TEXTAREA=$(grep -c "</textarea>" index.html)

if [ "$OPEN_TEXTAREA" -eq "$CLOSE_TEXTAREA" ]; then
    echo "  ✅ Textarea tags balanced ($OPEN_TEXTAREA opening, $CLOSE_TEXTAREA closing)"
else
    echo "  ❌ Textarea tags unbalanced ($OPEN_TEXTAREA opening, $CLOSE_TEXTAREA closing)"
    exit 1
fi

# Check for required elements
echo ""
echo "🔧 Checking required HTML elements..."

REQUIRED_IDS=(
    "skillName"
    "skillNameFeedback"
    "skillDescription"
    "skillDescriptionFeedback"
    "skillInstructions"
    "skillInstructionsFeedback"
    "skillLicense"
    "skillCompatibility"
    "compatibilityFeedback"
)

MISSING=0
for id in "${REQUIRED_IDS[@]}"; do
    if grep -q "id=\"$id\"" index.html; then
        echo "  ✅ $id"
    else
        echo "  ❌ $id - MISSING!"
        MISSING=$((MISSING + 1))
    fi
done

if [ $MISSING -gt 0 ]; then
    echo ""
    echo "❌ Found $MISSING missing elements"
    exit 1
fi

# Check for documentation files
echo ""
echo "📚 Checking documentation files..."

DOC_FILES=(
    "README.md"
    "PROJECT_STRUCTURE.md"
    "CHANGELOG.md"
    "ROADMAP.md"
    "DECISIONS.md"
    "TESTING.md"
)

for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ⚠️  $file - Missing (recommended)"
    fi
done

# Check directory structure
echo ""
echo "📁 Checking directory structure..."

REQUIRED_DIRS=(
    "css"
    "js"
    "assets"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir/"
    else
        echo "  ❌ $dir/ - MISSING!"
        exit 1
    fi
done

# Check if web server is running
echo ""
echo "🌐 Checking if web server is running..."
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/ 2>/dev/null | grep -q "200"; then
    echo "  ✅ Web server running at http://127.0.0.1:8000/"
    echo "  🌍 Open in browser: http://127.0.0.1:8000/"
else
    echo "  ⚠️  No web server detected on port 8000"
    echo "  💡 Start with: python3 -m http.server 8000"
fi

echo ""
echo "=========================================="
echo "✅ All validation checks passed!"
echo ""
echo "Next steps:"
echo "  1. Open http://127.0.0.1:8000/ in your browser"
echo "  2. Follow the testing checklist in TESTING.md"
echo "  3. Test all 5 wizard steps thoroughly"
echo ""
