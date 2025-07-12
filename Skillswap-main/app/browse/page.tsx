"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import type { User } from "@/contexts/auth-context"
import UserProfileModal from "@/components/user-profile-modal"

export default function BrowsePage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (u) =>
          u.skillsOffered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (u.location && u.location.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users/browse")
      if (response.ok) {
        const userData = await response.json()
        setUsers(userData)
        setFilteredUsers(userData)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

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
              {user ? (
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="sm">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Skills</h1>
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by skill, name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((profileUser) => (
              <Card key={profileUser.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{profileUser.name}</CardTitle>
                      {profileUser.location && (
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {profileUser.location}
                        </CardDescription>
                      )}
                    </div>
                    {profileUser.rating && <Badge variant="secondary">⭐ {profileUser.rating.toFixed(1)}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Skills Offered</h4>
                    <div className="flex flex-wrap gap-1">
                      {profileUser.skillsOffered.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profileUser.skillsOffered.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profileUser.skillsOffered.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {profileUser.availability.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Availability
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {profileUser.availability.slice(0, 2).map((time, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                        {profileUser.availability.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{profileUser.availability.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button className="w-full" size="sm" onClick={() => setSelectedUser(profileUser)} disabled={!user}>
                    {user ? "View Profile" : "Login to Contact"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all available skills.</p>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal user={selectedUser} isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}
