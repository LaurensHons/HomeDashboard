import { Component, Input, ViewChild } from '@angular/core';
import { StationSelectComponent } from './station-select/station-select.component';
import { StationLiveboardComponent } from './station-liveboard/station-liveboard.component';
import { CoreModule } from '../../core.module';
import { AbstractComponent } from '../abstract.component';
import { NMBSStation } from '../../core/models/nmbs.models';
import { StateFacade } from '../../core/state/state.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nmbs',
  standalone: true,
  imports: [CoreModule, StationSelectComponent, StationLiveboardComponent],
  templateUrl: './nmbs.component.html',
  styleUrl: './nmbs.component.scss',
})
export class NmbsComponent implements AbstractComponent {
  constructor(private fac: StateFacade) {
    this.stations$ = this.fac.stations$;
  }

  stations$: Observable<NMBSStation[]>;
  activeNMBSSation: NMBSStation | undefined;

  @Input() config!: { [key: string]: any };
  @ViewChild('stationSelect') stationSelect!: StationSelectComponent;

  saveStation(station: NMBSStation) {
    this.stationSelect.saveFavorite(station);
  }
}
