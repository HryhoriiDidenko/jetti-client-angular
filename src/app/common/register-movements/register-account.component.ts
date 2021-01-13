import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { DocumentBase } from 'src/common/models/document';
import { AccountRegister } from 'src/common/register-account';
import { ApiService } from '../../services/api.service';
import { DocService } from '../doc.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'j-register-account',
  styleUrls: ['./register-account.component.scss'],
  templateUrl: './register-account.component.html',
})
export class RegisterAccountMovementsComponent implements OnInit {

  movements$: Observable<AccountRegister[]>;
  selection: AccountRegister | null = null;
  @Input() doc: DocumentBase;

  constructor(private api: ApiService, private ds: DocService) { }

  ngOnInit() {
    this.movements$ = merge(...[
      this.ds.save$,
      this.ds.delete$,
      this.ds.post$,
      this.ds.do$]
    ).pipe(startWith(this.doc),
      filter(doc => doc.id === this.doc.id),
      switchMap(doc => this.api.getDocAccountMovementsView(this.doc.id)));
  }
}
