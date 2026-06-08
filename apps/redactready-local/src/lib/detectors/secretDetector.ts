import type { SensitiveDetector } from './detectorTypes'
import { runRegex } from './utils'

export function createSecretDetector(): SensitiveDetector {
  return {
    id: 'secrets',
    label: 'Secrets and tokens',
    detect(text) {
      const apiKeys = runRegex(
        text,
        /\b(?:api[_-]?key|secret|token|password|auth[_-]?code)\s*[:=]\s*([A-Za-z0-9_\-./+=]{8,})\b/gi,
        'secret_token',
        'Secret/token-like value',
        0.9,
        1,
      )

      const privateUrls = runRegex(
        text,
        /\bhttps?:\/\/(?:localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})[^\s)]*/gi,
        'secret_token',
        'Private URL',
        0.7,
      )

      return [...apiKeys, ...privateUrls]
    },
  }
}
