import { FormBase } from './form';
import { FormTypes } from './form.types';
import FormPostServer from './Form.Post.server';
import FormBatchServer from './Form.Batch.server';
import { dateReviverUTC } from '../../fuctions/dateReviver';
import PostAfterEchangeServer from './Form.PostAfterEchange.server';

export interface IServerForm {
  Execute (): Promise<FormBase>;
}

export type FormBaseServer = FormBase & IServerForm;

export function createFormServer<T extends FormBaseServer>(init?: Partial<FormBase>) {
  if (init && init.type) {
    const doc = RegisteredServerForms.get(init.type);
    if (doc) {
      const result = <T>new doc(init.user!);
      Object.assign(result, JSON.parse(JSON.stringify(init), dateReviverUTC));
      return result;
    }
  }
  throw new Error(`createFormServer: FORM type ${init!.type} is not registered`);
}

const RegisteredServerForms = new Map<FormTypes, typeof FormBase>([
  ['Form.Post', FormPostServer],
  ['Form.Batch', FormBatchServer],
  ['Form.PostAfterEchange', PostAfterEchangeServer]
]);
