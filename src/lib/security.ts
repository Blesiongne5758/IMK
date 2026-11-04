// ============================================
// SECURITY UTILITIES
// Centralized security functions for the application
// ============================================

/**
 * Sanitize user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize input but allow basic formatting (for rich text)
 * Only removes script tags and event handlers
 */
export function sanitizeRichText(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '');
}

/**
 * Validate URL format and protocol
 * Only allows http and https protocols
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > 2048) return false; // Max URL length
  
  try {
    const parsed = new URL(trimmed);
    // Only allow http and https protocols
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const trimmed = email.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > 254) return false; // Max email length
  
  // RFC 5322 compliant regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(trimmed);
}

/**
 * Validate phone number (Indonesian format)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.length < 9 || cleaned.length > 15) return false;
  
  // Indonesian phone format
  const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate file by extension and magic number
 */
export async function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number = 5
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.` };
  }
  
  if (file.size === 0) {
    return { valid: false, error: 'File kosong.' };
  }
  
  // Check file extension
  const fileName = file.name.toLowerCase();
  const extension = fileName.slice(fileName.lastIndexOf('.'));
  const allowedExtensions = allowedTypes.map(t => `.${t.toLowerCase()}`);
  
  if (!allowedExtensions.includes(extension)) {
    return { 
      valid: false, 
      error: `Format file tidak didukung. Gunakan: ${allowedTypes.join(', ')}` 
    };
  }
  
  // Check MIME type
  const allowedMimeTypes: Record<string, string[]> = {
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.webp': ['image/webp'],
    '.pdf': ['application/pdf'],
    '.doc': ['application/msword'],
    '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  };
  
  const expectedMimeTypes = allowedMimeTypes[extension];
  if (expectedMimeTypes && !expectedMimeTypes.includes(file.type)) {
    return { valid: false, error: 'Tipe file tidak sesuai dengan ekstensi.' };
  }
  
  // Validate magic number (file signature)
  try {
    const isValidMagic = await validateMagicNumber(file, extension);
    if (!isValidMagic) {
      return { valid: false, error: 'File tidak valid atau rusak.' };
    }
  } catch {
    // If magic number check fails, continue with other validations
    console.warn('Magic number validation skipped');
  }
  
  return { valid: true };
}

/**
 * Validate file magic number (file signature)
 */
async function validateMagicNumber(file: File, extension: string): Promise<boolean> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const view = new Uint8Array(buffer);
  
  const magicNumbers: Record<string, number[][]> = {
    '.jpg': [[0xFF, 0xD8, 0xFF]],
    '.jpeg': [[0xFF, 0xD8, 0xFF]],
    '.png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
    '.webp': [
      [0x52, 0x49, 0x46, 0x46], // RIFF
      // WebP has RIFF header, then WEBP at offset 8
    ],
    '.pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  };
  
  const expectedMagic = magicNumbers[extension];
  if (!expectedMagic) return true; // Skip if no magic number defined
  
  for (const magic of expectedMagic) {
    let matches = true;
    for (let i = 0; i < magic.length; i++) {
      if (view[i] !== magic[i]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  
  // Special case for WebP (RIFF header + WEBP at offset 8)
  if (extension === '.webp') {
    const riff = view[0] === 0x52 && view[1] === 0x49 && view[2] === 0x46 && view[3] === 0x46;
    const webp = view[8] === 0x57 && view[9] === 0x45 && view[10] === 0x42 && view[11] === 0x50;
    return riff && webp;
  }
  
  return false;
}

/**
 * Rate Limiter class for API calls
 */
export class RateLimiter {
  private calls: number[] = [];
  private maxCalls: number;
  private timeWindow: number;
  
  constructor(maxCalls: number = 10, timeWindowMs: number = 60000) {
    this.maxCalls = maxCalls;
    this.timeWindow = timeWindowMs;
  }
  
  canMakeCall(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.timeWindow);
    return this.calls.length < this.maxCalls;
  }
  
  recordCall(): void {
    this.calls.push(Date.now());
  }
  
  getRemainingCalls(): number {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.timeWindow);
    return Math.max(0, this.maxCalls - this.calls.length);
  }
  
  getResetTime(): number {
    if (this.calls.length === 0) return 0;
    const oldest = Math.min(...this.calls);
    return Math.max(0, this.timeWindow - (Date.now() - oldest));
  }
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token (basic implementation)
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  if (token.length !== storedToken.length) return false;
  
  // Timing-safe comparison
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Encrypt data for localStorage (basic XOR encryption)
 * Note: This is NOT cryptographically secure. For production, use Web Crypto API.
 */
export function encryptForStorage(data: string, key: string): string {
  const keyChars = key.split('');
  const dataChars = data.split('');
  const encrypted = dataChars.map((char, i) => {
    const keyChar = keyChars[i % keyChars.length];
    return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
  });
  return btoa(encrypted.join(''));
}

/**
 * Decrypt data from localStorage
 */
export function decryptFromStorage(encrypted: string, key: string): string {
  try {
    const decoded = atob(encrypted);
    const keyChars = key.split('');
    const dataChars = decoded.split('');
    const decrypted = dataChars.map((char, i) => {
      const keyChar = keyChars[i % keyChars.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    });
    return decrypted.join('');
  } catch {
    return '';
  }
}

/**
 * Generate secure random ID
 */
export function generateSecureId(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Mask sensitive data for display
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  
  const maskedLocal = local.length > 2 
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : '*'.repeat(local.length);
  
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask phone number for display
 */
export function maskPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.length < 6) return phone;
  
  return cleaned.slice(0, 3) + '*'.repeat(cleaned.length - 6) + cleaned.slice(-3);
}

/**
 * Check if content contains potentially malicious code
 */
export function containsMaliciousContent(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  const maliciousPatterns = [
    /<script\b/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /<iframe\b/i,
    /<object\b/i,
    /<embed\b/i,
    /<form\b/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /import\s+/i,
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate and sanitize form data
 */
export function validateAndSanitizeFormData<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, {
    type: 'string' | 'email' | 'phone' | 'url' | 'number';
    required?: boolean;
    maxLength?: number;
    sanitize?: boolean;
  }>
): { valid: boolean; sanitized?: T; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};
  const sanitized: Record<string, any> = {};
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    
    // Required check
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[key] = 'Field ini wajib diisi';
      continue;
    }
    
    // Skip if empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      sanitized[key] = value;
      continue;
    }
    
    // Type validation
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors[key] = 'Harus berupa teks';
          continue;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors[key] = `Maksimal ${rules.maxLength} karakter`;
          continue;
        }
        sanitized[key] = rules.sanitize !== false ? sanitizeInput(value.trim()) : value.trim();
        break;
        
      case 'email':
        if (!isValidEmail(value)) {
          errors[key] = 'Format email tidak valid';
          continue;
        }
        sanitized[key] = value.trim().toLowerCase();
        break;
        
      case 'phone':
        if (!isValidPhone(value)) {
          errors[key] = 'Format nomor telepon tidak valid';
          continue;
        }
        sanitized[key] = value.replace(/[\s\-\(\)]/g, '');
        break;
        
      case 'url':
        if (!isValidUrl(value)) {
          errors[key] = 'Format URL tidak valid';
          continue;
        }
        sanitized[key] = value.trim();
        break;
        
      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          errors[key] = 'Harus berupa angka';
          continue;
        }
        sanitized[key] = num;
        break;
    }
  }
  
  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }
  
  return { valid: true, sanitized: sanitized as T };
}

/**
 * Content Security Policy helper
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https://*.supabase.co'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}
