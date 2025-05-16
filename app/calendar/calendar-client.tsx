"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLanguage } from "@/components/language-provider"
import { useAppData, type Event } from "@/components/app-data-provider"

export default function CalendarClient() {
  const searchParams = useSearchParams()
  const outfitId = searchParams.get("outfitId")

  const { t } = useLanguage()
  const { events, addEvent, likedOutfits, outfits, assignOutfitToEvent } = useAppData()

  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    name: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
  })

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

  // Get week days starting from today
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const handleAddEvent = () => {
    addEvent(newEvent)
    setNewEvent({
      name: "",
      location: "",
      date: format(new Date(), "yyyy-MM-dd"),
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

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-6">{t("calendar.title")}</h1>

      {/* Week view */}
      <div className="mb-6">
        <div className="flex overflow-x-auto pb-2 space-x-2">
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, selectedDate)

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
              </button>
            )
          })}
        </div>
      </div>

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
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{event.name}</h3>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    {event.outfitId && (
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                          {/* Placeholder for outfit thumbnail */}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
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
