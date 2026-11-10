import Link from "next/link";

// Statically generated route (default in App Router):
export default function SSGDemoPage() {
  const staticArticles = [
    { slug: "about-us", title: "About Our Company", category: "Company" },
    { slug: "privacy-policy", title: "Privacy Policy & GDPR", category: "Legal" },
    { slug: "terms-of-service", title: "Terms of Service Agreement", category: "Legal" },
    { slug: "repair-services", title: "Electronics Repair Services", category: "Services" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          Static Site Generation (SSG) Live Demo
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          These pages are compiled into static HTML files during <code>next build</code> and served 
          directly from a Global CDN in 15ms. Zero database queries and zero server compute during user visits!
        </p>
      </div>

      <div className="demo-box">
        <div style={{ marginBottom: "16px" }}>
          <span className="badge badge-green">Build-Time Static Generation</span>
          <span style={{ marginLeft: "12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Global CDN Edge Cache: 100% HIT
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {staticArticles.map((art) => (
            <div key={art.slug} style={{ background: "var(--bg-secondary)", padding: "18px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <span className="badge badge-blue">{art.category}</span>
              <h3 style={{ fontSize: "1.1rem", margin: "10px 0 4px" }}>{art.title}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                Route: /ssg/{art.slug}
              </p>
              <span style={{ fontSize: "0.85rem", color: "var(--accent-green)", fontWeight: 600 }}>
                Pre-rendered Static HTML &rarr;
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>How Next.js Compiles Dynamic SSG with generateStaticParams:</h3>
        <pre className="code-block">
{`// app/blog/[slug]/page.jsx

// 1. Tell Next.js all possible slug paths at build time:
export async function generateStaticParams() {
  const articles = await db.article.findMany();
  return articles.map((a) => ({ slug: a.slug }));
}

// 2. Next.js generates static HTML for each slug:
export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await db.article.findUnique({ where: { slug } });

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

