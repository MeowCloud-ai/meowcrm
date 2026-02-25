"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MeowCloudLogo } from "@/components/meowcloud-logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-white via-mc-primary-50/20 to-mc-pink-50/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-mc-primary-600 via-mc-pink-500 to-mc-gold-500 p-3 rounded-xl">
                <MeowCloudLogo size={24} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-mc-primary-600 to-mc-pink-600 bg-clip-text text-transparent">
              郵件已寄出
            </CardTitle>
            <CardDescription>
              已寄出重設密碼郵件，請檢查您的信箱。
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/login">
              <Button variant="outline">返回登入</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-white via-mc-primary-50/20 to-mc-pink-50/20">
      {/* Aurora Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-mc-primary-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-bl from-mc-pink-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <Card className="relative w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-mc-primary-600 via-mc-pink-500 to-mc-gold-500 p-3 rounded-xl">
              <MeowCloudLogo size={24} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-mc-primary-600 to-mc-pink-600 bg-clip-text text-transparent">
            忘記密碼
          </CardTitle>
          <CardDescription>輸入您的電子郵件，我們將寄送重設密碼連結</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "寄送中..." : "寄送重設連結"}
            </Button>
            <p className="text-sm text-muted-foreground">
              記起密碼了？{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                返回登入
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
