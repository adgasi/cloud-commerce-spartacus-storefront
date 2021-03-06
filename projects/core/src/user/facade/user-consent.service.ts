import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConsentTemplate } from '../../model/consent.model';
import { USERID_CURRENT } from '../../occ/utils/occ-constants';
import * as fromProcessStore from '../../process/store/process-state';
import {
  getProcessErrorFactory,
  getProcessLoadingFactory,
  getProcessSuccessFactory,
} from '../../process/store/selectors/process.selectors';
import * as fromStore from '../store/index';
import {
  GIVE_CONSENT_PROCESS_ID,
  WITHDRAW_CONSENT_PROCESS_ID,
} from '../store/user-state';

@Injectable({
  providedIn: 'root',
})
export class UserConsentService {
  constructor(
    protected store: Store<
      fromStore.StateWithUser | fromProcessStore.StateWithProcess<void>
    >
  ) {}

  /**
   * Retrieves all consents.
   */
  loadConsents(): void {
    this.store.dispatch(new fromStore.LoadUserConsents(USERID_CURRENT));
  }

  /**
   * Returns all consents
   */
  getConsents(): Observable<ConsentTemplate[]> {
    return this.store.pipe(select(fromStore.getConsentsValue));
  }

  /**
   * Returns the consents loading flag
   */
  getConsentsResultLoading(): Observable<boolean> {
    return this.store.pipe(select(fromStore.getConsentsLoading));
  }

  /**
   * Returns the consents success flag
   */
  getConsentsResultSuccess(): Observable<boolean> {
    return this.store.pipe(select(fromStore.getConsentsSuccess));
  }

  /**
   * Returns the consents error flag
   */
  getConsentsResultError(): Observable<boolean> {
    return this.store.pipe(select(fromStore.getConsentsError));
  }

  /**
   * Resets the processing state for consent retrieval
   */
  resetConsentsProcessState(): void {
    this.store.dispatch(new fromStore.ResetLoadUserConsents());
  }

  /**
   * Give consent for specified consent template ID and version.
   * @param consentTemplateId a template ID for which to give a consent
   * @param consentTemplateVersion a template version for which to give a consent
   */
  giveConsent(consentTemplateId: string, consentTemplateVersion: number): void {
    this.store.dispatch(
      new fromStore.GiveUserConsent({
        userId: USERID_CURRENT,
        consentTemplateId,
        consentTemplateVersion,
      })
    );
  }

  /**
   * Returns the give consent process loading flag
   */
  getGiveConsentResultLoading(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessLoadingFactory(GIVE_CONSENT_PROCESS_ID))
    );
  }

  /**
   * Returns the give consent process success flag
   */
  getGiveConsentResultSuccess(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessSuccessFactory(GIVE_CONSENT_PROCESS_ID))
    );
  }

  /**
   * Returns the give consent process error flag
   */
  getGiveConsentResultError(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessErrorFactory(GIVE_CONSENT_PROCESS_ID))
    );
  }

  /**
   * Resents the give consent process flags
   */
  resetGiveConsentProcessState(): void {
    return this.store.dispatch(new fromStore.ResetGiveUserConsentProcess());
  }

  /**
   * Withdraw consent for the given `consentCode`
   * @param consentCode for which to withdraw the consent
   */
  withdrawConsent(consentCode: string): void {
    this.store.dispatch(
      new fromStore.WithdrawUserConsent({ userId: USERID_CURRENT, consentCode })
    );
  }

  /**
   * Returns the withdraw consent process loading flag
   */
  getWithdrawConsentResultLoading(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessLoadingFactory(WITHDRAW_CONSENT_PROCESS_ID))
    );
  }

  /**
   * Returns the withdraw consent process success flag
   */
  getWithdrawConsentResultSuccess(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessSuccessFactory(WITHDRAW_CONSENT_PROCESS_ID))
    );
  }

  /**
   * Returns the withdraw consent process error flag
   */
  getWithdrawConsentResultError(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessErrorFactory(WITHDRAW_CONSENT_PROCESS_ID))
    );
  }

  /**
   * Resets the process flags for withdraw consent
   */
  resetWithdrawConsentProcessState(): void {
    return this.store.dispatch(new fromStore.ResetWithdrawUserConsentProcess());
  }
}
