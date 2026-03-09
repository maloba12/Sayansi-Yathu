#!/bin/bash
# Force Sayansi Yathu 3D window to front

echo "🔍 Looking for Sayansi Yathu 3D windows..."

# Try to find and focus the window
if command -v wmctrl &> /dev/null; then
    WINDOW_ID=$(wmctrl -l | grep -i "sayansi yathu" | awk '{print $1}')
    if [ ! -z "$WINDOW_ID" ]; then
        echo "📱 Found window: $WINDOW_ID"
        wmctrl -i -a "$WINDOW_ID"
        echo "✅ Brought window to front"
    else
        echo "❌ No Sayansi Yathu window found"
    fi
else
    echo "⚠️  wmctrl not installed. Install with: sudo apt install wmctrl"
fi

# Alternative using xdotool
if command -v xdotool &> /dev/null; then
    echo "🔍 Trying xdotool..."
    xdotool search --name "Sayansi Yathu" windowactivate
fi

echo "💡 Manual methods:"
echo "   - Press Alt+Tab to cycle windows"
echo "   - Check taskbar for 'Sayansi Yathu'"
echo "   - Try Ctrl+Alt+Arrow keys to check other workspaces"
