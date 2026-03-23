import { motion } from "framer-motion";
import { withBase } from "@/lib/utils";

const demos = [
  {
    title: "SEO Article Generation",
    description:
      "Multi-agent pipeline that researches, outlines, writes, and validates SEO-optimized articles with real-time quality scoring.",
    icon: "✍️",
    gradient: "from-purple-500 to-pink-500",
    href: "/seo-article-generation/index.html",
    docsHref: "/seo-article-generation/docs.html",
    status: "live" as const,
  },
  {
    title: "Visual Content Generator",
    description:
      "AI-powered image generation and editing pipeline with style transfer, background removal, and smart tagging.",
    icon: "🎨",
    gradient: "from-blue-500 to-cyan-500",
    href: "#",
    status: "soon" as const,
  },
  {
    title: "E-commerce Optimizer",
    description:
      "Automated product description generator with attribute extraction, category classification, and metadata enrichment.",
    icon: "🛍️",
    gradient: "from-green-500 to-emerald-500",
    href: "#",
    status: "soon" as const,
  },
  {
    title: "Conversational AI Agent",
    description:
      "Context-aware chatbot with RAG integration, multi-turn dialogue management, and knowledge base grounding.",
    icon: "💬",
    gradient: "from-orange-500 to-amber-500",
    href: "#",
    status: "soon" as const,
  },
  {
    title: "Data Analytics Studio",
    description:
      "Natural language to SQL converter with visualization engine. Ask questions about your data in plain English.",
    icon: "📊",
    gradient: "from-pink-500 to-rose-500",
    href: "#",
    status: "soon" as const,
  },
  {
    title: "Semantic Search Engine",
    description:
      "Multi-modal semantic search across text and images using CLIP embeddings and vector similarity matching.",
    icon: "🔍",
    gradient: "from-indigo-500 to-purple-500",
    href: "#",
    status: "soon" as const,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DemoGrid() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {demos.map((demo, index) => (
        <motion.div
          key={index}
          variants={item}
          className={`demo-card group relative p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col ${
            demo.status === "soon" ? "opacity-70" : ""
          }`}
        >
          {/* Gradient banner with icon + title */}
          <div className={`relative rounded-xl bg-gradient-to-br ${demo.gradient} mb-4 flex flex-col items-center justify-center gap-2 py-5 px-4 overflow-hidden`}>
            <span className="text-2xl">{demo.icon}</span>
            <h3 className="text-base font-bold text-white text-center leading-tight">{demo.title}</h3>
            <span
              className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                demo.status === "live"
                  ? "bg-green-500/90 text-white"
                  : "bg-amber-500/90 text-white"
              }`}
            >
              {demo.status === "live" ? "Live" : "Soon"}
            </span>
          </div>

          <p className="text-muted-foreground flex-1 text-sm">{demo.description}</p>

          <div className="mt-5 flex gap-2">
            {demo.status === "live" ? (
              <>
                <a
                  href={demo.href}
                  className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                >
                  Launch →
                </a>
                {"docsHref" in demo && (
                  <a
                    href={(demo as typeof demo & { docsHref: string }).docsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold border border-purple-500/40 text-purple-500 hover:bg-purple-500/10 transition-colors"
                  >
                    Read
                  </a>
                )}
              </>
            ) : (
              <button
                disabled
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold border border-border text-muted-foreground cursor-not-allowed"
              >
                Coming Soon
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
