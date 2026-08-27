import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-screen">
      <p>M0AZ_OS / FILESYSTEM ERROR</p><h1>404</h1>
      <code>bash: /requested/path: No such file or directory</code>
      <p>The requested mount point does not exist or is not publicly available.</p>
      <div><Link href="/">cd ~</Link><Link href="/projects">ls ~/projects</Link></div>
    </main>
  );
}
