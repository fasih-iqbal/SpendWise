"use client";
import { useState, Suspense } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(
    searchParams.get("mode") === "signin",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        try {
          localStorage.setItem("spendwise-onboarded", "1");
        } catch {}
        router.push("/pin");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user && name.trim()) {
          await supabase
            .from("profiles")
            .update({ name: name.trim() })
            .eq("id", data.user.id);
        }
        try {
          localStorage.setItem("spendwise-onboarded", "1");
        } catch {}
        router.push("/pin?mode=set");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#EDE4D8",
        display: "flex",
        flexDirection: "column",
        padding: "0 20px calc(env(safe-area-inset-bottom) + 24px)",
        maxWidth: 430,
        margin: "0 auto",
        fontFamily: "var(--font-urbanist), sans-serif",
      }}
    >
      {/* Top brand */}
      <div
        style={{
          paddingTop: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 28px rgba(0,0,0,0.10)",
            overflow: "hidden",
          }}
        >
          <Image
            src="/icons/logo-192.png"
            alt="SpendWise"
            width={72}
            height={72}
            priority
            style={{ objectFit: "cover", borderRadius: 22 }}
          />
        </div>
        <p
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: "#1A1410",
            letterSpacing: "-0.01em",
          }}
        >
          SpendWise
        </p>
      </div>

      {/* Segmented switch */}
      <div
        style={{
          marginTop: 30,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "rgba(0,0,0,0.05)",
          borderRadius: 14,
          padding: 4,
          position: "relative",
        }}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          style={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: isSignIn ? "calc(50% + 2px)" : 4,
            width: "calc(50% - 6px)",
            background: "#fff",
            borderRadius: 11,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />
        {[
          { label: "Sign up", signIn: false },
          { label: "Sign in", signIn: true },
        ].map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => {
              setIsSignIn(t.signIn);
              setError("");
            }}
            style={{
              position: "relative",
              zIndex: 1,
              background: "none",
              border: "none",
              padding: "12px 0",
              fontSize: 13,
              fontWeight: 700,
              color: isSignIn === t.signIn ? "#1A1410" : "#A8998A",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "color 200ms",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Heading */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSignIn ? "in" : "up"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ marginTop: 24, textAlign: "left" }}
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: 26,
              color: "#1A1410",
              letterSpacing: "-0.02em",
            }}
          >
            {isSignIn ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ fontSize: 13, color: "#65574A", marginTop: 4 }}>
            {isSignIn
              ? "Sign in to keep your budget on track."
              : "Start tracking your finances in seconds."}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        {!isSignIn && (
          <Field icon={<UserIcon size={16} color="#A8998A" />}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </Field>
        )}
        <Field icon={<Mail size={16} color="#A8998A" />}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />
        </Field>
        <Field icon={<Lock size={16} color="#A8998A" />}>
          <input
            type={showPw ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={isSignIn ? "current-password" : "new-password"}
            style={{ ...inputStyle, paddingRight: 38 }}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#A8998A",
              padding: 4,
            }}
            aria-label="Toggle password visibility"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </Field>

        <AnimatePresence>
          {error && (
            <motion.p
              key="err"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: 12,
                color: "#D03C3C",
                paddingLeft: 4,
                fontWeight: 500,
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          style={{
            marginTop: 6,
            height: 52,
            borderRadius: 16,
            background: loading ? "rgba(208,120,80,0.5)" : "#D07850",
            color: "#fff",
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 8px 24px rgba(208,120,80,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 200ms ease",
          }}
        >
          {loading ? "Loading..." : isSignIn ? "Sign In" : "Create Account"}
          {!loading && <ArrowRight size={18} />}
        </motion.button>
      </form>

      {/* <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#A8998A' }}>
        Protected with a 4-digit PIN after sign-in.
      </p> */}
    </div>
  );
}

function Field({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.07)",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <span style={{ paddingLeft: 14, display: "flex", alignItems: "center" }}>
        {icon}
      </span>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "14px 14px 14px 10px",
  background: "transparent",
  border: "none",
  fontFamily: "var(--font-urbanist), sans-serif",
  fontSize: 15,
  color: "#1A1410",
  outline: "none",
  minWidth: 0,
};

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
