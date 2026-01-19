import { Camera } from "@phosphor-icons/react/dist/ssr"

interface CameraIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CameraIcon({
  size = 20,
  weight = "regular",
  className = "",
}: CameraIconProps) {
  return <Camera size={size} weight={weight} className={className} />
}
