import { RegisterInfoDynamic } from './../../Dynamic/dynamic.prototype';
import { RegisterInfoMetadataProps } from './Metadata.Props';
import { RegisterInfoShareEmission } from './ShareEmission';
import { RegisterInfoCompanyPrice } from './CompanyPrice';
import { RegisterInfoRoyaltySales } from './RoyaltySales';
import { RegisterInfoDepartmentStatus } from './DepartmentStatus';
import { RegisterInfoHoliday } from './Holiday';
import { RegisterInfoCompanyResponsiblePersons } from './CompanyResponsiblePersons';
import { RegisterInfoRLSPeriod } from './RLS.Period';
import { RegisterInfoDepreciation } from './Depreciation';
import { RegisterInfoExchangeRates } from './ExchangeRates';
import { RegisterInfoPriceList } from './PriceList';
import { RegisterInfo } from './RegisterInfo';
import { RegisterInfoRLS } from './RLS';
import { RegisterInfoSettings } from './Settings';
import { RegisterInfoBudgetItemRule } from './BudgetItemRule';
import { DepartmentCompanyHistory } from './DepartmentCompanyHistory';
import { RegisterInfoCounterpartiePriceList } from './CounterpartiePriceList';
import { RegisterInfoSettlementsReconciliation } from './SettlementsReconciliation';
import { RegisterInfoMainSpecification } from './MainSpecification';
import { RegisterInfoIntercompanyHistory } from './IntercompanyHistory';
import { RegisterInfoIncomeDocumentRegistry } from './IncomeDocumentRegistry';
import { RegisterInfoLoanOwner } from './LoanOwner';
import { RegisterInfoEmployeeHistory } from './EmployeeHistory';
import { RegisterInfoExchangeRatesNational } from './ExchangeRates.National';
import { RegisterInfoMetadata } from './Metadata';

export type RegisterInfoTypes =
    'Register.Info.Dynamic' |
    'Register.Info.Metadata.Props' |
    'Register.Info.Metadata' |
    'Register.Info.Holiday' |
    'Register.Info.PriceList' |
    'Register.Info.SettlementsReconciliation' |
    'Register.Info.ExchangeRates' |
    'Register.Info.ExchangeRates.National' |
    'Register.Info.Settings' |
    'Register.Info.MainSpecification' |
    'Register.Info.Depreciation' |
    'Register.Info.RLS' |
    'Register.Info.RLS.Period' |
    'Register.Info.BudgetItemRule' |
    'Register.Info.DepartmentCompanyHistory' |
    'Register.Info.DepartmentStatus' |
    'Register.Info.CompanyResponsiblePersons' |
    'Register.Info.IntercompanyHistory' |
    'Register.Info.RoyaltySales' |
    'Register.Info.IncomeDocumentRegistry' |
    'Register.Info.CompanyPrice' |
    'Register.Info.ShareEmission' |
    'Register.Info.LoanOwner' |
    'Register.Info.EmployeeHistory' |
    'Register.Info.CounterpartiePriceList';

export type RegistersInfo =
    RegisterInfoDynamic |
    RegisterInfoMetadataProps |
    RegisterInfoMetadata |
    RegisterInfoHoliday |
    RegisterInfoPriceList |
    RegisterInfoDepartmentStatus |
    RegisterInfoRoyaltySales |
    RegisterInfoSettlementsReconciliation |
    RegisterInfoCompanyResponsiblePersons |
    RegisterInfoExchangeRates |
    RegisterInfoExchangeRatesNational |
    RegisterInfoDepreciation |
    RegisterInfoSettings |
    RegisterInfoMainSpecification |
    RegisterInfoIntercompanyHistory |
    RegisterInfoIncomeDocumentRegistry |
    RegisterInfoCompanyPrice |
    RegisterInfoShareEmission |
    RegisterInfoLoanOwner |
    RegisterInfoEmployeeHistory |
    RegisterInfoRLS;

export interface IRegisteredRegisterInfo {
    type: RegisterInfoTypes;
    Class: typeof RegisterInfo;
}

const RegisteredRegisterInfo: IRegisteredRegisterInfo[] = [
    { type: 'Register.Info.Dynamic', Class: RegisterInfoDynamic },
    { type: 'Register.Info.Metadata.Props', Class: RegisterInfoMetadataProps },
    { type: 'Register.Info.Metadata', Class: RegisterInfoMetadata },
    { type: 'Register.Info.Holiday', Class: RegisterInfoHoliday },
    { type: 'Register.Info.PriceList', Class: RegisterInfoPriceList },
    { type: 'Register.Info.SettlementsReconciliation', Class: RegisterInfoSettlementsReconciliation },
    { type: 'Register.Info.ExchangeRates', Class: RegisterInfoExchangeRates },
    { type: 'Register.Info.ExchangeRates.National', Class: RegisterInfoExchangeRatesNational },
    { type: 'Register.Info.MainSpecification', Class: RegisterInfoMainSpecification },
    { type: 'Register.Info.Settings', Class: RegisterInfoSettings },
    { type: 'Register.Info.Depreciation', Class: RegisterInfoDepreciation },
    { type: 'Register.Info.RLS.Period', Class: RegisterInfoRLSPeriod },
    { type: 'Register.Info.RLS', Class: RegisterInfoRLS },
    { type: 'Register.Info.BudgetItemRule', Class: RegisterInfoBudgetItemRule },
    { type: 'Register.Info.IntercompanyHistory', Class: RegisterInfoIntercompanyHistory },
    { type: 'Register.Info.DepartmentCompanyHistory', Class: DepartmentCompanyHistory },
    { type: 'Register.Info.DepartmentStatus', Class: RegisterInfoDepartmentStatus },
    { type: 'Register.Info.CounterpartiePriceList', Class: RegisterInfoCounterpartiePriceList },
    { type: 'Register.Info.CompanyResponsiblePersons', Class: RegisterInfoCompanyResponsiblePersons },
    { type: 'Register.Info.IncomeDocumentRegistry', Class: RegisterInfoIncomeDocumentRegistry },
    { type: 'Register.Info.CompanyPrice', Class: RegisterInfoCompanyPrice },
    { type: 'Register.Info.ShareEmission', Class: RegisterInfoShareEmission },
    { type: 'Register.Info.LoanOwner', Class: RegisterInfoLoanOwner },
    { type: 'Register.Info.RoyaltySales', Class: RegisterInfoRoyaltySales },
    { type: 'Register.Info.EmployeeHistory', Class: RegisterInfoEmployeeHistory },
];

export function createRegisterInfo<T extends RegisterInfo>(init: Partial<T>): T {
    const doc = RegisteredRegisterInfo.find(el => el.type === init.type);
    if (doc) return (new doc.Class(init) as T);
    else throw new Error(`createRegisterInfo: can't create type! ${init.type} is not registered`);
}

export function RegisterRegisterInfo(Register: IRegisteredRegisterInfo) {
    RegisteredRegisterInfo.push(Register);
}

export function GetRegisterInfo() {
    return RegisteredRegisterInfo;
}
