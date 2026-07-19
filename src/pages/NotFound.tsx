import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-8xl font-bold gradient-text sm:text-9xl">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">The page you are looking for does not exist or has been moved.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <Link to="/"><Home className="mr-2 h-4 w-4" /> Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
