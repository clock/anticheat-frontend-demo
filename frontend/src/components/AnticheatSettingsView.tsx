import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Settings } from 'lucide-react'
import { FAKE_SIGNATURES, FAKE_WHITELIST, FAKE_PROCESS_WHITELIST, FAKE_SETTINGS } from '@/utils/fake-data'

export function AnticheatSettingsView() {
  const [signatures, setSignatures] = useState<any[]>([])
  const [whitelist, setWhitelist] = useState<any[]>([])
  const [whitelistHash] = useState<string>('a3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1')
  const [processWhitelist, setProcessWhitelist] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [showSignatureDialog, setShowSignatureDialog] = useState(false)
  const [showWhitelistDialog, setShowWhitelistDialog] = useState(false)
  const [showProcessWhitelistDialog, setShowProcessWhitelistDialog] = useState(false)
  const [editingSignature, setEditingSignature] = useState<any>(null)
  const [editingWhitelist, setEditingWhitelist] = useState<any>(null)
  const [editingProcessWhitelist, setEditingProcessWhitelist] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'signatures' | 'breakers' | 'whitelist' | 'process-whitelist' | 'settings'>('signatures')

  // signature form state
  const [sigModuleName, setSigModuleName] = useState('')
  const [sigPattern, setSigPattern] = useState('')
  const [sigDescription, setSigDescription] = useState('')
  const [sigPriority, setSigPriority] = useState(1)
  const [sigEnabled, setSigEnabled] = useState(true)
  const [sigType, setSigType] = useState<'pattern_breaker' | 'detection'>('detection')

  // whitelist form state
  const [wlModuleName, setWlModuleName] = useState('')
  const [wlDescription, setWlDescription] = useState('')
  const [wlHash, setWlHash] = useState('')
  const [wlPath, setWlPath] = useState('')

  // process whitelist form state
  const [pwProcessName, setPwProcessName] = useState('')
  const [pwPathContains, setPwPathContains] = useState('')
  const [pwDescription, setPwDescription] = useState('')
  const [pwEnabled, setPwEnabled] = useState(true)

  const demoAlert = () => alert('Demo mode — actions are disabled.')

  useEffect(() => {
    setSignatures(FAKE_SIGNATURES)
    setWhitelist(FAKE_WHITELIST)
    setProcessWhitelist(FAKE_PROCESS_WHITELIST)
    setSettings({ ...FAKE_SETTINGS })
  }, [])

  // Reset form when dialog closes
  useEffect(() => {
    if (!showSignatureDialog) {
      setEditingSignature(null)
      setSigModuleName('')
      setSigPattern('')
      setSigDescription('')
      setSigPriority(1)
      setSigEnabled(true)
      setSigType(activeTab === 'breakers' ? 'pattern_breaker' : 'detection')
    }
  }, [showSignatureDialog, activeTab])

  function openSignatureDialog(sig?: any) {
    if (sig) {
      setEditingSignature(sig)
      setSigModuleName(sig.module_name || '')
      setSigPattern(sig.pattern)
      setSigDescription(sig.description)
      setSigPriority(sig.priority)
      setSigEnabled(sig.enabled)
      setSigType(sig.signature_type || 'detection')
    } else {
      setEditingSignature(null)
      setSigModuleName('')
      setSigPattern('')
      setSigDescription('')
      setSigPriority(1)
      setSigEnabled(true)
      setSigType(activeTab === 'breakers' ? 'pattern_breaker' : 'detection')
    }
    setShowSignatureDialog(true)
  }

  function openWhitelistDialog(entry?: any) {
    if (entry) {
      setEditingWhitelist(entry)
      setWlModuleName(entry.module_name)
      setWlDescription(entry.description)
      setWlHash(entry.module_hash || '')
      setWlPath(entry.module_path || '')
    } else {
      setEditingWhitelist(null)
      setWlModuleName('')
      setWlDescription('')
      setWlHash('')
      setWlPath('')
    }
    setShowWhitelistDialog(true)
  }

  function openProcessWhitelistDialog(entry?: any) {
    if (entry) {
      setEditingProcessWhitelist(entry)
      setPwProcessName(entry.process_name)
      setPwPathContains(entry.required_path_contains || '')
      setPwDescription(entry.description || '')
      setPwEnabled(entry.enabled !== false)
    } else {
      setEditingProcessWhitelist(null)
      setPwProcessName('')
      setPwPathContains('')
      setPwDescription('')
      setPwEnabled(true)
    }
    setShowProcessWhitelistDialog(true)
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Critical'
      case 2: return 'High'
      case 3: return 'Medium'
      case 4: return 'Low'
      default: return 'Unknown'
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'destructive'
      case 2: return 'destructive'
      case 3: return 'secondary'
      case 4: return 'outline'
      default: return 'outline'
    }
  }

  // Filter signatures by type
  const detectionSignatures = signatures.filter(s => s.signature_type === 'detection')
  const patternBreakers = signatures.filter(s => s.signature_type === 'pattern_breaker')

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-card border border-secondary/30 p-1">
          <TabsTrigger
            value="signatures"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground"
          >
            Detection Signatures
          </TabsTrigger>
          <TabsTrigger
            value="breakers"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground"
          >
            Pattern Breakers
          </TabsTrigger>
          <TabsTrigger
            value="whitelist"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground"
          >
            Module Whitelist
          </TabsTrigger>
          <TabsTrigger
            value="process-whitelist"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground"
          >
            Process Whitelist
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground"
          >
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signatures" className="space-y-4">
          <Card className="border border-secondary/30 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-secondary/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Detection Signatures</CardTitle>
                  <CardDescription>Memory pattern signatures for detecting cheats ({detectionSignatures.length} signatures)</CardDescription>
                </div>
                <Button onClick={() => openSignatureDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Signature
                </Button>
                </div>
            </CardHeader>
            <CardContent>
              {detectionSignatures.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No detection signatures found.</p>
                  <Button onClick={() => {
                    setSigType('detection')
                    openSignatureDialog()
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Signature
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {detectionSignatures.map((sig) => (
                    <Card key={sig.id} className={`border-l-4 bg-card border border-secondary/30 ${
                      sig.signature_type === 'pattern_breaker'
                        ? 'border-l-blue-500'
                        : 'border-l-red-500'
                    } ${!sig.enabled ? 'opacity-60' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-base truncate">
                                {sig.module_name || '(All Modules)'}
                              </span>
                              <Badge
                                variant={sig.signature_type === 'pattern_breaker' ? 'secondary' : 'destructive'}
                                className="text-xs"
                              >
                                {sig.signature_type === 'pattern_breaker' ? 'Pattern Breaker' : 'Detection'}
                              </Badge>
                              <Badge variant={getPriorityColor(sig.priority)} className="text-xs">
                                {getPriorityLabel(sig.priority)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{sig.description}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => openSignatureDialog(sig)} className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={demoAlert} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-muted/30 rounded p-2">
                            <code className="text-xs font-mono break-all text-foreground">{sig.pattern}</code>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              {sig.enabled ? (
                                <span className="flex items-center gap-1 text-green-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                  Enabled
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                                  Disabled
                                </span>
                              )}
                            </div>
                            <span>ID: {sig.id}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakers" className="space-y-4">
          <Card className="border border-secondary/30 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-secondary/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pattern Breakers</CardTitle>
                  <CardDescription>Signatures that detect function hooks and tampering ({patternBreakers.length} signatures)</CardDescription>
                </div>
                <Button onClick={() => {
                  setSigType('pattern_breaker')
                  openSignatureDialog()
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Pattern Breaker
                </Button>
                </div>
            </CardHeader>
            <CardContent>
              {patternBreakers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No pattern breakers found.</p>
                  <Button onClick={() => {
                    setSigType('pattern_breaker')
                    openSignatureDialog()
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Pattern Breaker
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {patternBreakers.map((sig) => (
                    <Card key={sig.id} className={`border-l-4 border-l-blue-500 bg-card border border-secondary/30 ${!sig.enabled ? 'opacity-60' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-base truncate">
                                {sig.module_name || '(All Modules)'}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                Pattern Breaker
                              </Badge>
                              <Badge variant={getPriorityColor(sig.priority)} className="text-xs">
                                {getPriorityLabel(sig.priority)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{sig.description}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => openSignatureDialog(sig)} className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={demoAlert} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-muted/30 rounded p-2">
                            <code className="text-xs font-mono break-all text-foreground">{sig.pattern}</code>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {sig.enabled ? (
                                <span className="flex items-center gap-1 text-green-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                  Enabled
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                                  Disabled
                                </span>
                              )}
                            </div>
                            <span>ID: {sig.id}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whitelist" className="space-y-4">
          <Card className="border border-secondary/30 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-secondary/30">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle>Module Whitelist</CardTitle>
                  <CardDescription>
                    Manage whitelisted modules ({whitelist.length} entries)
                  </CardDescription>
                </div>
                <Button onClick={() => openWhitelistDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </div>
              {whitelistHash && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Whitelist Hash (CRC)</div>
                    <code className="text-sm font-mono text-foreground break-all">{whitelistHash}</code>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    This hash is sent to clients for verification. It changes when whitelist entries are modified.
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {whitelist.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No whitelist entries found.</p>
                  <Button onClick={() => openWhitelistDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Entry
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {whitelist.map((entry) => (
                    <Card key={entry.id} className={`border-l-4 bg-card border border-secondary/30 ${
                      entry.module_hash ? 'border-l-green-500' : 'border-l-yellow-500'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-base">{entry.module_name}</span>
                              {entry.module_hash && (
                                <Badge variant="outline" className="text-xs border-green-500/50 text-green-500">
                                  Has Hash
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{entry.description}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => openWhitelistDialog(entry)} className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={demoAlert} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {entry.module_hash && (
                            <div className="bg-muted/30 rounded p-2">
                              <div className="text-xs font-medium text-muted-foreground mb-1">SHA-256 Hash</div>
                              <code className="text-xs font-mono break-all text-foreground">{entry.module_hash}</code>
                            </div>
                          )}
                          {entry.module_path && (
                            <div className="bg-muted/30 rounded p-2">
                              <div className="text-xs font-medium text-muted-foreground mb-1">Path</div>
                              <code className="text-xs font-mono break-all text-foreground">{entry.module_path}</code>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            ID: {entry.id} • Created: {new Date(entry.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process-whitelist" className="space-y-4">
          <Card className="border border-secondary/30 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-secondary/30">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle>Process Whitelist</CardTitle>
                  <CardDescription>
                    Manage whitelisted executable processes for handle scanning ({processWhitelist.length} entries)
                  </CardDescription>
                </div>
                <Button onClick={() => openProcessWhitelistDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Process
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {processWhitelist.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No process whitelist entries found.</p>
                  <Button onClick={() => openProcessWhitelistDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Entry
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {processWhitelist.map((entry) => (
                    <Card key={entry.id} className={`border-l-4 bg-card border border-secondary/30 ${
                      entry.enabled ? 'border-l-green-500' : 'border-l-gray-500 opacity-60'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-base">{entry.process_name}</span>
                              {entry.enabled ? (
                                <Badge variant="outline" className="text-xs border-green-500/50 text-green-500">
                                  Enabled
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs border-gray-500/50 text-gray-500">
                                  Disabled
                                </Badge>
                              )}
                            </div>
                            {entry.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{entry.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => openProcessWhitelistDialog(entry)} className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={demoAlert} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {entry.required_path_contains && (
                            <div className="bg-muted/30 rounded p-2">
                              <div className="text-xs font-medium text-muted-foreground mb-1">Path Must Contain</div>
                              <code className="text-xs font-mono break-all text-foreground">{entry.required_path_contains}</code>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            ID: {entry.id} • Created: {new Date(entry.created_at).toLocaleDateString()}
                            {entry.created_by && ` • By: ${entry.created_by}`}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="border border-secondary/30 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-secondary/30">
              <CardTitle>Anticheat Settings</CardTitle>
              <CardDescription>Configure anticheat behavior and scanning parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Signature Scan Interval (ms)</label>
                      <Input
                        type="number"
                        value={settings.signature_scan_interval_ms}
                        onChange={(e) => setSettings({ ...settings, signature_scan_interval_ms: parseInt(e.target.value) || 60000 })}
                        min={1000}
                      />
                      <p className="text-xs text-muted-foreground mt-1">How often to push signature scans to clients</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Signature Batch Size</label>
                      <Input
                        type="number"
                        value={settings.signature_batch_size}
                        onChange={(e) => setSettings({ ...settings, signature_batch_size: parseInt(e.target.value) || 3 })}
                        min={1}
                        max={50}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Number of signatures to send per batch</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Signature Scan Timeout (ms)</label>
                      <Input
                        type="number"
                        value={settings.signature_scan_timeout_ms}
                        onChange={(e) => setSettings({ ...settings, signature_scan_timeout_ms: parseInt(e.target.value) || 30000 })}
                        min={1000}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Timeout for signature scan responses</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Heartbeat Interval (ms)</label>
                      <Input
                        type="number"
                        value={settings.heartbeat_interval_ms}
                        onChange={(e) => setSettings({ ...settings, heartbeat_interval_ms: parseInt(e.target.value) || 30000 })}
                        min={1000}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Server heartbeat interval</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Heartbeat Timeout (ms)</label>
                      <Input
                        type="number"
                        value={settings.heartbeat_timeout_ms}
                        onChange={(e) => setSettings({ ...settings, heartbeat_timeout_ms: parseInt(e.target.value) || 60000 })}
                        min={1000}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Client heartbeat timeout</p>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Enable Module Scanning</label>
                          <p className="text-xs text-muted-foreground">Scan for foreign/injected modules</p>
                        </div>
                        <Checkbox
                          checked={settings.enable_module_scanning}
                          onCheckedChange={(checked) => setSettings({ ...settings, enable_module_scanning: checked as boolean })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Enable Signature Scanning</label>
                          <p className="text-xs text-muted-foreground">Scan memory for cheat signatures</p>
                        </div>
                        <Checkbox
                          checked={settings.enable_signature_scanning}
                          onCheckedChange={(checked) => setSettings({ ...settings, enable_signature_scanning: checked as boolean })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Enable Memory Integrity</label>
                          <p className="text-xs text-muted-foreground">Check memory integrity</p>
                        </div>
                        <Checkbox
                          checked={settings.enable_memory_integrity}
                          onCheckedChange={(checked) => setSettings({ ...settings, enable_memory_integrity: checked as boolean })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Enable Debugger Detection</label>
                          <p className="text-xs text-muted-foreground">Detect debuggers attached to the process</p>
                        </div>
                        <Checkbox
                          checked={settings.enable_debugger_detection}
                          onCheckedChange={(checked) => setSettings({ ...settings, enable_debugger_detection: checked as boolean })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Enable Hook Detection</label>
                          <p className="text-xs text-muted-foreground">Detect function hooks</p>
                        </div>
                        <Checkbox
                          checked={settings.enable_hook_detection}
                          onCheckedChange={(checked) => setSettings({ ...settings, enable_hook_detection: checked as boolean })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={demoAlert}>
                      <Settings className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

        </TabsContent>
      </Tabs>

      {/* Signature Dialog */}
      {showSignatureDialog && (
      <Dialog
        open={true}
        onOpenChange={(open) => {
          if (!open) {
            setShowSignatureDialog(false)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSignature ? 'Edit Signature' : 'Add Signature'}</DialogTitle>
            <DialogDescription>
              {editingSignature ? 'Update signature details' : 'Create a new cheat detection signature'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Only show Module Name when editing (not when adding from detection/pattern breaker tabs) */}
            {editingSignature && (
              <div>
                <label className="text-sm font-medium mb-2 block">Module Name (leave empty for all modules)</label>
                <Input
                  value={sigModuleName}
                  onChange={(e) => setSigModuleName(e.target.value)}
                  placeholder="client.dll (or leave empty)"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Pattern (hex bytes with ? wildcards)</label>
              <Input
                value={sigPattern}
                onChange={(e) => setSigPattern(e.target.value)}
                placeholder="55 8B EC ? ? ? ?"
              />
              <p className="text-xs text-muted-foreground mt-1">Example: "55 8B EC ? ? ? ?"</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input
                value={sigDescription}
                onChange={(e) => setSigDescription(e.target.value)}
                placeholder="What this signature detects"
              />
            </div>
            {/* Only show Signature Type when editing or when not in a specific tab (for backward compatibility) */}
            {editingSignature && (
              <div>
                <label className="text-sm font-medium mb-2 block">Signature Type</label>
                <Select value={sigType} onValueChange={(v) => setSigType(v as 'pattern_breaker' | 'detection')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detection">Detection - Detects actual cheats</SelectItem>
                    <SelectItem value="pattern_breaker">Pattern Breaker - Detects tampering with game functions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {editingSignature && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enabled"
                  checked={sigEnabled}
                  onCheckedChange={(checked) => setSigEnabled(checked as boolean)}
                />
                <label htmlFor="enabled" className="text-sm font-medium">Enabled</label>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowSignatureDialog(false)}>
                Cancel
              </Button>
              <Button onClick={demoAlert}>
                {editingSignature ? 'Update' : 'Add'} Signature
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      )}

      {/* Whitelist Dialog */}
      <Dialog open={showWhitelistDialog} onOpenChange={setShowWhitelistDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingWhitelist ? 'Edit Whitelist Entry' : 'Add Whitelist Entry'}</DialogTitle>
            <DialogDescription>
              {editingWhitelist ? 'Update whitelist entry details' : 'Create a new module whitelist entry'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Module Name *</label>
              <Input
                value={wlModuleName}
                onChange={(e) => setWlModuleName(e.target.value)}
                placeholder="client.dll"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description *</label>
              <Input
                value={wlDescription}
                onChange={(e) => setWlDescription(e.target.value)}
                placeholder="Why this module is whitelisted"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Module Hash (SHA-256, optional)</label>
              <Input
                value={wlHash}
                onChange={(e) => setWlHash(e.target.value)}
                placeholder="64 hex characters"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Module Path (optional)</label>
              <Input
                value={wlPath}
                onChange={(e) => setWlPath(e.target.value)}
                placeholder="Path pattern"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowWhitelistDialog(false)}>
                Cancel
              </Button>
              <Button onClick={demoAlert}>
                {editingWhitelist ? 'Update' : 'Add'} Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Process Whitelist Dialog */}
      <Dialog open={showProcessWhitelistDialog} onOpenChange={setShowProcessWhitelistDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProcessWhitelist ? 'Edit Process Whitelist Entry' : 'Add Process Whitelist Entry'}</DialogTitle>
            <DialogDescription>
              {editingProcessWhitelist ? 'Update process whitelist entry details' : 'Create a new process whitelist entry for handle scanning'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Process Name *</label>
              <Input
                value={pwProcessName}
                onChange={(e) => setPwProcessName(e.target.value)}
                placeholder="obs64.exe"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Executable name (e.g., obs64.exe, steam.exe)</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Path Must Contain (optional)</label>
              <Input
                value={pwPathContains}
                onChange={(e) => setPwPathContains(e.target.value)}
                placeholder="\\obs-studio\\"
              />
              <p className="text-xs text-muted-foreground mt-1">If specified, executable path must contain this string (case-insensitive)</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description (optional)</label>
              <Input
                value={pwDescription}
                onChange={(e) => setPwDescription(e.target.value)}
                placeholder="Why this process is whitelisted"
              />
            </div>
            {editingProcessWhitelist && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pw-enabled"
                  checked={pwEnabled}
                  onCheckedChange={(checked) => setPwEnabled(checked as boolean)}
                />
                <label htmlFor="pw-enabled" className="text-sm font-medium">Enabled</label>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowProcessWhitelistDialog(false)}>
                Cancel
              </Button>
              <Button onClick={demoAlert}>
                {editingProcessWhitelist ? 'Update' : 'Add'} Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
