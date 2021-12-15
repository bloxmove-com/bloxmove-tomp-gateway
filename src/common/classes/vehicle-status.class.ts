import { ApiProperty } from '@nestjs/swagger';
import { IVehicleStatus } from '../interfaces/interfaces';
import { TelematicsRecord } from './telematic-data.class';

export class VehicleStatus implements IVehicleStatus {
  @ApiProperty({ type: String, description: 'The vin of the vehicle' })
  vin: string;
  @ApiProperty({
    type: Number,
    description:
      'The Timestamp (UTC seconds) since when the vehicle is booked, 0 if currently not booked',
  })
  bookedSince: number;
  @ApiProperty({ type: Number, description: 'The id of the booked package' })
  bookedPackage: number;
  @ApiProperty({
    type: TelematicsRecord,
    description: 'The TelematicsRecordData',
  })
  latestTelematicsRecord: TelematicsRecord;
}
