interface MeowCloudLogoProps {
  size?: number
  className?: string
}

export function MeowCloudLogo({ size = 24, className = "" }: MeowCloudLogoProps) {
  return (
    <svg
      viewBox="0 0 100 80"
      width={size}
      height={size * 0.8} // aspect ratio adjustment
      className={className}
      aria-label="MeowCloud"
    >
      <path
        d="M14,34 L28,8 C30,5 34,5 36,9 L40,20 C43,17 46,16 50,16 C54,16 57,17 60,20 L64,9 C66,5 70,5 72,8 L86,34 C90,40 90,48 86,54 C82,60 70,64 50,64 C30,64 18,60 14,54 C10,48 10,40 14,34Z"
        fill="currentColor"
      />
      {/* Cat eyes - circles */}
      <circle cx="42" cy="35" r="3" fill="#ffffff" />
      <circle cx="58" cy="35" r="3" fill="#ffffff" />
      {/* Glasses bridge */}
      <rect x="45" y="34" width="10" height="2" rx="1" fill="#ffffff" />
    </svg>
  )
}