import { ApiProperty } from '@nestjs/swagger';
import { IServiceCatalogEntry } from '../interfaces/interfaces';
import { ServicePackage } from './service-package.class';
import { VehicleType } from '../enums';
import { VehicleStatus } from './vehicle-status.class';

export class ServiceCatalog implements IServiceCatalogEntry {
  @ApiProperty({
    example: 'tomp-asset-id-01',
    type: String,
    description: 'The asset id of the tomp vehicle',
  })
  vehicleDID: string;

  @ApiProperty({
    type: [ServicePackage],
    description: 'Service packages associated with the asset id',
  })
  servicePackages: ServicePackage[];

  @ApiProperty({ type: VehicleStatus, description: 'Status of the vehicle' })
  status: VehicleStatus;
  @ApiProperty({ type: String, required: false })
  vin;
  @ApiProperty({ enum: VehicleType })
  vehicleType: VehicleType;
  @ApiProperty({ type: String, required: false })
  batteryMaxCapacity;
  @ApiProperty({ type: String, required: false })
  brand;
  @ApiProperty({ type: String, required: false })
  fuelType;
  @ApiProperty({ type: Number, required: false })
  numberOfDoors;
  @ApiProperty({ type: Number, required: false })
  numberOfSeats;
  @ApiProperty({ type: String, required: false })
  transmission;
  @ApiProperty({ type: String, required: false })
  licensePlate;
  @ApiProperty({ type: String, required: false })
  imageUrl;
  @ApiProperty({ type: String, required: false })
  model;
}
