import { ApiProperty } from '@nestjs/swagger';

export class ConfirmBookingRequest {
  @ApiProperty({
    type: String,
    description: 'The booking-id of the booking you want to confirm',
  })
  bookingId: string;
}
