import { MeowCloudLogo } from "@/components/meowcloud-logo"

export function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="animate-spin-slow">
        <MeowCloudLogo size={48} className="text-mc-primary-500" />
      </div>
    </div>
  )
}
