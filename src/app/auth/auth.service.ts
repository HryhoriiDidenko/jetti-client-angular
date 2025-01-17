import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { BehaviorSubject } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { IAccount, ILoginResponse } from '@x100group/jetti-middle/dist';
export const ANONYMOUS_USER: ILoginResponse = { account: undefined, token: '', photo: undefined };

@Injectable()
export class AuthService {

  private readonly _userProfile$ = new BehaviorSubject<ILoginResponse | undefined>(undefined);
  userProfile$ = this._userProfile$.asObservable().pipe(filter((u: ILoginResponse) => !!u));
  isLoggedIn$ = this.userProfile$.pipe(map(p => p.account !== undefined));
  isLoggedOut$ = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));

  isAdmin$ = this.userProfile$.pipe(map(u => u.account.isAdmin));
  userRoles$ = this.userProfile$.pipe(map(u => u.account.roles));
  get userProfile() { return this._userProfile$.value; }
  get userEmail() { return this.tokenPayload ? this.tokenPayload['email'] : ''; }
  get token() { return localStorage.getItem('jetti_token') || ''; }
  set token(value) { localStorage.setItem('jetti_token', value); }
  get tokenPayload() { return jwt_decode<JwtPayload>(this.token); }

  constructor(private router: Router, private http: HttpClient, private msalService: MsalService) { }

  public async login() {
    await this.msalService.loginPopup({ scopes: ['user.read'] });
    const user = this.msalService.getAccount().userName;
    const acquireTokenSilentResult = await this.msalService.acquireTokenSilent({ scopes: ['user.read'] });

    return this.http.post<ILoginResponse>(`${environment.auth}login`,
      { email: user, password: null, token: acquireTokenSilentResult.accessToken }).pipe(
        shareReplay(),
        tap(loginResponse => this.init(loginResponse))
      );
  }

  public logout() {
    localStorage.removeItem('jetti_token');
    const account = this.msalService.getAccount();
    if (account) this.msalService.logout();
    this._userProfile$.next({ ...ANONYMOUS_USER });
    return this.router.navigate([''], { queryParams: {} });
  }

  public getAccount() {
    return this.http.get<IAccount>(`${environment.auth}account`).pipe(
      tap(account => {
        const LoginResponse: ILoginResponse = { account, token: this.token, photo: null };
        this.init(LoginResponse);
      }));
  }

  public isRoleAvailable(roleName: string): boolean {
    if (!this.token) return false;
    const token = this.tokenPayload as { roles: string[] };
    return token.roles.includes(roleName);
  }

  public getUserView(envKey: string): string {
    if (!this.token || !envKey) return '';
    return this.tokenPayload['env']['view'];
  }

  public getUserEnviromentSettingsValueByKey(envKey: string): string {
    if (!this.token || !envKey) return '';
    return this.tokenPayload['env']['settings'][envKey];
  }

  public LOGIC_USECASHREQUESTAPPROVING(): boolean {
    return this.getUserEnviromentSettingsValueByKey('LOGIC_USECASHREQUESTAPPROVING') === '1';
  }

  public isRoleAvailableReadonly(): boolean {
    return this.isRoleAvailable('Readonly');
  }

  public isRoleAvailableAllColumns(): boolean {
    return this.isRoleAvailable('All columns');
  }

  public isRoleAvailableDepartmentCompanyEditor(): boolean {
    return this.isRoleAvailable('Department company editor');
  }

  public isRoleAvailableOperationRulesDesigner(): boolean {
    return this.isRoleAvailable('Operation rules designer');
  }

  public isRoleAvailableCompanyEditor(): boolean {
    return this.isRoleAvailable('Company editor');
  }

  public isRoleAvailableDepartmentEditor(): boolean {
    return this.isRoleAvailable('Department editor');
  }

  public isRoleAvailableResponsibilityCenterEditor(): boolean {
    return this.isRoleAvailable('Responsibility center editor');
  }

  public isRoleAvailableCashRequestAdmin(): boolean {
    return this.isRoleAvailable('Cash request admin');
  }

  public isRoleAvailableTester(): boolean {
    return true; // this.isRoleAvailable('New features tester');
  }

  private init(loginResponse: ILoginResponse) {
    if (loginResponse.token && loginResponse.account) {
      if (loginResponse.photo !== null) localStorage.setItem('photo', loginResponse.photo);
      this.token = loginResponse.token;
      this._userProfile$.next(loginResponse);
    }
  }
}
