"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define types for our app data
export interface ClothingItem {
  id: string
  name: string
  type: string
  color: string
  brand: string
  size?: string
  style?: string
  images: string[]
}

export interface Outfit {
  id: string
  name: string
  description: string
  top: ClothingItem
  bottom: ClothingItem
  shoes: ClothingItem
  createdAt: string
}

export interface Event {
  id: string
  name: string
  location: string
  date: string
  outfitId?: string
  outfit?: Outfit
}

export interface UserProfile {
  name: string
  email?: string
  profilePicture?: string
  outfitsCreated: number
  wardrobeItems: number
  topOutfits: Outfit[]
  mostUsedColor?: string
  isLoggedIn: boolean
}

interface AppDataContextType {
  // Wardrobe
  clothingItems: ClothingItem[]
  addClothingItem: (item: Omit<ClothingItem, "id">) => void
  updateClothingItem: (id: string, item: Partial<ClothingItem>) => void
  deleteClothingItem: (id: string) => void

  // Outfits
  outfits: Outfit[]
  likedOutfits: Outfit[]
  currentOutfit: Outfit | null
  setCurrentOutfit: (outfit: Outfit | null) => void
  generateOutfit: (prompt: string) => Promise<Outfit>
  likeOutfit: (outfit: Outfit) => void
  unlikeOutfit: (id: string) => void

  // Calendar
  events: Event[]
  addEvent: (event: Omit<Event, "id">) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  assignOutfitToEvent: (eventId: string, outfitId: string) => void

  // User
  userProfile: UserProfile
  updateUserProfile: (profile: Partial<UserProfile>) => void
  addTopOutfit: (outfit: Outfit) => void
  removeTopOutfit: (id: string) => void

  // UI State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  showOnboarding: boolean
  completeOnboarding: () => void

  // User Authentication
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  sendMagicLink: (email: string) => Promise<boolean>

  // First Visit
  isFirstVisit: boolean
  completeFirstVisit: () => void

  // Outfit Management
  renameOutfit: (id: string, newName: string) => void

  // Color Detection
  detectDominantColor: (imageUrl: string) => Promise<string>

  // User Profile
  updateUsername: (name: string) => void

  // Event Management
  getEventTypeEmoji: (type: string) => string
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()

  // Initialize state
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([])
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [likedOutfits, setLikedOutfits] = useState<Outfit[]>([])
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "User",
    outfitsCreated: 0,
    wardrobeItems: 0,
    topOutfits: [],
    isLoggedIn: false,
  })

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedClothingItems = localStorage.getItem("clothingItems")
    if (storedClothingItems) setClothingItems(JSON.parse(storedClothingItems))

    const storedOutfits = localStorage.getItem("outfits")
    if (storedOutfits) setOutfits(JSON.parse(storedOutfits))

    const storedLikedOutfits = localStorage.getItem("likedOutfits")
    if (storedLikedOutfits) setLikedOutfits(JSON.parse(storedLikedOutfits))

    const storedEvents = localStorage.getItem("events")
    if (storedEvents) setEvents(JSON.parse(storedEvents))

    const onboardingCompleted = localStorage.getItem("onboardingCompleted")
    if (onboardingCompleted) setShowOnboarding(false)

    const firstVisitCompleted = localStorage.getItem("firstVisitCompleted")
    if (firstVisitCompleted) setIsFirstVisit(false)

    // Update existing userProfile initialization
    const storedUserProfile = localStorage.getItem("userProfile")
    if (storedUserProfile) {
      const profile = JSON.parse(storedUserProfile)
      setUserProfile({
        ...profile,
        isLoggedIn: localStorage.getItem("userSession") ? true : false,
      })
    } else {
      setUserProfile({
        name: "User",
        outfitsCreated: 0,
        wardrobeItems: 0,
        topOutfits: [],
        isLoggedIn: false,
      })
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("clothingItems", JSON.stringify(clothingItems))
    localStorage.setItem("outfits", JSON.stringify(outfits))
    localStorage.setItem("likedOutfits", JSON.stringify(likedOutfits))
    localStorage.setItem("events", JSON.stringify(events))
    localStorage.setItem("userProfile", JSON.stringify(userProfile))

    // Update user profile stats
    setUserProfile((prev) => ({
      ...prev,
      wardrobeItems: clothingItems.length,
      outfitsCreated: outfits.length,
    }))
  }, [clothingItems, outfits, likedOutfits, events])

  // Wardrobe functions
  const addClothingItem = (item: Omit<ClothingItem, "id">) => {
    const newItem = {
      ...item,
      id: `item_${Date.now()}`,
    }
    setClothingItems((prev) => [...prev, newItem])
    toast({
      title: "Item added",
      description: `${item.name} has been added to your wardrobe.`,
    })
  }

  const updateClothingItem = (id: string, item: Partial<ClothingItem>) => {
    setClothingItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...item } : i)))
    toast({
      title: "Item updated",
      description: "Your wardrobe item has been updated.",
    })
  }

  const deleteClothingItem = (id: string) => {
    setClothingItems((prev) => prev.filter((i) => i.id !== id))
    toast({
      title: "Item removed",
      description: "The item has been removed from your wardrobe.",
    })
  }

  // Outfit functions
  const generateOutfit = async (prompt: string): Promise<Outfit> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Find random items from wardrobe or use placeholders
    const getRandomItem = (type: string): ClothingItem => {
      const itemsOfType = clothingItems.filter((item) => item.type === type)
      if (itemsOfType.length > 0) {
        return itemsOfType[Math.floor(Math.random() * itemsOfType.length)]
      }

      // Placeholder if no items of this type exist
      return {
        id: `placeholder_${type}_${Date.now()}`,
        name: type === "top" ? "T-shirt" : type === "bottom" ? "Jeans" : "Sneakers",
        type,
        color: type === "top" ? "Black" : type === "bottom" ? "Blue" : "White",
        brand: "Generic",
        images: ["/placeholder.svg?height=300&width=300"],
      }
    }

    const newOutfit: Outfit = {
      id: `outfit_${Date.now()}`,
      name: `Outfit for ${new Date().toLocaleDateString()}`,
      description: `An outfit based on: ${prompt}`,
      top: getRandomItem("top"),
      bottom: getRandomItem("bottom"),
      shoes: getRandomItem("shoes"),
      createdAt: new Date().toISOString(),
    }

    setOutfits((prev) => [...prev, newOutfit])
    setCurrentOutfit(newOutfit)
    setIsLoading(false)

    // Update user profile stats
    setUserProfile((prev) => ({
      ...prev,
      outfitsCreated: prev.outfitsCreated + 1,
    }))

    return newOutfit
  }

  const likeOutfit = (outfit: Outfit) => {
    if (!likedOutfits.some((o) => o.id === outfit.id)) {
      setLikedOutfits((prev) => [...prev, outfit])
      toast({
        title: "Outfit saved",
        description: "The outfit has been added to your likes.",
      })
    }
  }

  const unlikeOutfit = (id: string) => {
    setLikedOutfits((prev) => prev.filter((o) => o.id !== id))
    toast({
      title: "Outfit removed",
      description: "The outfit has been removed from your likes.",
    })
  }

  // Calendar functions
  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent = {
      ...event,
      id: `event_${Date.now()}`,
    }
    setEvents((prev) => [...prev, newEvent])
    toast({
      title: "Event added",
      description: `${event.name} has been added to your calendar.`,
    })
  }

  const updateEvent = (id: string, event: Partial<Event>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...event } : e)))
    toast({
      title: "Event updated",
      description: "Your event has been updated.",
    })
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    toast({
      title: "Event removed",
      description: "The event has been removed from your calendar.",
    })
  }

  const assignOutfitToEvent = (eventId: string, outfitId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              outfitId,
              outfit: outfits.find((o) => o.id === outfitId) || likedOutfits.find((o) => o.id === outfitId),
            }
          : e,
      ),
    )
    toast({
      title: "Outfit assigned",
      description: "The outfit has been assigned to your event.",
    })
  }

  // User profile functions
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }))
    toast({
      title: "Profile updated",
      description: "Your profile has been updated.",
    })
  }

  const addTopOutfit = (outfit: Outfit) => {
    setUserProfile((prev) => {
      const newTopOutfits = [...prev.topOutfits]
      if (newTopOutfits.length >= 3) {
        newTopOutfits.pop()
      }
      newTopOutfits.unshift(outfit)
      return { ...prev, topOutfits: newTopOutfits }
    })
  }

  const removeTopOutfit = (id: string) => {
    setUserProfile((prev) => ({
      ...prev,
      topOutfits: prev.topOutfits.filter((o) => o.id !== id),
    }))
  }

  // Onboarding
  const completeOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem("onboardingCompleted", "true")
  }

  const login = async (email: string, password: string) => {
    // Mock implementation
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    // In a real app, this would validate credentials with a backend
    localStorage.setItem("userSession", JSON.stringify({ email, timestamp: Date.now() }))

    setUserProfile((prev) => ({
      ...prev,
      email,
      isLoggedIn: true,
    }))

    return true
  }

  const logout = () => {
    localStorage.removeItem("userSession")
    setUserProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
    }))

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const sendMagicLink = async (email: string) => {
    // Mock implementation
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    toast({
      title: "Magic link sent",
      description: `A login link has been sent to ${email}.`,
    })

    return true
  }

  const completeFirstVisit = () => {
    setIsFirstVisit(false)
    localStorage.setItem("firstVisitCompleted", "true")
  }

  const renameOutfit = (id: string, newName: string) => {
    // Update in outfits
    setOutfits((prev) => prev.map((outfit) => (outfit.id === id ? { ...outfit, name: newName } : outfit)))

    // Update in liked outfits
    setLikedOutfits((prev) => prev.map((outfit) => (outfit.id === id ? { ...outfit, name: newName } : outfit)))

    // Update in top outfits if present
    setUserProfile((prev) => ({
      ...prev,
      topOutfits: prev.topOutfits.map((outfit) => (outfit.id === id ? { ...outfit, name: newName } : outfit)),
    }))

    toast({
      title: "Outfit renamed",
      description: "Your outfit has been renamed successfully.",
    })
  }

  const detectDominantColor = async (imageUrl: string): Promise<string> => {
    // Mock implementation - in a real app this would analyze the image
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    // Return a random color from this list
    const colors = ["Black", "Navy", "Gray", "White", "Beige", "Red", "Blue", "Green"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const updateUsername = (name: string) => {
    setUserProfile((prev) => ({
      ...prev,
      name,
    }))

    toast({
      title: "Username updated",
      description: "Your username has been updated successfully.",
    })
  }

  const getEventTypeEmoji = (type: string): string => {
    const typeMap: Record<string, string> = {
      party: "🎉",
      sport: "🏃",
      business: "💼",
      travel: "✈️",
      casual: "👕",
      formal: "👔",
      date: "❤️",
      wedding: "💍",
      default: "📍",
    }

    return typeMap[type.toLowerCase()] || typeMap.default
  }

  useEffect(() => {
    if (clothingItems.length > 0) {
      const colorCounts: Record<string, number> = {}

      clothingItems.forEach((item) => {
        const color = item.color.toLowerCase()
        colorCounts[color] = (colorCounts[color] || 0) + 1
      })

      let mostUsedColor = ""
      let maxCount = 0

      Object.entries(colorCounts).forEach(([color, count]) => {
        if (count > maxCount) {
          mostUsedColor = color
          maxCount = count
        }
      })

      setUserProfile((prev) => ({
        ...prev,
        mostUsedColor: mostUsedColor.charAt(0).toUpperCase() + mostUsedColor.slice(1),
      }))
    }
  }, [clothingItems])

  const value = {
    clothingItems,
    addClothingItem,
    updateClothingItem,
    deleteClothingItem,

    outfits,
    likedOutfits,
    currentOutfit,
    setCurrentOutfit,
    generateOutfit,
    likeOutfit,
    unlikeOutfit,

    events,
    addEvent,
    updateEvent,
    deleteEvent,
    assignOutfitToEvent,

    userProfile,
    updateUserProfile,
    addTopOutfit,
    removeTopOutfit,

    isLoading,
    setIsLoading,
    showOnboarding,
    completeOnboarding,
    login,
    logout,
    sendMagicLink,
    isFirstVisit,
    completeFirstVisit,
    renameOutfit,
    detectDominantColor,
    updateUsername,
    getEventTypeEmoji,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider")
  }
  return context
}
