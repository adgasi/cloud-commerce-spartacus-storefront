import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import { RoutingService } from '../../../routing/index';
import * as fromEffects from './navigation-entry-item.effect';
import * as fromActions from '../actions/navigation-entry-item.action';

import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import * as fromCmsReducer from '../../../cms/store/reducers/index';
import { CmsComponent, OccConfig } from '@spartacus/core';
import { CmsComponentConnector } from '../../connectors/component/cms-component.connector';
import { PageType } from '../../../model/cms.model';

const router = {
  state: {
    url: '/',
    queryParams: {},
    params: {},
    context: { id: '1', type: PageType.PRODUCT_PAGE },
    cmsRequired: false,
  },
};

const listComponents: any = [
  {
    uid: 'MockLink001',
    url: '/testLink1',
    linkName: 'test link 1',
    target: false,
  },
  {
    uid: 'MockLink002',
    url: '/testLink2',
    linkName: 'test link 2',
    target: true,
  },
];

class MockRoutingService {
  getRouterState() {
    return of(router);
  }
}

class MockCmsComponentConnector {
  getList(): Observable<CmsComponent[]> {
    return of(listComponents);
  }
}

describe('Navigation Entry Items Effects', () => {
  let actions$: Observable<any>;
  let service: CmsComponentConnector;
  let effects: fromEffects.NavigationEntryItemEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('cms', fromCmsReducer.getReducers()),
      ],
      providers: [
        { provide: CmsComponentConnector, useClass: MockCmsComponentConnector },
        { provide: OccConfig, useValue: {} },
        fromEffects.NavigationEntryItemEffects,
        provideMockActions(() => actions$),
        { provide: RoutingService, useClass: MockRoutingService },
      ],
    });

    service = TestBed.get(CmsComponentConnector);
    effects = TestBed.get(fromEffects.NavigationEntryItemEffects);

    spyOn(service, 'getList').and.returnValue(of(listComponents));
  });

  describe('loadNavigationItems$', () => {
    it('should return list of components from LoadNavigationItemsSuccess', () => {
      const action = new fromActions.LoadNavigationItems({
        nodeId: 'MockNavigationNode001',
        items: [
          {
            superType: 'AbstractCMSComponent',
            id: 'MockLink001',
          },
          {
            superType: 'AbstractCMSComponent',
            id: 'MockLink002',
          },
        ],
      });
      const completion = new fromActions.LoadNavigationItemsSuccess({
        nodeId: 'MockNavigationNode001',
        components: listComponents,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadNavigationItems$).toBeObservable(expected);
    });
  });
});
