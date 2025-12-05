import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { generateSetupFromScan } from '@/utils/scanParser';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PageHeader } from '@/components/PageHeader';
import { BackButton } from '@/components/BackButton';
import { PageTitle } from '@/components/PageTitle';
import { trackPageView, trackScanOperation, trackScriptDownload } from '@/utils/analytics';

const UploadScan = () => {
  const navigate = useNavigate();
  const [scanData, setScanData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Track page view on mount
  useEffect(() => {
    trackPageView('/upload-scan', 'Upload Scan');
  }, []);

  const handleGenerateScript = () => {
    if (!scanData.trim()) return;
    
    setIsProcessing(true);
    
    // Generate the setup script from scan data
    const setupScript = generateSetupFromScan(scanData);
    
    // Track the generation
    trackScanOperation('generate_from_scan');
    trackScriptDownload(0, 'scan'); // We don't have tool count from paste
    
    // Download the script
    const blob = new Blob([setupScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baseline-setup.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Celebration!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#5B8DEF', '#7B68EE', '#9B59B6'],
    });
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <PageHeader showGithub={false} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackButton to="/export-setup" label="Back" />

          <PageTitle
            subtitle="UPLOAD SCAN"
            title="Upload Your
Mac Scan."
            description="Generate your setup script from scan results"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="p-10 border border-border bg-card/50 backdrop-blur">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-lg font-bold mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                    Paste Scan Results
                  </label>
                  <Textarea
                    placeholder="Paste the contents of your scan output here..."
                    className="min-h-[400px] font-mono text-sm border border-border focus:border-primary"
                    value={scanData}
                    onChange={(e) => setScanData(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Extract and paste contents from <code className="bg-muted px-2 py-1 rounded font-mono">baseline-snapshot.tar.gz</code>
                  </p>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={handleGenerateScript}
                    disabled={!scanData.trim() || isProcessing}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg h-14 px-10"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {isProcessing ? 'Generating...' : 'Generate Setup Script'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="p-8 bg-card/30 backdrop-blur border border-border">
              <h3 className="font-bold text-xl mb-4">What happens next?</h3>
              <ul className="space-y-3 text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <span>We'll parse your scan data to identify all installed tools and configurations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <span>Generate a custom <code className="bg-muted px-2 py-1 rounded font-mono">baseline-setup.sh</code> script</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <span>Run the script on your new Mac to replicate your exact setup</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadScan;
