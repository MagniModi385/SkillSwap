"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSwap } from "@/contexts/swap-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Star, MessageSquare } from "lucide-react"
import type { User } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface UserProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export default function UserProfileModal({ user: profileUser, isOpen, onClose }: UserProfileModalProps) {
  const { user } = useAuth()
  const { sendSwapRequest } = useSwap()
  const { toast } = useToast()

  const [showSwapForm, setShowSwapForm] = useState(false)
  const [swapData, setSwapData] = useState({
    skillOffered: "",
    skillWanted: "",
    message: "",
  })
  const [sending, setSending] = useState(false)

  const handleSendSwapRequest = async () => {
    if (!user || !swapData.skillOffered || !swapData.skillWanted) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSending(true)

    const success = await sendSwapRequest({
      fromUserId: user.id,
      toUserId: profileUser.id,
      fromUserName: user.name,
      toUserName: profileUser.name,
      skillOffered: swapData.skillOffered,
      skillWanted: swapData.skillWanted,
      message: swapData.message,
    })

    if (success) {
      toast({
        title: "Swap request sent!",
        description: `Your request has been sent to ${profileUser.name}.`,
      })
      setShowSwapForm(false)
      setSwapData({ skillOffered: "", skillWanted: "", message: "" })
      onClose()
    } else {
      toast({
        title: "Error",
        description: "Failed to send swap request. Please try again.",
        variant: "destructive",
      })
    }

    setSending(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{profileUser.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-4">
            {profileUser.location && (
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {profileUser.location}
              </span>
            )}
            {profileUser.rating && (
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                {profileUser.rating.toFixed(1)} rating
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Skills Offered */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Skills They Can Teach</h3>
            <div className="flex flex-wrap gap-2">
              {profileUser.skillsOffered.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills Wanted */}
          {profileUser.skillsWanted.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Skills They Want to Learn</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.skillsWanted.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {profileUser.availability.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Availability
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.availability.map((time, index) => (
                  <Badge key={index} variant="default">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Swap Request Form */}
          {user && user.id !== profileUser.id && (
            <div className="border-t pt-6">
              {!showSwapForm ? (
                <Button onClick={() => setShowSwapForm(true)} className="w-full" size="lg">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Swap Request
                </Button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Send Swap Request</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="skillOffered">Skill You'll Teach</Label>
                      <Select
                        value={swapData.skillOffered}
                        onValueChange={(value) => setSwapData((prev) => ({ ...prev, skillOffered: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a skill you offer" />
                        </SelectTrigger>
                        <SelectContent>
                          {user.skillsOffered.map((skill, index) => (
                            <SelectItem key={index} value={skill}>
                              {skill}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skillWanted">Skill You Want to Learn</Label>
                      <Select
                        value={swapData.skillWanted}
                        onValueChange={(value) => setSwapData((prev) => ({ ...prev, skillWanted: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a skill they offer" />
                        </SelectTrigger>
                        <SelectContent>
                          {profileUser.skillsOffered.map((skill, index) => (
                            <SelectItem key={index} value={skill}>
                              {skill}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={swapData.message}
                      onChange={(e) => setSwapData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Introduce yourself and explain what you'd like to learn..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSendSwapRequest}
                      disabled={sending || !swapData.skillOffered || !swapData.skillWanted}
                      className="flex-1"
                    >
                      {sending ? "Sending..." : "Send Request"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowSwapForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
