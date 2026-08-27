"use client";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-screen">
      <p>M0AZ_OS / RECOVERY MODE</p><h1>PROCESS HALTED</h1>
      <code>Application state entered a recoverable error boundary.</code>
      <p>No stack trace or private diagnostic detail is exposed here.</p>
      <button type="button" onClick={reset}>restart process</button>
    </main>
  );
}
