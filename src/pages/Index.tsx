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
import { ThemeToggle } from '@/components/ThemeToggle';
import { TerminalWindow } from '@/components/TerminalWindow';
import { LineChart, DualLineChart } from '@/components/DataVisualization';
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Terminal className="w-6 h-6" />
              <span className="text-lg font-medium tracking-tight">Setup Genie</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
              >
                GitHub
              </a>
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </header>

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
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-8">
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
              className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mb-12"
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
                className="h-12 px-8 bg-white text-black hover:bg-gray-200 font-medium"
              >
                Configure Setup
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate('/export-setup')}
                size="lg"
                variant="outline"
                className="h-12 px-8 border-white/20 hover:bg-white/5 hover:border-white/40"
              >
                Export Current Mac
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Data Driven */}
      <section ref={statsRef} className="relative py-24 px-6 lg:px-12 border-y border-white/5">
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
                  <div className="text-sm text-gray-500 uppercase tracking-wider">
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
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-8">
                THE CHALLENGE
              </p>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8 tracking-tight">
                Manual setup is killing productivity.
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
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
                <div key={index} className="flex items-baseline gap-6 pb-6 border-b border-white/5">
                  <div className="text-4xl font-bold text-red-500">{item.metric}</div>
                  <div className="text-lg text-gray-500">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terminal Demo */}
      <section className="relative py-24 px-6 lg:px-12 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
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
                  <div className="text-6xl font-bold text-white/5 mb-6">{step.num}</div>
                  <Icon className="w-7 h-7 mx-auto mb-4 text-white/40" />
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact - Single Powerful Chart */}
      <section className="relative py-32 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
              MEASURABLE IMPACT
            </p>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              360 minutes to 5.
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real data from 2,400+ teams who stopped wasting time on manual setups
            </p>
          </motion.div>

          {/* The One Chart That Matters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-12 backdrop-blur-sm"
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
              label2="Setup Genie"
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
              <div className="text-sm text-gray-500 uppercase tracking-wider">Time Saved</div>
            </div>
            <div className="text-center p-6">
              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                5min
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Average Setup</div>
            </div>
            <div className="text-center p-6">
              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                2.4K
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Teams Using</div>
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
            <p className="text-xl text-gray-400 mb-12">
              Join 2,400+ developers who eliminated setup time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => navigate('/configure')}
                size="lg"
                className="h-14 px-10 bg-white text-black hover:bg-gray-200 font-medium text-lg"
              >
                Start Configuring
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('/export-setup')}
                size="lg"
                variant="outline"
                className="h-14 px-10 border-white/20 hover:bg-white/5 hover:border-white/40 text-lg"
              >
                Export Setup
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="relative py-12 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5" />
              <span className="text-sm">Setup Genie</span>
              <span className="text-gray-600">·</span>
              <span className="text-sm text-gray-500">Open Source</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
