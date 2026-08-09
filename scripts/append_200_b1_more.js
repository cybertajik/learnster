const fs = require('fs');

const new_b1_csv = `id,spanish,english,level,partOfSpeech,imageQuery
801,admisión,admission,B1,noun,university admission entrance
802,administración,administration,B1,noun,corporate office administration
803,admirar,to admire,B1,verb,person admiring art painting
804,advertencia,warning,B1,noun,yellow caution warning sign
805,advertir,to warn,A2,verb,person warning caution
806,afectar,to affect,B1,verb,storm affecting trees
807,afición,hobby,B1,noun,gardening hobby plants
808,afortunadamente,fortunately,B1,adverb,NONE
809,agente,agent,B1,noun,travel agent laptop
810,agotado,exhausted,B1,adjective,exhausted person couch
811,agradecer,to thank,B1,verb,shaking hands thank you
812,agricultura,agriculture,B1,noun,green farm agriculture
813,ahorro,savings,B1,noun,piggy bank savings coins
814,aislamiento,isolation,B1,noun,isolated house mountain
815,alcanzar,to reach,B1,verb,reaching for top shelf
816,alerta,alert,B1,noun,red alert bell
817,alivio,relief,B1,noun,relieved person exhaling
818,almacén,warehouse,B1,noun,warehouse shelving boxes
819,alquilar,to rent,B1,verb,handing over house keys
820,alterar,to alter,B1,verb,tailor altering clothes
821,alternativa,alternative,B1,noun,crossroads path choices
822,altitud,altitude,B1,noun,high mountain peak altitude
823,amable mente,kindly,B1,adverb,NONE
824,amenaza,threat,B1,noun,storm clouds threat
825,ampliar,to expand,B1,verb,magnifying glass zoom
826,análisis,analysis,B1,noun,data charts analysis
827,anciano,elderly person,B1,noun,elderly man walking stick
828,angustia,anguish,B1,noun,distressed person holding face
829,aniversario,anniversary,B1,noun,anniversary celebration cake
830,antigüedad,antiquity,B1,noun,ancient greek statue
831,anual,annual,B1,adjective,yearly calendar 12 months
832,apariencia,appearance,B1,noun,fashion mirror appearance
833,apartamento,apartment,B1,noun,modern apartment building
834,aperturar,to open an account,B1,verb,opening bank account
835,aplaudir,to applaud,B1,verb,audience applauding hands
836,aplicación,application,B1,noun,smartphone mobile app
837,apropiado,appropriate,B1,adjective,formal suit attire
838,aprovechar,to take advantage of,B1,verb,person seizing opportunity
839,aproximadamente,approximately,B1,adverb,NONE
840,apoyo,support,B1,noun,team holding supporting hands
841,apreciar,to appreciate,B1,verb,admiring fine wine
842,aprobación,approval,B1,noun,approved green stamp paper
843,argumento,argument plot,B1,noun,movie story script
844,armonía,harmony,B1,noun,peaceful zen stones harmony
845,arrepentirse,to regret,B1,verb,regretful person head in hands
846,arriesgar,to risk,B1,verb,tightrope walker risk
847,artesano,craftsman,B1,noun,potter making ceramic vase
848,artículo,article,B1,noun,newspaper journal article
849,aspecto,aspect,B1,noun,glowing jewel facets
850,aspiración,aspiration,B1,noun,person looking up to stars
851,asamblea,assembly,B1,noun,conference meeting assembly
852,asesor,advisor,B1,noun,financial advisor meeting
853,asistencia,attendance,B1,noun,audience attending lecture
854,asociar,to associate,B1,verb,puzzle pieces connecting
855,asumir,to assume responsibility,B1,verb,leader taking responsibility
856,atención,attention,B1,noun,person focusing attentively
857,atractivo,attractive,B1,adjective,scenic ocean coastline
858,atravesar,to cross through,B1,verb,walking through tunnel
859,atribuir,to attribute,B1,verb,writing attribution credit
860,audiencia,audience,B1,noun,concert hall audience
861,aumento,increase,B1,noun,growing chart graph
862,ausencia,absence,B1,noun,empty chair desk
863,auténtico,authentic,B1,adjective,authentic vintage clock
864,autor,author,B1,noun,writer with typewriter
865,autoridad,authority,B1,noun,badge official authority
866,avance,advance,B1,noun,forward progress steps
867,aventura,adventure,B1,noun,mountain hiker adventure
868,avería,breakdown,B1,noun,broken down car smoke
869,averiguar,to figure out,B1,verb,detective solving puzzle
870,aviso,notice,B1,noun,bulletin board notice
871,bancario,banking,B1,adjective,credit card banking
872,barrio,neighborhood,B1,noun,charming residential street
873,base,foundation,B1,noun,building concrete base
874,bastante,quite enough,B1,adverb,NONE
875,beneficio,benefit,B1,noun,sprouting plant coins
876,bienes,goods assets,B1,noun,real estate property assets
877,biografía,biography,B1,noun,open biography book
878,boceto,sketch,B1,noun,artist pencil sketch
879,boletín,newsletter,B1,noun,printed newsletter paper
880,bondad,kindness,B1,noun,sharing food kindness
881,borde,edge,B1,noun,cliff edge ocean
882,boscaje,woodland,B1,noun,misty woodland trees
883,brillante,brilliant,B1,adjective,glowing diamond gem
884,brindar,to toast celebrate,B1,verb,cheers wine glasses toast
885,broma,joke,B1,noun,people laughing joke
886,búsqueda,search,B1,noun,search bar magnifying glass
887,cabina,cabin,A2,noun,wooden forest cabin
888,cadena,chain,B1,noun,metal link chain
889,cálculo,calculation,B1,noun,math formulas calculator
890,calidad,quality,B1,noun,quality star seal
891,calidez,warmth,B1,noun,warm cozy fireplace
892,calma,calmness,B1,noun,calm still lake reflection
893,campaña,campaign,B1,noun,marketing strategy campaign
894,campo de visión,field of view,B1,noun,panoramic landscape view
895,canción,song,A1,noun,musical notes song
896,candidato,candidate,B1,noun,job interview candidate
897,capacidad,capacity,B1,noun,full measuring beaker
898,capaz,capable,B1,adjective,climbing summit capable
899,capital,capital city,A2,noun,metropolis skyline city
900,capturar,to capture,B1,verb,camera capturing photo
901,carácter,character personality,B1,noun,confident portrait
902,característica,feature,B1,noun,checklist features list
903,cargo,job position,B1,noun,executive office desk
904,carrera,career profession,B1,noun,university diploma career
905,carretera,highway,A2,noun,scenic open highway road
906,carta de presentación,cover letter,B1,noun,resume cover letter document
907,cartel,poster,A2,noun,movie art poster
908,catálogo,catalog,B1,noun,product catalog magazine
909,categoría,category,B1,noun,organized files category
910,causa,cause,B1,noun,domino effect cause
911,celebración,celebration,A2,noun,confetti party celebration
912,centro,center,A1,noun,city center square
913,ceremonia,ceremony,B1,noun,graduation ceremony stage
914,certificado,certificate,B1,noun,framed achievement certificate
915,cifra,figure number,B1,noun,financial figures statistics
916,circulaciòn,traffic flow,B1,noun,busy city traffic lights
917,círculo,circle,A2,noun,geometric circle shape
918,circunstancia,circumstance,B1,noun,branching path choices
919,cita,appointment,A2,noun,calendar appointment date
920,ciudadanía,citizenship,B1,noun,passport citizenship card
921,claridad,clarity,B1,noun,crystal clear water
922,clasificación,classification,B1,noun,podium 1st 2nd 3rd
923,clave,key element,B1,noun,golden key lock
924,cliente,customer client,A2,noun,happy store customer
925,clima,climate,A2,noun,earth weather satellite
926,cobertura,coverage,B1,noun,satellite network coverage
927,código,code,B1,noun,computer programming code
928,coherencia,coherence,B1,noun,matching puzzle pieces
929,colaborar,to collaborate,B1,verb,team brainstorming together
930,colección,collection,B1,noun,stamp coin collection
931,colegio,school,A1,noun,elementary school building
932,colisión,collision,B1,noun,car collision traffic
933,columna,column,B1,noun,ancient marble column
934,combinación,combination,B1,noun,safe dial combination
935,combustible,fuel,B1,noun,gas pump fuel
936,comedia,comedy,A2,noun,theater comedy mask
937,comentario,comment,B1,noun,speech bubble comment
938,comercial,commercial,B1,adjective,shopping street stores
939,comisión,commission,B1,noun,handshake sales bonus
940,comité,committee,B1,noun,boardroom committee meeting
941,compañía,company,A2,noun,corporate office building
942,comparación,comparison,B1,noun,comparing two apples
943,competición,competition,A2,noun,sports track competition
944,complejidad,complexity,B1,noun,intricate clockwork gears
945,comportarse,to behave,B1,verb,well behaved child
946,composición,composition,B1,noun,orchestra music composition
947,comprensión,understanding,B1,noun,empathetic listening conversation
948,compromiso,commitment,B1,noun,handshake contract pledge
949,comunicado,press release,B1,noun,official statement document
950,concentración,concentration,B1,noun,student meditating focus
951,concepto,concept,B1,noun,glowing idea sketch
952,conclusión,conclusion,B1,noun,puzzle final piece
953,concurso,contest,A2,noun,trophy contest prize
954,condición,condition,B1,noun,fitness health condition
955,conductor,driver,A2,noun,car driver steering wheel
956,conducta,conduct,B1,noun,proper etiquette dinner
957,conferencia,conference,B1,noun,keynote speaker stage
958,confirmación,confirmation,B1,noun,check mark confirm
959,confusión,confusion,B1,noun,confused maze runner
960,congreso,congress,B1,noun,capitol congress hall
961,conjunto,set group,B1,noun,matching cutlery set
962,conexión,connection,B1,noun,digital network nodes
963,consecuencia,consequence,B1,noun,falling dominoes effect
964,consejero,counselor,B1,noun,counselor helping client
965,conservar,to preserve,B1,verb,preserving jam jar
966,consideración,consideration,B1,noun,thoughtful gift giving
967,consigna,slogan,B1,noun,campaign banner slogan
968,consolidación,consolidation,B1,noun,building strong foundation
969,constante,constant,B1,adjective,ticking wall clock
970,construcción,construction,A2,noun,construction crane building
971,consulta,consultation,B1,noun,doctor consulting patient
972,consumo,consumption,B1,noun,energy power meter
973,contacto,contact,A1,noun,smartphone contacts list
974,contenedor,container,B1,noun,shipping cargo container
975,contenido,content,B1,noun,content creator laptop
976,contexto,context,B1,noun,reading book context
977,continente,continent,A2,noun,world map continents
978,continuación,continuation,B1,noun,road continuing forward
979,contribución,contribution,B1,noun,charity contribution coins
980,control,control,A2,noun,game remote control
981,convenio,agreement,B1,noun,official treaty handshake
982,conversación,conversation,A1,noun,two friends talking cafe
983,convicción,conviction,B1,noun,determined passionate speaker
984,cooperación,cooperation,B1,noun,team building bridge
985,coordinación,coordination,B1,noun,synchronized dancers
986,copia,copy,A1,noun,photocopier machine print
987,corazón,heart,A1,noun,red human heart
988,coraje,courage,B1,noun,brave knight shield
989,corrección,correction,B1,noun,red pen teacher correction
990,corredor,corridor,A2,noun,long hotel corridor
991,corriente,current stream,B1,noun,river water current
992,corte,cut incision,B1,noun,scissors cutting ribbon
993,costumbre,custom habit,A2,noun,traditional tea ceremony
994,creación,creation,B1,noun,artist painting canvas
995,crecimiento,growth,B1,noun,sprouting green plant
996,crédito,credit,A2,noun,banking credit card
997,criterio,criterion,B1,noun,evaluation scoring sheet
998,crítica,critique,B1,noun,film critic reviewing
999,cuadro de mandos,dashboard,B1,noun,car dashboard speed
1000,cubierta,deck cover,B1,noun,ship wooden deck ocean`;

// Load existing 800 words from data/words.json
const existingWords = JSON.parse(fs.readFileSync('data/words.json', 'utf-8'));
const existingCsv = fs.readFileSync('data/vocab_800.csv', 'utf-8');

const new_lines = new_b1_csv.trim().split('\n').slice(1);
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
    level: 'B1',
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
fs.writeFileSync('data/vocab_1000.csv', fullCsv, 'utf-8');

console.log(`Successfully added ${addedCount} new B1 words! Total dataset: ${allWords.length} words.`);
