import { ApiProperty } from '@nestjs/swagger';
import { ITelematicsRecordData } from '../interfaces/interfaces';

export class TelematicsRecordData implements ITelematicsRecordData {

  @ApiProperty({ type: Number, description: 'The vin of the vehicle' })
  timestamp: number;

  @ApiProperty({
    type: Number,
    description: 'The Latitude of the current location of the vehicle',
  })
  locLat: number;

  @ApiProperty({
    type: Number,
    description: 'The Longitude of the current location of the vehicle',
  })
  locLong: number;

  @ApiProperty({
    type: Number,
    description: 'The current mileage of the vehicle in kilometers',
  })
  mileage: number;

  @ApiProperty({ type: Number, description: 'The fuel level of the vehicle' })
  fuelLevel: number;

  @ApiProperty({ type: Boolean, description: 'The status of the door' })
  isDoorOpened: boolean;
}
