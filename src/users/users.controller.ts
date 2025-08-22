import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAllUsers() {
    return [];
  }

  @Get(':id')
  findOneUserById(id: number) {
    return {};
  }
}
