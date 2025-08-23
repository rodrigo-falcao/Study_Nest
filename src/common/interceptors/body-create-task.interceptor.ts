import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class BodyCreateTaskInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { url, body } = request;

    console.log(`Before... Body: ${JSON.stringify(body, null, 2)}`);
    console.log(`Before... URL: ${url}`);

    return next.handle().pipe();
  }
}