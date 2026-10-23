import DOMPurify from 'dompurify'

let hookInstalled = false

function installHook() {
  if (hookInstalled) return
  hookInstalled = true
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
  })
}

/** 清理接口返回的 HTML，避免 XSS */
export function sanitizeHtml(html?: string | null): string {
  if (!html) return ''
  installHook()
  return DOMPurify.sanitize(html, { ADD_ATTR: ['target', 'rel'] })
}
