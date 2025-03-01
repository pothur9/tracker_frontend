"use client"

import { useParams } from "next/navigation"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems in Southeast Asia You Must Visit",
    content:
      "Southeast Asia is a treasure trove of hidden gems waiting to be discovered. From the serene beaches of El Nido in the Philippines to the ancient temples of Bagan in Myanmar, this region offers a plethora of unique experiences. Don't miss the chance to explore the underground river in Palawan, trek through the lush jungles of Borneo, or witness the stunning limestone karsts of Halong Bay. For culture enthusiasts, the ancient city of Hoi An in Vietnam and the temple-studded plains of Bagan in Myanmar offer unforgettable experiences. Nature lovers should head to the Kuang Si Falls in Laos or the Tegalalang Rice Terraces in Bali. For a truly off-the-beaten-path adventure, consider visiting the remote Banda Islands in Indonesia or the tranquil 4000 Islands in Laos. These hidden gems offer a perfect blend of natural beauty, rich culture, and authentic experiences away from the crowds.",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c291dGhlYXN0JTIwYXNpYXxlbnwwfHwwfHx8MA%3D%3D",
    author: "Emma Traveller",
    date: "2023-05-15",
    category: "Destinations",
    readTime: "5 min read",
  },
  // ... (include all other blog posts here)
]

export default function BlogPost() {
  const params = useParams()
  const post = blogPosts.find((post) => post.id === Number(params.id))

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <Button asChild className="mb-6">
          <Link href="/blog">← Back to Blog</Link>
        </Button>
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-500 mb-4">
              <span>{post.category}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
              <span className="mx-2">•</span>
              <span>
                By {post.author} on {new Date(post.date).toLocaleDateString()}
              </span>
            </div>
            <div className="prose max-w-none">
              <p>{post.content}</p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

