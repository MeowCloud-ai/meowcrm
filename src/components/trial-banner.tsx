"use client"

import { useOrganization } from "@/lib/hooks/use-organization"
import { AlertTriangle, Sparkles } from "lucide-react"

export function TrialBanner() {
  const { organization } = useOrganization()
  
  if (!organization || organization.plan !== 'trial' || !organization.trial_ends_at) return null
  
  const now = new Date()
  const trialEnd = new Date(organization.trial_ends_at)
  const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysLeft < 0) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-center text-sm flex items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        試用期已結束。升級方案以繼續使用所有功能。
        <button className="ml-2 underline font-semibold hover:no-underline">升級方案</button>
      </div>
    )
  }
  
  if (daysLeft <= 3) {
    return (
      <div className="bg-gradient-to-r from-mc-gold-500 to-mc-gold-600 text-white px-4 py-2 text-center text-sm flex items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        試用期剩餘 {daysLeft} 天。
        <button className="ml-2 underline font-semibold hover:no-underline">升級方案</button>
      </div>
    )
  }
  
  if (daysLeft <= 7) {
    return (
      <div className="bg-gradient-to-r from-mc-primary-500 to-mc-pink-500 text-white px-4 py-2 text-center text-sm flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4" />
        免費試用中 — 剩餘 {daysLeft} 天全功能體驗
      </div>
    )
  }
  
  return null
}
