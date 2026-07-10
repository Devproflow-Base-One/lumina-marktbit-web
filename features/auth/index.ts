/**
 * Auth Feature Module
 * 
 * Utils: auth, user-preferences
 * Components: UnauthorizedAlert
 */

export { default as UnauthorizedAlert } from '@/components/UnauthorizedAlert'
export { authManager, useAuth, authFetch } from '@/lib/auth'
export type { User, AuthToken, AuthState } from '@/lib/auth'
