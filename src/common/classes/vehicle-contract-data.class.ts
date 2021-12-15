import { ApiProperty } from '@nestjs/swagger';
import { IVehicleContractData } from '../interfaces/interfaces';

export class VehicleContractData implements IVehicleContractData {
  @ApiProperty({ type: String, description: 'The tomp related booking id' })
  bookingId?: string;
  @ApiProperty({
    type: String,
    description: 'The assetID of the vehicle',
    required: false,
  })
  vehicleDID?: string;
  @ApiProperty({
    type: Number,
    description: 'The choosen id of the pricing package',
    required: false,
  })
  packageId?: number;
  @ApiProperty({
    type: Number,
    description: 'Price per minute',
    required: false,
  })
  pricePerMinute?: number;
  @ApiProperty({ type: Number, description: 'Price per km', required: false })
  pricePerKm?: number;
  @ApiProperty({
    type: String,
    description: 'Terms and conditions',
    required: false,
  })
  termsConditions?: string;
  @ApiProperty({
    type: [String],
    description: 'Required user claims for the booking',
    required: false,
  })
  requiredUserClaims?: string[];
  @ApiProperty({
    type: [String],
    description: 'Required business claims for the booking',
    required: false,
  })
  requiredBusinessClaims?: string[];
  @ApiProperty({
    type: String,
    description: 'The did of the consumer',
    required: false,
  })
  consumerDID?: string;
  @ApiProperty({
    type: String,
    description: 'The type of curreny for the booking',
  })
  currency?: string;
}
