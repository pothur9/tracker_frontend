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
      },
    })
    return persistAuth(resp.token, resp.driver, "driver")
  }
}

export const signInWithOTP = async (phone: string, type: "student" | "driver" = "student"): Promise<User> => {
  if (type === "student") {
    const resp = await api("/api/auth/user/login", { method: "POST", body: { phone, verified: true } })
    return persistAuth(resp.token, resp.user, "student")
  } else {
    const resp = await api("/api/auth/driver/login", { method: "POST", body: { phone, verified: true } })
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

export const verifyOTP = async (sessionId: string, otp: string): Promise<boolean> => {
  try {
    const verifyResponse = await fetch(
      `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY/${sessionId}/${otp}`
    )
    const verifyData = await verifyResponse.json()
    return verifyData.Status === "Success"
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return false
  }
}

export const sendOTP = async (phone: string): Promise<string | null> => {
  try {
    const otpResponse = await fetch(
      `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${phone}/AUTOGEN3/SVD`
    )
    const otpData = await otpResponse.json()
    if (otpData.Status === "Success") {
      return otpData.Details // returns sessionId
    }
    return null
  } catch (error) {
    console.error("Error sending OTP:", error)
    return null
  }
}

export const checkUserExists = async (phone: string): Promise<boolean> => {
  try {
    const resp = await api(`/api/auth/user/check/${phone}`)
    return resp.exists === true
  } catch (error) {
    console.error("Error checking user existence:", error)
    return false
  }
}

export const checkDriverExists = async (phone: string): Promise<boolean> => {
  try {
    const resp = await api(`/api/auth/driver/check/${phone}`)
    return resp.exists === true
  } catch (error) {
    console.error("Error checking driver existence:", error)
    return false
  }
}

