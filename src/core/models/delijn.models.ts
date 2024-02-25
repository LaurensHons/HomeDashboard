export class SearchHaltesResponse {
  aantalHits!: number;
  haltes!: Halte[];
}

export class Halte {
  entiteitnummer!: string;
  haltenummer!: string;
  omschrijving!: string;
  omschrijvingLang!: string;
  gemeentenummer!: number;
  omschrijvingGemeente!: string;
  districtCode!: string;
  geoCoordinaat!: string;
  halteToegankelijkheden!: string;
  hoofdHalte!: boolean;
  taal!: string;
  links!: {
    rel: string;
    url: string;
  }[];
}
