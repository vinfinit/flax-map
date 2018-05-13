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
  , [create_address('Coopérative Agricole Linière du Nord de Caen, Rue des Buissons, 14610 Villons-les-Buissons', [49.233856, -0.413225])]
  , [create_address('SOC Cooperative Agricole L.A. Linière, 73 Route de Looberghe, 59630 Bourbourg', [50.930902, 2.225995])]
  , [create_address('Coopérative de Linière FONTAINE le dun-CANY, Saint Pierre Le Viger, 76740 Seine-Maritime', [49.828339, 0.851765])]
  , [create_address('COOPÉRATIVE DE TEILLAGE DE LIN DU VERT GALANT, 54 Route du Vert Galant, 76690 Saint-André-sur-Cailly')]
  , [create_address('COOPERATIVE AGRICOLE Lin 2000 SCA, 20 Avenue Saget, 60210 Grandvilliers', [49.6592994,1.9339162])]
  , [create_address("Coopérative Agricole Linière, Rue de l'Étoile, 14630 Cagny", [49.150687, -0.258760])]
  , [create_address('OPALIN SCA, Route nationale, 62770 Le Parcq', [50.374262,2.064595])]
  , [
    create_address('Liniere De Bosc Nouvel S.A., Le Bosc Nouvel, 76690 Le Bocasse')
    , create_address("Teillage Vandecandelaere S.A.S., 5 Rue de l'Église, 14540 Bourguébus", [49.120013, -0.296232])
  ]
  , [create_address('Teillage bellet Cie GmbH (Teillage Bellet & Cie S.A.R.L.), Plaine du Château, 76210 Raffetot')]
  , [
    create_address('Van Robaeys Frères, 83 Rue Saint-Michel, 59122 Killem')
    , create_address("Van Robaeys Frères Fortel-en-Artois 62270", [50.271365, 2.231550])
  ]
  , [create_address('Etablissements Devogele S.A.S., Le Buisson, 77120 Chailly-en-Brie')]
  , [create_address('Vanhersecke Frères S.A.R.L, Barrière Française, 59143 Millam', [50.834368,2.277426])]
  , [create_address('Novalin France, Chemin Départemental la Barrière Française, 59143 Millam', [50.8345196,2.2784653])]
  , [create_address('Teillage de Saint Martin S.A.S, Centre Bourg, 27300 Saint-Martin-du-Tilleul', [49.1105738, 0.5287496])]
  , [create_address('Linière de Saint Martin, 113 Rue du Puits, 27300 Saint-Martin-du-Tilleul', [49.094317, 0.587164])]
  , [create_address('DeCock S.A., 1 Rue de la Cartonnerie, 59122 Hondschoote', [50.9905296, 2.5610947])]
  , [create_address('Jean Decock S.A., 10 Route de Looweg, 59380 Quaëdypre', [50.9513724, 2.4298771])]
  , [create_address('Société Michel Dewynter SAS, 468 Route de Bourbourg, 59285 Rubrouck')]
  , [create_address('Liniere Du Ressault - Etablis Lamerant S.A., Rue Alexandre Duval, 27110 Le Neubourg')]
  , [create_address('Teillage Brille-Lamerant, Rue Alexandre Duval, 27110 Le Neubourg')]
  , [create_address('Teillage de lin Lievin  (MADAME SIMONNE LIEVIN), 22 Grand’ Rue  62140 REGNAUVILLE Région: Nord Pas De Calais', [50.315851, 2.008090])]

  , [
    create_address('Чаусский Льнозавод ОАО')
    , create_address('Шкловский Льнозавод ОАО')
    // , create_address('Участок по возделыванию льна, г. Чаусы')
  ]
  , [create_address('ОАО "Горкилён", Могилёвская область, г. Горки, ул. Черникова, 8', [54.257967, 30.985080])]
  , [create_address('ОАО "Хотимский льнозавод", Могилевская область, гп. Хотимск, ул. Льнозаводская, 9', [53.396270, 32.584729])]
  , [create_address('ОАО "Мстиславльлен", Г. Мстиславль, п. Печковка', [54.023277, 31.763841])]
  , [create_address('ОАО "Любанский льнозавод", Минская обл., Любанский р-н, гп. Любань, Улица Боровика, 1', [52.813821, 28.027962])]
  , [create_address('ОАО "Красненский льнозавод", Минская область, Молодечненский р-н, д. Красное, ул. Лесная, 1/а', [54.275928, 27.040194])]
  , [create_address('ОАО "Воложинский льнокомбинат"')]
  , [create_address('ОАО "Крупский льнозавод"', [54.304773, 29.009242])]
  , [create_address('ОАО "Слуцкий льнозавод", 223610 Минская область, г. Слуцк , ул. Ленина, 300', [53.043711, 27.616484])]
  , [create_address('Филиал "Кормянский льнозавод" ОАО "Гомельлен"', [53.128038, 30.861029])]
  , [create_address('филиал "Уваровичский льнозавод" ОАО "Гомельлен", Гомельская обл. Буда-Кошелёвский район д. Кривск', [52.592467, 30.525733])]
  , [create_address('Речицкий Цех Кормянского Льнозавода Филиала ОАО Гомельлён', [52.386372, 30.355892])]
  , [create_address('ОАО "Ляховичский льнозавод"', [53.0049767,26.2092848])]
  , [create_address('ОАО "Пружанский льнозавод"')]
  , [create_address('Участок Лида ОАО "Кореличилен", Лидский р-н, д Доржи', [53.7621813,25.3870851])]
  , [create_address('ОАО "Кореличи-лен", Гродненская область, г.п.Кореличи')]
  , [create_address('ОАО "Дворецкий льнозавод"', [53.416875, 25.568207])]
  , [create_address('ОАО Дворецкий льнозавод производственный участок "Слоним"', [53.0894688,25.3726562])]
  , [create_address('Филиал "Бешенковичский льнозавод" ОАО "Приозерный мир"', [55.075847, 29.508797])]
  , [create_address('ОАО "Верхнедвинский льнозавод" 211620,Витебская область, ГОС а/я № 1, г.Верхнедвинск', [55.749681, 27.933658])]
  , [create_address('ОАО "Кохановский льнозавод", 211060, Витебская область, Толочинский р-н, п/о Матюхово, д.Зеленый бор', [54.478927, 29.998060])]
  , [create_address('ОАО "Лиозненский льнозавод", 211220, Витебская область,г.п.Лиозно, ул.Гагарина', [55.015689, 30.788225])]
  , [create_address('ОАО "Миорский льнозавод", 211930,Витебская область, ул.Заводская, г.Миоры', [55.611359, 27.621004])]
  , [create_address('ОАО "Мосарлен"', [55.234677, 27.472198])]
  , [create_address('ОАО "Поставский льнозавод"', [55.124197, 26.820771])]
  , [create_address('ОАО "Дубровенский льнозавод"', [54.5770056,30.6671155])]
  , [create_address('ОАО "Ореховский льнозавод", Витебская обл. Оршанский р-н', [54.671936, 30.486181])]
];

function locToLatLng(location) {
  let res = {};
  if (location) {
    res.lat = location[0];
    res.lng = location[1];
    return res
  }
  return null
}

function create_address(label, location=null) {
  return {
    label: label.split(',')[0]
    , location: locToLatLng(location)
    , uri: encodeURIComponent(label)
  }
}

Promise.map(locationList, locationGroup => {
  return Promise.map(locationGroup, factory => {
    if (factory.location) {
      return Promise.resolve()
    }
    return rp({
      uri: `https://maps.googleapis.com/maps/api/geocode/json?address=${factory.uri}&key=${apiKey}`
      , json: true
    })
      .then(data => {
        if (!factory.location) {
          factory.location = data.results[0].geometry.location
        }
        // console.log(data.results[0])
      })
  })
})
.then(() => Promise.promisify(jsonfile.writeFile)(file, locationList))
.catch(err => console.error(err));

