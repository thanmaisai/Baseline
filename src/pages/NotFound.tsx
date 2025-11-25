import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Log 404 access if needed, or just leave empty
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="text-center relative z-10 max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Terminal className="w-16 h-16 mx-auto mb-8 text-muted-foreground" />
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">ERROR 404</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-[0.9] tracking-tight mb-8">
            Page not found.
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
