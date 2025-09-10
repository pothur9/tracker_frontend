"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Calendar,
  Clock,
  LayoutGrid,
  List,
  BookOpen,
  Share2,
  Bookmark,
  Heart,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured?: boolean;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Development: Trends to Watch in 2024",
    excerpt:
      "Explore the cutting-edge technologies and methodologies that are shaping the future of web development, from AI integration to advanced frameworks.",
    content: `
      <p>The landscape of web development is evolving at an unprecedented pace. As we move through 2024, several key trends are emerging that will fundamentally reshape how we build and interact with web applications.</p>
      
      <h2>AI-Powered Development Tools</h2>
      <p>Artificial Intelligence is no longer just a buzzword in web development—it's becoming an integral part of our daily workflow. From code completion tools like GitHub Copilot to AI-powered design systems, developers are leveraging machine learning to write better code faster.</p>
      
      <p>The integration of AI into development workflows is particularly exciting because it allows developers to focus on higher-level problem-solving while automating repetitive tasks. This shift is enabling teams to deliver more innovative solutions in shorter timeframes.</p>
      
      <h2>Server Components and Edge Computing</h2>
      <p>React Server Components represent a paradigm shift in how we think about client-server architecture. By allowing components to run on the server, we can reduce bundle sizes, improve performance, and create more efficient applications.</p>
      
      <p>Edge computing complements this trend by bringing computation closer to users, reducing latency and improving the overall user experience. The combination of server components and edge deployment is creating new possibilities for building fast, scalable applications.</p>
      
      <h2>The Rise of TypeScript</h2>
      <p>TypeScript adoption continues to grow exponentially, and for good reason. The type safety it provides helps catch errors early in the development process, leading to more robust applications and better developer experience.</p>
      
      <p>Modern frameworks are embracing TypeScript as a first-class citizen, with many providing built-in TypeScript support out of the box. This trend is making TypeScript knowledge essential for modern web developers.</p>
      
      <h2>Performance-First Development</h2>
      <p>Web performance has become a critical factor in user experience and SEO rankings. Core Web Vitals and other performance metrics are driving developers to adopt performance-first approaches to development.</p>
      
      <p>Tools like Lighthouse, WebPageTest, and browser DevTools are becoming essential parts of the development workflow, helping teams identify and fix performance bottlenecks before they impact users.</p>
      
      <h2>Conclusion</h2>
      <p>The future of web development is bright, with exciting technologies and methodologies emerging to help us build better applications. By staying informed about these trends and continuously learning, developers can position themselves for success in this rapidly evolving field.</p>
    `,
    author: "Sarah Chen",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    category: "Technology",
    image: "/modern-web-dev-workspace.png",
    featured: true,
    tags: ["Web Development", "AI", "TypeScript", "Performance", "React"],
  },
  {
    id: 2,
    title: "Mastering React Server Components: A Complete Guide",
    excerpt:
      "Deep dive into React Server Components and learn how to leverage them for better performance and user experience in your applications.",
    content: `
      <p>React Server Components represent one of the most significant architectural changes in React's history. This comprehensive guide will walk you through everything you need to know to master this powerful feature.</p>
      
      <h2>Understanding Server Components</h2>
      <p>Server Components run on the server and render to a special format that can be streamed to the client. Unlike traditional server-side rendering, Server Components don't hydrate on the client, which means they don't add to your JavaScript bundle size.</p>
      
      <h2>Benefits of Server Components</h2>
      <p>The primary benefits include reduced bundle sizes, improved performance, and better SEO. By moving computation to the server, we can create faster, more efficient applications that provide better user experiences.</p>
      
      <h2>Implementation Strategies</h2>
      <p>When implementing Server Components, it's important to understand the boundaries between server and client code. This guide provides practical examples and best practices for structuring your applications.</p>
    `,
    author: "Michael Rodriguez",
    date: "Dec 12, 2024",
    readTime: "12 min read",
    category: "React",
    image: "/react-server-components-code.jpg",
    tags: ["React", "Server Components", "Performance", "Next.js"],
  },
  // Add more blog posts with full content...
];

type ContentLayout = "standard" | "magazine" | "minimal";

export default function BlogPost({ params }: { params: { id: string } }) {
  const [contentLayout, setContentLayout] = useState<ContentLayout>("standard");

  const post = blogPosts.find((p) => p.id === Number.parseInt(params.id));

  if (!post) {
    notFound();
  }

  const renderHeroImage = () => {
    switch (contentLayout) {
      case "magazine":
        return (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="text-sm font-medium bg-primary text-primary-foreground">
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge className="text-sm font-medium bg-blue-900 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4 text-balance">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-center gap-6 text-muted-foreground mb-8">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Badge className="text-sm font-medium bg-primary text-primary-foreground">
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="text-sm font-medium bg-blue-900 text-white">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl font-light text-blue-900 mb-6 text-balance tracking-tight">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-center gap-6 text-muted-foreground mb-8">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
            <div className="aspect-[21/9] overflow-hidden rounded-lg mb-8">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );

      default: // standard
        return (
          <div className="relative mb-8">
            <div className="aspect-[16/6] overflow-hidden rounded-lg">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            <div className="absolute inset-0 flex items-end">
              <div className="p-8">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="text-sm font-medium bg-primary text-primary-foreground">
                      {post.category}
                    </Badge>
                    {post.featured && (
                      <Badge className="text-sm font-medium bg-blue-900 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
                    {post.title}
                  </h1>
                  <p className="text-xl text-white/90 mb-8 text-pretty max-w-3xl">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-6 text-white/80">
                    <span className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderContent = () => {
    const contentHtml = post.content;

    switch (contentLayout) {
      case "magazine":
        return (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div
                className="prose prose-xl max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-lg"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                <Card className="p-6 bg-muted/30">
                  <h3 className="font-bold text-lg mb-4">Article Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 bg-muted/30">
                  <h3 className="font-bold text-lg mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className="max-w-2xl mx-auto">
            <div
              className="prose prose-lg max-w-none prose-headings:font-light prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-loose prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-8 prose-p:mb-8 prose-headings:tracking-tight"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            <div className="mt-16 pt-8 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default: // standard
        return (
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-8 lg:p-12">
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              <Separator className="my-8" />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{post.author}</h3>
                  <p className="text-muted-foreground">
                    Web developer and technology enthusiast with over 8 years of
                    experience building modern applications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="outline" className="group bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              {/* Layout Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="group bg-transparent">
                    {contentLayout === "standard" && (
                      <LayoutGrid className="w-4 h-4 mr-2" />
                    )}
                    {contentLayout === "magazine" && (
                      <List className="w-4 h-4 mr-2" />
                    )}
                    {contentLayout === "minimal" && (
                      <BookOpen className="w-4 h-4 mr-2" />
                    )}
                    Layout
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setContentLayout("standard")}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Standard Layout
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setContentLayout("magazine")}
                  >
                    <List className="w-4 h-4 mr-2" />
                    Magazine Layout
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setContentLayout("minimal")}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Minimal Layout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                variant="outline"
                className="group bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Share
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="group bg-transparent"
              >
                <Bookmark className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Save
              </Button>
              <Button
                size="sm"
                className="bg-blue-900 hover:bg-blue-800 text-white group"
              >
                <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Like
              </Button>
            </div>
          </div>

          {renderHeroImage()}

          {/* Dynamic Content Rendering Based on Layout */}
          {renderContent()}

          {/* Related Articles */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card"
                  >
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium mb-3"
                      >
                        {relatedPost.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-3 text-balance group-hover:text-blue-900 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      <Link href={`/blog/${relatedPost.id}`}>
                        <Button className="bg-blue-900 hover:bg-blue-800 text-white group/btn">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
