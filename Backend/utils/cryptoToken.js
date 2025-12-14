import crypto from 'crypto';

/**
 * Generates a secure random token and its hashed version
 * rawToken -> send in email
 * hashedToken -> store in DB
 */
 
 
export function generateCryptoToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  
  return {rawToken, hashedToken};
}



