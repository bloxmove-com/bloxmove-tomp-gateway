import { ApiProperty } from '@nestjs/swagger';
import { ITelematicsRecord } from '../interfaces/interfaces';
import { TelematicsRecordData } from './telematic-record-data.class';

export class TelematicsRecord implements ITelematicsRecord {

  @ApiProperty({ type: String, description: 'The vin of the vehicle' })
  vin: string;


  @ApiProperty({ type: String, description: 'The deviceId' })
  deviceId: string;

  @ApiProperty({
    type: TelematicsRecordData,
    description: 'The TelematicsRecordData',
  })
  data: TelematicsRecordData;

  @ApiProperty({ type: String, description: 'The deviceSignature' })
  deviceSignature: string;
}
