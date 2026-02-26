"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

interface Organization {
  id: string
  name: string
  plan: string
  trial_ends_at: string | null
}

interface OrganizationContextType {
  organization: Organization | null
  loading: boolean
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  loading: true,
})

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadOrganization() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Check if user has org_id in app_metadata
      const orgId = user.app_metadata?.org_id

      if (orgId) {
        const { data: org } = await supabase
          .from("organizations")
          .select("id, name, plan, trial_ends_at")
          .eq("id", orgId)
          .single()

        if (org) {
          setOrganization(org)
          setLoading(false)
          return
        }
      }

      // No org found — create one
      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + 14)

      const { data: newOrg, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: `${user.email} 的組織`,
          plan: 'trial',
          trial_ends_at: trialEndsAt.toISOString(),
        })
        .select("id, name, plan, trial_ends_at")
        .single()

      if (orgError || !newOrg) {
        console.error("Failed to create organization:", orgError)
        setLoading(false)
        return
      }

      // Add user as owner
      await supabase.from("org_members").insert({
        org_id: newOrg.id,
        user_id: user.id,
        role: "owner",
      })

      // Update user's app_metadata with org_id (via server action or edge function)
      // For now we store it client-side
      setOrganization(newOrg)
      setLoading(false)
    }

    loadOrganization()
  }, [supabase])

  return (
    <OrganizationContext.Provider value={{ organization, loading }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  return useContext(OrganizationContext)
}
