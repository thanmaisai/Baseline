import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/utils/analytics';
import { toast } from 'sonner';

// Google Sheets Web App URL
const GOOGLE_SHEETS_URL = import.meta.env.VITE_FEEDBACK_SHEETS_URL || '';

type FeedbackType = 'bug' | 'idea' | 'other';

const feedbackOptions: { id: FeedbackType; label: string }[] = [
  { id: 'bug', label: 'Bug' },
  { id: 'idea', label: 'Idea' },
  { id: 'other', label: 'Other' },
];

export const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('idea');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setFeedbackType('idea');
    setMessage('');
    setEmail('');
    setIsSubmitted(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
    trackEvent({
      category: 'user_interaction',
      action: 'click',
      label: 'feedback_opened',
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        timestamp: new Date().toISOString(),
        feedbackType,
        message: message.trim(),
        email: email.trim() || 'Not provided',
        page: window.location.pathname,
      };

      // Send to Google Sheets using URL parameters (most reliable method)
      if (GOOGLE_SHEETS_URL) {
        const params = new URLSearchParams({
          timestamp: feedbackData.timestamp,
          feedbackType: feedbackData.feedbackType,
          message: feedbackData.message,
          email: feedbackData.email,
          page: feedbackData.page,
        });
        
        // Use GET request with parameters - most reliable for Google Apps Script
        await fetch(`${GOOGLE_SHEETS_URL}?${params.toString()}`, {
          method: 'GET',
          mode: 'no-cors',
        });
      }

      // Track in analytics
      trackEvent({
        category: 'user_interaction',
        action: 'click',
        label: 'feedback_submitted',
        metadata: { type: feedbackType },
      });

      setIsSubmitted(true);
      toast.success('Feedback sent');
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Failed to send. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Minimal Edge Tab - uses theme variables */}
      <button
        onClick={handleOpen}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 px-1.5 py-6 rounded-l-lg transition-all duration-200 hover:px-2.5 group border-l border-y border-border bg-background"
      >
        <span 
          className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground group-hover:text-foreground transition-colors"
          style={{ writingMode: 'vertical-rl' }}
        >
          Feedback
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
            >
              <div className="bg-background rounded-2xl border border-border shadow-xl overflow-hidden">
                
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    /* Success State */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Thank you
                      </p>
                      <p className="text-xs text-muted-foreground mb-6">
                        Your feedback helps us improve
                      </p>
                      <button
                        onClick={handleClose}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    /* Form */
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <span className="text-sm font-semibold text-foreground">
                          Send feedback
                        </span>
                        <button
                          onClick={handleClose}
                          className="p-1.5 -mr-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>

                      {/* Body */}
                      <div className="p-5 space-y-4">
                        {/* Type Selection */}
                        <div className="flex gap-2">
                          {feedbackOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setFeedbackType(option.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                                feedbackType === option.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>

                        {/* Message */}
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="What's on your mind?"
                          rows={3}
                          className="w-full px-3 py-2.5 text-sm bg-muted/50 border border-border rounded-xl placeholder:text-muted-foreground/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary/50 resize-none transition-all"
                        />

                        {/* Email */}
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email (optional)"
                          className="w-full px-3 py-2.5 text-sm bg-muted/50 border border-border rounded-xl placeholder:text-muted-foreground/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary/50 transition-all"
                        />
                      </div>

                      {/* Footer */}
                      <div className="px-5 pb-5">
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !message.trim()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            />
                          ) : (
                            <>
                              Send
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackForm;
