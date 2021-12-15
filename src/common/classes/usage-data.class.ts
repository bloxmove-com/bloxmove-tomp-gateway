import { ApiProperty } from '@nestjs/swagger';
import { IUsageData } from '../interfaces/interfaces';

export class UsageData implements IUsageData {
  @ApiProperty({ type: String, description: 'The assetID of the vehicle' })
  vin: string;
  @ApiProperty({ type: String, description: 'The assetID of the vehicle' })
  vehicleDID: string;
  @ApiProperty({
    type: Number,
    description: 'The timestamp (UTC seconds) when the rent started',
  })
  rentalStartTime: number;
  @ApiProperty({
    type: Number,
    description: 'The mileage (in km) of the time when the rent started',
  })
  rentalStartMileage: number;
  @ApiProperty({
    type: Number,
    description: 'The total duration of the rent in minutes',
  })
  rentalDuration: number;
  @ApiProperty({
    type: Number,
    description: 'The total mileage of the rent in km',
  })
  rentalMileage: number;
  @ApiProperty({
    type: Number,
    description: 'The timestamp (UTC seconds) when the rent ended',
  })
  rentalEndTime: number;
  @ApiProperty({
    type: Number,
    description: 'Mileage (in km) of the time when the rent ended',
  })
  rentalEndMileage: number;
  @ApiProperty({
    type: Number,
    description: 'The latitude of the location where the rent started',
  })
  rentalStartLocLat: number;
  @ApiProperty({
    type: Number,
    description: 'The longitude of the location where the rent started',
  })
  rentalStartLocLong: number;
  @ApiProperty({
    type: Number,
    description: 'The latitude of the location where the rent ended',
  })
  rentalEndLocLat: number;
  @ApiProperty({
    type: Number,
    description: 'The longitude of the location where the rent ended',
  })
  rentalEndLocLong: number;
  @ApiProperty({
    type: Number,
    description:
      'The final price of the rent in the currency specified in the contract data',
  })
  finalPrice: number;
  @ApiProperty({
    type: String,
    description: 'The optional comment related to the final price',
    required: false,
  })
  priceComment?: string;
}
