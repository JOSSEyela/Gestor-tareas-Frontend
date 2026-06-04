import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setSigningIn(true);
    try {
      await login();
    } finally {
      setSigningIn(false);
    }
  };

  const busy = isLoading || signingIn;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-lg flex flex-col items-center gap-6 border"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-5xl select-none">✓</span>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Task Manager
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Organiza tu trabajo, en cualquier lugar
          </p>
        </div>

        {/* Google sign-in button */}
        <button
          onClick={handleLogin}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 border"
          style={{
            backgroundColor: "var(--color-bg-primary)",
            color: "var(--color-text-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          {busy ? (
            <span
              className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin shrink-0"
              style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
            />
          ) : (
            <GoogleIcon />
          )}
          Continuar con Google
        </button>

        {/* Footer note */}
        <p className="text-xs text-center" style={{ color: "var(--color-text-secondary)" }}>
          Tus tareas se sincronizan en todos tus dispositivos
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M17.64 9.2a10.34 10.34 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92A8.78 8.78 0 0 0 17.64 9.2Z"
        fill="#4285F4"
      />
      <path
        d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.92-2.26a5.4 5.4 0 0 1-8.07-2.85H.96v2.34A9 9 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.34Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.63 8.63 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.34A5.37 5.37 0 0 1 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}
