const fs = require('fs');

const new_a2_csv = `id,spanish,english,level,partOfSpeech,imageQuery
601,acostarse,to go to bed,A2,verb,person going to bed sleep
602,levantarse,to get up,A2,verb,person getting out of bed morning
603,ducharse,to take a shower,A2,verb,person taking shower
604,bañarse,to take a bath,A2,verb,person in bathtub bath
605,vestirse,to get dressed,A2,verb,person putting on jacket
606,peinarse,to comb hair,A2,verb,person combing hair mirror
607,afeitarse,to shave,A2,verb,man shaving beard
608,maquillarse,to put on makeup,A2,verb,woman applying makeup mirror
609,despertarse,to wake up,A2,verb,person waking up stretching
610,dormirse,to fall asleep,A2,verb,person sleeping bed
611,sentarse,to sit down,A2,verb,person sitting chair
612,levantarse de la silla,to stand up,A2,verb,person standing up from chair
613,quedarse,to stay,A2,verb,person staying cozy home
614,irse,to leave,A2,verb,person leaving wave goodbye
615,acordarse,to remember,A2,verb,lightbulb moment memory
616,enfermarse,to fall sick,A2,verb,sick person bed flu
617,curarse,to heal,A2,verb,doctor healing patient
618,quejarse,to complain,A2,verb,person complaining frustrated
619,divertirse,to have fun,A2,verb,friends having fun party
620,aburrirse,to get bored,A2,verb,bored student desk
621,preocuparse,to worry,A2,verb,worried person holding head
622,relajarse,to relax,A2,verb,person relaxing beach hammock
623,cansarse,to get tired,A2,verb,tired runner resting
624,asustarse,to get scared,A2,verb,surprised scared expression
625,enamorarse,to fall in love,A2,verb,romantic couple holding hands
626,casarse,to get married,A2,verb,bride groom wedding
627,mudarse,to move house,A2,verb,moving boxes house truck
628,acostumbrarse,to get used to,A2,verb,person adapting new city
629,equivocarse,to make a mistake,A2,verb,erasing pencil mistake
630,sorprenderse,to be surprised,A2,verb,surprised happy face
631,aeropuerto,airport,A2,noun,airplane airport terminal
632,estación de tren,train station,A2,noun,train platform station
633,estación de autobuses,bus station,A2,noun,bus station passengers
634,puerto,harbor,A2,noun,ships harbor port
635,billete,ticket,A2,noun,bus train travel ticket
636,pasaje,boarding pass,A2,noun,airline boarding pass
637,equipaje,luggage,A2,noun,suitcases baggage travel
638,maleta,suitcase,A2,noun,travel suitcase wheels
639,mochila,backpack,A2,noun,hiking backpack travel
640,bolso,handbag,A2,noun,stylish leather handbag
641,mapa,map,A2,noun,world travel map
642,guía turística,tourist guide,A2,noun,travel guide book
643,excursión,excursion,A2,noun,group hiking nature
644,vuelo,flight,A2,noun,airplane flying sky
645,retraso,delay,A2,noun,airport flight delay sign
646,salida,departure,A2,noun,airport departure board
647,llegada,arrival,A2,noun,airport arrival gate
648,aduana,customs,A2,noun,airport customs security
649,pasaporte,passport,A2,noun,international passport stamps
650,visado,visa,A2,noun,passport visa stamp
651,hotel,hotel,A2,noun,modern hotel exterior
652,recepción,reception desk,A2,noun,hotel lobby reception
653,habitación individual,single room,A2,noun,hotel single bedroom
654,habitación doble,double room,A2,noun,hotel double bedroom bed
655,llave de la habitación,room key,A2,noun,hotel room key card
656,ascensor del hotel,hotel elevator,A2,noun,hotel elevator hall
657,piscina,swimming pool,A2,noun,resort swimming pool
658,gimnasio,gym,A2,noun,fitness gym weights
659,restaurante,restaurant,A2,noun,dining restaurant table
660,camarero,waiter,A2,noun,restaurant waiter serving food
661,menú del día,menu of the day,A2,noun,restaurant menu board
662,cuenta,bill check,A2,noun,restaurant receipt bill
663,propina,tip money,A2,noun,cash tip on table
664,plato principal,main course,A2,noun,gourmet main dish
665,entrada,appetizer,A2,noun,fresh starter salad
666,postre del día,dessert of the day,A2,noun,delicious cake slice
667,bebida,beverage,A2,noun,glass of cold drink
668,agua mineral,mineral water,A2,noun,bottle of mineral water
669,zumo de naranja,orange juice,A2,noun,glass of orange juice
670,vino tinto,red wine,A2,noun,glass of red wine
671,vino blanco,white wine,A2,noun,glass of white wine
672,cerveza,beer,A2,noun,glass of cold beer
673,café con leche,coffee with milk,A2,noun,cup of latte coffee
674,té verde,green tea,A2,noun,cup of green tea
675,hielo,ice cubes,A2,noun,glass with ice cubes
676,azúcar,sugar,A2,noun,sugar bowl spoon
677,sal,table salt,A2,noun,salt shaker table
678,pan fresco,fresh bread,A2,noun,loaf of fresh bread
679,sopa caliente,hot soup,A2,noun,bowl of hot vegetable soup
680,ensalada mixta,mixed salad,A2,noun,fresh mixed salad bowl
681,carne de ternera,beef meat,A2,noun,grilled beef steak
682,pollo asado,roast chicken,A2,noun,roasted chicken platter
683,pescado fresco,fresh fish,A2,noun,grilled salmon fish
684,marisco,seafood,A2,noun,seafood paella dish
685,arroz con pollo,chicken rice,A2,noun,spanish chicken rice paella
686,tortilla española,spanish omelette,A2,noun,spanish potato omelette
687,queso manchego,manchego cheese,A2,noun,spanish manchego cheese wedge
688,jamón serrano,cured ham,A2,noun,sliced spanish cured ham
689,aceitunas,olives,A2,noun,bowl of green olives
690,tapas,tapas appetizers,A2,noun,assorted spanish tapas
691,supermercado,supermarket,A2,noun,grocery supermarket aisles
692,tienda de ropa,clothing store,A2,noun,fashion clothing boutique
693,zapatería,shoe store,A2,noun,shoe shop display
694,panadería,bakery,A2,noun,bakery bread display
695,carnicería,butcher shop,A2,noun,butcher counter meat
696,pescadería,fish market,A2,noun,fresh fish market stall
697,frutería,fruit shop,A2,noun,colorful fruit shop market
698,farmacia de guardia,duty pharmacy,A2,noun,pharmacy green cross sign
699,librería,bookstore,A2,noun,cozy bookstore shelves
700,papelería,stationery shop,A2,noun,notebooks pens stationery shop
701,centro comercial,shopping mall,A2,noun,modern shopping mall interior
702,cajero automático,atm machine,A2,noun,bank atm machine cash
703,banco,bank institution,A2,noun,bank building vault
704,oficina de correos,post office,A2,noun,post office mailbox
705,comisaría,police station,A2,noun,police station building
706,hospital,hospital building,A2,noun,hospital entrance ambulance
707,clínica,medical clinic,A2,noun,doctor clinic waiting room
708,dentista,dentist,A2,noun,dentist chair examination
709,veterinario,vet doctor,A2,noun,vet examining puppy
710,peluquería,hair salon,A2,noun,hair salon hairdresser haircut
711,taller mecánico,repair shop,A2,noun,auto repair mechanic garage
712,gasolinera,gas station,A2,noun,fuel pump gas station
713,lavandería,laundromat,A2,noun,washing machines laundromat
714,cine de verano,outdoor cinema,A2,noun,outdoor movie screen night
715,teatro,theater,A2,noun,theater stage curtains
716,museo de arte,art museum,A2,noun,art museum gallery paintings
717,biblioteca pública,public library,A2,noun,quiet public library study
718,parque de atracciones,amusement park,A2,noun,roller coaster amusement park
719,zoológico,zoo,A2,noun,zoo giraffes animals
720,estadio de fútbol,soccer stadium,A2,noun,packed football stadium
721,gimnasio deportivo,sports center,A2,noun,indoor basketball court
722,pista de tenis,tennis court,A2,noun,outdoor tennis court net
723,campo de golf,golf course,A2,noun,green golf course flag
724,playa de arena,sandy beach,A2,noun,golden sandy beach ocean
725,montaña nevada,snowy mountain,A2,noun,snowy mountain peak
726,bosque verde,green forest,A2,noun,lush green forest trees
727,río caudaloso,river,A2,noun,flowing mountain river
728,lago azul,blue lake,A2,noun,serene blue mountain lake
729,isla tropical,tropical island,A2,noun,tropical island palm beach
730,desierto,desert,A2,noun,sand dunes desert sunset
731,soleado,sunny,A2,adjective,bright sunny day
732,nublado,cloudy,A2,adjective,cloudy sky landscape
733,lluvioso,rainy,A2,adjective,rainy street umbrellas
734,tormenta,storm,A2,noun,thunderstorm lightning sky
735,nieve,snow,A2,noun,snow falling winter
736,viento,wind,A2,noun,wind blowing trees
737,niebla,fog,A2,noun,misty foggy forest
738,temperatura,temperature,A2,noun,outdoor thermometer temperature
739,calor,heat,A2,noun,bright hot sun beach
740,frío,coldness,A2,noun,icicles cold winter
741,primaveral,spring-like,A2,adjective,blooming spring field
742,veraniego,summer-like,A2,adjective,summer pool party
743,otoñal,autumnal,A2,adjective,autumn leaf path
744,invernal,wintry,A2,adjective,wintry snow village
745,madrugada,early morning hours,A2,noun,dark early morning sky
746,atardecer,sunset,A2,noun,golden ocean sunset
747,amanecer,sunrise,A2,noun,mountain sunrise dawn
748,horario,schedule,A2,noun,weekly timetable schedule
749,calendario,calendar,A2,noun,desk wall calendar
750,reloj de pulsera,wristwatch,A2,noun,mens wristwatch arm
751,alarma,alarm clock,A2,noun,bedside alarm clock
752,minuto,minute,A2,noun,stopwatch minute count
753,segundo,second,A2,noun,digital timer seconds
754,hora puntual,exact time,A2,noun,clock hand exact hour
755,durante el día,during the day,A2,phrase,bright daytime street
756,por la noche,at night,A2,phrase,city street night lights
757,a medianoche,at midnight,A2,phrase,clock striking 12 night
758,a tiempo,on time,A2,phrase,person catching train on time
759,con retraso,delayed,A2,phrase,waiting passenger clock
760,de repente,suddenly,A2,adverb,NONE
761,por fin,at last,A2,adverb,celebrating finishing race
762,al principio,at first,A2,adverb,NONE
763,al final,in the end,A2,adverb,finish line banner
764,mientras tanto,meanwhile,A2,adverb,NONE
765,sin embargo,however,A2,adverb,NONE
766,por lo tanto,therefore,A2,adverb,NONE
767,además,furthermore,A2,adverb,NONE
768,tampoco,neither,A2,adverb,NONE
769,todavía,still,A2,adverb,NONE
770,ya no,no longer,A2,adverb,NONE
771,casi siempre,almost always,A2,adverb,NONE
772,de vez en cuando,once in a while,A2,adverb,NONE
773,pocas veces,rarely,A2,adverb,NONE
774,en todas partes,everywhere,A2,adverb,world globe travel
775,en ninguna parte,nowhere,A2,adverb,empty quiet desert
776,en algún lugar,somewhere,A2,adverb,pin point world map
777,hacia adelante,forward,A2,adverb,arrow pointing forward
778,hacia atrás,backward,A2,adverb,arrow pointing backward
779,a la izquierda,to the left,A2,phrase,road sign turn left
780,a la derecha,to the right,A2,phrase,road sign turn right
781,todo recto,straight ahead,A2,phrase,straight highway road
782,en la esquina,on the corner,A2,phrase,street corner building
783,al lado de,next to,A2,phrase,two houses side by side
784,enfrente de,in front of,A2,phrase,person standing in front house
785,detrás de,behind,A2,phrase,cat behind chair
786,debajo de,underneath,A2,phrase,dog sleeping under table
787,encima de,on top of,A2,phrase,cat sitting on top box
788,entre dos,between two,A2,phrase,object between two boxes
789,alrededor de,around,A2,phrase,people sitting around campfire
790,a través de,through,A2,phrase,sunlight shining through window
791,amable,kind,A2,adjective,kind person helping elder
792,simpático,nice friendly,A2,adjective,friendly person smiling
793,antipático,unfriendly,A2,adjective,grumpy person frowning
794,inteligente,intelligent,A2,adjective,smart student lightbulb
795,tonto,foolish,A2,adjective,playful funny expression
796,trabajador,hardworking,A2,adjective,hardworking craftsman
797,perezoso,lazy,A2,adjective,lazy person sleeping couch
798,generoso,generous,A2,adjective,generous person sharing food
799,tacaño,stingy,A2,adjective,person hoarding coins
800,divertido,funny amusing,A2,adjective,funny comedian performance`;

// Load existing 600 words from data/words.json
const existingWords = JSON.parse(fs.readFileSync('data/words.json', 'utf-8'));
const existingCsv = fs.readFileSync('data/vocab_600.csv', 'utf-8');

const new_lines = new_a2_csv.trim().split('\n').slice(1);
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
    level: 'A2',
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
fs.writeFileSync('data/vocab_800.csv', fullCsv, 'utf-8');

console.log(`Successfully added ${addedCount} new A2 words! Total dataset: ${allWords.length} words.`);
