'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/lib/useAuth'

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)