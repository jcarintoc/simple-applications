import crypto from "crypto";
import { passwordRepository } from "../repositories/index.js";
import type {
  GeneratePasswordDto,
  SavePasswordDto,
  SavedPassword,
  SavedPasswordResponse,
} from "../types/index.js";

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export class PasswordService {
  generatePassword(options: GeneratePasswordDto): string {
    const { length, hasUppercase, hasLowercase, hasNumbers, hasSymbols } = options;

    let charset = "";
    const requiredChars: string[] = [];

    if (hasUppercase) {
      charset += UPPERCASE_CHARS;
      requiredChars.push(this.getRandomChar(UPPERCASE_CHARS));
    }
    if (hasLowercase) {
      charset += LOWERCASE_CHARS;
      requiredChars.push(this.getRandomChar(LOWERCASE_CHARS));
    }
    if (hasNumbers) {
      charset += NUMBER_CHARS;
      requiredChars.push(this.getRandomChar(NUMBER_CHARS));
    }
    if (hasSymbols) {
      charset += SYMBOL_CHARS;
      requiredChars.push(this.getRandomChar(SYMBOL_CHARS));
    }

    // If no options selected, default to lowercase
    if (charset === "") {
      charset = LOWERCASE_CHARS;
    }

    // Generate remaining characters
    const remainingLength = Math.max(0, length - requiredChars.length);
    const remainingChars: string[] = [];
    
    for (let i = 0; i < remainingLength; i++) {
      remainingChars.push(this.getRandomChar(charset));
    }

    // Combine and shuffle
    const allChars = [...requiredChars, ...remainingChars];
    return this.shuffleArray(allChars).join("");
  }

  private getRandomChar(charset: string): string {
    const randomIndex = crypto.randomInt(0, charset.length);
    return charset[randomIndex];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getSavedPasswords(userId: number): SavedPasswordResponse[] {
    const passwords = passwordRepository.findByUserId(userId);
    return passwords.map(this.toResponse);
  }

  savePassword(userId: number, data: SavePasswordDto): SavedPasswordResponse {
    const savedPassword = passwordRepository.create(userId, data);
    return this.toResponse(savedPassword);
  }

  deletePassword(id: number, userId: number): boolean {
    return passwordRepository.delete(id, userId);
  }

  deleteAllPasswords(userId: number): number {
    return passwordRepository.deleteAll(userId);
  }

  private toResponse(password: SavedPassword): SavedPasswordResponse {
    return {
      id: password.id,
      password: password.password,
      label: password.label,
      length: password.length,
      hasUppercase: password.has_uppercase === 1,
      hasLowercase: password.has_lowercase === 1,
      hasNumbers: password.has_numbers === 1,
      hasSymbols: password.has_symbols === 1,
      createdAt: password.created_at,
    };
  }
}

export const passwordService = new PasswordService();

