export interface User {
  steamid: string
  steam_username?: string
  steam_avatar_url?: string
  total_detections: number
  total_sessions: number
  first_seen: number
  last_seen: number
  is_banned: boolean
  warning_level: number
  has_suspicious_traces: boolean
  isOnline?: boolean
  // Flagged status fields
  flagged_status?: 'critical' | 'high' | 'medium' | 'manual' | null
  flag_reason?: string | null
  flagged_at?: number | null
  auto_flagged?: boolean
  marked_for_ban?: boolean
  marked_for_ban_at?: number | null
  marked_for_ban_by?: string | null
}

export interface Stats {
  total: number
  unreviewed: number
}

export interface Detection {
  id: number
  steamid: string
  detection_type: number
  details: string
  timestamp: number
  client_timestamp: number
  session_id: string
  client_ip: string
  reviewed: boolean
  reviewed_at?: number | null
  reviewed_by?: string | null
  action_taken?: string | null
  notes?: string | null
}

export interface ActiveSession {
  session_id: string
  connected_at: number
  last_heartbeat: number
  client_ip: string
  dll_loaded: boolean
  dll_heartbeat_ok: boolean
}

export interface NameHistoryEntry {
  username: string
  first_seen: number
  last_seen: number
}

export interface IPHistoryEntry {
  ip_address: string
  first_seen: number
  last_seen: number
  connection_count: number
}

export interface ModuleEntry {
  module_name: string
  module_path: string | null
  module_hash: string | null
  first_seen: number
  last_seen: number
  detection_count: number
  suspicious: boolean
}

export interface HWIDEntry {
  hwid_hash: string
  session_id: string | null
  ip_address: string | null
  cpu_id: string | null
  motherboard_serial: string | null
  disk_serial: string | null
  bios_serial: string | null
  mac_address: string | null
  volume_serial: string | null
  first_seen: number
  last_seen: number
  session_count: number
}

export interface FingerprintTrace {
  id: number
  steamid: string
  trace_type: string
  trace_value: string
  trace_hash: string | null
  first_seen: number
  last_seen: number
  detection_count: number
  suspicious: boolean
  warning_level: number
  notes: string | null
  shared_with_users?: Array<{ steamid: string; steam_username: string | null }>
}

export interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface KickEvent {
  id: number
  timestamp: number
  player_name: string | null
  reason: string
  source: string
}

export interface UserDetailData {
  user: User
  detections: Detection[]
  active_session: ActiveSession | null
  name_history: NameHistoryEntry[]
  ip_history: IPHistoryEntry[]
  modules: ModuleEntry[]
  hwid_history: HWIDEntry[]
  hwid_pagination: PaginationInfo
  fingerprint_traces: FingerprintTrace[]
  kick_events: KickEvent[]
  warning_level: number
  has_suspicious_traces: boolean
  has_shared_traces: boolean
  loaded_modules: LoadedModule[]
  running_processes: RunningProcess[]
  handle_history: HandleHistoryEntry[]
}

export interface WarningSuppressionRecord {
  id: number
  steamid: string
  suppression_type: string
  related_id: string | null
  reason: string | null
  suppressed_by: string
  suppressed_at: number
  created_at: string
}

export interface LoadedModule {
  module_name: string
  module_path: string
  is_signed: boolean
  signer_name: string | null
  module_size: number
  base_address: number
}

export interface RunningProcess {
  process_name: string
  process_id: number
  memory_usage: number
  exe_path: string | null
  is_elevated: boolean
  has_handle_to_game: boolean
}

export interface HandleHistoryEntry {
  owner_process_name: string
  owner_process_id: number
  target_process_id: number
  access_rights: number
  handle_value: number
  is_suspicious: boolean
  is_whitelisted: boolean
  exe_path: string | null
  timestamp: number
}

// Detection type information with severity levels
export const detectionTypeInfo: Record<number, { name: string; severity: 'critical' | 'high' | 'medium' | 'low' }> = {
  1: { name: 'Foreign Module', severity: 'high' },
  2: { name: 'Memory Integrity Failure', severity: 'high' },
  3: { name: 'Debugger Detected', severity: 'low' },
  4: { name: 'Self-Integrity Failure', severity: 'critical' },
  5: { name: 'Suspicious Handle', severity: 'medium' },
  6: { name: 'Signature Scan / Hook Detection', severity: 'critical' },
  7: { name: 'ConVar Change', severity: 'low' },
  100: { name: 'Bhop / Auto-Hop', severity: 'medium' },
  101: { name: 'Invalid ConVar', severity: 'high' },
  102: { name: 'Edge Jump', severity: 'medium' },
  103: { name: 'Aimbot', severity: 'critical' },
  104: { name: 'Backtrack', severity: 'high' },
  105: { name: 'Legit Anti-Aim', severity: 'medium' },
}

