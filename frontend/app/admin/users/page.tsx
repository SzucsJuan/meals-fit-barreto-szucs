"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Search, Plus, Edit, Trash2, Shield, Ban, CheckCircle, AlertTriangle, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

// Sample user data
const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "user",
    status: "active",
    joinedDate: "2024-01-10",
    recipesCreated: 12,
    mealsLogged: 245,
    lastActive: "2024-01-22",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.c@example.com",
    role: "user",
    status: "active",
    joinedDate: "2024-01-12",
    recipesCreated: 8,
    mealsLogged: 189,
    lastActive: "2024-01-21",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.d@example.com",
    role: "moderator",
    status: "active",
    joinedDate: "2023-12-05",
    recipesCreated: 34,
    mealsLogged: 567,
    lastActive: "2024-01-22",
  },
  {
    id: 4,
    name: "John Smith",
    email: "john.s@example.com",
    role: "user",
    status: "suspended",
    joinedDate: "2024-01-15",
    recipesCreated: 2,
    mealsLogged: 23,
    lastActive: "2024-01-18",
  },
  {
    id: 5,
    name: "Anonymous User",
    email: "anon@example.com",
    role: "user",
    status: "flagged",
    joinedDate: "2024-01-20",
    recipesCreated: 1,
    mealsLogged: 5,
    lastActive: "2024-01-22",
  },
  {
    id: 6,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    joinedDate: "2023-11-01",
    recipesCreated: 45,
    mealsLogged: 892,
    lastActive: "2024-01-22",
  },
]

export default function AdminUsersPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesRole && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <Ban className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        )
      case "flagged":
        return (
          <Badge variant="secondary" className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Flagged
          </Badge>
        )
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="secondary" className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        )
      case "moderator":
        return (
          <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
            <Shield className="h-3 w-3 mr-1" />
            Moderator
          </Badge>
        )
      case "user":
        return <Badge variant="outline">User</Badge>
      default:
        return null
    }
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    console.log("[v0] Saving user:", editingUser)
    setIsEditDialogOpen(false)
    setEditingUser(null)
  }

  const handleDelete = (userId: number) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      console.log("[v0] Deleting user:", userId)
    }
  }

  const handleSuspend = (userId: number) => {
    console.log("[v0] Suspending user:", userId)
  }

  const handleActivate = (userId: number) => {
    console.log("[v0] Activating user:", userId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <Users className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">Manage user accounts and permissions</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input id="user-name" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select defaultValue="user">
                      <SelectTrigger id="user-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-status">Status</Label>
                    <Select defaultValue="active">
                      <SelectTrigger id="user-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-600">
                {users.filter((u) => u.status === "suspended").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Flagged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                {users.filter((u) => u.status === "flagged").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All Status
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "suspended" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("suspended")}
              >
                Suspended
              </Button>
              <Button
                variant={filterStatus === "flagged" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("flagged")}
              >
                Flagged
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRole === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole("all")}
              >
                All Roles
              </Button>
              <Button
                variant={filterRole === "admin" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole("admin")}
              >
                Admin
              </Button>
              <Button
                variant={filterRole === "moderator" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole("moderator")}
              >
                Moderator
              </Button>
              <Button
                variant={filterRole === "user" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole("user")}
              >
                User
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage all user accounts on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border border-border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span>Joined {user.joinedDate}</span>
                        <span>•</span>
                        <span>{user.recipesCreated} recipes</span>
                        <span>•</span>
                        <span>{user.mealsLogged} meals logged</span>
                        <span>•</span>
                        <span>Last active {user.lastActive}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap lg:flex-col gap-2">
                      {user.status === "suspended" ? (
                        <Button size="sm" variant="outline" onClick={() => handleActivate(user.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-slate-600 bg-transparent"
                          onClick={() => handleSuspend(user.id)}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user account details</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingUser.status}
                  onValueChange={(value) => setEditingUser({ ...editingUser, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

