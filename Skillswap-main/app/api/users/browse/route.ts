import { NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    location: "New York, NY",
    skillsOffered: ["JavaScript", "React", "Node.js"],
    skillsWanted: ["Python", "Machine Learning"],
    availability: ["Weekends", "Evenings"],
    isPublic: true,
    rating: 4.8,
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    location: "San Francisco, CA",
    skillsOffered: ["Python", "Data Science", "Machine Learning"],
    skillsWanted: ["React", "UI/UX Design"],
    availability: ["Weekdays", "Mornings"],
    isPublic: true,
    rating: 4.9,
    joinedAt: "2024-02-01",
  },
  {
    id: "3",
    email: "mike@example.com",
    name: "Mike Johnson",
    location: "Austin, TX",
    skillsOffered: ["UI/UX Design", "Figma", "Photoshop"],
    skillsWanted: ["JavaScript", "Web Development"],
    availability: ["Evenings", "Weekends"],
    isPublic: true,
    rating: 4.7,
    joinedAt: "2024-01-20",
  },
  {
    id: "4",
    email: "sarah@example.com",
    name: "Sarah Wilson",
    location: "Seattle, WA",
    skillsOffered: ["Photography", "Video Editing", "Adobe Creative Suite"],
    skillsWanted: ["Marketing", "Social Media"],
    availability: ["Weekends"],
    isPublic: true,
    rating: 4.6,
    joinedAt: "2024-02-10",
  },
  {
    id: "5",
    email: "alex@example.com",
    name: "Alex Chen",
    location: "Los Angeles, CA",
    skillsOffered: ["Guitar", "Music Production", "Logic Pro"],
    skillsWanted: ["Photography", "Video Editing"],
    availability: ["Evenings", "Weekdays"],
    isPublic: true,
    rating: 4.9,
    joinedAt: "2024-01-25",
  },
]

export async function GET() {
  try {
    // Return only public profiles, excluding sensitive information
    const publicUsers = users.filter((user) => user.isPublic).map(({ email, ...user }) => user) // Remove email from public data

    return NextResponse.json(publicUsers)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
