import { type NextRequest, NextResponse } from "next/server"

// Mock user database (in real app, this would be a proper database)
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

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Check if user already exists
    const existingUser = users.find((u) => u.email === userData.email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email: userData.email,
      password: userData.password, // In real app, hash this
      name: userData.name,
      location: userData.location || "",
      skillsOffered: userData.skillsOffered || [],
      skillsWanted: userData.skillsWanted || [],
      availability: userData.availability || [],
      isPublic: userData.isPublic !== false,
      joinedAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    const response = NextResponse.json(userWithoutPassword)

    // Set session cookie
    response.cookies.set("session", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
