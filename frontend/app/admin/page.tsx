"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  ChefHat,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  EggFried,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import RequireAuth from "@/components/RequireAuth";

type WeeklyPoint = {
  name: string;
  users: number;
  recipes: number;
  meals: number;
};

type CategoryPoint = {
  name: string;
  value: number;
};

type RecentActivityItem = {
  type: string;               
  title: string;
  description: string;
  created_at: string;
  created_at_formatted: string;
  created_at_human: string;
};

type AdminStats = {
  total_users: number;
  total_recipes: number;
  total_meals_logged: number;
  weekly_activity: WeeklyPoint[];
  recipe_category_distribution: CategoryPoint[];
  recent_activity: RecentActivityItem[];
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const CATEGORY_COLORS = ["#FFD54F", "#FF9800", "#388E3C", "#A5D6A7"];

export default function AdminPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminDashboardContent />
    </RequireAuth>
  );
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        setError(null);

        const res = await fetch(`${API}/api/admin/stats`, {
          method: "GET",
          credentials: "include", 
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Error al cargar estadísticas (${res.status})`);
        }

        const data: AdminStats = await res.json();
        setStats(data);
      } catch (err: any) {
        console.error("Error fetching admin stats", err);
        setError("No se pudieron cargar las estadísticas");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <Shield className="h-8 w-8" style={{ color: "#FF9800" }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your nutrition and fitness platform</p>
              </div>
            </div>
            <Badge variant="secondary" style={{ color: "#4caf50" }}>
              Administrator
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loadingStats ? "..." : stats?.total_users ?? 0}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              </div>
              {error && (
                <p className="mt-1 text-xs text-red-500">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Total Recipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loadingStats ? "..." : stats?.total_recipes ?? 0}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Meals Logged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loadingStats ? "..." : stats?.total_meals_logged ?? 0}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2">
                    <Users className="h-5 w-5" style={{ color: "#FF9800" }} />
                  </div>
                  <div>
                    <CardTitle className="text-base">User Management</CardTitle>
                    <CardDescription className="text-xs">Manage user accounts</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/recipes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2">
                    <ChefHat className="h-5 w-5" style={{ color: "#FF9800" }} />
                  </div>
                  <div>
                    <CardTitle className="text-base">Recipe Management</CardTitle>
                    <CardDescription className="text-xs">Moderate recipes</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/home">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2">
                    <EggFried className="h-5 w-5" style={{ color: "#FF9800" }} />
                  </div>
                  <div>
                    <CardTitle className="text-base">Back to App</CardTitle>
                    <CardDescription className="text-xs">Back to the app</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pt-4">
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>User registrations, recipes & meals (last 7 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.weekly_activity ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#4CAF50" name="New Users" />
                    <Bar dataKey="recipes" fill="#FF9800" name="New Recipes" />
                    <Bar dataKey="meals" fill="#2196F3" name="Meals Logged" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pt-4">
              <CardTitle>Recipe Category Distribution</CardTitle>
              <CardDescription>Breakdown of recipes by meal type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.recipe_category_distribution ?? []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(stats?.recipe_category_distribution ?? []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {(stats?.recipe_category_distribution ?? []).map((category, index) => (
                  <div key={category.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {category.name} ({category.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 gap-6">
          {/* Recent Activity Card */}
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(!stats || !stats.recent_activity || stats.recent_activity.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No recent activity to display.
                  </p>
                )}

                {stats?.recent_activity?.map((item, idx) => {
                  let Icon = CheckCircle;
                  let iconClass = "text-green-600";

                  if (item.type === "user") {
                    Icon = Users;
                    iconClass = "text-blue-600";
                  } else if (item.type === "recipe") {
                    Icon = ChefHat;
                    iconClass = "text-green-600";
                  } else if (item.type === "meal") {
                    Icon = Activity;
                    iconClass = "text-emerald-600";
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 pb-3 ${
                        idx !== (stats.recent_activity.length - 1) ? "border-b border-border" : ""
                      }`}
                    >
                      <Icon className={`h-5 w-5 mt-0.5 ${iconClass}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description} • {item.created_at_formatted} • {item.created_at_human}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions Card */}
          {/* <Card>
            <CardHeader className="pt-4">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">3 Recipes awaiting approval</p>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    >
                      Pending
                    </Badge>
                  </div>
                  <Link href="/admin/recipes?filter=pending">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Review Recipes
                    </Button>
                  </Link>
                </div>

                <div className="p-3 mt-8 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">2 User reports to review</p>
                    <Badge
                      variant="secondary"
                      className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                    >
                      Urgent
                    </Badge>
                  </div>
                  <Link href="/admin/users?filter=reported">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      View Reports
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
