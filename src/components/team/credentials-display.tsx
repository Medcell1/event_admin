"use client"

import { useState, useEffect } from "react"
import { Copy, Check, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTitle, AlertDescription } from "@/components/ui/alert"

interface CredentialsDisplayProps {
  credentials: {
    username?: string
    password?: string
  }
  onClose: () => void
}

export default function CredentialsDisplay({ credentials, onClose }: CredentialsDisplayProps) {
  const [countdown, setCountdown] = useState(30)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      onClose()
    }
  }, [countdown, onClose])

  const copyToClipboard = () => {
    const text = `Username: ${credentials.username}\nPassword: ${credentials.password}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-2 border-yellow-300 shadow-lg animate-pulse-once mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 p-2 rounded-full">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-center">
              <AlertTitle className="text-lg font-bold text-yellow-700">
                Important: Save these credentials now!
              </AlertTitle>
              <div className="text-sm font-medium bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                {countdown}s
              </div>
            </div>
            <AlertDescription className="text-yellow-700">
              This information will disappear in {countdown} seconds and cannot be retrieved later.
            </AlertDescription>

            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                <span className="font-medium text-gray-700">Username:</span>
                <span className="font-mono">{credentials.username}</span>

                <span className="font-medium text-gray-700">Password:</span>
                <span className="font-mono">{credentials.password}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Dismiss
        </Button>
        <Button onClick={copyToClipboard} className="gap-2">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Credentials
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
