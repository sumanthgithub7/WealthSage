import React, { useEffect, useState } from 'react';

const PerformanceOptimizer = ({ children }) => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    apiCalls: 0
  });

  useEffect(() => {
    // Measure initial load time
    const startTime = performance.now();
    
    // Measure when component is fully rendered
    const measureRenderTime = () => {
      const endTime = performance.now();
      setPerformanceMetrics(prev => ({
        ...prev,
        loadTime: endTime - startTime,
        renderTime: endTime - startTime
      }));
    };

    // Use requestAnimationFrame to measure after render
    requestAnimationFrame(measureRenderTime);

    // Monitor API calls
    const originalFetch = window.fetch;
    let apiCallCount = 0;

    window.fetch = function(...args) {
      apiCallCount++;
      setPerformanceMetrics(prev => ({
        ...prev,
        apiCalls: apiCallCount
      }));
      return originalFetch.apply(this, args);
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', performanceMetrics);
      
      // Warn about slow performance
      if (performanceMetrics.loadTime > 3000) {
        console.warn('⚠️ Slow page load detected:', performanceMetrics.loadTime + 'ms');
      }
      
      if (performanceMetrics.apiCalls > 5) {
        console.warn('⚠️ High number of API calls:', performanceMetrics.apiCalls);
      }
    }
  }, [performanceMetrics]);

  return <>{children}</>;
};

// Performance optimization utilities
export const optimizeImages = (src) => {
  // Add image optimization logic here
  return src;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading hook
export const useLazyLoad = (ref, threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, threshold]);

  return isVisible;
};

// Memory usage monitor
export const useMemoryMonitor = () => {
  const [memoryUsage, setMemoryUsage] = useState(null);

  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        setMemoryUsage({
          used: Math.round(performance.memory.usedJSHeapSize / 1048576),
          total: Math.round(performance.memory.totalJSHeapSize / 1048576),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        });
      }
    };

    checkMemory();
    const interval = setInterval(checkMemory, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryUsage;
};

export default PerformanceOptimizer;
