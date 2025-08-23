import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../commom/auth.constants";

@Injectable()
export class AuthTokenGuards implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true
  }

  extractTokenHeader(request: Request) {
    const authorizationHeader = request.headers?.authorization
    if (!authorizationHeader || typeof authorizationHeader !== "string") {
      return
    }

    return authorizationHeader.split(" ")[1];
  }
}
