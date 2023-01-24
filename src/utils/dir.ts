import { fileURLToPath } from 'url'
import path from 'path'

export function dirnameByFileUrl(fileUrl) {
  const __filename = fileURLToPath(fileUrl);
  return path.dirname(__filename);
}
