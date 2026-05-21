import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MOCK_BLOG_POSTS } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = MOCK_BLOG_POSTS.find((p) => p.id === id);

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h2 className="text-2xl font-bold mb-4">Post not found</h2><Link to="/blog" className="btn-primary">Back to Blog</Link></div>
    </div>
  );

  const SAMPLE_CONTENT = [
    "The modern workplace is undergoing a fundamental transformation. As remote and hybrid work become the new standard, professionals everywhere are rethinking not just where they work, but how they work and with whom.",
    "Smart workspaces are at the forefront of this revolution. Equipped with AI-powered systems, IoT sensors, and community-first design, these spaces don't just provide a desk — they provide an entire ecosystem for productivity and connection.",
    "Research shows that employees who work in well-designed, community-driven environments report 40% higher satisfaction and 25% better productivity compared to traditional office settings. The data is clear: environment matters.",
    "At Spacebility, we've seen firsthand how the right workspace can transform a team's output. From the way natural light affects focus, to how proximity to other innovators sparks unexpected collaborations — every element of workspace design has measurable impact.",
    "Looking ahead, the future of work is not about choosing between home and office. It's about having access to a dynamic network of spaces that adapt to your needs — whether you need focused deep work, collaborative sessions, or community connection.",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link to="/blog" className="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-6">← Back to Blog</Link>
          <span className="badge-accent mb-4">{post.category}</span>
          <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-3 mb-8">
            <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
            <div><p className="text-sm font-medium text-slate-800 dark:text-white">{post.author}</p><p className="text-xs text-slate-400">{formatDate(post.date)} · {post.readTime}</p></div>
          </div>
          <img src={post.image} alt={post.title} className="w-full h-72 object-cover rounded-2xl mb-8" />
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
            {SAMPLE_CONTENT.map((para, i) => <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">{para}</p>)}
          </div>
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
            {post.tags.map((tag) => <span key={tag} className="badge-primary">{tag}</span>)}
          </div>
          <div className="mt-10 p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl text-center">
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Ready to find your perfect workspace?</h3>
            <p className="text-slate-500 text-sm mb-4">Join 50,000+ professionals already working smarter with Spacebility.</p>
            <Link to="/register" className="btn-primary">Get Started Free</Link>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
