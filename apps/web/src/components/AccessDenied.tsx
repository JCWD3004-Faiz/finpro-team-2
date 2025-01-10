import React, { useEffect, useState } from "react";

const AccessDenied: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex justify-center items-center z-50">
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-semibold text-red-600">Access Denied</h2>
        <p className="mt-4 text-lg text-gray-700">You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default AccessDenied;
