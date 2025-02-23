import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response.utils';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await this.authService.login(username, password);
      return res.json(successResponse(result));
    } catch (error: any) {
      return res.status(401).json(errorResponse(error.message));
    }
  }

  async logout(req: Request, res: Response) {
    // Implementation for logout if needed
    return res.json(successResponse({ message: 'Logged out successfully' }));
  }
}