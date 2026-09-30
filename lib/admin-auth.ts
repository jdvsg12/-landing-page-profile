import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'jv_admin'

export function getAdminPassword() {
  const fromEnv = process.env.ADMIN_PASSWORD
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'development') return 'dev-admin'
  return null
}

export function devPasswordFallback() {
  return process.env.NODE_ENV === 'development' && !process.env.ADMIN_PASSWORD
}

function sessionToken(password: string) {
  return createHmac('sha256', password).update('jv-admin-session').digest('hex')
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export async function isAdminRequest() {
  const password = getAdminPassword()
  if (!password) return false
  const jar = await cookies()
  const token = jar.get(ADMIN_COOKIE)?.value
  if (!token) return false
  return safeEqual(token, sessionToken(password))
}

export function adminCookieValue(password: string) {
  return sessionToken(password)
}

export function passwordsMatch(input: string, expected: string) {
  return safeEqual(input, expected)
}
