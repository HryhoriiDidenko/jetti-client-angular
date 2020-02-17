import { DocumentBase, JDocument, Props, Ref } from './../document';

@JDocument({
  type: 'Catalog.Expense.Analytics',
  description: 'Аналитика расходов',
  icon: 'fa fa-list',
  menu: 'Аналитики расходов',
  prefix: 'EXP.A-'
})
export class CatalogExpenseAnalytics extends DocumentBase {

  @Props({ type: 'Catalog.Expense', hiddenInList: false, order: -1 })
  parent: Ref = null;

  @Props({ type: 'Catalog.BudgetItem' })
  BudgetItem: Ref = null;

}
