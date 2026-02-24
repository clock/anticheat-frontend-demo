import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, XCircle, RotateCcw, Eye, Upload, ArrowDown, ArrowUp } from 'lucide-react'

interface UpdateHistoryEntry {
    id: number
    component: string
    version: string
    hash: string
    file_size: number
    uploaded_at: number
    uploaded_by: string
    uploaded_by_username: string | null
    is_active: boolean
    is_rollback: boolean
    rollback_from_version: string | null
    rollback_reason: string | null
    changelog: string | null
    verification_status: string
    previous_version_id?: number | null
    verification_details?: string | null
    download_count?: number
}

interface VersionTimelineTreeProps {
    history: UpdateHistoryEntry[]
    onActivate: (versionId: number, component: 'watchdog' | 'anticheat_dll') => void
    onRollback: (versionId: number, component: 'watchdog' | 'anticheat_dll', reason: string) => void
    formatDate: (timestamp: number) => string
    formatFileSize: (bytes: number) => string
}

function VersionItem({
    entry,
    isLast,
    onActivate,
    onRollback,
    onViewDetails,
    formatDate,
    formatFileSize,
}: {
    entry: UpdateHistoryEntry
    isLast: boolean
    onActivate: (versionId: number, component: 'watchdog' | 'anticheat_dll') => void
    onRollback: (versionId: number, component: 'watchdog' | 'anticheat_dll', reason: string) => void
    onViewDetails: (entry: UpdateHistoryEntry) => void
    formatDate: (timestamp: number) => string
    formatFileSize: (bytes: number) => string
}) {
    const [showRollbackForm, setShowRollbackForm] = useState(false)
    const [rollbackReason, setRollbackReason] = useState('')
    
    const handleRollback = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (rollbackReason.trim()) {
            onRollback(entry.id, entry.component as 'watchdog' | 'anticheat_dll', rollbackReason.trim())
            setShowRollbackForm(false)
            setRollbackReason('')
        }
    }

    const handleActivate = (e: React.MouseEvent) => {
        e.stopPropagation()
        onActivate(entry.id, entry.component as 'watchdog' | 'anticheat_dll')
    }

    const handleViewDetails = (e: React.MouseEvent) => {
        e.stopPropagation()
        onViewDetails(entry)
    }

    return (
        <div className="relative">
            {/* Connection line */}
            {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
            )}
            
            <Card className="p-4 mb-2">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                            {/* Timeline indicator */}
                            <div className="w-3 h-3 rounded-full bg-primary border-2 border-background flex-shrink-0" />
                            
                            <span className="font-semibold">{entry.component}</span>
                            <Badge variant={entry.is_active ? 'default' : 'secondary'}>
                                v{entry.version}
                            </Badge>
                            {entry.is_active && (
                                <Badge variant="outline">Active</Badge>
                            )}
                            {entry.is_rollback && (
                                <Badge variant="outline" className="bg-orange-500/10">
                                    <RotateCcw className="h-3 w-3 mr-1" />
                                    Rollback
                                </Badge>
                            )}
                            {entry.verification_status === 'passed' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                            )}
                        </div>
                        
                        <div className="ml-5 space-y-1">
                            {entry.is_rollback ? (
                                <div className="text-sm">
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                        <RotateCcw className="h-3 w-3" />
                                        <span>Rolled back from v{entry.rollback_from_version}</span>
                                    </div>
                                    {entry.rollback_reason && (
                                        <div className="mt-1 p-2 bg-orange-500/10 rounded text-xs">
                                            <strong>Reason:</strong> {entry.rollback_reason}
                                        </div>
                                    )}
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Rolled back by: {entry.uploaded_by_username || entry.uploaded_by}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm">
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                        <Upload className="h-3 w-3" />
                                        <span>Uploaded by: {entry.uploaded_by_username || entry.uploaded_by}</span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="text-xs text-muted-foreground space-y-0.5">
                                <div>Date: {formatDate(entry.uploaded_at)}</div>
                                <div>Size: {formatFileSize(entry.file_size)}</div>
                                <div>Hash: {entry.hash.substring(0, 16)}...</div>
                                {entry.download_count !== undefined && (
                                    <div>Downloads: {entry.download_count}</div>
                                )}
                            </div>
                            
                            {entry.changelog && (
                                <div className="mt-2 p-2 bg-secondary/50 rounded text-xs">
                                    {entry.changelog}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleViewDetails}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {!entry.is_active && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleActivate}
                                >
                                    Activate
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowRollbackForm(!showRollbackForm)
                                    }}
                                >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Rollback
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Rollback form */}
                {showRollbackForm && (
                    <div className="mt-4 p-3 bg-secondary/50 rounded border border-border">
                        <label className="text-sm font-medium mb-2 block">Rollback Reason</label>
                        <Textarea
                            value={rollbackReason}
                            onChange={(e) => setRollbackReason(e.target.value)}
                            placeholder="Enter reason for rollback..."
                            rows={2}
                            className="mb-2"
                        />
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                onClick={handleRollback}
                                disabled={!rollbackReason.trim()}
                            >
                                Confirm Rollback
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowRollbackForm(false)
                                    setRollbackReason('')
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}

export function VersionTimelineTree({
    history,
    onActivate,
    onRollback,
    formatDate,
    formatFileSize,
}: VersionTimelineTreeProps) {
    const [selectedDetails, setSelectedDetails] = useState<UpdateHistoryEntry | null>(null)
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

    // sort history chronologically
    const sortedHistory = [...history].sort((a, b) => {
        return sortOrder === 'newest' 
            ? b.uploaded_at - a.uploaded_at
            : a.uploaded_at - b.uploaded_at
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                    >
                        {sortOrder === 'newest' ? (
                            <>
                                <ArrowDown className="h-4 w-4 mr-1" />
                                Newest First
                            </>
                        ) : (
                            <>
                                <ArrowUp className="h-4 w-4 mr-1" />
                                Oldest First
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="relative pl-6">
                {/* Main timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-0">
                    {sortedHistory.map((entry, index) => (
                        <VersionItem
                            key={entry.id}
                            entry={entry}
                            isLast={index === sortedHistory.length - 1}
                            onActivate={onActivate}
                            onRollback={onRollback}
                            onViewDetails={setSelectedDetails}
                            formatDate={formatDate}
                            formatFileSize={formatFileSize}
                        />
                    ))}
                </div>
            </div>

            {/* Details Modal */}
            {selectedDetails && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedDetails(null)}>
                    <Card className="p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Version Details</h3>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedDetails(null)}>Close</Button>
                            </div>
                            <div className="space-y-2">
                                <div><strong>Component:</strong> {selectedDetails.component}</div>
                                <div><strong>Version:</strong> v{selectedDetails.version}</div>
                                <div><strong>Uploaded by:</strong> {selectedDetails.uploaded_by_username || selectedDetails.uploaded_by}</div>
                                <div><strong>Date:</strong> {formatDate(selectedDetails.uploaded_at)}</div>
                                <div><strong>File Size:</strong> {formatFileSize(selectedDetails.file_size)}</div>
                                <div><strong>Hash:</strong> <code className="text-xs">{selectedDetails.hash}</code></div>
                                <div><strong>Status:</strong> {selectedDetails.is_active ? 'Active' : 'Inactive'}</div>
                                <div><strong>Verification:</strong> {selectedDetails.verification_status}</div>
                                {selectedDetails.download_count !== undefined && (
                                    <div><strong>Downloads:</strong> {selectedDetails.download_count}</div>
                                )}
                                {selectedDetails.is_rollback && (
                                    <>
                                        <div><strong>Rollback from:</strong> v{selectedDetails.rollback_from_version}</div>
                                        {selectedDetails.rollback_reason && (
                                            <div>
                                                <strong>Rollback Reason:</strong>
                                                <div className="mt-1 p-2 bg-orange-500/10 rounded text-sm">{selectedDetails.rollback_reason}</div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {selectedDetails.changelog && (
                                    <div>
                                        <strong>Changelog:</strong>
                                        <div className="mt-1 p-2 bg-secondary/50 rounded text-sm">{selectedDetails.changelog}</div>
                                    </div>
                                )}
                                {selectedDetails.verification_details && (
                                    <div>
                                        <strong>Verification Details:</strong>
                                        <div className="mt-1 p-2 bg-secondary/50 rounded text-sm">
                                            <pre className="text-xs overflow-auto">
                                                {typeof selectedDetails.verification_details === 'string' 
                                                    ? JSON.stringify(JSON.parse(selectedDetails.verification_details), null, 2)
                                                    : JSON.stringify(selectedDetails.verification_details, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-2 pt-4">
                                {!selectedDetails.is_active && (
                                    <>
                                        <Button onClick={() => {
                                            onActivate(selectedDetails.id, selectedDetails.component as 'watchdog' | 'anticheat_dll')
                                            setSelectedDetails(null)
                                        }}>
                                            Activate
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
