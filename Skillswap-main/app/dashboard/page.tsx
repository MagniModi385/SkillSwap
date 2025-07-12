"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSwap } from "@/contexts/swap-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, MessageSquare, Settings, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import SwapRequestCard from "@/components/swap-request-card"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { swapRequests, fetchSwapRequests } = useSwap()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchSwapRequests()
    }
  }, [user, fetchSwapRequests])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const pendingRequests = swapRequests.filter((req) => req.status === "pending")
  const acceptedRequests = swapRequests.filter((req) => req.status === "accepted")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Skill Swap</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/browse">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your skills and swap requests from your dashboard</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Skills and availability overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Skills Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.length > 0 ? (
                      user.skillsOffered.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills added yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Skills Wanted</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.length > 0 ? (
                      user.skillsWanted.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills added yet</p>
                    )}
                  </div>
                </div>

                <Link href="/profile">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Swap Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Swap Requests
                </CardTitle>
                <CardDescription>Manage your incoming and outgoing requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
                    <TabsTrigger value="accepted">Accepted ({acceptedRequests.length})</TabsTrigger>
                    <TabsTrigger value="all">All ({swapRequests.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending" className="space-y-4">
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((request) => <SwapRequestCard key={request.id} request={request} />)
                    ) : (
                      <p className="text-center text-gray-500 py-8">No pending requests</p>
                    )}
                  </TabsContent>

                  <TabsContent value="accepted" className="space-y-4">
                    {acceptedRequests.length > 0 ? (
                      acceptedRequests.map((request) => <SwapRequestCard key={request.id} request={request} />)
                    ) : (
                      <p className="text-center text-gray-500 py-8">No accepted requests</p>
                    )}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-4">
                    {swapRequests.length > 0 ? (
                      swapRequests.map((request) => <SwapRequestCard key={request.id} request={request} />)
                    ) : (
                      <p className="text-center text-gray-500 py-8">No swap requests yet</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
