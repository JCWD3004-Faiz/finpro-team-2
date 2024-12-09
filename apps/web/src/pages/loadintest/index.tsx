import { useState, useEffect } from 'react';
import LoadingVignette from "@/components/LoadingVignette";

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate data fetching or some loading task
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Set loading to false after 3 seconds
  }, []);

  return (
    <div className="bg-white w-screen h-screen text-gray-800">
      <LoadingVignette isLoading={isLoading} />
      <h1>Welcome to the Home Page!</h1>
      <p>This is your page content.</p>
    </div>
  );
};

export default HomePage;
