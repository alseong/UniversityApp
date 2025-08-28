import { getAllPosts, getPostBySlug, getPostSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

// MDX Components for styling
const mdxComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-4xl font-bold mt-8 mb-6 text-gray-900">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-900">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="text-lg leading-relaxed mb-6 text-gray-700">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className="text-lg">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-blue-600 pl-6 italic text-lg text-gray-600 my-6">
      {children}
    </blockquote>
  ),
  code: ({ children }: any) => (
    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
      {children}
    </pre>
  ),
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = getPostBySlug(params.slug);

    return {
      title: `${post.title} | admitme Blog`,
      description: post.metaDescription || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.metaDescription || post.excerpt,
        type: "article",
        publishedTime: post.date,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.metaDescription || post.excerpt,
      },
    };
  } catch (error) {
    return {
      title: "Post Not Found | admitme Blog",
    };
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  let post;

  try {
    post = getPostBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  if (!post.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </div>
              <div>By {post.author}</div>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>

          {/* Back to Blog Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to All Posts
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
