import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = "Internal server error";
    let errorName = "Internal Server Error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        message = (res as Record<string, unknown>).message || res;
        errorName = (res as Record<string, unknown>).error as string || exception.name;
      }
    } else if (typeof exception === "object" && exception !== null) {
      const err = exception as Record<string, unknown>;
      const code = err.code as string;

      // Handle Prisma specific error codes
      if (code === "P2002") {
        status = HttpStatus.CONFLICT;
        message = "A unique constraint violation occurred.";
        errorName = "Conflict";
      } else if (code === "P2003") {
        status = HttpStatus.BAD_REQUEST;
        message = "Foreign key constraint failed.";
        errorName = "Bad Request";
      } else if (code === "P2025") {
        status = HttpStatus.NOT_FOUND;
        message = "Record not found.";
        errorName = "Not Found";
      } else {
        this.logger.error("Unhandled Exception:", exception);
        message = (err.message as string) || "Database operation failed";
      }
    } else {
      this.logger.error("Unhandled Exception:", exception);
    }

    response.status(status).json({
      statusCode: status,
      error: errorName,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
