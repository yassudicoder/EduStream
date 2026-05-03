"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState, ReactNode } from "react";

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  type?: string;
  disabled?: boolean;
}

export function SmoothInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  type = "text",
  disabled = false,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <motion.div
        className="relative"
        animate={{
          borderColor: error
            ? "#f87171"
            : success
              ? "#34d399"
              : isFocused
                ? "var(--accent)"
                : "var(--border)",
        }}
        transition={{ duration: 0.2 }}
        style={{
          border: "1px solid",
          borderColor: error
            ? "#f87171"
            : success
              ? "#34d399"
              : isFocused
                ? "var(--accent)"
                : "var(--border)",
          borderRadius: "12px",
          background: "var(--surface)",
          position: "relative",
        }}
      >
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className="w-full px-4 py-2.5 bg-transparent outline-none"
          style={{ color: "var(--text)" }}
        />

        {/* Password toggle */}
        {isPassword && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "var(--text-faint)" }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </motion.button>
        )}

        {/* Status icons */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <AlertCircle size={16} color="#f87171" />
            </motion.div>
          )}
          {success && !error && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <CheckCircle size={16} color="#34d399" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error/Success message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs font-medium"
            style={{ color: "#f87171" }}
          >
            {error}
          </motion.p>
        )}
        {success && !error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs font-medium"
            style={{ color: "#34d399" }}
          >
            ✓ Looks good!
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SmoothSelect({
  label,
  options,
  value,
  onChange,
  error,
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <motion.select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="px-4 py-2.5 rounded-xl outline-none text-sm font-medium"
        style={{
          background: "var(--surface)",
          color: "var(--text)",
          border: `1px solid ${error ? "#f87171" : isFocused ? "var(--accent)" : "var(--border)"}`,
          cursor: "pointer",
          transition: "border-color 0.2s ease",
        }}
        animate={{
          borderColor: error
            ? "#f87171"
            : isFocused
              ? "var(--accent)"
              : "var(--border)",
        }}
        transition={{ duration: 0.2 }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </motion.select>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium"
          style={{ color: "#f87171" }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SmoothCheckbox({
  label,
  checked,
  onChange,
  disabled = false,
}: CheckboxProps) {
  return (
    <motion.label
      className="flex items-center gap-3 cursor-pointer group"
      whileHover={!disabled ? { x: 2 } : {}}
    >
      <motion.div
        className="w-5 h-5 rounded-lg border-2 flex items-center justify-center"
        style={{
          borderColor: checked ? "var(--accent)" : "var(--border)",
          background: checked ? "var(--accent)" : "transparent",
        }}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        animate={{
          borderColor: checked ? "var(--accent)" : "var(--border)",
          background: checked ? "var(--accent)" : "transparent",
        }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-white text-xs font-bold"
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.span
        className="text-sm font-medium cursor-pointer select-none"
        style={{ color: disabled ? "var(--text-faint)" : "var(--text)" }}
      >
        {label}
      </motion.span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="hidden"
      />
    </motion.label>
  );
}

interface SmoothButtonProps {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

export function SmoothButton({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
}: SmoothButtonProps) {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary: {
      background: "var(--btn-grad)",
      color: "white",
      boxShadow: "0 8px 24px var(--accent-glow)",
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
    danger: {
      background: "#f87171",
      color: "white",
      boxShadow: "0 8px 24px rgba(248, 113, 113, 0.3)",
    },
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      }`}
      style={{
        ...variants[variant],
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? "not-allowed" : "pointer",
      }}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex" }}
            >
              ⟳
            </motion.div>
          </motion.div>
        ) : (
          <motion.span key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
