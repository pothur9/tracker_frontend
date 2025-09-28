"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from "lucide-react"
import type { LocationConnectionStatus } from "@/lib/location"

interface ConnectionStatusProps {
  status: LocationConnectionStatus
  onReconnect?: () => void
  compact?: boolean
}

export function ConnectionStatus({ status, onReconnect, compact = false }: ConnectionStatusProps) {
  const getStatusColor = () => {
    if (status.error) return "destructive"
    if (!status.isConnected) return "secondary"
    return "default"
  }

  const getStatusText = () => {
    if (status.error) return "Connection Error"
    if (!status.isConnected) return "Connecting..."
    return "Connected"
  }

  const getStatusIcon = () => {
    if (status.error) return <AlertTriangle className="h-3 w-3" />
    if (!status.isConnected) return <WifiOff className="h-3 w-3" />
    return <Wifi className="h-3 w-3" />
  }

  const formatLastUpdate = () => {
    if (!status.lastUpdate) return "Never"

    const now = new Date()
    const diff = now.getTime() - status.lastUpdate.getTime()
    const seconds = Math.floor(diff / 1000)

    if (seconds < 10) return "Just now"
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor() as any} className="text-xs">
          {getStatusIcon()}
          <span className="ml-1">{getStatusText()}</span>
        </Badge>
        {status.error && onReconnect && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onReconnect}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
        <div className="text-xs text-muted-foreground">Last update: {formatLastUpdate()}</div>
      </div>

      {status.error && onReconnect && (
        <Button variant="outline" size="sm" onClick={onReconnect}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}

      {status.reconnectAttempts > 0 && (
        <div className="text-xs text-muted-foreground">Attempt {status.reconnectAttempts}/5</div>
      )}
    </div>
  )
}
