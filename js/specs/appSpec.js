describe('api Service testcases',function(){
	beforeEach(module('mapsApp'))	
	
	var apiService, $httpBackend;

	beforeEach(inject(function($injector){		
		$httpBackend = $injector.get('$httpBackend');     
		apiService = $injector.get('IpApiService');		
	}));
	
	it('get coordinates should return valid data ',function(){		
		$httpBackend.expectGET("http://ip-api.com/json/mysite").respond('United States');
		var location = apiService.getCoordinates("mysite");
		$httpBackend.flush();
		expect(location.$$state.value).toBe('United States');
	})
});

describe('api controller testcases',function(){
	beforeEach(module('mapsApp'))	
	
	var apiService, appCtrl, scope;

	beforeEach(inject(function($injector, $controller, $rootScope){
		scope=$rootScope.$new();
		apiService = $injector.get('IpApiService');		
		spyOn(apiService,'getCoordinates').and.callThrough();
		appCtrl = $controller('appController',{
				$scope: scope, 
				IpApiService: apiService
		});
	}));
	
	it('app controller to be defined ',function(){		
		expect(appCtrl).toBeDefined();
	})
	
	it('api service get coordinates be called with data',function(){	
		scope.fetchDetails('test');
		expect(apiService.getCoordinates).toHaveBeenCalledWith('test');
	})
});
