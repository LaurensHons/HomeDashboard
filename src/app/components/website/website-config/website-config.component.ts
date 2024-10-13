import { Component, Input } from '@angular/core';
import { AbstractConfigComponent } from '../../abstract.config.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../../core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-website-config',
  standalone: true,
  imports: [
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './website-config.component.html',
  styleUrl: './website-config.component.scss',
})
export class WebsiteConfigComponent implements AbstractConfigComponent {
  @Input() formGroup!: FormGroup<any>;
}
