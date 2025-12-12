import { useState, useEffect } from 'react'
import type { Language } from '@/lib/translations'

export function useLanguage() {
    const [language, setLanguageState] = useState<Language>('en')

    // Load language from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('preferredLanguage') as Language
            if (saved && ['en', 'kn', 'hi', 'ta', 'te'].includes(saved)) {
                setLanguageState(saved)
            }
        }
    }, [])

    // Save language to localStorage when it changes
    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferredLanguage', lang)
        }
    }

    return { language, setLanguage }
}
