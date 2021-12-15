import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { of } from 'rxjs';

import { leg, booking, availableAssets, planning, journalEntries, operatorInformation, operatorPricingPlans } from './mock-data';
import { ConfigModule } from '@nestjs/config';
import { TompGatewayService } from './tomp-gateway.service';
import { VehicleAlreadyBooked } from '../common/exceptions/vehicle-already-booked.exception';
import { DoorStatus } from '../common/enums';
import { HttpService } from '@nestjs/axios';

describe('TOMP Transport Operator Service Test', () => {
  let tompGatewayService: TompGatewayService;

  const httpMock = jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  }))();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [],
      providers: [
        TompGatewayService,
        { provide: HttpService, useValue: httpMock }
      ],
    }).compile();

    tompGatewayService = module.get<TompGatewayService>(TompGatewayService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should be defined', () => {
    it('should be defined', async () => {
      expect(tompGatewayService).toBeDefined();
    });
  });

  describe('booking', () => {
    it('update booking', async () => {
      jest.spyOn(httpMock, 'post').mockReturnValueOnce(of({ data: { ...booking, state: 'CONFIRMED' } }));
      const updatedBooking = await tompGatewayService.updateBooking('1234', 'COMMIT');

      expect(updatedBooking.id).toBe(booking.id);
      expect(updatedBooking.state).toBe('CONFIRMED');
      expect(httpMock.post).toBeCalled();
    });

    it('get booking', async () => {
      jest.spyOn(httpMock, 'get').mockReturnValueOnce(of({ data: { ...booking, state: 'PENDING' } }));
      const bookingData = await tompGatewayService.getBooking('123');

      expect(bookingData.id).toBe(booking.id);
      expect(bookingData.state).toBe('PENDING');
      expect(httpMock.get).toBeCalled();
    });
  });

  describe('leg', () => {
    it('update leg', async () => {
      jest.spyOn(httpMock, 'post').mockReturnValueOnce(of({ data: leg }));
      const updatedLeg = await tompGatewayService.updateLeg('2de3fd01-be0b-4eb2-b06f-c712ae7e718a', 'SET_IN_USE');

      expect(updatedLeg.id).toBe(leg.id);
      expect(updatedLeg.state).toBe(leg.state);
      expect(httpMock.post).toBeCalled();
    });
  });

  describe('available assets', () => {
    it('request available assets', async () => {
      jest.spyOn(httpMock, 'get').mockReturnValueOnce(of({ data: availableAssets }));
      const assets = await tompGatewayService.requestAvailableAssets();

      expect(availableAssets.length).toBe(1);
      expect(availableAssets[0].assets.length).toBe(2);
      expect(assets[0].assets[1].id).toBe(availableAssets[0].assets[1].id);
      expect(httpMock.get).toBeCalled();
    });
  });

  describe('operator information', () => {
    it('request operator information', async () => {
      jest.spyOn(httpMock, 'get').mockReturnValueOnce(of({ data: operatorInformation }));
      const information = await tompGatewayService.requestOperatorInformation();

      expect(information).toMatchObject(operatorInformation);
      expect(information.systemId).toBe('maas-car-3342');
      expect(httpMock.get).toBeCalled();
    });
  });

  describe('operator pricing plans', () => {
    it('request operator pricing plans', async () => {
      jest.spyOn(httpMock, 'get').mockReturnValueOnce(of({ data: operatorPricingPlans }));
      const pricingPlans = await tompGatewayService.requestOperatorPricingPlans();

      expect(pricingPlans[0]).toMatchObject(operatorPricingPlans[0]);
      expect(pricingPlans[1].planId).toBe(operatorPricingPlans[1].planId);
      expect(httpMock.get).toBeCalled();
    });
  });

  describe('payment journal', () => {
    it('request payment journal entries', async () => {
      jest.spyOn(httpMock, 'get').mockReturnValueOnce(of({ data: journalEntries }));
      const entries = await tompGatewayService.getPaymentJournalEntries('123');

      expect(entries[0]).toMatchObject(entries[0]);
      expect(entries[1].amount).toBe(entries[1].amount);
      expect(httpMock.get).toBeCalled();
    });
  });

  describe('coordinates of assetId', () => {
    it('assetId found', () => {
      const coordinates = tompGatewayService.getCoordinatesOfAssetId('1', availableAssets);

      expect(coordinates.lat).toBe(53.551086);
      expect(coordinates.lng).toBe(9.993682);
    });

    it('assetId not found', () => {
      expect(() => tompGatewayService.getCoordinatesOfAssetId('3', availableAssets)).toThrow(NotFoundException);
    });
  });

  describe('create booking', () => {
    it('okay', async () => {
      jest.spyOn(tompGatewayService, 'requestAvailableAssets').mockResolvedValueOnce(availableAssets);
      jest.spyOn(tompGatewayService, 'requestPlanning').mockResolvedValueOnce(planning);
      jest.spyOn(tompGatewayService, 'requestBooking').mockResolvedValueOnce(booking);
      jest.spyOn(tompGatewayService, 'requestOperatorInformation').mockResolvedValueOnce(operatorInformation);

      const vehicleContractData = await tompGatewayService.createBooking('2');

      expect(vehicleContractData.bookingId).toBe(booking.id);
      expect(tompGatewayService.requestAvailableAssets).toHaveBeenCalled();
      expect(tompGatewayService.requestPlanning).toHaveBeenCalledWith('2', { lat: 53.34917, lng: 9.592168 });
      expect(tompGatewayService.requestBooking).toHaveBeenCalledWith(planning.options[0].id);
    });

    it('asset not found', async () => {
      jest.spyOn(tompGatewayService, 'requestAvailableAssets').mockResolvedValueOnce(availableAssets);
      jest.spyOn(tompGatewayService, 'requestOperatorInformation').mockResolvedValueOnce(operatorInformation);
      await expect(tompGatewayService.createBooking('3')).rejects.toThrow(NotFoundException);
    });

    it('booking not in state pending', async () => {
      jest.spyOn(tompGatewayService, 'requestAvailableAssets').mockResolvedValueOnce(availableAssets);
      jest.spyOn(tompGatewayService, 'requestPlanning').mockResolvedValueOnce(planning);
      jest.spyOn(tompGatewayService, 'requestBooking').mockResolvedValueOnce({ ...booking, state: 'REJECTED' });
      jest.spyOn(tompGatewayService, 'requestOperatorInformation').mockResolvedValueOnce(operatorInformation);

      await expect(tompGatewayService.createBooking('2')).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('confirm booking', () => {
    it('okay', async () => {
      jest.spyOn(tompGatewayService, 'getBooking').mockResolvedValueOnce(booking);
      jest.spyOn(tompGatewayService, 'updateBooking').mockResolvedValueOnce({ ...booking, state: 'CONFIRMED' });

      await tompGatewayService.confirmBooking('123');


      expect(tompGatewayService.getBooking).toHaveBeenCalledWith('123');
      expect(tompGatewayService.updateBooking).toHaveBeenCalledWith('123', 'COMMIT');
    });

    it('booking already confirmed', async () => {
      jest.spyOn(tompGatewayService, 'getBooking').mockResolvedValueOnce({ ...booking, state: 'CONFIRMED' });

      await expect(tompGatewayService.confirmBooking('123')).rejects.toThrow(VehicleAlreadyBooked);
    });

    it('booking not in state confirmed', async () => {
      jest.spyOn(tompGatewayService, 'getBooking').mockResolvedValueOnce(booking);
      jest.spyOn(tompGatewayService, 'updateBooking').mockResolvedValueOnce({ ...booking, state: 'PENDING' });

      await expect(tompGatewayService.confirmBooking('123')).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('change door status', () => {
    it('open', async () => {
      jest.spyOn(tompGatewayService, 'updateLeg').mockResolvedValueOnce({ ...leg, state: 'IN_USE' });

      await tompGatewayService.changeDoorStatus('123', DoorStatus.OPEN);
      expect(tompGatewayService.updateLeg).toHaveBeenCalledWith('123', 'SET_IN_USE');
    });

    it('close', async () => {
      jest.spyOn(tompGatewayService, 'updateLeg').mockResolvedValueOnce({ ...leg, state: 'PAUSED' });

      await tompGatewayService.changeDoorStatus('123', DoorStatus.CLOSED);
      expect(tompGatewayService.updateLeg).toHaveBeenCalledWith('123', 'PAUSE');
    });
  });

  describe('rental end a vehicle', () => {
    it('request rental end', async () => {
      jest.spyOn(tompGatewayService, 'updateLeg').mockResolvedValue(leg);
      jest.spyOn(tompGatewayService, 'getPaymentJournalEntries').mockResolvedValue(journalEntries);
      const usageData = await tompGatewayService.endBooking('id');

      expect(tompGatewayService.updateLeg).toHaveBeenCalled();
      expect(tompGatewayService.getPaymentJournalEntries).toHaveBeenCalled();

      expect(usageData.finalPrice).toBe(6.76);
      expect(usageData.rentalDuration).toBe(30);
      expect(usageData.priceComment).toBe('Invoice1 for your tomp trip, Invoice2 for your tomp trip');
      expect(usageData.rentalStartTime).toBe(Date.parse(leg.departureTime));
      expect(usageData.rentalStartMileage).toBe(0);
      expect(usageData.rentalMileage).toBe(230.5);
      expect(usageData.rentalEndMileage).toBe(230.5);
      expect(usageData.rentalEndTime).toBe(Date.parse(leg.arrivalTime));
      expect(usageData.rentalStartLocLat).toBe(leg.from.coordinates.lat);
      expect(usageData.rentalStartLocLong).toBe(leg.from.coordinates.lng);
      expect(usageData.rentalEndLocLat).toBe(leg.to.coordinates.lat);
      expect(usageData.rentalEndLocLong).toBe(leg.to.coordinates.lng);
      expect(usageData.rentalEndLocLong).toBe(leg.to.coordinates.lng);
    });
  });

  describe('mapTransportOperatorAssetToServiceCatalogEntry', () => {
    it('map', () => {
      const asset = availableAssets[0].assets[0];
      const mappedAsset = tompGatewayService.mapTransportOperatorAssetToServiceCatalogEntry(asset, operatorPricingPlans, operatorInformation);

      expect(mappedAsset.servicePackages[0].packageId).toBe(100);
      expect(mappedAsset.servicePackages[0].packageName).toBe('Pricing Plan Min');
      expect(mappedAsset.servicePackages[0].description).toBe('Pricing plan for minutes');
      expect(mappedAsset.servicePackages[0].pricePerMinute).toBe(0.5);
      expect(mappedAsset.servicePackages[0].validityPeriods[0].from).toBe(1583193600);
      expect(mappedAsset.servicePackages[0].validityPeriods[0].to).toBe(16756675200);
      expect(mappedAsset.servicePackages[0].termsConditions).toBe('Terms and conditions of car transport operator...');
      expect(mappedAsset.servicePackages[0].requiredUserClaims[0]).toBe('minAge18');
      expect(mappedAsset.servicePackages[0].pricePerKm).toBe(0);
      expect(mappedAsset.servicePackages[0].requiredBusinessClaims.length).toBe(0);

      expect(mappedAsset.status.vin).toBe('1');
      expect(mappedAsset.status.latestTelematicsRecord.vin).toBe('1');
      expect(mappedAsset.status.latestTelematicsRecord.deviceId).toBe('');
      expect(mappedAsset.status.latestTelematicsRecord.data.timestamp).toBeNull();
      expect(mappedAsset.status.latestTelematicsRecord.data.locLat).toBe(53.551086);
      expect(mappedAsset.status.latestTelematicsRecord.data.locLong).toBe(9.993682);
      expect(mappedAsset.status.latestTelematicsRecord.data.mileage).toBe(19000);
      expect(mappedAsset.status.latestTelematicsRecord.data.fuelLevel).toBe(100);
      expect(mappedAsset.status.latestTelematicsRecord.data.isDoorOpened).toBe(false);
      expect(mappedAsset.status.latestTelematicsRecord.deviceSignature).toBe('');

      expect(mappedAsset.vin).toBe('1');
      expect(mappedAsset.model).toBe('R8');
      expect(mappedAsset.fuelType).toBe('GASOLINE');
      expect(mappedAsset.numberOfDoors).toBe(5);
      expect(mappedAsset.numberOfSeats).toBe(5);
      expect(mappedAsset.transmission).toBe('AUTOMATIC');
      expect(mappedAsset.licensePlate).toBe('HH-AA-2021');
      expect(mappedAsset.imageUrl).toBe('https://mediaservice.audi.com/media/live/50900/fly1400x601n8/4sp/2021.png?wid=550&output-format=webp');
    });
  });

  describe('service catalog', () => {
    it('get service catalog from transport-operator-request', async () => {
      jest.spyOn(tompGatewayService, 'requestAvailableAssets').mockResolvedValue(availableAssets);
      jest.spyOn(tompGatewayService, 'requestOperatorPricingPlans').mockResolvedValue(operatorPricingPlans);
      jest.spyOn(tompGatewayService, 'requestOperatorInformation').mockResolvedValue(operatorInformation);

      const mappedAssetsToServiceCatalog = await tompGatewayService.getServiceCatalogFromTransportOperatorRequest();

      expect(mappedAssetsToServiceCatalog[0].vehicleDID).toBe('1')
      expect(mappedAssetsToServiceCatalog[1].vehicleDID).toBe('2')
      expect(tompGatewayService.requestAvailableAssets).toHaveBeenCalled();
      expect(tompGatewayService.requestOperatorPricingPlans).toHaveBeenCalled();
      expect(tompGatewayService.requestOperatorInformation).toHaveBeenCalled();
    });
  });
});
