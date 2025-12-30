import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const now = Date.now();

    // Sanitize URL to avoid logging sensitive query params
    const sanitizedUrl = this.sanitizeUrl(url);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - now;

          this.logger.log(
            `${method} ${sanitizedUrl} ${statusCode} ${duration}ms - ${ip}`,
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          const statusCode = error.status || 500;

          this.logger.error(
            `${method} ${sanitizedUrl} ${statusCode} ${duration}ms - ${ip} - ${error.message}`,
          );
        },
      }),
    );
  }

  private sanitizeUrl(url: string): string {
    // Remove query parameters to avoid logging sensitive data
    const urlPath = url.split('?')[0];
    const queryString = url.split('?')[1];

    if (!queryString) {
      return urlPath;
    }

    // Only log the parameter names, not values
    const params = queryString.split('&');
    const paramNames = params.map((param) => param.split('=')[0]);
    return `${urlPath}?${paramNames.join('&')}=***`;
  }
}

