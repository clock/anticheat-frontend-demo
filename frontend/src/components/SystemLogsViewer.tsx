import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FAKE_SYSTEM_LOGS, FakeLog } from '@/utils/fake-data'

export function SystemLogsViewer({ onNavigateToUser }: { onNavigateToUser?: (steamid: string) => void }) {
  const [logs, setLogs] = useState<FakeLog[]>([])
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterSteamid, setFilterSteamid] = useState<string>('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(3)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const logsContainerRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef<boolean>(true)

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'all' && log.level !== filterLevel) return false
    if (filterSteamid) {
      const meta = log.metadata ? (() => { try { return JSON.parse(log.metadata!) } catch { return null } })() : null
      const hasSteamid = meta?.steamid?.includes(filterSteamid) || log.message.includes(filterSteamid)
      if (!hasSteamid) return false
    }
    return true
  })

  const stats = {
    total: filteredLogs.length,
    by_level: (['info', 'warn', 'error', 'debug'] as const).map(level => ({
      level,
      count: logs.filter(l => l.level === level).length
    })).filter(s => s.count > 0)
  }

  const checkIfAtBottom = () => {
    if (!logsContainerRef.current) return false
    const container = logsContainerRef.current
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    return distanceFromBottom < 100
  }

  const handleScroll = () => {
    const atBottom = checkIfAtBottom()
    setIsAtBottom(atBottom)
    shouldAutoScrollRef.current = atBottom
  }

  // Load initial logs
  useEffect(() => {
    setLogs(FAKE_SYSTEM_LOGS)
  }, [])

  // Scroll to bottom on initial load
  useEffect(() => {
    if (logs.length > 0 && logsContainerRef.current) {
      requestAnimationFrame(() => {
        if (logsContainerRef.current) {
          logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
          setIsAtBottom(true)
        }
      })
    }
  }, [])

  // Auto-refresh: simulate new log entries appearing
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      if (shouldAutoScrollRef.current && logsContainerRef.current) {
        logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
      }
    }, refreshInterval * 1000)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  // Scroll to bottom when logs change and user was at bottom
  useEffect(() => {
    if (logs.length === 0) return
    if (shouldAutoScrollRef.current && logsContainerRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (logsContainerRef.current && shouldAutoScrollRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
            setIsAtBottom(true)
          }
        })
      })
    }
  }, [logs.length])

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'text-red-400'
      case 'warn': return 'text-yellow-400'
      case 'info': return 'text-blue-400'
      case 'debug': return 'text-gray-400'
      default: return 'text-gray-300'
    }
  }

  const getLevelBg = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'bg-red-500/15 border-red-500/40'
      case 'warn': return 'bg-yellow-500/15 border-yellow-500/40'
      case 'info': return 'bg-blue-500/15 border-blue-500/40'
      case 'debug': return 'bg-gray-500/10 border-gray-500/30'
      default: return 'bg-gray-500/5 border-gray-500/20'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${hours}:${minutes}:${seconds} ${ampm}`
  }

  const parseMetadata = (metadata: string | null) => {
    if (!metadata) return null
    try { return JSON.parse(metadata) } catch { return null }
  }

  const extractSteamIdsFromMessage = (message: string): string[] => {
    const steamIdPattern = /(?:SteamID:\s*|for\s+\w+\s+|\(|^|\s)(\d{17})(?:\)|\s|:|$|-)/gi
    const matches = message.matchAll(steamIdPattern)
    const steamIds: string[] = []
    for (const match of matches) {
      if (match[1] && !steamIds.includes(match[1])) steamIds.push(match[1])
    }
    return steamIds
  }

  const renderMessageWithClickableSteamIds = (message: string) => {
    const steamIds = extractSteamIdsFromMessage(message)
    if (steamIds.length === 0) return <span>{message}</span>

    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0
    const pattern = /(SteamID:\s*|for\s+)?(\()(\d{17})(\))/gi
    let match

    while ((match = pattern.exec(message)) !== null) {
      if (match.index > lastIndex) parts.push(message.substring(lastIndex, match.index))
      const steamId = match[3]
      const prefix1 = match[1] || ''
      const prefix2 = match[2]
      const suffix = match[4] || ''
      parts.push(
        <span key={`steamid-${match.index}`}>
          <span>{prefix1}{prefix2}</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (onNavigateToUser) onNavigateToUser(steamId)
            }}
            className="text-primary/80 hover:text-primary cursor-pointer border-b border-dashed border-primary/30 hover:border-primary/50 transition-colors"
          >
            {steamId}
          </a>
          <span>{suffix}</span>
        </span>
      )
      lastIndex = pattern.lastIndex
    }

    if (parts.length === 0) {
      lastIndex = 0
      const altPattern = /(SteamID:\s*|for\s+)(\d{17})([\s:,-]|$)/gi
      while ((match = altPattern.exec(message)) !== null) {
        if (match.index > lastIndex) parts.push(message.substring(lastIndex, match.index))
        const steamId = match[2]
        const prefix = match[1]
        const suffix = match[3] || ''
        parts.push(
          <span key={`steamid-alt-${match.index}`}>
            <span>{prefix}</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (onNavigateToUser) onNavigateToUser(steamId)
              }}
              className="text-primary/80 hover:text-primary cursor-pointer border-b border-dashed border-primary/30 hover:border-primary/50 transition-colors"
            >
              {steamId}
            </a>
            <span>{suffix}</span>
          </span>
        )
        lastIndex = altPattern.lastIndex
      }
    }

    if (lastIndex < message.length) parts.push(message.substring(lastIndex))
    return parts.length > 0 ? <span>{parts}</span> : <span>{message}</span>
  }

  return (
    <Card className="border border-secondary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-secondary/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">System Logs</CardTitle>
            <CardDescription>Real-time system logs and events</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={autoRefresh}
                onCheckedChange={(checked) => setAutoRefresh(checked as boolean)}
                id="auto-refresh"
              />
              <label htmlFor="auto-refresh" className="text-sm text-muted-foreground cursor-pointer">
                Auto-refresh
              </label>
            </div>
            {autoRefresh && (
              <Select value={refreshInterval.toString()} onValueChange={(v) => setRefreshInterval(parseInt(v))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1s</SelectItem>
                  <SelectItem value="2">2s</SelectItem>
                  <SelectItem value="3">3s</SelectItem>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" size="sm" onClick={() => setLogs([...FAKE_SYSTEM_LOGS])}>
              Refresh
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warn">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter by SteamID..."
            value={filterSteamid}
            onChange={(e) => setFilterSteamid(e.target.value)}
            className="w-48"
          />
          {filterSteamid && (
            <Button variant="ghost" size="sm" onClick={() => setFilterSteamid('')}>
              Clear
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>Total: {stats.total}</span>
          {stats.by_level.map((stat) => (
            <span key={stat.level}>{stat.level}: {stat.count}</span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={logsContainerRef}
          onScroll={handleScroll}
          className="bg-background/50 text-foreground font-mono text-xs h-[600px] overflow-y-auto p-3 space-y-0.5 custom-scrollbar scrollbar-hide"
          style={{ fontFamily: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace' }}
        >
          {filteredLogs.map((log, idx) => {
            const metadata = parseMetadata(log.metadata)
            const steamid = metadata?.steamid
            const isNew = idx >= filteredLogs.length - 10
            return (
              <div
                key={log.id}
                className={`border-l-2 pl-3 py-1 ${getLevelBg(log.level)} transition-all ${isNew ? 'animate-[fadeInSlide_0.3s_ease-out_forwards]' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <span className={`font-semibold ${getLevelColor(log.level)} min-w-[60px]`}>
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-muted-foreground font-mono text-xs whitespace-nowrap mr-2">
                    {formatTimestamp(log.created_at)}
                  </span>
                  <span className="flex-1 text-foreground/90">
                    {renderMessageWithClickableSteamIds(log.message)}
                  </span>
                  {steamid && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (onNavigateToUser) onNavigateToUser(steamid)
                      }}
                      className="text-xs font-mono px-2 py-1 rounded bg-muted/30 hover:bg-muted/50 border border-border/50 hover:border-border transition-all cursor-pointer text-muted-foreground hover:text-foreground relative z-10 no-underline"
                    >
                      {steamid}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={logsEndRef} />
        </div>
      </CardContent>
    </Card>
  )
}
