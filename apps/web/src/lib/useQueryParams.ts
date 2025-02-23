import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useQueryParams<T extends Record<string, any>>(
  defaultValues: T,
  options: {
    shallow?: boolean;
    scroll?: boolean;
  } = { shallow: true, scroll: false }
) {
  const router = useRouter();
  const [params, setParams] = useState<T>(defaultValues);

  // Initialize from URL on mount
  useEffect(() => {
    const queryParams: Record<string, any> = {};
    
    Object.keys(defaultValues).forEach(key => {
      const value = router.query[key];
      if (value !== undefined) {
        // Convert string values to appropriate types
        if (typeof defaultValues[key] === 'number') {
          queryParams[key] = Number(value);
        } else if (typeof defaultValues[key] === 'boolean') {
          queryParams[key] = value === 'true';
        } else {
          queryParams[key] = value;
        }
      } else {
        queryParams[key] = defaultValues[key];
      }
    });

    setParams(queryParams as T);
  }, [router.query, defaultValues]);

  // Update URL when params change
  const updateParams = (newParams: Partial<T>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);

    // Update URL query parameters
    const query = { ...router.query };
    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value === defaultValues[key] || value === undefined || value === '') {
        delete query[key];
      } else {
        query[key] = String(value);
      }
    });

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      options
    );
  };

  const resetParams = () => {
    setParams(defaultValues);
    router.push(
      {
        pathname: router.pathname,
      },
      undefined,
      options
    );
  };

  return { params, updateParams, resetParams };
}