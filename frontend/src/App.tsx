import { useState, useLayoutEffect, useMemo, useRef, useEffect } from 'react'
import { Search, Command, Shield, AlertTriangle, Ban, RefreshCw, ArrowUpDown, Flag, Skull } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchDialog } from '@/components/SearchDialog'
import { UserDetailView } from '@/components/UserDetailView'
import { SystemLogsViewer } from '@/components/SystemLogsViewer'
import { AnticheatSettingsView } from '@/components/AnticheatSettingsView'
import { AutomationScriptsView } from '@/components/AutomationScriptsView'
import { MaintenanceModeView } from '@/components/MaintenanceModeView'
import { DemoDisclaimer } from '@/components/DemoDisclaimer'
import { User } from '@/types'
import { FAKE_USERS, searchFakeUsers, FAKE_USER_DETAILS } from '@/utils/fake-data'

const DEMO_USER = { steamUsername: 'Admin', steamId: '76561198000000000' }

function App() {
  const [appReady, setAppReady] = useState(false)
  const [users] = useState<User[]>(FAKE_USERS)
  const [is_search_open, set_is_search_open] = useState(false)
  const [search_query, set_search_query] = useState('')
  const [selected_user, set_selected_user] = useState<User | null>(null)
  const [highlighted_index_raw, set_highlighted_index_raw] = useState(-1)
  const [recent_users, set_recent_users] = useState<User[]>([])
  const [has_ever_opened, set_has_ever_opened] = useState(false)
  const [current_page, set_current_page] = useState(1)
  const users_per_page = 50
  const prev_search_query_ref = useRef(search_query)
  const [sortOrder, setSortOrder] = useState<'priority' | 'online' | 'detections' | 'lastSeen' | 'alphabetical'>('priority')

  useEffect(() => {
    setTimeout(() => setAppReady(true), 50)
  }, [])

  useLayoutEffect(() => {
    if (appReady) {
      const root = document.getElementById('root')
      if (root) root.classList.add('app-ready')
    }
  }, [appReady])

  // Filter users based on search query
  const filtered_users = useMemo(() => {
    return searchFakeUsers(FAKE_USERS, search_query)
  }, [search_query])

  // compute safe highlighted_index during render
  const highlighted_index = useMemo(() => {
    if (!is_search_open) return -1
    const users_to_use = search_query.trim() ? filtered_users : recent_users
    const max_index = users_to_use.length > 0 ? users_to_use.length - 1 : -1
    const search_query_changed = prev_search_query_ref.current !== search_query
    if (users_to_use.length === 0) return -1
    else if (search_query_changed && search_query.trim()) return 0
    else if (highlighted_index_raw > max_index) return max_index
    else if (highlighted_index_raw === -1) return 0
    return highlighted_index_raw
  }, [is_search_open, search_query, filtered_users, recent_users, highlighted_index_raw])

  useEffect(() => {
    if (!is_search_open) return
    const handle_keydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const users_to_use = search_query.trim() ? filtered_users : recent_users
        set_highlighted_index_raw(prev => {
          const current = prev < 0 ? 0 : prev
          return current < users_to_use.length - 1 ? current + 1 : current
        })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        set_highlighted_index_raw(prev => {
          const current = prev < 0 ? 0 : prev
          return current > 0 ? current - 1 : 0
        })
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const users_to_use = search_query.trim() ? filtered_users : recent_users
        const index_to_use = highlighted_index >= 0 ? highlighted_index : 0
        if (users_to_use[index_to_use]) handle_user_select(users_to_use[index_to_use])
      }
    }
    window.addEventListener('keydown', handle_keydown)
    return () => window.removeEventListener('keydown', handle_keydown)
  }, [is_search_open, highlighted_index, search_query, filtered_users, recent_users])

  useLayoutEffect(() => {
    if (prev_search_query_ref.current !== search_query) {
      prev_search_query_ref.current = search_query
      if (search_query.trim()) set_highlighted_index_raw(0)
      else set_highlighted_index_raw(-1)
    }
  }, [search_query])

  useEffect(() => {
    const handle_keydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        set_is_search_open(true)
      }
      if (e.key === 'Backspace' && selected_user && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
        e.preventDefault()
        set_selected_user(null)
      }
      if (e.key === 'Escape' && selected_user) set_selected_user(null)
    }
    window.addEventListener('keydown', handle_keydown)
    return () => window.removeEventListener('keydown', handle_keydown)
  }, [selected_user])

  useLayoutEffect(() => {
    if (is_search_open && !has_ever_opened) set_has_ever_opened(true)
  }, [is_search_open, has_ever_opened])

  const handle_dialog_close = (open: boolean) => {
    if (!open) {
      set_is_search_open(false)
      set_search_query('')
      set_highlighted_index_raw(-1)
    } else {
      set_is_search_open(true)
    }
  }

  const handle_remove_recent_user = (steamid: string) => {
    set_recent_users(prev => prev.filter(u => u.steamid !== steamid))
  }

  const handle_clear_all_recent = () => set_recent_users([])

  const handle_user_select = (user: User) => {
    set_selected_user(user)
    set_is_search_open(false)
    set_search_query('')
    set_recent_users(prev => {
      const filtered = prev.filter(u => u.steamid !== user.steamid)
      return [user, ...filtered].slice(0, 5)
    })
  }

  const handle_back = () => set_selected_user(null)

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      switch (sortOrder) {
        case 'priority':
          if (a.marked_for_ban && !b.marked_for_ban) return -1
          if (!a.marked_for_ban && b.marked_for_ban) return 1
          const getSeverityOrder = (status: string | null | undefined) => {
            if (!status) return 5
            if (status === 'critical') return 0
            if (status === 'high') return 1
            if (status === 'medium') return 2
            if (status === 'manual') return 3
            return 4
          }
          const aSeverity = getSeverityOrder(a.flagged_status)
          const bSeverity = getSeverityOrder(b.flagged_status)
          if (aSeverity !== bSeverity) return aSeverity - bSeverity
          if (a.isOnline && !b.isOnline) return -1
          if (!a.isOnline && b.isOnline) return 1
          return b.total_detections - a.total_detections
        case 'online':
          if (a.isOnline && !b.isOnline) return -1
          if (!a.isOnline && b.isOnline) return 1
          return (a.steam_username || a.steamid).toLowerCase().localeCompare((b.steam_username || b.steamid).toLowerCase())
        case 'detections':
          return b.total_detections - a.total_detections
        case 'lastSeen':
          return b.last_seen - a.last_seen
        case 'alphabetical':
          return (a.steam_username || a.steamid).toLowerCase().localeCompare((b.steam_username || b.steamid).toLowerCase())
        default:
          return 0
      }
    })
  }, [users, sortOrder])

  const total_pages = Math.ceil(sortedUsers.length / users_per_page)
  const paginated_users = sortedUsers.slice(
    (current_page - 1) * users_per_page,
    current_page * users_per_page
  )

  if (!appReady) return null

  if (selected_user) {
    const userDetail = FAKE_USER_DETAILS[selected_user.steamid]
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#44444420_1px,transparent_1px),linear-gradient(to_bottom,#44444420_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#dfd7af10,transparent)]" />
        <div className="relative min-h-screen">
          <div className="container mx-auto px-6 py-8 animate-fade-in-slow">
            <Button
              variant="ghost"
              onClick={handle_back}
              className="mb-6 hover:bg-secondary/50 text-foreground transition-all duration-200 hover:scale-105 active:scale-95"
            >
              ← Back to Dashboard
            </Button>
            {userDetail ? (
              <UserDetailView
                user={selected_user}
                data={userDetail}
                onReload={() => {}}
              />
            ) : (
              <div className="flex items-center justify-center py-12 animate-fade-in">
                <span className="text-muted-foreground">No detail data available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <DemoDisclaimer />
      <div className="min-h-screen relative bg-background overflow-x-hidden" style={{ scrollbarGutter: 'stable' }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#44444420_1px,transparent_1px),linear-gradient(to_bottom,#44444420_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#dfd7af10,transparent)]" />
        <div className="relative min-h-screen">
          {/* Header */}
          <header className="border-b border-secondary/50 bg-background sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-end items-center">
              <div className="flex items-center gap-4">
                <div className="px-2 py-1 rounded bg-primary/10 border border-primary/20 flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">Demo</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{DEMO_USER.steamUsername}</div>
                  <div className="text-xs text-muted-foreground font-mono">{DEMO_USER.steamId}</div>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-6 py-8">
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative">
                <Button
                  onClick={() => set_is_search_open(true)}
                  variant="ghost"
                  className="w-full h-12 text-left justify-start bg-card border border-secondary/30 hover:bg-card hover:border-primary/30 rounded-lg transition-all duration-200 group"
                >
                  <Search className="ml-3 mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="flex-1 text-left text-sm text-muted-foreground group-hover:text-foreground transition-colors">Quick search users...</span>
                  <div className="mr-3 flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50">
                    <Command className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">K</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="users">
              <TabsList className="bg-card border border-secondary/30 p-1 mb-6">
                <TabsTrigger value="users" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground">
                  Users
                </TabsTrigger>
                <TabsTrigger value="logs" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground">
                  System Logs
                </TabsTrigger>
                <TabsTrigger value="automation" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground">
                  Automation
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground">
                  Settings
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground">
                  Maintenance
                </TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users" className="mt-0 overflow-x-hidden">
                <div className="w-full overflow-x-hidden">
                  <Card className="border border-secondary/30 bg-card/50 backdrop-blur-sm w-full max-w-full">
                    <CardHeader className="border-b border-secondary/30 pb-4">
                      <div className="flex items-center justify-between min-w-0 gap-3">
                        <div className="min-w-0 flex-1 flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base font-semibold text-foreground">Users</CardTitle>
                            <CardDescription className="text-muted-foreground text-sm">
                              Showing {((current_page - 1) * users_per_page) + 1}-{Math.min(current_page * users_per_page, sortedUsers.length)} of {sortedUsers.length}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                              <SelectTrigger className="w-[180px] h-8 border-secondary/30 bg-background">
                                <div className="flex items-center gap-2">
                                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="priority">Priority</SelectItem>
                                <SelectItem value="online">Online Status</SelectItem>
                                <SelectItem value="detections">Detections</SelectItem>
                                <SelectItem value="lastSeen">Last Seen</SelectItem>
                                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {}}
                              className="h-8 border-secondary/30 hover:bg-secondary/50"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {total_pages > 1 && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" onClick={() => set_current_page(p => Math.max(1, p - 1))} disabled={current_page === 1} className="h-8 border-secondary/30 hover:bg-secondary/50 disabled:opacity-30">
                              Previous
                            </Button>
                            <div className="text-xs text-muted-foreground px-2">Page {current_page} of {total_pages}</div>
                            <Button variant="outline" size="sm" onClick={() => set_current_page(p => Math.min(total_pages, p + 1))} disabled={current_page === total_pages} className="h-8 border-secondary/30 hover:bg-secondary/50 disabled:opacity-30">
                              Next
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-secondary/20">
                        {paginated_users.map((user) => (
                          <div
                            key={user.steamid}
                            onClick={() => handle_user_select(user)}
                            className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-150 hover:bg-secondary/20"
                          >
                            <div className="h-11 w-11 shrink-0 relative">
                              <img
                                src={user.steam_avatar_url || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'}
                                alt={user.steam_username || user.steamid}
                                className="h-full w-full rounded-lg object-cover"
                              />
                              {user.isOnline ? (
                                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card" />
                              ) : null}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-foreground truncate flex items-center gap-2">
                                {user.steam_username || user.steamid}
                                {user.flagged_status && !user.is_banned ? (
                                  <Flag className={`h-3 w-3 ${user.flagged_status === 'critical' ? 'text-red-400' : 'text-orange-400'}`} />
                                ) : null}
                                {user.marked_for_ban && !user.is_banned ? (
                                  <Skull className="h-3 w-3 text-red-400" />
                                ) : null}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                                <span className="font-mono">{user.steamid}</span>
                                <span>•</span>
                                <span>{user.total_detections} detections</span>
                                <span>•</span>
                                <span>{user.total_sessions} sessions</span>
                              </div>
                            </div>
                            {user.is_banned ? (
                              <div className="shrink-0">
                                <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/30 flex items-center gap-1.5">
                                  <Ban className="h-3 w-3 text-red-400" />
                                  <span className="text-xs font-semibold text-red-400">BANNED</span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="mt-0 overflow-x-hidden">
                <SystemLogsViewer onNavigateToUser={(steamid) => {
                  const user = users.find(u => u.steamid === steamid)
                  if (user) handle_user_select(user)
                }} />
              </TabsContent>

              <TabsContent value="automation" className="mt-0 overflow-x-hidden">
                <AutomationScriptsView />
              </TabsContent>

              <TabsContent value="settings" className="mt-0 overflow-x-hidden">
                <AnticheatSettingsView />
              </TabsContent>

              <TabsContent value="maintenance" className="mt-0 overflow-x-hidden">
                <MaintenanceModeView />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <SearchDialog
          is_open={is_search_open}
          onOpenChange={handle_dialog_close}
          search_query={search_query}
          onSearchChange={set_search_query}
          filtered_users={filtered_users}
          recent_users={recent_users}
          is_loading={false}
          highlighted_index={highlighted_index}
          onHighlightedIndexChange={set_highlighted_index_raw}
          onUserSelect={handle_user_select}
          has_ever_opened={has_ever_opened}
          onRemoveRecentUser={handle_remove_recent_user}
          onClearAllRecent={handle_clear_all_recent}
        />
      </div>
    </>
  )
}

export default App
