interface MeowCloudLogoProps {
  size?: number
  className?: string
}

export function MeowCloudLogo({ size = 24, className = "" }: MeowCloudLogoProps) {
  return (
    <svg
      viewBox="0 0 100 80"
      width={size}
      height={size * 0.8}
      className={className}
      aria-label="MeowCloud"
    >
      {/* Cat head */}
      <path
        d="M14,34 L28,8 C30,5 34,5 36,9 L40,20 C43,17 46,16 50,16 C54,16 57,17 60,20 L64,9 C66,5 70,5 72,8 L86,34 C90,40 90,48 86,54 C82,60 70,64 50,64 C30,64 18,60 14,54 C10,48 10,40 14,34Z"
        fill="currentColor"
      />
      {/* Round glasses frames */}
      <circle cx="36" cy="40" r="10" fill="none" stroke="#fff" strokeWidth="2.5" />
      <circle cx="64" cy="40" r="10" fill="none" stroke="#fff" strokeWidth="2.5" />
      {/* Glasses bridge */}
      <path d="M46,40 Q50,36 54,40" fill="none" stroke="#fff" strokeWidth="2.5" />
      {/* Smile eyes ∪∪ */}
      <path d="M30,40 Q36,46 42,40" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M58,40 Q64,46 70,40" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
