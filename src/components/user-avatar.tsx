import { toApiAssetUrl } from '#/lib/api-asset-url'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
  src?: string | null
  name?: string
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return 'U'

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function UserAvatar({ src, name = '', className }: UserAvatarProps) {
  const imgUrl = src ? toApiAssetUrl(src) : undefined
  return (
    <Avatar className={className}>
      <AvatarImage src={imgUrl || undefined} alt={name || 'User'} />

      <AvatarFallback className="bg-primary-light/90 text-white font-semibold">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
