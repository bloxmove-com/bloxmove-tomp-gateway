import { Controller, Get, Post, Body } from '@nestjs/common';
import { TompGatewayService } from './tomp-gateway.service';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateBookingRequest } from 'src/common/classes/create-booking-request.class';
import { ConfirmBookingRequest } from 'src/common/classes/confirm-booking-request.class';
import { EndBookingRequest } from 'src/common/classes/end-booking-request.class';
import { ChangeDoorStatusRequest } from 'src/common/classes/change-door-status-request.class';
import { IServiceCatalogEntry } from 'src/common/interfaces/interfaces';
import { UsageData } from 'src/common/classes/usage-data.class';
import { ServiceCatalog } from 'src/common/classes/service-catalog.class';
import { VehicleContractData } from 'src/common/classes/vehicle-contract-data.class';

@Controller('/')
export class TompGatewayController {
  constructor(private readonly tompGatewayService: TompGatewayService) {}

  @Post('/create-booking')
  @ApiOperation({
    description:
      'Create a booking at the transport operator for a specific asset',
  })
  @ApiCreatedResponse({
    description:
      'Returns bloXmove specific vehicle contract data for the tomp booking. Tomp booking is in the state "PENDING"',
    type: VehicleContractData,
  })
  async createBooking(
    @Body() createBookingRequest: CreateBookingRequest
  ): Promise<VehicleContractData> {
    return this.tompGatewayService.createBooking(createBookingRequest.assetId);
  }

  @Post('/confirm-booking')
  @ApiOperation({
    description:
      'Confirm a booking at the transport operator by providing the booking-id',
  })
  @ApiCreatedResponse({
    description: 'OK, Tomp booking is in the state "CONFIRMED"',
  })
  async confirmBooking(@Body() confirmBookingRequest: ConfirmBookingRequest) {
    return this.tompGatewayService.confirmBooking(
      confirmBookingRequest.bookingId
    );
  }

  @Post('/change-door-status')
  @ApiOperation({
    description:
      'Change door status at the transport operator by providing the booking-id + bloXmove door state (OPEN or CLOSED)',
  })
  @ApiCreatedResponse({
    description: 'OK, Tomp leg was either set "IN_USE" or "PAUSED"',
  })
  async changeDoorStatus(
    @Body() changeDoorStatusRequest: ChangeDoorStatusRequest
  ) {
    return this.tompGatewayService.changeDoorStatus(
      changeDoorStatusRequest.bookingId,
      changeDoorStatusRequest.doorStatus
    );
  }

  @Post('/end-booking')
  @ApiOperation({
    description:
      'End a booking at the transport operator by providing the booking-id',
  })
  @ApiCreatedResponse({
    description:
      'Returns the usage data of the tomp-trip, mapped to the bloXmove data model',
    type: UsageData,
  })
  async endBooking(
    @Body() confirmBookingRequest: EndBookingRequest
  ): Promise<UsageData> {
    return this.tompGatewayService.endBooking(confirmBookingRequest.bookingId);
  }

  @Get('/service-catalog')
  @ApiOperation({
    description: 'Get all available assets of the transport operator',
  })
  @ApiOkResponse({
    description:
      'Returns a list of all available services of the transport operator, mapped to the bloXmove data model',
    type: ServiceCatalog,
    isArray: true,
  })
  async requestServiceCatalog(): Promise<IServiceCatalogEntry[]> {
    return this.tompGatewayService.getServiceCatalogFromTransportOperatorRequest();
  }
}
