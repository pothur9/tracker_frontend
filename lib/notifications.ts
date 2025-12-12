export interface StoredNotification {
    id: string
    title: string
    body: string
    timestamp: number
    isRead: boolean
    type: 'info' | 'warning' | 'success' | 'error'
    data?: Record<string, any>
}

const STORAGE_KEY = 'app_notifications'
const MAX_NOTIFICATIONS = 50

/**
 * Save a notification to localStorage
 */
export function saveNotification(notification: Omit<StoredNotification, 'id' | 'timestamp' | 'isRead'>): void {
    if (typeof window === 'undefined') return

    try {
        const notifications = getNotifications()
        const newNotification: StoredNotification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            isRead: false,
        }

        // Add to beginning of array
        notifications.unshift(newNotification)

        // Keep only the latest MAX_NOTIFICATIONS
        const trimmed = notifications.slice(0, MAX_NOTIFICATIONS)

        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))

        // Dispatch custom event for real-time updates
        window.dispatchEvent(new CustomEvent('notificationsUpdated'))
    } catch (error) {
        console.error('Failed to save notification:', error)
    }
}

/**
 * Get all notifications from localStorage
 */
export function getNotifications(): StoredNotification[] {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return []

        const notifications = JSON.parse(stored) as StoredNotification[]
        return Array.isArray(notifications) ? notifications : []
    } catch (error) {
        console.error('Failed to get notifications:', error)
        return []
    }
}

/**
 * Mark a notification as read
 */
export function markAsRead(id: string): void {
    if (typeof window === 'undefined') return

    try {
        const notifications = getNotifications()
        const updated = notifications.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
        )
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('notificationsUpdated'))
    } catch (error) {
        console.error('Failed to mark notification as read:', error)
    }
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead(): void {
    if (typeof window === 'undefined') return

    try {
        const notifications = getNotifications()
        const updated = notifications.map(notif => ({ ...notif, isRead: true }))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('notificationsUpdated'))
    } catch (error) {
        console.error('Failed to mark all as read:', error)
    }
}

/**
 * Delete a notification
 */
export function deleteNotification(id: string): void {
    if (typeof window === 'undefined') return

    try {
        const notifications = getNotifications()
        const filtered = notifications.filter(notif => notif.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
        window.dispatchEvent(new CustomEvent('notificationsUpdated'))
    } catch (error) {
        console.error('Failed to delete notification:', error)
    }
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.removeItem(STORAGE_KEY)
        window.dispatchEvent(new CustomEvent('notificationsUpdated'))
    } catch (error) {
        console.error('Failed to clear notifications:', error)
    }
}

/**
 * Get unread notification count
 */
export function getUnreadCount(): number {
    const notifications = getNotifications()
    return notifications.filter(n => !n.isRead).length
}
