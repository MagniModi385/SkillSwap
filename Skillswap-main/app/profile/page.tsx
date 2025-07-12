"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateProfile, logout, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    isPublic: true,
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    availability: [] as string[],
  })

  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")
  const [newAvailability, setNewAvailability] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      setFormData({
        name: user.name,
        location: user.location || "",
        isPublic: user.isPublic,
        skillsOffered: [...user.skillsOffered],
        skillsWanted: [...user.skillsWanted],
        availability: [...user.availability],
      })
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const success = await updateProfile(formData)
    if (success) {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
    setSaving(false)
  }

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()],
      }))
      setNewSkillOffered("")
    }
  }

  const removeSkillOffered = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((s) => s !== skill),
    }))
  }

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()],
      }))
      setNewSkillWanted("")
    }
  }

  const removeSkillWanted = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter((s) => s !== skill),
    }))
  }

  const addAvailability = () => {
    if (newAvailability.trim() && !formData.availability.includes(newAvailability.trim())) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, newAvailability.trim()],
      }))
      setNewAvailability("")
    }
  }

  const removeAvailability = (availability: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((a) => a !== availability),
    }))
  }

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
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Update your information and manage your skills</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal details and profile settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., New York, NY"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked as boolean }))}
                />
                <Label htmlFor="isPublic">Make my profile public (others can find and contact me)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Skills Offered */}
          <Card>
            <CardHeader>
              <CardTitle>Skills I Can Teach</CardTitle>
              <CardDescription>List the skills you can offer to others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  placeholder="e.g., Python, Photography, Guitar"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillOffered())}
                />
                <Button type="button" onClick={addSkillOffered}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skillsOffered.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => removeSkillOffered(skill)} className="ml-1 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Wanted */}
          <Card>
            <CardHeader>
              <CardTitle>Skills I Want to Learn</CardTitle>
              <CardDescription>List the skills you're interested in learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  placeholder="e.g., React, Design, Spanish"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillWanted())}
                />
                <Button type="button" onClick={addSkillWanted}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skillsWanted.map((skill, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => removeSkillWanted(skill)} className="ml-1 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>When are you available for skill exchanges?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newAvailability}
                  onChange={(e) => setNewAvailability(e.target.value)}
                  placeholder="e.g., Weekends, Evenings, Weekdays"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAvailability())}
                />
                <Button type="button" onClick={addAvailability}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.availability.map((time, index) => (
                  <Badge key={index} variant="default" className="flex items-center gap-1">
                    {time}
                    <button type="button" onClick={() => removeAvailability(time)} className="ml-1 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
