"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="border-y border-border bg-obsidian-900 section-padding-sm relative overflow-hidden">
      {/* Background graphic */}
      <div className="absolute -left-1/4 -top-1/2 h-[200%] w-[150%] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-radial-obsidian mix-blend-screen" />
      </div>

      <div className="container-obsidian relative z-10 flex flex-col items-center text-center">
        <h2 className="section-heading mb-4 text-gradient-gold">Join the Obsidian List</h2>
        <p className="body-text max-w-md mb-8">
          Sign up to receive early access to new collections, exclusive events, and 15% off your first order.
        </p>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center p-6 border border-gold-champagne/30 bg-gold-champagne/5 rounded-sm"
              >
                <CheckCircle2 className="h-8 w-8 text-gold-champagne mb-2" />
                <h3 className="font-display text-xl text-bone mb-1">Welcome to Obsidian</h3>
                <p className="font-sans text-sm text-muted-foreground">Your 15% off code has been sent to your email.</p>
                <button 
                  onClick={() => setStatus("idle")} 
                  className="mt-4 text-xs font-sans uppercase tracking-widest text-gold-champagne hover:text-gold-deep transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex w-full flex-col sm:flex-row"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-none border border-border bg-background/50 px-4 py-3 font-sans text-sm text-foreground outline-none backdrop-blur-sm transition-colors focus:border-gold-champagne focus:bg-background"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full sm:w-auto"
                >
                  {status === "loading" ? (
                     <div className="h-4 w-4 rounded-full border-2 border-obsidian border-r-transparent animate-spin" />
                  ) : (
                    <>
                      Subscribe <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
