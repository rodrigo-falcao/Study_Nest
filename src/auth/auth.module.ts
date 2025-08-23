import { BcryptService } from './hash/bcrypt.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { Global, Module } from '@nestjs/common';

@Global()
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
