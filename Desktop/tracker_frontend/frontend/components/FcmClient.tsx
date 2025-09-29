'use client'

import { useEffect } from 'react'
import { useFcm } from '@/hooks/useFcm'
import { useAuth } from '@/hooks/use-auth'

export default function FcmClient() {
  // We only need to ensure a JWT exists in localStorage; useFcm will pick it up
  const { user } = useAuth()
  const jwt = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const { token, error } = useFcm(jwt || undefined)

  useEffect(() => {
    if (token) console.log('FCM token registered:', token)
    if (error) console.warn('FCM error:', error)
  }, [token, error])

  return null
}
