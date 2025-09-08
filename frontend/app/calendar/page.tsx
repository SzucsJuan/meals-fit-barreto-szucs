"use client"

import Navigation from "@/components/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, ChevronLeft, ChevronRight, Target, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

// Sample nutrition data for calendar
type NutritionDay = {
  calories: number
  protein: number
  carbs: number
  fats: number
  goalsMet: number
}

const nutritionData: { [key: string]: NutritionDay } = {
  "2025-01-01": { calories: 2150, protein: 165, carbs: 270, fats: 72, goalsMet: 4 },
  "2025-01-02": { calories: 1980, protein: 145, carbs: 245, fats: 68, goalsMet: 3 },
  "2025-01-03": { calories: 2300, protein: 175, carbs: 285, fats: 78, goalsMet: 4 },
  "2025-01-04": { calories: 2050, protein: 160, carbs: 255, fats: 70, goalsMet: 4 },
  "2025-01-05": { calories: 1850, protein: 135, carbs: 220, fats: 62, goalsMet: 2 },
  "2025-01-06": { calories: 2200, protein: 170, carbs: 275, fats: 75, goalsMet: 4 },
  "2025-01-07": { calories: 2100, protein: 155, carbs: 265, fats: 71, goalsMet: 3 },
  "2025-01-08": { calories: 2250, protein: 180, carbs: 280, fats: 76, goalsMet: 4 },
  "2025-01-09": { calories: 1950, protein: 150, carbs: 240, fats: 65, goalsMet: 3 },
  "2025-01-10": { calories: 2180, protein: 165, carbs: 270, fats: 73, goalsMet: 4 },
  "2025-01-11": { calories: 2050, protein: 160, carbs: 255, fats: 69, goalsMet: 4 },
  "2025-01-12": { calories: 1900, protein: 140, carbs: 230, fats: 64, goalsMet: 2 },
  "2025-01-13": { calories: 2300, protein: 175, carbs: 290, fats: 78, goalsMet: 4 },
  "2025-01-14": { calories: 2150, protein: 170, carbs: 265, fats: 72, goalsMet: 4 },
  "2025-01-15": { calories: 2000, protein: 155, carbs: 250, fats: 67, goalsMet: 3 },
}

const nutritionGoals = {
  calories: 2200,
  protein: 165,
  carbs: 275,
  fats: 73,
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type CustomEvent = {
  id: number
  title: string
  type: string
  time: string
}

const customEvents: { [key: string]: CustomEvent[] } = {
  "2025-01-03": [{ id: 1, title: "Morning Workout", type: "workout", time: "7:00 AM" }],
  "2025-01-05": [{ id: 2, title: "Doctor Appointment", type: "appointment", time: "2:30 PM" }],
  "2025-01-08": [{ id: 3, title: "Meal Prep Sunday", type: "reminder", time: "10:00 AM" }],
  "2025-01-12": [{ id: 4, title: "Gym Session", type: "workout", time: "6:00 PM" }],
  "2025-01-15": [{ id: 5, title: "Grocery Shopping", type: "other", time: "11:00 AM" }],
}

export default function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "",
    time: "",
    description: "",
    date: "",
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getCalorieStatus = (calories: number) => {
    const percentage = (calories / nutritionGoals.calories) * 100
    if (percentage >= 90 && percentage <= 110) return "optimal"
    if (percentage >= 80 && percentage <= 120) return "good"
    if (percentage < 80) return "low"
    return "high"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-primary text-primary-foreground"
      case "good":
        return "bg-accent text-accent-foreground"
      case "low":
        return "bg-destructive/20 text-destructive"
      case "high":
        return "bg-chart-5/20 text-chart-5"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.type && newEvent.date) {
      console.log("Creating event:", newEvent)
      // Here you would typically save to database
      setIsEventDialogOpen(false)
      setNewEvent({ title: "", type: "", time: "", description: "", date: "" })
    }
  }

  const days = getDaysInMonth(currentDate)
  const selectedData = selectedDate ? nutritionData[selectedDate] : null
  const selectedEvents = selectedDate ? customEvents[selectedDate] || [] : []

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Nutrition Calendar</h1>
                <p className="text-muted-foreground">Track your nutrition journey over time</p>
              </div>
            </div>
            {/* Add Event button */}
            <div className="flex gap-2">
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Custom Event</DialogTitle>
                    <DialogDescription>Add a personal event to your calendar</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input
                        id="event-title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-type">Event Type</Label>
                        <Select
                          value={newEvent.type}
                          onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="workout">Workout</SelectItem>
                            <SelectItem value="appointment">Appointment</SelectItem>
                            <SelectItem value="reminder">Reminder</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-time">Time</Label>
                        <Input
                          id="event-time"
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Date</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-description">Description (Optional)</Label>
                      <Textarea
                        id="event-description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Add event details"
                      />
                    </div>
                    <Button onClick={handleCreateEvent} className="w-full">
                      Create Event
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Calendar */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground"
                    >
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.slice(0, 1)}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="p-1 sm:p-2 h-16 sm:h-20"></div>
                    }

                    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const dayData = nutritionData[dateKey]
                    const dayEvents = customEvents[dateKey] || []
                    const isSelected = selectedDate === dateKey
                    const isToday = dateKey === "2025-09-07" 

                    return (
                      <div
                        key={day}
                        className={`p-1 sm:p-2 h-16 sm:h-20 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          isSelected ? "ring-2 ring-primary" : ""
                        } ${isToday ? "bg-primary/5" : ""}`}
                        onClick={() => setSelectedDate(dateKey)}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs sm:text-sm font-medium ${isToday ? "text-primary" : "text-foreground"}`}
                            >
                              {day}
                            </span>
                            {isToday && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"></div>}
                          </div>

                          {dayData && (
                            <div className="flex-1 flex flex-col justify-center">
                              <div
                                className={`text-xs px-1 py-0.5 rounded text-center ${getStatusColor(
                                  getCalorieStatus(dayData.calories),
                                )}`}
                              >
                                <span className="hidden sm:inline">{dayData.calories}</span>
                                <span className="sm:hidden">{Math.round(dayData.calories / 100)}k</span>
                              </div>
                              <div className="flex justify-center mt-1">
                                {Array.from({ length: dayData.goalsMet }, (_, i) => (
                                  <div key={i} className="w-1 h-1 bg-primary rounded-full mx-0.5"></div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Custom event indicators */}
                          {dayEvents.length > 0 && (
                            <div className="flex justify-center mt-1">
                              {dayEvents.slice(0, 2).map((event, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                    event.type === "workout"
                                      ? "bg-chart-3"
                                      : event.type === "appointment"
                                        ? "bg-chart-5"
                                        : event.type === "reminder"
                                          ? "bg-accent"
                                          : "bg-muted-foreground"
                                  }`}
                                ></div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mx-0.5"></div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Nutrition Status</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-primary rounded"></div>
                        <span className="text-sm">Optimal (90-110%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-accent rounded"></div>
                        <span className="text-sm">Good (80-120%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-destructive/20 border border-destructive rounded"></div>
                        <span className="text-sm">Under Goal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-chart-5/20 border border-chart-5 rounded"></div>
                        <span className="text-sm">Over Goal</span>
                      </div>
                    </div>
                  </div>
                  {/* Event Types */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Event Types</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                        <span className="text-sm">Workout</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-chart-5 rounded-full"></div>
                        <span className="text-sm">Appointment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-accent rounded-full"></div>
                        <span className="text-sm">Reminder</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                        <span className="text-sm">Other</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  {/* Dots below calories indicate nutrition goals met (max 4: calories, protein, carbs, fats) */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Selected Day Details */}
            {selectedData || selectedEvents.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    {new Date(selectedDate!).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <CardDescription>Daily summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Custom events display */}
                  {selectedEvents.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Events</h4>
                      <div className="space-y-2">
                        {selectedEvents.map((event) => (
                          <div key={event.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                event.type === "workout"
                                  ? "bg-chart-3"
                                  : event.type === "appointment"
                                    ? "bg-chart-5"
                                    : event.type === "reminder"
                                      ? "bg-accent"
                                      : "bg-muted-foreground"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{event.title}</div>
                              <div className="text-xs text-muted-foreground">{event.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedData && (
                    <>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="text-center p-2 sm:p-3 bg-primary/5 rounded-lg">
                          <div className="text-base sm:text-lg font-bold text-primary">{selectedData.calories}</div>
                          <div className="text-xs text-muted-foreground">Calories</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((selectedData.calories / nutritionGoals.calories) * 100)}% of goal
                          </div>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-accent/5 rounded-lg">
                          <div className="text-base sm:text-lg font-bold text-accent">{selectedData.protein}g</div>
                          <div className="text-xs text-muted-foreground">Protein</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((selectedData.protein / nutritionGoals.protein) * 100)}% of goal
                          </div>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-chart-3/5 rounded-lg">
                          <div className="text-base sm:text-lg font-bold text-chart-3">{selectedData.carbs}g</div>
                          <div className="text-xs text-muted-foreground">Carbs</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((selectedData.carbs / nutritionGoals.carbs) * 100)}% of goal
                          </div>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-chart-5/5 rounded-lg">
                          <div className="text-base sm:text-lg font-bold text-chart-5">{selectedData.fats}g</div>
                          <div className="text-xs text-muted-foreground">Fats</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((selectedData.fats / nutritionGoals.fats) * 100)}% of goal
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-sm text-muted-foreground">Goals Met</span>
                        <Badge variant="outline">{selectedData.goalsMet}/4</Badge>
                      </div>

                      <Link href="/meals">
                        <Button className="w-full" size="sm">
                          View Meals for This Day
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Select a Date</CardTitle>
                  <CardDescription>Click on a calendar date to view details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">
                      Choose a date from the calendar to see your nutrition summary and events
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Gym Session</div>
                    <div className="text-xs text-muted-foreground">Jan 12, 6:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Grocery Shopping</div>
                    <div className="text-xs text-muted-foreground">Today, 11:00 AM</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Monthly Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Daily Calories</span>
                  <span className="font-medium">2,107</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Goals Hit Rate</span>
                  <span className="font-medium">73%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Best Streak</span>
                  <span className="font-medium">8 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/meals/add">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Log Today's Meal
                  </Button>
                </Link>
                <Link href="/meals">
                  <Button className="w-full bg-transparent" variant="outline">
                    View Meal Tracking
                  </Button>
                </Link>
                <Link href="/recipes">
                  <Button className="w-full bg-transparent" variant="outline">
                    Browse Recipes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
