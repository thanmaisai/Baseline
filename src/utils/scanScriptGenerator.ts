export const generateScanScript = (): string => {
  return `#!/bin/bash

# ==============================================================================
#  B A S E L I N E   -   U L T I M A T E   E D I T I O N
#  The gold standard for macOS configuration scanning.
# ==============================================================================

# Trap Ctrl+C to restore cursor
trap 'tput cnorm; echo -e "\\n\\n\${RED}✖ Aborted by user\${RESET}"; exit 1' SIGINT

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
ICON_LOCK="🔒"
ICON_ARROW="➜"
ICON_TIME="⏱"

# Configuration
OUTPUT_JSON="baseline-scan.json"
OUTPUT_ARCHIVE="baseline-scan.tar.gz"
SCAN_VERSION="2.0.0"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
START_TIME=$(date +%s)

set -e
set -o pipefail

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
    typewriter "System Configuration Scanner v\${SCAN_VERSION}" 0.02
    echo -e "\${RESET}"
    echo -e "  \${GRAY}Initialize sequence...\${RESET}"
    echo -e "  \${GRAY}────────────────────────────────────────────────────────────\${RESET}"
    echo ""
}

# Function: Section Header
section() {
    echo ""
    echo -e "  \${BOLD}\${PINK}:: $1\${RESET}"
}

# Function: Async Spinner with Result Capture
execute() {
    local label="$1"
    local cmd="$2"
    
    # Hide Cursor
    tput civis
    
    # Run command in background
    eval "$cmd" >> /dev/null 2>&1 &
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

json_escape() {
  printf '%s' "$1" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'
}

# ============================================================================
# SCANNING FUNCTIONS
# ============================================================================

scan_system_info() {
  HOSTNAME=$(hostname)
  MACOS_VERSION=$(sw_vers -productVersion)
  MACOS_BUILD=$(sw_vers -buildVersion)
  HARDWARE_MODEL=$(sysctl -n hw.model)
  ARCH=$(uname -m)
}

scan_homebrew() {
  if command -v brew &> /dev/null; then
    BREW_PREFIX=$(brew --prefix)
    BREW_VERSION=$(brew --version | head -n1 | awk '{print \$2}')
    
    # Get formulae
    BREW_FORMULAE=$(brew list --formula 2>/dev/null || echo "")
    FORMULAE_COUNT=$(echo "\$BREW_FORMULAE" | grep -v "^$" | wc -l | tr -d ' ')
    
    # Get casks
    BREW_CASKS=$(brew list --cask 2>/dev/null || echo "")
    CASKS_COUNT=$(echo "\$BREW_CASKS" | grep -v "^$" | wc -l | tr -d ' ')
    
    # Get taps
    BREW_TAPS=$(brew tap 2>/dev/null || echo "")
    TAPS_COUNT=$(echo "\$BREW_TAPS" | grep -v "^$" | wc -l | tr -d ' ')
  else
    BREW_PREFIX=""
    BREW_VERSION=""
    BREW_FORMULAE=""
    BREW_CASKS=""
    BREW_TAPS=""
  fi
}

scan_applications() {
  # Scan /Applications
  APP_LIST=$(find /Applications -maxdepth 2 -name "*.app" -type d 2>/dev/null | sort)
  APP_COUNT=$(echo "\$APP_LIST" | grep -v "^$" | wc -l | tr -d ' ')
  
  # Get just app names (without .app extension and path)
  APP_NAMES=$(echo "\$APP_LIST" | sed 's|.*/||' | sed 's|.app$||' | sort)
}

scan_vscode() {
  if command -v code &> /dev/null; then
    # Extensions
    VSCODE_EXTENSIONS=$(code --list-extensions 2>/dev/null || echo "")
    EXT_COUNT=$(echo "\$VSCODE_EXTENSIONS" | grep -v "^$" | wc -l | tr -d ' ')
    
    # Settings
    VSCODE_SETTINGS_PATH="$HOME/Library/Application Support/Code/User/settings.json"
    if [ -f "\$VSCODE_SETTINGS_PATH" ]; then
      VSCODE_SETTINGS=$(cat "\$VSCODE_SETTINGS_PATH" 2>/dev/null || echo "{}")
    else
      VSCODE_SETTINGS="{}"
    fi
    
    # Keybindings
    VSCODE_KEYBINDINGS_PATH="$HOME/Library/Application Support/Code/User/keybindings.json"
    if [ -f "\$VSCODE_KEYBINDINGS_PATH" ]; then
      VSCODE_KEYBINDINGS=$(cat "\$VSCODE_KEYBINDINGS_PATH" 2>/dev/null || echo "[]")
    else
      VSCODE_KEYBINDINGS="[]"
    fi
    
    # Snippets
    VSCODE_SNIPPETS_DIR="$HOME/Library/Application Support/Code/User/snippets"
    if [ -d "\$VSCODE_SNIPPETS_DIR" ]; then
      VSCODE_SNIPPETS_FILES=$(find "\$VSCODE_SNIPPETS_DIR" -name "*.json" 2>/dev/null || echo "")
    else
      VSCODE_SNIPPETS_FILES=""
    fi
  else
    VSCODE_EXTENSIONS=""
    VSCODE_SETTINGS="{}"
    VSCODE_KEYBINDINGS="[]"
    VSCODE_SNIPPETS_FILES=""
  fi
}

scan_shell_configs() {
  SHELL_FILES=()
  
  # Zsh
  if [ -f "$HOME/.zshrc" ]; then
    ZSHRC_CONTENT=$(cat "$HOME/.zshrc")
    SHELL_FILES+=(".zshrc")
  else
    ZSHRC_CONTENT=""
  fi
  
  if [ -f "$HOME/.zprofile" ]; then
    ZPROFILE_CONTENT=$(cat "$HOME/.zprofile")
    SHELL_FILES+=(".zprofile")
  else
    ZPROFILE_CONTENT=""
  fi
  
  if [ -f "$HOME/.zshenv" ]; then
    ZSHENV_CONTENT=$(cat "$HOME/.zshenv")
    SHELL_FILES+=(".zshenv")
  else
    ZSHENV_CONTENT=""
  fi
  
  # Bash
  if [ -f "$HOME/.bashrc" ]; then
    BASHRC_CONTENT=$(cat "$HOME/.bashrc")
    SHELL_FILES+=(".bashrc")
  else
    BASHRC_CONTENT=""
  fi
  
  if [ -f "$HOME/.bash_profile" ]; then
    BASH_PROFILE_CONTENT=$(cat "$HOME/.bash_profile")
    SHELL_FILES+=(".bash_profile")
  else
    BASH_PROFILE_CONTENT=""
  fi
  
  # Other common configs
  if [ -f "$HOME/.profile" ]; then
    PROFILE_CONTENT=$(cat "$HOME/.profile")
    SHELL_FILES+=(".profile")
  else
    PROFILE_CONTENT=""
  fi
}

scan_bin_scripts() {
  if [ -d "$HOME/.bin" ]; then
    BIN_SCRIPTS=$(find "$HOME/.bin" -type f -perm +111 2>/dev/null || echo "")
  else
    BIN_SCRIPTS=""
  fi
}

scan_git_config() {
  if command -v git &> /dev/null; then
    # Global config
    GIT_CONFIG=$(git config --list --global 2>/dev/null || echo "")
    
    # .gitconfig file
    if [ -f "$HOME/.gitconfig" ]; then
      GITCONFIG_CONTENT=$(cat "$HOME/.gitconfig")
    else
      GITCONFIG_CONTENT=""
    fi
    
    # .gitignore_global
    if [ -f "$HOME/.gitignore_global" ]; then
      GITIGNORE_GLOBAL=$(cat "$HOME/.gitignore_global")
    else
      GITIGNORE_GLOBAL=""
    fi
  else
    GIT_CONFIG=""
    GITCONFIG_CONTENT=""
    GITIGNORE_GLOBAL=""
  fi
}

scan_ssh_config() {
  if [ -d "$HOME/.ssh" ]; then
    # SSH config
    if [ -f "$HOME/.ssh/config" ]; then
      SSH_CONFIG=$(cat "$HOME/.ssh/config")
    else
      SSH_CONFIG=""
    fi
    
    # List key files (not their contents for security)
    SSH_KEYS=$(find "$HOME/.ssh" -type f \\( -name "id_*" -o -name "*.pub" \\) 2>/dev/null | sed "s|$HOME/.ssh/||" || echo "")
    
    # known_hosts entries count
    if [ -f "$HOME/.ssh/known_hosts" ]; then
      KNOWN_HOSTS_COUNT=$(wc -l < "$HOME/.ssh/known_hosts" | tr -d ' ')
    else
      KNOWN_HOSTS_COUNT=0
    fi
  else
    SSH_CONFIG=""
    SSH_KEYS=""
    KNOWN_HOSTS_COUNT=0
  fi
}

scan_nvm() {
  if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    
    if command -v nvm &> /dev/null; then
      NVM_VERSIONS=$(nvm list 2>/dev/null | grep -v "^->" | sed 's/[->*]//g' | sed 's/^[ \t]*//' | grep "^v" || echo "")
      NVM_CURRENT=$(nvm current 2>/dev/null || echo "")
      VERSION_COUNT=$(echo "\$NVM_VERSIONS" | grep -v "^$" | wc -l | tr -d ' ')
    else
      NVM_VERSIONS=""
      NVM_CURRENT=""
    fi
  else
    NVM_VERSIONS=""
    NVM_CURRENT=""
  fi
}

scan_npm_globals() {
  if command -v npm &> /dev/null; then
    NPM_GLOBALS=$(npm list -g --depth=0 --json 2>/dev/null | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    deps = data.get('dependencies', {})
    for pkg, info in deps.items():
        if pkg != 'npm':
            print(f'{pkg}@{info.get(\"version\", \"latest\")}')
except:
    pass
" || echo "")
  else
    NPM_GLOBALS=""
  fi
}

scan_pyenv() {
  if command -v pyenv &> /dev/null; then
    PYENV_VERSIONS=$(pyenv versions 2>/dev/null | sed 's/[*]//g' | sed 's/^[ \t]*//' | grep "^[0-9]" || echo "")
    PYENV_GLOBAL=$(pyenv global 2>/dev/null || echo "")
  else
    PYENV_VERSIONS=""
    PYENV_GLOBAL=""
  fi
}

scan_rbenv() {
  if command -v rbenv &> /dev/null; then
    RBENV_VERSIONS=$(rbenv versions 2>/dev/null | sed 's/[*]//g' | sed 's/^[ \t]*//' | grep "^[0-9]" || echo "")
    RBENV_GLOBAL=$(rbenv global 2>/dev/null || echo "")
  else
    RBENV_VERSIONS=""
    RBENV_GLOBAL=""
  fi
}

scan_pip_packages() {
  if command -v pip3 &> /dev/null; then
    PIP_PACKAGES=$(pip3 list --format=freeze 2>/dev/null || echo "")
  else
    PIP_PACKAGES=""
  fi
}

# ============================================================================
# JSON GENERATION
# ============================================================================

generate_json() {
  # Create JSON using Python for proper escaping
  python3 << EOF > "\$OUTPUT_JSON"
import json
from datetime import datetime

# System Info
system_info = {
    "hostname": $(json_escape "\$HOSTNAME"),
    "macos_version": $(json_escape "\$MACOS_VERSION"),
    "macos_build": $(json_escape "\$MACOS_BUILD"),
    "hardware_model": $(json_escape "\$HARDWARE_MODEL"),
    "architecture": $(json_escape "\$ARCH"),
    "scan_timestamp": "\$TIMESTAMP",
    "scan_version": "\$SCAN_VERSION"
}

# Homebrew
homebrew = {
    "installed": $([ -n "\$BREW_VERSION" ] && echo "true" || echo "false"),
    "version": $(json_escape "\$BREW_VERSION"),
    "prefix": $(json_escape "\$BREW_PREFIX"),
    "formulae": [x.strip() for x in '''
\$BREW_FORMULAE
'''.strip().split('\\n') if x.strip()],
    "casks": [x.strip() for x in '''
\$BREW_CASKS
'''.strip().split('\\n') if x.strip()],
    "taps": [x.strip() for x in '''
\$BREW_TAPS
'''.strip().split('\\n') if x.strip()]
}

# Applications
applications = [x.strip() for x in '''
\$APP_NAMES
'''.strip().split('\\n') if x.strip()]

# VS Code
vscode_snippets = {}
$(if [ -n "\$VSCODE_SNIPPETS_FILES" ]; then
  for snippet_file in \$VSCODE_SNIPPETS_FILES; do
    snippet_name=$(basename "\$snippet_file" .json)
    echo "vscode_snippets['$snippet_name'] = $(cat "\$snippet_file" | python3 -c 'import json,sys; print(json.dumps(json.load(sys.stdin)))')"
  done
fi)

vscode = {
    "installed": $(command -v code &> /dev/null && echo "true" || echo "false"),
    "extensions": [x.strip() for x in '''
\$VSCODE_EXTENSIONS
'''.strip().split('\\n') if x.strip()],
    "settings": \$VSCODE_SETTINGS,
    "keybindings": \$VSCODE_KEYBINDINGS,
    "snippets": vscode_snippets
}

# Shell Configs
shell_configs = {
    "zshrc": $(json_escape "\$ZSHRC_CONTENT"),
    "zprofile": $(json_escape "\$ZPROFILE_CONTENT"),
    "zshenv": $(json_escape "\$ZSHENV_CONTENT"),
    "bashrc": $(json_escape "\$BASHRC_CONTENT"),
    "bash_profile": $(json_escape "\$BASH_PROFILE_CONTENT"),
    "profile": $(json_escape "\$PROFILE_CONTENT")
}

# Bin Scripts
bin_scripts = {}
$(if [ -n "\$BIN_SCRIPTS" ]; then
  for script in \$BIN_SCRIPTS; do
    script_name=$(basename "\$script")
    echo "bin_scripts['$script_name'] = $(cat "\$script" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')"
  done
fi)

# Git Config
git_config = {
    "installed": $(command -v git &> /dev/null && echo "true" || echo "false"),
    "config_list": [x.strip() for x in '''
\$GIT_CONFIG
'''.strip().split('\\n') if x.strip()],
    "gitconfig_file": $(json_escape "\$GITCONFIG_CONTENT"),
    "gitignore_global": $(json_escape "\$GITIGNORE_GLOBAL")
}

# SSH Config
ssh_config = {
    "config_file": $(json_escape "\$SSH_CONFIG"),
    "key_files": [x.strip() for x in '''
\$SSH_KEYS
'''.strip().split('\\n') if x.strip()],
    "known_hosts_count": \$KNOWN_HOSTS_COUNT,
    "note": "Private key contents not included for security. Only file names are listed."
}

# Node.js / nvm
nodejs = {
    "nvm_installed": $([ -d "$HOME/.nvm" ] && echo "true" || echo "false"),
    "versions": [x.strip() for x in '''
\$NVM_VERSIONS
'''.strip().split('\\n') if x.strip()],
    "current": $(json_escape "\$NVM_CURRENT"),
    "global_packages": [x.strip() for x in '''
\$NPM_GLOBALS
'''.strip().split('\\n') if x.strip()]
}

# Python / pyenv
python = {
    "pyenv_installed": $(command -v pyenv &> /dev/null && echo "true" || echo "false"),
    "versions": [x.strip() for x in '''
\$PYENV_VERSIONS
'''.strip().split('\\n') if x.strip()],
    "global": $(json_escape "\$PYENV_GLOBAL"),
    "pip_packages": [x.strip() for x in '''
\$PIP_PACKAGES
'''.strip().split('\\n') if x.strip()]
}

# Ruby / rbenv
ruby = {
    "rbenv_installed": $(command -v rbenv &> /dev/null && echo "true" || echo "false"),
    "versions": [x.strip() for x in '''
\$RBENV_VERSIONS
'''.strip().split('\\n') if x.strip()],
    "global": $(json_escape "\$RBENV_GLOBAL")
}

# Build final JSON
scan_data = {
    "baseline_scan_version": "\$SCAN_VERSION",
    "system": system_info,
    "homebrew": homebrew,
    "applications": applications,
    "vscode": vscode,
    "shell_configs": shell_configs,
    "bin_scripts": bin_scripts,
    "git": git_config,
    "ssh": ssh_config,
    "nodejs": nodejs,
    "python": python,
    "ruby": ruby
}

print(json.dumps(scan_data, indent=2, ensure_ascii=False))
EOF
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
  show_header
  
  # Phase 1: Environment Analysis
  section "Environment Analysis"
  
  tput civis
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Analyzing System Hardware..."
  scan_system_info
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Analyzing System Hardware" "\$HOSTNAME (\$ARCH)"
  
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Scanning Package Manager..."
  scan_homebrew
  FORMULAE_COUNT=$(echo "\$BREW_FORMULAE" | grep -v "^$" | wc -l | tr -d ' ')
  CASKS_COUNT=$(echo "\$BREW_CASKS" | grep -v "^$" | wc -l | tr -d ' ')
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Scanning Package Manager" "\${FORMULAE_COUNT} Formulae, \${CASKS_COUNT} Casks"
  
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Indexing Applications..."
  scan_applications
  APP_COUNT=$(echo "\$APP_NAMES" | grep -v "^$" | wc -l | tr -d ' ')
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Indexing Applications" "\${APP_COUNT} Applications found"
  tput cnorm
  
  # Phase 2: Developer Tools
  section "Developer Ecosystem"
  
  tput civis
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Scanning VS Code Config..."
  scan_vscode
  EXT_COUNT=$(echo "\$VSCODE_EXTENSIONS" | grep -v "^$" | wc -l | tr -d ' ')
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Scanning VS Code Config" "\${EXT_COUNT} Extensions Configured"
  
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Analyzing Shell Dotfiles..."
  scan_shell_configs
  local s="Unknown"
  [[ "\$SHELL" == */zsh ]] && s="Zsh"
  [[ "\$SHELL" == */bash ]] && s="Bash"
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Analyzing Shell Dotfiles" "Active: \$s"
  
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Scanning Custom Scripts..."
  scan_bin_scripts
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Scanning Custom Scripts" "~/.bin scanned"
  
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Scanning Git Configuration..."
  scan_git_config
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Scanning Git Configuration" "Git Config Captured"
  
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Detecting SSH Configuration..."
  scan_ssh_config
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Detecting SSH Configuration" "SSH Config (No Private Keys)"
  
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Detecting Language Runtimes..."
  scan_nvm
  scan_npm_globals
  scan_pyenv
  scan_pip_packages
  scan_rbenv
  local l=""
  command -v node >/dev/null && l="\${l}Node "
  command -v python3 >/dev/null && l="\${l}Py "
  command -v ruby >/dev/null && l="\${l}Ruby "
  [ -z "\$l" ] && l="None detected"
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Detecting Language Runtimes" "\$l"
  tput cnorm
  
  # Phase 3: Output
  section "Artifact Generation"
  
  tput civis
  printf "\\r  \${CYAN}⠋\${RESET} \${WHITE}%-40s\${RESET}" "Compiling JSON Manifest..."
  generate_json
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Compiling JSON Manifest" "$(ls -lh \$OUTPUT_JSON 2>/dev/null | awk '{print \$5}')"
  
  printf "\\r  \${CYAN}⠼\${RESET} \${WHITE}%-40s\${RESET}" "Compressing Archive..."
  tar -czf "\$OUTPUT_ARCHIVE" "\$OUTPUT_JSON" 2>/dev/null
  printf "\\r  \${GREEN}\${ICON_CHECK}\${RESET} \${WHITE}%-40s\${RESET} \${GRAY}%s\${RESET}\\n" "Compressing Archive" ".tar.gz"
  tput cnorm
  
  # Final Calculation
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))
  
  # Summary
  echo ""
  echo -e "  \${GREEN}\${BOLD}✨ SCAN COMPLETED SUCCESSFULLY\${RESET}"
  echo ""
  echo -e "  \${CYAN}\${ICON_ARROW} JSON Output:\${RESET}     \${WHITE}$(pwd)/\${OUTPUT_JSON}\${RESET}"
  echo -e "  \${CYAN}\${ICON_ARROW} Archive:\${RESET}         \${WHITE}$(pwd)/\${OUTPUT_ARCHIVE}\${RESET}"
  echo -e "  \${PURPLE}\${ICON_TIME} Time:\${RESET}            \${WHITE}\${DURATION}s\${RESET}"
  echo -e "  \${PINK}\${ICON_LOCK} Size:\${RESET}            \${WHITE}$(ls -lh \$OUTPUT_ARCHIVE | awk '{print \$5}')\${RESET}"
  echo ""
  echo -e "  \${BOLD}Next Steps:\${RESET}"
  echo -e "    \${GREEN}1.\${RESET} Upload \${CYAN}\${OUTPUT_JSON}\${RESET} to Mac Setup Genie"
  echo -e "    \${GREEN}2.\${RESET} Review and customize your configuration"
  echo -e "    \${GREEN}3.\${RESET} Generate your setup script"
  echo ""
  echo -e "  \${DIM}Note: The archive (\${OUTPUT_ARCHIVE}) contains the same data in compressed form.\${RESET}"
  echo ""
  echo -e "  \${GREEN}\${ICON_ROCKET}\${RESET} \${BOLD}Ready to transform your Mac setup!\${RESET}"
  echo ""
}

# Check for Python 3 (required for JSON generation)
if ! command -v python3 &> /dev/null; then
  echo -e "\${RED}Error: Python 3 is required but not installed.\${NC}"
  echo "Please install Python 3 and try again."
  exit 1
fi

# Run main function
main
`;
};
