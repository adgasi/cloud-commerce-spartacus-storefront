import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CmsProductReferencesComponent,
  Component,
  ProductReference,
  ProductReferenceService,
  RoutingService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CmsComponentData } from '../../../../cms-structure/page/model/cms-component-data';
import { PictureComponent } from '../../../ui/components/media/picture/picture.component';
import { SharedCarouselService } from '../shared-carousel.service';
import { ProductReferencesComponent } from './product-references.component';
import { ProductReferencesService } from './product-references.component.service';

@Pipe({
  name: 'cxTranslateUrl',
})
class MockTranslateUrlPipe implements PipeTransform {
  transform(): any {}
}

const productCode = 'productCode';
const product = {
  code: productCode,
  name: 'testProduct',
};

const references: ProductReference[] = [
  {
    referenceType: 'SIMILAR',
    target: product,
  },
  {
    referenceType: 'ACCESSORIES',
    target: product,
  },
];

const mockComponentData: CmsProductReferencesComponent = {
  uid: '001',
  typeCode: 'ProductReferencesComponent',
  modifiedtime: new Date('2017-12-21T18:15:15+0000'),
  productReferenceTypes: 'SIMILAR',
  title: 'Mock Title',
  name: 'Mock UIProduct References',
  container: 'false',
};

const MockCmsComponentData = <CmsComponentData<Component>>{
  data$: of(mockComponentData),
};

const router = {
  state: {
    url: '/',
    queryParams: {},
    params: { productCode },
  },
};

class MockRoutingService {
  getRouterState(): Observable<any> {
    return of(router);
  }
}

class MockProductReferenceService {
  get(): Observable<ProductReference[]> {
    return of(references);
  }
}

class MockProductReferencesService {
  getTitle = jasmine.createSpy('getTitle').and.callFake(() => of('Mock Title'));
  setTitle = jasmine.createSpy('setTitle').and.callFake(() => of('Mock Title'));
  getReferenceList = jasmine
    .createSpy('getReferenceList')
    .and.callFake(() => of([of(references), of(references)]));
  setReferenceList = jasmine
    .createSpy('setReferenceList')
    .and.callFake(() => of([of(references), of(references)]));
}

class MockSharedCarouselService {
  getItemSize = jasmine.createSpy('getItemSize').and.callFake(() => of(4));
  setItemSize = jasmine.createSpy('setItemSize');
  getItemAsActive = jasmine
    .createSpy('getItemAsActive')
    .and.callFake(() => of(0));
  setItemAsActive = jasmine
    .createSpy('setItemAsActive')
    .and.callFake(() => of(1));
  setPreviousItemAsActive = jasmine.createSpy('setPreviousItemAsActive');
  getActiveItemWithDelay = jasmine.createSpy('getActiveItemWithDelay');
  setNextItemAsActive = jasmine.createSpy('setNextItemAsActive');
  getDelayValue = jasmine.createSpy('getDelayValue').and.callThrough();
  getActiveItem = jasmine.createSpy('getActiveItem').and.callFake(() => of(1));
}

describe('ProductReferencesComponent', () => {
  let productReferencesComponent: ProductReferencesComponent;
  let fixture: ComponentFixture<ProductReferencesComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ProductReferencesComponent,
        PictureComponent,
        MockTranslateUrlPipe,
      ],
      providers: [
        { provide: CmsComponentData, useValue: MockCmsComponentData },
        {
          provide: ProductReferenceService,
          useClass: MockProductReferenceService,
        },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
      ],
    })
      .overrideComponent(ProductReferencesComponent, {
        set: {
          providers: [
            {
              provide: ProductReferencesService,
              useClass: MockProductReferencesService,
            },
            {
              provide: SharedCarouselService,
              useClass: MockSharedCarouselService,
            },
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReferencesComponent);
    productReferencesComponent = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should be created', async(() => {
    productReferencesComponent.ngOnInit();
    expect(productReferencesComponent).toBeTruthy();
  }));

  it('should have product references', async(() => {
    let references$: ProductReference[];
    productReferencesComponent.productReferencesService.setReferenceList();
    productReferencesComponent.productReferencesService
      .getReferenceList()
      .subscribe(productData$ => {
        references$ = productData$;
      })
      .unsubscribe();
    expect(references$.length).toBe(references.length);
  }));

  it('should contain cms content in the html rendering after bootstrap', () => {
    expect(el.query(By.css('h3')).nativeElement.textContent).toContain(
      mockComponentData.title
    );
  });
});