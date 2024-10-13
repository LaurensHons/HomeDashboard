import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractConfigComponent } from '../../abstract.config.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreModule } from '../../../core.module';
import { MatButton } from '@angular/material/button';
import { Part } from '../../../layout/grid/part.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-buien-radar-config',
  standalone: true,
  imports: [
    CoreModule,
    MatButton,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  templateUrl: './buien-radar-config.component.html',
  styleUrl: './buien-radar-config.component.scss',
})
export class BuienRadarConfigComponent
  implements OnInit, AbstractConfigComponent
{
  constructor(
    private dialogRef: MatDialogRef<BuienRadarConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Part
  ) {}

  @Input() formGroup!: FormGroup;

  get IsautomaticLocationEnabled(): boolean {
    return this.formGroup.value.automaticLocationEnabled;
  }

  ngOnInit(): void {
    console.log(this.formGroup);
  }

  resetLonLat() {
    if (this.formGroup.value.automaticLocationEnabled) {
      this.formGroup.controls['lon'].setValue(0);
      this.formGroup.controls['lat'].setValue(0);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
