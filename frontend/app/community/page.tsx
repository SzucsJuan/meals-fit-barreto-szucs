"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageCircle, Heart, Share2, TrendingUp, Plus } from "lucide-react"
import Navigation from "@/components/navigation"

// Sample community data
const posts = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "SJ",
    time: "2 hours ago",
    content:
      "Just hit my protein goal for 30 days straight! 💪 The Greek yogurt parfait recipe from the app has been a game changer. Who else is crushing their nutrition goals this month?",
    image: "/greek-yogurt-parfait-with-berries-and-nuts.png",
    likes: 24,
    comments: 8,
    shares: 3,
    tags: ["protein", "goals", "success"],
  },
  {
    id: 2,
    author: "Mike Chen",
    avatar: "MC",
    time: "4 hours ago",
    content:
      "Meal prep Sunday complete! 🥗 Prepared 5 days worth of the quinoa power bowls. The prep time was only 2 hours and I'm set for the week. Drop your favorite meal prep recipes below!",
    image: "/quinoa-power-bowl-with-roasted-vegetables.png",
    likes: 31,
    comments: 12,
    shares: 7,
    tags: ["mealprep", "quinoa", "efficiency"],
  },
  {
    id: 3,
    author: "Emma Rodriguez",
    avatar: "ER",
    time: "6 hours ago",
    content:
      "Question for the community: What's your go-to post-workout snack? I've been having the protein smoothie bowl but looking for more variety. Thanks in advance! 🙏",
    likes: 18,
    comments: 15,
    shares: 2,
    tags: ["question", "postworkout", "snacks"],
  },
  {
    id: 4,
    author: "David Kim",
    avatar: "DK",
    time: "8 hours ago",
    content:
      "Before and after: 3 months of consistent nutrition tracking with NutriTrack! Down 15 lbs and feeling amazing. The calendar feature really helped me stay accountable. Thank you to this amazing community for the support! 🎉",
    likes: 67,
    comments: 23,
    shares: 12,
    tags: ["transformation", "success", "accountability"],
  },
]

const groups = [
  { name: "Meal Prep Masters", members: 2847, description: "Share meal prep tips and recipes", category: "Meal Prep" },
  { name: "Plant-Based Power", members: 1923, description: "Vegetarian and vegan nutrition", category: "Diet" },
  { name: "Fitness Foodies", members: 3156, description: "Nutrition for active lifestyles", category: "Fitness" },
  { name: "Macro Tracking", members: 1567, description: "Master your macronutrients", category: "Tracking" },
  { name: "Recipe Creators", members: 2234, description: "Share and discover new recipes", category: "Recipes" },
]

const challenges = [
  { name: "30-Day Protein Challenge", participants: 456, daysLeft: 12, description: "Hit your protein goal every day" },
  { name: "Hydration Hero", participants: 789, daysLeft: 8, description: "Drink 8 glasses of water daily" },
  { name: "Veggie Victory", participants: 234, daysLeft: 18, description: "Eat 5 servings of vegetables daily" },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "groups" | "challenges">("feed")

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Community</h1>
          </div>
          <p className="text-muted-foreground">Connect, share, and get inspired by fellow nutrition enthusiasts</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant={activeTab === "feed" ? "default" : "outline"} onClick={() => setActiveTab("feed")}>
            Feed
          </Button>
          <Button variant={activeTab === "groups" ? "default" : "outline"} onClick={() => setActiveTab("groups")}>
            Groups
          </Button>
          <Button
            variant={activeTab === "challenges" ? "default" : "outline"}
            onClick={() => setActiveTab("challenges")}
          >
            Challenges
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "feed" && (
              <div className="space-y-6">
                {/* Create Post */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback>YU</AvatarFallback>
                      </Avatar>
                      <Input placeholder="Share your nutrition journey..." className="flex-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          📷 Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          📊 Progress
                        </Button>
                      </div>
                      <Button size="sm">Post</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts */}
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{post.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{post.author}</h4>
                          <p className="text-sm text-muted-foreground">{post.time}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-4">{post.content}</p>
                      {post.image && (
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt="Post image"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            {post.shares}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "groups" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Popular Groups</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groups.map((group, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <Badge variant="outline">{group.category}</Badge>
                        </div>
                        <CardDescription>{group.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {group.members.toLocaleString()} members
                          </div>
                          <Button size="sm">Join Group</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "challenges" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Active Challenges</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>
                <div className="space-y-4">
                  {challenges.map((challenge, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{challenge.name}</CardTitle>
                          <Badge variant="outline">{challenge.daysLeft} days left</Badge>
                        </div>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            {challenge.participants} participants
                          </div>
                          <Button size="sm">Join Challenge</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Members</span>
                  <span className="font-medium">15,892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Posts Today</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Groups</span>
                  <span className="font-medium">48</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Challenges</span>
                  <span className="font-medium">12</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">#mealprep</span>
                  <span className="text-xs text-muted-foreground">234 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">#protein</span>
                  <span className="text-xs text-muted-foreground">189 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">#transformation</span>
                  <span className="text-xs text-muted-foreground">156 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">#plantbased</span>
                  <span className="text-xs text-muted-foreground">143 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">#macros</span>
                  <span className="text-xs text-muted-foreground">128 posts</span>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Groups */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested for You</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Keto Community</div>
                    <div className="text-xs text-muted-foreground">1,234 members</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Join
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Intermittent Fasting</div>
                    <div className="text-xs text-muted-foreground">2,567 members</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Join
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Weight Loss Support</div>
                    <div className="text-xs text-muted-foreground">3,891 members</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
