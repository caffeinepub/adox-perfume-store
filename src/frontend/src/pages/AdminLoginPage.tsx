import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { storeSessionParameter } from "../utils/urlParams";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [denied, setDenied] = useState(false);

  const handleLogin = () => {
    if (!password.trim()) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
    if (password.trim() === "litun1001") {
      storeSessionParameter("caffeineAdminToken", password.trim());
      navigate({ to: "/admin/dashboard" });
    } else {
      setDenied(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.72 0.11 82 / 0.04) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <a
            href="/"
            className="font-display text-3xl font-bold tracking-[0.3em] text-gold uppercase"
          >
            ADOX
          </a>
          <div className="gold-divider max-w-[80px] mx-auto mt-4 mb-4" />
          <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/40">
            Admin Portal
          </p>
        </div>

        <div className="luxury-card p-8">
          <h1 className="font-display text-xl font-semibold text-foreground mb-2 text-center">
            Welcome Back
          </h1>
          <p className="font-body text-sm text-foreground/50 text-center mb-8">
            Enter your admin password to access the dashboard.
          </p>

          {denied && (
            <div
              className="flex items-center gap-3 p-4 mb-6 border border-destructive/40 bg-destructive/10 rounded-sm"
              data-ocid="admin.error_state"
            >
              <AlertCircle
                size={16}
                className="text-destructive flex-shrink-0"
              />
              <p className="font-body text-sm text-destructive/90">
                Incorrect password. Please try again.
              </p>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="admin-password"
              className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-2 block"
            >
              Admin Password
            </label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                  setDenied(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
                placeholder="Enter admin password"
                data-ocid="admin.input"
                className={`bg-background border-border pr-10 font-body text-sm ${
                  passwordError ? "border-destructive" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {passwordError && (
              <p className="font-body text-xs text-destructive mt-1">
                Please enter the admin password.
              </p>
            )}
          </div>

          <Button
            type="button"
            data-ocid="admin.submit_button"
            onClick={handleLogin}
            className="btn-gold w-full py-3 text-sm tracking-widest uppercase font-semibold"
          >
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>

          <p className="font-body text-xs text-center text-foreground/30 mt-6">
            Adox Admin Access
          </p>
        </div>
      </motion.div>
    </div>
  );
}
