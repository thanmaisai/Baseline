import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Download, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ToolCard } from '@/components/ToolCard';
import { PageHeader } from '@/components/PageHeader';
import { usePersistedSelection } from '@/hooks/usePersistedSelection';
import { tools } from '@/data/tools';
import { Tool, ToolCategory } from '@/types/tools';
import { generateSetupScript } from '@/utils/scriptGenerator';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const steps = [
  { id: 'applications', name: 'Applications', subtitle: 'GUI Tools & Editors' },
  { id: 'package-managers', name: 'Runtimes', subtitle: 'Version Managers' },
  { id: 'devops', name: 'Infrastructure', subtitle: 'Cloud & Container Tools' },
  { id: 'cli-tools', name: 'CLI Tools', subtitle: 'Terminal Utilities' },
  { id: 'review', name: 'Finalize', subtitle: 'Review your stack' },
];

const Configurator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveLog, setLiveLog] = useState('waiting for input...');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { selection, setSelection, clearSelection } = usePersistedSelection();

  const currentCategory = steps[currentStep].id as ToolCategory | 'review';
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const updateLog = (message: string) => {
    setLiveLog(message);
  };
  
  const filteredTools = useMemo(() => {
    if (currentCategory === 'review') return [];
    
    return tools
      .filter(t => t.category === currentCategory)
      .filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [currentCategory, searchQuery]);

  const isToolSelected = (tool: Tool) => {
    return selection.tools.some(t => t.id === tool.id);
  };

  const toggleTool = (tool: Tool) => {
    if (isToolSelected(tool)) {
      setSelection(prev => ({
        ...prev,
        tools: prev.tools.filter(t => t.id !== tool.id),
      }));
      updateLog(`removed ${tool.name.toLowerCase()}`);
    } else {
      setSelection(prev => ({
        ...prev,
        tools: [...prev.tools, tool],
      }));
      updateLog(`added ${tool.name.toLowerCase()}`);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSearchQuery('');
      updateLog(`navigated to ${steps[currentStep + 1].name.toLowerCase()}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSearchQuery('');
      updateLog(`navigated to ${steps[currentStep - 1].name.toLowerCase()}`);
    }
  };

  const handleReset = () => {
    clearSelection();
    updateLog('reset selection');
    toast.success('Selection cleared');
  };

  const handleDownloadScript = () => {
    const script = generateSetupScript(selection);
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup-macos.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    updateLog('generating script...');
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    
    toast.success('🎉 Setup script downloaded!', {
      description: 'Run it with: bash setup-macos.sh',
    });
  };

  const selectedByCategory = (category: ToolCategory) => {
    return selection.tools.filter(t => t.category === category);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <PageHeader showGithub={false} />

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex-1 flex flex-col relative pb-32 pt-32">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </motion.div>

        {/* Timeline Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 pb-6 border-b border-border"
        >
          <div className="flex justify-between items-center">
            <nav className="flex items-center gap-8 font-mono text-xs tracking-wider">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setCurrentStep(index);
                      updateLog(`jumped to ${step.name.toLowerCase()}`);
                    }}
                    className={`py-2 border-b-2 transition-all duration-300 uppercase ${
                      isActive
                        ? 'border-foreground text-foreground'
                        : isCompleted
                        ? 'border-border text-muted-foreground hover:text-foreground'
                        : 'border-transparent text-muted-foreground/50 hover:text-muted-foreground'
                    }`}
                  >
                    <span className="mr-2 opacity-50">0{index + 1}</span>
                    {step.name}
                  </button>
                );
              })}
            </nav>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Total Selected
                </div>
                <div className="font-mono text-xl font-bold">{selection.tools.length}</div>
              </div>
              <button
                onClick={handleReset}
                className={`text-xs text-red-400 hover:text-red-300 transition-opacity hover:underline ${
                  selection.tools.length === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Reset
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stage Header & Search */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-end justify-between mb-8 shrink-0"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {steps[currentStep].subtitle}
              </p>
              <motion.h1
                layout
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight"
              >
                {steps[currentStep].name}
              </motion.h1>
            </div>
            
            {currentCategory !== 'review' && (
              <div className="relative group">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    updateLog(`searching for "${e.target.value}"`);
                  }}
                  placeholder="Filter tools..."
                  className="bg-transparent border-b border-border py-2 pl-0 pr-16 text-foreground focus:outline-none focus:border-foreground transition-colors w-64 text-sm placeholder-muted-foreground font-mono"
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <span className="font-mono bg-muted border border-border rounded px-2 py-0.5 text-[10px] text-muted-foreground">
                    CMD+K
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Grid or Review */}
        <AnimatePresence mode="wait">
          {currentCategory !== 'review' ? (
            <motion.form
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto no-scrollbar"
            >
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <ToolCard
                    tool={tool}
                    selected={isToolSelected(tool)}
                    onToggle={() => toggleTool(tool)}
                  />
                </motion.div>
              ))}

              {filteredTools.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground">
                    No tools found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
                  READY TO INITIALIZE
                </p>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  {selection.tools.length} {selection.tools.length === 1 ? 'tool' : 'tools'} selected.
                </h3>
                <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto">
                  We're ready to compile your setup script. Review your choices or go back to make changes.
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
                  {Array.from(selection.tools).map(tool => (
                    <span
                      key={tool.id}
                      className="px-3 py-1.5 rounded-md border border-border text-xs font-mono text-muted-foreground bg-background/40 hover:bg-accent transition-colors cursor-default"
                    >
                      {tool.name}
                    </span>
                  ))}
                </div>

                {selection.tools.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12"
                  >
                    <Button
                      size="lg"
                      onClick={handleDownloadScript}
                      className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-xl text-lg group"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Setup Script
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Control Bar (Floating) */}
        <div className="fixed bottom-6 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-end pointer-events-none">
          {/* Live Log */}
          <div className="font-mono text-xs text-muted-foreground bg-background/80 backdrop-blur border border-border px-4 py-2 rounded-lg flex items-center gap-2 pointer-events-auto min-w-[300px] shadow-lg">
            <span className="text-green-400">➜</span>
            <span className="flex-1">{liveLog}</span>
            <span className="w-1.5 h-3 bg-muted-foreground/40 ml-auto animate-pulse" />
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              className="px-6 py-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all disabled:opacity-0 disabled:pointer-events-none flex items-center gap-2"
            >
              Back
            </Button>

            {currentStep < steps.length - 1 && (
              <Button
                onClick={handleNext}
                className="pl-8 pr-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg flex items-center gap-3 group"
              >
                <span>Next Step</span>
                <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  <span className="font-mono border border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground rounded px-1.5 py-0.5 text-[10px]">
                    CMD
                  </span>
                  <span className="font-mono border border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground rounded px-1.5 py-0.5 text-[10px]">
                    →
                  </span>
                </div>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Configurator;
