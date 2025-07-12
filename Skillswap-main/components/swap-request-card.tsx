"use client"

import { useAuth } from "@/contexts/auth-context"
import { useSwap } from "@/contexts/swap-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SwapRequest } from "@/contexts/swap-context"
import { ArrowRight, Check, X, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SwapRequestCardProps {
  request: SwapRequest
}

export default function SwapRequestCard({ request }: SwapRequestCardProps) {
  const { user } = useAuth()
  const { respondToSwapRequest } = useSwap()
  const { toast } = useToast()

  const isIncoming = user?.id === request.toUserId
  const isOutgoing = user?.id === request.fromUserId

  const handleResponse = async (status: "accepted" | "rejected") => {
    const success = await respondToSwapRequest(request.id, status)
    if (success) {
      toast({
        title: status === "accepted" ? "Request accepted!" : "Request rejected",
        description:
          status === "accepted"
            ? `You've accepted the swap request from ${request.fromUserName}.`
            : `You've rejected the swap request from ${request.fromUserName}.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to respond to request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = () => {
    switch (request.status) {
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="default" className="bg-green-600">
            <Check className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {isIncoming ? `From ${request.fromUserName}` : `To ${request.toUserName}`}
            </CardTitle>
            <CardDescription>{new Date(request.createdAt).toLocaleDateString()}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary">{request.skillOffered}</Badge>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <Badge variant="outline">{request.skillWanted}</Badge>
        </div>

        {request.message && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">{request.message}</p>
          </div>
        )}

        {isIncoming && request.status === "pending" && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleResponse("accepted")} className="flex-1">
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleResponse("rejected")} className="flex-1">
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {isOutgoing && (
          <p className="text-sm text-gray-600">
            {request.status === "pending" && "Waiting for response..."}
            {request.status === "accepted" && "Your request was accepted! 🎉"}
            {request.status === "rejected" && "Request was declined."}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
