import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  NMBSDeparture,
  NMBSStation,
  NMBSStop,
} from '../../../core/models/nmbs.models';
import { CoreModule } from '../../core.module';
import { NMBSFunctionsService } from '../../../core/services/nmbs.functions.service';
import { catchError, first, of } from 'rxjs';
import { LineTimelineComponent } from './line-timeline/line-timeline.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-station-liveboard',
  standalone: true,
  imports: [CoreModule, LineTimelineComponent],
  templateUrl: './station-liveboard.component.html',
  styleUrl: './station-liveboard.component.scss',
})
export class StationLiveboardComponent implements OnInit, OnChanges {
  @Input() station: NMBSStation | undefined;

  @Output() saveStation = new EventEmitter<NMBSStation>();

  tabs: { label: string; value: string }[] = [];
  activeTab: { label?: string; value?: string } = {
    label: 'All',
    value: 'All',
  };
  data: NMBSDeparture[] | undefined;
  active: NMBSDeparture[] | undefined;

  loadingLiveboard = false;
  loadingRoute = false;
  routeNotFound = false;

  stops?: NMBSStop[];

  constructor(private nmbsFunc: NMBSFunctionsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const hasChanges = (key: string, init: boolean) => {
      return (
        (changes[key] &&
          changes[key].currentValue !== changes[key].previousValue) ||
        (init && changes[key].firstChange)
      );
    };

    if (hasChanges('station', true) && !!this.station?.id) {
      this.loadingLiveboard = true;
      this.data = undefined;
      this.nmbsFunc.getDeparturesAndArrivals(this.station.id).subscribe(
        (data) => {
          this.data = data;
          this.configureTabs(data);
          this.loadingLiveboard = false;
          console.log(data);
        },
        (err) => {
          console.log(err);
          this.loadingLiveboard = false;
        }
      );
    }
  }

  tabChange(tab: { value?: string; label?: string }) {
    this.activeTab = tab;
    if (tab.value === 'All') {
      this.active = this.data;
    } else {
      this.active = this.data?.filter((d) => d.platform === tab.value);
    }
  }

  configureTabs(departures: NMBSDeparture[]) {
    this.tabs = [
      { label: 'All', value: 'All' },
      ...[...new Set(departures.map((dep) => dep.platform))]
        .sort()
        .map((p) => ({
          label: p,
          value: p,
        })),
    ];
    this.tabChange(this.tabs[0]);
  }

  saveStationClick() {
    this.saveStation.emit(this.station);
  }

  selectRoute(departure: NMBSDeparture) {
    this.loadingRoute = true;
    this.nmbsFunc
      .getVehicle(departure.vehicleinfo.name)
      .pipe(
        first(),
        catchError((err) => {
          this.loadingRoute = false;
          this.routeNotFound = true;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.stops = data;
        this.loadingRoute = false;
        if (data.length > 0) this.routeNotFound = false;
      });
  }

  ngOnInit(): void {}
}
