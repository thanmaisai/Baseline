import { ArrowRight, Upload, Layers, Sparkles, ShieldCheck, Clock, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { FloatingFooter } from '@/components/FloatingFooter';
import { TerminalWindow } from '@/components/TerminalWindow';
import { useEffect, useState } from 'react';
import { themeTokens } from '@/theme/tokens';
import { useTheme } from '@/contexts/ThemeContext';

const heroStats = [
  { label: 'Reduced effort', value: 'Hours', detail: 'saved' },
  { label: 'Wide range', value: '200+', detail: 'tools available' },
  { label: 'One command', value: 'Single', detail: 'script install' },
];

const journeys = [
  {
    id: 'configure',
    title: 'Design a new setup',
    description: 'Browse tools visually, select what you need, and generate a single installation script.',
    icon: Layers,
    action: { label: 'Start Configuring', route: '/configure' },
    steps: ['Browse and select tools from categories', 'Review your selections and customize', 'Generate and download setup script'],
  },
  {
    id: 'export',
    title: 'Clone your current Mac',
    description: 'Scan your existing Mac, capture all tools and configurations, then recreate it anywhere.',
    icon: Upload,
    action: { label: 'Export Current Mac', route: '/export-setup' },
    steps: ['Download and run the scan script', 'Upload generated configuration file', 'Get reproduction script for new Mac'],
  },
];

const featureHighlights = [
  { icon: Sparkles, title: 'Team onboarding', copy: 'New hire? Share your team\'s setup script and get them productive on day one.' },
  { icon: Wand2, title: 'Mac migration', copy: 'Moving to a new MacBook? Export your current setup and restore it quickly using Homebrew.' },
  { icon: Clock, title: 'Visual interface', copy: 'Browse and select tools through an intuitive GUI instead of writing config files.' },
];

const useCases = [
  { 
    icon: Sparkles, 
    title: 'Safe and transparent', 
    copy: 'All scripts are readable and run locally. No hidden data transmission.',
    span: 'lg:col-span-1'
  },
  { 
    icon: Wand2, 
    title: 'One-click install', 
    copy: 'Generate a single script that installs everything you need automatically.',
    span: 'lg:col-span-1'
  },
  { 
    icon: ShieldCheck, 
    title: 'Automated installation', 
    copy: 'Everything installed with a single command. No manual steps required.',
    span: 'lg:col-span-2 lg:row-span-1'
  },
];

const terminalDemo = [
  { text: './baseline-setup.sh', type: 'command' as const, delay: 300 },
  { text: 'ℹ Installing selected packages via Homebrew...', type: 'info' as const, delay: 800 },
  { text: '✓ node, python, docker installed', type: 'success' as const, delay: 300 },
  { text: '✓ vscode, arc, figma configured', type: 'success' as const, delay: 300 },
  { text: '✓ Setup complete in minimal time', type: 'success' as const, delay: 300 },
];

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: '50%', y: '50%' });
  const [isMouseActive, setIsMouseActive] = useState(false);

  // Get theme-aware border colors
  const isDark = theme === 'dark';
  const borderColors = {
    card: themeTokens.colors[isDark ? 'dark' : 'light'].border.card,
    cardInner: themeTokens.colors[isDark ? 'dark' : 'light'].border.cardInner,
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsMouseActive(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x: `${x}px`, y: `${y}px` });
    setIsMouseActive(true);
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate('/configure');
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigate('/export-setup');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <>
      <PageLayout className="h-auto min-h-screen">
        <div className="flex flex-col gap-12 px-6 md:px-10 py-10 pb-32 overflow-y-auto">
          <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-[2fr,1fr] gap-10"
          >
            <div className="space-y-8">
              <div 
                className="inline-flex items-center gap-2 bg-[var(--brand-sand)]/80 dark:bg-[var(--brand-ink)]/80 text-xs font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full border text-[var(--brand-ink)] dark:text-[var(--brand-sand)]"
                style={{ borderColor: borderColors.cardInner }}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--brand-sunset)]" />
                Baseline / Automated Setup
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground mb-4">Set up your Mac quickly, not over hours</p>
                <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-[var(--brand-ink)] dark:text-[var(--brand-sand)]">
                  Automate your entire Mac setup with a visual tool
                </h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Generate Homebrew-based installation scripts for all your tools and configurations. Whether you're setting up a new Mac or migrating from an existing one, we've got you covered.
              </p>
              <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate('/configure')}
                size="lg"
                  className="h-12 px-8 bg-[var(--brand-sunset)] text-[var(--brand-ink)] hover:bg-[var(--brand-sunset)]/90"
                  aria-keyshortcuts="Meta+1"
              >
                  Start Configuring
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate('/export-setup')}
                size="lg"
                variant="outline"
                style={{ borderColor: borderColors.card }}
                  className="h-12 px-8 border-2 bg-transparent hover:bg-[var(--brand-sand)]/30 dark:hover:bg-[var(--brand-sand)]/10 transition-all duration-200"
                  aria-keyshortcuts="Meta+2"
              >
                Export My Mac
              </Button>
          </div>
              <div className="grid md:grid-cols-3 gap-6">
                {heroStats.map((stat) => (
                  <div 
                    key={stat.label} 
                    className="rounded-2xl border bg-[var(--brand-sand)]/70 dark:bg-[var(--brand-ink)]/70 p-4"
                    style={{ borderColor: borderColors.card }}
                  >
                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-semibold text-[var(--brand-ink)] dark:text-[var(--brand-sand)]">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="rounded-[28px] border bg-[var(--brand-sand)]/85 dark:bg-[var(--brand-ink)]/80 p-6 flex flex-col justify-between"
              style={{ borderColor: borderColors.card }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <img src="/brand/baseline-mark.png" alt="Baseline Logo" className="w-24 h-24 object-contain flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.5em] text-[var(--brand-sunset)] font-bold">Your workflow</p>
                    <p className="text-3xl md:text-4xl font-bold text-[var(--brand-ink)] dark:text-[var(--brand-sand)] leading-tight">Two ways to start</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground mb-6">
                  Configure a new setup from scratch or export your existing Mac configuration. Both paths lead to the same automated installation experience.
                </p>
                <div className="space-y-3 text-sm font-mono text-[var(--brand-ink)]/80 dark:text-[var(--brand-sand)]/80">
                  <p>⌘ → Start configuring</p>
                  <p>⌘ ← Export your Mac</p>
                  <p>⌘ F Search tools</p>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-2">Perfect for</p>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--brand-ink)]/70 dark:text-[var(--brand-sand)]/80">New team members</span>
                  <span className="text-sm font-semibold text-[var(--brand-ink)]/70 dark:text-[var(--brand-sand)]/80">Mac migrations</span>
                  <span className="text-sm font-semibold text-[var(--brand-ink)]/70 dark:text-[var(--brand-sand)]/80">Dev environment sync</span>
                    </div>
                      </div>
                      </div>
          </motion.section>

          <section className="grid lg:grid-cols-2 gap-6">
            {journeys.map((journey) => {
              const Icon = journey.icon;
              return (
                <div
                  key={journey.id}
                  className="rounded-3xl border bg-[var(--brand-sand)]/85 dark:bg-[var(--brand-ink)]/80 p-6 flex flex-col gap-6"
                  style={{ borderColor: borderColors.card }}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-12 w-12 rounded-2xl bg-[var(--brand-sunset)]/20 flex items-center justify-center text-[var(--brand-ink)]">
                      <Icon className="w-6 h-6" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{journey.id}</p>
                      <h3 className="text-2xl font-semibold text-[var(--brand-ink)] dark:text-[var(--brand-sand)]">{journey.title}</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{journey.description}</p>
                  <div className="space-y-3">
                    {journey.steps.map((step, index) => (
                      <div key={step} className="flex items-center gap-3 text-sm text-[var(--brand-ink)] dark:text-[var(--brand-sand)]">
                        <span 
                          className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-semibold"
                          style={{ borderColor: borderColors.cardInner }}
                        >
                          {index + 1}
                        </span>
                        {step}
                </div>
                    ))}
                </div>
                  <Button
                    onClick={() => navigate(journey.action.route)}
                    className="mt-auto bg-[var(--brand-sunset)]/90 text-[var(--brand-ink)] hover:bg-[var(--brand-sunset)]"
                    aria-keyshortcuts={journey.id === 'configure' ? 'Meta+1' : 'Meta+2'}
                  >
                    {journey.action.label}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Shortcut {journey.id === 'configure' ? '⌘ + →' : '⌘ + ←'}
                  </p>
                </div>
              );
            })}
      </section>

          <section className="grid lg:grid-cols-2 gap-10 items-start">
            <div 
              className="rounded-3xl border bg-[var(--brand-sand)] dark:bg-[var(--brand-ink)]/80 p-6 shadow-card"
              style={{ borderColor: borderColors.card }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Live script</p>
                <span className="inline-flex items-center text-xs font-bold tracking-widest text-[var(--brand-ink)] dark:text-[var(--brand-sand)]">
                  Baseline CLI
                </span>
              </div>
              <TerminalWindow lines={terminalDemo} />
            </div>
            <div className="space-y-6">
              {featureHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border bg-[var(--brand-sand)]/80 dark:bg-[var(--brand-ink)]/70 p-6 flex gap-4"
                    style={{ borderColor: borderColors.card }}
                  >
                    <span className="mt-1 h-12 w-12 rounded-2xl bg-[var(--brand-sunset)]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[var(--brand-ink)] dark:text-[var(--brand-sand)]" />
                    </span>
                    <div>
                      <h4 className="text-xl font-semibold text-[var(--brand-ink)] dark:text-[var(--brand-sand)] mb-2">{item.title}</h4>
                      <p className="text-muted-foreground">{item.copy}</p>
              </div>
            </div>
                );
              })}
            </div>
      </section>

          {/* Bento Grid - Use Cases */}
          <section>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-2">Built for real workflows</p>
              <h2 className="text-3xl font-semibold text-[var(--brand-ink)] dark:text-[var(--brand-sand)]">
                From onboarding new team members to migrating to a new Mac
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {useCases.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`rounded-3xl border bg-[var(--brand-sand)]/80 dark:bg-[var(--brand-ink)]/70 p-8 flex flex-col gap-4 ${item.span}`}
                    style={{ borderColor: borderColors.card }}
                  >
                    <span className="h-12 w-12 rounded-2xl bg-[var(--brand-sunset)]/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[var(--brand-ink)] dark:text-[var(--brand-sand)]" />
                    </span>
                    <div>
                      <h4 className="text-xl font-semibold text-[var(--brand-ink)] dark:text-[var(--brand-sand)] mb-2">{item.title}</h4>
                      <p className="text-muted-foreground">{item.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section 
            className="rounded-[32px] border bg-[var(--brand-sand)]/85 dark:bg-[var(--brand-ink)]/80 p-6 md:p-8"
            style={{ borderColor: borderColors.card }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Playbook</p>
                <h2 className="text-2xl md:text-3xl font-semibold text-[var(--brand-ink)] dark:text-[var(--brand-sand)]">
                  One script. One command. Zero friction. What used to take an entire day now happens while you grab coffee.
                </h2>
              </div>
              <div 
                className="w-full lg:w-64 rounded-2xl border bg-[var(--brand-sand)]/80 dark:bg-[var(--brand-ink)]/60 p-4 space-y-2.5"
                style={{ borderColor: borderColors.card }}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[var(--brand-ink)] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Traditional Setup</p>
                    <p className="text-base font-semibold text-[var(--brand-ink)] dark:text-[var(--brand-sand)]">Full day or more</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--brand-ink)] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">With Baseline</p>
                    <p className="text-base font-semibold text-[var(--brand-ink)] dark:text-[var(--brand-sand)]">Under an hour</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-1">Automated Homebrew-based installation with zero manual configuration.</p>
              </div>
            </div>
          </section>

          <section className="text-center py-12 relative">
            <motion.a
              href="https://thanmaisai.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={handleMouseLeave}
              style={{ 
                cursor: 'none',
              }}
            >
              {/* Bottom Layer - Orange text */}
              <div
                className="relative z-10 font-black text-4xl md:text-5xl tracking-tight select-none"
                style={{
                  color: 'var(--brand-sunset)',
                }}
              >
                Developed by thanmaisai
              </div>

              {/* Top Layer - Inverted with spotlight mask - Only on hover */}
              {isHovering && (
                <motion.div
                  className="absolute inset-0 z-20 font-black text-4xl md:text-5xl tracking-tight select-none flex items-center justify-center"
                  style={{
                    color: 'var(--brand-ink)',
                    backgroundColor: 'var(--brand-sunset)',
                    clipPath: `circle(150px at ${mousePosition.x} ${mousePosition.y})`,
                    transition: 'clip-path 0.05s ease-out',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span>Developed by thanmaisai</span>
                </motion.div>
              )}
            </motion.a>
          </section>
        </div>
      </PageLayout>

      <FloatingFooter
        branding="Baseline"
        statusLabel=""
        statusText="Choose your journey"
        showBackButton={false}
        primaryButtonText="Start Configuring"
        primaryButtonIcon={<Layers className="w-4 h-4" />}
        onPrimaryAction={() => navigate('/configure')}
        primaryShortcut="←"
        secondaryButtonText="Export My Mac"
        secondaryButtonIcon={<Upload className="w-4 h-4" />}
        onSecondaryAction={() => navigate('/export-setup')}
        secondaryShortcut="→"
      />
    </>
  );
};

export default Index;
