# Générateur de carte avec filtres et panneau d'information

Application permettant de générer une carte avec un panneau permettant de filtrer les données d'une couche geojson et un panel d'information customisable.


##Installation
* Préqueris
```
  npm install bower
```

* Copier le dépot et lancer bower
```
  wget https://github.com/PnCevennes/ng-mapCreator-fp/archive/master.zip
  unzip master.zip
  cd ng-mapCreator-fp
  bower install
```

* Copier les fichiers de configuration
```
  cp data/maps.json.sample data/maps.json
  cp templates/infopanel.html.sample templates/infopanel.html
```

##Configuration

###Fonds de carte

* WMS
```json
         {
              "name": "temperature",
              "type": "wms",
              "url": "http://gis.srh.noaa.gov/arcgis/services/NDFDTemps/MapServer/WMSServer?",
              "active": true,
              "options": {"format": "image/png","transparent": true,"layers": 16 }
            }
```

Pour voir l'ensemble des options disponibles se référer à la documentation de leaflet
http://leafletjs.com/reference.html#tilelayer-wms-options

* IGN
```json
         {
              "name": "scan express",
              "type": "ign",
              "key" : "myAPIKey",
              "layer" : "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD", 
              "active" : true,
              "options": {"maxZoom": 19, "attribution": "IGN"}
            },
 ```
Pour voir l'ensemble des options disponibles se référer à la documentation de leaflet http://leafletjs.com/reference.html#tilelayer-options 

* XYZ
```json
        {
              "name": "opencyclemap",
              "type": "xyz",
              "url" : "http://tile.opencyclemap.org/cycle/{z}/{x}/{y}.png", 
              "active" : false,
              "options": {"maxZoom": 12, "minZoom":2, "attribution": "Map data © <a href='http://opencyclemap.org'>opencyclemap</a> contributors"}
            }
```
Pour voir l'ensemble des options disponibles se référer à la documentation de leaflet http://leafletjs.com/reference.html#tilelayer-options

###Couche principale
####Paramètres

```json
"overlay":{
    "name": "ma couche",// Nom de la couche 
    "type": "geojson", //Type de la couche (pour le moment la seule valeur possible est geojson)
    "url": "url.geojson",
    "options" : "", // Options leaflet sérialisés sous forme de caractère
    "filters":{}
}

```
Pour connaitre l'ensemble des interractions se référer à l'API leaflet : http://leafletjs.com/reference.html#geojson


####Filtres

* Paramètres
	* name : nom du filtre
	* values : liste des valeurs des filtres

* Format de données attendu
```json
"filters":{
	"ma_variable_1" :{
		"name" : "Variable 1",
		"values" : {
			"v1_1":{"label":"Val 1", "visible":true},
			...
			"v1_x":{"label":"Val x", "visible":true}
		}
	},
	"ma_variable_2" : {
		"name":"Variable 2",
		"values" : {
			"v2_1":{"label":"Val 1", "visible":true},
			...
			"v2_x":{"label":"Val x", "visible":true}
	  }
}
}

```
###Panel d'information
Modifier le fichier templates/infopanel.html

###Localisation

* Paramètres
	* name : nom du filtre
	* url : url du service de localisation. Doit renvoyer les données au format json comme spécifié ci-dessous

* Format de données attendu
```json
       [ 
        {
            "label":"Saint-Paul-le-Jeune",
            "st_xmax":4.18990857622319,
            "st_xmin":4.12459689615497,
            "st_ymax":44.3544152806611,
            "st_ymin":44.3120509291848
          },
        ]
```
##Technologies

* Angularjs
* Leaflet
