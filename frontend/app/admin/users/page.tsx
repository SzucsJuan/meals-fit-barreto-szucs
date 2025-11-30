"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  ArrowLeft,
  Mail,
  Key,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin" | string;
  created_at: string | null;
  joined_date: string | null;
  recipes_count: number;
  meals_logged_count: number;
  last_activity_at: string | null;
  last_activity_date: string | null;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";


function getXsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function ensureCsrf() {
  await fetch(`${API}sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [creating, setCreating] = useState(false);

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [passwordDialogUserEmail, setPasswordDialogUserEmail] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filterRole !== "all") params.set("role", filterRole);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());

        const res = await fetch(`${API}/api/admin/users?${params.toString()}`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Error al cargar usuarios (${res.status})`);
        }

        const data: UserRow[] = await res.json();
        setUsers(data);
      } catch (err: any) {
        console.error("Error fetching users", err);
        setError("No se pudieron cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filterRole, searchQuery]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge
            variant="secondary"
            className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
          >
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "user":
        return <Badge variant="outline">User</Badge>;
      default:
        return null;
    }
  };

  const handleEdit = (user: UserRow) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      await ensureCsrf();
      const token = getXsrfToken();

      const res = await fetch(`${API}/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error al actualizar usuario (${res.status})`);
      }

      const updated = await res.json();

      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
      );
      setIsEditDialogOpen(false);
      setEditingUser(null);

      setSuccessMessage("User updated successfully.");
      setIsSuccessDialogOpen(true);
    } catch (err) {
      console.error("Error updating user", err);
      alert("No se pudo actualizar el usuario");
    }
  };

  const openDeleteDialog = (user: UserRow) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await ensureCsrf();
      const token = getXsrfToken();

      const res = await fetch(`${API}/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": token,
        },
      });

      if (!res.ok && res.status !== 204) {
        throw new Error(`Error al eliminar usuario (${res.status})`);
      }

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Error deleting user", err);
      alert("No se pudo eliminar el usuario");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      alert("Name and email are required.");
      return;
    }

    try {
      setCreating(true);
      await ensureCsrf();
      const token = getXsrfToken();

      const res = await fetch(`${API}/api/admin/users`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          role: newRole,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error al crear usuario (${res.status})`);
      }

      const data = await res.json();

      try {
        const params = new URLSearchParams();
        if (filterRole !== "all") params.set("role", filterRole);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());

        const resList = await fetch(`${API}/api/admin/users?${params.toString()}`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (resList.ok) {
          const listData: UserRow[] = await resList.json();
          setUsers(listData);
        }
      } catch (err) {
        console.error("Error reloading users after create", err);
      }

      setGeneratedPassword(data.password || null);
      setPasswordDialogUserEmail(data.user?.email || newEmail);
      setIsPasswordDialogOpen(true);

      setNewName("");
      setNewEmail("");
      setNewRole("user");
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Error creating user", err);
      alert("No se pudo crear el usuario");
    } finally {
      setCreating(false);
    }
  };

  const handleCopyPassword = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setSuccessMessage("Password copied to clipboard.");
      setIsSuccessDialogOpen(true);
    } catch (err) {
      console.error("Error copying password", err);
    }
  };

  const filteredUsers = users;

  const totalUsers = users.length;
  const totalStandardUsers = users.filter((u) => u.role === "user").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="min-h-screen bg-background">
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
                <Users className="h-8 w-8" style={{ color: "#FF9800" }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">
                  Manage user accounts and permissions
                </p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                    <Input
                      id="user-name"
                      placeholder="Enter full name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="Enter email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select value={newRole} onValueChange={(v) => setNewRole(v)}>
                      <SelectTrigger id="user-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser} disabled={creating}>
                    {creating ? "Creating..." : "Create User"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Standard Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalStandardUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalAdmins}</div>
            </CardContent>
          </Card>
        </div>

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
            <Button
              variant={filterRole === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRole("all")}
            >
              All users
            </Button>
            <Button
              variant={filterRole === "user" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRole("user")}
            >
              User
            </Button>
            <Button
              variant={filterRole === "admin" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRole("admin")}
            >
              Admin
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pt-4">
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage all user accounts on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="mb-4 text-sm text-red-500">
                {error}
              </p>
            )}
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading users...</p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          {getRoleBadge(user.role)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span>Joined {user.joined_date ?? "-"}</span>
                          <span>•</span>
                          <span>{user.recipes_count} recipes</span>
                          <span>•</span>
                          <span>{user.meals_logged_count} meals logged</span>
                          <span>•</span>
                          <span>Last active {user.last_activity_date ?? "-"}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap lg:flex-col gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-600"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              New User Password
            </DialogTitle>
            <DialogDescription>
              Share this password with the user so they can log in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {passwordDialogUserEmail && (
              <p className="text-sm text-muted-foreground break-all">
                <span className="font-medium text-foreground">User:</span>{" "}
                {passwordDialogUserEmail}
              </p>
            )}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={generatedPassword ?? ""}
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyPassword}
                  disabled={!generatedPassword}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPasswordDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The user and their data may be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {userToDelete && (
              <p className="text-sm text-muted-foreground break-all">
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {userToDelete.name} ({userToDelete.email})
                </span>
                ?
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              className="text-rose-600"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Success
            </DialogTitle>
            <DialogDescription>{successMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
