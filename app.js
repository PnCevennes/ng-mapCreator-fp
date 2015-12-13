"use strict";

var app = angular.module('MapCreatorApp', ['ui.bootstrap']);

app.controller('MainMapCtl',
    ['$scope', '$http','LeafletServices', '$rootScope', function ($scope, $http, LeafletServices, $rootScope) {
		$scope.baselayers = {},
		$scope.mainLayer = null,
		$scope.mainLayerData = null,
		
		$('#info-popup').hide();
		
		$scope.map = L.map('mapc', { zoomControl:true });

		$http.get("data/maps.json").then(
			function(results) {
				//----Fonds de carte
				angular.forEach(results.data.layers.baselayers, function(value, key) {
					var l = LeafletServices.loadData(value);
					$scope.baselayers[key] = l;
					if (value.active) {
					  $scope.baselayers[key].map.addTo($scope.map);
					}
				});
				$scope.map.setView(new L.LatLng(results.data.center.lat, results.data.center.lng),results.data.center.zoom);
				
				$scope.mapOptions = results.data;
				
				//----Couche principale
				//options
				$scope.mainLayerOptions = eval("("+(results.data.layers.overlay.options || {}) +")");
				$scope.mainLayerOptions.customOnEachFeature = $scope.mainLayerOptions.onEachFeature || function () {};
				$scope.mainLayerOptions.onEachFeature = function(feature, layer) {
					$scope.mainLayerOptions.customOnEachFeature(feature, layer);
					layer.on({
						click : function(e){
							$rootScope.$apply($rootScope.$broadcast("feature:click", layer))
						},
						popupclose: function() {
							$('#info-popup').hide();
						}
					});					
				};
				//Chargement des données et affichage sur la carte
				$http.get(results.data.layers.overlay.url).then(
					function(results) {    
					  $scope.mainLayerData = results.data;
					  $scope.mainLayer = new L.geoJson(results.data,$scope.mainLayerOptions);
					  $scope.map.addLayer($scope.mainLayer );
					}
				);
				
				//----Selecteur de localisation
				if (results.data.location) {
					$http.get(results.data.location.url).then(
						function(results) {    
						  $scope.locationData = results.data;
						}
					);
				}
			}
		);
		
		//Action selection d'un élément sur la carte
		$scope.$on('feature:click', function(ev, item){
			$scope.infoObj = item.feature.properties;
			$('#filter-panel').collapse('hide');
			$('#info-popup').show();
		});
		
		//Action zoom sur une localisation
		$scope.$watch('selectedLocation', function (newvalue, oldvalue) {
			if (newvalue) {
				$scope.map.fitBounds([
					[newvalue.st_ymin, newvalue.st_xmin],
					[newvalue.st_ymax, newvalue.st_xmax]
				], {zoom:17});
			}
		});
		
		//Action filtre d'un élément sur la carte
		$scope.dofilterOnMap= function () {
			$scope.map.removeLayer($scope.mainLayer);
			var options = angular.extend(
				$scope.mainLayerOptions,
				{
					filter: function(feature, layer) {
						var fil=0;
						angular.forEach($scope.mapOptions.layers.overlay.filters, function(arrayFilter, key) {
							if (feature.properties[key]) fil += arrayFilter.values[feature.properties[key]].visible;
						});
						return fil > 1 ? true : false ;
					}
				}
			);
		 	$scope.mainLayer = new L.geoJson($scope.mainLayerData,options);
			$scope.mainLayer.addTo($scope.map);
		}
		
		$scope.checkUncheckAll= function (filterType, val) {
			var toggleStatus = val;
			angular.forEach($scope.mapOptions.layers.overlay.filters[filterType].values, function(arrayFilter, key) {
				arrayFilter.visible = toggleStatus;
			});
			$scope.dofilterOnMap();
		}		
    }]
);

app.directive('dirFilterElement', function() {
  return {
    restrict: 'E',
    scope: {
      key: '=key',
      filterInfo: '=filter',
      onCheck:'&'
    },
    templateUrl: 'templates/directive-filterpanel.html',    
	controller: function($scope){
		$scope.state = angular.isDefined($scope.state) ? Boolean($scope.state) : true;
	}
  };
});

app.factory('LeafletServices', ['$http', function($http) {
    return {
      layer : {}, 
      
      loadData : function(layerdata) {
        this.layer = {};
        this.layer.name = layerdata.name;
        this.layer.active = layerdata.active;
        
        if (layerdata.type == 'xyz' || layerdata.type == 'ign') {
		  var url = layerdata.url;
          if ( layerdata.type == 'ign') {
            url = 'https://gpp3-wxs.ign.fr/' + layerdata.key + '/geoportail/wmts?LAYER='+layerdata.layer+'&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'; 
          }
          this.layer.map = new L.TileLayer(url,layerdata.options);
        }
        else if (layerdata.type == 'wms') {
          this.layer.map = L.tileLayer.wms(layerdata.url,layerdata.options);
        }
        return this.layer;
      }
   };
}]);
