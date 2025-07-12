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

export async function PUT(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { requestId, status } = await request.json()

    const requestIndex = swapRequests.findIndex((req) => req.id === requestId)

    if (requestIndex === -1) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const swapRequest = swapRequests[requestIndex]

    // Verify the user is the recipient of the request
    if (swapRequest.toUserId !== sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the request status
    swapRequests[requestIndex] = {
      ...swapRequest,
      status,
    }

    return NextResponse.json(swapRequests[requestIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
