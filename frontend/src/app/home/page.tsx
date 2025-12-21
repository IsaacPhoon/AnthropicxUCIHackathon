"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthBackground } from "@/components/AuthBackground";

export default function HomePage() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const introText =
    "Prep for any interview in your browser—no coaches, no judgment, just results.";

  useEffect(() => {
    let index = 0;
    const typingSpeed = 15;
    let timeoutId: NodeJS.Timeout;

    const typeText = () => {
      if (index < introText.length) {
        setDisplayedText(introText.slice(0, index + 1));
        index++;
        timeoutId = setTimeout(typeText, typingSpeed);
      } else {
        setIsTypingComplete(true);
      }
    };

    typeText();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full relative z-10 text-center px-8"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 dark:text-gray-100 leading-relaxed tracking-tight">
          {displayedText}
          {!isTypingComplete && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block ml-1"
            >
              |
            </motion.span>
          )}
        </h1>
      </motion.div>
    </div>
  );
}
