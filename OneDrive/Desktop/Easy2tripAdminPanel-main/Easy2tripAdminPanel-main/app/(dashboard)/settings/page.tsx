// app/settings/page.tsx
"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SettingsFormData {
  name: string
  email: string
  timezone: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General')
  const [formData, setFormData] = useState<SettingsFormData>({
    name: '',
    email: '',
    timezone: '',
  })

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const tabs = ['General', 'Notifications', 'Appearance', 'Security']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const renderGeneral = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Profile Information</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Update your profile details and contact information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Name
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Timezone
              </label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, timezone: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Americas</SelectLabel>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="cst">Central Time (CT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Europe & Africa</SelectLabel>
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                    <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Asia & Pacific</SelectLabel>
                    <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                    <SelectItem value="aedt">Australian Eastern Time (AET)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button 
                type="submit"
                className="bg-black text-white hover:bg-black/90"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Notification Preferences</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Choose what notifications you want to receive.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about your account activity.
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about security updates.
                </p>
              </div>
              <Switch
                checked={securityAlerts}
                onCheckedChange={setSecurityAlerts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and promotions.
                </p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearance = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Appearance Settings</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Customize how TravelAdmin looks.
            </p>
          </div>
          {/* Add appearance settings here */}
        </div>
      </div>
    </div>
  )

  const renderSecurity = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Security Settings</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your security preferences and password.
            </p>
          </div>
          {/* Add security settings here */}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-medium">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 -mb-px ${
              activeTab === tab
                ? 'border-b-2 border-black font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Section */}
      {activeTab === 'General' && renderGeneral()}
      {activeTab === 'Notifications' && renderNotifications()}
      {activeTab === 'Appearance' && renderAppearance()}
      {activeTab === 'Security' && renderSecurity()}
    </div>
  )
}