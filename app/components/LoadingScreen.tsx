"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface LoadingScreenProps {
  children: React.ReactNode;
  minDuration?: number;
}

const LOADING_SHOWN_KEY = "silicon-games-loading-shown";

export default function LoadingScreen({ children, minDuration = 3000 }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowLoading, setShouldShowLoading] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // Check if loading screen was already shown this session
    const hasSeenLoading = sessionStorage.getItem(LOADING_SHOWN_KEY);
    
    if (hasSeenLoading) {
      setShouldShowLoading(false);
      setIsLoading(false);
      return;
    }

    // Scroll to top
    window.scrollTo(0, 0);
    
    // Start timer for minimum duration
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= minDuration) {
        clearInterval(interval);
        setMinTimeElapsed(true);
      }
    }, 30);

    // Check for content/page ready
    const checkReady = () => {
      if (document.readyState === 'complete') {
        setContentReady(true);
      }
    };

    // Check immediately
    checkReady();
    
    // Also listen for load event
    window.addEventListener('load', checkReady);
    document.addEventListener('readystatechange', checkReady);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', checkReady);
      document.removeEventListener('readystatechange', checkReady);
    };
  }, [minDuration]);

  // Finish loading when both conditions are met
  useEffect(() => {
    if (minTimeElapsed && contentReady && shouldShowLoading) {
      sessionStorage.setItem(LOADING_SHOWN_KEY, "true");
      window.scrollTo(0, 0);
      setIsLoading(false);
    }
  }, [minTimeElapsed, contentReady, shouldShowLoading]);

  // Don't render children at all until loading is complete (for first visit)
  if (shouldShowLoading && isLoading) {
    return (
      <motion.div 
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden"
          >
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            >
              <Image
                src="/images/sgtrio3.png"
                alt="Loading"
                width={300}
                height={150}
                style={{ imageRendering: "pixelated" }}
                priority
              />
            </motion.div>
          </motion.div>
          
          <motion.div
            className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    );
  }

  // After loading complete, fade in the content
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

