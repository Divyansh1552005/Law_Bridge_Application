import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hashes a password securely using bcrypt.
 * @param {string} password - The plain text password to hash.
 * @param {string} [userSalt] - Optional salt (not typically required since bcrypt manages it internally).
 * @returns {Promise<{ salt: string, password: string }>} Object containing salt and hashed password.
 */
export async function hashPasswordWithSalt(password){
  // bcrypt generates its own salt if not provided
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  return { salt, password: hashedPassword };
}

/**
 * Verifies a plain password against a hashed password.
 * @param {string} password - The plain password entered by the user.
 * @param {string} hashedPassword - The stored hashed password from DB.
 * @returns {Promise<boolean>} True if passwords match, else false.
 */
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}


