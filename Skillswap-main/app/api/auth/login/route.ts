import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    email: "john@example.com",
    password: "password123", // In real app, this would be hashed
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
    const { email, password } = await request.json()

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json(userWithoutPassword)

    // Set a simple session cookie (in production, use proper JWT)
    response.cookies.set("session", user.id, {
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
