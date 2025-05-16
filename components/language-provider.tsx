"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define translation dictionary
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.wardrobe": "Wardrobe",
    "nav.generator": "Generator",
    "nav.calendar": "Calendar",
    "nav.likes": "Likes",

    // Home
    "home.welcome": "Welcome to What2Wear",
    "home.subtitle": "Your personal outfit generator and wardrobe manager",
    "home.getStarted": "Get Started",

    // Wardrobe
    "wardrobe.title": "My Wardrobe",
    "wardrobe.addItem": "Add Item",
    "wardrobe.noItems": "No items in your wardrobe yet",
    "wardrobe.addFirst": "Add your first item",

    // Item form
    "item.name": "Name",
    "item.type": "Type",
    "item.color": "Color",
    "item.brand": "Brand",
    "item.size": "Size",
    "item.images": "Images",
    "item.addImage": "Add Image",
    "item.save": "Save Item",
    "item.cancel": "Cancel",
    "item.delete": "Delete Item",

    // Generator
    "generator.title": "Outfit Generator",
    "generator.prompt": "What are you looking for?",
    "generator.generate": "Generate Outfit",
    "generator.generating": "Generating your outfit...",
    "generator.result": "Your Outfit",
    "generator.like": "Save",
    "generator.assign": "Add to Calendar",
    "generator.share": "Share",
    "generator.exit": "Exit",
    "generator.tryAgain": "Try Again",
    "generator.placeholder": "E.g., Casual outfit for a coffee date",

    // Calendar
    "calendar.title": "My Calendar",
    "calendar.addEvent": "Add Event",
    "calendar.noEvents": "No events scheduled",
    "calendar.today": "Today",

    // Event form
    "event.name": "Event Name",
    "event.location": "Location",
    "event.date": "Date",
    "event.time": "Time",
    "event.outfit": "Outfit",
    "event.selectOutfit": "Select Outfit",
    "event.save": "Save Event",
    "event.cancel": "Cancel",
    "event.delete": "Delete Event",

    // Likes
    "likes.title": "Saved Outfits",
    "likes.noOutfits": "No saved outfits yet",
    "likes.assignToEvent": "Assign to Event",

    // Account
    "account.title": "My Account",
    "account.profile": "Profile",
    "account.stats": "Stats",
    "account.outfitsCreated": "Outfits Created",
    "account.wardrobeItems": "Wardrobe Items",
    "account.topOutfits": "Top Outfits",
    "account.addTopOutfit": "Add to Top Outfits",
    "account.language": "Language",
    "account.english": "English",
    "account.german": "Deutsch",
    "account.changePicture": "Change Picture",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",
  },
  de: {
    // Navigation
    "nav.home": "Start",
    "nav.wardrobe": "Kleiderschrank",
    "nav.generator": "Generator",
    "nav.calendar": "Kalender",
    "nav.likes": "Favoriten",

    // Home
    "home.welcome": "Willkommen bei What2Wear",
    "home.subtitle": "Dein persönlicher Outfit-Generator und Kleiderschrank-Manager",
    "home.getStarted": "Loslegen",

    // Wardrobe
    "wardrobe.title": "Mein Kleiderschrank",
    "wardrobe.addItem": "Kleidungsstück hinzufügen",
    "wardrobe.noItems": "Noch keine Kleidungsstücke im Kleiderschrank",
    "wardrobe.addFirst": "Füge dein erstes Kleidungsstück hinzu",

    // Item form
    "item.name": "Name",
    "item.type": "Typ",
    "item.color": "Farbe",
    "item.brand": "Marke",
    "item.size": "Größe",
    "item.images": "Bilder",
    "item.addImage": "Bild hinzufügen",
    "item.save": "Speichern",
    "item.cancel": "Abbrechen",
    "item.delete": "Löschen",

    // Generator
    "generator.title": "Outfit-Generator",
    "generator.prompt": "Wonach suchst du?",
    "generator.generate": "Outfit generieren",
    "generator.generating": "Generiere dein Outfit...",
    "generator.result": "Dein Outfit",
    "generator.like": "Speichern",
    "generator.assign": "Zum Kalender hinzufügen",
    "generator.share": "Teilen",
    "generator.exit": "Beenden",
    "generator.tryAgain": "Nochmal versuchen",
    "generator.placeholder": "z.B. Lässiges Outfit für ein Kaffeedate",

    // Calendar
    "calendar.title": "Mein Kalender",
    "calendar.addEvent": "Termin hinzufügen",
    "calendar.noEvents": "Keine Termine geplant",
    "calendar.today": "Heute",

    // Event form
    "event.name": "Terminname",
    "event.location": "Ort",
    "event.date": "Datum",
    "event.time": "Zeit",
    "event.outfit": "Outfit",
    "event.selectOutfit": "Outfit auswählen",
    "event.save": "Termin speichern",
    "event.cancel": "Abbrechen",
    "event.delete": "Termin löschen",

    // Likes
    "likes.title": "Gespeicherte Outfits",
    "likes.noOutfits": "Noch keine gespeicherten Outfits",
    "likes.assignToEvent": "Zu Termin hinzufügen",

    // Account
    "account.title": "Mein Konto",
    "account.profile": "Profil",
    "account.stats": "Statistiken",
    "account.outfitsCreated": "Erstellte Outfits",
    "account.wardrobeItems": "Kleidungsstücke",
    "account.topOutfits": "Top-Outfits",
    "account.addTopOutfit": "Zu Top-Outfits hinzufügen",
    "account.language": "Sprache",
    "account.english": "English",
    "account.german": "Deutsch",
    "account.changePicture": "Bild ändern",

    // Common
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.loading": "Lädt...",
  },
}

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en")

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language")
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
