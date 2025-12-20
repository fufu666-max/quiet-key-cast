"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Lock, Unlock, Zap } from "lucide-react";

interface DecryptionRevealProps {
  isOpen: boolean;
  onClose: () => void;
  value: string | null;
  isDecrypting: boolean;
}

export function DecryptionReveal({ isOpen, onClose, value, isDecrypting }: DecryptionRevealProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [showValue, setShowValue] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Generate random particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
      setShowValue(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isDecrypting && value && isOpen) {
      // Show value after decryption completes
      setTimeout(() => setShowValue(true), 300);
      // Auto close after showing value
      setTimeout(() => onClose(), 3000);
    }
  }, [isDecrypting, value, isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full bg-purple-500"
              initial={{ 
                x: `${particle.x}vw`, 
                y: `${particle.y}vh`,
                scale: 0,
                opacity: 0 
              }}
              animate={showValue ? {
                x: "50vw",
                y: "50vh",
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              } : {
                scale: [0, 1.5, 1],
                opacity: [0, 1, 0.5],
              }}
              transition={{
                duration: showValue ? 0.8 : 2,
                delay: particle.delay,
                repeat: showValue ? 0 : Infinity,
                repeatType: "reverse",
              }}
              style={{
                boxShadow: "0 0 10px #a855f7, 0 0 20px #a855f7",
              }}
            />
          ))}

          {/* Main Content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative z-10 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              {!showValue ? (
                <motion.div
                  key="decrypting"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  className="flex flex-col items-center"
                >
                  {/* Animated Lock */}
                  <motion.div
                    className="relative w-32 h-32 mb-8"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-purple-500/20"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-purple-500/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotateY: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Lock className="w-16 h-16 text-purple-400" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.h2
                    className="text-2xl font-bold text-white mb-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Decrypting...
                  </motion.h2>
                  <p className="text-muted-foreground">
                    Processing FHE decryption request
                  </p>

                  {/* Progress dots */}
                  <div className="flex gap-2 mt-6">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-purple-500"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  {/* Success Animation */}
                  <motion.div
                    className="relative w-32 h-32 mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-green-500/20"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 2, 2], opacity: [0.5, 0.2, 0] }}
                      transition={{ duration: 1 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <Unlock className="w-16 h-16 text-green-400" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-muted-foreground mb-2">Decrypted Value</p>
                    <motion.div
                      className="text-7xl font-bold"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 10,
                        delay: 0.3 
                      }}
                      style={{
                        background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 0 40px rgba(168, 85, 247, 0.5)",
                      }}
                    >
                      {value}
                    </motion.div>
                  </motion.div>

                  {/* Sparkles */}
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                  </motion.div>

                  {/* Electric effect */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${i * 60}deg)`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    >
                      <Zap className="w-6 h-6 text-purple-400" style={{ transform: "translateX(80px)" }} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
