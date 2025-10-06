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
import {
  FileText,
  Search,
  Upload,
  Download,
  Trash2,
  ArrowLeft,
  File,
  FileImage,
  FileVideo,
  FileArchive,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"

// Sample document data
const documents = [
  {
    id: 1,
    title: "Nutrition Guidelines 2024",
    description: "Comprehensive nutrition guidelines for healthy eating",
    type: "pdf",
    category: "guidelines",
    size: "2.4 MB",
    uploadedBy: "Admin User",
    uploadedDate: "2024-01-15",
    downloads: 342,
    status: "published",
  },
  {
    id: 2,
    title: "Meal Planning Template",
    description: "Weekly meal planning template for users",
    type: "pdf",
    category: "templates",
    size: "1.1 MB",
    uploadedBy: "Emma Davis",
    uploadedDate: "2024-01-18",
    downloads: 567,
    status: "published",
  },
  {
    id: 3,
    title: "Fitness Exercise Guide",
    description: "Complete guide to fitness exercises with illustrations",
    type: "pdf",
    category: "guides",
    size: "5.8 MB",
    uploadedBy: "Admin User",
    uploadedDate: "2024-01-20",
    downloads: 234,
    status: "published",
  },
  {
    id: 4,
    title: "Macro Calculator Spreadsheet",
    description: "Excel spreadsheet for calculating macronutrients",
    type: "xlsx",
    category: "tools",
    size: "0.3 MB",
    uploadedBy: "Sarah Johnson",
    uploadedDate: "2024-01-21",
    downloads: 189,
    status: "published",
  },
  {
    id: 5,
    title: "Community Guidelines Draft",
    description: "Draft version of updated community guidelines",
    type: "pdf",
    category: "guidelines",
    size: "0.8 MB",
    uploadedBy: "Admin User",
    uploadedDate: "2024-01-22",
    downloads: 12,
    status: "draft",
  },
  {
    id: 6,
    title: "Recipe Video Tutorial",
    description: "Video tutorial on creating healthy recipes",
    type: "mp4",
    category: "tutorials",
    size: "45.2 MB",
    uploadedBy: "Mike Chen",
    uploadedDate: "2024-01-19",
    downloads: 423,
    status: "published",
  },
]

export default function AdminContentPage() {
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = filterCategory === "all" || doc.category === filterCategory
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <File className="h-5 w-5 text-rose-600" />
      case "xlsx":
      case "xls":
        return <File className="h-5 w-5 text-green-600" />
      case "mp4":
      case "mov":
        return <FileVideo className="h-5 w-5 text-purple-600" />
      case "jpg":
      case "png":
        return <FileImage className="h-5 w-5 text-blue-600" />
      case "zip":
        return <FileArchive className="h-5 w-5 text-slate-600" />
      default:
        return <FileText className="h-5 w-5 text-slate-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Published
          </Badge>
        )
      case "draft":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        )
      default:
        return null
    }
  }

  const handleDelete = (docId: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      console.log("[v0] Deleting document:", docId)
    }
  }

  const handleDownload = (docId: number) => {
    console.log("[v0] Downloading document:", docId)
  }

  const handleUpload = () => {
    console.log("[v0] Uploading document")
    setIsUploadDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-slate-50 to-rose-50 dark:from-slate-950/20 dark:to-rose-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <FileText className="h-8 w-8 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
                <p className="text-muted-foreground">Upload and manage community documents</p>
              </div>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>Add a new document for the community</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="doc-title">Document Title</Label>
                    <Input id="doc-title" placeholder="Enter document title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-description">Description</Label>
                    <Textarea id="doc-description" placeholder="Enter document description" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-category">Category</Label>
                    <Select>
                      <SelectTrigger id="doc-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guidelines">Guidelines</SelectItem>
                        <SelectItem value="templates">Templates</SelectItem>
                        <SelectItem value="guides">Guides</SelectItem>
                        <SelectItem value="tools">Tools</SelectItem>
                        <SelectItem value="tutorials">Tutorials</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-status">Status</Label>
                    <Select defaultValue="published">
                      <SelectTrigger id="doc-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-file">File</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, XLSX, MP4, or ZIP (max 50MB)</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload}>Upload</Button>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{documents.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {documents.filter((d) => d.status === "published").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {documents.reduce((sum, doc) => sum + doc.downloads, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {documents.filter((d) => d.status === "draft").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <Button
                variant={filterCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("all")}
              >
                All Categories
              </Button>
              <Button
                variant={filterCategory === "guidelines" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("guidelines")}
              >
                Guidelines
              </Button>
              <Button
                variant={filterCategory === "templates" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("templates")}
              >
                Templates
              </Button>
              <Button
                variant={filterCategory === "guides" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("guides")}
              >
                Guides
              </Button>
              <Button
                variant={filterCategory === "tools" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("tools")}
              >
                Tools
              </Button>
              <Button
                variant={filterCategory === "tutorials" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("tutorials")}
              >
                Tutorials
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All Status
              </Button>
              <Button
                variant={filterStatus === "published" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("published")}
              >
                Published
              </Button>
              <Button
                variant={filterStatus === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("draft")}
              >
                Draft
              </Button>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="p-2 bg-muted rounded-lg">{getFileIcon(doc.type)}</div>
                  {getStatusBadge(doc.status)}
                </div>
                <CardTitle className="text-lg">{doc.title}</CardTitle>
                <CardDescription className="text-sm">{doc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Category</span>
                    <Badge variant="outline" className="capitalize">
                      {doc.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Size</span>
                    <span className="font-medium">{doc.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Downloads</span>
                    <span className="font-medium">{doc.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uploaded by</span>
                    <span className="font-medium">{doc.uploadedBy}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Date</span>
                    <span className="font-medium">{doc.uploadedDate}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleDownload(doc.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search or filters, or upload a new document.
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
