import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold font-heading">Forgot Password</CardTitle>
        <CardDescription className="font-sans">Enter your email to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-sans">
                Email
              </Label>
              <Input id="email" placeholder="m@example.com" required type="email" className="font-sans" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full bg-primary hover:bg-primary/90 font-sans" type="submit">
          Reset Password
        </Button>
        <div className="text-sm text-center space-x-1 font-sans">
          <span className="text-muted-foreground">Remember your password?</span>
          <Link className="text-primary hover:underline font-medium" href="/login">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

