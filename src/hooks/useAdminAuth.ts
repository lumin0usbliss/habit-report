"use client"

import { useState, useEffect } from "react"
import { testConfig } from "@/data/config"

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = sessionStorage.getItem("admin-auth")
    setIsAuthenticated(auth === "true")
    setLoading(false)
  }, [])

  const login = (password: string): boolean => {
    if (password === testConfig.adminPassword) {
      sessionStorage.setItem("admin-auth", "true")
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem("admin-auth")
    setIsAuthenticated(false)
  }

  return { isAuthenticated, loading, login, logout }
}
