import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Next.js Rendering Masterclass — 24 Interactive Demos",
  description: "Live interactive demos for React 19 & Next.js 15 Rendering Strategies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="header-content">
            <Link href="/" className="brand-title">
              ⚡ Next.js Rendering Masterclass (24 Concepts)
            </Link>
            <nav className="nav-links">
              <Link href="/" className="nav-link">Dashboard</Link>
              <Link href="/browser-pipeline" className="nav-link">Pipeline</Link>
              <Link href="/csr" className="nav-link">CSR</Link>
              <Link href="/ssr" className="nav-link">SSR</Link>
              <Link href="/ssg" className="nav-link">SSG</Link>
              <Link href="/isr" className="nav-link">ISR</Link>
              <Link href="/server-vs-client" className="nav-link">RSC</Link>
              <Link href="/streaming" className="nav-link">Streaming</Link>
              <Link href="/partial-prerendering" className="nav-link">PPR</Link>
              <Link href="/ecommerce-architecture" className="nav-link">Architecture</Link>
              <Link href="/core-web-vitals" className="nav-link">CWV</Link>
              <Link href="/interview-quiz" className="nav-link">Quiz</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
