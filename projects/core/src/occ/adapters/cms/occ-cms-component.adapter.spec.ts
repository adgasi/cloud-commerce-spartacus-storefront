import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CMS_COMPONENT_NORMALIZER } from '../../../cms/connectors/component/converters';
import { CmsStructureConfigService } from '../../../cms/services';
import { CmsComponent, PageType } from '../../../model/cms.model';
import { PageContext } from '../../../routing';
import { ConverterService } from '../../../util/converter.service';
import { Occ } from '../../occ-models/occ.models';
import { OccEndpointsService } from '../../services/occ-endpoints.service';
import { OccCmsComponentAdapter } from './occ-cms-component.adapter';

const components: CmsComponent[] = [
  { uid: 'comp1', typeCode: 'SimpleBannerComponent' },
  { uid: 'comp2', typeCode: 'CMSLinkComponent' },
  { uid: 'comp3', typeCode: 'NavigationComponent' },
];

const component: CmsComponent = components[1];

const componentList: Occ.ComponentList = {
  component: [{ uid: 'comp_uid1' }, { uid: 'comp_uid2' }],
};

class CmsStructureConfigServiceMock {}

const endpoint = '/cms';

class OccEndpointsServiceMock {
  getEndpoint(): string {
    return endpoint;
  }
  getUrl(_endpoint: string, _urlParams?: any, _queryParams?: any): string {
    return '';
  }
}

const context: PageContext = {
  id: '123',
  type: PageType.PRODUCT_PAGE,
};

const ids = ['comp_uid1', 'comp_uid2'];

fdescribe('OccCmsComponentAdapter', () => {
  let service: OccCmsComponentAdapter;
  let httpMock: HttpTestingController;
  let converter: ConverterService;
  let endpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccCmsComponentAdapter,
        { provide: OccEndpointsService, useClass: OccEndpointsServiceMock },
        {
          provide: CmsStructureConfigService,
          useClass: CmsStructureConfigServiceMock,
        },
      ],
    });

    service = TestBed.get(OccCmsComponentAdapter);
    httpMock = TestBed.get(HttpTestingController);
    converter = TestBed.get(ConverterService);
    endpointsService = TestBed.get(OccEndpointsService);

    spyOn(converter, 'pipeable').and.callThrough();
    spyOn(converter, 'pipeableMany').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('load', () => {
    it('should get cms component data', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint + `/components/comp1?productCode=${context.id}`
      );
      service.load('comp1', context).subscribe(result => {
        expect(result).toEqual(component);
      });

      const testRequest = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.url === endpoint + `/components/comp1?productCode=${context.id}`
        );
      });

      expect(endpointsService.getUrl).toHaveBeenCalledWith(
        'component',
        { id: 'comp1' },
        { productCode: '123' }
      );
      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(component);
    });

    it('should use normalizer', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint + `/components/comp1?productCode=${context.id}`
      );
      service.load('comp1', context).subscribe();
      httpMock
        .expectOne(
          req =>
            req.url === endpoint + `/components/comp1?productCode=${context.id}`
        )
        .flush(component);

      expect(converter.pipeable).toHaveBeenCalledWith(CMS_COMPONENT_NORMALIZER);
    });
  });

  describe('load list of cms component data using GET request', () => {
    it('should get a list of cms component data using GET request without pagination parameters', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint +
          `/components?componentIds=${ids.toString()}&productCode=${context.id}`
      );
      service.findComponentsByIds(ids, context).subscribe(result => {
        expect(result).toEqual(componentList.component);
      });

      const testRequest = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.url ===
            endpoint +
              `/components?componentIds=${ids.toString()}&productCode=${
                context.id
              }`
        );
      });

      expect(endpointsService.getUrl).toHaveBeenCalledWith(
        'components',
        { fields: 'DEFAULT' },
        {
          componentIds: ids.toString(),
          productCode: '123',
          currentPage: '0',
          pageSize: '2',
        }
      );

      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(componentList);
    });

    it('should get a list of cms component data using GET request with pagination parameters', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint +
          `/components?componentIds=${ids.toString()}&productCode=${context.id}`
      );

      service
        .findComponentsByIds(ids, context, 'FULL', 0, 5)
        .subscribe(result => {
          expect(result).toEqual(componentList.component);
        });

      const testRequest = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.url ===
            endpoint +
              `/components?componentIds=${ids.toString()}&productCode=${
                context.id
              }`
        );
      });

      expect(endpointsService.getUrl).toHaveBeenCalledWith(
        'components',
        { fields: 'FULL' },
        {
          componentIds: ids.toString(),
          productCode: '123',
          currentPage: '0',
          pageSize: '5',
        }
      );

      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(componentList);
    });

    it('should use normalizer', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint + '/components'
      );

      service.findComponentsByIds(ids, context).subscribe();

      httpMock
        .expectOne(req => req.url === endpoint + '/components')
        .flush(componentList);

      expect(converter.pipeableMany).toHaveBeenCalledWith(
        CMS_COMPONENT_NORMALIZER
      );
    });
  });

  describe('load list of cms component data using POST request', () => {
    it('should get a list of cms component data using POST request without pagination parameters', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint + `/components?productCode=${context.id}`
      );
      service.searchComponentsByIds(ids, context).subscribe(result => {
        expect(result).toEqual(componentList.component);
      });

      const testRequest = httpMock.expectOne(req => {
        console.log(req);
        return (
          req.method === 'POST' &&
          req.url === endpoint + `/components?productCode=${context.id}`
        );
      });

      expect(testRequest.request.body).toEqual({ idList: ids });
      expect(endpointsService.getUrl).toHaveBeenCalledWith(
        'components',
        { fields: 'DEFAULT' },
        { productCode: '123', currentPage: '0', pageSize: '2' }
      );

      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(componentList);
    });

    it('should get a list of cms component data using POST request with pagination parameters', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint + `/components?productCode=${context.id}`
      );
      service
        .searchComponentsByIds(ids, context, 'FULL', 0, 5)
        .subscribe(result => {
          expect(result).toEqual(componentList.component);
        });

      const testRequest = httpMock.expectOne(req => {
        return (
          req.method === 'POST' &&
          req.url === endpoint + `/components?productCode=${context.id}`
        );
      });

      expect(testRequest.request.body).toEqual({ idList: ids });
      expect(endpointsService.getUrl).toHaveBeenCalledWith(
        'components',
        { fields: 'FULL' },
        { productCode: '123', currentPage: '0', pageSize: '5' }
      );

      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(componentList);
    });

    it('should use normalizer', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint + '/components'
      );

      service.searchComponentsByIds(ids, context).subscribe();

      httpMock
        .expectOne(req => req.url === endpoint + '/components')
        .flush(componentList);

      expect(converter.pipeableMany).toHaveBeenCalledWith(
        CMS_COMPONENT_NORMALIZER
      );
    });
  });
});
