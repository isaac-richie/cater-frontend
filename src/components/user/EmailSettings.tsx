'use client'

import { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Mail, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { updateUserEmail, getUser, type User } from '@/lib/api/users'
import { useToast } from '@/components/ui/toast'

interface EmailSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailSettings({ isOpen, onClose }: EmailSettingsProps) {
  const account = useActiveAccount()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const walletAddress = account?.address

  // Fetch user data when modal opens
  useEffect(() => {
    if (isOpen && walletAddress) {
      fetchUser()
    }
  }, [isOpen, walletAddress])

  const fetchUser = async () => {
    if (!walletAddress) return

    setLoading(true)
    try {
      const userData = await getUser(walletAddress)
      setUser(userData)
      if (userData?.email) {
        setEmail(userData.email)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEmail = async () => {
    if (!walletAddress) {
      addToast({
        type: 'error',
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to update email',
      })
      return
    }

    if (!email || !email.includes('@')) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
      })
      return
    }

    setSaving(true)
    try {
      const result = await updateUserEmail(walletAddress, email)

      if (result.success) {
        setUser(result.user)
        addToast({
          type: 'success',
          title: 'Email Updated!',
          description: result.message || 'Please check your inbox to verify your email',
          duration: 6000,
        })
      } else {
        addToast({
          type: 'error',
          title: 'Failed to Update Email',
          description: result.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Error updating email:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update email',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleResendVerification = async () => {
    if (!walletAddress || !email) return

    setVerifying(true)
    try {
      const result = await updateUserEmail(walletAddress, email)

      if (result.success && result.emailSent) {
        addToast({
          type: 'success',
          title: 'Verification Email Sent!',
          description: 'Please check your inbox',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Failed to Send Email',
          description: 'Please try again',
        })
      }
    } catch (error) {
      console.error('Error resending verification:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to resend verification email',
      })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </DialogTitle>
          <DialogDescription>
            Add your email to receive price alert notifications
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Email Status */}
            {user?.email && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Email
                  </span>
                  {user.email_verified ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                {!user.email_verified && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Please check your inbox and click the verification link
                  </p>
                )}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We'll send price alert notifications to this email
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {user?.email && !user.email_verified && (
                <Button
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={verifying}
                  className="flex-1"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleSaveEmail}
                disabled={saving || !email || !email.includes('@')}
                className="flex-1 polycaster-gradient hover:opacity-90 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : user?.email ? (
                  'Update Email'
                ) : (
                  'Save Email'
                )}
              </Button>
            </div>

            {/* Info */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> You must verify your email before receiving price alert notifications. 
                Check your inbox after saving your email.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

