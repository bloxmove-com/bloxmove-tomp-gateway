import { ConflictException } from '@nestjs/common';

export class VehicleAlreadyBooked extends ConflictException {
  constructor(vin: string) {
    super(`The vehicle ${vin} is already booked.`);
  }
}
