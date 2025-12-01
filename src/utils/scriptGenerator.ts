import { Selection } from '@/types/tools';

export const generateSetupScript = (selection: Selection): string => {
  const { tools, customScripts } = selection;

  let script = `#!/bin/bash

# ==============================================================================
#  B A S E L I N E
#  Automated macOS Development Environment Setup
# ==============================================================================

# Trap Ctrl+C to restore cursor
trap 'tput cnorm; echo -e "\\n\\n\${RED}✖ Setup aborted by user\${RESET}"; exit 1' SIGINT

# --- 1. THE UI ENGINE ---------------------------------------------------------

# Colors & Styles
ESC=$(printf '\\033')
RESET="\${ESC}[0m"
BOLD="\${ESC}[1m"
DIM="\${ESC}[2m"
ITALIC="\${ESC}[3m"

# Neon Palette
CYAN="\${ESC}[38;5;51m"
GREEN="\${ESC}[38;5;46m"
PURPLE="\${ESC}[38;5;99m"
PINK="\${ESC}[38;5;213m"
YELLOW="\${ESC}[38;5;226m"
RED="\${ESC}[38;5;196m"
GRAY="\${ESC}[38;5;240m"
WHITE="\${ESC}[38;5;255m"

# Icons
ICON_ROCKET="🚀"
ICON_CHECK="✔"
ICON_CROSS="✖"
ICON_GEAR="⚡"
ICON_PKG="📦"
ICON_CODE=" "
ICON_WRENCH="🔧"
ICON_ARROW="➜"
ICON_TIME="⏱"
ICON_SPARKLE="✨"

# Configuration
SETUP_VERSION="1.0.0"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
START_TIME=$(date +%s)
LOG_FILE="/tmp/baseline.log"

set -e

# Initialize log file
echo "Baseline Setup Started: \$TIMESTAMP" > "\$LOG_FILE"
echo "======================================" >> "\$LOG_FILE"
echo "" >> "\$LOG_FILE"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

# Function: Typewriter Effect
typewriter() {
    text="$1"
    delay="$2"
    for (( i=0; i<\${#text}; i++ )); do
        echo -n "\${text:$i:1}"
        sleep "$delay"
    done
    echo ""
}

# Function: The Header
show_header() {
    clear
    echo ""
    # Gradient-ish ASCII Art
    echo -e "\${PURPLE}  ██████╗  █████╗ ███████╗███████╗██╗     ██╗███╗   ██╗███████╗\${RESET}"
    echo -e "\${PURPLE}  ██╔══██╗██╔══██╗██╔════╝██╔════╝██║     ██║████╗  ██║██╔════╝\${RESET}"
    echo -e "\${CYAN}  ██████╔╝███████║███████╗█████╗  ██║     ██║██╔██╗ ██║█████╗  \${RESET}"
    echo -e "\${CYAN}  ██╔══██╗██╔══██║╚════██║██╔══╝  ██║     ██║██║╚██╗██║██╔══╝  \${RESET}"
    echo -e "\${PINK}  ██████╔╝██║  ██║███████║███████╗███████╗██║██║ ╚████║███████╗\${RESET}"
    echo -e "\${PINK}  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝\${RESET}"
    echo ""
    
    echo -ne "  \${BOLD}\${WHITE}"
    typewriter "Development Environment Setup v\${SETUP_VERSION}" 0.02
    echo -e "\${RESET}"
    echo -e "  \${GRAY}Generated: $(date '+%Y-%m-%d %H:%M:%S')\${RESET}"
    echo -e "  \${GRAY}────────────────────────────────────────────────────────────\${RESET}"
    echo ""
}

# Function: Section Header
section() {
    echo ""
    echo -e "  \${BOLD}\${PINK}:: $1\${RESET}"
}

# Function: Async Spinner
execute() {
    local label="$1"
    local cmd="$2"
    
    # Hide Cursor
    tput civis
    
    # Run command in background
    eval "$cmd" >> "\$LOG_FILE" 2>&1 &
    local pid=$!
    
    # Spinner Animation Frames (Braille)
    local spin='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    local i=0
    
    while kill -0 $pid 2>/dev/null; do
        i=$(( (i+1) % 10 ))
        printf "\\r  \${CYAN}\${spin:$i:1}\${RESET} \${WHITE}%-40s\${RESET}" "$label..."
        sleep 0.08
    done
    
    wait $pid
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET}\\n" "$label"
    else
        printf "\\r  \${RED}\${ICON_CROSS}\${RESET} \${WHITE}%-40s\${RESET} \${RED}Failed\${RESET}\\n" "$label"
    fi
    
    tput cnorm
}

# ============================================================================
# SYSTEM CHECKS
# ============================================================================

check_macos() {
    if [[ ! "$OSTYPE" == "darwin"* ]]; then
        echo -e "\${RED}\${ICON_CROSS} This script is designed for macOS only.\${RESET}"
        exit 1
    fi
}

# ============================================================================
# MAIN SETUP
# ============================================================================

main() {
    show_header
    # Install Homebrew if not present
    tput civis
    if ! command -v brew &> /dev/null; then
        printf "  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" >> "\$LOG_FILE" 2>&1
        
        # Add Homebrew to PATH
        if [[ $(uname -m) == 'arm64' ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        else
            echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/usr/local/bin/brew shellenv)"
        fi
        printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET}\\n" "Installing Homebrew"
    else
        printf "  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}Already installed\${RESET}\\n" "Homebrew"
    fi
    tput cnorm

`;

  // Group tools by type
  const brewFormulae = tools.filter(t => t.type === 'brew');
  const brewCasks = tools.filter(t => t.type === 'brew-cask');
  const customInstalls = tools.filter(t => t.type === 'custom');

  // Install brew formulae
  if (brewFormulae.length > 0) {
    script += `    section "Installing Homebrew Formulae"
    
    tput civis
`;
    brewFormulae.forEach(tool => {
      const installCmd = tool.installCommand.replace('brew install ', '');
      script += `    if brew list ${installCmd} &>/dev/null 2>&1; then
        printf "  \${GRAY}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${DIM}Skipped (already installed)\${RESET}\\n" "${tool.name}"
    else
        printf "  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Installing ${tool.name}..."
        if brew install ${installCmd} >> "\$LOG_FILE" 2>&1; then
            printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET}\\n" "${tool.name}"
        else
            printf "\\r  \${RED}\${ICON_CROSS}\${RESET} \${WHITE}%-40s\${RESET} \${RED}Failed\${RESET}\\n" "${tool.name}"
        fi
    fi
    
`;
    });
    script += `    tput cnorm\n\n`;
  }

  // Install brew casks
  if (brewCasks.length > 0) {
    script += `    section "Installing Applications (Casks)"
    
    tput civis
`;
    brewCasks.forEach(tool => {
      const installCmd = tool.installCommand.replace('brew install --cask ', '');
      script += `    # Check if app exists in /Applications (manual install) or via Homebrew
    APP_NAME="${tool.name}"
    CASK_NAME="${installCmd}"
    
    if [ -d "/Applications/\$APP_NAME.app" ] || [ -d "/Applications/\$CASK_NAME.app" ] || [ -d "$HOME/Applications/\$APP_NAME.app" ] || [ -d "$HOME/Applications/\$CASK_NAME.app" ]; then
        printf "  \${GRAY}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${DIM}Skipped (already installed)\${RESET}\\n" "\$APP_NAME"
    elif brew list --cask \$CASK_NAME &>/dev/null 2>&1; then
        printf "  \${GRAY}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${DIM}Skipped (already installed via Homebrew)\${RESET}\\n" "\$APP_NAME"
    else
        printf "  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Installing \$APP_NAME..."
        if brew install --cask \$CASK_NAME >> "\$LOG_FILE" 2>&1; then
            printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET}\\n" "\$APP_NAME"
        else
            printf "\\r  \${YELLOW}\${ICON_CROSS}\${RESET} \${WHITE}%-40s\${RESET} \${YELLOW}Skipped (not available or error)\${RESET}\\n" "\$APP_NAME"
        fi
    fi
    
`;
    });
    script += `    tput cnorm\n\n`;
  }

  // Custom installations
  if (customInstalls.length > 0) {
    script += `    section "Custom Installations"
    
`;
    customInstalls.forEach(tool => {
      script += `    echo -e "  \${PINK}\${ICON_WRENCH}\${RESET} \${WHITE}Installing ${tool.name}...\${RESET}"
    ${tool.installCommand}
    
`;
    });
  }

  // Custom scripts
  if (customScripts.length > 0) {
    script += `    section "Applying Custom Configurations"
    
`;
    customScripts.forEach(cs => {
      if (cs.type === 'dotfile') {
        script += `    echo -e "  \${CYAN}\${ICON_CODE}\${RESET} \${WHITE}Adding ${cs.name}...\${RESET}"
    cat >> ~/.zshrc << 'EOF'
${cs.content}
EOF
    
`;
      } else {
        script += `    echo -e "  \${PURPLE}\${ICON_GEAR}\${RESET} \${WHITE}Running ${cs.name}...\${RESET}"
    ${cs.content}
    
`;
      }
    });
  }

  script += `    # Final Calculation
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    # Completion Summary
    echo ""
    echo -e "  \${GREEN}\${BOLD}\${ICON_SPARKLE} SETUP COMPLETED SUCCESSFULLY\${RESET}"
    echo ""
    echo -e "  \${PURPLE}\${ICON_TIME} Time:\${RESET}            \${WHITE}\${DURATION}s\${RESET}"
    echo -e "  \${CYAN}\${ICON_ARROW} Log File:\${RESET}        \${WHITE}\$LOG_FILE\${RESET}"
    echo ""
    echo -e "  \${BOLD}Next Steps:\${RESET}"
    echo -e "    \${GREEN}1.\${RESET} Restart your terminal or run: \${CYAN}source ~/.zshrc\${RESET}"
    echo -e "    \${GREEN}2.\${RESET} Verify installations with: \${CYAN}brew doctor\${RESET}"
    echo -e "    \${GREEN}3.\${RESET} Start building amazing things!"
    echo ""
    echo -e "  \${GREEN}\${ICON_ROCKET}\${RESET} \${BOLD}Your Mac is ready!\${RESET}"
    echo ""
}

main
`;

  return script;
};

