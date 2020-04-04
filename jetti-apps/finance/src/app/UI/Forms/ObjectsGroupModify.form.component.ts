import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { _baseDocFormComponent } from 'src/app/common/form/_base.form.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DocService } from 'src/app/common/doc.service';
import { TabsStore } from 'src/app/common/tabcontroller/tabs.store';
import { DynamicFormService, getFormGroup } from 'src/app/common/dynamic-form/dynamic-form.service';
import { LoadingService } from 'src/app/common/loading.service';
import { FormBase } from '../../../../../../jetti-api/server/models/Forms/form';
import { take } from 'rxjs/operators';
import { FormTypes } from '../../../../../../jetti-api/server/models/Forms/form.types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'j-objects-group-modify',
  templateUrl: './ObjectsGroupModify.form.component.html'
})
export class ObjectsGroupModifyComponent extends _baseDocFormComponent implements OnInit, OnDestroy {

  onlyViewMode = false;
  header = 'Objects group modify';

  constructor(
    public router: Router, public route: ActivatedRoute, public auth: AuthService,
    public ds: DocService, public tabStore: TabsStore, public dss: DynamicFormService,
    public lds: LoadingService, public cd: ChangeDetectorRef) {
    super(router, route, auth, ds, tabStore, dss, cd);
  }

  ngOnInit() {
    super.ngOnInit();
    const id = this.route.snapshot.params.id;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }


  close() {
    this.form.markAsPristine();
    super.close();
  }

  async ExecuteServerMethod(methodName: string) {

    this.ds.api.execute(this.type as FormTypes, methodName, this.form.getRawValue() as FormBase).pipe(take(1))
      .subscribe(value => {
        const form = getFormGroup(value.schema, value.model, true);
        form['metadata'] = value.metadata;
        super.Next(form);
        this.form.markAsDirty();
      });
  }
}

