import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class BodyCreateTaskInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const response = context.switchToHttp().getResponse();

    console.log(`Before... Body: ${JSON.stringify(body, null, 2)}`);
    // console.log('Before... Method:', method);
    console.log(`Before... URL: ${url}`);

    return next.handle().pipe();
  }
}