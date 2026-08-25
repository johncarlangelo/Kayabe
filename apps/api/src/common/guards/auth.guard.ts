import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

declare module "express" {
  interface Request {
    user?: AuthenticatedUser;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const devUserId = request.headers["x-user-id"] as string;
    const devUserEmail = request.headers["x-user-email"] as string;

    // 1. Direct header for internal or test requests
    if (devUserId) {
      request.user = {
        id: devUserId,
        email: devUserEmail || `${devUserId}@kayabe.io`,
      };
      return true;
    }

    // 2. Bearer token (JWT)
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        // Parse JWT payload safely
        const payloadBase64 = token.split(".")[1];
        if (payloadBase64) {
          const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
          const payload = JSON.parse(payloadJson);

          const userId = payload.sub || payload.id || payload.user_id;
          const userEmail = payload.email || payload.user_metadata?.email;

          if (userId) {
            request.user = {
              id: userId,
              email: userEmail || `${userId}@kayabe.io`,
              name: payload.user_metadata?.full_name || payload.user_metadata?.name,
              role: payload.app_metadata?.role || "member",
            };
            return true;
          }
        }
      } catch (err) {
        throw new UnauthorizedException("Invalid authentication token");
      }
    }

    throw new UnauthorizedException("User not authenticated");
  }
}
