import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MOCK_BLOG_POSTS } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default function Blog() {
  const featured = MOCK_BLOG_POSTS.filter((p) => p.featured);
  const rest = MOCK_BLOG_POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white text-center px-4">
          <h1 className="text-5xl font-bold font-display mb-4">Spacebility Blog</h1>
          <p className="text-xl text-slate-300 max-w-xl mx-auto">Insights, guides, and stories from the future of work.</p>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-8">Featured Posts</h2>
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              {featured.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="card overflow-hidden group">
                  <div className="h-52 overflow-hidden"><img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                  <div className="p-6">
                    <span className="badge-accent mb-3">{post.category}</span>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-primary-600 transition-colors leading-tight">{post.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3">
                      <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full object-cover" />
                      <div className="text-xs text-slate-400">{post.author} · {formatDate(post.date)} · {post.readTime}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-6">More Posts</h2>
            <div className="grid gap-5">
              {rest.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="card p-5 flex gap-5 hover:shadow-card-hover group">
                  <img src={post.image} alt={post.title} className="w-28 h-24 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <span className="badge-primary mb-2">{post.category}</span>
                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors mb-1">{post.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{post.excerpt}</p>
                    <p className="text-xs text-slate-400 mt-2">{post.author} · {formatDate(post.date)} · {post.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center px-4">
          <h2 className="text-2xl font-bold font-display mb-3">Stay in the Loop</h2>
          <p className="text-primary-200 mb-6">Get our latest articles delivered to your inbox weekly.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40" />
            <button className="bg-white text-primary-600 font-semibold px-5 py-3 rounded-xl hover:bg-primary-50">Subscribe</button>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
