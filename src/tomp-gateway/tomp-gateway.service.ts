import {
  Injectable,
  Logger,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { NotFoundException } from '@nestjs/common';
import {
  IServiceCatalogEntry,
  IUsageData,
  IVehicleContractData,
} from '../common/interfaces/interfaces';
import { VehicleAlreadyBooked } from '../common/exceptions/vehicle-already-booked.exception';
import { DoorStatus, TompBookingState, TompUnitType, VehicleType } from '../common/enums';
import { ConfigService } from '@nestjs/config';
import {
  Asset,
  AssetType,
  Booking,
  BookingOperation,
  BookingRequest,
  Coordinates,
  JournalEntry,
  Leg,
  LegEvent,
  LegEventEnum,
  Operation,
  Planning,
  PlanningRequest,
  SystemInformation,
  SystemPricingPlan,
} from 'src/common/interfaces/tomp';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

interface HeaderRequest {
  [key: string]: string;
}

@Injectable()
export class TompGatewayService {
  private readonly headersRequest: HeaderRequest = {
    'Accept-Language': '',
    Api: '',
    'Api-Version': '',
    'maas-id': '',
  };
  private readonly transportOperatorBaseUrl: string;
  private readonly logger = new Logger();

  constructor(private config: ConfigService, private httpService: HttpService) {
    this.transportOperatorBaseUrl = this.config.get(
      'TOMP_TRANSPORT_OPERATOR_BASE_URL'
    );
    this.headersRequest['Accept-Language'] = this.config.get(
      'TOMP_ACCEPT_LANGUAGE'
    );
    this.headersRequest.Api = this.config.get('API');
    this.headersRequest['Api-Version'] = this.config.get('TOMP_API_VERSION');
    this.headersRequest['maas-id'] = this.config.get('TOMP_MAAS_ID');
  }

  public async createBooking(assetId: string): Promise<IVehicleContractData> {
    const availableAssets = await this.requestAvailableAssets();
    const operatorInformation = await this.requestOperatorInformation();
    this.logger.debug(`Get coordinates of vin`);
    const coordinates = this.getCoordinatesOfAssetId(assetId, availableAssets);

    const planningResponse: Planning = await this.requestPlanning(
      assetId,
      coordinates
    );
    this.logger.debug(`Planning was created at TO:`);
    this.logger.debug(planningResponse);

    const planningId = planningResponse.options[0].legs[0].id;

    this.logger.debug('Request planning finished');
    const bookingResponse: Booking = await this.requestBooking(planningId);

    this.logger.debug(`Booking was created at TO:`);
    this.logger.debug(bookingResponse);

    if (bookingResponse.state !== TompBookingState.PENDING) {
      this.logger.debug(`Received booking from TO is not in state PENDING`);
      throw new UnprocessableEntityException();
    }

    const bookingLeg = bookingResponse.legs[0];

    const vehicleContractData: IVehicleContractData = {};

    // Safe booking id in vehicle contract
    vehicleContractData.bookingId = bookingResponse.legs[0].id;

    vehicleContractData.vehicleDID = assetId;

    bookingLeg.pricing.parts.forEach((p) => {
      if (p.unitType === TompUnitType.MINUTE) {
        vehicleContractData.pricePerMinute = p.amount;
      }
      if (p.unitType === TompUnitType.KM) {
        vehicleContractData.pricePerKm = p.amount;
      }
    });

    vehicleContractData.requiredUserClaims = bookingLeg.conditions.map(
      (c) => c.id
    );
    vehicleContractData.termsConditions = operatorInformation.conditions;

    return vehicleContractData;
  }

  public async requestAvailableAssets(): Promise<AssetType[]> {
    const url = this.transportOperatorBaseUrl + '/operator/available-assets';

    this.logger.debug('Get all available assets');

    try {
      const httpResult = await lastValueFrom(
        this.httpService
          .get(url, { headers: this.headersRequest })
          .pipe(map((resp) => resp.data))
      );

      return httpResult;
    } catch (error) {
      this.logger.error('Error by request available assets', error);
      throw error;
    }
  }

  public async requestOperatorInformation(): Promise<SystemInformation> {
    const url = this.transportOperatorBaseUrl + '/operator/information';

    this.logger.debug('Get operator information');

    try {
      const httpResult = await lastValueFrom(
        this.httpService
          .get(url, { headers: this.headersRequest })
          .pipe(map((resp) => resp.data))
      );

      return httpResult;
    } catch (error) {
      this.logger.error('Error by request operator information', error);
      throw error;
    }
  }

  public async requestOperatorPricingPlans(): Promise<SystemPricingPlan[]> {
    const url = this.transportOperatorBaseUrl + '/operator/pricing-plans';

    this.logger.debug('Get operator pricing plans');

    try {
      const httpResult = await lastValueFrom(
        this.httpService
          .get(url, { headers: this.headersRequest })
          .pipe(map((resp) => resp.data))
      );

      return httpResult;
    } catch (error) {
      this.logger.error('Error by request operator pricing plans', error);
      throw error;
    }
  }

  public async requestPlanning(
    assetId: string,
    coordinates: Coordinates
  ): Promise<Planning> {
    const url =
      this.transportOperatorBaseUrl + '/plannings/?booking-intent=true';

    const planningRequest: PlanningRequest = {
      from: {
        coordinates: {
          lng: coordinates.lng,
          lat: coordinates.lat,
        },
      },
      nrOfTravelers: 1,
      useAssets: [assetId],
    };

    this.logger.debug('Planning request to TO:');
    this.logger.debug(planningRequest);

    try {
      const httpResult = await lastValueFrom(
        this.httpService
          .post(url, planningRequest, { headers: this.headersRequest })
          .pipe(map((resp) => resp.data))
      );

      this.logger.debug(
        `A planning has been requested for this assetId: ${assetId}`
      );

      return httpResult;
    } catch (error) {
      this.logger.error('Error by request planning', error);
      throw error;
    }
  }

  public async requestBooking(id: string): Promise<Booking> {
    const url = this.transportOperatorBaseUrl + '/bookings/';

    const bookingRequest: BookingRequest = {
      id,
    };

    this.logger.debug('Booking request to TO:');
    this.logger.debug(bookingRequest);

    try {
      const httpResult = await lastValueFrom(
        this.httpService
          .post(url, bookingRequest, { headers: this.headersRequest })
          .pipe(map((resp) => resp.data))
      );

      this.logger.debug(`A booking has been requested for id: ${id}`);

      return httpResult;
    } catch (error) {
      this.logger.error('Error by request booking', error);
      throw error;
    }
  }

  public async getBooking(bookingId: string): Promise<Booking> {
    const url = this.transportOperatorBaseUrl + `/bookings/${bookingId}`;

    this.logger.debug(`Get booking with id: ${bookingId}`);

    try {
      const httpResult = await lastValueFrom(
        this.httpService
          .get(url, { headers: this.headersRequest })
          .pipe(map((resp) => resp.data))
      );

      return httpResult;
    } catch (error) {
      this.logger.error('Error by getting booking', error);
      throw error;
    }
  }

  async confirmBooking(bookingId: string): Promise<void> {
    const booking = await this.getBooking(bookingId);

    if (!booking) {
      throw new NotFoundException(
        'Booking not found at tomp transport operator'
      );
    }

    if (booking.state === 'CONFIRMED') {
      throw new VehicleAlreadyBooked(booking.legs[0].asset.id);
    }

    const confirmedBooking = await this.updateBooking(bookingId, 'COMMIT');

    if (confirmedBooking.state !== 'CONFIRMED') {
      throw new UnprocessableEntityException(
        'TOMP booking is not in the state CONFIRMED'
      );
    }
  }

  public async updateBooking(
    bookingId: string,
    operation: Operation
  ): Promise<Booking> {
    const url = this.transportOperatorBaseUrl + `/bookings/${bookingId}/events`;

    const bookingOperation: BookingOperation = {
      operation,
    };

    this.logger.debug(`Booking operation for bookingId: ${bookingId}`);
    this.logger.debug(bookingOperation);

    try {
      const httpResult = await lastValueFrom(
        this.httpService
          .post(url, bookingOperation, { headers: this.headersRequest })
          .pipe(map((resp) => resp.data))
      );

      this.logger.debug(`A booking has been updated`);

      return httpResult;
    } catch (error) {
      this.logger.error('Error by updating booking', error);
      throw error;
    }
  }

  public async updateLeg(id: string, event: LegEventEnum): Promise<Leg> {
    const url = this.transportOperatorBaseUrl + `/legs/${id}/events`;

    const legEvent: LegEvent = {
      time: new Date().toJSON(),
      event,
    };

    this.logger.debug(`Leg event for id: ${id}`);
    this.logger.debug(legEvent);

    try {
      const httpResult = await lastValueFrom(
        this.httpService
          .post(url, legEvent, { headers: this.headersRequest })
          .pipe(map((resp) => resp.data))
      );

      this.logger.debug(`A leg has been updated`);

      return httpResult;
    } catch (error) {
      this.logger.error('Error by updating leg', error);
      throw new NotFoundException(
        'Leg can not be updated at tomp transport operator'
      );
    }
  }

  public async endBooking(id: string): Promise<IUsageData> {
    const finishedLeg = await this.updateLeg(id, 'FINISH');

    this.logger.debug(`Updated leg:`);
    this.logger.debug(finishedLeg);

    const paymentEntries = await this.getPaymentJournalEntries(id);

    const CONVERSION_FACTOR_MILE_TO_KM = 1.609344;

    const distance = paymentEntries
      .map((entry) =>
        entry.distanceType === 'MILE'
          ? {
              ...entry,
              distance:
                Math.round(entry.distance * CONVERSION_FACTOR_MILE_TO_KM * 10) /
                10,
            }
          : entry
      )
      .reduce((a, b) => a + b.distance, 0);

    const usageData = {
      vin: finishedLeg.asset.id,
      vehicleDID: finishedLeg.asset.id,
      rentalStartTime: Date.parse(finishedLeg.departureTime),
      rentalStartMileage: 0,
      rentalDuration: paymentEntries.reduce((a, b) => a + b.usedTime, 0),
      rentalMileage: distance,
      rentalEndTime: Date.parse(finishedLeg.arrivalTime),
      rentalEndMileage: distance,
      rentalStartLocLat: finishedLeg.from.coordinates.lat,
      rentalStartLocLong: finishedLeg.from.coordinates.lng,
      rentalEndLocLat: finishedLeg.to.coordinates.lat,
      rentalEndLocLong: finishedLeg.to.coordinates.lng,
      finalPrice: paymentEntries.reduce((a, b) => a + b.amount, 0),
      priceComment: paymentEntries.map((e) => e.comment).join(', '),
    };

    return usageData;
  }

  public async getPaymentJournalEntries(id: string): Promise<JournalEntry[]> {
    const url =
      this.transportOperatorBaseUrl + `/payment/journal-entry?id=${id}`;

    this.logger.debug(`Get payment journal entry of id: ${id}`);

    try {
      const httpResult = await lastValueFrom(
        this.httpService
          .get(url, { headers: this.headersRequest })
          .pipe(map((resp) => resp.data))
      );

      this.logger.debug(`payment journal entry requested`);

      return httpResult;
    } catch (error) {
      this.logger.error('Error by requesting payment journal', error);
      throw error;
    }
  }
  public async changeDoorStatus(bookingId: string, doorStatus: DoorStatus) {
    let leg: Leg;

    if (!Object.values(DoorStatus).includes(doorStatus)) {
      throw new BadRequestException(
        'Wrong door status provided, it should be "OPEN" or "CLOSED"'
      );
    }
    if (doorStatus === DoorStatus.OPEN) {
      leg = await this.updateLeg(bookingId, 'SET_IN_USE');
    }
    if (doorStatus === DoorStatus.CLOSED) {
      leg = await this.updateLeg(bookingId, 'PAUSE');
    }

    this.logger.debug(leg);
  }

  public getCoordinatesOfAssetId(
    assetId: string,
    availableAssets: AssetType[]
  ): Coordinates {
    const asset = availableAssets[0].assets.find((a) => a.id === assetId);

    if (!asset) {
      throw new NotFoundException('Asset not available');
    }

    return asset.overriddenProperties.location.coordinates;
  }

  public async getServiceCatalogFromTransportOperatorRequest(): Promise<
    IServiceCatalogEntry[]
  > {
    const assetTypes: AssetType[] = await this.requestAvailableAssets();
    const assets: Asset[] = assetTypes[0].assets;
    const pricingPlans: SystemPricingPlan[] =
      await this.requestOperatorPricingPlans();
    const operatorInformation = await this.requestOperatorInformation();

    const mappedAssetsToServiceCatalog: IServiceCatalogEntry[] = assets.map(
      (asset) =>
        this.mapTransportOperatorAssetToServiceCatalogEntry(
          asset,
          pricingPlans,
          operatorInformation
        )
    );

    return mappedAssetsToServiceCatalog;
  }

  public mapTransportOperatorAssetToServiceCatalogEntry(
    asset: Asset,
    pricingPlans: SystemPricingPlan[],
    operatorInformation: SystemInformation
  ): IServiceCatalogEntry {
    // for now only 1 pricing plan can be shown in the app. No functionality to book a specific plan in tomp api --> Changes with tomp-version 1.3.0
    const pricingPlan = pricingPlans.find(
      (plan) => plan.planId === asset.overriddenProperties.meta.pricingPlanId
    );

    return {
      vehicleDID: asset.id,
      servicePackages: [
        {
          packageId: Number(pricingPlan.planId),
          packageName: pricingPlan.name,
          description: pricingPlan.description,
          pricePerMinute:
            pricingPlan.fare.parts[0].unitType === 'MINUTE'
              ? pricingPlan.fare.parts[0].amount
              : 0,
          validityPeriods: [
            {
              from: 1583193600,
              to: 16756675200,
            },
          ],
          termsConditions: operatorInformation.conditions,
          requiredUserClaims:
            asset.overriddenProperties.meta.requiredUserClaims,
          pricePerKm:
            pricingPlan.fare.parts[0].unitType === 'KM'
              ? pricingPlan.fare.parts[0].amount
              : 0,
          requiredBusinessClaims: [],
          currency: 'EUR',
        },
      ],
      status: {
        vin: asset.id,
        latestTelematicsRecord: {
          vin: asset.id,
          deviceId: '',
          data: {
            timestamp: null,
            locLat: asset.overriddenProperties.location.coordinates.lat,
            locLong: asset.overriddenProperties.location.coordinates.lng,
            mileage: asset.overriddenProperties.meta.mileage,
            fuelLevel: asset.overriddenProperties.stateOfCharge,
            isDoorOpened: false,
          },
          deviceSignature: '',
        },
      },
      vin: asset.id,
      vehicleType: VehicleType.CAR,
      batteryMaxCapacity: null,
      brand: asset.overriddenProperties.brand,
      model: asset.overriddenProperties.model,
      fuelType: asset.overriddenProperties.fuel,
      numberOfDoors: asset.overriddenProperties.meta.numberOfDoors,
      numberOfSeats: asset.overriddenProperties.persons,
      transmission: asset.overriddenProperties.gearbox,
      licensePlate: asset.overriddenProperties.meta.licensePlate,
      imageUrl: asset.overriddenProperties.image,
    };
  }
}
