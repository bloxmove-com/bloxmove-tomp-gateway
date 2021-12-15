import { ApiProperty } from '@nestjs/swagger';

export class EndBookingRequest {
  @ApiProperty({
    type: String,
    description: 'The booking-id of the booking you want to confirm',
  })
  bookingId: string;
}
