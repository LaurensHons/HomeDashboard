import { Component, Input } from '@angular/core';
import { AbstractComponent } from '../abstract.component';
import { CoreModule } from '../../core.module';
import { SafePipe } from '../../pipes/safe.pipe';

@Component({
  selector: 'app-website',
  standalone: true,
  imports: [CoreModule, SafePipe],
  templateUrl: './website.component.html',
  styleUrl: './website.component.scss',
})
export class WebsiteComponent implements AbstractComponent {
  @Input() config!: { [key: string]: any };
  get src(): string {
    return this.config['src'];
  }
}
