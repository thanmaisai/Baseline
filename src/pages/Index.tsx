import { 
  ArrowRight, 
  Terminal,
  Download, 
  Github,
  Clock,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Layers,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { TerminalWindow } from '@/components/TerminalWindow';
import { DualLineChart } from '@/components/DataVisualization';
import { PageHeader } from '@/components/PageHeader';
import { useRef } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  
  const terminalDemo = [
    { text: 'bash setup-macos.sh', type: 'command' as const, delay: 500 },
    { text: '🚀 Starting macOS Dev Environment Setup...', type: 'info' as const, delay: 800 },
    { text: '', type: 'output' as const, delay: 200 },
    { text: 'Installing Homebrew...', type: 'output' as const, delay: 300 },
    { text: 'Homebrew installed successfully', type: 'success' as const, delay: 1200 },
    { text: '', type: 'output' as const, delay: 200 },
    { text: 'Installing VS Code...', type: 'output' as const, delay: 300 },
    { text: 'VS Code installed', type: 'success' as const, delay: 1000 },
    { text: '', type: 'output' as const, delay: 200 },
    { text: 'Installing Docker...', type: 'output' as const, delay: 300 },
    { text: 'Docker installed', type: 'success' as const, delay: 1000 },
    { text: '', type: 'output' as const, delay: 200 },
    { text: 'Setting up Node.js (v20.x)...', type: 'output' as const, delay: 300 },
    { text: 'Node.js v20.11.0 ready', type: 'success' as const, delay: 1000 },
    { text: '', type: 'output' as const, delay: 200 },
    { text: '✨ Setup complete! All 24 tools installed.', type: 'success' as const, delay: 500 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PageHeader showGithub={true} />

      {/* Hero Section - Editorial Style */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8">
                MACOS DEVELOPMENT
              </p>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-8">
                Automating<br />developer<br />onboarding.
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mb-12"
            >
              A visual configurator that generates production-ready setup scripts
              for macOS development environments in minutes, not hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Button
                onClick={() => navigate('/configure')}
                size="lg"
                className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                Configure Setup
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate('/export-setup')}
                size="lg"
                variant="outline"
                className="h-12 px-8 border-border hover:bg-accent"
              >
                Export Current Mac
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Data Driven */}
      <section ref={statsRef} className="relative py-24 px-6 lg:px-12 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: '8h', label: 'Time saved per setup', trend: 'down', icon: TrendingDown, color: 'text-green-500' },
              { value: '95%', label: 'Reduction in errors', trend: 'up', icon: TrendingUp, color: 'text-green-500' },
              { value: '24', label: 'Tools & packages', icon: Layers, color: 'text-blue-500' },
              { value: '5m', label: 'Average setup time', icon: Clock, color: 'text-purple-500' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem Statement - Bold Typography */}
      <section className="relative py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Cognitive Load Comparison Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="backdrop-blur-xl bg-card/50 rounded-[32px] p-8 md:p-10 relative overflow-hidden group border border-border shadow-lg dark:shadow-2xl mb-20"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Friction</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Cognitive Load</h2>
                <p className="text-muted-foreground font-medium mt-2 max-w-md">Stop juggling documentation, permission errors, and installer packages.</p>
              </div>
              
              {/* Badge */}
              <div className="hidden md:flex flex-col items-end">
                <span className="font-mono text-5xl font-bold tracking-tighter text-foreground">
                  1<span className="text-2xl text-muted-foreground">Click</span>
                </span>
                <span className="text-green-400 font-bold text-xs uppercase tracking-wide bg-green-900/30 border border-green-500/20 px-2 py-1 rounded mt-1">
                  Zero Configuration
                </span>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:h-64 items-end relative z-10">
              
              {/* Left: Manual Chaos */}
              <div className="h-full flex flex-col justify-end relative min-h-[280px] md:min-h-0">
                <div className="absolute inset-0 pointer-events-none">
                  {/* Browser Tab */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="absolute top-4 left-0 bg-card shadow-lg border border-border rounded-lg p-3 w-40 z-10"
                  >
                    <div className="flex gap-1 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    </div>
                    <div className="h-1.5 w-20 bg-muted rounded mb-1" />
                    <div className="text-[9px] text-muted-foreground font-mono truncate">brew install postgresql@14</div>
                  </motion.div>
                  
                  {/* Terminal Error */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: 4 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 4 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="absolute top-12 left-12 bg-background shadow-2xl border border-red-900/30 rounded-lg p-3 w-44 z-20"
                  >
                    <div className="text-[9px] text-red-400 font-mono leading-tight">
                      Error: EACCES: permission denied<br />
                      <span className="text-muted-foreground/60">&gt; sudo !!</span>
                    </div>
                  </motion.div>
              
                  {/* AI Prompt */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute top-28 left-2 bg-card border border-blue-900/30 shadow-lg rounded-lg p-3 w-36 z-30"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/50" />
                      <div className="text-[8px] text-blue-400 font-bold">AI Assistant</div>
                    </div>
                    <div className="text-[8px] text-blue-200/70 font-sans leading-tight">
                      &quot;How do I set JAVA_HOME path on M1 mac?&quot;
                    </div>
                  </motion.div>
                  
                  {/* DMG Icon */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 12 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute bottom-16 right-8 bg-card border border-border rounded p-2 shadow-lg z-10"
                  >
                    <div className="w-6 h-8 bg-muted rounded-sm border border-muted-foreground/40 flex items-center justify-center">
                      <span className="text-[6px] font-bold text-muted-foreground">DMG</span>
                    </div>
                  </motion.div>
                </div>

                <div className="border-t border-border pt-4 relative z-40 bg-background/20 backdrop-blur-sm">
                  <p className="font-mono text-xs text-muted-foreground uppercase mb-1">The Old Way</p>
                  <p className="font-bold text-xl text-muted-foreground">Manual Chaos</p>
                </div>
              </div>

              {/* Right: Single Script */}
              <div className="h-full flex flex-col justify-end min-h-[280px] md:min-h-0">
                <div className="w-full h-full pb-8 flex items-end">
                  {/* Terminal Window */}
                  <div className="w-full bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-500 group-hover:-translate-y-2 border border-border h-[85%] relative z-10">
                    {/* Title bar */}
                    <div className="bg-card px-3 py-2 flex gap-1.5 border-b border-border">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    {/* Content */}
                    <div className="p-4 font-mono text-xs text-green-400 leading-relaxed opacity-90">
                      <div className="flex gap-2">
                        <span className="text-blue-400">➜</span>
                        <span className="text-muted-foreground">sh setup-mac.sh</span>
                      </div>
                      <div className="w-full bg-muted h-1 mt-3 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
                          className="bg-green-500 h-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        />
                      </div>
                      <div className="mt-3 text-muted-foreground space-y-1">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1, duration: 0.3 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-green-400">✔</span> <span>Homebrew installed</span>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.2, duration: 0.3 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-green-400">✔</span> <span>Dotfiles configured</span>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.4, duration: 0.3 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-green-400">✔</span> <span>Apps downloaded</span>
                        </motion.div>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.6, duration: 0.3 }}
                        className="mt-2 animate-pulse text-blue-400"
                      >
                        All set! Ready to code.
                      </motion.div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="font-mono text-xs text-muted-foreground uppercase mb-1">The New Way</p>
                  <p className="font-bold text-xl text-blue-400">Single Script</p>
                </div>
              </div>

            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-50" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8">
                THE CHALLENGE
              </p>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8 tracking-tight">
                Manual setup is killing productivity.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Every new Mac means hours of Googling, copy-pasting commands, and configuring tools. 
                By the time you're done, you've lost a full workday—and you still might have missed something.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {[
                { metric: '4-8 hours', label: 'Wasted per setup' },
                { metric: '67%', label: 'Miss critical tools' },
                { metric: '0', label: 'Documentation quality' },
              ].map((item, index) => (
                <div key={index} className="flex items-baseline gap-6 pb-6 border-b border-border">
                  <div className="text-4xl font-bold text-red-500">{item.metric}</div>
                  <div className="text-lg text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terminal Demo */}
      <section className="relative py-24 px-6 lg:px-12 bg-accent/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
              ONE COMMAND
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              From zero to production-ready
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <TerminalWindow lines={terminalDemo} />
          </motion.div>
        </div>
      </section>

      {/* Process - Clean Grid */}
      <section className="relative py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Three steps. Five minutes.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                num: '01',
                title: 'Choose',
                icon: Layers
              },
              {
                num: '02',
                title: 'Generate',
                icon: Cpu
              },
              {
                num: '03',
                title: 'Done',
                icon: CheckCircle2
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <div className="text-6xl font-bold text-muted-foreground/5 mb-6">{step.num}</div>
                  <Icon className="w-7 h-7 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact - Single Powerful Chart */}
      <section className="relative py-32 px-6 lg:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
              MEASURABLE IMPACT
            </p>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              360 minutes to 5.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real data from 2,400+ teams who stopped wasting time on manual setups
            </p>
          </motion.div>

          {/* The One Chart That Matters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="backdrop-blur-xl bg-card/50 border border-border rounded-[32px] p-8 md:p-10 shadow-lg dark:shadow-2xl"
          >
            <DualLineChart
              data1={[
                { label: 'Day 0', value: 380 },
                { label: 'Day 1', value: 370 },
                { label: 'Day 2', value: 365 },
                { label: 'Day 3', value: 360 },
                { label: 'Day 4', value: 355 },
                { label: 'Week 2', value: 350 },
              ]}
              data2={[
                { label: 'Day 0', value: 8 },
                { label: 'Day 1', value: 7 },
                { label: 'Day 2', value: 6 },
                { label: 'Day 3', value: 5.5 },
                { label: 'Day 4', value: 5.2 },
                { label: 'Week 2', value: 5 },
              ]}
              label1="Manual Setup"
              label2="Baseline"
              color1="rgb(239, 68, 68)"
              color2="rgb(34, 197, 94)"
            />
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            <div className="text-center p-6">
              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                98.6%
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Time Saved</div>
            </div>
            <div className="text-center p-6">
              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                5min
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Average Setup</div>
            </div>
            <div className="text-center p-6">
              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                2.4K
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Teams Using</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="relative py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              Ready to automate?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Join 2,400+ developers who eliminated setup time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => navigate('/configure')}
                size="lg"
                className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-lg"
              >
                Start Configuring
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('/export-setup')}
                size="lg"
                variant="outline"
                className="h-14 px-10 border-border hover:bg-accent hover:border-border text-lg"
              >
                Export Setup
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="relative py-12 px-6 lg:px-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5" />
              <span className="text-sm">Baseline</span>
              <span className="text-muted-foreground/60">·</span>
              <span className="text-sm text-muted-foreground">Open Source</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">Docs</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
