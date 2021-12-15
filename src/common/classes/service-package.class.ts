import { ApiProperty } from '@nestjs/swagger';
import { ValidityPeriod } from './validity-period.class';

export class ServicePackage {
  @ApiProperty({
    example: 42,
    type: 'number',
    description: 'The package id of the service',
  })
  packageId: number;

  @ApiProperty({
    example: 'Upper mid-range vehicle standard',
    type: 'string',
    description: 'The name of the service package',
    required: false,
  })
  packageName: string;

  @ApiProperty({
    example:
      'Standard minute based service package for upper mid-range vehicles',
    type: 'string',
    description: 'The description of the service package',
    required: false,
  })
  description: string;

  @ApiProperty({
    example: 0.4,
    type: 'number',
    description: 'The price per minute',
    required: false,
  })
  pricePerMinute: number;

  @ApiProperty({
    example: 0.1,
    type: 'number',
    description: 'The price per kilometer',
    required: false,
  })
  pricePerKm: number;

  @ApiProperty({
    type: () => [ValidityPeriod],
    description: 'List of time frames when the service package is valid',
    required: false,
  })
  validityPeriods: ValidityPeriod[];

  @ApiProperty({
    example:
      '<h2>Valid as of 10.07.2019</h2><h2>§1 Subject matter</h2><h3>(1)</h3><p>Fleet2Share...',
    type: 'string',
    description: `HTML representation of the full terms and conditions applicable for
            this service package, may also be a link pointing to an external
            HTML document`,
    required: false,
  })
  termsConditions: string;

  @ApiProperty({
    type: [String],
    description: `List of required claims an end consumer has
        to fulfil in order to be allowed to book this package, if not set this means the package can
        not be booked by end consumers (B2B-only)`,
  })
  requiredUserClaims: string[];

  @ApiProperty({
    type: [String],
    description: `List of required claims a business has to fulfil in order
     to be allowed to book this package, if not set this means the package can not be booked by businesses (B2C-only)`,
  })
  requiredBusinessClaims: string[];

  @ApiProperty({
    type: String,
    description:
      'The fiat currency that is used to pay for this service package, ISO 4217 code like EUR',
    required: false,
  })
  currency: string;
}
