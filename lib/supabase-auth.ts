/**
 * Supabase Auth Integration
 * F3e: Auth upgrade — Supabase Auth with JWT, OAuth, magic link
 *
 * Replaces the legacy auth manager with Supabase-native auth.
 * Maintains backward compatibility with existing authFetch.
 */

// Supabase client loaded dynamically to avoid build errors when package isn't installed
type SupabaseClient = {
  auth: {
    signUp: (params: { email: string; password: string; options?: { data?: Record<string, unknown> } }) => Promise<any>
    signInWithPassword: (params: { email: string; password: string }) => Promise<any>
    signInWithOtp: (params: { email: string; options?: { emailRedirectTo?: string } }) => Promise<any>
    signInWithOAuth: (params: { provider: string; options?: { redirectTo?: string } }) => Promise<any>
    signOut: () => Promise<any>
    getSession: () => Promise<any>
    getUser: (token?: string) => Promise<any>
    refreshSession: (params: { refresh_token: string }) => Promise<any>
    resetPasswordForEmail: (email: string, options?: { redirectTo?: string }) => Promise<any>
    updateUser: (params: { password?: string }) => Promise<any>
  }
}

// ── Types ──

export type AuthUser = {
  id: string
  email: string
  name?: string
  tier: string
  avatarUrl?: string
  telegramId?: string
}

export type AuthSession = {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: AuthUser
}

export type AuthResult = {
  success: boolean
  session?: AuthSession
  error?: string
}

// ── Supabase Client (singleton) ──

let supabaseClient: SupabaseClient | null = null

async function getSupabase(): Promise<SupabaseClient> {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
      throw new Error('Supabase URL and anon key are required. Set SUPABASE_URL and SUPABASE_ANON_KEY env vars.')
    }

    // @ts-ignore — installed at runtime via pnpm add @supabase/supabase-js
    const { createClient } = await import('@supabase/supabase-js')
    supabaseClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }) as unknown as SupabaseClient
  }
  return supabaseClient
}

// ── Auth Manager ──

export const supabaseAuth = {
  /**
   * Register a new user with email + password
   */
  async register(email: string, password: string, metadata?: Record<string, unknown>): Promise<AuthResult> {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })

      if (error) return { success: false, error: error.message }
      if (!data.session) return { success: true, error: 'Check your email for confirmation link' }

      return {
        success: true,
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at ?? 0,
          user: mapUser(data.user),
        },
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Registration failed' }
    }
  },

  /**
   * Login with email + password
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) return { success: false, error: error.message }

      return {
        success: true,
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at ?? 0,
          user: mapUser(data.user),
        },
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' }
    }
  },

  /**
   * Send magic link to email
   */
  async sendMagicLink(email: string): Promise<AuthResult> {
    try {
      const supabase = await getSupabase()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
      })

      if (error) return { success: false, error: error.message }
      return { success: true, error: 'Magic link sent to your email' }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to send magic link' }
    }
  },

  /**
   * OAuth sign-in (Google, GitHub, etc.)
   */
  async signInWithOAuth(provider: 'google' | 'github' | 'discord'): Promise<{ url?: string; error?: string }> {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
      })

      if (error) return { error: error.message }
      return { url: data.url }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'OAuth failed' }
    }
  },

  /**
   * Logout current session
   */
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await getSupabase()
      await supabase.auth.signOut()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Logout failed' }
    }
  },

  /**
   * Get current session
   */
  async getSession(): Promise<AuthSession | null> {
    try {
      const supabase = await getSupabase()
      const { data } = await supabase.auth.getSession()
      if (!data.session) return null

      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? 0,
        user: mapUser(data.session.user),
      }
    } catch {
      return null
    }
  },

  /**
   * Verify a JWT token (server-side)
   */
  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.auth.getUser(token)
      if (error || !data.user) return null
      return mapUser(data.user)
    } catch {
      return null
    }
  },

  /**
   * Refresh session
   */
  async refreshSession(refreshToken: string): Promise<AuthResult> {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

      if (error) return { success: false, error: error.message }

      return {
        success: true,
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at ?? 0,
          user: mapUser(data.user),
        },
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Refresh failed' }
    }
  },

  /**
   * Reset password via email
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await getSupabase()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      })

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Reset failed' }
    }
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await getSupabase()
      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Update failed' }
    }
  },
}

// ── Helper: Map Supabase user to AuthUser ──

function mapUser(supabaseUser: unknown): AuthUser {
  const u = supabaseUser as Record<string, unknown>
  const metadata = (u.user_metadata || {}) as Record<string, unknown>
  return {
    id: u.id as string,
    email: u.email as string,
    name: metadata.name as string | undefined,
    tier: (metadata.tier as string) || 'free',
    avatarUrl: metadata.avatar_url as string | undefined,
    telegramId: metadata.telegram_id as string | undefined,
  }
}

// ── Auth-aware fetch wrapper (backward compatible) ──

export async function authFetch(input: string | URL, init?: RequestInit): Promise<Response> {
  const session = await supabaseAuth.getSession()
  const headers = new Headers(init?.headers)

  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`)
  }

  return fetch(input, { ...init, headers })
}

// ── React hook (client-side) ──

export function useSupabaseAuth() {
  return {
    signIn: supabaseAuth.login,
    signUp: supabaseAuth.register,
    signOut: supabaseAuth.logout,
    getSession: supabaseAuth.getSession,
    sendMagicLink: supabaseAuth.sendMagicLink,
    signInWithOAuth: supabaseAuth.signInWithOAuth,
    resetPassword: supabaseAuth.resetPassword,
  }
}
