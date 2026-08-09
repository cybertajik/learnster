const fs = require('fs');

const new_b2_csv = `id,spanish,english,level,partOfSpeech,imageQuery
1001,abrumador,overwhelming,B2,adjective,overwhelming mountain wave
1002,abstracción,abstraction,B2,noun,abstract modern painting
1003,absurdo,absurd,B2,adjective,surreal surrealist artwork
1004,aceleración,acceleration,B2,noun,speedometer acceleration car
1005,acentuar,to accentuate,B2,verb,highlighting text marker
1006,aclaración,clarification,B2,noun,clearing up confusion document
1007,acogida,reception welcome,B2,noun,warm welcoming hug
1008,acomodación,accommodation,B2,noun,hotel accommodation bedroom
1009,acontecimiento,event occurrence,B2,noun,historic news event
1010,acreditación,accreditation,B2,noun,official accreditation badge
1011,actuación,performance,B2,noun,stage actor performance
1012,adaptabilidad,adaptability,B2,noun,chameleon changing color
1013,adecuación,adequacy,B2,noun,perfect puzzle piece fit
1014,adherirse,to adhere,B2,verb,glue adhering paper
1015,adquisición,acquisition,B2,noun,company merger acquisition
1016,adverso,adverse,B2,adjective,stormy adverse weather
1017,afirmación,affirmation,B2,noun,thumbs up agreement
1018,afrontar,to confront face,B2,verb,person facing mountain storm
1019,agudeza,sharpness acuteness,B2,noun,sharp eye vision test
1020,aislar,to isolate,B2,verb,soundproofing room insulation
1021,alegación,allegation,B2,noun,courtroom legal claim
1022,alineación,alignment,B2,noun,planets solar alignment
1023,alucinación,hallucination,B2,noun,surreal dream illusion
1024,ambigüedad,ambiguity,B2,noun,foggy fork in road
1025,analógico,analog,B2,adjective,vintage analog clock gears
1026,anomalía,anomaly,B2,noun,odd red puzzle piece anomaly
1027,antagonista,antagonist,B2,noun,chess opponent adversary
1028,anticipación,anticipation,B2,noun,eager child waiting gift
1029,antítesis,antithesis,B2,noun,sun and moon opposition
1030,aparente,apparent,B2,adjective,mirage desert illusion
1031,apreciable,appreciable,B2,adjective,growing plant chart
1032,aprobatorio,approving,B2,adjective,green checkmark seal
1033,arbitrario,arbitrary,B2,adjective,rolling random dice
1034,argumentación,argumentation,B2,noun,debate team speaking
1035,armado,armed,B2,adjective,medieval armor knight
1036,arrogancia,arrogance,B2,noun,pompous haughty expression
1037,articulación,articulation,B2,noun,anatomical joint skeletal
1038,artificialidad,artificiality,B2,noun,glowing neon light plant
1039,asegurable,insurable,B2,adjective,shield protection document
1040,asimetría,asymmetry,B2,noun,asymmetrical geometric shape
1041,asimilación,assimilation,B2,noun,sponge absorbing water
1042,asociativo,associative,B2,noun,connected brain network
1043,asombroso,astonishing,B2,adjective,starry night galaxy view
1044,astucia,cunning astuteness,B2,noun,clever fox animal
1045,atenuar,to attenuate soften,B2,verb,dimming light slider
1046,atípico,atypical,B2,adjective,black sheep unique flock
1047,atractivo visual,visual appeal,B2,noun,stunning colorful artwork
1048,atributo,attribute,B2,noun,golden crown royalty emblem
1049,audaz,bold daring,B2,adjective,rock climber brave leap
1050,autonomía,autonomy,B2,noun,bird flying out cage
1051,avanzado,advanced,B2,adjective,futuristic quantum computer
1052,avistamiento,sighting,B2,noun,spotting whale ocean
1053,balance,balance sheet,B2,noun,financial balance scale
1054,banca,banking sector,B2,noun,financial district bank
1055,bancarrota,bankruptcy,B2,noun,broken piggy bank empty
1056,barrera,barrier,B2,noun,roadblock barrier sign
1057,bastan,sufficient,B2,adjective,filled measure cup
1058,bienestar,wellbeing,B2,noun,peaceful yoga sunrise
1059,bipolaridad,bipolarity,B2,noun,two contrasting masks drama
1060,bomba,pump,B2,noun,water pump industrial
1061,brote,outbreak,B2,noun,green sprout soil
1062,búsqueda activa,active search,B2,noun,magnifying glass map search
1063,cableado,wiring,B2,noun,complex electrical wiring
1064,caducidad,expiration,B2,noun,calendar expiration date
1065,calibración,calibration,B2,noun,precision dial tuning
1066,camuflaje,camouflage,B2,noun,chameleon camouflage leaf
1067,canalización,channeling,B2,noun,water canal aqueduct
1068,cáncer,cancer research,B2,noun,medical research microscope
1069,candidatura,candidacy,B2,noun,election ballot box
1070,caos,chaos,B2,noun,chaotic swirling colors
1071,capitalismo feroz,wild capitalism,B2,noun,stock market ticker exchange
1072,cápsula,capsule,B2,noun,space capsule orbit
1073,caracterización,characterization,B2,noun,theatrical makeup stage
1074,carencia,shortage lack,B2,noun,dry cracked desert earth
1075,carga,cargo load,B2,noun,freight ship container
1076,cátedra,professorship,B2,noun,university lecture auditorium
1077,cauce,riverbed channel,B2,noun,winding riverbed rocks
1078,cautela,caution,B2,noun,walking carefully ice
1079,cavidad,cavity,B2,noun,deep cave opening
1080,celeste,celestial,B2,adjective,celestial star galaxy
1081,célula,biological cell,B2,noun,microscopic living cell
1082,censura,censorship,B2,noun,censored document bar
1083,certeza,certainty,B2,noun,solid concrete block
1084,chasis,chassis,B2,noun,car metal chassis frame
1085,ciclón,cyclone,B2,noun,whirling ocean cyclone
1086,circuito,electronic circuit,B2,noun,microchip circuit board
1087,circular,circular,B2,adjective,circular geometric design
1088,circulante,circulating,B2,adjective,currency paper cash
1089,citación,subpoena citation,B2,noun,official court document
1090,civilización,civilization,B2,noun,ancient maya pyramid
1091,clamor,clamor,B2,noun,cheering crowd stadium
1092,clarividencia,clairvoyance,B2,noun,glowing crystal ball
1093,cláusula,contract clause,B2,noun,legal contract document
1094,cohesión,cohesion,B2,noun,united team hands
1095,coincidencia,coincidence,B2,noun,two identical clocks
1096,colectivo,collective,B2,noun,group community unity
1097,colosal,colossal,B2,adjective,massive giza pyramid
1098,columna vertebral,spine,B2,noun,human spine skeleton
1099,combustión,combustion,B2,noun,flaming fire combustion
1100,cometa,comet,B2,noun,glowing comet sky
1101,compartimento,compartment,B2,noun,luggage compartment train
1102,compatibilidad,compatibility,B2,noun,puzzle pieces locking
1103,compensación,compensation,B2,noun,scales of balance equal
1104,competitividad,competitiveness,B2,noun,sprinters starting block
1105,complementario,complementary,B2,adjective,yin yang harmony
1106,complicidad,complicity,B2,noun,secret wink allies
1107,componente,component,B2,noun,electronic component chip
1108,comprensible,comprehensible,B2,adjective,clear chalk diagram
1109,comprensivo,understanding,B2,adjective,comforting friend hand
1110,comprobación,verification,B2,noun,checklist green tick
1111,computación,computing,B2,noun,supercomputer server rack
1112,comunicador,communicator,B2,noun,radio tower antenna
1113,conceder,to grant award,B2,verb,handing golden trophy
1114,concentración mental,mental focus,B2,noun,chess grandmaster focus
1115,concepción,conception notion,B2,noun,architect sketch model
1116,concesión,concession grant,B2,noun,signing franchise license
1117,concilio,council,B2,noun,council table delegates
1118,conciso,concise,B2,adjective,bullet points list
1119,conclusión lógica,logical conclusion,B2,noun,puzzle complete picture
1120,concreción,concretion,B2,noun,solid rock formation
1121,concurrencia,concurrency,B2,noun,simultaneous computer threads
1122,condena,sentence conviction,B2,noun,courtroom gavel judgment
1123,condensación,condensation,B2,noun,water droplets glass
1124,condescendencia,condescension,B2,noun,smug facial expression
1125,conductividad,conductivity,B2,noun,copper wire electricity
1126,conectividad,connectivity,B2,noun,global wifi connection
1127,confección,tailoring,B2,noun,sewing machine fabric
1128,confidencialidad,confidentiality,B2,noun,padlock secret envelope
1129,configuración,configuration,B2,noun,settings gear wheel
1130,confinamiento,confinement,B2,noun,cozy room indoor
1131,confirmatorio,confirmatory,B2,adjective,approved green stamp
1132,confiscación,confiscation,B2,noun,customs inspector boxes
1133,conformidad,conformity,B2,noun,identical paper cutouts
1134,confortable,comfortable,B2,adjective,plush cozy armchair
1135,confrontación,confrontation,B2,noun,two rams clashing horns
1136,congelación,freezing,B2,noun,frozen lake ice
1137,congestión,congestion,B2,noun,heavy highway traffic jam
1138,conglomerado,conglomerate,B2,noun,skyscrapers business district
1139,conjetura,conjecture,B2,noun,detective evidence board
1140,conjunción,conjunction,B2,noun,planets moon alignment
1141,conmemoración,commemoration,B2,noun,memorial statue flowers
1142,conmoción,commotion shock,B2,noun,gasping surprised audience
1143,connotación,connotation,B2,noun,speech bubble symbol
1144,consecutivo,consecutive,B2,adjective,numbered domino tiles
1145,consenso,consensus,B2,noun,unanimous raised hands
1146,consentimiento,consent,B2,noun,signing consent form
1147,consecución,achievement,B2,noun,climbing summit flag
1148,consecuente,consistent,B2,adjective,steady line graph
1149,conservación natural,nature conservation,B2,noun,national park forest
1150,consignación,consignment,B2,noun,cargo shipment boxes
1151,consistencia,consistency,B2,noun,thick ceramic clay
1152,conspiración,conspiracy,B2,noun,whispering in shadow
1153,constancia,perseverance,B2,noun,marathon runner grit
1154,constelación,constellation,B2,noun,night sky star pattern
1155,constituyente,constituent,B2,noun,voter ballot box
1156,constricción,constriction,B2,noun,tightened rope knot
1157,construcción naval,shipbuilding,B2,noun,shipyard vessel crane
1158,cónsul,consul,B2,noun,consulate diplomatic office
1159,contaminante,pollutant,B2,noun,factory exhaust chimney
1160,contemplación,contemplation,B2,noun,person viewing mountain horizon
1161,contemporáneo,contemporary,B2,adjective,modern architecture glass
1162,contenido digital,digital content,B2,noun,video editing screen
1163,contingencia,contingency,B2,noun,emergency fire exit
1164,continuo,continuous,B2,adjective,endless winding road
1165,contradicción,contradiction,B2,noun,two opposite direction arrows
1166,contraindicación,contraindication,B2,noun,medicine warning label
1167,contrapeso,counterweight,B2,noun,crane counterweight balance
1168,contraste,contrast,B2,noun,black and white photograph
1169,contratación,hiring recruitment,B2,noun,shaking hands new employee
1170,contribuyente,taxpayer,B2,noun,person calculating tax form
1171,controversia,controversy,B2,noun,newspaper controversy headline
1172,convención,convention,B2,noun,exhibition center hall
1173,convergencia,convergence,B2,noun,merging highway lanes
1174,conversión,conversion,B2,noun,currency exchange rates
1175,convocatoria,call announcement,B2,noun,bulletin board announcement
1176,cooperativo,cooperative,B2,adjective,team rowing boat together
1177,coordenada,coordinate,B2,noun,gps map coordinates
1178,corporación,corporation,B2,noun,glass skyscraper headquarters
1179,corrección de errores,bug fix,B2,noun,fixing computer code
1180,correlación,correlation,B2,noun,scatter plot chart correlation
1181,corresponsal,correspondent,B2,noun,tv news reporter mic
1182,corrupción,corruption,B2,noun,bribe money envelope
1183,cómputo,computation,B2,noun,binary matrix code
1184,cotización,stock quote,B2,noun,stock market price screen
1185,creatividad técnica,technical creativity,B2,noun,robotic engineer blueprint
1186,credibilidad,credibility,B2,noun,trusted seal guarantee
1187,credencial,credential,B2,noun,id badge lanyard
1188,creencias,beliefs,B2,noun,meditation peaceful temple
1189,cristalización,crystallization,B2,noun,growing quartz crystal
1190,criterio científico,scientific criterion,B2,noun,laboratory research test
1191,cronología,chronology,B2,noun,historical timeline chart
1192,crucial,crucial,B2,adjective,key pivot decision crossroads
1193,cualitativo,qualitative,B2,adjective,focus group interview
1194,cuantificable,quantifiable,B2,adjective,measuring tape ruler
1195,cuestionamiento,questioning,B2,noun,person questioning belief
1196,cumplimiento,compliance,B2,noun,green checkmark audit
1197,cúpula,dome,B2,noun,cathedral glass dome
1198,curiosidad científica,scientific curiosity,B2,noun,child looking galaxy telescope
1199,declaraión,declaration,B2,noun,historic declaration scroll
1200,deducción,deduction,B2,noun,sherlock magnifying glass`;

// Load existing 1000 words from data/words.json
const existingWords = JSON.parse(fs.readFileSync('data/words.json', 'utf-8'));
const existingCsv = fs.readFileSync('data/vocab_1000.csv', 'utf-8');

const new_lines = new_b2_csv.trim().split('\n').slice(1);
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
    level: 'B2',
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
fs.writeFileSync('data/vocab_1200.csv', fullCsv, 'utf-8');

console.log(`Successfully added ${addedCount} new B2 words! Total dataset: ${allWords.length} words.`);
