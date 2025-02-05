export class NMBSStation {
  '@id'!: string;
  id!: string;
  name!: string;
  locationX!: number;
  locationY!: number;
  standardname!: string;
  favorite = false;

  constructor(partial: Partial<NMBSStation>) {
    Object.assign(this, partial);
  }
}

export class NMBSDeparture {
  id!: string;
  delay!: number;
  station!: string;
  stationinfo!: NMBSStation;
  canceled!: boolean;
  platform!: string;
  time!: number;
  timeStamp!: Date;
  vehicle!: string;
  vehicleinfo!: NMBSTrain;
  direction!: string;
  stops?: NMBSStop[];

  constructor(partial: Partial<NMBSDeparture>) {
    Object.assign(this, partial);
    this.timeStamp = new Date(this.time * 1000);
    if (typeof partial.canceled === 'string')
      this.canceled = partial.canceled === '1';
  }
}

export class NMBSTrain {
  name!: string;
  shortname!: string;
  number!: string;
  type!: string;
  locationX!: number;
  locationY!: number;

  constructor(partial: Partial<NMBSTrain>) {
    Object.assign(this, partial);
  }
}

export class NMBSStop {
  id!: string;
  station!: string;
  stationinfo!: NMBSStation;
  scheduledArrivalTime!: number;
  scheduledArrivalTimeStamp!: Date;
  arrivalCanceled!: boolean;
  arrived!: boolean;
  scheduledDepartureTime!: number;
  arrivalDelay!: number;
  departureDelay!: number;
  departureCanceled!: boolean;
  left!: boolean;
  isExtraStop!: boolean;
  platform!: string;
  platforminfo!: {
    name: string;
    normal: string;
  };

  constructor(partial: Partial<NMBSStop>) {
    Object.assign(this, partial);
    if (typeof partial.arrivalCanceled === 'string')
      this.arrivalCanceled = partial.arrivalCanceled === '1';
    if (typeof partial.arrived === 'string')
      this.arrived = partial.arrived === '1';
    if (typeof partial.departureCanceled === 'string')
      this.departureCanceled = partial.departureCanceled === '1';
    if (typeof partial.left === 'string') this.left = partial.left === '1';
    if (typeof partial.isExtraStop === 'string')
      this.isExtraStop = partial.isExtraStop === '1';

    if (this.scheduledArrivalTime)
      this.scheduledArrivalTimeStamp = new Date(
        this.scheduledArrivalTime * 1000
      );
  }
}
