// Client-side PIN storage. Per-user hash in localStorage.
// Session unlock flag in sessionStorage. No server schema change.

const HASH_KEY = (uid: string) => `spendwise-pin-${uid}`
const UNLOCK_KEY = (uid: string) => `spendwise-pin-unlocked-${uid}`

async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashPin(uid: string, pin: string): Promise<string> {
  return sha256(`${uid}::${pin}`)
}

export async function setPin(uid: string, pin: string): Promise<void> {
  const h = await hashPin(uid, pin)
  localStorage.setItem(HASH_KEY(uid), h)
  sessionStorage.setItem(UNLOCK_KEY(uid), '1')
}

export function getPinHash(uid: string): string | null {
  try { return localStorage.getItem(HASH_KEY(uid)) } catch { return null }
}

export function hasPin(uid: string): boolean {
  return !!getPinHash(uid)
}

export async function verifyPin(uid: string, pin: string): Promise<boolean> {
  const h = await hashPin(uid, pin)
  return h === getPinHash(uid)
}

export function markUnlocked(uid: string): void {
  try { sessionStorage.setItem(UNLOCK_KEY(uid), '1') } catch {}
}

export function isUnlocked(uid: string): boolean {
  try { return sessionStorage.getItem(UNLOCK_KEY(uid)) === '1' } catch { return false }
}

export function clearPin(uid: string): void {
  try {
    localStorage.removeItem(HASH_KEY(uid))
    sessionStorage.removeItem(UNLOCK_KEY(uid))
  } catch {}
}

export function lockNow(uid: string): void {
  try { sessionStorage.removeItem(UNLOCK_KEY(uid)) } catch {}
}
