import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();
    console.log(`Before... ${method} ${url} - Start`);

    return next.handle().pipe(
      tap(() => {
        console.log(`After... ${method} ${url} - End in ${Date.now() - now}ms`);
      })
    );
  }
}