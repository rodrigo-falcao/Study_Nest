import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from 'src/common/guards/admin.guard';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    TasksModule, 
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploadsFiles'),
      serveRoot: '/files/',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(
      { path: '*', method: RequestMethod.ALL },
    );
  }
}
