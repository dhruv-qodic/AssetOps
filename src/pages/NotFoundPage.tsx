import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
      <p className="text-muted-foreground mb-6">The page you are looking for does not exist.</p>
      <Link to="/">
        <Button variant="outline">Go Back to Home</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
