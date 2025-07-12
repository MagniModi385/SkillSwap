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

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const requestData = await request.json()

    // Verify the request is from the authenticated user
    if (requestData.fromUserId !== sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const newRequest = {
      id: (swapRequests.length + 1).toString(),
      ...requestData,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    }

    swapRequests.push(newRequest)

    return NextResponse.json(newRequest)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
