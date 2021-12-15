import { ApiProperty } from '@nestjs/swagger';
import { DoorStatus } from '../enums';

export class ChangeDoorStatusRequest {
  @ApiProperty({
    type: String,
    description: 'The booking-id of the booking you want to confirm',
  })
  bookingId: string;

  @ApiProperty({
    enum: DoorStatus,
    description: 'The new status the door of the vehicle should have',
  })
  doorStatus: DoorStatus;
}
