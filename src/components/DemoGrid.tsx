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
        <motion.a
          key={index}
          variants={item}
          href={demo.href}
          onClick={(e) => {
            if (demo.status === "soon") {
              e.preventDefault();
              alert("This demo is coming soon! Stay tuned for updates.");
            }
          }}
          className={`demo-card group relative p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
            demo.status === "soon" ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <span
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
              demo.status === "live"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            }`}
          >
            {demo.status === "live" ? "Live" : "Coming Soon"}
          </span>
          <div
            className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${demo.gradient} mb-4 text-2xl`}
          >
            {demo.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{demo.title}</h3>
          <p className="text-muted-foreground">{demo.description}</p>
        </motion.a>
      ))}
    </motion.div>
  );
}
