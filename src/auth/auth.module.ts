import { BcryptService } from './hash/bcrypt.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  exports: [HashingServiceProtocol],
})
export class AuthModule {}
