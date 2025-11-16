"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Users,
  ChefHat,
  Target,
  CheckCircle,
  Clock,
  Activity,
  EggFried,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { authApi } from "@/lib/api";

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
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authApi.logout();
      router.push("/signin");
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <Shield className="h-8 w-8" style={{ color: "#FF9800" }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your nutrition and fitness platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" style={{ color: "#4caf50" }}>
                Administrator
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {loggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
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
                    <CardDescription className="text-xs">
                      Manage user accounts
                    </CardDescription>
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
                    <CardDescription className="text-xs">
                      Moderate recipes
                    </CardDescription>
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
                    <CardDescription className="text-xs">
                      Back to the app
                    </CardDescription>
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
              <CardDescription>
                User registrations, recipes & meals (last 7 days)
              </CardDescription>
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
                      {(stats?.recipe_category_distribution ?? []).map(
                        (_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                            }
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {(stats?.recipe_category_distribution ?? []).map(
                  (category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {category.name} ({category.value})
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(!stats ||
                  !stats.recent_activity ||
                  stats.recent_activity.length === 0) && (
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
                    Icon = Target;
                    iconClass = "text-emerald-600";
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 pb-3 ${
                        idx !== (stats.recent_activity.length - 1)
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <Icon className={`h-5 w-5 mt-0.5 ${iconClass}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description} • {item.created_at_human}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
