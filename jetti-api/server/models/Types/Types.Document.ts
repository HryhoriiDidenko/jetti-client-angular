import { RegisteredDocument } from '../documents.factory';
import { TypesBase } from './TypesBase';
import { Type } from '../type';

export class TypesDocument extends TypesBase {

  getTypes() {
    return RegisteredDocument()
      .filter(d => Type.isDocument(d.type))
      .map(e => e.type);
  }
}
