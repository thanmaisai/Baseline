// Interface for the baseline-snapshot.json structure
interface BaselineSnapshot {
  meta: {
    version: string | null;
    timestamp: string | null;
    hostname: string;
    os_version: string;
    arch: string;
  };
  package_managers: {
    homebrew?: {
      formulae: string[];
      casks: string[];
      taps: string[];
    };
  };
  applications: string[];
  development: {
    vscode?: {
      extensions: string[];
      settings?: any;
      keybindings?: any;
    };
    git?: {
      global_config: string;
      gitconfig_file?: string;
    };
  };
  terminal: {
    shell_configs: {
      [key: string]: string;
    };
    ssh?: {
      config?: string;
      keys_found: string[];
    };
  };
  languages: {
    node?: {
      versions: string[];
      global_packages: string[];
      nvm_installed: boolean;
    };
    python?: {
      pyenv_versions: string[];
      pyenv_global: string | null;
      pip_packages: string[];
    };
    go?: string;
    rust?: string;
  };
  cloud: {
    [key: string]: any;
  };
}

const isValidBaselineSnapshot = (data: any): data is BaselineSnapshot => {
  // Check if data is an object
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check for required top-level structure
  if (!data.meta || typeof data.meta !== 'object') {
    return false;
  }

  // Check meta fields
  if (!data.meta.hostname || !data.meta.os_version || !data.meta.arch) {
    return false;
  }

  // Check for package_managers object
  if (!data.package_managers || typeof data.package_managers !== 'object') {
    return false;
  }

  // Check for applications array
  if (!Array.isArray(data.applications)) {
    return false;
  }

  // Check for development object
  if (!data.development || typeof data.development !== 'object') {
    return false;
  }

  // Check for terminal object
  if (!data.terminal || typeof data.terminal !== 'object') {
    return false;
  }

  // Check for languages object
  if (!data.languages || typeof data.languages !== 'object') {
    return false;
  }

  // All essential structure checks passed
  return true;
};

export const parseBaselineJSON = (jsonString: string): BaselineSnapshot | null => {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Validate the structure
    if (!isValidBaselineSnapshot(parsed)) {
      console.error('Invalid Baseline snapshot structure');
      return null;
    }
    
    return parsed as BaselineSnapshot;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};

export const generateSetupFromScan = (scanData: string): string => {
  // Try to parse as JSON first
  const baseline = parseBaselineJSON(scanData);
  
  if (!baseline) {
    // Fallback to old text format
    return generateFromTextFormat(scanData);
  }

  let script = `#!/bin/bash

# ============================================================================
# Baseline Setup Script
# Generated from baseline-snapshot.json
# Date: ${new Date().toISOString().split('T')[0]}
# ============================================================================

set -e

# Colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
PURPLE='\\033[0;35m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

echo -e "\\\${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\\${NC}"
echo -e "\\\${PURPLE}🚀 Baseline Setup - Restoring Your Mac\\\${NC}"
echo -e "\\\${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\\${NC}"
echo ""
echo -e "\\\${BLUE}Hostname:\\\${NC} ${baseline.meta.hostname}"
echo -e "\\\${BLUE}Source OS:\\\${NC} macOS ${baseline.meta.os_version} (${baseline.meta.arch})"
echo ""

# Check if running on macOS
if [[ ! "$OSTYPE" == "darwin"* ]]; then
  echo -e "\\\${RED}❌ This script is designed for macOS only.\\\${NC}"
  exit 1
fi

# Install Homebrew if not present
if ! command -v brew &> /dev/null; then
  echo -e "\\\${YELLOW}📦 Installing Homebrew...\\\${NC}"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  
  # Add Homebrew to PATH
  if [[ $(uname -m) == 'arm64' ]]; then
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
  else
    echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/usr/local/bin/brew shellenv)"
  fi
  echo -e "\\\${GREEN}✅ Homebrew installed\\\${NC}"
else
  echo -e "\\\${GREEN}✅ Homebrew already installed\\\${NC}"
fi

echo ""
`;

  // Install Homebrew taps
  if (baseline.package_managers.homebrew?.taps && baseline.package_managers.homebrew.taps.length > 0) {
    script += `echo -e "\\\${YELLOW}📦 Adding Homebrew taps...\\\${NC}"\n`;
    baseline.package_managers.homebrew.taps.forEach(tap => {
      script += `brew tap ${tap}\n`;
    });
    script += `echo -e "\\\${GREEN}✅ Taps added\\\${NC}"\n`;
    script += `\n`;
  }

  // Install Homebrew formulae
  if (baseline.package_managers.homebrew?.formulae && baseline.package_managers.homebrew.formulae.length > 0) {
    script += `echo -e "\\\${YELLOW}📦 Installing Homebrew formulae (${baseline.package_managers.homebrew.formulae.length} packages)...\\\${NC}"\n`;
    script += `brew install \\\n`;
    script += baseline.package_managers.homebrew.formulae.map(f => `  ${f}`).join(' \\\n');
    script += `\necho -e "\\\${GREEN}✅ Formulae installed\\\${NC}"\n\n`;
  }

  // Install Homebrew casks
  if (baseline.package_managers.homebrew?.casks && baseline.package_managers.homebrew.casks.length > 0) {
    script += `echo -e "\\\${YELLOW}📦 Installing applications (${baseline.package_managers.homebrew.casks.length} apps)...\\\${NC}"\n`;
    baseline.package_managers.homebrew.casks.forEach(cask => {
      script += `echo -e "  Installing ${cask}..."\n`;
      script += `brew install --cask ${cask} 2>/dev/null || echo -e "\\\${YELLOW}  ⚠ ${cask} might already be installed or unavailable\\\${NC}"\n`;
    });
    script += `echo -e "\\\${GREEN}✅ Applications installed\\\${NC}"\n`;
    script += `\n`;
  }

  // Install Node.js and npm packages
  if (baseline.languages.node && baseline.languages.node.global_packages.length > 0) {
    script += `echo -e "\\\${YELLOW}📦 Installing Node.js packages...\\\${NC}"\n`;
    
    // Install Node if not present
    script += `if ! command -v node &> /dev/null; then\n`;
    script += `  brew install node\n`;
    script += `fi\n\n`;
    
    // Filter out npm, corepack as they come with node
    const packages = baseline.languages.node.global_packages
      .filter(pkg => !pkg.startsWith('npm@') && !pkg.startsWith('corepack@'))
      .map(pkg => pkg.split('@')[0]);
    
    if (packages.length > 0) {
      script += `echo -e "  Installing global packages..."\n`;
      packages.forEach(pkg => {
        script += `npm install -g ${pkg}\n`;
      });
    }
    script += `echo -e "\\\${GREEN}✅ Node.js configured\\\${NC}"\n\n`;
  }

  // Install Python packages
  if (baseline.languages.python && baseline.languages.python.pip_packages.length > 0) {
    const packages = baseline.languages.python.pip_packages
      .filter(pkg => !pkg.startsWith('pip==') && !pkg.startsWith('wheel=='))
      .map(pkg => pkg.split('==')[0]);
    
    if (packages.length > 0) {
      script += `echo -e "\\\${YELLOW}📦 Installing Python packages...\\\${NC}"\n`;
      packages.forEach(pkg => {
        script += `pip3 install ${pkg}\n`;
      });
      script += `echo -e "\\\${GREEN}✅ Python packages installed\\\${NC}"\n\n`;
    }
  }

  // Install VS Code extensions
  if (baseline.development.vscode?.extensions && baseline.development.vscode.extensions.length > 0) {
    script += `echo -e "\\\${YELLOW}📦 Installing VS Code extensions (${baseline.development.vscode.extensions.length} extensions)...\\\${NC}"\n`;
    script += `if command -v code &> /dev/null; then\n`;
    baseline.development.vscode.extensions.forEach(ext => {
      script += `  code --install-extension ${ext} --force\n`;
    });
    script += `  echo -e "\\\${GREEN}✅ VS Code extensions installed\\\${NC}"\n`;
    script += `else\n`;
    script += `  echo -e "\\\${YELLOW}⚠ VS Code not found. Install it first, then run:\\\${NC}"\n`;
    baseline.development.vscode.extensions.forEach(ext => {
      script += `  echo "  code --install-extension ${ext}"\n`;
    });
    script += `fi\n\n`;
  }

  // Restore Git config
  if (baseline.development.git?.global_config) {
    script += `echo -e "\\\${YELLOW}📦 Configuring Git...\\\${NC}"\n`;
    const configs = baseline.development.git.global_config.split('\n').filter(line => line.trim());
    configs.forEach(config => {
      const match = config.match(/^(.+?)=(.+)$/);
      if (match) {
        script += `git config --global "${match[1]}" "${match[2]}"\n`;
      }
    });
    script += `echo -e "\\\${GREEN}✅ Git configured\\\${NC}"\n\n`;
  }

  // Restore shell configs
  const shellConfigs = baseline.terminal.shell_configs;
  if (Object.keys(shellConfigs).length > 0) {
    script += `echo -e "\\\${YELLOW}📦 Restoring shell configuration...\\\${NC}"\n`;
    Object.entries(shellConfigs).forEach(([filename, content]) => {
      if (content && content.trim()) {
        script += `echo "Restoring ${filename}..."\n`;
        script += `cat >> ~/${filename} << 'BASELINE_EOF'\n${content}\nBASELINE_EOF\n\n`;
      }
    });
    script += `echo -e "\\\${GREEN}✅ Shell configured\\\${NC}"\n\n`;
  }

  // Restore SSH config (without private keys)
  if (baseline.terminal.ssh?.config) {
    script += `echo -e "\\\${YELLOW}📦 Restoring SSH configuration...\\\${NC}"\n`;
    script += `mkdir -p ~/.ssh\n`;
    script += `chmod 700 ~/.ssh\n`;
    script += `cat > ~/.ssh/config << 'BASELINE_EOF'\n${baseline.terminal.ssh.config}\nBASELINE_EOF\n`;
    script += `chmod 600 ~/.ssh/config\n`;
    script += `echo -e "\\\${GREEN}✅ SSH configured\\\${NC}"\n`;
    
    if (baseline.terminal.ssh.keys_found.length > 0) {
      script += `echo -e "\\\${YELLOW}⚠ Note: You need to manually restore your SSH keys:\\\${NC}"\n`;
      baseline.terminal.ssh.keys_found.forEach(key => {
        if (!key.endsWith('.pub')) {
          script += `echo "  - ${key}"\n`;
        }
      });
    }
    script += `\n`;
  }

  script += `echo ""
echo -e "\\\${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\\${NC}"
echo -e "\\\${GREEN}✨ Setup Complete!\\\${NC}"
echo -e "\\\${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\\${NC}"
echo ""
echo -e "\\\${PURPLE}📊 Summary:\\\${NC}"
echo -e "  ${baseline.package_managers.homebrew?.formulae.length || 0} Homebrew packages"
echo -e "  ${baseline.package_managers.homebrew?.casks.length || 0} Applications"
echo -e "  ${baseline.development.vscode?.extensions.length || 0} VS Code extensions"
echo -e "  ${baseline.languages.node?.global_packages.length || 0} Node.js packages"
echo ""
echo -e "\\\${YELLOW}⚠ Next Steps:\\\${NC}"
echo -e "  1. Restart your terminal or run: \\\${CYAN}source ~/.zshrc\\\${NC}"
echo -e "  2. Restore SSH keys manually (if needed)"
echo -e "  3. Sign in to applications and services"
echo ""
`;

  return script;
};

// Fallback for old text-based format
// Fallback for old text-based format
const generateFromTextFormat = (scanData: string): string => {
  const sections = parseScanData(scanData);
  
  let script = `#!/bin/bash

# macOS Development Environment Setup Script
# Generated from scan data
# Date: ${new Date().toISOString().split('T')[0]}

set -e

echo "🚀 Setting up your new Mac based on scanned configuration..."
echo ""

# Check if running on macOS
if [[ ! "$OSTYPE" == "darwin"* ]]; then
  echo "❌ This script is designed for macOS only."
  exit 1
fi

# Install Homebrew if not present
if ! command -v brew &> /dev/null; then
  echo "📦 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  
  # Add Homebrew to PATH
  if [[ $(uname -m) == 'arm64' ]]; then
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
  else
    echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/usr/local/bin/brew shellenv)"
  fi
else
  echo "✅ Homebrew already installed"
fi

echo ""
`;

  // Install Homebrew taps
  if (sections.taps && sections.taps.length > 0) {
    script += `# Add Homebrew taps\n`;
    script += `echo "📦 Adding Homebrew taps..."\n`;
    sections.taps.forEach(tap => {
      script += `brew tap ${tap}\n`;
    });
    script += `\n`;
  }

  // Install Homebrew formulae
  if (sections.formulae && sections.formulae.length > 0) {
    script += `# Install Homebrew formulae\n`;
    script += `echo "📦 Installing Homebrew formulae..."\n`;
    script += `brew install \\\n`;
    script += sections.formulae.map(f => `  ${f}`).join(' \\\n');
    script += `\n\n`;
  }

  // Install Homebrew casks
  if (sections.casks && sections.casks.length > 0) {
    script += `# Install Homebrew casks\n`;
    script += `echo "📦 Installing applications..."\n`;
    sections.casks.forEach(cask => {
      script += `brew install --cask ${cask}\n`;
    });
    script += `\n`;
  }

  // Install VS Code extensions
  if (sections.vscodeExtensions && sections.vscodeExtensions.length > 0) {
    script += `# Install VS Code extensions\n`;
    script += `echo "📦 Installing VS Code extensions..."\n`;
    script += `if command -v code &> /dev/null; then\n`;
    sections.vscodeExtensions.forEach(ext => {
      script += `  code --install-extension ${ext}\n`;
    });
    script += `fi\n\n`;
  }

  // Restore Git config
  if (sections.gitConfig && sections.gitConfig.length > 0) {
    script += `# Configure Git\n`;
    script += `echo "📦 Configuring Git..."\n`;
    sections.gitConfig.forEach(config => {
      const match = config.match(/^(.+?)=(.+)$/);
      if (match) {
        script += `git config --global "${match[1]}" "${match[2]}"\n`;
      }
    });
    script += `\n`;
  }

  script += `echo ""
echo "✨ Setup complete!"
echo ""
echo "Please restart your terminal or run 'source ~/.zshrc' to apply changes."
`;

  return script;
};

interface ScanSections {
  formulae?: string[];
  casks?: string[];
  taps?: string[];
  vscodeExtensions?: string[];
  zshrc?: string;
  bashrc?: string;
  gitConfig?: string[];
}

const parseScanData = (data: string): ScanSections => {
  const sections: ScanSections = {};
  
  // Parse Homebrew formulae
  const formulaeMatch = data.match(/## HOMEBREW_FORMULAE ##\n([\s\S]*?)(?=\n## |$)/);
  if (formulaeMatch) {
    sections.formulae = formulaeMatch[1]
      .trim()
      .split('\n')
      .filter(line => line && line !== 'None');
  }

  // Parse Homebrew casks
  const casksMatch = data.match(/## HOMEBREW_CASKS ##\n([\s\S]*?)(?=\n## |$)/);
  if (casksMatch) {
    sections.casks = casksMatch[1]
      .trim()
      .split('\n')
      .filter(line => line && line !== 'None');
  }

  // Parse Homebrew taps
  const tapsMatch = data.match(/## HOMEBREW_TAPS ##\n([\s\S]*?)(?=\n## |$)/);
  if (tapsMatch) {
    sections.taps = tapsMatch[1]
      .trim()
      .split('\n')
      .filter(line => line && line !== 'None');
  }

  // Parse VS Code extensions
  const vscodeMatch = data.match(/## VSCODE_EXTENSIONS ##\n([\s\S]*?)(?=\n## |$)/);
  if (vscodeMatch) {
    sections.vscodeExtensions = vscodeMatch[1]
      .trim()
      .split('\n')
      .filter(line => line && line !== 'None');
  }

  // Parse Git config
  const gitMatch = data.match(/## GIT_CONFIG ##\n([\s\S]*?)(?=\n## |$)/);
  if (gitMatch) {
    sections.gitConfig = gitMatch[1]
      .trim()
      .split('\n')
      .filter(line => line && line !== 'None');
  }

  return sections;
};
