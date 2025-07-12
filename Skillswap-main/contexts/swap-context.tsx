"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface SwapRequest {
  id: string
  fromUserId: string
  toUserId: string
  fromUserName: string
  toUserName: string
  skillOffered: string
  skillWanted: string
  message: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

interface SwapContextType {
  swapRequests: SwapRequest[]
  sendSwapRequest: (request: Omit<SwapRequest, "id" | "createdAt" | "status">) => Promise<boolean>
  respondToSwapRequest: (requestId: string, status: "accepted" | "rejected") => Promise<boolean>
  fetchSwapRequests: () => Promise<void>
}

const SwapContext = createContext<SwapContextType | null>(null)

export function useSwap() {
  const context = useContext(SwapContext)
  if (!context) {
    throw new Error("useSwap must be used within a SwapProvider")
  }
  return context
}

export function SwapProvider({ children }: { children: ReactNode }) {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])

  const sendSwapRequest = async (request: Omit<SwapRequest, "id" | "createdAt" | "status">): Promise<boolean> => {
    try {
      const response = await fetch("/api/swaps/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (response.ok) {
        await fetchSwapRequests()
        return true
      }
      return false
    } catch (error) {
      console.error("Send swap request failed:", error)
      return false
    }
  }

  const respondToSwapRequest = async (requestId: string, status: "accepted" | "rejected"): Promise<boolean> => {
    try {
      const response = await fetch("/api/swaps/respond", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      })

      if (response.ok) {
        await fetchSwapRequests()
        return true
      }
      return false
    } catch (error) {
      console.error("Respond to swap request failed:", error)
      return false
    }
  }

  const fetchSwapRequests = async () => {
    try {
      const response = await fetch("/api/swaps")
      if (response.ok) {
        const requests = await response.json()
        setSwapRequests(requests)
      }
    } catch (error) {
      console.error("Fetch swap requests failed:", error)
    }
  }

  return (
    <SwapContext.Provider value={{ swapRequests, sendSwapRequest, respondToSwapRequest, fetchSwapRequests }}>
      {children}
    </SwapContext.Provider>
  )
}
