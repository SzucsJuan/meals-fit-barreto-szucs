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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChefHat, Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Sample recipe data with admin fields
const recipes = [
  {
    id: 1,
    name: "Protein Smoothie Bowl",
    description: "High protein breakfast bowl with berries and granola",
    author: "Sarah Johnson",
    authorEmail: "sarah.j@example.com",
    status: "approved",
    category: "Breakfast",
    calories: 320,
    protein: 25,
    carbs: 15,
    fats: 12,
    createdAt: "2024-01-15",
    views: 1247,
    favorites: 89,
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    description: "Fresh mixed greens with grilled chicken and avocado",
    author: "Mike Chen",
    authorEmail: "mike.c@example.com",
    status: "approved",
    category: "Lunch",
    calories: 450,
    protein: 35,
    carbs: 12,
    fats: 28,
    createdAt: "2024-01-18",
    views: 892,
    favorites: 67,
  },
  {
    id: 3,
    name: "Vegan Protein Bowl",
    description: "Plant-based protein bowl with quinoa and chickpeas",
    author: "Emma Davis",
    authorEmail: "emma.d@example.com",
    status: "pending",
    category: "Dinner",
    calories: 480,
    protein: 22,
    carbs: 58,
    fats: 18,
    createdAt: "2024-01-20",
    views: 0,
    favorites: 0,
  },
  {
    id: 4,
    name: "Quick Energy Bites",
    description: "No-bake energy balls with dates and nuts",
    author: "John Smith",
    authorEmail: "john.s@example.com",
    status: "pending",
    category: "Snack",
    calories: 180,
    protein: 6,
    carbs: 22,
    fats: 9,
    createdAt: "2024-01-21",
    views: 0,
    favorites: 0,
  },
  {
    id: 5,
    name: "Spicy Ramen Bowl",
    description: "Instant ramen with questionable ingredients",
    author: "Anonymous User",
    authorEmail: "anon@example.com",
    status: "flagged",
    category: "Dinner",
    calories: 850,
    protein: 12,
    carbs: 120,
    fats: 35,
    createdAt: "2024-01-22",
    views: 45,
    favorites: 2,
  },
]

export default function AdminRecipesPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingRecipe, setEditingRecipe] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesStatus = filterStatus === "all" || recipe.status === filterStatus
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "flagged":
        return (
          <Badge variant="secondary" className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
            <XCircle className="h-3 w-3 mr-1" />
            Flagged
          </Badge>
        )
      default:
        return null
    }
  }

  const handleEdit = (recipe: any) => {
    setEditingRecipe(recipe)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    // Save logic would go here
    console.log("[v0] Saving recipe:", editingRecipe)
    setIsEditDialogOpen(false)
    setEditingRecipe(null)
  }

  const handleDelete = (recipeId: number) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      console.log("[v0] Deleting recipe:", recipeId)
      // Delete logic would go here
    }
  }

  const handleApprove = (recipeId: number) => {
    console.log("[v0] Approving recipe:", recipeId)
    // Approve logic would go here
  }

  const handleReject = (recipeId: number) => {
    console.log("[v0] Rejecting recipe:", recipeId)
    // Reject logic would go here
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="p-2">
                <ChefHat className="h-8 w-8" style={{ color: "#FF9800" }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Recipe Management</h1>
                <p className="text-muted-foreground">Moderate and manage all recipes</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Recipe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Recipe</DialogTitle>
                  <DialogDescription>Create a new recipe for the platform</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipe-name">Recipe Name</Label>
                    <Input id="recipe-name" placeholder="Enter recipe name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipe-description">Description</Label>
                    <Textarea id="recipe-description" placeholder="Enter recipe description" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipe-category">Category</Label>
                      <Select>
                        <SelectTrigger id="recipe-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipe-status">Status</Label>
                      <Select defaultValue="approved">
                        <SelectTrigger id="recipe-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipe-calories">Calories</Label>
                      <Input id="recipe-calories" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipe-protein">Protein (g)</Label>
                      <Input id="recipe-protein" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipe-carbs">Carbs (g)</Label>
                      <Input id="recipe-carbs" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipe-fats">Fats (g)</Label>
                      <Input id="recipe-fats" type="number" placeholder="0" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Recipe</Button>
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
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{recipes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {recipes.filter((r) => r.status === "approved").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {recipes.filter((r) => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Flagged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                {recipes.filter((r) => r.status === "flagged").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes or authors..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("approved")}
            >
              Approved
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "flagged" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("flagged")}
            >
              Flagged
            </Button>
          </div>
        </div>

        {/* Recipes Table */}
        <Card>
          <CardHeader className="pt-4">
            <CardTitle>Recipes ({filteredRecipes.length})</CardTitle>
            <CardDescription>Manage all recipes on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="border border-border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{recipe.name}</h3>
                        {getStatusBadge(recipe.status)}
                        <Badge variant="outline">{recipe.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{recipe.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span>By {recipe.author}</span>
                        <span>•</span>
                        <span>{recipe.calories} cal</span>
                        <span>•</span>
                        <span>{recipe.protein}g protein</span>
                        <span>•</span>
                        <span>{recipe.views} views</span>
                        <span>•</span>
                        <span>{recipe.favorites} favorites</span>
                        <span>•</span>
                        <span>Created {recipe.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap lg:flex-col gap-2">
                      {recipe.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleApprove(recipe.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-rose-600 bg-transparent"
                            onClick={() => handleReject(recipe.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(recipe)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Link href={`/recipes/${recipe.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-600"
                        onClick={() => handleDelete(recipe.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogDescription>Update recipe details</DialogDescription>
          </DialogHeader>
          {editingRecipe && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Recipe Name</Label>
                <Input
                  id="edit-name"
                  value={editingRecipe.name}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingRecipe.description}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingRecipe.category.toLowerCase()}
                    onValueChange={(value) => setEditingRecipe({ ...editingRecipe, category: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingRecipe.status}
                    onValueChange={(value) => setEditingRecipe({ ...editingRecipe, status: value })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-calories">Calories</Label>
                  <Input
                    id="edit-calories"
                    type="number"
                    value={editingRecipe.calories}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, calories: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-protein">Protein (g)</Label>
                  <Input
                    id="edit-protein"
                    type="number"
                    value={editingRecipe.protein}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, protein: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-carbs">Carbs (g)</Label>
                  <Input
                    id="edit-carbs"
                    type="number"
                    value={editingRecipe.carbs}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, carbs: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-fats">Fats (g)</Label>
                  <Input
                    id="edit-fats"
                    type="number"
                    value={editingRecipe.fats}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, fats: Number.parseInt(e.target.value) })}
                  />
                </div>
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
