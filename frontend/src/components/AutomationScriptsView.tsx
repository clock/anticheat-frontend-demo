import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus, Play, Pause, Trash2, Edit, FileText } from 'lucide-react'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { FAKE_AUTOMATION_SCRIPTS, FakeScript } from '@/utils/fake-data'

export function AutomationScriptsView() {
  const [scripts, setScripts] = useState<FakeScript[]>(FAKE_AUTOMATION_SCRIPTS)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedScript, setSelectedScript] = useState<FakeScript | null>(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCode, setFormCode] = useState('')

  const demoAlert = () => alert('Demo mode — actions are disabled.')
  const handleCreate = () => { demoAlert(); setShowCreateDialog(false); resetForm() }
  const handleEdit = () => { demoAlert(); setShowEditDialog(false); setSelectedScript(null); resetForm() }
  const handleDelete = () => { demoAlert(); setShowDeleteDialog(false); setSelectedScript(null) }

  const handleToggle = (script: FakeScript) => {
    setScripts(prev => prev.map(s => s.id === script.id ? { ...s, enabled: !s.enabled } : s))
  }

  const openEditDialog = (script: FakeScript) => {
    setSelectedScript(script)
    setFormName(script.script_name)
    setFormDescription(script.description)
    setFormCode(script.script_code)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (script: FakeScript) => { setSelectedScript(script); setShowDeleteDialog(true) }
  const resetForm = () => { setFormName(''); setFormDescription(''); setFormCode('') }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'auto_flag': return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      case 'auto_suppress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'custom': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Automation Scripts</h2>
          <p className="text-muted-foreground mt-1">Manage auto-flagging rules with custom JavaScript</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={demoAlert}>
            <FileText className="h-4 w-4 mr-2" />View Docs
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />Create Script
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {scripts.map((script) => (
          <Card key={script.id} className="border-2 border-neutral-800 bg-neutral-900/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{script.script_name}</CardTitle>
                    <Badge className={getTypeColor(script.script_type)}>{script.script_type.replace('_', ' ')}</Badge>
                    {script.is_default && <Badge variant="secondary">Default</Badge>}
                    {script.enabled
                      ? <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Enabled</Badge>
                      : <Badge variant="secondary">Disabled</Badge>}
                  </div>
                  <CardDescription>{script.description}</CardDescription>
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Priority: {script.priority}</span>
                    <span>Executions: {script.execution_count.toLocaleString()}</span>
                    {script.last_executed_at && <span>Last run: {new Date(script.last_executed_at).toLocaleString()}</span>}
                    <span>Created by: {script.created_by}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleToggle(script)}>
                    {script.enabled ? <><Pause className="h-4 w-4 mr-1" />Disable</> : <><Play className="h-4 w-4 mr-1" />Enable</>}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(script)}>
                    <Edit className="h-4 w-4 mr-1" />Edit
                  </Button>
                  {!script.is_default && (
                    <Button variant="outline" size="sm" onClick={() => openDeleteDialog(script)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4 mr-1" />Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-neutral-950 p-4 rounded text-xs overflow-x-auto max-h-48">
                <code>{script.script_code}</code>
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCreateDialog && (
      <Dialog open={true} onOpenChange={(open) => { if (!open) { setShowCreateDialog(false); resetForm() } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Automation Script</DialogTitle>
            <DialogDescription>Write a JavaScript function to automatically flag or suppress detections</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Script Name</label><Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="My Auto-Flag Script" /></div>
            <div><label className="text-sm font-medium">Description</label><Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="What does this script do?" /></div>
            <div>
              <label className="text-sm font-medium">JavaScript Code</label>
              <div className="max-h-[400px] overflow-y-auto border border-neutral-800 rounded custom-scrollbar mt-2">
                <CodeEditor value={formCode} language="js" placeholder="// Your script code here&#10;const result = { action: 'none' };&#10;return result;" onChange={(e) => setFormCode(e.target.value)} padding={16} style={{ fontSize: 13, fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace', backgroundColor: '#0a0a0a', minHeight: 300 }} data-color-mode="dark" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm() }}>Cancel</Button>
            <Button onClick={handleCreate}>Create Script</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}

      {showEditDialog && (
      <Dialog open={true} onOpenChange={(open) => { if (!open) { setShowEditDialog(false); setSelectedScript(null); resetForm() } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Automation Script</DialogTitle>
            <DialogDescription>Modify the script configuration and code</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Script Name</label><Input value={formName} onChange={(e) => setFormName(e.target.value)} /></div>
            <div><label className="text-sm font-medium">Description</label><Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} /></div>
            <div>
              <label className="text-sm font-medium">JavaScript Code</label>
              <div className="max-h-[400px] overflow-y-auto border border-neutral-800 rounded custom-scrollbar mt-2">
                <CodeEditor value={formCode} language="js" placeholder="// Your script code here" onChange={(e) => setFormCode(e.target.value)} padding={16} style={{ fontSize: 13, fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace', backgroundColor: '#0a0a0a', minHeight: 300 }} data-color-mode="dark" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); setSelectedScript(null); resetForm() }}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}

      {showDeleteDialog && (
      <Dialog open={true} onOpenChange={(open) => { if (!open) { setShowDeleteDialog(false); setSelectedScript(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Script</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{selectedScript?.script_name}"? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedScript(null) }}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}
