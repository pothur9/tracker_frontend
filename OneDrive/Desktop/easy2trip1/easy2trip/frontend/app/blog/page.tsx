"use client"

import { useState } from "react"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const blogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems in Southeast Asia You Must Visit",
    excerpt:
      "Discover lesser-known destinations in Southeast Asia that offer unique experiences and breathtaking views.",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c291dGhlYXN0JTIwYXNpYXxlbnwwfHwwfHx8MA%3D%3D",
    author: "Emma Traveller",
    date: "2023-05-15",
    category: "Destinations",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Ultimate Guide to Budget Travel in Europe",
    excerpt: "Learn how to explore Europe on a shoestring budget without compromising on experiences.",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXVyb3BlJTIwdHJhdmVsfGVufDB8fDB8fHww",
    author: "Alex Saver",
    date: "2023-06-02",
    category: "Travel Tips",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Eco-Friendly Travel: Sustainable Tourism Practices",
    excerpt:
      "Explore ways to minimize your environmental impact while traveling and support sustainable tourism initiatives.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWNvJTIwZnJpZW5kbHklMjB0cmF2ZWx8ZW58MHx8MHx8fDA%3D",
    author: "Olivia Green",
    date: "2023-06-20",
    category: "Sustainable Travel",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Culinary Adventures: A Food Lover's Guide to Japan",
    excerpt: "Embark on a gastronomic journey through Japan, exploring its diverse and delicious cuisine.",
    image:
      "https://images.unsplash.com/photo-1535090467336-9501f96eef89?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFwYW5lc2UlMjBmb29kfGVufDB8fDB8fHww",
    author: "Sophia Foodie",
    date: "2023-07-10",
    category: "Food & Culture",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "Adventure Travel: Thrilling Experiences Around the World",
    excerpt: "From bungee jumping to white-water rafting, discover adrenaline-pumping activities for thrill-seekers.",
    image:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWR2ZW50dXJlJTIwdHJhdmVsfGVufDB8fDB8fHww",
    author: "Max Adventure",
    date: "2023-07-28",
    category: "Adventure",
    readTime: "6 min read",
  },
  {
    id: 6,
    title: "Digital Nomad Life: Working While Traveling the World",
    excerpt: "Tips and insights on how to balance work and travel as a digital nomad in various destinations.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlnaXRhbCUyMG5vbWFkfGVufDB8fDB8fHww",
    author: "Liam Nomad",
    date: "2023-08-15",
    category: "Digital Nomad",
    readTime: "9 min read",
  },
  {
    id: 7,
    title: "Island Hopping in the Caribbean: A Tropical Paradise Guide",
    excerpt: "Plan the perfect Caribbean getaway with this comprehensive guide to the best islands and activities.",
    image:
      "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyaWJiZWFufGVufDB8fDB8fHww",
    author: "Isabella Sun",
    date: "2023-09-01",
    category: "Beach Destinations",
    readTime: "7 min read",
  },
  {
    id: 8,
    title: "Solo Female Travel: Empowering Adventures and Safety Tips",
    excerpt: "Inspiring stories and practical advice for women traveling solo around the world.",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29sbyUyMGZlbWFsZSUyMHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D",
    author: "Ava Brave",
    date: "2023-09-20",
    category: "Solo Travel",
    readTime: "8 min read",
  },
  {
    id: 9,
    title: "Photography Tips for Capturing Your Travel Memories",
    excerpt: "Learn how to take stunning photos that truly capture the essence of your travel experiences.",
    image:
      "https://images.unsplash.com/photo-1452796907770-ad6cd374b12d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhdmVsJTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
    author: "Noah Lens",
    date: "2023-10-05",
    category: "Travel Photography",
    readTime: "6 min read",
  },
  {
    id: 10,
    title: "Winter Wonderlands: Best Destinations for Snow and Ski Enthusiasts",
    excerpt: "Discover the top winter destinations for skiing, snowboarding, and enjoying magical snowy landscapes.",
    image:
      "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpJTIwcmVzb3J0fGVufDB8fDB8fHww",
    author: "Ethan Frost",
    date: "2023-10-25",
    category: "Winter Travel",
    readTime: "7 min read",
  },
  {
    id: 11,
    title: "Cultural Immersion: Homestays and Local Experiences",
    excerpt: "Discover the benefits of staying with local families and participating in authentic cultural activities.",
    image:
      "https://images.unsplash.com/photo-1523539693385-e5e891eb4465?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZXN0YXl8ZW58MHx8MHx8fDA%3D",
    author: "Maya Culture",
    date: "2023-11-10",
    category: "Cultural Travel",
    readTime: "6 min read",
  },
  {
    id: 12,
    title: "Road Trip Essentials: Planning the Perfect Driving Adventure",
    excerpt: "Tips and tricks for planning an unforgettable road trip, from route planning to must-have supplies.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9hZCUyMHRyaXB8ZW58MHx8MHx8fDA%3D",
    author: "Charlie Wheels",
    date: "2023-11-28",
    category: "Road Trips",
    readTime: "7 min read",
  },
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const router = useRouter()

  const filteredPosts = blogPosts.filter(
    (post) =>
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "All" || post.category === selectedCategory),
  )

  const categories = ["All", ...new Set(blogPosts.map((post) => post.category))]

  const handleReadMore = (postId) => {
    router.push(`/blog/${postId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-10">Travel Blog</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-1/3">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <Input
              id="search"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
            <Label htmlFor="category" className="sr-only">
              Category
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  {post.category} • {post.readTime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  By {post.author} on {new Date(post.date).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleReadMore(post.id)}
                  className="text-blue-600 hover:underline text-base font-semibold"
                >
                  Read More
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

