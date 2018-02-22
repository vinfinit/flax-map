const rp = require('request-promise');
const Promise = require('bluebird');
const jsonfile = require('jsonfile');

const apiKey = 'AIzaSyDtB-S2ZSrzeOyf8aKdxbhfGjaxTqx1B2k';
const file = './data/location.json';

const locationList = [
  [
    create_address('TERRE DE LIN, 605 Route de la Vallée, 76740 Saint-Pierre-le-Viger')
    , create_address('TERRE DE LIN, 4 Route Linerie, 76590 Crosville-sur-Scie')
    , create_address('TERRE DE LIN, Les Pistes Zi N 2, 27190 Conches-en-Ouche')
    , create_address('TERRE DE LIN, Rue du Roumois, 27350 Routot')
    , create_address('TERRE DE LIN, 12 Rue du Dessous des Bois, 76450 Vittefleur')
    , create_address('TERRE DE LIN, Route de Pulcheux76630 Douvrend')
  ]
  , [
    create_address('Agy Lin Société Coopérative Agricole, La Poterie, 76190 Baons-le-Comte')
    , create_address('Agy Lin Ste Cooperative Agricole, Rue Emile Bénard, 76110 Goderville')
  ]
  , [create_address('COOPÉRATIVE DE TEILLAGE DU PLATEAU DU NEUBOURG,1 Route de Coquerel, 27110 Crosville-la-Vieille')]
  , [create_address('Coopérative Agricole LInière de la Région d’Abbeville (CALIRA), 18 Route départementale, 80140 Martainneville, Somme')]
  , [create_address('Coopérative Agricole Linière du Nord de Caen, Rue des Buissons, 14610 Villons-les-Buissons')]
  , [create_address('SOC Cooperative Agricole L.A. Linière, 73 Route de Looberghe, 59630 Bourbourg')]
  , [create_address('Coopérative de Linière FONTAINE le dun-CANY, Saint Pierre Le Viger, 76740 Seine-Maritime ')]
  , [create_address('COOPÉRATIVE DE TEILLAGE DE LIN DU VERT GALANT, 54 Route du Vert Galant, 76690 Saint-André-sur-Cailly')]
  , [create_address('COOPERATIVE AGRICOLE Lin 2000 SCA, 20 Avenue Saget, 60210 Grandvilliers (там же - Cuma Liniere de Grandvilliers)')]
  , [create_address("Coopérative Agricole Linière, Rue de l'Étoile, 14630 Cagny")]
  , [create_address('OPALIN SCA, Route nationale, 62770 Le Parcq')]
  , [
    create_address('Liniere De Bosc Nouvel S.A., Le Bosc Nouvel, 76690 Le Bocasse')
    , create_address("Teillage Vandecandelaere S.A.S., 5 Rue de l'Église, 14540 Bourguébus")
  ]
  , [create_address('Teillage bellet Cie GmbH (Teillage Bellet & Cie S.A.R.L.), Plaine du Château, 76210 Raffetot')]
  , [
    create_address('Van Robaeys Frères, 83 Rue Saint-Michel, 59122 Killem')
    , create_address("Van Robaeys Frères, Fortel-en-Artois 62270")
  ]
  , [create_address('Etablissements Devogele S.A.S., Le Buisson, 77120 Chailly-en-Brie')]
  , [create_address('Vanhersecke Frères S.A.R.L, Barrière Française, 59143 Millam')]
  , [create_address('Teillage de Saint Martin S.A.S, Centre Bourg, 27300 Saint-Martin-du-Tilleul')]
  , [create_address('Linière de Saint Martin, 113 Rue du Puits, 27300 Saint-Martin-du-Tilleul')]
  , [create_address('DeCock S.A., 1 Rue de la Cartonnerie, 59122 Hondschoote')]
  , [create_address('Jean Decock S.A., 10 Route de Looweg, 59380 Quaëdypre')]
  , [create_address('Société Michel Dewynter SAS, 468 Route de Bourbourg, 59285 Rubrouck')]
  , [create_address('Liniere Du Ressault - Etablis Lamerant S.A., Rue Alexandre Duval, 27110 Le Neubourg')]
  , [create_address('Teillage Brille-Lamerant, Rue Alexandre Duval, 27110 Le Neubourg')]
  // , [create_address('Teillage de lin Lievin  (MADAME SIMONNE LIEVIN), 22 Grand’ Rue  62140 REGNAUVILLE Région: Nord Pas De Calais')]
];

function create_address(label) {
  return {
    label: label.split(',')[0]
    , uri: encodeURIComponent(label)
  }
}

Promise.map(locationList, locationGroup => {
  return Promise.map(locationGroup, location => {
    return rp({
      uri: `https://maps.googleapis.com/maps/api/geocode/json?address=${location.uri}&key=${apiKey}`
      , json: true
    })
      .then(data => {
        // console.log(data.results[0])
        location.location = data.results[0].geometry.location
      })
  })
})
.then(() => Promise.promisify(jsonfile.writeFile)(file, locationList))
.catch(err => console.error(err));

