import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, ChevronRight, ChevronDown, RotateCcw, Eye, Download } from 'lucide-react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
    changelog: string | null
    verification_status: string
    previous_version_id?: number | null
    verification_details?: string | null
}

interface UpdateHistoryTreeProps {
    history: UpdateHistoryEntry[]
    onActivate: (versionId: number, component: 'watchdog' | 'anticheat_dll') => void
    onRollback: (versionId: number, component: 'watchdog' | 'anticheat_dll') => void
    formatDate: (timestamp: number) => string
    formatFileSize: (bytes: number) => string
}

interface VersionNode {
    entry: UpdateHistoryEntry
    children: VersionNode[]
    level: number
}

function SortableVersionItem({
    node,
    isExpanded,
    onToggle,
    onActivate,
    onRollback,
    onViewDetails,
    formatDate,
    formatFileSize,
}: {
    node: VersionNode
    isExpanded: boolean
    onToggle: () => void
    onActivate: (versionId: number, component: 'watchdog' | 'anticheat_dll') => void
    onRollback: (versionId: number, component: 'watchdog' | 'anticheat_dll') => void
    onViewDetails: (entry: UpdateHistoryEntry) => void
    formatDate: (timestamp: number) => string
    formatFileSize: (bytes: number) => string
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: node.entry.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const hasChildren = node.children.length > 0
    const indent = node.level * 24

    return (
        <div ref={setNodeRef} style={style} className="mb-2">
            <Card
                className={`p-3 cursor-move ${isDragging ? 'shadow-lg' : ''}`}
                style={{ marginLeft: `${indent}px` }}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                            {hasChildren && (
                                <button
                                    onClick={onToggle}
                                    className="p-0.5 hover:bg-secondary rounded"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </button>
                            )}
                            {!hasChildren && <div className="w-5" />}
                            <span className="font-semibold">{node.entry.component}</span>
                            <Badge variant={node.entry.is_active ? 'default' : 'secondary'}>
                                v{node.entry.version}
                            </Badge>
                            {node.entry.is_active && (
                                <Badge variant="outline">Active</Badge>
                            )}
                            {node.entry.is_rollback && (
                                <Badge variant="outline">Rollback</Badge>
                            )}
                            {node.entry.verification_status === 'passed' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1 ml-7">
                            <div>Uploaded by: {node.entry.uploaded_by_username || node.entry.uploaded_by}</div>
                            <div>Date: {formatDate(node.entry.uploaded_at)}</div>
                            <div>Size: {formatFileSize(node.entry.file_size)}</div>
                            <div>Hash: {node.entry.hash.substring(0, 16)}...</div>
                            {node.entry.changelog && (
                                <div className="mt-2 p-2 bg-secondary/50 rounded text-xs">
                                    {node.entry.changelog}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-2 ml-4" {...attributes} {...listeners}>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewDetails(node.entry)}
                            className="cursor-pointer"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {!node.entry.is_active && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onActivate(node.entry.id, node.entry.component as 'watchdog' | 'anticheat_dll')}
                                    className="cursor-pointer"
                                >
                                    Activate
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onRollback(node.entry.id, node.entry.component as 'watchdog' | 'anticheat_dll')}
                                    className="cursor-pointer"
                                >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Rollback
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export function UpdateHistoryTree({
    history,
    onActivate,
    onRollback,
    formatDate,
    formatFileSize,
}: UpdateHistoryTreeProps) {
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
    const [selectedDetails, setSelectedDetails] = useState<UpdateHistoryEntry | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // build tree structure from flat history
    // group by component first, then build parent-child relationships
    const buildTree = (): VersionNode[] => {
        const entryMap = new Map<number, UpdateHistoryEntry>()
        history.forEach(entry => entryMap.set(entry.id, entry))

        const nodeMap = new Map<number, VersionNode>()
        const componentGroups = new Map<string, VersionNode[]>()

        // create nodes and group by component
        history.forEach(entry => {
            const node: VersionNode = {
                entry,
                children: [],
                level: 0,
            }
            nodeMap.set(entry.id, node)
            
            if (!componentGroups.has(entry.component)) {
                componentGroups.set(entry.component, [])
            }
        })

        // build tree relationships within each component
        history.forEach(entry => {
            const node = nodeMap.get(entry.id)!
            if (entry.previous_version_id && nodeMap.has(entry.previous_version_id)) {
                const parent = nodeMap.get(entry.previous_version_id)!
                // only link if same component
                if (parent.entry.component === entry.component) {
                    parent.children.push(node)
                    node.level = parent.level + 1
                } else {
                    // different component, add as root
                    componentGroups.get(entry.component)!.push(node)
                }
            } else {
                // root node for this component
                componentGroups.get(entry.component)!.push(node)
            }
        })

        // sort each component's roots by date (newest first)
        const allRoots: VersionNode[] = []
        componentGroups.forEach((roots, component) => {
            roots.sort((a, b) => b.entry.uploaded_at - a.entry.uploaded_at)
            
            // recursively sort children
            const sortChildren = (node: VersionNode) => {
                node.children.sort((a, b) => b.entry.uploaded_at - a.entry.uploaded_at)
                node.children.forEach(sortChildren)
            }
            roots.forEach(sortChildren)
            
            allRoots.push(...roots)
        })

        return allRoots
    }

    const tree = buildTree()

    // flatten tree for drag and drop
    const flattenTree = (nodes: VersionNode[]): VersionNode[] => {
        const result: VersionNode[] = []
        const traverse = (node: VersionNode) => {
            result.push(node)
            if (expandedNodes.has(node.entry.id)) {
                node.children.forEach(traverse)
            }
        }
        nodes.forEach(traverse)
        return result
    }

    const flatTree = flattenTree(tree)

    const handleDragEnd = (event: DragEndEvent) => {
        // drag functionality for visual reordering/navigation
        // the tree structure is preserved, dragging just helps navigate long lists
        const { active, over } = event
        // could implement custom reordering logic here if needed
    }

    const toggleNode = (nodeId: number) => {
        setExpandedNodes(prev => {
            const next = new Set(prev)
            if (next.has(nodeId)) {
                next.delete(nodeId)
            } else {
                next.add(nodeId)
            }
            return next
        })
    }

    const renderNode = (node: VersionNode): JSX.Element => {
        const isExpanded = expandedNodes.has(node.entry.id)
        return (
            <div key={node.entry.id}>
                <SortableVersionItem
                    node={node}
                    isExpanded={isExpanded}
                    onToggle={() => toggleNode(node.entry.id)}
                    onActivate={onActivate}
                    onRollback={onRollback}
                    onViewDetails={setSelectedDetails}
                    formatDate={formatDate}
                    formatFileSize={formatFileSize}
                />
                {isExpanded && node.children.length > 0 && (
                    <div className="ml-6">
                        {node.children.map(child => renderNode(child))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={flatTree.map(n => n.entry.id)} 
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {tree.map(node => renderNode(node))}
                    </div>
                </SortableContext>
            </DndContext>

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
                                {selectedDetails.is_rollback && (
                                    <div><strong>Rollback from:</strong> {selectedDetails.rollback_from_version}</div>
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
                                        <Button variant="outline" onClick={() => {
                                            onRollback(selectedDetails.id, selectedDetails.component as 'watchdog' | 'anticheat_dll')
                                            setSelectedDetails(null)
                                        }}>
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Rollback
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
