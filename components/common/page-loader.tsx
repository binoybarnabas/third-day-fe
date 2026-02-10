"use client";
import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader() {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              boxShadow: [
                "0px 0px 0px rgba(197, 160, 33, 0)",
                "0px 0px 30px rgba(197, 160, 33, 0.6)",
                "0px 0px 0px rgba(197, 160, 33, 0)"
              ]
            }}
            transition={{ 
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative flex items-center justify-center w-20 h-20 rounded-full shadow-2xl overflow-hidden"
            style={{ backgroundColor: "#e0be4c" }} 
          >
            <motion.div
              animate={{ 
                scale: [1.2, 1.45, 1.2], 
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative w-full h-full"
            >
              <Image
                src="/images/logos/logo_white_png.png"
                alt="Third Day Atelier"
                fill
                className="object-contain" 
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}