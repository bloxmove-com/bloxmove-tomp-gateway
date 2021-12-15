import { VehicleType } from '../enums';

export interface IVehicle {
  vin?: string;
  vehicleDID?: string;
  vehicleType?: VehicleType;
  batteryMaxCapacity?: string;
  brand: string;
  model: string;
  fuelType: string;
  numberOfDoors: number;
  numberOfSeats: number;
  transmission: string;
  licensePlate: string;
  imageUrl: string;
}

export interface IVehicleContractData {
  vehicleDID?: string;
  packageId?: number;
  pricePerMinute?: number;
  pricePerKm?: number;
  termsConditions?: string;
  requiredUserClaims?: string[];
  requiredBusinessClaims?: string[];
  consumerDID?: string;
  bookingId?: string;
  currency?: string;
}

export interface ITelematicsRecord {
  vin: string;
  deviceId: string;
  data: ITelematicsRecordData;
  deviceSignature: string;
}

export interface ITelematicsRecordData {
  timestamp: number;
  locLat: number;
  locLong: number;
  mileage: number;
  fuelLevel: number;
  isDoorOpened: boolean;
}

export interface IVehicleStatus {
  vin: string;
  bookedSince?: number;
  bookedPackage?: number;
  latestTelematicsRecord: ITelematicsRecord;
}

export interface IUsageData {
  vin: string;
  vehicleDID: string;
  rentalStartTime: number;
  rentalStartMileage: number;
  rentalDuration: number;
  rentalMileage: number;
  rentalEndTime: number;
  rentalEndMileage: number;
  rentalStartLocLat: number;
  rentalStartLocLong: number;
  rentalEndLocLat: number;
  rentalEndLocLong: number;
  finalPrice: number;
  priceComment?: string;
}

export interface IServicePackage {
  packageId: number;
  packageName: string;
  description: string;
  pricePerMinute: number;
  pricePerKm: number;
  termsConditions: string;
  validityPeriods: IValidityPeriods[];
  requiredUserClaims: string[];
  requiredBusinessClaims: string[];
  currency: string;
}

export interface IValidityPeriods {
  from: number;
  to: number;
}

export interface IServiceCatalogEntry extends IVehicle {
  status: IVehicleStatus;
  servicePackages: IServicePackage[];
}
