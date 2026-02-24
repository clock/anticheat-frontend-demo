import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { User } from '@/types'

interface UserCardProps {
  user: User
  selected: boolean
  onSelect: () => void
  onClick: () => void
}

export function UserCard({ user, selected, onSelect, onClick }: UserCardProps) {
  const daysSinceLastSeen = Math.floor((Date.now() - user.last_seen) / (1000 * 60 * 60 * 24))
  
  // determine card background color based on status
  let cardClassName = 'cursor-pointer transition-all hover:border-border '
  if (user.is_banned) {
    cardClassName += 'border-destructive/50 bg-destructive/10'
  } else if (user.isOnline) {
    cardClassName += 'border-green-500/40 bg-green-500/15'
  } else {
    cardClassName += 'border-orange-500/25 bg-orange-500/8'
  }
  
  return (
    <Card
      className={cardClassName}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => {
              onSelect()
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />
          {user.steam_avatar_url ? (
            <img
              src={`/api/avatars/${user.steamid}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-border"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = user.steam_avatar_url || ''
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full border border-border bg-muted flex items-center justify-center text-xs">
              {(user.steam_username || user.steamid).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">
                {user.steam_username || user.steamid}
              </h3>
              {user.warning_level >= 3 && <Badge variant="destructive">CRITICAL</Badge>}
              {user.warning_level === 2 && <Badge variant="destructive">HIGH</Badge>}
              {user.warning_level === 1 && <Badge variant="secondary">WARN</Badge>}
              {user.has_suspicious_traces && !user.warning_level && (
                <Badge variant="outline" className="border-muted-foreground/30">SUSP</Badge>
              )}
              {user.is_banned && <Badge variant="destructive">Banned</Badge>}
              {user.total_detections > 0 ? (
                <Badge variant={user.total_detections > 5 ? "destructive" : "secondary"}>
                  {user.total_detections} Detection{user.total_detections !== 1 ? 's' : ''}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-muted-foreground/30">Clean</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{user.steamid}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Detections</div>
                <div className="font-medium">{user.total_detections}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Sessions</div>
                <div className="font-medium">{user.total_sessions}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">First Seen</div>
                <div className="font-medium">{new Date(user.first_seen).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Last Seen</div>
                <div className="font-medium">
                  {daysSinceLastSeen === 0 ? 'Today' : daysSinceLastSeen === 1 ? 'Yesterday' : `${daysSinceLastSeen} days ago`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

