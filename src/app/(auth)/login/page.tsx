"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/constants/routes"
import { fonts } from "@/components/fonts"
import { login } from "@/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await login(email, password)

    if (result.error) {
      setError(result.error)
    } else {
      router.push(ROUTES.DASHBOARD.OVERVIEW)
    }

    setLoading(false)
  }

  return (
    <Card className={`shadow-sm ${fonts.poppins}`}>
      <CardHeader className="space-y-1">
        <CardTitle className={`text-2xl ${fonts.openSans}`}>Login</CardTitle>
        <CardDescription className={`${fonts.rubik}`}>
          Enter your email and password to login to your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Login failed</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button
                variant="link"
                className="text-red-700 hover:text-red-800 p-0 h-auto text-sm mt-2"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className={`${fonts.poppins}`}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={`${fonts.poppins}`}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className={`${fonts.poppins} text-sm`}>
                Remember me
              </Label>
            </div>
          </div>

          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Separator />

            <div className="flex justify-between w-full text-sm">
              <Link className="text-black hover:underline font-medium" href="/signup">
                Create account
              </Link>
              <Link className="text-black hover:underline font-medium" href="/forgot-password">
                Forgot password?
              </Link>
            </div>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

