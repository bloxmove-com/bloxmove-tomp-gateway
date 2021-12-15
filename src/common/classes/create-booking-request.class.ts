import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingRequest {
  @ApiProperty({ type: String, description: 'The ID of the tomp-vehicle' })
  assetId: string;
}
