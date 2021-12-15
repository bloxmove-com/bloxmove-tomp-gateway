import { ApiProperty } from '@nestjs/swagger';

export class ValidityPeriod {
  @ApiProperty({
    example: 1574003890,
    type: 'number',
    description:
      'Timestamp (UTC seconds) that marks the beginning of the validity period.',
  })
  from: number;

  @ApiProperty({
    example: 1574013990,
    type: 'number',
    description:
      'Timestamp (UTC seconds) that marks the end of the validity period.',
  })
  to: number;
}
