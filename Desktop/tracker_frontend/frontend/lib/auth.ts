import { api } from "./api"

export interface User {
  id: string
  type: "student" | "driver"
  name: string
  phone: string
  city?: string
  schoolName?: string
  schoolId?: string
  fatherName?: string
  gender?: string
  busNumber?: string
  class?: string
  section?: string
  schoolCity?: string
  isVerified: boolean
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

function persistAuth(token: string, profile: any, type: "student" | "driver"): User {
  const user: User = {
    id: profile.id,
    type,
    name: profile.name || profile.schoolName || "",
    phone: profile.phone,
    city: profile.city,
    schoolName: profile.schoolName,
    schoolId: profile.schoolId,
    fatherName: profile.fatherName,
    gender: profile.gender,
    busNumber: profile.busNumber,
    class: profile.class,
    section: profile.section,
    schoolCity: profile.schoolCity,
    isVerified: true,
    createdAt: new Date(),
  }
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
  return user
}

export const signUp = async (userData: Partial<User>): Promise<User> => {
  const isStudent = (userData.type || "student") === "student"
  if (isStudent) {
    const resp = await api("/api/auth/user/signup", {
      method: "POST",
      body: {
        city: userData.city,
        schoolName: userData.schoolName,
        name: userData.name,
        fatherName: userData.fatherName,
        gender: userData.gender,
        phone: userData.phone,
        busNumber: userData.busNumber,
        class: userData.class,
        section: userData.section,
        password: (userData as any).password,
        // pass through fcmToken if the caller supplied it
        fcmToken: (userData as any).fcmToken,
      },
    })
    return persistAuth(resp.token, resp.user, "student")
  } else {
    const resp = await api("/api/auth/driver/signup", {
      method: "POST",
      body: {
        schoolName: userData.schoolName,
        schoolCity: userData.schoolCity,
        name: userData.name,
        phone: userData.phone,
        busNumber: userData.busNumber,
        password: (userData as any).password,
      },
    })
    return persistAuth(resp.token, resp.driver, "driver")
  }
}

export const signIn = async (phone: string, password: string, type: "student" | "driver" = "student"): Promise<User> => {
  if (type === "student") {
    const resp = await api("/api/auth/user/login", { method: "POST", body: { phone, password } })
    return persistAuth(resp.token, resp.user, "student")
  } else {
    const resp = await api("/api/auth/driver/login", { method: "POST", body: { phone, password } })
    return persistAuth(resp.token, resp.driver, "driver")
  }
}

export const signOut = async (): Promise<void> => {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

// 2Factor API Configuration
const TWOFACTOR_API_KEY = "3e5558da-7432-11ef-8b17-0200cd936042"
const TWOFACTOR_BASE_URL = "https://2factor.in/API/V1"

export const sendOTP = async (phone: string, type: "student" | "driver" = "student"): Promise<string> => {
  try {
    console.log(`📱 Sending OTP to ${phone} via 2Factor API`)
    const sendUrl = `${TWOFACTOR_BASE_URL}/${TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN3/SVD`
    console.log(`🌐 Send URL: ${sendUrl}`)
    
    const response = await fetch(sendUrl, {
      method: "GET",
    })
    
    const data = await response.json()
    console.log("📨 Send OTP response:", JSON.stringify(data, null, 2))
    
    if (data.Status === "Success") {
      const sessionId = data.Details || ""
      console.log(`✅ OTP sent successfully! Session ID: ${sessionId}`)
      console.log(`⚠️ IMPORTANT: Save this Session ID for verification: ${sessionId}`)
      return sessionId
    } else {
      console.error("❌ Failed to send OTP:", data.Details)
      throw new Error(data.Details || "Failed to send OTP")
    }
  } catch (error) {
    console.error("❌ Error sending OTP:", error)
    throw new Error("Failed to send OTP. Please try again.")
  }
}

export const verifyOTP = async (phone: string, otp: string, sessionId?: string): Promise<boolean> => {
  try {
    console.log(`🔐 Verifying OTP for phone: ${phone}`)
    console.log(`📋 Session ID: ${sessionId}`)
    console.log(`🔢 OTP: ${otp}`)
    
    // Correct endpoint: /SMS/VERIFY (not VERIFY3)
    const verifyUrl = `${TWOFACTOR_BASE_URL}/${TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    console.log(`🌐 Verification URL: ${verifyUrl}`)
    
    const response = await fetch(verifyUrl, {
      method: "GET",
    })
    
    const data = await response.json()
    console.log("📨 Verification response:", JSON.stringify(data, null, 2))
    
    // Check multiple success conditions
    if (data.Status === "Success") {
      console.log("✅ OTP verified successfully")
      return true
    } else {
      console.log("❌ OTP verification failed:", data.Details)
      console.log("💡 Tip: Make sure you're using the OTP from the latest SMS")
      return false
    }
  } catch (error) {
    console.error("❌ Error verifying OTP:", error)
    return false
  }
}
