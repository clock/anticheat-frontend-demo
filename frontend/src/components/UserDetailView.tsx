import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronRight, Flag, Skull, AlertTriangle, Shield, Ban } from 'lucide-react'
import { UserDetailData, detectionTypeInfo, Detection } from '@/types'
import { UserScriptEditor } from './UserScriptEditor'

interface UserDetailViewProps {
  user: any
  data: UserDetailData
  onReload: () => void
}

export function UserDetailView({ user, data, onReload }: UserDetailViewProps) {
  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['detections']))
  const [expandedDetectionTypes, setExpandedDetectionTypes] = useState<Set<number>>(new Set())

  // Dialog state
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [showUnbanDialog, setShowUnbanDialog] = useState(false)
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [showUnflagDialog, setShowUnflagDialog] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [flagReason, setFlagReason] = useState('')

  const detections = data.detections || []
  
  // Separate server-side detections (from SourceMod)
  const serverSideDetections = useMemo(() => {
    const filtered = detections.filter((d: Detection) => d.session_id === 'sourcemod')
    console.log('[UserDetailView] Total detections:', detections.length)
    console.log('[UserDetailView] Server-side detections:', filtered.length)
    console.log('[UserDetailView] Detection session_ids:', detections.map((d: Detection) => d.session_id))
    return filtered
  }, [detections])

  const clientSideDetections = useMemo(() => {
    return detections.filter((d: Detection) => d.session_id !== 'sourcemod')
  }, [detections])
  
  const session = data.active_session
  const nameHistory = data.name_history || []
  const ipHistory = data.ip_history || []
  const modules = data.modules || []
  const hwidHistory = data.hwid_history || []
  const kickEvents = data.kick_events || []
  const fingerprintTraces = data.fingerprint_traces || []
  const warningLevel = data.warning_level || 0
  const hasSuspiciousTraces = data.has_suspicious_traces || false
  const hasSharedTraces = data.has_shared_traces || false

  // Handle history state
  const [handleHistory, setHandleHistory] = useState<any[]>([])
  const [loadingHandles, setLoadingHandles] = useState(false)
  const [handlesLoaded, setHandlesLoaded] = useState(false)

  // File download state
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null)
  const [fileDownloadError, setFileDownloadError] = useState<string | null>(null)

  // Download queue state
  const [downloadQueue, setDownloadQueue] = useState<any[]>([])
  const [loadingQueue, setLoadingQueue] = useState(false)
  const [queueLoaded, setQueueLoaded] = useState(false)

  // Downloaded files state
  const [downloadedFiles, setDownloadedFiles] = useState<any[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [filesLoaded, setFilesLoaded] = useState(false)

  // Loaded modules state (from client scanning)
  const [loadedModules, setLoadedModules] = useState<any[]>([])
  const [loadingModules, setLoadingModules] = useState(false)
  const [modulesLoaded, setModulesLoaded] = useState(false)

  // Running processes state (from client scanning)
  const [runningProcesses, setRunningProcesses] = useState<any[]>([])
  const [loadingProcesses, setLoadingProcesses] = useState(false)
  const [processesLoaded, setProcessesLoaded] = useState(false)

  const demoAlert = () => alert('Demo mode — actions are disabled.')

  // Download a module file from the client
  const downloadModule = async (_modulePath: string, _moduleName: string) => {
    demoAlert()
  }

  // Fetch handle history when handles section is expanded
  const fetchHandleHistory = () => {
    if (handlesLoaded || loadingHandles) return
    setHandleHistory(data.handle_history || [])
    setHandlesLoaded(true)
  }

  // Fetch loaded modules from client scanning
  const fetchLoadedModules = () => {
    if (modulesLoaded || loadingModules) return
    setLoadedModules(data.loaded_modules || [])
    setModulesLoaded(true)
  }

  // Fetch running processes from client scanning
  const fetchRunningProcesses = () => {
    if (processesLoaded || loadingProcesses) return
    setRunningProcesses(data.running_processes || [])
    setProcessesLoaded(true)
  }

  // Fetch download queue
  const fetchDownloadQueue = () => {
    if (queueLoaded || loadingQueue) return
    setDownloadQueue([])
    setQueueLoaded(true)
  }

  // Add file to download queue
  const queueFileDownload = (_filePath: string, _fileName: string) => { demoAlert() }

  // Remove file from download queue
  const removeFromQueue = (_queueId: number) => { demoAlert() }

  // Fetch downloaded files
  const fetchDownloadedFiles = () => {
    if (filesLoaded || loadingFiles) return
    setDownloadedFiles([])
    setFilesLoaded(true)
  }

  // Download a file from the server
  const downloadSavedFile = (_fileName: string) => { demoAlert() }

  // Load download queue and files when modules section expands
  useEffect(() => {
    if (expandedSections.has('modules')) {
      if (!queueLoaded) fetchDownloadQueue()
      if (!filesLoaded) fetchDownloadedFiles()
    }
  }, [expandedSections])

  // Helper to format access rights as hex
  const formatAccessRights = (rights: number) => {
    return '0x' + rights.toString(16).toUpperCase().padStart(8, '0')
  }

  // Helper to decode Windows process access rights into human-readable flags
  const decodeAccessRights = (rights: number): string[] => {
    const flags: string[] = []

    // Standard access rights
    if (rights === 0x001FFFFF) return ['PROCESS_ALL_ACCESS']

    // Specific process access rights
    if (rights & 0x0001) flags.push('TERMINATE')
    if (rights & 0x0002) flags.push('CREATE_THREAD')
    if (rights & 0x0008) flags.push('VM_OPERATION')
    if (rights & 0x0010) flags.push('VM_READ')
    if (rights & 0x0020) flags.push('VM_WRITE')
    if (rights & 0x0040) flags.push('DUP_HANDLE')
    if (rights & 0x0080) flags.push('CREATE_PROCESS')
    if (rights & 0x0100) flags.push('SET_QUOTA')
    if (rights & 0x0200) flags.push('SET_INFORMATION')
    if (rights & 0x0400) flags.push('QUERY_INFORMATION')
    if (rights & 0x0800) flags.push('SUSPEND_RESUME')
    if (rights & 0x1000) flags.push('QUERY_LIMITED_INFO')

    // Standard rights (high bits)
    if (rights & 0x00100000) flags.push('SYNCHRONIZE')
    if (rights & 0x00010000) flags.push('DELETE')
    if (rights & 0x00020000) flags.push('READ_CONTROL')
    if (rights & 0x00040000) flags.push('WRITE_DAC')
    if (rights & 0x00080000) flags.push('WRITE_OWNER')

    return flags.length > 0 ? flags : ['UNKNOWN']
  }

  // Aggregate handles by process name - deduplicate repeated entries
  const aggregatedHandles = useMemo(() => {
    const handleMap = new Map<string, {
      owner_process_name: string
      owner_process_id: number
      target_process_id: number
      access_rights: number
      handle_value: number
      is_suspicious: boolean
      is_whitelisted: boolean
      exe_path: string | null
      first_seen: number
      last_seen: number
      occurrence_count: number
    }>()

    handleHistory.forEach((handle: any) => {
      // Create a unique key based on process name and access rights
      const key = `${handle.owner_process_name}-${handle.access_rights}`
      const existing = handleMap.get(key)

      if (existing) {
        // Update existing entry
        const wasMostRecent = handle.timestamp > existing.last_seen
        existing.last_seen = Math.max(existing.last_seen, handle.timestamp)
        existing.first_seen = Math.min(existing.first_seen, handle.timestamp)
        existing.occurrence_count++
        // Keep the most recent PID and handle value
        if (wasMostRecent) {
          existing.owner_process_id = handle.owner_process_id
          existing.handle_value = handle.handle_value
        }
        // Preserve exe_path if available (prefer most recent one that has a path)
        if (handle.exe_path && (!existing.exe_path || wasMostRecent)) {
          existing.exe_path = handle.exe_path
        }
      } else {
        // Create new entry
        handleMap.set(key, {
          owner_process_name: handle.owner_process_name,
          owner_process_id: handle.owner_process_id,
          target_process_id: handle.target_process_id,
          access_rights: handle.access_rights,
          handle_value: handle.handle_value,
          is_suspicious: handle.is_suspicious,
          is_whitelisted: handle.is_whitelisted,
          exe_path: handle.exe_path || null,
          first_seen: handle.timestamp,
          last_seen: handle.timestamp,
          occurrence_count: 1
        })
      }
    })

    // Convert to array and sort by last_seen (most recent first)
    return Array.from(handleMap.values()).sort((a, b) => b.last_seen - a.last_seen)
  }, [handleHistory])

  // Smart detection grouping (client-side only)
  const groupedDetections = useMemo(() => {
    const groups = new Map<number, {
      type: number
      count: number
      firstSeen: number
      lastSeen: number
      detections: Detection[]
      severity: 'critical' | 'high' | 'medium' | 'low'
    }>()

    clientSideDetections.forEach((detection: Detection) => {
      const existing = groups.get(detection.detection_type)
      const severity = detectionTypeInfo[detection.detection_type]?.severity || 'low'

      if (existing) {
        existing.count++
        existing.firstSeen = Math.min(existing.firstSeen, detection.timestamp)
        existing.lastSeen = Math.max(existing.lastSeen, detection.timestamp)
        existing.detections.push(detection)
      } else {
        groups.set(detection.detection_type, {
          type: detection.detection_type,
          count: 1,
          firstSeen: detection.timestamp,
          lastSeen: detection.timestamp,
          detections: [detection],
          severity
        })
      }
    })

    return Array.from(groups.values()).sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  }, [clientSideDetections])

  // Group server-side detections
  const groupedServerDetections = useMemo(() => {
    const groups = new Map<number, {
      type: number
      count: number
      firstSeen: number
      lastSeen: number
      detections: Detection[]
      severity: 'critical' | 'high' | 'medium' | 'low'
    }>()

    serverSideDetections.forEach((detection: Detection) => {
      const existing = groups.get(detection.detection_type)
      const severity = detectionTypeInfo[detection.detection_type]?.severity || 'low'

      if (existing) {
        existing.count++
        existing.firstSeen = Math.min(existing.firstSeen, detection.timestamp)
        existing.lastSeen = Math.max(existing.lastSeen, detection.timestamp)
        existing.detections.push(detection)
      } else {
        groups.set(detection.detection_type, {
          type: detection.detection_type,
          count: 1,
          firstSeen: detection.timestamp,
          lastSeen: detection.timestamp,
          detections: [detection],
          severity
        })
      }
    })

    return Array.from(groups.values()).sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  }, [serverSideDetections])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const toggleDetectionType = (type: number) => {
    setExpandedDetectionTypes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(type)) {
        newSet.delete(type)
      } else {
        newSet.add(type)
      }
      return newSet
    })
  }

  // Actions (demo — no backend)
  const handleBan = () => { demoAlert(); setShowBanDialog(false); setBanReason('') }
  const handleUnban = () => { demoAlert(); setShowUnbanDialog(false) }
  const handleFlag = () => { demoAlert(); setShowFlagDialog(false); setFlagReason('') }
  const handleUnflag = () => { demoAlert(); setShowUnflagDialog(false) }

  // Helper functions
  const getBorderColor = () => {
    // Only show critical borders, otherwise use default
    if (user.flagged_status === 'critical' || warningLevel >= 3) return 'border-red-500/30'
    return 'border-neutral-700'
  }

  const getSeverityColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-400'
      case 'high': return 'border-orange-500 bg-orange-500/10 text-orange-400'
      case 'medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
      case 'low': return 'border-gray-500 bg-gray-500/10 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className={`border-2 ${getBorderColor()} bg-neutral-900/50 backdrop-blur-xl animate-fade-in`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src={user.steam_avatar_url || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'}
                alt="Avatar"
                className={`w-20 h-20 rounded-full border-4 ${getBorderColor()}`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <CardTitle className="text-2xl">{user.steam_username || user.steamid}</CardTitle>
                  {session && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" title="Online"></span>
                      <span className="text-xs text-green-500">Online</span>
                    </div>
                  )}
                  {/* Banned badge takes priority over flagged */}
                  {user.is_banned === true || user.is_banned === 1 ? (
                    <Badge variant="destructive" className="text-xs">
                      <Ban className="h-3 w-3 mr-1" />
                      BANNED
                    </Badge>
                  ) : user.flagged_status && user.flagged_status !== '0' ? (
                    <Badge
                      variant={user.flagged_status === 'critical' ? 'destructive' : 'secondary'}
                      className={`text-xs ${user.flagged_status === 'critical' ? '' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      FLAGGED
                    </Badge>
                  ) : null}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>{user.steamid}</div>
                  {session ? (
                    <div className="flex items-center gap-3 text-xs">
                      <span>IP: {session.client_ip}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className={session.dll_heartbeat_ok ? 'text-green-500' : 'text-red-500'}>
                        DLL: {session.dll_heartbeat_ok ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ) : null}
                  {user.is_banned === true || user.is_banned === 1 ? (
                    <div className="text-xs text-red-400 mt-2">
                      <div>Banned: {user.ban_reason || 'No reason provided'}</div>
                      {user.banned_by ? <div>By: {user.banned_by} • {new Date(user.banned_at).toLocaleString()}</div> : null}
                    </div>
                  ) : null}
                  {user.flagged_status && user.flagged_status !== '0' && user.is_banned !== true && user.is_banned !== 1 ? (
                    <div className="text-xs text-orange-400 mt-2">
                      <div>Flagged: {user.flag_reason || 'No reason provided'}</div>
                      {user.flagged_by && user.flagged_at ? (
                        <div>By: {user.flagged_by} • {new Date(user.flagged_at).toLocaleString()}</div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Action Buttons - Top Right */}
            <div className="flex gap-2 shrink-0">
              {user.is_banned ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUnbanDialog(true)}
                  className="border-green-500 text-green-400 hover:bg-green-500/10 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Unban
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowBanDialog(true)}
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Ban className="h-4 w-4 mr-1" />
                  Ban
                </Button>
              )}

              {user.flagged_status && user.flagged_status !== '0' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUnflagDialog(true)}
                  className="text-xs transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Clear Flag
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFlagDialog(true)}
                  className="text-xs transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Flag
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Quick Stats Grid */}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-2 border-neutral-800 bg-neutral-900/50 hover:border-primary/30 transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-2">
                <CardDescription>Total Detections</CardDescription>
                <CardTitle className="text-2xl">{user.total_detections}</CardTitle>
                <div className="text-xs text-muted-foreground">
                  {groupedDetections.length} unique types
                </div>
              </CardHeader>
            </Card>
            <Card className="border-2 border-neutral-800 bg-neutral-900/50 hover:border-primary/30 transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-2">
                <CardDescription>Total Sessions</CardDescription>
                <CardTitle className="text-2xl">{user.total_sessions}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-2 border-neutral-800 bg-neutral-900/50 hover:border-primary/30 transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-2">
                <CardDescription>First Seen</CardDescription>
                <CardTitle className="text-sm">{new Date(user.first_seen).toLocaleDateString()}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-2 border-neutral-800 bg-neutral-900/50 hover:border-primary/30 transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-2">
                <CardDescription>Last Seen</CardDescription>
                <CardTitle className="text-sm">{new Date(user.last_seen).toLocaleDateString()}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>


      {/* Detection Summary Card (SMART GROUPING) - Client-Side Only */}
      <Card className="border-2 border-neutral-800 bg-neutral-900/50 backdrop-blur-xl animate-fade-in">
        <CardHeader
          className="cursor-pointer hover:bg-neutral-800/30 transition-colors"
          onClick={() => toggleSection('detections')}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Detection Summary</CardTitle>
            </div>
            {expandedSections.has('detections') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.has('detections') && (
          <CardContent className="space-y-3">
            {groupedDetections.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No detections</p>
            ) : (
              groupedDetections.map((group) => {
                const info = detectionTypeInfo[group.type]
                const isExpanded = expandedDetectionTypes.has(group.type)

                return (
                  <Card
                    key={group.type}
                    className={`border-2 ${getSeverityColor(group.severity)} transition-all`}
                  >
                    <CardHeader
                      className="cursor-pointer hover:opacity-80 transition-opacity pb-3"
                      onClick={() => toggleDetectionType(group.type)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">{info?.name || `Type ${group.type}`}</CardTitle>
                            <Badge variant="secondary" className="text-xs">×{group.count}</Badge>
                            <Badge className={`text-xs ${getSeverityColor(group.severity)}`}>
                              {group.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-x-4">
                            <span>First: {new Date(group.firstSeen).toLocaleString()}</span>
                            <span>Last: {new Date(group.lastSeen).toLocaleString()}</span>
                          </div>
                        </div>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="pt-0 max-h-64 overflow-y-auto custom-scrollbar">
                        <div className="space-y-2">
                          {group.detections.map((detection, idx) => (
                            <div key={detection.id} className="text-xs border-l-2 border-neutral-700 pl-3 py-1">
                              <div className="text-muted-foreground">
                                {new Date(detection.timestamp).toLocaleString()}
                              </div>
                              <div className="text-foreground">{detection.details}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })
            )}
          </CardContent>
        )}
      </Card>

      {/* Server-Side Detections Card - Always visible for testing */}
      <Card className="border-2 border-neutral-800 bg-neutral-900/50 backdrop-blur-xl animate-fade-in">
        <CardHeader
          className="cursor-pointer hover:bg-neutral-800/30 transition-colors"
          onClick={() => toggleSection('server_detections')}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Server-Side Detections
                {serverSideDetections.length > 0 && (
                  <Badge variant="secondary">{serverSideDetections.length}</Badge>
                )}
              </CardTitle>
            </div>
            {expandedSections.has('server_detections') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.has('server_detections') && (
          <CardContent className="space-y-3">
            {groupedServerDetections.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {serverSideDetections.length === 0 
                  ? 'No server-side detections yet. Detections from the SourceMod plugin will appear here.' 
                  : 'No server-side detections'}
              </p>
            ) : (
                groupedServerDetections.map((group) => {
                  const info = detectionTypeInfo[group.type]
                  const isExpanded = expandedDetectionTypes.has(group.type)

                  return (
                    <Card
                      key={group.type}
                      className={`border-2 ${getSeverityColor(group.severity)} transition-all`}
                    >
                      <CardHeader
                        className="cursor-pointer hover:opacity-80 transition-opacity pb-3"
                        onClick={() => toggleDetectionType(group.type)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">{info?.name || `Type ${group.type}`}</CardTitle>
                              <Badge variant="secondary" className="text-xs">×{group.count}</Badge>
                              <Badge className={`text-xs ${getSeverityColor(group.severity)}`}>
                                {group.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground space-x-4">
                              <span>First: {new Date(group.firstSeen).toLocaleString()}</span>
                              <span>Last: {new Date(group.lastSeen).toLocaleString()}</span>
                            </div>
                          </div>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                      </CardHeader>
                      {isExpanded && (
                        <CardContent className="pt-0 max-h-64 overflow-y-auto custom-scrollbar">
                          <div className="space-y-2">
                            {group.detections.map((detection, idx) => (
                              <div key={detection.id} className="text-xs border-l-2 border-neutral-700 pl-3 py-1">
                                <div className="text-muted-foreground">
                                  {new Date(detection.timestamp).toLocaleString()}
                                </div>
                                <div className="text-foreground">{detection.details}</div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })
              )}
            </CardContent>
          )}
        </Card>

      {/* Fingerprint Traces (only if suspicious/shared) */}
      {(hasSuspiciousTraces || hasSharedTraces) && (() => {
        // Only show traces that are suspicious or have warning level > 0 (shared across accounts)
        const flaggedTraces = fingerprintTraces.filter(t => t.suspicious || t.warning_level > 0)

        if (flaggedTraces.length === 0) return null

        // Check if any are actually critical (level 3 = shared across accounts)
        const hasCriticalTraces = flaggedTraces.some(t => t.warning_level >= 3)

        return (
        <Card className={`border-2 ${hasCriticalTraces ? 'border-red-500/50' : 'border-neutral-800'} bg-neutral-900/50 backdrop-blur-xl animate-fade-in`}>
          <CardHeader
            className="cursor-pointer hover:bg-neutral-800/30 transition-colors"
            onClick={() => toggleSection('traces')}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {hasCriticalTraces ? <AlertTriangle className="h-5 w-5 text-red-500" /> : null}
                  Fingerprint Traces{hasCriticalTraces ? ' & Ban Evasion' : ''}
                  <Badge variant={hasCriticalTraces ? "destructive" : "secondary"}>{flaggedTraces.length} trace{flaggedTraces.length !== 1 ? 's' : ''}</Badge>
                </CardTitle>
              </div>
              {expandedSections.has('traces') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </div>
          </CardHeader>
          {expandedSections.has('traces') && (
            <CardContent className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {flaggedTraces.map((trace) => (
                <Card key={trace.id} className="border border-neutral-700 bg-neutral-900/30">
                  <CardContent className="p-3 text-sm">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="font-medium">{trace.trace_type}</div>
                        <div className="text-xs text-muted-foreground truncate">{trace.trace_value}</div>
                      </div>
                      <Badge variant={trace.warning_level >= 3 ? 'destructive' : 'secondary'}>
                        Level {trace.warning_level}
                      </Badge>
                    </div>
                    {trace.shared_with_users && trace.shared_with_users.length > 0 && (
                      <div className="text-xs text-red-400 mt-2">
                        ⚠️ Shared with {trace.shared_with_users.length} other account(s)
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          )}
        </Card>
        )
      })()}

      {/* Loaded Modules (collapsed) */}
      <Card className="border-2 border-neutral-800 bg-neutral-900/50 backdrop-blur-xl animate-fade-in">
        <CardHeader
          className="cursor-pointer hover:bg-neutral-800/30 transition-colors"
          onClick={() => {
            toggleSection('loaded_modules')
            if (!modulesLoaded) fetchLoadedModules()
            if (!queueLoaded) fetchDownloadQueue()
            if (!filesLoaded) fetchDownloadedFiles()
          }}
        >
          <div className="flex items-center justify-between">
            <CardTitle>
              Loaded Modules
              {loadedModules.length > 0 && (
                <Badge variant="outline" className="ml-2">{loadedModules.length}</Badge>
              )}
            </CardTitle>
            {expandedSections.has('loaded_modules') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
          {expandedSections.has('loaded_modules') && (
            <CardContent className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {fileDownloadError && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2 mb-2">
                  {fileDownloadError}
                </div>
              )}

              {/* Download Queue Section */}
              {downloadQueue.length > 0 && (
                <div className="mb-4 p-2 bg-neutral-800/30 rounded">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Download Queue ({downloadQueue.length})</div>
                  <div className="space-y-1">
                    {downloadQueue.map((item) => (
                      <div key={item.id} className="text-xs flex items-center justify-between bg-neutral-800/50 rounded px-2 py-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge variant={
                            item.status === 'completed' ? 'default' :
                            item.status === 'failed' ? 'destructive' :
                            item.status === 'downloading' ? 'secondary' : 'outline'
                          } className="text-[10px] h-4">
                            {item.status}
                          </Badge>
                          <span className="truncate">{item.file_name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-red-400"
                          onClick={() => removeFromQueue(item.id)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Downloaded Files Section */}
              {downloadedFiles.length > 0 && (
                <div className="mb-4 p-2 bg-green-500/5 border border-green-500/20 rounded">
                  <div className="text-xs font-semibold text-green-400 mb-2">Downloaded Files ({downloadedFiles.length})</div>
                  <div className="space-y-1">
                    {downloadedFiles.map((file, idx) => (
                      <div key={idx} className="text-xs flex items-center justify-between bg-green-500/10 rounded px-2 py-1 group">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate">{file.name}</span>
                          <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => downloadSavedFile(file.name)}
                        >
                          Save
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading state */}
              {loadingModules ? (
                <div className="text-center text-muted-foreground py-4">Loading modules...</div>
              ) : loadedModules.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">No module data collected yet</div>
              ) : (
                <>
                  {/* Unsigned Modules (potentially suspicious) */}
                  {loadedModules.filter(m => !m.is_signed).length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-yellow-400 mb-2">Unsigned Modules ({loadedModules.filter(m => !m.is_signed).length})</div>
                      <div className="space-y-2">
                        {loadedModules.filter(m => !m.is_signed).map((mod, idx) => {
                          const isQueued = downloadQueue.some(q => q.file_path === mod.module_path && q.status === 'pending')
                          return (
                            <div key={idx} className="text-sm border-l-2 border-yellow-500/50 pl-3 py-1 group bg-yellow-500/5 rounded-r">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-yellow-300">{mod.module_name}</div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {session?.dll_loaded ? (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 px-2 text-xs"
                                      disabled={downloadingFile === mod.module_path}
                                      onClick={() => downloadModule(mod.module_path, mod.module_name)}
                                    >
                                      {downloadingFile === mod.module_path ? 'Downloading...' : 'Download'}
                                    </Button>
                                  ) : !isQueued ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => queueFileDownload(mod.module_path, mod.module_name)}
                                    >
                                      Queue
                                    </Button>
                                  ) : (
                                    <Badge variant="outline" className="text-[10px]">Queued</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Size: {(mod.module_size / 1024).toFixed(0)} KB • 0x{mod.base_address?.toString(16).toUpperCase()}
                              </div>
                              <div className="text-xs text-muted-foreground/70 truncate" title={mod.module_path}>
                                {mod.module_path}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Signed Modules */}
                  <div>
                    <div className="text-xs font-semibold text-green-400 mb-2">Signed Modules ({loadedModules.filter(m => m.is_signed).length})</div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {loadedModules.filter(m => m.is_signed).map((mod, idx) => {
                        const isQueued = downloadQueue.some(q => q.file_path === mod.module_path && q.status === 'pending')
                        return (
                          <div key={idx} className="text-xs flex items-center justify-between group py-1 px-2 hover:bg-neutral-800/30 rounded">
                            <div className="min-w-0 flex-1">
                              <span className="text-green-300">{mod.module_name}</span>
                              {mod.signer_name && (
                                <span className="text-muted-foreground ml-2">({mod.signer_name})</span>
                              )}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {session?.dll_loaded ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 px-2 text-[10px]"
                                  disabled={downloadingFile === mod.module_path}
                                  onClick={() => downloadModule(mod.module_path, mod.module_name)}
                                >
                                  DL
                                </Button>
                              ) : !isQueued ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 px-2 text-[10px]"
                                  onClick={() => queueFileDownload(mod.module_path, mod.module_name)}
                                >
                                  Q
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>

      {/* Running Processes (collapsed) */}
      <Card className="border-2 border-neutral-800 bg-neutral-900/50 backdrop-blur-xl animate-fade-in">
        <CardHeader
          className="cursor-pointer hover:bg-neutral-800/30 transition-colors"
          onClick={() => {
            toggleSection('processes')
            if (!processesLoaded) fetchRunningProcesses()
          }}
        >
          <div className="flex items-center justify-between">
            <CardTitle>
              Running Processes
              {runningProcesses.length > 0 && (
                <Badge variant="outline" className="ml-2">{runningProcesses.length}</Badge>
              )}
              {runningProcesses.filter(p => p.has_handle_to_game).length > 0 && (
                <Badge variant="secondary" className="ml-2 text-orange-400">{runningProcesses.filter(p => p.has_handle_to_game).length} with game handle</Badge>
              )}
            </CardTitle>
            {expandedSections.has('processes') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.has('processes') && (
          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            {loadingProcesses ? (
              <div className="text-center text-muted-foreground py-4">Loading processes...</div>
            ) : runningProcesses.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No process data collected yet</div>
            ) : (
              <>
                {/* Processes with game handle (suspicious) */}
                {runningProcesses.filter(p => p.has_handle_to_game).length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-orange-400 mb-2">Processes with Game Handle ({runningProcesses.filter(p => p.has_handle_to_game).length})</div>
                    <div className="space-y-2">
                      {runningProcesses.filter(p => p.has_handle_to_game).map((proc, idx) => (
                        <div key={idx} className="text-sm border-l-2 border-orange-500/50 pl-3 py-1 bg-orange-500/5 rounded-r">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-orange-300">{proc.process_name}</span>
                            {proc.is_elevated && <Badge variant="destructive" className="text-[10px] h-4">ADMIN</Badge>}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            PID: {proc.process_id} • Memory: {(proc.memory_usage / (1024 * 1024)).toFixed(1)} MB
                          </div>
                          {proc.exe_path && (
                            <div className="text-xs text-muted-foreground/70 truncate" title={proc.exe_path}>
                              {proc.exe_path}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Elevated Processes */}
                {runningProcesses.filter(p => p.is_elevated && !p.has_handle_to_game).length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-red-400 mb-2">Elevated Processes ({runningProcesses.filter(p => p.is_elevated && !p.has_handle_to_game).length})</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {runningProcesses.filter(p => p.is_elevated && !p.has_handle_to_game).map((proc, idx) => (
                        <div key={idx} className="text-xs flex items-center gap-2 py-1 px-2 bg-red-500/5 rounded">
                          <Badge variant="destructive" className="text-[10px] h-4">ADMIN</Badge>
                          <span className="text-red-300">{proc.process_name}</span>
                          <span className="text-muted-foreground">PID: {proc.process_id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Processes */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2">All Processes ({runningProcesses.filter(p => !p.is_elevated && !p.has_handle_to_game).length})</div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {runningProcesses.filter(p => !p.is_elevated && !p.has_handle_to_game).map((proc, idx) => (
                      <div key={idx} className="text-xs flex items-center justify-between py-1 px-2 hover:bg-neutral-800/30 rounded">
                        <span className="truncate">{proc.process_name}</span>
                        <span className="text-muted-foreground text-[10px]">PID: {proc.process_id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>

      {/* External Handle History (collapsed) */}
      <Card className="border-2 border-neutral-800 bg-neutral-900/50 backdrop-blur-xl animate-fade-in">
        <CardHeader
          className="cursor-pointer hover:bg-neutral-800/30 transition-colors"
          onClick={() => {
            toggleSection('handles')
            if (!handlesLoaded) fetchHandleHistory()
          }}
        >
          <div className="flex items-center justify-between">
            <CardTitle>External Handle History</CardTitle>
            {expandedSections.has('handles') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.has('handles') && (
          <CardContent className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {loadingHandles ? (
              <div className="text-center text-muted-foreground py-4">Loading handle history...</div>
            ) : aggregatedHandles.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No handle history recorded</div>
            ) : (
              aggregatedHandles.map((handle, idx) => (
                <div
                  key={`handle-${idx}`}
                  className={`text-sm p-3 rounded border ${
                    handle.is_suspicious && !handle.is_whitelisted
                      ? 'border-red-500/50 bg-red-500/10'
                      : handle.is_whitelisted
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-neutral-700 bg-neutral-800/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`font-medium ${handle.is_suspicious && !handle.is_whitelisted ? 'text-red-400' : handle.is_whitelisted ? 'text-green-400' : ''}`}>
                        {handle.owner_process_name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        PID: {handle.owner_process_id}
                      </span>
                      {handle.occurrence_count > 1 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          ×{handle.occurrence_count}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {handle.is_whitelisted ? (
                        <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">Whitelisted</Badge>
                      ) : null}
                      {handle.is_suspicious && !handle.is_whitelisted ? (
                        <Badge variant="destructive" className="text-xs">SUSPICIOUS</Badge>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <div className="grid grid-cols-2 gap-x-4">
                      <div>Target PID: {handle.target_process_id}</div>
                      <div>Handle: 0x{handle.handle_value.toString(16).toUpperCase()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Access: </span>
                      <span className="font-mono">{formatAccessRights(handle.access_rights)}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {decodeAccessRights(handle.access_rights).map((flag, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-1.5 py-0.5 rounded ${
                              flag === 'PROCESS_ALL_ACCESS' || flag === 'VM_WRITE' || flag === 'VM_OPERATION' || flag === 'CREATE_THREAD'
                                ? 'bg-red-500/20 text-red-400'
                                : flag === 'VM_READ' || flag === 'QUERY_INFORMATION' || flag === 'QUERY_LIMITED_INFO'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-neutral-700 text-neutral-300'
                            }`}
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 pt-1">
                      <div>First seen: {new Date(handle.first_seen).toLocaleString()}</div>
                      <div>Last seen: {new Date(handle.last_seen).toLocaleString()}</div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-neutral-700/50">
                      {handle.exe_path ? (
                        <>
                          <div className="text-xs text-muted-foreground/70 truncate mb-2" title={handle.exe_path}>
                            Executable: {handle.exe_path}
                          </div>
                          <div className="flex gap-1">
                            {session?.dll_loaded ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                disabled={downloadingFile === handle.exe_path}
                                onClick={() => downloadModule(handle.exe_path ?? '', handle.owner_process_name)}
                              >
                                {downloadingFile === handle.exe_path ? 'Downloading...' : 'Download'}
                              </Button>
                            ) : !downloadQueue.some(q => q.file_path === handle.exe_path && q.status === 'pending') ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={() => queueFileDownload(handle.exe_path ?? '', handle.owner_process_name)}
                              >
                                Queue
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-[10px]">Queued</Badge>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-xs text-muted-foreground/50 italic mb-2">
                            Executable path unavailable (process may have exited)
                          </div>
                          <div className="flex gap-1">
                            {session?.dll_loaded ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                disabled={true}
                                title="Executable path unavailable - process may have exited"
                              >
                                Download
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                disabled={true}
                                title="Executable path unavailable - process may have exited. Process must be running to queue download."
                              >
                                Queue
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* Kick Events (Server-Side Anticheat) */}
      {kickEvents.length > 0 && (
        <Card className="border-2 border-red-500/50 bg-neutral-900/50 backdrop-blur-xl animate-fade-in">
          <CardHeader
            className="cursor-pointer hover:bg-neutral-800/30 transition-colors"
            onClick={() => toggleSection('kick_events')}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Server-Side Kicks
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                    {kickEvents.length}
                  </Badge>
                </CardTitle>
              </div>
              {expandedSections.has('kick_events') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </div>
          </CardHeader>
          {expandedSections.has('kick_events') && (
            <CardContent className="space-y-2">
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {kickEvents.map((kick) => (
                  <div
                    key={kick.id}
                    className="border-l-2 border-red-500/50 bg-red-500/5 pl-3 py-2 rounded-r"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-red-400">
                          {kick.reason}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(kick.timestamp).toLocaleString()}
                        </div>
                        {kick.player_name && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Player: {kick.player_name}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">
                        {kick.source}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Hardware & Account History (collapsed) */}
      <Card className="border-2 border-neutral-800 bg-neutral-900/50 backdrop-blur-xl animate-fade-in">
        <CardHeader
          className="cursor-pointer hover:bg-neutral-800/30 transition-colors"
          onClick={() => toggleSection('hardware')}
        >
          <div className="flex items-center justify-between">
            <CardTitle>
              Hardware & Account History
            </CardTitle>
            {expandedSections.has('hardware') ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.has('hardware') && (
          <CardContent className="space-y-4">
            {/* IP History */}
            <div>
              <h4 className="text-sm font-medium mb-2">IP Addresses ({ipHistory.length})</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                {ipHistory.map((ip, idx) => (
                  <div key={`ip-${ip.ip_address}-${idx}`} className="text-sm flex justify-between items-center">
                    <span>{ip.ip_address}</span>
                    <span className="text-xs text-muted-foreground">{ip.connection_count} connections</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Name History */}
            {nameHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Name Changes ({nameHistory.length})</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                  {nameHistory.map((name, idx) => (
                    <div key={`name-${idx}`} className="text-sm">
                      {name.username}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HWID Components */}
            {hwidHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Hardware ID Components</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {hwidHistory.slice(0, 3).map((hwid, idx) => (
                    <div key={`hwid-${idx}`} className="text-xs space-y-1 p-2 bg-neutral-800/30 rounded border border-neutral-700">
                      {hwid.cpu_id && <div><span className="text-muted-foreground">CPU:</span> {hwid.cpu_id}</div>}
                      {hwid.motherboard_serial && <div><span className="text-muted-foreground">Motherboard:</span> {hwid.motherboard_serial}</div>}
                      {hwid.disk_serial && <div><span className="text-muted-foreground">Disk:</span> {hwid.disk_serial}</div>}
                      {hwid.bios_serial && <div><span className="text-muted-foreground">BIOS:</span> {hwid.bios_serial}</div>}
                      {hwid.mac_address && <div><span className="text-muted-foreground">MAC:</span> {hwid.mac_address}</div>}
                      {hwid.volume_serial && <div><span className="text-muted-foreground">Volume:</span> {hwid.volume_serial}</div>}
                      <div className="text-muted-foreground">Sessions: {hwid.session_count}</div>
                    </div>
                  ))}
                  {hwidHistory.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{hwidHistory.length - 3} more HWID sessions
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Per-User Script Editor - At Bottom, Collapsed by Default */}
      <UserScriptEditor steamid={user.steamid} userData={user} />

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              This will ban {user.steam_username || user.steamid} and disconnect them if they're online.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Ban reason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBan}>Ban User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unban Dialog */}
      <Dialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unban User</DialogTitle>
            <DialogDescription>
              This will remove the ban from {user.steam_username || user.steamid}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnbanDialog(false)}>Cancel</Button>
            <Button onClick={handleUnban}>Unban User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag User for Review</DialogTitle>
            <DialogDescription>
              Mark {user.steam_username || user.steamid} for manual review.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Flag reason (e.g., Suspicious activity, needs investigation)"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagDialog(false)}>Cancel</Button>
            <Button onClick={handleFlag}>Flag User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unflag Dialog */}
      <Dialog open={showUnflagDialog} onOpenChange={setShowUnflagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Flag</DialogTitle>
            <DialogDescription>
              Remove the flag from {user.steam_username || user.steamid}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnflagDialog(false)}>Cancel</Button>
            <Button onClick={handleUnflag}>Clear Flag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
