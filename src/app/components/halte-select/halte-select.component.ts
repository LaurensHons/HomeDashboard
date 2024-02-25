import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreModule } from '../../core.module';
import { FormControl } from '@angular/forms';
import { debounceTime, first } from 'rxjs';
import { DLFunctionsService } from '../../../core/services/deLijn.functions.service';
import { Halte } from '../../../core/models/delijn.models';

@Component({
  selector: 'app-halte-select',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './halte-select.component.html',
  styleUrl: './halte-select.component.scss',
})
export class HalteSelectComponent implements OnInit {
  constructor(private delijnfunc: DLFunctionsService) {}

  searchForm = new FormControl('');

  @Input() activeHalte: Halte | undefined;
  @Output() activeHalteChange = new EventEmitter<Halte>();

  filteredOptions: Halte[] = [];

  ngOnInit(): void {
    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe((val) => {
      this.delijnfunc
        .searchHalte(val || '')
        .pipe(first())
        .subscribe((res) => {
          this.filteredOptions = res.haltes;
          console.log(res);
        });
    });
  }

  selectHalte(halte: Halte) {
    this.activeHalteChange.emit(halte);
    this.activeHalte = halte;
  }
}
