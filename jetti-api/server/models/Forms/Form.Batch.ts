import { FormBase, JForm } from './form';
import { Props, Ref } from '../document';

@JForm({
  type: 'Form.Batch',
  description: 'Batch',
  icon: 'fa fa-money',
  menu: 'Batch',
})
export class FormBatch extends FormBase {

  @Props({ type: 'Catalog.Company', order: 1, required: true })
  company: Ref = null;

/*   @Props({ type: 'date', order: 3, required: true })
  StartDate = new Date();

  @Props({ type: 'date', order: 4, required: true })
  EndDate = new Date(); */
}

