import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight, Save, RotateCcw, Play } from 'lucide-react'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { FAKE_AUTOMATION_SCRIPTS } from '@/utils/fake-data'

interface UserScriptEditorProps {
  steamid: string
  userData: any
}

const DEFAULT_SCRIPT = FAKE_AUTOMATION_SCRIPTS[0]

export function UserScriptEditor({ steamid, userData }: UserScriptEditorProps) {
  const [expanded, setExpanded] = useState(false)
  const [formCode, setFormCode] = useState(DEFAULT_SCRIPT?.script_code || '')
  const [isDirty, setIsDirty] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testOutput, setTestOutput] = useState<string[]>([])

  const demoAlert = () => alert('Demo mode — actions are disabled.')

  const handleCodeChange = (newCode: string) => {
    setFormCode(newCode)
    setIsDirty(newCode !== (DEFAULT_SCRIPT?.script_code || ''))
  }

  const handleSave = () => { demoAlert() }

  const handleResetToDefault = () => {
    if (DEFAULT_SCRIPT) {
      setFormCode(DEFAULT_SCRIPT.script_code)
      setIsDirty(false)
      addLog('✓ Reset to default script')
    }
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestOutput(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const handleTestRun = async () => {
    setTesting(true)
    setTestOutput([])
    addLog('=== Starting test run ===')
    addLog('Script execution environment initialized')
    addLog(`User: ${userData.steam_username || steamid}`)
    addLog(`Total detections: ${userData.total_detections || 0}`)
    addLog(`Is banned: ${userData.is_banned || false}`)
    addLog(`Flagged status: ${userData.flagged_status || 'none'}`)
    addLog('--- Demo Mode ---')
    addLog('Script test execution is disabled in demo mode.')
    addLog('In production, scripts run server-side via Node.js vm2.')
    setTesting(false)
  }

  return (
    <Card className="border-2 border-neutral-800 bg-neutral-900/50 backdrop-blur-xl animate-fade-in">
      <CardHeader
        className="cursor-pointer hover:bg-neutral-800/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle>
            Auto-Flag Script
            <Badge variant="secondary" className="ml-2">Default</Badge>
            {isDirty && (
              <Badge className="ml-2 bg-orange-500/10 text-orange-400 border-orange-500/30">
                Unsaved
              </Badge>
            )}
          </CardTitle>
          {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Custom Script
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              disabled={!isDirty}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset to Default
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleTestRun}
              disabled={testing}
            >
              <Play className="h-4 w-4 mr-1" />
              {testing ? 'Testing...' : 'Test Run'}
            </Button>

          </div>

          {/* Code Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">JavaScript Code</label>
              <span className="text-xs text-muted-foreground">
                {formCode.split('\n').length} lines
              </span>
            </div>
            <div className="max-h-[300px] overflow-y-auto border border-neutral-800 rounded custom-scrollbar">
              <CodeEditor
                value={formCode}
                language="js"
                placeholder="// Your auto-flag script
const result = { action: 'none' };
return result;"
                onChange={(e) => handleCodeChange(e.target.value)}
                padding={16}
                style={{
                  fontSize: 13,
                  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                  backgroundColor: '#0a0a0a',
                  minHeight: 280,
                }}
                data-color-mode="dark"
              />
            </div>
          </div>

          {/* Console Output - Always visible */}
          <div className="border border-neutral-700 rounded bg-neutral-950">
            <div className="flex items-center justify-between p-2 border-b border-neutral-700 bg-neutral-900">
              <span className="text-xs font-medium text-green-400">Console Output</span>
              <span className="text-xs text-muted-foreground">
                {testOutput.length > 0 ? `${testOutput.length} messages` : 'Run test to see output'}
              </span>
            </div>
            <div className="p-3 max-h-48 overflow-y-auto min-h-[80px] custom-scrollbar">
              {testOutput.length > 0 ? (
                <pre className="text-xs font-mono">
                  {testOutput.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.includes('✓') ? 'text-green-400' :
                        line.includes('✗') ? 'text-red-400' :
                        line.includes('===') ? 'text-blue-400 font-bold' :
                        line.includes('---') ? 'text-yellow-400 font-bold' :
                        'text-gray-300'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </pre>
              ) : (
                <span className="text-xs text-muted-foreground">Click "Test Run" to execute the script and see output here.</span>
              )}
            </div>
          </div>

        </CardContent>
      )}
    </Card>
  )
}
