import { Component, OnInit, ViewChild } from '@angular/core';
import { StateFacade } from '../../core/state/state.facade';
import { CoreModule } from '../core.module';
import { StationSelectComponent } from '../components/station-select/station-select.component';
import { NMBSStation } from '../../core/models/nmbs.models';
import { StationLiveboardComponent } from '../components/station-liveboard/station-liveboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CoreModule, StationSelectComponent, StationLiveboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  stations$ = this.fac.stations$;
  activeNMBSSation: NMBSStation | undefined;

  @ViewChild('stationSelect') stationSelect!: StationSelectComponent;

  constructor(private fac: StateFacade) {}
  ngOnInit(): void {}

  onStationChange(station: NMBSStation) {
    console.log(station);
  }

  saveStation(station: NMBSStation) {
    this.stationSelect.saveFavorite(station);
  }
}
