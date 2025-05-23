"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns"
import { CalendarIcon, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { useAppData, type Event } from "@/components/app-data-provider"
import { motion } from "framer-motion"

export default function CalendarClient() {
  const searchParams = useSearchParams()
  const outfitId = searchParams.get("outfitId")

  const { t } = useLanguage()
  const { events, addEvent, likedOutfits, outfits, assignOutfitToEvent, getEventTypeEmoji } = useAppData()

  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"week" | "month">("week")
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    name: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
    type: "default",
  })

  // Event types
  const eventTypes = [
    { value: "party", label: t("calendar.eventParty") },
    { value: "sport", label: t("calendar.eventSport") },
    { value: "business", label: t("calendar.eventBusiness") },
    { value: "travel", label: t("calendar.eventTravel") },
    { value: "casual", label: t("calendar.eventCasual") },
    { value: "formal", label: t("calendar.eventFormal") },
    { value: "date", label: t("calendar.eventDate") },
    { value: "wedding", label: t("calendar.eventWedding") },
    { value: "default", label: "Other" },
  ]

  // If outfitId is provided in URL, open add event dialog
  useEffect(() => {
    if (outfitId) {
      setNewEvent((prev) => ({
        ...prev,
        outfitId,
      }))
      setIsAddEventOpen(true)
    }
  }, [outfitId])

  // Get events for the selected date
  const eventsForSelectedDate = events.filter((event) => {
    const eventDate = new Date(event.date)
    return isSameDay(eventDate, selectedDate)
  })

  // Get all available outfits (liked + generated)
  const availableOutfits = [...likedOutfits, ...outfits]

  // Get week days starting from Monday of the current week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Get month days
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add days from previous month to fill the first week
  const firstDayOfMonth = getDay(monthStart)
  const prevMonthDays =
    firstDayOfMonth > 0
      ? Array.from({ length: firstDayOfMonth - 1 }, (_, i) => addDays(monthStart, -i - 1)).reverse()
      : []

  // Add days from next month to fill the last week
  const lastDayOfMonth = getDay(monthEnd)
  const nextMonthDays =
    lastDayOfMonth < 7 ? Array.from({ length: 7 - lastDayOfMonth }, (_, i) => addDays(monthEnd, i + 1)) : []

  // Combine all days for the month view
  const allMonthDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]

  // Group days into weeks
  const weeks = []
  for (let i = 0; i < allMonthDays.length; i += 7) {
    weeks.push(allMonthDays.slice(i, i + 7))
  }

  const handleAddEvent = () => {
    addEvent(newEvent)
    setNewEvent({
      name: "",
      location: "",
      date: format(new Date(), "yyyy-MM-dd"),
      type: "default",
    })
    setIsAddEventOpen(false)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setNewEvent((prev) => ({
      ...prev,
      date: format(date, "yyyy-MM-dd"),
    }))
  }

  const navigatePrevious = () => {
    if (viewMode === "week") {
      setSelectedDate(addDays(weekStart, -7))
    } else {
      const prevMonth = new Date(selectedDate)
      prevMonth.setMonth(prevMonth.getMonth() - 1)
      setSelectedDate(prevMonth)
    }
  }

  const navigateNext = () => {
    if (viewMode === "week") {
      setSelectedDate(addDays(weekStart, 7))
    } else {
      const nextMonth = new Date(selectedDate)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      setSelectedDate(nextMonth)
    }
  }

  return (
    <div className="container p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("calendar.title")}</h1>

        <div className="flex items-center space-x-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "week" | "month")}>
            <TabsList>
              <TabsTrigger value="week">{t("calendar.weekView")}</TabsTrigger>
              <TabsTrigger value="month">{t("calendar.monthView")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Calendar navigation */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={navigatePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-lg font-medium">
          {viewMode === "week"
            ? `${format(weekStart, "MMMM d")} - ${format(addDays(weekStart, 6), "MMMM d, yyyy")}`
            : format(selectedDate, "MMMM yyyy")}
        </h2>

        <Button variant="ghost" size="icon" onClick={navigateNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week view */}
      {viewMode === "week" && (
        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2 space-x-2">
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date())
              const isSelected = isSameDay(day, selectedDate)
              const hasEvents = events.some((event) => isSameDay(new Date(event.date), day))

              return (
                <button
                  key={day.toISOString()}
                  className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${
                    isSelected ? "bg-gray-900 text-white" : isToday ? "bg-gray-100" : "bg-white"
                  }`}
                  onClick={() => handleDateSelect(day)}
                >
                  <span className="text-xs font-medium">{format(day, "EEE")}</span>
                  <span className={`text-lg font-bold ${isSelected ? "text-white" : ""}`}>{format(day, "d")}</span>
                  {hasEvents && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? "bg-white" : "bg-gray-900"}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Month view */}
      {viewMode === "month" && (
        <div className="mb-6">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {allMonthDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth()
              const isToday = isSameDay(day, new Date())
              const isSelected = isSameDay(day, selectedDate)
              const hasEvents = events.some((event) => isSameDay(new Date(event.date), day))

              return (
                <button
                  key={index}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg p-1
                    ${isSelected ? "bg-gray-900 text-white" : isToday ? "bg-gray-100" : "bg-white"}
                    ${!isCurrentMonth ? "opacity-40" : ""}
                  `}
                  onClick={() => handleDateSelect(day)}
                >
                  <span className={`text-sm ${isSelected ? "text-white" : ""}`}>{format(day, "d")}</span>
                  {hasEvents && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? "bg-white" : "bg-gray-900"}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Events for selected date */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">
            {format(selectedDate, "MMMM d, yyyy")}
            {isSameDay(selectedDate, new Date()) && (
              <span className="ml-2 text-sm font-normal text-gray-500">({t("calendar.today")})</span>
            )}
          </h2>
          <Button onClick={() => setIsAddEventOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("calendar.addEvent")}
          </Button>
        </div>

        {eventsForSelectedDate.length > 0 ? (
          <div className="space-y-3">
            {eventsForSelectedDate.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                          {getEventTypeEmoji(event.type || "default")}
                        </div>
                        <div>
                          <h3 className="font-medium">{event.name}</h3>
                          <p className="text-sm text-gray-500">{event.location}</p>
                        </div>
                      </div>
                      {event.outfitId && (
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                            <span className="text-xs">👕</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t("calendar.noEvents")}</p>
          </div>
        )}
      </div>

      {/* Add event dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("calendar.addEvent")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t("event.name")}</Label>
              <Input
                id="name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="location">{t("event.location")}</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="type">{t("calendar.eventType")}</Label>
              <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <span className="mr-2">{getEventTypeEmoji(type.value)}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">{t("event.date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEvent.date ? format(new Date(newEvent.date), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(newEvent.date)}
                    onSelect={(date) => date && setNewEvent({ ...newEvent, date: format(date, "yyyy-MM-dd") })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="outfit">{t("event.outfit")}</Label>
              <Select
                value={newEvent.outfitId}
                onValueChange={(value) => setNewEvent({ ...newEvent, outfitId: value })}
              >
                <SelectTrigger id="outfit">
                  <SelectValue placeholder={t("event.selectOutfit")} />
                </SelectTrigger>
                <SelectContent>
                  {availableOutfits.map((outfit) => (
                    <SelectItem key={outfit.id} value={outfit.id}>
                      {outfit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              {t("event.cancel")}
            </Button>
            <Button onClick={handleAddEvent} disabled={!newEvent.name || !newEvent.date}>
              {t("event.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
