import { components } from '../common/interfaces/tomp-generated-interfaces';
import { IServiceCatalogEntry } from 'src/common/interfaces/interfaces';
type AssetType = components['schemas']['assetType'];
type Booking = components['schemas']['booking'];
type Planning = components['schemas']['planning'];
type Leg = components['schemas']['leg'];
type JournalEntry = components['schemas']['journalEntry'];
type SystemInformation = components['schemas']['systemInformation'];
type SystemPricingPlan = components['schemas']['systemPricingPlan'];

export const leg: Leg = {
  id: '2de3fd01-be0b-4eb2-b06f-c712ae7e718a',
  from: {
    coordinates: {
      lng: 6.657715,
      lat: 52.627297,
    },
  },
  to: {
    coordinates: {
      lng: 6.883315,
      lat: 52.857297,
    },
  },
  departureTime: '2021-09-15T13:49:37.666+02:00',
  assetType: {
    id: 'd',
    assetClass: 'CAR',
    sharedProperties: {},
  },
  asset: {
    id: '<VIN_Of_Asset>',
    overriddenProperties: {},
  },
  pricing: {
    estimated: false,
    parts: [
      {
        amount: 0.5,
        currencyCode: 'EUR',
        vatRate: 21,
        type: 'FLEX',
        unitType: 'MINUTE',
      },
    ],
  },
  suboperator: {
    name: 'name',
    maasId: 'd52bfad0-ee4b-4f72-9f38-efce115ffb49',
  },
  conditions: [
    {
      conditionType: 'conditionRequireBookingData',
      id: 'minAge18',
    },
    {
      conditionType: 'conditionRequireBookingData',
      id: 'driverLicense',
    },
  ],
  state: 'IN_USE',
};

export const journalEntries: JournalEntry[] = [
  {
    amount: 4.76,
    amountExVat: 4,
    currencyCode: 'EUR',
    vatRate: 19,
    vatCountryCode: 'DE',
    journalId: '1df314ad-0c9a-446b-85af-5752b75653f7',
    state: 'TO_INVOICE',
    comment: 'Invoice1 for your tomp trip',
    usedTime: 15,
    distance: 150,
    distanceType: 'KM',
  },
  {
    amount: 2,
    amountExVat: 4,
    currencyCode: 'EUR',
    vatRate: 19,
    vatCountryCode: 'DE',
    journalId: '1df314ad-0c9a-446b-85af-5752b75653f7',
    state: 'TO_INVOICE',
    comment: 'Invoice2 for your tomp trip',
    usedTime: 15,
    distance: 50,
    distanceType: 'MILE',
  },
];

export const availableAssets: AssetType[] = [
  {
    sharedProperties: {},
    id: 'dev',
    nrAvailable: 3,
    assets: [
      {
        id: '1',
        overriddenProperties: {
          location: {
            coordinates: {
              lng: 9.993682,
              lat: 53.551086,
            },
          },
          fuel: 'GASOLINE',
          brand: 'Audi',
          model: 'R8',
          gearbox: 'AUTOMATIC',
          image:
            'https://mediaservice.audi.com/media/live/50900/fly1400x601n8/4sp/2021.png?wid=550&output-format=webp',
          persons: 5,
          stateOfCharge: 100,
          meta: {
            pricingPlanId: '100',
            requiredUserClaims: ['minAge18', 'driverLicense'],
            numberOfDoors: 5,
            licensePlate: 'HH-AA-2021',
            mileage: 19000,
          },
        },
      },
      {
        id: '2',
        overriddenProperties: {
          location: {
            coordinates: {
              lng: 9.592168,
              lat: 53.34917,
            },
          },
          fuel: 'GASOLINE',
          brand: 'Audi',
          model: 'A5',
          gearbox: 'AUTOMATIC',
          image:
            'https://mediaservice.audi.com/media/live/50900/fly1400x601n8/f5p/2021.png?wid=550&output-format=webp',
          persons: 5,
          stateOfCharge: 70,
          meta: {
            pricingPlanId: '100',
            requiredUserClaims: ['minAge18', 'driverLicense'],
            numberOfDoors: 5,
            licensePlate: 'HH-BB-2021',
            mileage: 12000,
          },
        },
      },
    ],
    assetClass: 'CAR',
  },
];

export const planning: Planning = {
  validUntil: '',
  options: [
    {
      id: 'a7e3c16c-aaa0-4c47-ac21-ca699f643771',
      state: 'NEW',
      legs: [
        {
          id: 'a7e3c16c-aaa0-4c47-ac21-ca699f643771',
          from: {
            coordinates: {
              lng: 6.657715,
              lat: 52.627297,
            },
          },
          assetType: {
            sharedProperties: {},
            id: 'id',
            assetClass: 'CAR',
          },
          asset: {
            overriddenProperties: {},
            id: '<VIN_Of_Asset>',
          },
          pricing: {
            estimated: false,
            parts: [
              {
                amount: 0.5,
                currencyCode: 'EUR',
                vatRate: 21,
                type: 'FLEX',
                unitType: 'MINUTE',
              },
            ],
          },
          conditions: [
            {
              conditionType: 'conditionRequireBookingData',
              id: 'minAge18',
            },
            {
              conditionType: 'conditionRequireBookingData',
              id: 'driverLicense',
            },
          ],
        },
      ],
    },
  ],
};

export const booking: Booking = {
  id: 'a7e3c16c-aaa0-4c47-ac21-ca699f643771',
  state: 'PENDING',
  legs: [
    {
      id: 'a7e3c16c-aaa0-4c47-ac21-ca699f643771',
      from: {
        coordinates: {
          lng: 6.657715,
          lat: 52.627297,
        },
      },
      assetType: {
        sharedProperties: {},
        id: 'id',
        assetClass: 'CAR',
      },
      asset: {
        overriddenProperties: {},
        id: '<VIN_Of_Asset>',
      },
      pricing: {
        estimated: false,
        parts: [
          {
            amount: 0.5,
            currencyCode: 'EUR',
            vatRate: 21,
            type: 'FLEX',
            unitType: 'MINUTE',
          },
        ],
      },
      conditions: [
        {
          conditionType: 'conditionRequireBookingData',
          id: 'minAge18',
        },
        {
          conditionType: 'conditionRequireBookingData',
          id: 'driverLicense',
        },
      ],
    },
  ],
};

export const operatorInformation: SystemInformation = {
  systemId: 'maas-car-3342',
  language: ['nl'],
  name: 'Car Operator',
  timezone: 'DE',
  typeOfSystem: 'FREE_FLOATING',
  email: 'email@caroperator.org',
  conditions: 'Terms and conditions of car transport operator...',
};

export const operatorPricingPlans: SystemPricingPlan[] = [
  {
    planId: '200',
    name: 'Pricing Plan KM',
    fare: {
      estimated: false,
      parts: [
        {
          vatRate: 19,
          amount: 0.7,
          currencyCode: 'EUR',
          type: 'FLEX',
          unitType: 'KM',
        },
      ],
    },
    isTaxable: true,
    description: 'Pricing plan for kilometers',
  },
  {
    planId: '100',
    name: 'Pricing Plan Min',
    fare: {
      estimated: false,
      parts: [
        {
          vatRate: 19,
          amount: 0.5,
          currencyCode: 'EUR',
          type: 'FLEX',
          unitType: 'MINUTE',
        },
      ],
    },
    isTaxable: true,
    description: 'Pricing plan for minutes',
  },
];

export const serviceCatalog: IServiceCatalogEntry[] = [
  {
    servicePackages: [
      {
        packageId: 1,
        packageName: 'packageName',
        description: 'description',
        pricePerMinute: 0.5,
        validityPeriods: [
          {
            from: 1583193600,
            to: 16756675200,
          },
        ],
        termsConditions: 'terms',
        requiredUserClaims: ['minAge18', 'driverLicense'],
        pricePerKm: 0,
        requiredBusinessClaims: [],
        currency: 'EUR',
      },
    ],
    status: {
      vin: 'vin',
      latestTelematicsRecord: {
        vin: 'vin',
        deviceId: '',
        data: {
          timestamp: null,
          locLat: 0.0,
          locLong: 0.0,
          mileage: 0.0,
          fuelLevel: 0.0,
          isDoorOpened: false,
        },
        deviceSignature: '',
      },
    },
    vin: 'vin',
    brand: 'brand',
    model: 'model',
    fuelType: 'fuelType',
    numberOfDoors: 5,
    numberOfSeats: 5,
    transmission: 'transmission',
    licensePlate: 'plate',
    imageUrl: 'url',
  },
];
