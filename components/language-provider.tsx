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
    "nav.account": "Account",

    // Home
    "home.welcome": "Welcome to What2Wear",
    "home.subtitle": "Your personal outfit generator and wardrobe manager",
    "home.getStarted": "Get Started",
    "home.savedOutfits": "Saved Outfits",
    "home.unsavedOutfits": "Recent Outfits",
    "home.noSavedOutfits": "No saved outfits yet",
    "home.noUnsavedOutfits": "No recent outfits",

    // Wardrobe
    "wardrobe.title": "My Wardrobe",
    "wardrobe.addItem": "Add Item",
    "wardrobe.noItems": "No items in your wardrobe yet",
    "wardrobe.addFirst": "Add your first item",
    "wardrobe.uploadImage": "Upload Image",
    "wardrobe.detectColor": "Detect Color",
    "wardrobe.style": "Style",
    "wardrobe.styleCasual": "Casual",
    "wardrobe.styleSport": "Sport",
    "wardrobe.styleBusiness": "Business",
    "wardrobe.styleFormal": "Formal",

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
    "generator.thinking": "Thinking...",
    "generator.suggestion": "Based on your request, I suggest:",
    "generator.nameOutfit": "Name your outfit",
    "generator.saveOutfit": "Save Outfit",

    // Calendar
    "calendar.title": "My Calendar",
    "calendar.addEvent": "Add Event",
    "calendar.noEvents": "No events scheduled",
    "calendar.today": "Today",
    "calendar.monthView": "Month View",
    "calendar.weekView": "Week View",
    "calendar.eventType": "Event Type",
    "calendar.eventParty": "Party",
    "calendar.eventSport": "Sport",
    "calendar.eventBusiness": "Business",
    "calendar.eventTravel": "Travel",
    "calendar.eventCasual": "Casual",
    "calendar.eventFormal": "Formal",
    "calendar.eventDate": "Date",
    "calendar.eventWedding": "Wedding",

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
    "likes.rename": "Rename",
    "likes.assign": "Assign to Event",
    "likes.promote": "Add to Top 3",

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
    "account.login": "Login",
    "account.logout": "Logout",
    "account.email": "Email",
    "account.password": "Password",
    "account.signIn": "Sign In",
    "account.signUp": "Sign Up",
    "account.forgotPassword": "Forgot Password?",
    "account.magicLink": "Send Magic Link",
    "account.notLoggedIn": "Sign in to access your wardrobe",
    "account.editUsername": "Edit Username",
    "account.mostUsedColor": "Most Used Color",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",

    // Onboarding
    "onboarding.welcome": "Welcome to What2Wear",
    "onboarding.subtitle": "Your personal outfit generator and wardrobe manager",
    "onboarding.swipeToStart": "Swipe to Start",
  },
  de: {
    // Navigation
    "nav.home": "Start",
    "nav.wardrobe": "Kleiderschrank",
    "nav.generator": "Generator",
    "nav.calendar": "Kalender",
    "nav.likes": "Favoriten",
    "nav.account": "Konto",

    // Home
    "home.welcome": "Willkommen bei What2Wear",
    "home.subtitle": "Dein persönlicher Outfit-Generator und Kleiderschrank-Manager",
    "home.getStarted": "Loslegen",
    "home.savedOutfits": "Gespeicherte Outfits",
    "home.unsavedOutfits": "Aktuelle Outfits",
    "home.noSavedOutfits": "Noch keine gespeicherten Outfits",
    "home.noUnsavedOutfits": "Keine aktuellen Outfits",

    // Wardrobe
    "wardrobe.title": "Mein Kleiderschrank",
    "wardrobe.addItem": "Kleidungsstück hinzufügen",
    "wardrobe.noItems": "Noch keine Kleidungsstücke im Kleiderschrank",
    "wardrobe.addFirst": "Füge dein erstes Kleidungsstück hinzu",
    "wardrobe.uploadImage": "Bild hochladen",
    "wardrobe.detectColor": "Farbe erkennen",
    "wardrobe.style": "Stil",
    "wardrobe.styleCasual": "Casual",
    "wardrobe.styleSport": "Sport",
    "wardrobe.styleBusiness": "Business",
    "wardrobe.styleFormal": "Formal",

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
    "generator.thinking": "Überlege...",
    "generator.suggestion": "Basierend auf deiner Anfrage schlage ich vor:",
    "generator.nameOutfit": "Benenne dein Outfit",
    "generator.saveOutfit": "Outfit speichern",

    // Calendar
    "calendar.title": "Mein Kalender",
    "calendar.addEvent": "Termin hinzufügen",
    "calendar.noEvents": "Keine Termine geplant",
    "calendar.today": "Heute",
    "calendar.monthView": "Monatsansicht",
    "calendar.weekView": "Wochenansicht",
    "calendar.eventType": "Ereignistyp",
    "calendar.eventParty": "Party",
    "calendar.eventSport": "Sport",
    "calendar.eventBusiness": "Business",
    "calendar.eventTravel": "Reise",
    "calendar.eventCasual": "Casual",
    "calendar.eventFormal": "Formal",
    "calendar.eventDate": "Date",
    "calendar.eventWedding": "Hochzeit",

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
    "likes.rename": "Umbenennen",
    "likes.assign": "Zu Ereignis hinzufügen",
    "likes.promote": "Zu Top 3 hinzufügen",

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
    "account.login": "Anmelden",
    "account.logout": "Abmelden",
    "account.email": "E-Mail",
    "account.password": "Passwort",
    "account.signIn": "Einloggen",
    "account.signUp": "Registrieren",
    "account.forgotPassword": "Passwort vergessen?",
    "account.magicLink": "Magic Link senden",
    "account.notLoggedIn": "Melde dich an, um auf deinen Kleiderschrank zuzugreifen",
    "account.editUsername": "Benutzernamen bearbeiten",
    "account.mostUsedColor": "Meistgenutzte Farbe",

    // Common
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.loading": "Lädt...",

    // Onboarding
    "onboarding.welcome": "Willkommen bei What2Wear",
    "onboarding.subtitle": "Dein persönlicher Outfit-Generator und Kleiderschrank-Manager",
    "onboarding.swipeToStart": "Wische zum Starten",
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
