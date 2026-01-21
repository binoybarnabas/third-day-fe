"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/common/dialog";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, Ticket, X, Copy, Check } from "lucide-react";

export function FirstTimePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [copied, setCopied] = useState(false);

  const couponCode = "IDENTITY15";

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("has_seen_first_order_popup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setStep("otp");
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) setStep("success");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finish = () => {
    localStorage.setItem("has_seen_first_order_popup", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl [&>button]:hidden">
        <div className="sr-only">
          <DialogTitle>First Order Discount</DialogTitle>
          <DialogDescription>
            Enter your email to receive a 15% discount code for your first streetwear purchase.
          </DialogDescription>
        </div>

        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute right-5 top-5 text-neutral-400 hover:text-black transition-colors z-50 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-8">
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div 
                key="email" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="space-y-6 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">Join the Movement</h2>
                  <p className="text-muted-foreground text-sm">Enter your email to unlock a 15% discount on your first order.</p>
                </div>
                <form onSubmit={handleSendOTP} className="space-y-3">
                  <Input 
                    type="email" 
                    placeholder="email@example.com" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="h-12 rounded-none border-2 focus:border-black" 
                  />
                  <Button type="submit" className="w-full h-12 bg-black text-white rounded-none uppercase font-bold tracking-widest">
                    Send OTP
                  </Button>
                </form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div 
                key="otp" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="space-y-6 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">Verify It's You</h2>
                  <p className="text-muted-foreground text-sm">Enter the 4-digit code sent to <br/><span className="text-black font-medium">{email}</span></p>
                </div>
                <form onSubmit={handleVerifyOTP} className="space-y-3">
                  <Input 
                    type="text" 
                    placeholder="0 0 0 0" 
                    maxLength={4} 
                    required 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    className="h-12 text-center text-xl tracking-[1em] rounded-none border-2 focus:border-black" 
                  />
                  <Button type="submit" className="w-full h-12 bg-black text-white rounded-none uppercase font-bold tracking-widest">
                    Unlock Discount
                  </Button>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div 
                key="success" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="space-y-6 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <Ticket className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">Welcome to the Club</h2>
                  <p className="text-muted-foreground text-sm">Your 15% discount code is ready.</p>
                </div>
                <div className="relative group cursor-pointer" onClick={copyToClipboard}>
                  <div className="p-4 border-2 border-dashed border-neutral-300 bg-neutral-50 rounded-xl flex items-center justify-center gap-3 group-hover:border-black transition-colors">
                    <span className="text-2xl font-mono font-bold tracking-[0.2em]">{couponCode}</span>
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-neutral-400" />}
                  </div>
                  <p className="mt-2 text-[10px] uppercase text-neutral-400 font-bold tracking-widest">
                    {copied ? "Copied!" : "Click to copy"}
                  </p>
                </div>
                <Button onClick={finish} className="w-full h-12 bg-black text-white rounded-none uppercase font-bold tracking-widest">
                  Start Shopping
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}