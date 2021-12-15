import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TompGatewayModule } from './tomp-gateway/tomp-gateway.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TompGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
