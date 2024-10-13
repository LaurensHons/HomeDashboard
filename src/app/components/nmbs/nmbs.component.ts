import { Component, ViewChild } from '@angular/core';
import { NMBSStation } from '../../../core/models/nmbs.models';
import { StationSelectComponent } from './station-select/station-select.component';
import { StateFacade } from '../../../core/state/state.facade';
import { StationLiveboardComponent } from './station-liveboard/station-liveboard.component';
import { CoreModule } from '../../core.module';
import { AbstractComponent } from '../abstract.component';

@Component({
  selector: 'app-nmbs',
  standalone: true,
  imports: [CoreModule, StationSelectComponent, StationLiveboardComponent],
  templateUrl: './nmbs.component.html',
  styleUrl: './nmbs.component.scss',
})
export class NmbsComponent extends AbstractComponent {
  stations$ = this.fac.stations$;
  activeNMBSSation: NMBSStation | undefined;

  @ViewChild('stationSelect') stationSelect!: StationSelectComponent;

  constructor(private fac: StateFacade) {
    super();
  }

  saveStation(station: NMBSStation) {
    this.stationSelect.saveFavorite(station);
  }
}
