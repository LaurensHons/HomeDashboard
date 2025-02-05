import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, of } from 'rxjs';
import {
  NMBSDeparture,
  NMBSStation,
  NMBSStop,
  NMBSTrain,
} from '../models/nmbs.models';

@Injectable({
  providedIn: 'root',
})
export class NMBSFunctionsService {
  baseUrl = 'https://api.irail.be';

  constructor(private httpClient: HttpClient) {}

  getAllStations() {
    return this.httpClient
      .get<{
        timestamp: string;
        version: string;
        station: NMBSStation[];
      }>(`${this.baseUrl}/stations/?format=json`)
      .pipe(
        first(),
        map((data) => data.station)
      );
  }

  getDeparturesAndArrivals(stationId: string) {
    return this.httpClient
      .get<{
        timestamp: string;
        version: string;
        stationinfo: NMBSStation;
        departures: {
          departure: NMBSDeparture[];
          count: string;
        };
      }>(`${this.baseUrl}/liveboard/?id=${stationId}&format=json`)
      .pipe(
        first(),
        map((data) => {
          return data.departures.departure.map(
            (departure) => new NMBSDeparture({ ...departure })
          );
        })
      );
  }

  getVehicle(vehicleid: string) {
    return this.httpClient
      .get<{
        timestamp: string;
        version: string;
        vehicle: string;
        vehicleInfo: NMBSStation;
        stops: {
          stop: NMBSStop[];
          count: string;
        };
      }>(`${this.baseUrl}/vehicle/?id=${vehicleid}&format=json`)
      .pipe(
        first(),
        map((data) => {
          return data.stops.stop.map((stop) => new NMBSStop({ ...stop }));
        })
      );
  }
}
