import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to: string;
  label?: string;
}

export const BackButton = ({ to, label = 'Back to Home' }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(to)}
      className="mb-8 group text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
      {label}
    </Button>
  );
};
