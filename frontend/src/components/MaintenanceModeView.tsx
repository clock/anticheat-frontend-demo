import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Upload, RefreshCw, RotateCcw } from 'lucide-react'
import { FAKE_VERSION_HISTORY, FAKE_CURRENT_VERSIONS } from '@/utils/fake-data'
import { VersionTimelineTree } from './VersionTimelineTree'

export function MaintenanceModeView() {
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false)
  const [uploadChangelog, setUploadChangelog] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [detectedComponent, setDetectedComponent] = useState<'watchdog' | 'anticheat_dll' | null>(null)

  const watchdogHistory = FAKE_VERSION_HISTORY.filter(h => h.component === 'watchdog')
  const dllHistory = FAKE_VERSION_HISTORY.filter(h => h.component === 'anticheat_dll')

  const demoAlert = () => alert('Demo mode — actions are disabled.')
  const handleActivate = (_id: number, _component: 'watchdog' | 'anticheat_dll') => demoAlert()
  const handleRollback = (_id: number, _component: 'watchdog' | 'anticheat_dll', _reason: string) => demoAlert()

  function handleFileSelect(file: File | null) {
    setUploadFile(file)
    if (!file) { setDetectedComponent(null); return }
    const name = file.name.toLowerCase()
    if (name.endsWith('.exe')) setDetectedComponent('watchdog')
    else if (name.endsWith('.dll')) setDetectedComponent('anticheat_dll')
    else setDetectedComponent(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleString()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>
            When enabled, SourceMod will not kick players for missing anticheat. Backend remains operational.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maintenance-mode"
                checked={maintenanceMode}
                onCheckedChange={(checked) => setMaintenanceMode(checked as boolean)}
              />
              <label htmlFor="maintenance-mode" className="text-sm font-medium">
                Enable Maintenance Mode
              </label>
            </div>
            <Button onClick={demoAlert} variant="default">
              Save Maintenance Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Version Control</CardTitle>
          <CardDescription>Upload and manage updates for watchdog.exe and anticheat_dll.dll</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="watchdog">Watchdog History</TabsTrigger>
              <TabsTrigger value="anticheat_dll">Anti-Cheat DLL History</TabsTrigger>
              <TabsTrigger value="current">Current Versions</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">File</label>
                  <div className="flex items-center space-x-2">
                    <Input type="file" accept=".exe,.dll" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
                    {uploadFile && <span className="text-sm text-muted-foreground">{uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)</span>}
                  </div>
                  {detectedComponent && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Detected: <span className="font-medium">{detectedComponent === 'watchdog' ? 'Watchdog (watchdog.exe)' : 'Anti-Cheat DLL (anticheat_dll.dll)'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Changelog (optional)</label>
                  <Textarea value={uploadChangelog} onChange={(e) => setUploadChangelog(e.target.value)} placeholder="Describe what changed in this version..." rows={4} />
                </div>
                <Button onClick={demoAlert} disabled={!uploadFile || !detectedComponent} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />Upload Update
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="watchdog" className="mt-4">
              <div className="space-y-4">
                <Button variant="outline" size="sm" onClick={() => {}}>
                  <RefreshCw className="h-4 w-4 mr-2" />Refresh
                </Button>
                <VersionTimelineTree
                  history={watchdogHistory}
                  onActivate={handleActivate}
                  onRollback={handleRollback}
                  formatDate={formatDate}
                  formatFileSize={formatFileSize}
                />
              </div>
            </TabsContent>

            <TabsContent value="anticheat_dll" className="mt-4">
              <div className="space-y-4">
                <Button variant="outline" size="sm" onClick={() => {}}>
                  <RefreshCw className="h-4 w-4 mr-2" />Refresh
                </Button>
                <VersionTimelineTree
                  history={dllHistory}
                  onActivate={handleActivate}
                  onRollback={handleRollback}
                  formatDate={formatDate}
                  formatFileSize={formatFileSize}
                />
              </div>
            </TabsContent>

            <TabsContent value="current" className="mt-4">
              <div className="space-y-4">
                <Button variant="outline" size="sm" onClick={() => {}}>
                  <RefreshCw className="h-4 w-4 mr-2" />Refresh
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle>Watchdog</CardTitle></CardHeader>
                    <CardContent>
                      {FAKE_CURRENT_VERSIONS.watchdog ? (
                        <div className="space-y-2">
                          <div className="font-semibold">v{FAKE_CURRENT_VERSIONS.watchdog.version}</div>
                          <div className="text-sm text-muted-foreground">
                            <div>Uploaded: {formatDate(FAKE_CURRENT_VERSIONS.watchdog.uploaded_at)}</div>
                            <div>By: {FAKE_CURRENT_VERSIONS.watchdog.uploaded_by_username || FAKE_CURRENT_VERSIONS.watchdog.uploaded_by}</div>
                            <div>Hash: {FAKE_CURRENT_VERSIONS.watchdog.hash.substring(0, 16)}...</div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => demoAlert()} className="w-full">
                            <RotateCcw className="h-4 w-4 mr-1" />Rollback
                          </Button>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No active version</div>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Anti-Cheat DLL</CardTitle></CardHeader>
                    <CardContent>
                      {FAKE_CURRENT_VERSIONS.anticheat_dll ? (
                        <div className="space-y-2">
                          <div className="font-semibold">v{FAKE_CURRENT_VERSIONS.anticheat_dll.version}</div>
                          <div className="text-sm text-muted-foreground">
                            <div>Uploaded: {formatDate(FAKE_CURRENT_VERSIONS.anticheat_dll.uploaded_at)}</div>
                            <div>By: {FAKE_CURRENT_VERSIONS.anticheat_dll.uploaded_by_username || FAKE_CURRENT_VERSIONS.anticheat_dll.uploaded_by}</div>
                            <div>Hash: {FAKE_CURRENT_VERSIONS.anticheat_dll.hash.substring(0, 16)}...</div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => demoAlert()} className="w-full">
                            <RotateCcw className="h-4 w-4 mr-1" />Rollback
                          </Button>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No active version</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
