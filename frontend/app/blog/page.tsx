"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Grid3X3,
  List,
  Newspaper,
  LayoutGrid,
  ChevronDown,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import Link from "next/link";

type LayoutType = "grid" | "list" | "magazine" | "card";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Development: Trends to Watch in 2024",
    excerpt:
      "Explore the cutting-edge technologies and methodologies that are shaping the future of web development, from AI integration to advanced frameworks.",
    author: "Sarah Chen",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    category: "Technology",
    image: "/modern-web-dev-workspace.png",
    featured: true,
  },
  {
    id: 2,
    title: "Mastering React Server Components: A Complete Guide",
    excerpt:
      "Deep dive into React Server Components and learn how to leverage them for better performance and user experience in your applications.",
    author: "Michael Rodriguez",
    date: "Dec 12, 2024",
    readTime: "12 min read",
    category: "React",
    image: "/react-server-components-code.jpg",
  },
  {
    id: 3,
    title: "Design Systems That Scale: Building for Enterprise",
    excerpt:
      "Learn how to create robust design systems that can grow with your organization and maintain consistency across multiple products.",
    author: "Emma Thompson",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    category: "Design",
    image: "/design-system-components.png",
  },
  {
    id: 4,
    title: "TypeScript Best Practices for Large Applications",
    excerpt:
      "Discover advanced TypeScript patterns and practices that will help you build maintainable and scalable applications.",
    author: "David Kim",
    date: "Dec 8, 2024",
    readTime: "15 min read",
    category: "TypeScript",
    image: "/typescript-code-editor.jpg",
  },
  {
    id: 5,
    title: "The Art of API Design: Creating Developer-Friendly Interfaces",
    excerpt:
      "Explore the principles and patterns that make APIs intuitive, efficient, and enjoyable to work with for developers.",
    author: "Lisa Park",
    date: "Dec 5, 2024",
    readTime: "9 min read",
    category: "API",
    image: "/api-documentation-interface.jpg",
  },
  {
    id: 6,
    title: "Performance Optimization: Making Your Apps Lightning Fast",
    excerpt:
      "Comprehensive guide to web performance optimization techniques that will dramatically improve your application's speed.",
    author: "James Wilson",
    date: "Dec 3, 2024",
    readTime: "11 min read",
    category: "Performance",
    image: "/images/blog/performance-optimization.png",
  },
];

const layoutOptions = [
  { value: "grid" as LayoutType, label: "Grid View", icon: Grid3X3 },
  { value: "list" as LayoutType, label: "List View", icon: List },
  { value: "magazine" as LayoutType, label: "Magazine View", icon: Newspaper },
  { value: "card" as LayoutType, label: "Card View", icon: LayoutGrid },
];

export default function BlogPage() {
  const [currentLayout, setCurrentLayout] = useState<LayoutType>("grid");

  const currentLayoutOption = layoutOptions.find(
    (option) => option.value === currentLayout
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogPosts.map((post) => (
        <Card
          key={post.id}
          className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card"
        >
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="text-xs font-medium bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>
            <Link href={`/blog/${post.id}`}>
              <CardTitle className="text-xl font-bold leading-tight text-balance text-blue-900 hover:text-blue-800 transition-colors cursor-pointer">
                {post.title}
              </CardTitle>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
              {post.excerpt}
            </CardDescription>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-6">
      {blogPosts.map((post) => (
        <Card
          key={post.id}
          className="group hover:shadow-md transition-all duration-300 border-0 shadow-sm bg-card"
        >
          <CardContent className="p-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-48 h-32 overflow-hidden rounded-lg">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {post.category}
                  </Badge>
                  {post.featured && (
                    <Badge className="text-xs font-medium bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
                <Link href={`/blog/${post.id}`}>
                  <h3 className="text-2xl font-bold mb-3 text-balance text-blue-900 hover:text-blue-800 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderMagazineLayout = () => {
    const featuredPost = blogPosts.find((post) => post.featured);
    const otherPosts = blogPosts.filter((post) => !post.featured);

    return (
      <div className="space-y-12">
        {featuredPost && (
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-card overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1">
                    Featured Article
                  </Badge>
                  <Badge variant="secondary" className="text-sm font-medium">
                    {featuredPost.category}
                  </Badge>
                </div>
                <Link href={`/blog/${featuredPost.id}`}>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance text-blue-900 hover:text-blue-800 transition-colors cursor-pointer">
                    {featuredPost.title}
                  </h2>
                </Link>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherPosts.map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-t-lg">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <Badge
                  variant="secondary"
                  className="text-xs font-medium w-fit mb-2"
                >
                  {post.category}
                </Badge>
                <Link href={`/blog/${post.id}`}>
                  <CardTitle className="text-xl font-bold leading-tight text-balance text-blue-900 hover:text-blue-800 transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCardLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {blogPosts.map((post) => (
        <Card
          key={post.id}
          className="group hover:shadow-xl transition-all duration-300 border border-border/50 shadow-lg bg-card overflow-hidden"
        >
          <div className="relative">
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge
                variant="secondary"
                className="text-xs font-medium backdrop-blur-sm bg-background/90"
              >
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="text-xs font-medium bg-primary text-primary-foreground backdrop-blur-sm">
                  Featured
                </Badge>
              )}
            </div>
          </div>
          <CardHeader className="pb-4">
            <Link href={`/blog/${post.id}`}>
              <CardTitle className="text-2xl font-bold leading-tight text-balance text-blue-900 hover:text-blue-800 transition-colors cursor-pointer">
                {post.title}
              </CardTitle>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-muted-foreground mb-6 leading-relaxed text-base">
              {post.excerpt}
            </CardDescription>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderLayout = () => {
    switch (currentLayout) {
      case "grid":
        return renderGridLayout();
      case "list":
        return renderListLayout();
      case "magazine":
        return renderMagazineLayout();
      case "card":
        return renderCardLayout();
      default:
        return renderGridLayout();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Our Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover insights, tutorials, and the latest trends in web
            development, design, and technology.
          </p>
        </div>

        {/* Layout Selector */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Latest Articles</h2>
            <Badge variant="outline" className="text-sm">
              {blogPosts.length} posts
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                {currentLayoutOption && (
                  <currentLayoutOption.icon className="w-4 h-4" />
                )}
                {currentLayoutOption?.label}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {layoutOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setCurrentLayout(option.value)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Blog Posts */}
        <div className="animate-in fade-in-50 duration-500">
          {renderLayout()}
        </div>
      </div>
    </div>
  );
}
