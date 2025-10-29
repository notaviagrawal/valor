/**
 * Generates an HMAC-SHA256 hash of the provided nonce using a secret key from the environment.
 * Uses Web Crypto API for Edge Runtime compatibility.
 * @param {Object} params - The parameters object.
 * @param {string} params.nonce - The nonce to be hashed.
 * @returns {Promise<string>} The resulting HMAC hash in hexadecimal format.
 */
export const hashNonce = async ({ nonce }: { nonce: string }): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(process.env.HMAC_SECRET_KEY!);
  const messageData = encoder.encode(nonce);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
