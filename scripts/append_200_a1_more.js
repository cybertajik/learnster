const fs = require('fs');

const new_a1_csv = `id,spanish,english,level,partOfSpeech,imageQuery
401,abrir,to open,A1,verb,hand opening door
402,cerrar,to close,A1,verb,hand closing door
403,mirar,to look at,A1,verb,person looking through binoculars
404,escuchar,to listen,A1,verb,person listening with headphones
405,hablar,to speak,A1,verb,two people talking
406,caminar,to walk,A1,verb,person walking park
407,comprar,to buy,A1,verb,person buying groceries
408,vender,to sell,A1,verb,merchant selling market
409,pagar,to pay,A1,verb,hand paying money cash
410,buscar,to search,A1,verb,person searching with magnifying glass
411,encontrar,to find,A1,verb,finding hidden treasure box
412,preguntar,to ask,A1,verb,student raising hand question
413,responder,to answer,A1,verb,person answering telephone
414,entrar,to enter,A1,verb,person entering door
415,salir,to exit,A1,verb,person exiting building door
416,llegar,to arrive,A1,verb,airplane arriving airport
417,llevar,to carry,A1,verb,person carrying heavy box
418,traer,to bring,A1,verb,waiter bringing food plate
419,tomar,to take,A1,verb,hand taking glass of water
420,dar,to give,A1,verb,giving gift box
421,amar,to love,A1,verb,holding red heart
422,gustar,to like,A1,verb,thumbs up like
423,querer,to want,A1,verb,child wanting ice cream
424,necesitar,to need,A1,verb,thirsty person needing water
425,saber,to know,A1,verb,brain lightbulb knowing
426,conocer,to meet,A1,verb,two people shaking hands
427,pensar,to think,A1,verb,person thinking idea
428,creer,to believe,A1,verb,person praying belief
429,esperar,to wait,A1,verb,person waiting at bus stop
430,recordar,to remember,A1,verb,remembering memory thought
431,olvidar,to forget,A1,verb,forgetful person scratching head
432,aprender,to learn,A1,verb,student studying books
433,enseñar,to teach,A1,verb,teacher teaching blackboard
434,estudiar,to study,A1,verb,student studying desk
435,trabajar,to work,A1,verb,office worker laptop
436,jugar,to play,A1,verb,children playing park
437,cantar,to sing,A1,verb,singer singing microphone
438,bailar,to dance,A1,verb,couple dancing tango
439,nadar,to swim,A1,verb,person swimming pool
440,reír,to laugh,A1,verb,person laughing happily
441,llorar,to cry,A1,verb,person crying tear drops
442,sonreír,to smile,A1,verb,happy smiling face
443,ayudar,to help,A1,verb,helping person up
444,limpiar,to clean,A1,verb,person cleaning window
445,lavar,to wash,A1,verb,washing hands soap water
446,cortar,to cut,A1,verb,scissors cutting paper
447,romper,to break,A1,verb,broken glass plate
448,arreglar,to fix,A1,verb,mechanic fixing car engine
449,organizar,to organize,A1,verb,organizing desk folders
450,preparar,to prepare,A1,verb,chef preparing food
451,plato,dish,A1,noun,ceramic food dish
452,taza,mug,A1,noun,coffee mug cup
453,vaso,glass,A1,noun,clear drinking glass
454,cuchillo,kitchen knife,A1,noun,sharp kitchen knife
455,tenedor,eating fork,A1,noun,metal eating fork
456,cuchara,soup spoon,A1,noun,metal soup spoon
457,servilleta,paper napkin,A1,noun,white paper napkin
458,mantel,tablecloth,A1,noun,dining tablecloth
459,cocina,stove,A1,noun,kitchen gas stove
460,horno,oven,A1,noun,kitchen baking oven
461,nevera,refrigerator,A1,noun,kitchen refrigerator fridge
462,microondas,microwave,A1,noun,kitchen microwave oven
463,sartén,frying pan,A1,noun,black frying pan
464,olla,cooking pot,A1,noun,metal cooking pot
465,almuerzo,lunch meal,A1,noun,sandwich lunch plate
466,cena,dinner meal,A1,noun,family dinner table
467,desayuno,breakfast meal,A1,noun,pancakes breakfast coffee
468,merienda,afternoon snack,A1,noun,fruit snack plate
469,postre,dessert,A1,noun,chocolate cake dessert
470,helado,ice cream,A1,noun,delicious ice cream cone
471,pastel,cake,A1,noun,birthday cake candles
472,galleta,cookie,A1,noun,chocolate chip cookie
473,chocolate,chocolate,A1,noun,dark chocolate bar
474,caramelo,candy,A1,noun,sweet colorful candy
475,mermelada,jam,A1,noun,strawberry jam jar
476,mantequilla,butter,A1,noun,stick of yellow butter
477,aceite,cooking oil,A1,noun,bottle of olive oil
478,vinagre,vinegar,A1,noun,bottle of vinegar
479,pimienta,black pepper,A1,noun,black pepper shaker
480,ajo,garlic,A1,noun,garlic bulb
481,cebolla,onion,A1,noun,fresh yellow onion
482,tomate,tomato,A1,noun,ripe red tomato
483,patata,potato,A1,noun,fresh raw potatoes
484,zanahoria,carrot,A1,noun,fresh orange carrots
485,lechuga,lettuce,A1,noun,fresh green lettuce
486,pepino,cucumber,A1,noun,fresh green cucumber
487,maíz,corn,A1,noun,yellow corn cob
488,fresa,strawberry,A1,noun,fresh red strawberry
489,plátano,banana,A1,noun,yellow banana bunch
490,naranja,orange,A1,noun,fresh ripe orange
491,limón,lemon,A1,noun,yellow lemon fruit
492,uva,grape,A1,noun,bunch of purple grapes
493,manzana verde,green apple,A1,noun,fresh green apple
494,sandía,watermelon,A1,noun,slice of fresh watermelon
495,melón,melon,A1,noun,fresh sweet melon
496,piña,pineapple,A1,noun,fresh tropical pineapple
497,melocotón,peach,A1,noun,fresh ripe peach
498,cereza,cherry,A1,noun,red sweet cherries
499,pera,pear,A1,noun,fresh green pear
500,coco,coconut,A1,noun,tropical coconut palm
501,ropa,clothing,A1,noun,clothing rack shirts
502,abrigo,coat,A1,noun,warm winter coat
503,chaqueta,jacket,A1,noun,leather jacket
504,jersey,sweater,A1,noun,knit winter sweater
505,falda,skirt,A1,noun,women skirt
506,calcetín,sock,A1,noun,pair of socks
507,bota,boot,A1,noun,leather winter boots
508,zapatilla,sneaker,A1,noun,running sneakers shoes
509,guante,glove,A1,noun,winter gloves
510,bufanda,scarf,A1,noun,warm winter scarf
511,gora,cap,A1,noun,baseball cap hat
512,cinturón,belt,A1,noun,leather waist belt
513,corbata,tie,A1,noun,men necktie suit
514,pijama,pajamas,A1,noun,comfortable pajamas
515,traje,suit,A1,noun,business suit tie
516,traje de baño,swimsuit,A1,noun,beach swimsuit
517,gafas,glasses,A1,noun,eyeglasses frame
518,gafas de sol,sunglasses,A1,noun,stylish sunglasses
519,anillo,ring,A1,noun,gold jewelry ring
520,collar,necklace,A1,noun,silver necklace jewelry
521,pendiente,earring,A1,noun,gold hoop earrings
522,reloj de pared,wall clock,A1,noun,analog wall clock
523,llave de agua,faucet,A1,noun,water bathroom faucet
524,espejo,mirror,A1,noun,wall bathroom mirror
525,toalla,towel,A1,noun,folded bath towel
526,jabón,soap,A1,noun,bar of hand soap
527,champú,shampoo,A1,noun,bottle of hair shampoo
528,cepillo,brush,A1,noun,hair brush
529,cepillo de dientes,toothbrush,A1,noun,dental toothbrush
530,pasta de dientes,toothpaste,A1,noun,tube of toothpaste
531,peine,comb,A1,noun,plastic hair comb
532,almohada,pillow,A1,noun,soft bed pillow
533,sábana,bedsheet,A1,noun,clean white bedsheet
534,manta,blanket,A1,noun,cozy warm blanket
535,sofá,sofa,A1,noun,comfortable living room sofa
536,sillón,armchair,A1,noun,comfy leather armchair
537,lámpara,lamp,A1,noun,table reading lamp
538,estante,bookshelf,A1,noun,wooden bookshelf books
539,cuadro,painting,A1,noun,framed wall painting
540,alfombra,carpet,A1,noun,living room area rug
541,cortina,curtain,A1,noun,window drapes curtain
542,techo,ceiling,A1,noun,room ceiling light
543,pared,wall,A1,noun,brick room wall
544,suelo,floor,A1,noun,wooden floor tiles
545,escalera,stairs,A1,noun,wooden indoor staircase
546,ascensor,elevator,A1,noun,modern glass elevator
547,pasillo,hallway,A1,noun,bright house hallway
548,garaje,garage,A1,noun,car garage house
549,balcón,balcony,A1,noun,apartment balcony view
550,terraza,terrace,A1,noun,outdoor patio terrace
551,primavera,spring season,A1,noun,spring flowers blooming
552,verano,summer season,A1,noun,sunny beach summer
553,otoño,autumn season,A1,noun,autumn golden leaves forest
554,invierno,winter season,A1,noun,snowy winter trees
555,enero,january,A1,noun,calendar january
556,febrero,february,A1,noun,calendar february
557,marzo,march,A1,noun,calendar march
558,abril,april,A1,noun,calendar april
559,mayo,may,A1,noun,calendar may
560,junio,june,A1,noun,calendar june
561,julio,july,A1,noun,calendar july
562,agosto,august,A1,noun,calendar august
563,septiembre,september,A1,noun,calendar september
564,octubre,october,A1,noun,calendar october
565,noviembre,november,A1,noun,calendar november
566,diciembre,december,A1,noun,calendar december
567,lunes,monday,A1,noun,NONE
568,martes,tuesday,A1,noun,NONE
569,miércoles,wednesday,A1,noun,NONE
570,jueves,thursday,A1,noun,NONE
571,viernes,friday,A1,noun,NONE
572,sábado,saturday,A1,noun,NONE
573,domingo,sunday,A1,noun,NONE
574,mañana temprano,early morning,A1,noun,early morning sunrise
575,tarde,afternoon,A1,noun,sunny afternoon park
576,noche,night time,A1,noun,starry night sky
577,medianoche,midnight,A1,noun,midnight clock 12
578,mediodía,noon,A1,noun,bright noon sun clock
579,semana,week,A1,noun,weekly calendar page
580,mes,month,A1,noun,monthly calendar page
581,año,year,A1,noun,new year fireworks
582,siglo,century,A1,noun,historical timeline century
583,hoy por la mañana,this morning,A1,phrase,morning coffee window
584,esta tarde,this afternoon,A1,phrase,afternoon walking street
585,esta noche,tonight,A1,phrase,city lights tonight
586,ahora,now,A1,adverb,NONE
587,luego,later,A1,adverb,NONE
588,antes,before,A1,adverb,NONE
589,después,after,A1,adverb,NONE
590,pronto,soon,A1,adverb,NONE
591,tarde adverbio,late,A1,adverb,running late clock
592,temprano,early,A1,adverb,early alarm clock
593,aquí,here,A1,adverb,NONE
594,allí,there,A1,adverb,NONE
595,cerca,near,A1,adverb,two close objects
596,lejos,far,A1,adverb,distant horizon road
597,arriba,up,A1,adverb,arrow pointing up
598,abajo,down,A1,adverb,arrow pointing down
599,dentro,inside,A1,adverb,box open inside
600,fuera,outside,A1,adverb,outside garden patio`;

// Load existing 400 words from data/words.json
const existingWords = JSON.parse(fs.readFileSync('data/words.json', 'utf-8'));
const existingCsv = fs.readFileSync('data/vocab_400.csv', 'utf-8');

const existingSpanishSet = new Set(existingWords.map((w) => w.spanish.toLowerCase().trim()));

const new_lines = new_a1_csv.trim().split('\n').slice(1);

const newWords = [];
let addedCount = 0;

for (const line of new_lines) {
  if (!line.trim()) continue;
  const cols = line.split(',');
  const id = parseInt(cols[0], 10);
  const spanish = cols[1];
  const english = cols[2];
  const level = cols[3];
  const pos = cols[4];
  const query = cols[5];

  const enabled = query !== 'NONE';

  newWords.push({
    id,
    spanish,
    english,
    level: 'A1',
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
  addedCount++;
}

const allWords = [...existingWords, ...newWords];
const fullCsv = existingCsv.trim() + '\n' + new_lines.join('\n');

fs.writeFileSync('data/words.json', JSON.stringify(allWords, null, 2), 'utf-8');
fs.writeFileSync('data/vocab_600.csv', fullCsv, 'utf-8');

console.log(`Successfully added ${addedCount} new A1 words! Total dataset: ${allWords.length} words.`);
