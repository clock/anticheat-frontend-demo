import { User } from '@/types'
import { Shield, AlertTriangle, Ban, Flag, Skull } from 'lucide-react'

interface UserListItemProps {
  user: User
  onClick: () => void
  onMouseEnter: () => void
  isHighlighted: boolean
}

export function UserListItem({ user, onClick, onMouseEnter, isHighlighted }: UserListItemProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`p-3 rounded-lg flex items-center gap-3 mx-2 my-1 cursor-pointer border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] animate-fade-in ${
        isHighlighted
          ? 'bg-primary/10 border-primary/30'
          : 'border-transparent hover:bg-secondary/30'
      }`}
    >
      <div className="h-11 w-11 shrink-0 relative">
        <img
          src={user.steam_avatar_url || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'}
          alt={user.steam_username || user.steamid}
          className="h-full w-full rounded-lg object-cover"
        />
        {user.isOnline ? (
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card animate-pulse" />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground truncate">
          {user.steam_username || user.steamid}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-primary" />
            {user.total_detections}
          </span>
          {(() => {
            const warningLevel = Number(user.warning_level)
            if (warningLevel > 0) {
              return (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  {warningLevel}
                </span>
              )
            }
            return null
          })()}
          {user.flagged_status && user.flagged_status !== '0' && user.is_banned !== true && user.is_banned !== 1 ? (
            <span className="flex items-center gap-1">
              <Flag className={`h-3 w-3 ${user.flagged_status === 'critical' ? 'text-red-400' : 'text-orange-400'}`} />
            </span>
          ) : null}
          {user.marked_for_ban && user.is_banned !== true && user.is_banned !== 1 ? (
            <span className="flex items-center gap-1">
              <Skull className="h-3 w-3 text-red-400" />
            </span>
          ) : null}
          <span className="text-muted-foreground font-mono text-[10px]">{user.steamid}</span>
        </div>
      </div>
      {user.is_banned ? (
        <div className="shrink-0">
          <div className="px-2 py-1 rounded bg-destructive/20 border border-destructive/50 flex items-center gap-1.5">
            <Ban className="h-3 w-3 text-destructive" />
            <span className="text-xs font-semibold text-destructive">BANNED</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
