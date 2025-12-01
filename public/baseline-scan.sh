#!/bin/bash

# ==============================================================================
#  B A S E L I N E   -   U L T I M A T E   E D I T I O N
#  The gold standard for macOS configuration scanning.
# ==============================================================================

# Trap Ctrl+C to restore cursor
trap 'tput cnorm; echo -e "\n\n${RED}✖ Aborted by user${RESET}"; exit 1' SIGINT

# --- 1. THE UI ENGINE ---------------------------------------------------------

# Colors & Styles
ESC=$(printf '\033')
RESET="${ESC}[0m"
BOLD="${ESC}[1m"
DIM="${ESC}[2m"
ITALIC="${ESC}[3m"

# Neon Palette
CYAN="${ESC}[38;5;51m"
GREEN="${ESC}[38;5;46m"
PURPLE="${ESC}[38;5;99m"
PINK="${ESC}[38;5;213m"
YELLOW="${ESC}[38;5;226m"
RED="${ESC}[38;5;196m"
GRAY="${ESC}[38;5;240m"
WHITE="${ESC}[38;5;255m"

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
OUTPUT_JSON="baseline-snapshot.json"
OUTPUT_ARCHIVE="baseline-snapshot.tar.gz"
LOG_FILE="/tmp/baseline_debug.log"
SCAN_VERSION="2.5.0"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
START_TIME=$(date +%s)

# Parse command line arguments
INCLUDE_SSH_KEYS="false"
for arg in "$@"; do
  case $arg in
    --include-ssh-keys)
      INCLUDE_SSH_KEYS="true"
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [options]"
      echo "  --include-ssh-keys    Include SSH private keys (CAUTION)"
      exit 0
      ;;
  esac
done

# Initialize Log
echo "Baseline Scan Started: $TIMESTAMP" > "$LOG_FILE"

# --- 2. THE UI FUNCTIONS ------------------------------------------------------

# Function: Typewriter Effect
typewriter() {
    text="$1"
    delay="$2"
    for (( i=0; i<${#text}; i++ )); do
        echo -n "${text:$i:1}"
        sleep "$delay"
    done
    echo ""
}

# Function: The Header
show_header() {
    clear
    echo ""
    # Gradient-ish ASCII Art
    echo -e "${PURPLE}  ██████╗  █████╗ ███████╗███████╗██╗     ██╗███╗   ██╗███████╗${RESET}"
    echo -e "${PURPLE}  ██╔══██╗██╔══██╗██╔════╝██╔════╝██║     ██║████╗  ██║██╔════╝${RESET}"
    echo -e "${CYAN}  ██████╔╝███████║███████╗█████╗  ██║     ██║██╔██╗ ██║█████╗  ${RESET}"
    echo -e "${CYAN}  ██╔══██╗██╔══██║╚════██║██╔══╝  ██║     ██║██║╚██╗██║██╔══╝  ${RESET}"
    echo -e "${PINK}  ██████╔╝██║  ██║███████║███████╗███████╗██║██║ ╚████║███████╗${RESET}"
    echo -e "${PINK}  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝${RESET}"
    echo ""
    
    echo -ne "  ${BOLD}${WHITE}"
    typewriter "System Configuration Scanner v${SCAN_VERSION}" 0.02
    echo -e "${RESET}"
    echo -e "  ${GRAY}Initialize sequence...${RESET}"
    echo -e "  ${GRAY}────────────────────────────────────────────────────────────${RESET}"
    echo ""
}

# Function: Section Header
section() {
    echo ""
    echo -e "  ${BOLD}${PINK}:: $1${RESET}"
}

# Function: Async Spinner with Result Capture
# Usage: execute "Label" "Command"
execute() {
    local label="$1"
    local cmd="$2"
    
    # Hide Cursor
    tput civis
    
    # Run command in background, redirect output to log
    local result_file="/tmp/baseline_res_$$.txt"
    rm -f "$result_file"
    
    # Wrap command to handle result file
    eval "$cmd" >> "$LOG_FILE" 2>&1 &
    local pid=$!
    
    # Spinner Animation Frames (Braille)
    local spin='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    local i=0
    
    while kill -0 $pid 2>/dev/null; do
        i=$(( (i+1) % 10 ))
        printf "\r  ${CYAN}${spin:$i:1}${RESET} ${WHITE}%-40s${RESET}" "$label..."
        sleep 0.08
    done
    
    wait $pid
    local exit_code=$?
    
    # Check for custom result message
    local result_text=""
    if [ -f "$result_file" ]; then
        result_text=$(cat "$result_file")
        rm -f "$result_file"
    fi
    
    if [ $exit_code -eq 0 ]; then
        if [ -n "$result_text" ]; then
            printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "$label" "$result_text"
        else
            printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET}\n" "$label"
        fi
    else
        printf "\r  ${RED}${ICON_CROSS}${RESET} ${WHITE}%-40s${RESET} ${RED}Failed${RESET}\n" "$label"
    fi
    
    tput cnorm
}

# Helper to pass text back to the spinner
set_result() {
    echo "$1" > "/tmp/baseline_res_$$.txt"
}

# --- 3. SCANNING FUNCTIONS ----------------------------------------------------

scan_system_info() {
  export HOSTNAME=$(hostname)
  export MACOS_VERSION=$(sw_vers -productVersion)
  export MACOS_BUILD=$(sw_vers -buildVersion)
  export HARDWARE_MODEL=$(sysctl -n hw.model)
  export ARCH=$(uname -m)
}

scan_macos_defaults() {
  mkdir -p /tmp/baseline_scan_defaults
  defaults read com.apple.dock > /tmp/baseline_scan_defaults/dock.txt 2>/dev/null || true
  defaults read com.apple.finder > /tmp/baseline_scan_defaults/finder.txt 2>/dev/null || true
  defaults read NSGlobalDomain > /tmp/baseline_scan_defaults/global.txt 2>/dev/null || true
  
  export MACOS_DEFAULTS_DIR="/tmp/baseline_scan_defaults"
}

scan_homebrew() {
  if command -v brew >/dev/null 2>&1; then
    export BREW_VERSION=$(brew --version | head -n1 | awk '{print $2}')
    export BREW_PREFIX=$(brew --prefix)
    
    # Use leaves for formulae (top-level only)
    export BREW_FORMULAE=$(brew leaves 2>/dev/null)
    export BREW_CASKS=$(brew list --cask 2>/dev/null)
    export BREW_TAPS=$(brew tap 2>/dev/null)
    
    COUNT_F=$(echo "$BREW_FORMULAE" | grep -c . || echo "0")
    COUNT_C=$(echo "$BREW_CASKS" | grep -c . || echo "0")
  fi
}

scan_applications() {
  export APP_NAMES=$(find /Applications -maxdepth 2 -name "*.app" 2>/dev/null | sed 's|.*/||' | sed 's|.app$||' | sort)
}

scan_vscode() {
  if command -v code >/dev/null 2>&1; then
    export VSCODE_EXTENSIONS=$(code --list-extensions 2>/dev/null)
    
    # CRITICAL FIX: Pass PATHS, not CONTENT
    export VSCODE_SETTINGS_PATH="$HOME/Library/Application Support/Code/User/settings.json"
    export VSCODE_KEYBINDINGS_PATH="$HOME/Library/Application Support/Code/User/keybindings.json"
    export VSCODE_SNIPPETS_DIR="$HOME/Library/Application Support/Code/User/snippets"
  fi
}

scan_shell_configs() {
  # CRITICAL FIX: Pass PATHS to avoid ARG_MAX limits
  [ -f "$HOME/.zshrc" ] && export ZSHRC_PATH="$HOME/.zshrc"
  [ -f "$HOME/.zprofile" ] && export ZPROFILE_PATH="$HOME/.zprofile"
  [ -f "$HOME/.zshenv" ] && export ZSHENV_PATH="$HOME/.zshenv"
  [ -f "$HOME/.bashrc" ] && export BASHRC_PATH="$HOME/.bashrc"
  [ -f "$HOME/.bash_profile" ] && export BASH_PROFILE_PATH="$HOME/.bash_profile"
}

scan_ssh_config() {
  if [ -d "$HOME/.ssh" ]; then
    [ -f "$HOME/.ssh/config" ] && export SSH_CONFIG_PATH="$HOME/.ssh/config"
    
    # List public keys
    export SSH_KEYS_LIST=$(find "$HOME/.ssh" -name "*.pub" -o -name "id_*" ! -name "*.pub" 2>/dev/null | sed "s|$HOME/.ssh/||")
    
    if [ "$INCLUDE_SSH_KEYS" = "true" ]; then
        export SSH_PRIVATE_KEYS_INCLUDED="true"
    else
        export SSH_PRIVATE_KEYS_INCLUDED="false"
    fi
  fi
}

scan_git() {
  if command -v git >/dev/null 2>&1; then
    export GIT_GLOBAL_CONFIG=$(git config --list --global)
    [ -f "$HOME/.gitconfig" ] && export GITCONFIG_PATH="$HOME/.gitconfig"
    [ -f "$HOME/.gitignore_global" ] && export GITIGNORE_PATH="$HOME/.gitignore_global"
  fi
}

scan_language_versions() {
  local l=""
  
  # Node/NVM
  if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" 2>/dev/null
    export NVM_INSTALLED="true"
    if command -v nvm >/dev/null 2>&1; then
      export NODE_VERSIONS=$(nvm list 2>/dev/null | grep "v" | awk '{print $1}' | sed 's/->//g' | tr -d '[:space:]*')
    fi
    l="${l}Node "
  fi
  
  if command -v npm >/dev/null 2>&1; then
    export NPM_GLOBALS=$(npm list -g --depth=0 --json 2>/dev/null)
  fi

  # Python/Pyenv
  if command -v pyenv >/dev/null 2>&1; then
    export PYENV_VERSIONS=$(pyenv versions --bare 2>/dev/null)
    export PYENV_GLOBAL=$(pyenv global 2>/dev/null)
    l="${l}Py "
  fi
  
  # Pip
  if command -v pip3 >/dev/null 2>&1; then
    export PIP_PACKAGES=$(pip3 list --format=freeze 2>/dev/null)
  fi

  # Go
  if command -v go >/dev/null 2>&1; then
    export GO_VERSION=$(go version | awk '{print $3}')
    l="${l}Go "
  fi

  # Rust
  if command -v rustup >/dev/null 2>&1; then
    export RUST_VERSION=$(rustc --version | awk '{print $2}')
    l="${l}Rust "
  fi
}

scan_cloud_tools() {
  local c=""
  
  if command -v docker >/dev/null 2>&1; then
    export DOCKER_VERSION=$(docker --version | awk '{print $3}' | tr -d ',')
    c="${c}Docker "
  fi
  
  if command -v aws >/dev/null 2>&1; then
    export AWS_CLI_VERSION=$(aws --version | awk '{print $1}')
    [ -f "$HOME/.aws/config" ] && export AWS_CONFIG_PATH="$HOME/.aws/config"
    c="${c}AWS "
  fi
  
  if command -v kubectl >/dev/null 2>&1; then
    export KUBECTL_VERSION=$(kubectl version --client --short 2>/dev/null | awk '{print $3}')
    c="${c}K8s "
  fi
}

# --- 4. PYTHON GENERATOR (ROBUST) ---------------------------------------------

generate_json() {
  python3 << 'PYTHON_EOF' > "$OUTPUT_JSON"
import json
import os
import re
import sys
import glob

def strip_jsonc(text):
    """Strips comments and trailing commas from JSONC to make it valid JSON."""
    if not text: return "{}"
    # Remove single line comments //
    text = re.sub(r'//.*', '', text)
    # Remove multi-line comments /* */
    text = re.sub(r'/\*[\s\S]*?\*/', '', text, flags=re.DOTALL)
    # Remove trailing commas
    text = re.sub(r',(\s*[}\]])', r'\1', text)
    return text

def redact_secrets(content):
    """Redacts common secret patterns from shell configs."""
    if not content: return ""
    # Look for export KEY="value" pattern where KEY contains SECRET, TOKEN, KEY, PASSWORD
    # We replace the value with "REDACTED"
    pattern = r'(export\s+[A-Z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD|PASS)[A-Z0-9_]*\s*=\s*)(["\'])(?:(?=(\\?))\3.)*?\2'
    # Simple replacement approach avoiding complex lookaheads for now
    lines = content.split('\n')
    redacted_lines = []
    for line in lines:
        if re.search(r'export\s+.*(KEY|SECRET|TOKEN|PASS).*=', line, re.IGNORECASE):
            if not line.strip().startswith('#'):
                parts = line.split('=')
                if len(parts) > 1:
                    redacted_lines.append(parts[0] + '="REDACTED (Security)"')
                    continue
        redacted_lines.append(line)
    return '\n'.join(redacted_lines)

def read_file_safely(path, is_jsonc=False, do_redact=False):
    """Reads a file from a path defined in ENV."""
    if not path: return None
    full_path = os.path.expanduser(path)
    if os.path.exists(full_path):
        try:
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                if do_redact:
                    content = redact_secrets(content)
                if is_jsonc:
                    try:
                        return json.loads(strip_jsonc(content))
                    except:
                        return {"error": "Failed to parse JSONC", "raw": content[:100] + "..."}
                return content
        except Exception as e:
            return f"Error reading file: {str(e)}"
    return None

def get_env_list(key):
    val = os.environ.get(key, '')
    return [x.strip() for x in val.split('\n') if x.strip()]

# --- DATA AGGREGATION ---

data = {
    "meta": {
        "version": os.environ.get('SCAN_VERSION'),
        "timestamp": os.environ.get('TIMESTAMP'),
        "hostname": os.environ.get('HOSTNAME'),
        "os_version": os.environ.get('MACOS_VERSION'),
        "arch": os.environ.get('ARCH')
    },
    "system_defaults": {},
    "package_managers": {},
    "applications": get_env_list('APP_NAMES'),
    "development": {},
    "terminal": {},
    "languages": {},
    "cloud": {}
}

# System Defaults
defaults_dir = os.environ.get('MACOS_DEFAULTS_DIR')
if defaults_dir and os.path.isdir(defaults_dir):
    for f in ['dock.txt', 'finder.txt', 'global.txt']:
        p = os.path.join(defaults_dir, f)
        if os.path.exists(p):
            with open(p, 'r') as df:
                key = f.replace('.txt', '')
                data["system_defaults"][key] = df.read()

# Homebrew
if os.environ.get('BREW_VERSION'):
    data["package_managers"]["homebrew"] = {
        "formulae": get_env_list('BREW_FORMULAE'),
        "casks": get_env_list('BREW_CASKS'),
        "taps": get_env_list('BREW_TAPS')
    }

# VS Code
if os.environ.get('VSCODE_EXTENSIONS') or os.environ.get('VSCODE_SETTINGS_PATH'):
    data["development"]["vscode"] = {
        "extensions": get_env_list('VSCODE_EXTENSIONS'),
        "settings": read_file_safely(os.environ.get('VSCODE_SETTINGS_PATH'), is_jsonc=True),
        "keybindings": read_file_safely(os.environ.get('VSCODE_KEYBINDINGS_PATH'), is_jsonc=True)
    }

# Shell Configs
shell_files = {}
for k, path_var in [('.zshrc', 'ZSHRC_PATH'), ('.bashrc', 'BASHRC_PATH'), 
                    ('.zprofile', 'ZPROFILE_PATH'), ('.bash_profile', 'BASH_PROFILE_PATH')]:
    path = os.environ.get(path_var)
    if path:
        shell_files[k] = read_file_safely(path, do_redact=True)
data["terminal"]["shell_configs"] = shell_files

# SSH
ssh_keys = get_env_list('SSH_KEYS_LIST')
data["terminal"]["ssh"] = {
    "config": read_file_safely(os.environ.get('SSH_CONFIG_PATH')),
    "keys_found": ssh_keys,
    "private_keys_backup": {}
}

# SSH Private Key Backup (Only if requested)
if os.environ.get('SSH_PRIVATE_KEYS_INCLUDED') == 'true':
    ssh_home = os.path.expanduser("~/.ssh")
    backup = {}
    for key_file in ssh_keys:
        # crude check for private keys (no extension)
        if "." not in key_file and "known_hosts" not in key_file:
            full_p = os.path.join(ssh_home, key_file)
            if os.path.exists(full_p):
                with open(full_p, 'r') as f:
                    backup[key_file] = f.read()
    data["terminal"]["ssh"]["private_keys_backup"] = backup

# Git
data["development"]["git"] = {
    "global_config": os.environ.get('GIT_GLOBAL_CONFIG'),
    "gitconfig_file": read_file_safely(os.environ.get('GITCONFIG_PATH')),
    "gitignore_global": read_file_safely(os.environ.get('GITIGNORE_PATH'))
}

# Node / NPM
npm_globals_json = os.environ.get('NPM_GLOBALS')
npm_list = []
if npm_globals_json:
    try:
        j = json.loads(npm_globals_json)
        deps = j.get('dependencies', {})
        for k, v in deps.items():
            npm_list.append(f"{k}@{v.get('version', 'latest')}")
    except:
        pass

data["languages"]["node"] = {
    "versions": get_env_list('NODE_VERSIONS'),
    "global_packages": npm_list,
    "nvm_installed": os.environ.get('NVM_INSTALLED') == 'true'
}

# Python
data["languages"]["python"] = {
    "pyenv_versions": get_env_list('PYENV_VERSIONS'),
    "pyenv_global": os.environ.get('PYENV_GLOBAL'),
    "pip_packages": get_env_list('PIP_PACKAGES')
}

# Others
if os.environ.get('GO_VERSION'): data["languages"]["go"] = os.environ.get('GO_VERSION')
if os.environ.get('RUST_VERSION'): data["languages"]["rust"] = os.environ.get('RUST_VERSION')
if os.environ.get('DOCKER_VERSION'): data["cloud"]["docker"] = os.environ.get('DOCKER_VERSION')
if os.environ.get('AWS_CLI_VERSION'): 
    data["cloud"]["aws"] = {
        "version": os.environ.get('AWS_CLI_VERSION'),
        "config": read_file_safely(os.environ.get('AWS_CONFIG_PATH'), do_redact=True)
    }

print(json.dumps(data, indent=2, ensure_ascii=False))
PYTHON_EOF
}

# --- 5. MAIN EXECUTION FLOW ---------------------------------------------------

main() {
  # Check for Python 3
  if ! command -v python3 >/dev/null 2>&1; then
    echo -e "${RED}Error: python3 is required.${RESET}"
    exit 1
  fi

  show_header

  # Phase 1: Environment - Run directly to preserve exports
  section "Environment Analysis"
  
  tput civis
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Analyzing System Hardware..."
  scan_system_info
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Analyzing System Hardware" "$HOSTNAME ($ARCH)"
  
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Reading macOS Preferences..."
  scan_macos_defaults
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Reading macOS Preferences" "Dock, Finder & Global"
  
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Scanning Package Manager..."
  scan_homebrew
  COUNT_F=$(echo "$BREW_FORMULAE" | grep -c . || echo "0")
  COUNT_C=$(echo "$BREW_CASKS" | grep -c . || echo "0")
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Scanning Package Manager" "${COUNT_F} Formulae, ${COUNT_C} Casks"
  
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Indexing Applications..."
  scan_applications
  COUNT_A=$(echo "$APP_NAMES" | grep -c . || echo "0")
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Indexing Applications" "${COUNT_A} Applications found"
  tput cnorm

  # Phase 2: Developer Tools
  section "Developer Ecosystem"
  
  tput civis
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Scanning VS Code Config..."
  scan_vscode
  COUNT_V=$(echo "$VSCODE_EXTENSIONS" | grep -c . || echo "0")
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Scanning VS Code Config" "${COUNT_V} Extensions Configured"
  
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Analyzing Shell Dotfiles..."
  scan_shell_configs
  local s="Unknown"
  [[ "$SHELL" == */zsh ]] && s="Zsh"
  [[ "$SHELL" == */bash ]] && s="Bash"
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Analyzing Shell Dotfiles" "Active: $s"
  
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Detecting SSH Configuration..."
  scan_ssh_config
  if [ "$SSH_PRIVATE_KEYS_INCLUDED" = "true" ]; then
    printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Detecting SSH Configuration" "SSH Config + Private Keys"
  else
    printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Detecting SSH Configuration" "SSH Config (No Private Keys)"
  fi
  
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Scanning Git Configuration..."
  scan_git
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Scanning Git Configuration" "Git Config Captured"
  
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Detecting Language Runtimes..."
  scan_language_versions
  local l=""
  command -v node >/dev/null && l="${l}Node "
  command -v python3 >/dev/null && l="${l}Py "
  command -v go >/dev/null && l="${l}Go "
  command -v rustc >/dev/null && l="${l}Rust "
  [ -z "$l" ] && l="None detected"
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Detecting Language Runtimes" "$l"
  
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Scanning Cloud Tools..."
  scan_cloud_tools
  local c=""
  command -v docker >/dev/null && c="${c}Docker "
  command -v aws >/dev/null && c="${c}AWS "
  command -v kubectl >/dev/null && c="${c}K8s "
  [ -z "$c" ] && c="None detected"
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Scanning Cloud Tools" "$c"
  tput cnorm

  # Phase 3: Output
  section "Artifact Generation"
  
  tput civis
  printf "\r  ${CYAN}⠋${RESET} ${WHITE}%-40s${RESET}" "Compiling JSON Manifest..."
  generate_json
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Compiling JSON Manifest" "$(ls -lh $OUTPUT_JSON 2>/dev/null | awk '{print $5}')"
  tput cnorm

  # Compression Step
  tput civis
  printf "\r  ${CYAN}⠼${RESET} ${WHITE}%-40s${RESET}" "Compressing Archive..."
  tar -czf "$OUTPUT_ARCHIVE" "$OUTPUT_JSON" 2>>"$LOG_FILE"
  printf "\r  ${GREEN}${ICON_CHECK}${RESET} ${WHITE}%-40s${RESET} ${GRAY}%s${RESET}\n" "Compressing Archive" ".tar.gz"
  tput cnorm

  # Cleanup
  rm -rf /tmp/baseline_scan_defaults /tmp/baseline_res_*.txt 2>/dev/null

  # Final Calculation
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))

  # --- COMPLETION SUMMARY ------------------------------------------------------
  echo ""
  echo -e "  ${GREEN}${BOLD}✨ SCAN COMPLETED SUCCESSFULLY${RESET}"
  echo ""
  echo -e "  ${CYAN}${ICON_ARROW} JSON Output:${RESET}     ${WHITE}$(pwd)/${OUTPUT_JSON}${RESET}"
  echo -e "  ${CYAN}${ICON_ARROW} Archive:${RESET}         ${WHITE}$(pwd)/${OUTPUT_ARCHIVE}${RESET}"
  echo -e "  ${PURPLE}${ICON_TIME} Time:${RESET}            ${WHITE}${DURATION}s${RESET}"
  echo -e "  ${PINK}${ICON_LOCK} Size:${RESET}            ${WHITE}$(ls -lh $OUTPUT_ARCHIVE | awk '{print $5}')${RESET}"
  echo ""
  
  if [ "$INCLUDE_SSH_KEYS" = "true" ]; then
    echo -e "  ${RED}${BOLD}⚠  WARNING:${RESET} ${RED}Archive contains private SSH keys. Handle with care!${RESET}"
    echo ""
  fi
  
  echo -e "  ${BOLD}Next Steps:${RESET}"
  echo -e "    ${GREEN}1.${RESET} Upload ${CYAN}${OUTPUT_JSON}${RESET} to Baseline"
  echo -e "    ${GREEN}2.${RESET} Review and customize your configuration"
  echo -e "    ${GREEN}3.${RESET} Generate your setup script"
  echo ""
  echo -e "  ${DIM}Note: The archive (${OUTPUT_ARCHIVE}) contains the same data in compressed form.${RESET}"
  echo ""
  echo -e "  ${GREEN}${ICON_ROCKET}${RESET} ${BOLD}Ready to transform your Mac setup!${RESET}"
  echo ""
}

main