import * as crypto from 'crypto';

export class CryptService {
  // Method for hashing password, returns hashed password
  async hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt: string = crypto.randomBytes(8).toString('hex');

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }

  // Method for compare hash and password, of match, returns true
  async compare(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key]: string[] = hash.split(':');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key == derivedKey.toString('hex'));
      });
    });
  }
}
