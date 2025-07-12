import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, MessageSquare, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Skill Swap</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Exchange Skills, <span className="text-indigo-600">Build Community</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with others to learn new skills and share your expertise. Our platform makes skill bartering simple,
            intuitive, and community-driven.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Browse Skills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Skill Swap Works</h2>
            <p className="text-lg text-gray-600">Simple steps to start exchanging skills with your community</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Create Profile</CardTitle>
                <CardDescription>List your skills and what you want to learn</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Find Matches</CardTitle>
                <CardDescription>Search for people with skills you need</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Send Requests</CardTitle>
                <CardDescription>Propose skill swaps with other users</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Learn & Teach</CardTitle>
                <CardDescription>Exchange knowledge and build your network</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join our community of learners and teachers today</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Join Skill Swap
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Users className="h-6 w-6 text-indigo-400" />
            <span className="ml-2 text-lg font-semibold">Skill Swap Platform</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            Built by Team while(!perfect) - Kartik, Priyanshu, Chinmay, Kasak
          </p>
        </div>
      </footer>
    </div>
  )
}
