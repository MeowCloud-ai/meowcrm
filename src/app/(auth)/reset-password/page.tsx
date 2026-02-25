"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MeowCloudLogo } from "@/components/meowcloud-logo"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 8) {
      setError("密碼至少需要 8 個字元")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("密碼不一致")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => {
      router.push("/login")
    }, 3000)
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
              密碼已重設
            </CardTitle>
            <CardDescription>
              您的密碼已成功更新，即將跳轉至登入頁面...
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/login">
              <Button variant="outline">前往登入</Button>
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
            重設密碼
          </CardTitle>
          <CardDescription>請輸入您的新密碼</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">新密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少 8 個字元"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認新密碼</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "重設中..." : "重設密碼"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
