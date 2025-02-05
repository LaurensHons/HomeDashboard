import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuienRadarConfigComponent } from '../../components/buien-radar/buien-radar-config/buien-radar-config.component';
import { CoreModule } from '../../core.module';
import { PartTypes } from '../../part.types';
import { FormControl, FormGroup } from '@angular/forms';
import { Part } from '../grid/part.model';
import { Directionality } from '@angular/cdk/bidi';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-edit-part-popup',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './edit-part-popup.component.html',
  styleUrl: './edit-part-popup.component.scss',
})
export class EditPartPopupComponent {
  formGroup: FormGroup;

  types = PartTypes();

  constructor(
    private dashboard: DashboardService,
    private dialogRef: MatDialogRef<BuienRadarConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public part: Part
  ) {
    const controls = Object.keys(part.config).reduce(
      (dict, c) => ({ ...dict, [c]: new FormControl(part.config[c]) }),
      {} as { [key: string]: FormControl }
    );
    this.formGroup = new FormGroup(controls);
    dialogRef.beforeClosed().subscribe(() => this.save());
  }

  save() {
    const config = this.formGroup.value;
    this.dashboard.partList = this.dashboard.partList.map((p) =>
      p.id === this.part.id ? new Part({ ...p, config: config }) : p
    );
  }

  close() {
    this.save();
    this.dialogRef.close();
  }
}
