/**
 * Cloudflare R2 File Storage
 * F4l: Upload, manage, and serve files via Cloudflare R2
 *
 * Uses R2 S3-compatible API for file uploads.
 * Public URLs served via R2 custom domain or default.
 */

// ── Types ──

export type FileType = 'image' | 'document' | 'avatar' | 'screenshot' | 'export'

export interface UploadResult {
  success: boolean
  url: string
  key: string
  size: number
  mimeType: string
  error?: string
}

export interface FileMetadata {
  key: string
  name: string
  size: number
  mimeType: string
  uploadedAt: string
  url: string
}

// ── Configuration ──

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'marktbit'
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${R2_BUCKET_NAME}.r2.dev`

// ── Upload limits ──

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/csv',
  'application/json',
]

const FILE_TYPE_PREFIX: Record<FileType, string> = {
  image: 'images',
  document: 'documents',
  avatar: 'avatars',
  screenshot: 'screenshots',
  export: 'exports',
}

// ── R2 API ──

export const fileStorage = {
  async upload(file: File | Blob, type: FileType, name?: string): Promise<UploadResult> {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      return {
        success: false,
        url: '',
        key: '',
        size: 0,
        mimeType: '',
        error: 'R2 not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY env vars.',
      }
    }

    const size = file.size
    if (size > MAX_FILE_SIZE) {
      return { success: false, url: '', key: '', size, mimeType: '', error: 'File too large (max 10MB)' }
    }

    const mimeType = file.type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return { success: false, url: '', key: '', size, mimeType, error: `File type ${mimeType} not allowed` }
    }

    const fileName = name || (file instanceof File ? file.name : `upload-${Date.now()}`)
    const ext = fileName.split('.').pop() || 'bin'
    const key = `${FILE_TYPE_PREFIX[type]}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    try {
      const buffer = await file.arrayBuffer()
      const R2_URL = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`

      const res = await fetch(R2_URL, {
        method: 'PUT',
        headers: {
          Authorization: `AWS ${R2_ACCESS_KEY_ID}:${R2_SECRET_ACCESS_KEY}`,
          'Content-Type': mimeType,
          'Content-Length': String(size),
        },
        body: buffer,
      })

      if (!res.ok) {
        return { success: false, url: '', key, size, mimeType, error: `R2 upload failed: ${res.status}` }
      }

      return {
        success: true,
        url: `${R2_PUBLIC_URL}/${key}`,
        key,
        size,
        mimeType,
      }
    } catch (err) {
      return {
        success: false,
        url: '',
        key,
        size,
        mimeType,
        error: err instanceof Error ? err.message : 'Upload failed',
      }
    }
  },

  async delete(key: string): Promise<{ success: boolean; error?: string }> {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      return { success: false, error: 'R2 not configured' }
    }

    try {
      const R2_URL = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`
      const res = await fetch(R2_URL, {
        method: 'DELETE',
        headers: {
          Authorization: `AWS ${R2_ACCESS_KEY_ID}:${R2_SECRET_ACCESS_KEY}`,
        },
      })

      if (!res.ok) return { success: false, error: `Delete failed: ${res.status}` }
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Delete failed' }
    }
  },

  getUrl(key: string): string {
    return `${R2_PUBLIC_URL}/${key}`
  },

  isConfigured(): boolean {
    return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY)
  },

  getMaxFileSize(): number {
    return MAX_FILE_SIZE
  },

  getAllowedTypes(): string[] {
    return [...ALLOWED_MIME_TYPES]
  },
}
