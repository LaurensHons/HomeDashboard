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
export class BRFunctionsService {
  baseUrl = 'http://gpsgadget.buienradar.nl';

  constructor(private httpClient: HttpClient) {}

  getRadarInfo(lat: number, lon: number) {
    return this.httpClient
      .get(`${this.baseUrl}/data/raintext?lat=${lat}&lon=${lon}`, {
        responseType: 'text',
      })
      .pipe(first());
  }
}
