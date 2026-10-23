/**
 * @desc 解密url (只适合小程序地址)
 * @param url string
 * @returns string
 */
export function urlDecode(url: string, i = 0): string {
  if (!url) return ''
  if (i >= 10) return url
  if (url.includes('/')) return url
  i++
  return urlDecode(decodeURIComponent(url), i)
}

/**
 * @desc 加密url (只适合小程序地址)
 * @param url string
 * @returns string
 */
export function urlEncode(url: string, i = 0): string {
  if (!url) return ''
  if (i >= 10) return url
  if (url.includes(encodeURIComponent('/'))) return url
  i++
  return urlEncode(encodeURIComponent(url), i)
}
