import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    email: "john@example.com",
    password: "password123",
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
    password: "password123",
    name: "Jane Smith",
    location: "San Francisco, CA",
    skillsOffered: ["Python", "Data Science", "Machine Learning"],
    skillsWanted: ["React", "UI/UX Design"],
    availability: ["Weekdays", "Mornings"],
    isPublic: true,
    rating: 4.9,
    joinedAt: "2024-02-01",
  },
]

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = users.find((u) => u.id === sessionId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
