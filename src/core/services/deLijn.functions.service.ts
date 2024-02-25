import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, of } from 'rxjs';
import {
  NMBSDeparture,
  NMBSStation,
  NMBSStop,
  NMBSTrain,
} from '../models/nmbs.models';
import { secrets } from '../../secrets';
import { SearchHaltesResponse as SearchHalteResponse } from '../models/delijn.models';

@Injectable({
  providedIn: 'root',
})
export class DLFunctionsService {
  baseUrl = 'https://api.delijn.be';

  constructor(private httpClient: HttpClient) {}

  searchHalte(halte: string) {
    return this.httpClient
      .get<SearchHalteResponse>(
        `${this.baseUrl}/DLZoekOpenData/v1/zoek/haltes/${halte}?maxAantalHits=20`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': secrets.deLijn.apiKey,
          },
        }
      )
      .pipe(first());
  }
}
