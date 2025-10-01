// Validation utility functions

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates Indian phone number
 * - Must be 10 digits
 * - Must start with 6, 7, 8, or 9
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  // Remove any spaces or dashes
  const cleanPhone = phone.replace(/[\s-]/g, '')
  
  // Check if it's exactly 10 digits
  if (!/^\d{10}$/.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'Phone number must be exactly 10 digits'
    }
  }
  
  // Check if it starts with 6, 7, 8, or 9
  const firstDigit = cleanPhone[0]
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return {
      isValid: false,
      error: 'Phone number must start with 6, 7, 8, or 9'
    }
  }
  
  return { isValid: true }
}

/**
 * Validates password strength
 * - Minimum 8 characters
 * - At least 1 capital letter
 * - At least 1 special character
 */
export const validatePassword = (password: string): ValidationResult => {
  // Check minimum length
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long'
    }
  }
  
  // Check for at least one capital letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least 1 capital letter'
    }
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least 1 special character (!@#$%^&* etc.)'
    }
  }
  
  return { isValid: true }
}

/**
 * Get password strength level
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let strength = 0
  
  // Length check
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
}
