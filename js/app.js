
	var mapsApp = angular.module('mapsApp', []);
	
	
	var IpApiService = mapsApp.factory("IpApiService", ["$http", "$q", function($http, $q){
		var appServices = {
			getCoordinates: getCoordinates
		};
		
		function getCoordinates(website){
			var d = $q.defer(), userlist;
			var site = website || "";
			  $http.get('http://ip-api.com/json/'+website).success(function(data){
				d.resolve(data);
			});
			return d.promise;
		}
		
		return appServices
	}]);

    var appController = mapsApp.controller('appController', [ 'IpApiService', '$scope',function (IpApiService, $scope) {
		
		
		
		var mapOptions = {
			zoom: 3,
			center: new google.maps.LatLng(40.0000, -98.0000),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		}
		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
		$scope.markers = [];
		$scope.currentLocationDetails = null;
		$scope.websiteURL = "http://"
		
		var infoWindow = new google.maps.InfoWindow();
		
		$scope.fetchDetails= function(url){
			IpApiService.getCoordinates(url).then(function(obj){
				obj.website = url;
				
				var marker = new google.maps.Marker({
					map: $scope.map,
					position: new google.maps.LatLng(obj.lat, obj.lon),
					title: obj.website,
					details: obj
				});
				marker.content = '<div class="infoWindowContent">' + obj.isp + ', '+ obj.as + '</div>';
			
				google.maps.event.addListener(marker, 'click', function(){
					infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
					infoWindow.open($scope.map, marker);
					$scope.currentLocationDetails = marker.details;
				});
			
				$scope.markers.push(marker);
				if(!url){
					$scope.currentLocationDetails = marker.details;
				}
				
			});
		}
		
		
		$scope.locateMe = function(){
			$scope.fetchDetails('');
		}
		
		$scope.openInfoWindow = function(e, selectedMarker){
			e.preventDefault();
			google.maps.event.trigger(selectedMarker, 'click');
		}
		
		$scope.addUrlToCollection = function(){
			var website = $scope.websiteURL.replace('http://', '');
			$scope.fetchDetails(website);
		}
		

	}]);

