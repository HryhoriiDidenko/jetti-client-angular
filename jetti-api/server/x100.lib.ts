import { x100DATA_POOL } from './sql.pool.x100-DATA';
import { Ref } from './models/document';
import { MSSQL } from './mssql';
import { EXCHANGE_POOL } from './sql.pool.exchange';
import { lib } from './std.lib';
import { BankStatementUnloader } from './fuctions/BankStatementUnloader';

export interface Ix100Lib {
  account: {
  };
  register: {
  };
  doc: {
  };
  info: {
    companyByDepartment: (department: Ref, date: Date, tx: MSSQL) => Promise<Ref | null>
  };
  util: {
    salaryCompanyByCompany: (company: Ref, tx: MSSQL) => Promise<string | null>
    bankStatementUnloadById: (docsID: string[], tx: MSSQL) => Promise<string>,
    closeMonthErrors: (company: Ref, date: Date, tx: MSSQL) => Promise<{ Storehouse: Ref; SKU: Ref; Cost: number }[] | null>,
    exchangeDB: () => MSSQL,
    x100DataDB: () => MSSQL
  };
}

export const x100: Ix100Lib = {
  account: {
  },
  register: {
  },
  doc: {
  },
  info: {
    companyByDepartment
  },
  util: {
    salaryCompanyByCompany,
    bankStatementUnloadById,
    closeMonthErrors,
    exchangeDB,
    x100DataDB
  }
};

async function bankStatementUnloadById(docsID: string[], tx: MSSQL): Promise<string> {
  return await BankStatementUnloader.getBankStatementAsString(docsID, tx);
}

async function salaryCompanyByCompany(company: Ref, tx: MSSQL): Promise<string | null> {
  if (!company) return null;
  const CompanyParentId = await lib.doc.Ancestors(company, tx, 1);
  let CodeCompanySalary = '';
  switch (CompanyParentId) {
    case 'E5850830-02D2-11EA-A524-E592E08C23A5':
      CodeCompanySalary = 'SALARY-RUSSIA';
      break;
    case 'FE302460-0489-11EA-941F-EBDB19162587':
      CodeCompanySalary = 'SALARY-UKRAINE';
      break;
    case '7585EDB0-3626-11EA-A819-EB0BBE912314':
      CodeCompanySalary = 'SALARY-CRAUD';
      break;
    case '9C226AA0-FAFA-11E9-B75B-A35013C043AE':
      CodeCompanySalary = 'SALARY-KAZAKHSTAN';
      break;
    default:
  }
  return await lib.doc.byCode('Catalog.Company', CodeCompanySalary, tx);
}

async function companyByDepartment(department: Ref, date = new Date(), tx: MSSQL): Promise<Ref | null> {
  let result: Ref | null = null;
  const queryText = `
    SELECT TOP 1 company FROM [Register.Info.DepartmentCompanyHistory] WITH (NOEXPAND)
    WHERE (1=1)
      AND date <= @p1
      AND Department = @p2
    ORDER BY date DESC`;
  const res = await tx.oneOrNone<{ company: string }>(queryText, [date, department]);
  if (res) result = res.company;
  return result;
}

async function closeMonthErrors(company: Ref, date: Date, tx: MSSQL) {
  const result = await tx.manyOrNone<{ Storehouse: Ref, SKU: Ref, Cost: number }>(`
    SELECT q.*, Storehouse.Department Department FROM (
      SELECT Storehouse, SKU, SUM([Cost]) [Cost]
      FROM [dbo].[Register.Accumulation.Inventory] r
      WHERE date < DATEADD(DAY, 1, EOMONTH(@p1)) AND company = @p2
      GROUP BY Storehouse, SKU
      HAVING SUM([Qty]) = 0 AND SUM([Cost]) <> 0) q
    LEFT JOIN [Catalog.Storehouse.v] Storehouse WITH (NOEXPAND) ON Storehouse.id = q.Storehouse`, [date, company]);
  return result;
}

function exchangeDB() {
  return new MSSQL(EXCHANGE_POOL);
}

function x100DataDB() {
  return new MSSQL(x100DATA_POOL);
}