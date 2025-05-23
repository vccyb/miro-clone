/**
 * 将ID编码为URL安全的字符串
 * @param id 要编码的ID
 * @returns 编码后的字符串
 */
export function encodeId(id: string): string {
  // 使用 Base64 编码，并确保 URL 安全
  const encoded = btoa(id)

  return encoded;
}

/**
 * 将编码的字符串解码为原始ID
 * @param encoded 编码后的字符串
 * @returns 解码后的ID
 */
export function decodeId(encoded: string): string {
  // 补全 Base64 编码
  let base64 = encoded;
  try {
    return atob(base64);
  } catch (e) {
    console.error('解码失败:', e);
    return '';
  }
}