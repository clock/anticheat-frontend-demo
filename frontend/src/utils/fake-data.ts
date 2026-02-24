import { User, UserDetailData, Detection, ActiveSession, NameHistoryEntry, IPHistoryEntry, ModuleEntry, HWIDEntry, FingerprintTrace, KickEvent, LoadedModule, RunningProcess, HandleHistoryEntry } from '@/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateSteamID(): string {
  return '7656119' + String(randomInt(80000000, 99999999))
}

const now = Date.now()
const DAY = 24 * 60 * 60 * 1000

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

const ADMIN_STEAMID = '76561198000000001'

export const FAKE_USERS: User[] = [
  {
    steamid: '76561198072419802',
    steam_username: 'TacticalNinja47',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    total_detections: 47,
    total_sessions: 89,
    first_seen: now - 312 * DAY,
    last_seen: now - 1 * DAY,
    is_banned: true,
    warning_level: 5,
    has_suspicious_traces: true,
    isOnline: false,
    flagged_status: 'critical',
    flag_reason: 'Signature match: Aimware.dll detected in memory',
    flagged_at: now - 3 * DAY,
    auto_flagged: true,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198114233945',
    steam_username: 'SilentAssassin',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/c97ef22f36fc9b5635f562889b6d34e46cce38e1_full.jpg',
    total_detections: 23,
    total_sessions: 54,
    first_seen: now - 201 * DAY,
    last_seen: now,
    is_banned: false,
    warning_level: 3,
    has_suspicious_traces: true,
    isOnline: true,
    flagged_status: 'critical',
    flag_reason: 'Memory integrity failure — HWID shared with banned account',
    flagged_at: now - 1 * DAY,
    auto_flagged: true,
    marked_for_ban: true,
    marked_for_ban_at: now - 6 * 60 * 60 * 1000,
    marked_for_ban_by: ADMIN_STEAMID,
  },
  {
    steamid: '76561198203847561',
    steam_username: 'xXAimBotXx',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/02fac911dca191ca0dab1d1631e594f4c8355430_full.jpg',
    total_detections: 35,
    total_sessions: 112,
    first_seen: now - 280 * DAY,
    last_seen: now - 5 * DAY,
    is_banned: true,
    warning_level: 4,
    has_suspicious_traces: false,
    isOnline: false,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198039182736',
    steam_username: 'HeadshotKing',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/f196ce0f5247cf10ed3af7b32346d48bd4b062f0_full.jpg',
    total_detections: 0,
    total_sessions: 231,
    first_seen: now - 520 * DAY,
    last_seen: now,
    is_banned: false,
    warning_level: 0,
    has_suspicious_traces: false,
    isOnline: true,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198155029384',
    steam_username: 'r3kt_Gaming',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/492ef7d447427eaffaa4b22d0bad6b3444ccfdc0_full.jpg',
    total_detections: 2,
    total_sessions: 47,
    first_seen: now - 88 * DAY,
    last_seen: now,
    is_banned: false,
    warning_level: 0,
    has_suspicious_traces: false,
    isOnline: true,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198087654321',
    steam_username: 'NightCrawler99',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/8294d5ad6bc09b0a1d82429b69771aaadd4d949e_full.jpg',
    total_detections: 12,
    total_sessions: 78,
    first_seen: now - 190 * DAY,
    last_seen: now - 2 * DAY,
    is_banned: false,
    warning_level: 2,
    has_suspicious_traces: true,
    isOnline: false,
    flagged_status: 'high',
    flag_reason: 'HWID spoofing tool traces found across 3 sessions',
    flagged_at: now - 4 * DAY,
    auto_flagged: true,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198063921048',
    steam_username: 'FlashbangKing',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/d893b050b2a3b7524efce33f3ac56d9d8a5636df_full.jpg',
    total_detections: 31,
    total_sessions: 67,
    first_seen: now - 241 * DAY,
    last_seen: now - 9 * DAY,
    is_banned: true,
    warning_level: 4,
    has_suspicious_traces: false,
    isOnline: false,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198190234567',
    steam_username: 'SmokeWizard',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/62881b4c144c43af7d8ac31f36cfcacde760dbcd_full.jpg',
    total_detections: 18,
    total_sessions: 93,
    first_seen: now - 155 * DAY,
    last_seen: now - 1 * DAY,
    is_banned: false,
    warning_level: 2,
    has_suspicious_traces: false,
    isOnline: false,
    flagged_status: 'high',
    flag_reason: 'Repeated IAT hook detections across multiple sessions',
    flagged_at: now - 2 * DAY,
    auto_flagged: true,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198012837465',
    steam_username: 'ZeroRecoil_CS',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/6f286e56e44d76779da78587f4825dd2a056f21c_full.jpg',
    total_detections: 1,
    total_sessions: 182,
    first_seen: now - 410 * DAY,
    last_seen: now - 3 * DAY,
    is_banned: false,
    warning_level: 0,
    has_suspicious_traces: false,
    isOnline: false,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198247810293',
    steam_username: 'PhantomStrike',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/d38310bc52f651e2a3317a5da47643c29038e742_full.jpg',
    total_detections: 28,
    total_sessions: 61,
    first_seen: now - 175 * DAY,
    last_seen: now,
    is_banned: false,
    warning_level: 3,
    has_suspicious_traces: true,
    isOnline: true,
    flagged_status: 'critical',
    flag_reason: 'CheatEngine signature found + self-integrity bypass detected',
    flagged_at: now - 12 * 60 * 60 * 1000,
    auto_flagged: true,
    marked_for_ban: true,
    marked_for_ban_at: now - 4 * 60 * 60 * 1000,
    marked_for_ban_by: ADMIN_STEAMID,
  },
  {
    steamid: '76561198058374610',
    steam_username: 'DesertEagle47',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/84be6eff44e27d9ab9de97c3572978421ce4f690_full.jpg',
    total_detections: 0,
    total_sessions: 308,
    first_seen: now - 730 * DAY,
    last_seen: now,
    is_banned: false,
    warning_level: 0,
    has_suspicious_traces: false,
    isOnline: true,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198301928374',
    steam_username: 'Boomerang88',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/e1fd892481c5615517b5815049da8c016c1dc930_full.jpg',
    total_detections: 8,
    total_sessions: 35,
    first_seen: now - 62 * DAY,
    last_seen: now - 3 * DAY,
    is_banned: false,
    warning_level: 1,
    has_suspicious_traces: true,
    isOnline: false,
    flagged_status: 'medium',
    flag_reason: 'Repeated bhop detections across 4 sessions',
    flagged_at: now - 5 * DAY,
    auto_flagged: true,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198138472910',
    steam_username: 'TriggerFinger',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/85a75487e05bb44501829a6ae94f2f5244cebc90_full.jpg',
    total_detections: 0,
    total_sessions: 144,
    first_seen: now - 290 * DAY,
    last_seen: now,
    is_banned: false,
    warning_level: 0,
    has_suspicious_traces: false,
    isOnline: true,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198274651038',
    steam_username: 'BunnyHopGod',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/44008f287621dc759d30dfa5fef44f2d6d5433a4_full.jpg',
    total_detections: 6,
    total_sessions: 28,
    first_seen: now - 45 * DAY,
    last_seen: now - 1 * DAY,
    is_banned: false,
    warning_level: 1,
    has_suspicious_traces: false,
    isOnline: false,
    flagged_status: 'medium',
    flag_reason: 'Bhop pattern detected: avg jump interval below threshold',
    flagged_at: now - 7 * DAY,
    auto_flagged: true,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198049273856',
    steam_username: 'SteelNerve',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/e0f10293da20833a9b0a75c8cce67d1ff6d4b2de_full.jpg',
    total_detections: 42,
    total_sessions: 203,
    first_seen: now - 601 * DAY,
    last_seen: now - 14 * DAY,
    is_banned: true,
    warning_level: 5,
    has_suspicious_traces: false,
    isOnline: false,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198167384920',
    steam_username: 'QuickScope360',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/888db44d5f501a357eb654012404006051185427_full.jpg',
    total_detections: 3,
    total_sessions: 76,
    first_seen: now - 130 * DAY,
    last_seen: now - 4 * DAY,
    is_banned: false,
    warning_level: 0,
    has_suspicious_traces: false,
    isOnline: false,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198223048576',
    steam_username: 'RicochetKing',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/a480693b45da0819199d4e70c78ceb3ab5c31cb4_full.jpg',
    total_detections: 14,
    total_sessions: 59,
    first_seen: now - 143 * DAY,
    last_seen: now - 2 * DAY,
    is_banned: false,
    warning_level: 2,
    has_suspicious_traces: true,
    isOnline: false,
    flagged_status: 'manual',
    flag_reason: 'Manually flagged for review — module hashes match known bypass tool variant',
    flagged_at: now - 3 * DAY,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198081920374',
    steam_username: 'Clutchmaster',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/aa17093860597132c993a00cf05adf2adc24d98d_full.jpg',
    total_detections: 1,
    total_sessions: 267,
    first_seen: now - 480 * DAY,
    last_seen: now,
    is_banned: false,
    warning_level: 0,
    has_suspicious_traces: false,
    isOnline: true,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198318204756',
    steam_username: 'WallBanger',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/b6b39d3c3d733306ae0b127250c68699ccfe6c0f_full.jpg',
    total_detections: 16,
    total_sessions: 41,
    first_seen: now - 74 * DAY,
    last_seen: now - 1 * DAY,
    is_banned: false,
    warning_level: 2,
    has_suspicious_traces: false,
    isOnline: false,
    flagged_status: 'high',
    flag_reason: 'ConVar sv_cheats modifications detected across 6 sessions',
    flagged_at: now - 2 * DAY,
    auto_flagged: true,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
  {
    steamid: '76561198024609183',
    steam_username: 'AceHunter99',
    steam_avatar_url: 'https://avatars.akamai.steamstatic.com/56b0f602767eaad0d87fe57f86bd351ce6ef88b2_full.jpg',
    total_detections: 0,
    total_sessions: 512,
    first_seen: now - 890 * DAY,
    last_seen: now - 6 * DAY,
    is_banned: false,
    warning_level: 0,
    has_suspicious_traces: false,
    isOnline: false,
    flagged_status: null,
    flag_reason: null,
    flagged_at: null,
    auto_flagged: false,
    marked_for_ban: false,
    marked_for_ban_at: null,
    marked_for_ban_by: null,
  },
]

export function searchFakeUsers(users: User[], query: string): User[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return users
  return users.filter(user => {
    const username = (user.steam_username || '').toLowerCase()
    const steamid = user.steamid.toLowerCase()
    return username.includes(normalizedQuery) || steamid.includes(normalizedQuery)
  })
}

// ---------------------------------------------------------------------------
// User Detail
// ---------------------------------------------------------------------------

const CLIENT_DETECTION_TYPES = [1, 2, 3, 4, 5, 6, 7]
const SERVER_DETECTION_TYPES = [100, 102, 103, 104, 105]

const CLIENT_DETECTION_DETAILS: Record<number, string[]> = {
  1: ['Module loaded from non-whitelisted path', 'Unknown DLL injected into game process', 'Foreign module signature mismatch'],
  2: ['Memory region integrity check failed', 'Code section hash mismatch in csgo.exe', 'Read-only memory page modified at runtime'],
  3: ['Debugger presence detected via IsDebuggerPresent', 'NtQueryInformationProcess returned debug flag', 'Hardware breakpoint detected'],
  4: ['Self-integrity check failed: DLL tampered', 'Anti-tamper bypass detected in anticheat module', 'Checksum mismatch on protected region'],
  5: ['External process opened PROCESS_ALL_ACCESS handle to game', 'Suspicious handle to csgo.exe from unsigned process', 'VM_WRITE access to game process from external tool'],
  6: ['IAT hook detected on ReadProcessMemory', 'Signature match: cheat engine pattern at offset 0x2A4F', 'Trampoline hook found in ntdll.dll export'],
  7: ['sv_cheats ConVar modified: 0 → 1', 'sv_airaccelerate modified outside allowed range', 'cl_interp set to 0 (backtrack assist)'],
}

const SERVER_DETECTION_DETAILS: Record<number, string[]> = {
  100: ['Avg jump interval 11ms over 22 consecutive jumps (threshold: 14ms)', 'Auto-bhop pattern: 98.6% perfect timing over 40 jumps', 'Jump-spam detected: 31 jumps in 4.2s at perfect intervals'],
  102: ['Edge jump timing: 97.2% accuracy at ledge apex (threshold: 85%)', 'Jump at tick 63/64 of ledge — consistent edge exploit pattern', 'Cliff edge detection timing 94.8% over 18 attempts'],
  103: ['Snap angle 180° in <1 tick detected in 3 engagements', 'Aim lock to head: 0ms reaction time on enemy spawn', 'FOV lock pattern across 6 kills — inconsistent with human input'],
  104: ['Target hit at 160ms backtrack offset (server max: 200ms)', 'Latency abuse: hitting 64-tick positions at 24ms offset', 'Consistent backtrack hits on moving targets — 89% accuracy'],
  105: ['Desync pitch flip detected across 9 consecutive ticks', 'Legit anti-aim: body angle inconsistent with head hitbox', 'Jitter anti-aim pattern: 180° flip per tick over 12 ticks'],
}

const SUSPICIOUS_MODULE_NAMES = [
  'cheatengine-x86_64.dll', 'aimware.dll', 'skeetcfg.dll', 'hwidspoofer.dll',
  'injector.exe', 'bypass.dll', 'hook32.dll', 'memory_editor.dll',
]

const IP_POOL = [
  '192.168.1.', '10.0.0.', '172.16.0.', '85.214.', '91.108.',
]

const SIGNED_MODULE_POOL = [
  { module_name: 'GameOverlayRenderer64.dll', module_path: 'C:\\Program Files (x86)\\Steam\\GameOverlayRenderer64.dll', signer_name: 'Valve Corp', module_size: 2183168 },
  { module_name: 'ntdll.dll', module_path: 'C:\\Windows\\System32\\ntdll.dll', signer_name: 'Microsoft Corporation', module_size: 2093056 },
  { module_name: 'kernel32.dll', module_path: 'C:\\Windows\\System32\\kernel32.dll', signer_name: 'Microsoft Corporation', module_size: 1089536 },
  { module_name: 'd3d11.dll', module_path: 'C:\\Windows\\System32\\d3d11.dll', signer_name: 'Microsoft Corporation', module_size: 1982464 },
  { module_name: 'Discord_Game_Overlay.dll', module_path: 'C:\\Users\\User\\AppData\\Local\\Discord\\Discord_Game_Overlay.dll', signer_name: 'Discord Inc.', module_size: 8716288 },
  { module_name: 'nvapi64.dll', module_path: 'C:\\Windows\\System32\\nvapi64.dll', signer_name: 'NVIDIA Corporation', module_size: 3342336 },
  { module_name: 'XINPUT1_4.dll', module_path: 'C:\\Windows\\System32\\XINPUT1_4.dll', signer_name: 'Microsoft Corporation', module_size: 102400 },
  { module_name: 'opengl32.dll', module_path: 'C:\\Windows\\System32\\opengl32.dll', signer_name: 'Microsoft Corporation', module_size: 909312 },
]

const UNSIGNED_MODULE_POOL = [
  { module_name: 'aimware.dll', module_path: 'C:\\Users\\User\\AppData\\Local\\Temp\\aimware.dll', module_size: 1847296 },
  { module_name: 'bypass.dll', module_path: 'C:\\ProgramData\\bypass.dll', module_size: 362496 },
  { module_name: 'skeetcfg.dll', module_path: 'C:\\Users\\User\\AppData\\Roaming\\skeet\\skeetcfg.dll', module_size: 2129920 },
  { module_name: 'hwidspoof.dll', module_path: 'C:\\ProgramData\\spoofer\\hwidspoof.dll', module_size: 524288 },
]

const NORMAL_PROCESS_POOL = [
  { process_name: 'Discord.exe', exe_path: 'C:\\Users\\User\\AppData\\Local\\Discord\\app-1.0.9031\\Discord.exe', memory_usage: 189 * 1024 * 1024 },
  { process_name: 'chrome.exe', exe_path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', memory_usage: 328 * 1024 * 1024 },
  { process_name: 'obs64.exe', exe_path: 'C:\\Program Files\\obs-studio\\bin\\64bit\\obs64.exe', memory_usage: 104 * 1024 * 1024 },
  { process_name: 'steamwebhelper.exe', exe_path: 'C:\\Program Files (x86)\\Steam\\bin\\cef\\cef.win7x64\\steamwebhelper.exe', memory_usage: 128 * 1024 * 1024 },
  { process_name: 'NVIDIA Share.exe', exe_path: 'C:\\Program Files\\NVIDIA Corporation\\ShadowPlay\\nvsphelper64.exe', memory_usage: 48 * 1024 * 1024 },
  { process_name: 'explorer.exe', exe_path: 'C:\\Windows\\explorer.exe', memory_usage: 70 * 1024 * 1024 },
  { process_name: 'Spotify.exe', exe_path: 'C:\\Users\\User\\AppData\\Roaming\\Spotify\\Spotify.exe', memory_usage: 215 * 1024 * 1024 },
]

function generateFakeLoadedModules(user: User): LoadedModule[] {
  const count = randomInt(4, 7)
  const shuffled = [...SIGNED_MODULE_POOL].sort(() => Math.random() - 0.5)
  const loaded: LoadedModule[] = shuffled.slice(0, count).map(m => ({
    ...m,
    is_signed: true,
    base_address: 0x7FF000000000 + randomInt(0, 0xFFFF) * 0x10000,
  }))
  if (user.has_suspicious_traces || user.is_banned) {
    const unsignedCount = randomInt(1, 2)
    const shuffledUnsigned = [...UNSIGNED_MODULE_POOL].sort(() => Math.random() - 0.5)
    shuffledUnsigned.slice(0, unsignedCount).forEach(m => {
      loaded.unshift({ ...m, is_signed: false, signer_name: null, base_address: 0x7F0000000000 + randomInt(0, 0xFFFF) * 0x10000 })
    })
  }
  return loaded
}

function generateFakeRunningProcesses(user: User): RunningProcess[] {
  const count = randomInt(3, 5)
  const shuffled = [...NORMAL_PROCESS_POOL].sort(() => Math.random() - 0.5)
  const procs: RunningProcess[] = shuffled.slice(0, count).map(p => ({
    ...p,
    process_id: randomInt(1000, 30000),
    is_elevated: false,
    has_handle_to_game: false,
  }))
  if (user.is_banned || user.flagged_status === 'critical' || user.flagged_status === 'high') {
    procs.unshift({
      process_name: randomItem(['injector.exe', 'loader.exe', 'cheatclient.exe']),
      process_id: randomInt(1000, 30000),
      exe_path: randomItem(['C:\\Users\\User\\Desktop\\inject.exe', 'C:\\ProgramData\\loader.exe', 'C:\\Temp\\client.exe']),
      memory_usage: randomInt(2, 8) * 1024 * 1024,
      is_elevated: true,
      has_handle_to_game: true,
    })
  }
  return procs
}

function generateFakeHandleHistory(user: User, gamePid: number): HandleHistoryEntry[] {
  const handles: HandleHistoryEntry[] = []
  handles.push({
    owner_process_name: 'GameOverlayUI.exe',
    owner_process_id: randomInt(1000, 30000),
    target_process_id: gamePid,
    access_rights: 0x00100011,
    handle_value: randomInt(0x100, 0xFFF) * 4,
    is_suspicious: false,
    is_whitelisted: true,
    exe_path: 'C:\\Program Files (x86)\\Steam\\GameOverlayUI.exe',
    timestamp: now - randomInt(1, 30) * DAY,
  })
  handles.push({
    owner_process_name: 'Steam.exe',
    owner_process_id: randomInt(1000, 30000),
    target_process_id: gamePid,
    access_rights: 0x00100011,
    handle_value: randomInt(0x100, 0xFFF) * 4,
    is_suspicious: false,
    is_whitelisted: true,
    exe_path: 'C:\\Program Files (x86)\\Steam\\Steam.exe',
    timestamp: now - randomInt(1, 30) * DAY,
  })
  if (user.is_banned || user.flagged_status === 'critical' || user.flagged_status === 'high' || user.has_suspicious_traces) {
    const suspProc = randomItem(['injector.exe', 'external.exe', 'cheat_loader.exe'])
    const suspPath = randomItem(['C:\\Users\\User\\Desktop\\inject.exe', 'C:\\ProgramData\\loader.exe', 'C:\\Temp\\external.exe'])
    const suspPid = randomInt(1000, 30000)
    const count = randomInt(3, 8)
    for (let i = 0; i < count; i++) {
      handles.push({
        owner_process_name: suspProc,
        owner_process_id: suspPid,
        target_process_id: gamePid,
        access_rights: 0x001FFFFF,
        handle_value: randomInt(0x100, 0xFFF) * 4,
        is_suspicious: true,
        is_whitelisted: false,
        exe_path: suspPath,
        timestamp: now - randomInt(1, 14) * DAY - randomInt(0, 86400) * 1000,
      })
    }
  }
  return handles.sort((a, b) => b.timestamp - a.timestamp)
}

export function generateFakeUserDetail(user: User): UserDetailData {
  const detectionCount = user.total_detections
  const gamePid = randomInt(4000, 20000)

  const detections: Detection[] = []
  for (let i = 0; i < Math.min(detectionCount, 30); i++) {
    const ts = now - randomInt(1, 180) * DAY - randomInt(0, 86400) * 1000
    const isServerSide = detectionCount > 3 && Math.random() > 0.65
    const detection_type = isServerSide ? randomItem(SERVER_DETECTION_TYPES) : randomItem(CLIENT_DETECTION_TYPES)
    const detailsList = isServerSide ? SERVER_DETECTION_DETAILS[detection_type] : CLIENT_DETECTION_DETAILS[detection_type]
    detections.push({
      id: randomInt(1000, 99999),
      steamid: user.steamid,
      detection_type,
      details: randomItem(detailsList || ['Detection event recorded']),
      timestamp: ts,
      client_timestamp: ts - randomInt(0, 500),
      session_id: isServerSide ? 'sourcemod' : `sess_${randomInt(10000, 99999)}`,
      client_ip: IP_POOL[randomInt(0, IP_POOL.length - 1)] + randomInt(1, 254),
      reviewed: Math.random() > 0.4,
      reviewed_at: Math.random() > 0.4 ? ts + randomInt(1, 10) * DAY : null,
      reviewed_by: Math.random() > 0.4 ? '76561198000000000' : null,
      action_taken: Math.random() > 0.5 ? randomItem(['warned', 'banned', 'noted', 'suppressed']) : null,
      notes: Math.random() > 0.6 ? 'Confirmed cheat. Pattern matched known bypass tool.' : null,
    })
  }
  detections.sort((a, b) => b.timestamp - a.timestamp)

  const active_session: ActiveSession | null = user.isOnline ? {
    session_id: `sess_${randomInt(10000, 99999)}`,
    connected_at: now - randomInt(5, 120) * 60 * 1000,
    last_heartbeat: now - randomInt(0, 30) * 1000,
    client_ip: IP_POOL[randomInt(0, IP_POOL.length - 1)] + randomInt(1, 254),
    dll_loaded: true,
    dll_heartbeat_ok: true,
  } : null

  const name_history: NameHistoryEntry[] = [
    { username: user.steam_username || 'Player', first_seen: now - randomInt(60, 365) * DAY, last_seen: now - randomInt(0, 7) * DAY },
    { username: (user.steam_username || 'Player') + '_old', first_seen: now - randomInt(200, 500) * DAY, last_seen: now - randomInt(60, 200) * DAY },
    { username: 'xX_' + (user.steam_username || 'Player') + '_Xx', first_seen: now - randomInt(500, 800) * DAY, last_seen: now - randomInt(200, 500) * DAY },
  ]

  const ip_history: IPHistoryEntry[] = Array.from({ length: randomInt(2, 5) }, (_, i) => ({
    ip_address: IP_POOL[randomInt(0, IP_POOL.length - 1)] + randomInt(1, 254),
    first_seen: now - (i + 1) * randomInt(10, 60) * DAY,
    last_seen: now - i * randomInt(1, 10) * DAY,
    connection_count: randomInt(1, 50),
  }))

  const modules: ModuleEntry[] = user.has_suspicious_traces ? Array.from({ length: randomInt(1, 4) }, () => ({
    module_name: randomItem(SUSPICIOUS_MODULE_NAMES),
    module_path: `C:\\Users\\User\\AppData\\Roaming\\${randomItem(SUSPICIOUS_MODULE_NAMES)}`,
    module_hash: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    first_seen: now - randomInt(1, 90) * DAY,
    last_seen: now - randomInt(0, 7) * DAY,
    detection_count: randomInt(1, 15),
    suspicious: true,
  })) : []

  const hwid_history: HWIDEntry[] = Array.from({ length: randomInt(1, 3) }, () => ({
    hwid_hash: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    session_id: `sess_${randomInt(10000, 99999)}`,
    ip_address: IP_POOL[randomInt(0, IP_POOL.length - 1)] + randomInt(1, 254),
    cpu_id: `BFEBFBFF${randomInt(100000, 999999)}`,
    motherboard_serial: `DMI${randomInt(1000000, 9999999)}`,
    disk_serial: `WD-${randomInt(1000000, 9999999)}`,
    bios_serial: `${randomInt(10000, 99999)}-${randomInt(10000, 99999)}`,
    mac_address: Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':'),
    volume_serial: randomInt(100000000, 999999999).toString(16).toUpperCase(),
    first_seen: now - randomInt(30, 180) * DAY,
    last_seen: now - randomInt(0, 14) * DAY,
    session_count: randomInt(1, 30),
  }))

  const fingerprint_traces: FingerprintTrace[] = user.has_suspicious_traces ? Array.from({ length: randomInt(1, 3) }, (_, i) => ({
    id: randomInt(1000, 9999),
    steamid: user.steamid,
    trace_type: randomItem(['hwid', 'ip', 'module_hash']),
    trace_value: Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    trace_hash: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    first_seen: now - randomInt(30, 180) * DAY,
    last_seen: now - randomInt(0, 14) * DAY,
    detection_count: randomInt(1, 10),
    suspicious: true,
    warning_level: randomInt(1, 3),
    notes: i === 0 ? 'Shared hardware identifier detected across multiple accounts' : null,
    shared_with_users: i === 0 ? [
      { steamid: FAKE_USERS[0]?.steamid || generateSteamID(), steam_username: FAKE_USERS[0]?.steam_username || 'AnotherPlayer' },
    ] : [],
  })) : []

  const kick_events: KickEvent[] = Array.from({ length: randomInt(0, 5) }, (_, i) => ({
    id: randomInt(1000, 9999),
    timestamp: now - randomInt(1, 60) * DAY,
    player_name: user.steam_username || 'Player',
    reason: randomItem(['Anticheat not running', 'Heartbeat timeout', 'Maintenance mode disabled enforcement']),
    source: 'sourcemod',
  }))

  return {
    user,
    detections,
    active_session,
    name_history,
    ip_history,
    modules,
    hwid_history,
    hwid_pagination: {
      total: hwid_history.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    },
    fingerprint_traces,
    kick_events,
    warning_level: user.warning_level,
    has_suspicious_traces: user.has_suspicious_traces,
    has_shared_traces: fingerprint_traces.some(t => t.shared_with_users && t.shared_with_users.length > 0),
    loaded_modules: generateFakeLoadedModules(user),
    running_processes: generateFakeRunningProcesses(user),
    handle_history: generateFakeHandleHistory(user, gamePid),
  }
}

// Pre-generate detail data for each fake user (keyed by steamid)
export const FAKE_USER_DETAILS: Record<string, UserDetailData> = Object.fromEntries(
  FAKE_USERS.map(u => [u.steamid, generateFakeUserDetail(u)])
)

// Preload all avatar images into the browser HTTP cache on module init
if (typeof window !== 'undefined') {
  FAKE_USERS.forEach(u => {
    if (u.steam_avatar_url) new Image().src = u.steam_avatar_url
  })
}

// ---------------------------------------------------------------------------
// System Logs
// ---------------------------------------------------------------------------

export interface FakeLog {
  id: number
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  metadata: string | null
  created_at: number
}

const LOG_TEMPLATES = [
  { level: 'info' as const, msg: (u: User) => `Client connected: ${u.steam_username} (${u.steamid})`, meta: (u: User) => JSON.stringify({ steamid: u.steamid }) },
  { level: 'info' as const, msg: (u: User) => `Session started for ${u.steam_username} (${u.steamid})`, meta: (u: User) => JSON.stringify({ steamid: u.steamid, session_id: `sess_${randomInt(10000,99999)}` }) },
  { level: 'warn' as const, msg: (u: User) => `Detection event for (${u.steamid}): Foreign Module`, meta: (u: User) => JSON.stringify({ steamid: u.steamid }) },
  { level: 'warn' as const, msg: (u: User) => `Detection event for (${u.steamid}): Signature match`, meta: (u: User) => JSON.stringify({ steamid: u.steamid }) },
  { level: 'error' as const, msg: (u: User) => `Memory integrity failure for (${u.steamid})`, meta: (u: User) => JSON.stringify({ steamid: u.steamid }) },
  { level: 'info' as const, msg: (_u: User) => `Heartbeat check completed: 12/14 clients healthy`, meta: null },
  { level: 'info' as const, msg: (_u: User) => `SourceMod heartbeat poll: 3 players verified`, meta: null },
  { level: 'debug' as const, msg: (_u: User) => `Rate limiter: request accepted from 192.168.1.42`, meta: null },
  { level: 'info' as const, msg: (u: User) => `User authenticated via Steam: ${u.steam_username} (${u.steamid})`, meta: (u: User) => JSON.stringify({ steamid: u.steamid }) },
  { level: 'info' as const, msg: (u: User) => `Client disconnected: (${u.steamid})`, meta: (u: User) => JSON.stringify({ steamid: u.steamid }) },
  { level: 'error' as const, msg: (_u: User) => `Database write failed: SQLITE_BUSY, retrying...`, meta: null },
  { level: 'warn' as const, msg: (u: User) => `Heartbeat timeout for (${u.steamid}) — session flagged`, meta: (u: User) => JSON.stringify({ steamid: u.steamid }) },
  { level: 'info' as const, msg: (_u: User) => `Automation script executed: HighDetectionAutoFlag`, meta: null },
  { level: 'info' as const, msg: (_u: User) => `Server started on 0.0.0.0:8080`, meta: null },
  { level: 'info' as const, msg: (_u: User) => `TLS enabled, certificate loaded`, meta: null },
]

function generateFakeLogs(): FakeLog[] {
  const logs: FakeLog[] = []
  let id = 1
  let ts = now - 2 * 60 * 60 * 1000 // start 2 hours ago

  for (let i = 0; i < 120; i++) {
    ts += randomInt(5, 90) * 1000
    const user = randomItem(FAKE_USERS)
    const template = randomItem(LOG_TEMPLATES)
    logs.push({
      id: id++,
      level: template.level,
      message: template.msg(user),
      metadata: template.meta ? template.meta(user) : null,
      created_at: ts,
    })
  }

  return logs
}

export const FAKE_SYSTEM_LOGS = generateFakeLogs()

// ---------------------------------------------------------------------------
// Automation Scripts
// ---------------------------------------------------------------------------

export interface FakeScript {
  id: number
  script_name: string
  description: string
  script_type: 'auto_flag' | 'auto_suppress' | 'custom'
  script_code: string
  enabled: boolean
  is_default: boolean
  priority: number
  created_at: number
  created_by: string
  execution_count: number
  last_executed_at?: number
}

export const FAKE_AUTOMATION_SCRIPTS: FakeScript[] = [
  {
    id: 1,
    script_name: 'High Detection Auto-Flag',
    description: 'Automatically flags users with 5 or more detections as high severity',
    script_type: 'auto_flag',
    script_code: `// Auto-flag users with high detection counts
if (user.total_detections >= 5) {
  return {
    action: 'flag',
    severity: 'high',
    reason: \`Automated flag: \${user.total_detections} detections exceed threshold\`
  };
}
return { action: 'none' };`,
    enabled: true,
    is_default: true,
    priority: 100,
    created_at: now - 30 * DAY,
    created_by: '76561198000000000',
    execution_count: 4821,
    last_executed_at: now - 5 * 60 * 1000,
  },
  {
    id: 2,
    script_name: 'Critical Detection Escalator',
    description: 'Escalates any memory integrity or self-integrity failure to critical severity',
    script_type: 'auto_flag',
    script_code: `// Escalate critical detection types
const criticalTypes = [2, 4, 6]; // Memory, Self-Integrity, Signature
const hasCritical = detections.some(d => criticalTypes.includes(d.detection_type));

if (hasCritical) {
  return {
    action: 'flag',
    severity: 'critical',
    reason: 'Critical detection type found: memory/self-integrity/signature'
  };
}
return { action: 'none' };`,
    enabled: true,
    is_default: false,
    priority: 200,
    created_at: now - 14 * DAY,
    created_by: '76561198000000000',
    execution_count: 1203,
    last_executed_at: now - 12 * 60 * 1000,
  },
  {
    id: 3,
    script_name: 'Bhop Pattern Detector',
    description: 'Flags users with repeated bunny-hop detections over multiple sessions',
    script_type: 'auto_flag',
    script_code: `// Flag users with repeated bhop detections
const bhopDetections = detections.filter(d => d.detection_type === 100);

if (bhopDetections.length >= 3) {
  return {
    action: 'flag',
    severity: 'medium',
    reason: \`Repeated bhop detections: \${bhopDetections.length} instances\`
  };
}
return { action: 'none' };`,
    enabled: false,
    is_default: false,
    priority: 50,
    created_at: now - 7 * DAY,
    created_by: '76561198000000000',
    execution_count: 89,
    last_executed_at: now - 2 * DAY,
  },
]

// ---------------------------------------------------------------------------
// Anticheat Settings
// ---------------------------------------------------------------------------

export interface FakeSignature {
  id: number
  module_name: string
  pattern: string
  description: string
  priority: number
  signature_type: 'detection' | 'pattern_breaker'
  enabled: boolean
  created_at: number
}

export const FAKE_SIGNATURES: FakeSignature[] = [
  { id: 1, module_name: 'cheatengine-x86_64.dll', pattern: '48 8B 05 ?? ?? ?? ?? 48 85 C0 74', description: 'Cheat Engine main module signature', priority: 1, signature_type: 'detection', enabled: true, created_at: now - 60 * DAY },
  { id: 2, module_name: 'aimware.dll', pattern: '55 8B EC 83 E4 F8 81 EC ?? ?? ?? ?? 53', description: 'Aimware initialization routine', priority: 1, signature_type: 'detection', enabled: true, created_at: now - 45 * DAY },
  { id: 3, module_name: '*.dll', pattern: 'E9 ?? ?? ?? ?? 90 90 90', description: 'Generic trampoline hook pattern — detects inline hooks in any loaded module', priority: 1, signature_type: 'pattern_breaker', enabled: true, created_at: now - 30 * DAY },
  { id: 4, module_name: 'hwidspoofer.dll', pattern: '48 83 EC 28 48 8B 05 ?? ?? ?? ?? 48 85', description: 'HWID spoofer module pattern', priority: 2, signature_type: 'detection', enabled: true, created_at: now - 20 * DAY },
]

export interface FakeWhitelistEntry {
  id: number
  module_name: string
  module_hash: string
  module_path?: string
  description: string
  created_at: number
}

export const FAKE_WHITELIST: FakeWhitelistEntry[] = [
  { id: 1, module_name: 'discord_overlay.dll', module_hash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678', module_path: 'C:\\Users\\*\\AppData\\Local\\Discord\\', description: 'Discord overlay module — whitelisted for all users', created_at: now - 90 * DAY },
  { id: 2, module_name: 'gameoverlayrenderer64.dll', module_hash: 'f0e1d2c3b4a5968778695a4b3c2d1e0f12345678abcdef0123456789abcdef01', module_path: 'C:\\Program Files (x86)\\Steam\\', description: 'Steam overlay DLL — Valve signed module', created_at: now - 90 * DAY },
  { id: 3, module_name: 'nvngx.dll', module_hash: 'c3b2a1908172635445362718293a4b5c6d7e8f901234567890abcdef12345678', description: 'NVIDIA DLSS module — GPU vendor signed', created_at: now - 60 * DAY },
]

export interface FakeProcessWhitelistEntry {
  id: number
  process_name: string
  required_path_contains?: string
  description: string
  enabled: boolean
  created_at: number
  created_by?: string
}

export const FAKE_PROCESS_WHITELIST: FakeProcessWhitelistEntry[] = [
  { id: 1, process_name: 'Discord.exe', required_path_contains: '\\Discord\\', description: 'Discord voice and text chat', enabled: true, created_at: now - 90 * DAY, created_by: 'Admin' },
  { id: 2, process_name: 'obs64.exe', required_path_contains: '\\obs-studio\\', description: 'OBS Studio streaming software', enabled: true, created_at: now - 60 * DAY, created_by: 'Admin' },
  { id: 3, process_name: 'MSIAfterburner.exe', description: 'MSI Afterburner GPU monitoring tool', enabled: true, created_at: now - 45 * DAY, created_by: 'Admin' },
]

export const FAKE_SETTINGS = {
  signature_scan_interval_ms: 60000,
  signature_batch_size: 3,
  signature_scan_timeout_ms: 30000,
  heartbeat_interval_ms: 30000,
  heartbeat_timeout_ms: 90000,
  enable_module_scanning: true,
  enable_signature_scanning: true,
  enable_memory_integrity: true,
  enable_debugger_detection: true,
  enable_hook_detection: true,
}

// ---------------------------------------------------------------------------
// Version / Maintenance History
// ---------------------------------------------------------------------------

export interface FakeVersionEntry {
  id: number
  component: 'watchdog' | 'anticheat_dll'
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
  verification_status: 'verified' | 'failed' | 'pending'
  previous_version_id?: number | null
  download_count?: number
}

export const FAKE_VERSION_HISTORY: FakeVersionEntry[] = [
  // Watchdog history
  { id: 1, component: 'watchdog', version: '1.0.0', hash: 'abc123def456', file_size: 512000, uploaded_at: now - 90 * DAY, uploaded_by: '76561198000000000', uploaded_by_username: 'Admin', is_active: false, is_rollback: false, rollback_from_version: null, rollback_reason: null, changelog: 'Initial release', verification_status: 'verified', download_count: 1200 },
  { id: 2, component: 'watchdog', version: '1.1.0', hash: 'bcd234efg567', file_size: 524288, uploaded_at: now - 60 * DAY, uploaded_by: '76561198000000000', uploaded_by_username: 'Admin', is_active: false, is_rollback: false, rollback_from_version: null, rollback_reason: null, changelog: 'Improved IPC stability, fixed reconnect loop', verification_status: 'verified', download_count: 3400 },
  { id: 3, component: 'watchdog', version: '1.2.0', hash: 'cde345fgh678', file_size: 548864, uploaded_at: now - 30 * DAY, uploaded_by: '76561198000000000', uploaded_by_username: 'Admin', is_active: false, is_rollback: false, rollback_from_version: null, rollback_reason: null, changelog: 'Added HWID collection, better error handling', verification_status: 'verified', download_count: 5600 },
  { id: 4, component: 'watchdog', version: '1.3.0', hash: 'def456ghi789', file_size: 561152, uploaded_at: now - 7 * DAY, uploaded_by: '76561198000000000', uploaded_by_username: 'Admin', is_active: true, is_rollback: false, rollback_from_version: null, rollback_reason: null, changelog: 'Performance improvements, reduced CPU usage by 40%', verification_status: 'verified', download_count: 1100 },
  // DLL history
  { id: 5, component: 'anticheat_dll', version: '1.0.0', hash: 'efg567hij890', file_size: 1048576, uploaded_at: now - 90 * DAY, uploaded_by: '76561198000000000', uploaded_by_username: 'Admin', is_active: false, is_rollback: false, rollback_from_version: null, rollback_reason: null, changelog: 'Initial release', verification_status: 'verified', download_count: 1200 },
  { id: 6, component: 'anticheat_dll', version: '1.1.0', hash: 'fgh678ijk901', file_size: 1089536, uploaded_at: now - 60 * DAY, uploaded_by: '76561198000000000', uploaded_by_username: 'Admin', is_active: false, is_rollback: false, rollback_from_version: null, rollback_reason: null, changelog: 'Added module scanner v2, improved signature matching', verification_status: 'verified', download_count: 3400 },
  { id: 7, component: 'anticheat_dll', version: '1.2.0', hash: 'ghi789jkl012', file_size: 1126400, uploaded_at: now - 14 * DAY, uploaded_by: '76561198000000000', uploaded_by_username: 'Admin', is_active: true, is_rollback: false, rollback_from_version: null, rollback_reason: null, changelog: 'Hook detection improvements, added ConVar monitoring', verification_status: 'verified', download_count: 890 },
]

export const FAKE_CURRENT_VERSIONS = {
  watchdog: FAKE_VERSION_HISTORY.find(v => v.component === 'watchdog' && v.is_active) || null,
  anticheat_dll: FAKE_VERSION_HISTORY.find(v => v.component === 'anticheat_dll' && v.is_active) || null,
}
