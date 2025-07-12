import { type NextRequest, NextResponse } from "next/server"

// Mock swap requests database
const swapRequests = [
  {
    id: "1",
    fromUserId: "2",
    toUserId: "1",
    fromUserName: "Jane Smith",
    toUserName: "John Doe",
    skillOffered: "Python",
    skillWanted: "JavaScript",
    message: "Hi! I'd love to learn JavaScript from you in exchange for Python lessons.",
    status: "pending" as const,
    createdAt: "2024-01-20T10:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Return requests where user is either sender or receiver
    const userRequests = swapRequests.filter((req) => req.fromUserId === sessionId || req.toUserId === sessionId)

    return NextResponse.json(userRequests)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
