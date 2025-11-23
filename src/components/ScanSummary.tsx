import { Package, Code, Terminal, Settings, Database } from 'lucide-react';

interface ScanSummaryProps {
  data: {
    meta: {
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
    development: {
      vscode?: {
        extensions: string[];
      };
      git?: {
        global_config: string;
      };
    };
    languages: {
      node?: {
        global_packages: string[];
      };
      python?: {
        pip_packages: string[];
      };
    };
    terminal: {
      shell_configs: {
        [key: string]: string;
      };
    };
    applications: string[];
  };
}

export const ScanSummary = ({ data }: ScanSummaryProps) => {
  const stats = [
    {
      icon: Package,
      label: 'Homebrew Packages',
      value: (data.package_managers.homebrew?.formulae?.length || 0) + 
             (data.package_managers.homebrew?.casks?.length || 0),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Code,
      label: 'VS Code Extensions',
      value: data.development.vscode?.extensions?.length || 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Terminal,
      label: 'Language Packages',
      value: (data.languages.node?.global_packages?.length || 0) + 
             (data.languages.python?.pip_packages?.length || 0),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Settings,
      label: 'Applications',
      value: data.applications?.length || 0,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* System Info */}
      <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Source System
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hostname:</span>
            <span className="font-mono">{data.meta.hostname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">macOS Version:</span>
            <span className="font-mono">{data.meta.os_version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Architecture:</span>
            <span className="font-mono">{data.meta.arch}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-card/50 backdrop-blur border border-border rounded-2xl p-4 hover:shadow-lg transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Detailed List */}
      <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">What Will Be Installed</h3>
        <div className="space-y-4">
          {data.package_managers.homebrew && (
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-2">Homebrew Packages</div>
              <div className="flex flex-wrap gap-2">
                {data.package_managers.homebrew.formulae?.slice(0, 10).map((pkg, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg font-mono"
                  >
                    {pkg}
                  </span>
                ))}
                {(data.package_managers.homebrew.formulae?.length || 0) > 10 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{(data.package_managers.homebrew.formulae?.length || 0) - 10} more
                  </span>
                )}
              </div>
            </div>
          )}

          {data.package_managers.homebrew?.casks && data.package_managers.homebrew.casks.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-2">Applications</div>
              <div className="flex flex-wrap gap-2">
                {data.package_managers.homebrew.casks.slice(0, 8).map((app, i) => (
                  <span
                    key={i}
                    className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg font-mono"
                  >
                    {app}
                  </span>
                ))}
                {data.package_managers.homebrew.casks.length > 8 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{data.package_managers.homebrew.casks.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
