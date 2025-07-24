"use client"

import { useState } from 'react'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  HelpCircle, 
  LogOut,
  Camera,
  Edit3,
  Check,
  X,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTheme } from 'next-themes'
import { SignInButton, SignOutButton } from '@clerk/nextjs'

interface SettingsPanelProps {
  children: React.ReactNode
}

export function SettingsPanel({ children }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('account')
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [userName, setUserName] = useState('John Doe')
  const [userStatus, setUserStatus] = useState('Available')
  const [tempName, setTempName] = useState(userName)
  const [tempStatus, setTempStatus] = useState(userStatus)
  const { theme, setTheme } = useTheme()

  const [settings, setSettings] = useState({
    notifications: {
      messageNotifications: true,
      soundEnabled: true,
      desktopNotifications: true,
      emailNotifications: false,
    },
    privacy: {
      readReceipts: true,
      lastSeen: true,
      profilePhoto: 'everyone',
      status: 'contacts',
    },
    appearance: {
      fontSize: 'medium',
      messagePreview: true,
      compactMode: false,
    },
    language: 'english'
  })

  const handleSaveName = () => {
    setUserName(tempName)
    setIsEditingName(false)
  }

  const handleCancelName = () => {
    setTempName(userName)
    setIsEditingName(false)
  }

  const handleSaveStatus = () => {
    setUserStatus(tempStatus)
    setIsEditingStatus(false)
  }

  const handleCancelStatus = () => {
    setTempStatus(userStatus)
    setIsEditingStatus(false)
  }

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updatePrivacySetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }))
  }

  const updateAppearanceSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }))
  }

  const menuItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ]

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <Avatar className="w-24 h-24">
            <AvatarImage src="https://images.pexels.com/photos/1571576/pexels-photo-1571576.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1" />
            <AvatarFallback className="text-2xl">{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
            variant="secondary"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
          <div className="flex items-center space-x-2 mt-1">
            {isEditingName ? (
              <>
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSaveName}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelName}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 py-2">{userName}</span>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingName(true)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            value="john.doe@example.com"
            disabled
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="status" className="text-sm font-medium">Status</Label>
          <div className="flex items-center space-x-2 mt-1">
            {isEditingStatus ? (
              <>
                <Input
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSaveStatus}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelStatus}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 py-2">{userStatus}</span>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingStatus(true)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
          <Input
            id="phone"
            value="+1 (555) 123-4567"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Message Notifications</Label>
            <p className="text-xs text-muted-foreground">Get notified when you receive new messages</p>
          </div>
          <Switch
            checked={settings.notifications.messageNotifications}
            onCheckedChange={(checked) => updateNotificationSetting('messageNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Sound</Label>
            <p className="text-xs text-muted-foreground">Play sound for notifications</p>
          </div>
          <Switch
            checked={settings.notifications.soundEnabled}
            onCheckedChange={(checked) => updateNotificationSetting('soundEnabled', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Desktop Notifications</Label>
            <p className="text-xs text-muted-foreground">Show notifications on desktop</p>
          </div>
          <Switch
            checked={settings.notifications.desktopNotifications}
            onCheckedChange={(checked) => updateNotificationSetting('desktopNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Email Notifications</Label>
            <p className="text-xs text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch
            checked={settings.notifications.emailNotifications}
            onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', checked)}
          />
        </div>
      </div>
    </div>
  )

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Read Receipts</Label>
            <p className="text-xs text-muted-foreground">Let others know when you've read their messages</p>
          </div>
          <Switch
            checked={settings.privacy.readReceipts}
            onCheckedChange={(checked) => updatePrivacySetting('readReceipts', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Last Seen</Label>
            <p className="text-xs text-muted-foreground">Show when you were last active</p>
          </div>
          <Switch
            checked={settings.privacy.lastSeen}
            onCheckedChange={(checked) => updatePrivacySetting('lastSeen', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Profile Photo Visibility</Label>
          <Select
            value={settings.privacy.profilePhoto}
            onValueChange={(value) => updatePrivacySetting('profilePhoto', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="everyone">Everyone</SelectItem>
              <SelectItem value="contacts">My Contacts</SelectItem>
              <SelectItem value="nobody">Nobody</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Status Visibility</Label>
          <Select
            value={settings.privacy.status}
            onValueChange={(value) => updatePrivacySetting('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="everyone">Everyone</SelectItem>
              <SelectItem value="contacts">My Contacts</SelectItem>
              <SelectItem value="nobody">Nobody</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Theme</Label>
          <div className="flex space-x-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className="flex-1"
            >
              <Sun className="h-4 w-4 mr-2" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="flex-1"
            >
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('system')}
              className="flex-1"
            >
              <Monitor className="h-4 w-4 mr-2" />
              System
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Size</Label>
          <Select
            value={settings.appearance.fontSize}
            onValueChange={(value) => updateAppearanceSetting('fontSize', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Message Preview</Label>
            <p className="text-xs text-muted-foreground">Show message preview in notifications</p>
          </div>
          <Switch
            checked={settings.appearance.messagePreview}
            onCheckedChange={(checked) => updateAppearanceSetting('messagePreview', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Compact Mode</Label>
            <p className="text-xs text-muted-foreground">Use compact layout for messages</p>
          </div>
          <Switch
            checked={settings.appearance.compactMode}
            onCheckedChange={(checked) => updateAppearanceSetting('compactMode', checked)}
          />
        </div>
      </div>
    </div>
  )

  const renderLanguageSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Language</Label>
        <Select
          value={settings.language}
          onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Español</SelectItem>
            <SelectItem value="french">Français</SelectItem>
            <SelectItem value="german">Deutsch</SelectItem>
            <SelectItem value="italian">Italiano</SelectItem>
            <SelectItem value="portuguese">Português</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderHelpSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Quark Chat v2.1.0</h3>
          <p className="text-sm text-muted-foreground">
            The latest version with improved performance and new features.
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help Center
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="h-4 w-4 mr-2" />
            Privacy Policy
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Globe className="h-4 w-4 mr-2" />
            Terms of Service
          </Button>
        </div>

        <Separator />

       <SignOutButton>
       <Button variant="destructive" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
       </SignOutButton>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSection()
      case 'notifications':
        return renderNotificationsSection()
      case 'privacy':
        return renderPrivacySection()
      case 'appearance':
        return renderAppearanceSection()
      case 'language':
        return renderLanguageSection()
      case 'help':
        return renderHelpSection()
      default:
        return renderAccountSection()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </SheetTitle>
          <SheetDescription>
            Manage your account and application preferences
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-full mt-6">
          {/* Settings Menu */}
          <div className="w-1/3 pr-4 border-r">
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start text-left h-auto py-3 px-2"
                      onClick={() => setActiveSection(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-xs truncate">{item.label}</span>
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Settings Content */}
          <div className="flex-1 pl-4">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {menuItems.find(item => item.id === activeSection)?.label}
                  </h3>
                  {renderContent()}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}