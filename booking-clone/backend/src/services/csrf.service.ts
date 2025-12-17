import { csrfRepository } from "../repositories/index.js";

export class CsrfService {
  generateToken(userId: number): string {
    return csrfRepository.generate(userId);
  }
}

export const csrfService = new CsrfService();
