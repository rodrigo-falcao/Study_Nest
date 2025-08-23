import { BcryptService } from './hash/bcrypt.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    PrismaModule, 
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ],
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
    AuthService,
  ],
  exports: [
    HashingServiceProtocol,
    AuthService,
    JwtModule,
    ConfigModule
  ],
  controllers: [AuthController],
})
export class AuthModule {}
