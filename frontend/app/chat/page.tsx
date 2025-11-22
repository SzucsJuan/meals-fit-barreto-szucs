"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Search, Users, Bot, Zap } from "lucide-react"
import Navigation from "@/components/navigation"

const conversations = [
  {
    id: 1,
    name: "Nutrition AI Assistant",
    type: "ai",
    lastMessage: "I can help you plan your meals for optimal nutrition!",
    time: "2 min ago",
    unread: 1,
    avatar: "🤖",
  },
  {
    id: 2,
    name: "Fitness Community",
    type: "group",
    lastMessage: "Sarah: Just finished my morning workout! 💪",
    time: "15 min ago",
    unread: 3,
    avatar: "💪",
  },
  {
    id: 3,
    name: "Recipe Exchange",
    type: "group",
    lastMessage: "Mike: Check out this amazing protein pancake recipe!",
    time: "1 hour ago",
    unread: 0,
    avatar: "🍳",
  },
  {
    id: 4,
    name: "Meal Prep Squad",
    type: "group",
    lastMessage: "Emma: Sunday meal prep session complete ✅",
    time: "3 hours ago",
    unread: 2,
    avatar: "🥗",
  },
]

const currentMessages = [
  {
    id: 1,
    sender: "ai",
    message: "Hello! I'm your nutrition AI assistant. How can I help you today?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "user",
    message: "I want to increase my protein intake. Can you suggest some high-protein recipes?",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "ai",
    message:
      "Great goal! Here are some excellent high-protein recipes I recommend:\n\n1. Greek Yogurt Protein Bowl (25g protein)\n2. Grilled Chicken with Quinoa (35g protein)\n3. Protein Smoothie with Berries (28g protein)\n\nWould you like detailed recipes for any of these?",
    time: "10:33 AM",
  },
  {
    id: 4,
    sender: "user",
    message: "Yes, I'd love the protein smoothie recipe!",
    time: "10:35 AM",
  },
  {
    id: 5,
    sender: "ai",
    message:
      "Perfect! Here's a delicious protein smoothie recipe:\n\n**Ingredients:**\n- 1 scoop vanilla protein powder\n- 1 cup Greek yogurt\n- 1/2 banana\n- 1/2 cup mixed berries\n- 1 tbsp almond butter\n- 1 cup almond milk\n\n**Instructions:**\n1. Add all ingredients to blender\n2. Blend until smooth\n3. Enjoy immediately!\n\n**Nutrition:** 28g protein, 320 calories\n\nWould you like me to add this to your recipe collection?",
    time: "10:36 AM",
  },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="h-8 w-8" style={{ color: "#FF9800" }} />
            <h1 className="text-2xl font-bold text-foreground">Chat & Support</h1>
          </div>
          <p className="text-muted-foreground">Get nutrition advice and connect with the community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Chat List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-l-2 ${
                      selectedChat.id === conversation.id ? "border-primary bg-muted/30" : "border-transparent"
                    }`}
                    onClick={() => setSelectedChat(conversation)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{conversation.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground truncate">{conversation.name}</h4>
                          {conversation.unread > 0 && (
                            <Badge
                              variant="default"
                              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                            >
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-muted-foreground">{conversation.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-3 flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{selectedChat.avatar}</div>
                <div>
                  <CardTitle className="text-lg">{selectedChat.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {selectedChat.type === "ai" && (
                      <>
                        <Bot className="h-4 w-4" />
                        AI Assistant
                      </>
                    )}
                    {selectedChat.type === "group" && (
                      <>
                        <Users className="h-4 w-4" />
                        Group Chat
                      </>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Nutrition Coach
              </CardTitle>
              <CardDescription>Get personalized nutrition advice</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start AI Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Join Community
              </CardTitle>
              <CardDescription>Connect with other health enthusiasts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Browse Groups
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-chart-3" />
                Quick Help
              </CardTitle>
              <CardDescription>Get instant answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                View FAQ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
