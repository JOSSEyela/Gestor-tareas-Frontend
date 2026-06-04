export function PageLoader() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4"
        style={{
          borderColor: "var(--color-accent)",
          borderTopColor: "transparent",
        }}
      />
      <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
        Cargando...
      </p>
    </div>
  );
}
