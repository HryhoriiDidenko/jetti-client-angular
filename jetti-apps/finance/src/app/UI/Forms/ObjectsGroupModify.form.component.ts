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
  clientDataStorage = '';

  get Mode() { return this.form.get('Mode').value; }
  get isModeLoad() { return this.Mode === 'LOAD'; }
  get isModeModify() { return this.Mode === 'MODIFY'; }
  get isModeTesting() { return this.Mode === 'TESTING'; }

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

  PasteTable() {
    const pastedValue = this.form.get('Text').value as string;
    if (!pastedValue) this.throwError('!', 'Не задан текст');
    const sep = this.getSeparators();
    const rows = pastedValue.split(sep.rows);
    if (!rows.length) this.throwError('!', 'Не найден разделитель строк');
    const cols = rows[0].split(sep.columns);
    if (!cols.length) this.throwError('!', 'Не найден разделитель колонок');
  }

  getSeparators(): { rows: string, columns: string } {
    return { rows: this.form.get('RowsSeparator').value || '\n', columns: this.form.get('ColumnsSeparator').value || '\t' };
  }
  async matchColumnsByName() {
    await this.ExecuteServerMethod('matchColumnsByName');
  }

  async prepareToLoading() {
    await this.ExecuteServerMethod('prepareToLoading');
  }

  async fillLoadingTable() {
    await this.ExecuteServerMethod('fillLoadingTable');
  }

  async loadToTempTable() {
    await this.ExecuteServerMethod('loadToTempTable');
  }

  async saveDataIntoDB() {
    await this.ExecuteServerMethod('saveDataIntoDB');
  }

  async buildFilter() {
    await this.ExecuteServerMethod('buildFilter');
  }

  async createFilterElements() {
    await this.ExecuteServerMethod('createFilterElements');
  }

  async selectFilter() {
    await this.ExecuteServerMethod('selectFilter');
  }

  async callLibMethod() {
    const f = this.form;
    const res = await this.ds.api.callLibMethod(f.get('LibId').value, f.get('MethodName').value, JSON.parse(f.get('ArgsJSON').value));
    f.get('CallResult').setValue(res);
  }

  async addAttachment() {
    // const f = this.form;
    // const res = await this.ds.api.attachmentCommand(f.get('LibId').value, f.get('MethodName').value, JSON.parse(f.get('ArgsJSON').value));
    // f.get('CallResult').setValue(res);
  }

  async delAttachment() {
    // const f = this.form;
    // const res = await this.ds.api.callLibMethod(f.get('LibId').value, f.get('MethodName').value, JSON.parse(f.get('ArgsJSON').value));
    // f.get('CallResult').setValue(res);
  }

  async ReadRecieverStructure() {
    await this.ExecuteServerMethod('ReadRecieverStructure');
    return;
    const Operation = this.form.get('Operation');
    const queryParams: { [key: string]: any } = {};
    let type = '';
    if (Operation && Operation.value && Operation.value.value) {
      type = 'Document.Operation';
      queryParams.Operation = Operation.value.id;
    } else {
      const typeControl = this.form.get('Catalog');
      if (typeControl && typeControl.value && typeControl.value.id) type = typeControl.value.id;
    }
    if (!type) this.throwError('!', 'Не задан тип приемника');
    this.ds.api.getViewModel(type, '', queryParams).pipe(take(1)).subscribe(vm => {
      console.log(vm);
    });
  }

  async ExecuteServerMethod(methodName: string) {

    this.clientDataStorage = this.form.get('Text').value;
    this.ds.api.execute(this.type as FormTypes, methodName, this.form.getRawValue() as FormBase).pipe(take(1))
      .subscribe(value => {
        const form = getFormGroup(value.schema, value.model, true);
        form['metadata'] = value.metadata;
        super.Next(form);
        this.form.get('Text').setValue(this.clientDataStorage);
        this.form.markAsDirty();
      });
  }
}

