import { Module } from '@nestjs/common';
import { TompGatewayController } from './tomp-gateway.controller';
import { TompGatewayService } from 'src/tomp-gateway/tomp-gateway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TompGatewayController],
  providers: [TompGatewayService],
  exports: [TompGatewayService],
})
export class TompGatewayModule {}
