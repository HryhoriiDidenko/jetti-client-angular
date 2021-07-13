import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import { DocumentBase, RegisterAccumulation } from '@x100group/jetti-middle/dist';
import { ApiService } from '../services/api.service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'j-transformed-register-movements',
  templateUrl: './transformed.register.movements.component.html'
})
export class TransformedRegisterMovementsComponent implements OnInit {

  @Input() register: string;
  @Input() doc: DocumentBase;
  movements$: Observable<RegisterAccumulation[]>;
  additionalColumns$: Observable<string[]>;
  selection: RegisterAccumulation | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.movements$ = this.apiService.getDocTransformedMovements(this.doc.id).pipe(share());
    this.additionalColumns$ = this.movements$.pipe(filter(data => data && !!data.length),
      map(data => Object.keys(data[0])
        .filter(el => ['date', 'kind', 'company', 'document', 'calculated', 'id', 'parent', 'exchangeRate']
          .findIndex(e => e === el) === -1)), share());
  }

  isNumbert(value): boolean {
    return Number.parseInt(value, 0) * 0 === 0;
  }

}
