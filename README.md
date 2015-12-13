# Générateur de carte avec filtres et panneau d'information

Application permettant de générer une carte avec un panneau permettant de filtrer les données d'une couche geojson et un panel d'information customisable.


##Installation

Copier le dépot
```
  wget https://github.com/PnCevennes/ng-mapCreator-fp/archive/master.zip
  unzip master.zip
  cd ng-mapCreator-fp
```
Copier les fichiers de configuration
```
  cp data/maps.json.sample data/maps.json
  cp templates/infopanel.html.sample templates/infopanel.html
```

##Configuration

###Fonds de carte

###Couches principales

###Filtre

###Panel d'information

###Localisation

* Paramètres
** name : nom du filtre
** url : url du service de localisation. Doit renvoyer les données au format json comme spécifié ci-dessous
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
