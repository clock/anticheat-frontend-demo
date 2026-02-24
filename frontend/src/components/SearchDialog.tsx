import { useRef, useEffect } from 'react'
import { CustomDialog, CustomDialogContent } from '@/components/custom-dialog'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Clock, Shield } from 'lucide-react'
import { UserListItem } from '@/components/UserListItem'
import { User } from '@/types'

interface SearchDialogProps {
  is_open: boolean
  onOpenChange: (open: boolean) => void
  search_query: string
  onSearchChange: (query: string) => void
  filtered_users: User[]
  recent_users: User[]
  is_loading: boolean
  highlighted_index: number
  onHighlightedIndexChange: (index: number) => void
  onUserSelect: (user: User) => void
  has_ever_opened: boolean
  onRemoveRecentUser: (steamid: string) => void
  onClearAllRecent: () => void
}

export function SearchDialog({
  is_open,
  onOpenChange,
  search_query,
  onSearchChange,
  filtered_users,
  recent_users,
  is_loading,
  highlighted_index,
  onHighlightedIndexChange,
  onUserSelect,
  has_ever_opened,
  onRemoveRecentUser,
  onClearAllRecent
}: SearchDialogProps) {
  const input_ref = useRef<HTMLInputElement>(null)
  const result_refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (is_open) {
      const timer = setTimeout(() => {
        if (input_ref.current) {
          input_ref.current.focus()
          if (!search_query) {
            input_ref.current.select()
          } else {
            const len = input_ref.current.value.length
            input_ref.current.setSelectionRange(len, len)
          }
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [is_open, search_query])

  const show_first_time_placeholder = !has_ever_opened
  const show_recent = has_ever_opened && !search_query.trim() && recent_users.length > 0
  const show_search_results = search_query.trim()

  return (
    <CustomDialog open={is_open} onOpenChange={onOpenChange}>
      <CustomDialogContent
        className="max-w-2xl p-0 border-0 bg-transparent shadow-none [&>button]:hidden top-[8%] translate-y-0"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Search users</DialogTitle>
        <DialogDescription className="sr-only">Search for users by SteamID or username</DialogDescription>
        <div className="relative bg-background rounded-xl shadow-2xl border border-secondary/50 overflow-hidden">
          <div className={`flex items-center px-5 py-4 ${
            (show_search_results || show_recent || show_first_time_placeholder) ? 'border-b border-secondary/30' : ''
          }`}>
            <Search className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
            <Input
              ref={input_ref}
              type="text"
              placeholder="Search users by SteamID or username..."
              value={search_query}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent placeholder:text-muted-foreground font-medium text-foreground"
            />
            {search_query && (
              <button
                onClick={() => onSearchChange('')}
                className="ml-2 p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
            <div>
              {show_search_results ? (
                is_loading ? (
                  <div className="p-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg flex items-center gap-3 mx-2 my-1 border border-transparent"
                      >
                        <Skeleton className="h-11 w-11 rounded-lg shrink-0 bg-secondary" />
                        <div className="flex-1 min-w-0 space-y-2">
                          <Skeleton className="h-4 w-32 bg-secondary" />
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-3 w-12 bg-secondary" />
                            <Skeleton className="h-3 w-12 bg-secondary" />
                            <Skeleton className="h-3 w-16 bg-secondary" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered_users.length > 0 ? (
                  <div className="p-2">
                    {filtered_users.map((user, index) => (
                      <div key={user.steamid} ref={el => result_refs.current[index] = el}>
                        <UserListItem
                          user={user}
                          onClick={() => onUserSelect(user)}
                          onMouseEnter={() => onHighlightedIndexChange(index)}
                          isHighlighted={highlighted_index === index}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="p-3 rounded-lg flex items-center gap-3 mx-2 my-1 border border-dashed border-secondary/50 bg-secondary/10">
                      <div className="h-11 w-11 shrink-0 relative flex items-center justify-center bg-secondary/30 rounded-lg">
                        <Shield className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {search_query.trim()}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1.5">
                          <span>No user found</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">User not in database</p>
                  </div>
                )
              ) : show_recent ? (
                <div className="p-2">
                  <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>recent</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onClearAllRecent()
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded hover:bg-secondary/30"
                    >
                      Clear all
                    </button>
                  </div>
                  {recent_users.map((user, index) => (
                    <div key={`recent-${user.steamid}-${index}`} ref={el => result_refs.current[index] = el} className="group relative">
                      <UserListItem
                        user={user}
                        onClick={() => onUserSelect(user)}
                        onMouseEnter={() => onHighlightedIndexChange(index)}
                        isHighlighted={highlighted_index === index}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveRecentUser(user.steamid)
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : show_first_time_placeholder ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-foreground mb-6 font-medium">Start typing to search users...</p>
                  <div className="space-y-2.5 max-w-xs mx-auto">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <kbd className="px-2.5 py-1.5 bg-secondary rounded-lg text-foreground border border-secondary font-semibold shadow-sm min-w-[2.5rem] text-center">
                        ↑↓
                      </kbd>
                      <span className="font-medium">Navigate results</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <kbd className="px-2.5 py-1.5 bg-secondary rounded-lg text-foreground border border-secondary font-semibold shadow-sm min-w-[2.5rem] text-center">
                        Enter
                      </kbd>
                      <span className="font-medium">Select user</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <kbd className="px-2.5 py-1.5 bg-secondary rounded-lg text-foreground border border-secondary font-semibold shadow-sm min-w-[2.5rem] text-center">
                        Esc
                      </kbd>
                      <span className="font-medium">Close search</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  )
}
