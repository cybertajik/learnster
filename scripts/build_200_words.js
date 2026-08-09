const fs = require('fs');

const csvContent = `id,spanish,english,level,partOfSpeech,imageQuery
1,gato,cat,A1,noun,cat
2,perro,dog,A1,noun,dog
3,casa,house,A1,noun,house
4,correr,to run,A1,verb,person running
5,cocinar,to cook,A1,verb,person cooking
6,banco,bank,A1,noun,bank building
7,avión,airplane,A1,noun,airplane
8,agua,water,A1,noun,glass of water
9,árbol,tree,A1,noun,green tree
10,libro,book,A1,noun,open book
11,mesa,table,A1,noun,wooden table
12,comida,food,A1,noun,plate of food
13,escuela,school,A1,noun,school building
14,pero,but,A1,conjunction,NONE
15,porque,because,A1,conjunction,NONE
16,escribir,to write,A1,verb,person writing
17,sol,sun,A1,noun,bright sun sky
18,luna,moon,A1,noun,full moon
19,playa,beach,A1,noun,tropical beach
20,familia,family,A1,noun,happy family
21,amigo,friend,A1,noun,friends smiling
22,dormir,to sleep,A1,verb,person sleeping
23,feliz,happy,A1,adjective,happy face
24,música,music,A1,noun,headphones music
25,comer,to eat,A1,verb,person eating
26,beber,to drink,A1,verb,person drinking water
27,manzana,apple,A1,noun,red apple
28,leche,milk,A1,noun,glass of milk
29,pan,bread,A1,noun,loaf of bread
30,café,coffee,A1,noun,cup of coffee
31,té,tea,A1,noun,cup of tea
32,carne,meat,A1,noun,cooked steak
33,pescado,fish,A1,noun,cooked fish
34,fruta,fruit,A1,noun,fresh fruit basket
35,verdura,vegetable,A1,noun,fresh vegetables
36,queso,cheese,A1,noun,block of cheese
37,huevo,egg,A1,noun,fried egg
38,arroz,rice,A1,noun,bowl of rice
39,sopa,soup,A1,noun,bowl of hot soup
40,azúcar,sugar,A1,noun,bowl of sugar
41,sal,salt,A1,noun,salt shaker
42,puerta,door,A1,noun,wooden door
43,ventana,window,A1,noun,open window
44,silla,chair,A1,noun,wooden chair
45,cama,bed,A1,noun,bedroom bed
46,baño,bathroom,A1,noun,clean bathroom
47,cocina,kitchen,A1,noun,modern kitchen
48,jardín,garden,A1,noun,flower garden
49,piso,apartment,A1,noun,apartment building
50,calle,street,A1,noun,city street
51,parque,park,A1,noun,green park
52,tienda,store,A1,noun,retail store
53,mercado,market,A1,noun,fruit market
54,hospital,hospital,A1,noun,hospital building
55,estación,station,A1,noun,train station
56,hotel,hotel,A1,noun,hotel building
57,restaurante,restaurant,A1,noun,dining restaurant
58,coche,car,A1,noun,modern car
59,autobús,bus,A1,noun,city bus
60,tren,train,A1,noun,passenger train
61,bicicleta,bicycle,A1,noun,bicycle
62,taxista,taxi driver,A1,noun,taxi driver
63,zapato,shoe,A1,noun,pair of shoes
64,camisa,shirt,A1,noun,buttoned shirt
65,pantalón,pants,A1,noun,blue jeans
66,vestido,dress,A1,noun,elegant dress
67,sombrero,hat,A1,noun,sun hat
68,reloj,watch,A1,noun,wrist watch
69,bolso,bag,A1,noun,handbag
70,ojo,eye,A1,noun,human eye
71,mano,hand,A1,noun,human hand
72,cabeza,head,A1,noun,human head
73,pie,foot,A1,noun,human foot
74,boca,mouth,A1,noun,smiling mouth
75,pelo,hair,A1,noun,human hair
76,niño,boy,A1,noun,young boy
77,niña,girl,A1,noun,young girl
78,hombre,man,A1,noun,adult man
79,mujer,woman,A1,noun,adult woman
80,padre,father,A1,noun,father with child
81,madre,mother,A1,noun,mother with child
82,hermano,brother,A1,noun,two brothers
83,hermana,sister,A1,noun,two sisters
84,hijo,son,A1,noun,son smiling
85,hija,daughter,A1,noun,daughter smiling
86,abuelo,grandfather,A1,noun,old grandfather
87,abuela,grandmother,A1,noun,old grandmother
88,gordo,fat,A1,adjective,overweight person
89,delgado,thin,A1,adjective,slim person
90,grande,big,A1,adjective,giant building
91,pequeño,small,A1,adjective,tiny object
92,alto,tall,A1,adjective,tall skyscraper
93,bajo,short,A1,adjective,short plant
94,bueno,good,A1,adjective,thumbs up
95,malo,bad,A1,adjective,thumbs down
96,nuevo,new,A1,adjective,brand new car
97,viejo,old,A1,adjective,vintage old car
98,rojo,red,A1,adjective,red color
99,azul,blue,A1,adjective,blue ocean
100,verde,green,A1,adjective,green grass
101,aunque,although,A2,conjunction,NONE
102,sin embargo,however,A2,conjunction,NONE
103,viajar,to travel,A2,verb,traveler with suitcase
104,montaña,mountain,A2,noun,snowy mountain
105,ciudad,city,A2,noun,city skyline
106,rápido,fast,A2,adjective,fast sports car
107,aeropuerto,airport,A2,noun,airport terminal
108,maleta,suitcase,A2,noun,travel suitcase
109,pasaporte,passport,A2,noun,passport book
110,billete,ticket,A2,noun,travel ticket
111,vuelo,flight,A2,noun,airplane flying
112,equipaje,luggage,A2,noun,luggage bags
113,mapa,map,A2,noun,world map
114,camino,path,A2,noun,walking path forest
115,pueblo,town,A2,noun,small village town
116,bosque,forest,A2,noun,dense forest trees
117,río,river,A2,noun,flowing river
118,lago,lake,A2,noun,calm lake water
119,isla,island,A2,noun,tropical island
120,mar,sea,A2,noun,blue sea waves
121,campo,countryside,A2,noun,green countryside field
122,lluvia,rain,A2,noun,rain drops window
123,nieve,snow,A2,noun,falling snow winter
124,viento,wind,A2,noun,windy weather trees
125,nube,cloud,A2,noun,white cloud sky
126,fuego,fire,A2,noun,burning campfire
127,tierra,earth,A2,noun,soil ground
128,desierto,desert,A2,noun,desert sand dunes
129,flor,flower,A2,noun,blooming flower
130,hoja,leaf,A2,noun,green plant leaf
131,pájaro,bird,A2,noun,flying bird
132,caballo,horse,A2,noun,running horse
133,vaca,cow,A2,noun,farm cow
134,oveja,sheep,A2,noun,flock of sheep
135,cerdo,pig,A2,noun,pink farm pig
136,león,lion,A2,noun,male lion
137,elefante,elephant,A2,noun,wild elephant
138,mariposa,butterfly,A2,noun,butterfly flower
139,pantalla,screen,A2,noun,computer monitor
140,teclado,keyboard,A2,noun,computer keyboard
141,ratón,computer mouse,A2,noun,computer mouse
142,teléfono,phone,A2,noun,smartphone
143,ordenador,computer,A2,noun,laptop computer
144,cámara,camera,A2,noun,photo camera
145,periódico,newspaper,A2,noun,printed newspaper
146,carta,letter,A2,noun,envelope letter
147,mensaje,message,A2,noun,text message phone
148,trabajo,job,A2,noun,office worker laptop
149,oficina,office,A2,noun,modern office desk
150,jefe,boss,A2,noun,business manager
151,reunión,meeting,A2,noun,business meeting table
152,empresa,company,A2,noun,corporate office building
153,dinero,money,A2,noun,cash money paper
154,tarjeta,credit card,A2,noun,credit card
155,precio,price,A2,noun,price tag
156,compras,shopping,A2,noun,shopping bags
157,regalo,gift,A2,noun,wrapped gift box
158,llave,key,A2,noun,door key
159,caja,box,A2,noun,cardboard box
160,bolsillo,pocket,A2,noun,jeans pocket
161,botella,bottle,A2,noun,glass bottle
162,vaso,drinking glass,A2,noun,empty glass
163,plato,plate,A2,noun,ceramic dinner plate
164,cuchara,spoon,A2,noun,metal spoon
165,tenedor,fork,A2,noun,metal fork
166,cuchillo,knife,A2,noun,kitchen knife
167,servilleta,napkin,A2,noun,table napkin
168,desayuno,breakfast,A2,noun,morning breakfast table
169,almuerzo,lunch,A2,noun,lunch meal plate
170,cena,dinner,A2,noun,evening dinner table
171,camarote,cabin,A2,noun,ship cabin bedroom
172,médico,doctor,A2,noun,doctor with stethoscope
173,enfermera,nurse,A2,noun,hospital nurse
174,medicina,medicine,A2,noun,medicine pills
175,dolor,pain,A2,noun,person headache pain
176,enfermo,sick,A2,adjective,sick person bed
177,sano,healthy,A2,adjective,healthy athletic person
178,cuerpo,body,A2,noun,human body silhouette
179,corazón,heart,A2,noun,human heart model
180,sangre,blood,A2,noun,blood drop
181,canción,song,A2,noun,singing microphone stage
182,película,movie,A2,noun,cinema movie theater
183,teatro,theater,A2,noun,theater stage curtains
184,arte,art,A2,noun,oil painting canvas
185,deporte,sport,A2,noun,sports equipment balls
186,fútbol,soccer,A2,noun,soccer ball field
187,baloncesto,basketball,A2,noun,basketball hoop
188,natación,swimming,A2,noun,swimmer swimming pool
189,carrera,race,A2,noun,runners track race
190,ganador,winner,A2,noun,winner holding trophy
191,tiempo,weather,A2,noun,sunny weather forecast
192,hora,hour,A2,noun,clock showing time
193,minuto,minute,A2,noun,stopwatch timer
194,segundo,second,A2,noun,digital timer
195,ayer,yesterday,A2,adverb,NONE
196,hoy,today,A2,adverb,NONE
197,mañana,tomorrow,A2,adverb,NONE
198,siempre,always,A2,adverb,NONE
199,nunca,never,A2,adverb,NONE
200,quizás,maybe,A2,adverb,NONE`;

const lines = csvContent.trim().split('\n').map((l) => l.trim()).filter(Boolean);

const words = [];
let a1 = 0;
let a2 = 0;

for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(',');
  const id = parseInt(cols[0], 10);
  const spanish = cols[1];
  const english = cols[2];
  const level = cols[3];
  const pos = cols[4];
  const query = cols[5];

  if (level === 'A1') a1++;
  if (level === 'A2') a2++;

  const enabled = query !== 'NONE';

  words.push({
    id,
    spanish,
    english,
    level,
    partOfSpeech: pos,
    imageQuery: enabled ? query : spanish,
    image: {
      enabled,
      source: enabled ? 'pexels' : null,
      url: null,
      photographer: null,
      photographerUrl: null,
      pexelsUrl: null,
    },
  });
}

console.log(`Parsed ${words.length} items. A1: ${a1}, A2: ${a2}`);

fs.writeFileSync('data/words.json', JSON.stringify(words, null, 2), 'utf-8');
fs.writeFileSync('data/vocab_200.csv', csvContent, 'utf-8');

console.log('Updated data/words.json and data/vocab_200.csv!');
