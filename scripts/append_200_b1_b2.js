const fs = require('fs');

const b1_b2_csv = `id,spanish,english,level,partOfSpeech,imageQuery
201,desarrollo,development,B1,noun,technological development
202,medio ambiente,environment,B1,noun,green environment nature
203,investigación,research,B1,noun,scientist laboratory research
204,tecnología,technology,B1,noun,modern technology circuit
205,sociedad,society,B1,noun,diverse group of people
206,educación,education,B1,noun,university graduation
207,cultura,culture,B1,noun,cultural festival traditional
208,gobierno,government,B1,noun,parliament building
209,política,politics,B1,noun,political debate microphone
210,economía,economy,B1,noun,stock market chart
211,industria,industry,B1,noun,factory industrial building
212,comercio,trade,B1,noun,cargo container ship
213,mercancía,merchandise,B1,noun,warehouse goods boxes
214,negocio,business,B1,noun,business handshake
215,inversión,investment,B1,noun,growing money plant
216,presupuesto,budget,B1,noun,budget planning calculator
217,impuesto,tax,B1,noun,tax form coins
218,salario,salary,B1,noun,paycheck cash
219,empleo,employment,B1,noun,job interview shaking hands
220,desempleo,unemployment,B1,noun,unemployed person thinking
221,contrato,contract,B1,noun,signing business contract
222,proyecto,project,B1,noun,architect blueprint project
223,objetivo,objective,B1,noun,target archery bullseye
224,estrategia,strategy,B1,noun,chess strategy game
225,solución,solution,B1,noun,puzzle piece fitting
226,problema,problem,B1,noun,confused person puzzle
227,resultado,result,B1,noun,successful chart growth
228,éxito,success,B1,noun,person celebrating success
229,fracaso,failure,B1,noun,disappointed person desk
230,oportunidad,opportunity,B1,noun,open door sunrise
231,riesgo,risk,B1,noun,warning sign hazard
232,seguridad,security,B1,noun,padlock security shield
233,peligro,danger,B1,noun,danger caution symbol
234,saludable,healthy,B1,adjective,fresh salad fruit
235,enfermedad,disease,B1,noun,virus microscope science
236,tratamiento,treatment,B1,noun,medical therapy doctor
237,paciente,patient,B1,noun,hospital patient bed
238,síntoma,symptom,B1,noun,thermometer fever check
239,vacuna,vaccine,B1,noun,syringe vaccine bottle
240,farmacia,pharmacy,B1,noun,pharmacy store counter
241,opinión,opinion,B1,noun,NONE
242,consejo,advice,B1,noun,two people talking advice
243,experiencia,experience,B1,noun,experience star rating
244,conocimiento,knowledge,B1,noun,brain lightbulb idea
245,habilidad,ability,B1,noun,juggling skilled performance
246,esfuerzo,effort,B1,noun,mountain climber climbing
247,memoria,memory,B1,noun,brain memory thoughts
248,pensamiento,thought,B1,noun,person thinking deeply
249,sentimiento,feeling,B1,noun,heart in hands
250,emoción,emotion,B1,noun,joyful expressive face
251,esperanza,hope,B1,noun,holding glowing light
252,miedo,fear,B1,noun,spooky shadow fear
253,tristeza,sadness,B1,noun,sad person raining window
254,alegría,joy,B1,noun,happy jumping friends
255,rabia,anger,B1,noun,angry frustrated face
256,sorpresa,surprise,B1,noun,surprised open mouth
257,vergüenza,shame,B1,noun,person covering face
258,orgullo,pride,B1,noun,proud person medal
259,respeto,respect,B1,noun,respectful handshake
260,confianza,trust,B1,noun,trusting team trust
261,amistad,friendship,B1,noun,best friends hugging
262,relación,relationship,B1,noun,couple walking together
263,matrimonio,marriage,B1,noun,wedding rings couple
264,divorcio,divorce,B1,noun,broken wedding ring
265,vecino,neighbor,B1,noun,neighbors over fence
266,comunidad,community,B1,noun,community gathering park
267,ciudadano,citizen,B1,noun,person voting ballot box
268,ley,law,B1,noun,scales of justice
269,justicia,justice,B1,noun,gavel judge court
270,derecho,right,B1,noun,NONE
271,delito,crime,B1,noun,handcuffs police
272,policía,police,B1,noun,police car officer
273,cárcel,prison,B1,noun,prison cell bars
274,juez,judge,B1,noun,courtroom judge
275,abogado,lawyer,B1,noun,attorney lawyer suit
276,testigo,witness,B1,noun,courtroom witness stand
277,prueba,proof,B1,noun,magnifying glass evidence
278,verdad,truth,B1,noun,NONE
279,mentira,lie,B1,noun,wooden pinocchio nose
280,acuerdo,agreement,B1,noun,handshake deal
281,discusión,argument,B1,noun,two people arguing
282,conflicto,conflict,B1,noun,clashing swords conflict
283,paz,peace,B1,noun,white dove peace
284,guerra,war,B1,noun,desert military tanks
285,ejército,army,B1,noun,military soldiers marching
286,bandera,flag,B1,noun,national flag flying
287,frontera,border,B1,noun,border checkpoint crossing
288,extranjero,foreigner,B1,noun,traveler looking map
289,idioma,language,B1,noun,speech bubbles world languages
290,traducción,translation,B1,noun,translation dictionary book
291,comunicación,communication,B1,noun,video conference call
292,redes sociales,social media,B1,noun,social media icons phone
293,anuncio,advertisement,B1,noun,city billboard ad
294,noticia,news,B1,noun,newspaper headlines
295,radio,radio,B1,noun,vintage radio speaker
296,televisión,television,B1,noun,modern smart television
297,cine,cinema,B1,noun,popcorn movie theater
298,literatura,literature,B1,noun,classic antique book library
299,poesía,poetry,B1,noun,fountain pen poetry manuscript
300,historia,history,B1,noun,ancient roman ruins
301,arquitectura,architecture,B2,noun,modern architecture skyscraper
302,filosofía,philosophy,B2,noun,thinker statue philosophy
303,psicología,psychology,B2,noun,brain puzzle psychology
304,sociología,sociology,B2,noun,connected people network
305,astronomía,astronomy,B2,noun,stargazing telescope galaxy
306,biología,biology,B2,noun,dna helix biology
307,química,chemistry,B2,noun,chemistry lab flasks
308,física,physics,B2,noun,atom physics orbit
309,matemáticas,mathematics,B2,noun,math formulas blackboard
310,geometría,geometry,B2,noun,geometric compass shapes
311,estadística,statistics,B2,noun,statistical data graph
312,algoritmo,algorithm,B2,noun,computer code algorithm
313,inteligencia artificial,artificial intelligence,B2,noun,ai robot brain glowing
314,robótica,robotics,B2,noun,robotic arm factory
315,ciberseguridad,cybersecurity,B2,noun,digital padlock cyber security
316,energía renovable,renewable energy,B2,noun,wind turbines solar panels
317,sostenibilidad,sustainability,B2,noun,green sprout earth care
318,cambio climático,climate change,B2,noun,melting glacier iceberg
319,contaminación,pollution,B2,noun,smokestack factory smoke
320,reciclaje,recycling,B2,noun,green recycling symbol
321,biodiversidad,biodiversity,B2,noun,coral reef wildlife
322,especie,species,B2,noun,wild tiger jungle
323,extinción,extinction,B2,noun,dinosaur fossil museum
324,conservación,conservation,B2,noun,forest ranger tree planting
325,recursos naturales,natural resources,B2,noun,water waterfall forest
326,petróleo,petroleum,B2,noun,oil rig ocean
327,gas natural,natural gas,B2,noun,gas burner flame
328,electricidad,electricity,B2,noun,lightning electric spark
329,infraestructura,infrastructure,B2,noun,bridge construction highway
330,transporte público,public transport,B2,noun,subway metro train
331,urbanismo,urban planning,B2,noun,futuristic city model
332,vivienda,housing,B2,noun,suburban neighborhood houses
333,hipoteca,mortgage,B2,noun,miniature house key contract
334,alquiler,rent,B2,noun,handing house key lease
335,patrimonio,heritage,B2,noun,historic castle heritage
336,turismo,tourism,B2,noun,tourists taking photos monument
337,gastronomía,gastronomy,B2,noun,gourmet restaurant chef plate
338,nutrición,nutrition,B2,noun,healthy balanced meal
339,caloría,calorie,B2,noun,fitness food count
340,metaverso,metaverse,B2,noun,vr headset virtual reality
341,vacaciones,vacation,B2,noun,resort swimming pool palm trees
342,hospedaje,lodging,B2,noun,boutique hotel reception
343,reserva,reservation,B2,noun,hotel reservation smartphone
344,cancelación,cancellation,B2,noun,red cancelled stamp document
345,reembolso,refund,B2,noun,returning cash money
346,garantía,warranty,B2,noun,warranty certificate stamp
347,factura,invoice,B2,noun,business invoice paper
348,recibo,receipt,B2,noun,paper store receipt
349,descuento,discount,B2,noun,percentage discount tag
350,oferta,offer,B2,noun,special offer sale sign
351,competencia,competition,B2,noun,athletes racing finish line
352,liderazgo,leadership,B2,noun,leader guiding team
353,negociación,negotiation,B2,noun,corporate business meeting table
354,colaboración,collaboration,B2,noun,team working together laptop
355,innovación,innovation,B2,noun,glowing lightbulb creative idea
356,emprendedor,entrepreneur,B2,noun,young entrepreneur presentation
357,startup,startup,B2,noun,rocket launch startup concept
358,financiación,financing,B2,noun,funding coins piggy bank
359,capitalismo,capitalism,B2,noun,stock exchange floor traders
360,globalización,globalization,B2,noun,digital globe connection
361,democracia,democracy,B2,noun,voting ballot box citizen
362,libertad de expresión,freedom of speech,B2,noun,NONE
363,derechos humanos,human rights,B2,noun,diverse unity hands holding
364,igualdad,equality,B2,noun,balanced equality scale
365,diversidad,diversity,B2,noun,multicultural group smiling
366,inclusión,inclusion,B2,noun,inclusive team circle
367,solidaridad,solidarity,B2,noun,helping hands support
368,voluntariado,volunteering,B2,noun,volunteers planting trees
369,donación,donation,B2,noun,charity donation box
370,asociación,association,B2,noun,nonprofit team meeting
371,fundación,foundation,B2,noun,charity foundation building
372,manifestación,demonstration,B2,noun,peaceful march protest
373,huelga,strike,B2,noun,workers strike rally
374,sindicato,labor union,B2,noun,union rally workers
375,reforma,reform,B2,noun,architect renovating room
376,constitución,constitution,B2,noun,historic legal constitution book
377,parlamento,parliament,B2,noun,parliament chamber debate
378,senado,senate,B2,noun,senate hall seats
379,diplomacia,diplomacy,B2,noun,diplomats shaking hands
380,embajada,embassy,B2,noun,embassy building flags
381,tratado,treaty,B2,noun,signing international treaty
382,alianza,alliance,B2,noun,shaking hands global agreement
383,soberanía,sovereignty,B2,noun,crown national seal
384,independencia,independence,B2,noun,fireworks celebration freedom
385,revolución,revolution,B2,noun,historic monuments crowd
386,patriotismo,patriotism,B2,noun,saluting national flag
387,identidad,identity,B2,noun,fingerprint biometrics identity
388,personalidad,personality,B2,noun,diverse human faces masks
389,comportamiento,behavior,B2,noun,NONE
390,actitud,attitude,B2,noun,positive confident posture
391,motivación,motivation,B2,noun,athlete crossing finish line
392,inspiración,inspiration,B2,noun,artist painting outdoor landscape
393,creatividad,creativity,B2,noun,colorful paint splatters art
394,imaginación,imagination,B2,noun,child wearing superhero cape
395,curiosidad,curiosity,B2,noun,child looking through magnifying glass
396,sabiduría,wisdom,B2,noun,wise old owl book
397,inteligencia,intelligence,B2,noun,glowing brain synapse
398,conciencia,awareness,B2,noun,mindful meditation sunrise
399,espiritualidad,spirituality,B2,noun,zen stone balancing water
400,filosofía de vida,philosophy of life,B2,noun,NONE`;

// Load existing 200 words from data/vocab_200.csv
const existingCsv = fs.readFileSync('data/vocab_200.csv', 'utf-8');
const existingLines = existingCsv.trim().split('\n');

const b1_lines = b1_b2_csv.trim().split('\n').slice(1);

const allWords = [];
let a1 = 0, a2 = 0, b1 = 0, b2 = 0;

for (let i = 1; i < existingLines.length; i++) {
  const cols = existingLines[i].split(',');
  const id = parseInt(cols[0], 10);
  const spanish = cols[1];
  const english = cols[2];
  const level = cols[3];
  const pos = cols[4];
  const query = cols[5];

  if (level === 'A1') a1++;
  if (level === 'A2') a2++;

  const enabled = query !== 'NONE';
  allWords.push({
    id, spanish, english, level, partOfSpeech: pos,
    imageQuery: enabled ? query : spanish,
    image: { enabled, source: enabled ? 'pexels' : null, url: null, photographer: null, photographerUrl: null, pexelsUrl: null }
  });
}

for (const line of b1_lines) {
  if (!line.trim()) continue;
  const cols = line.split(',');
  const id = parseInt(cols[0], 10);
  const spanish = cols[1];
  const english = cols[2];
  const level = cols[3];
  const pos = cols[4];
  const query = cols[5];

  if (level === 'B1') b1++;
  if (level === 'B2') b2++;

  const enabled = query !== 'NONE';
  allWords.push({
    id, spanish, english, level, partOfSpeech: pos,
    imageQuery: enabled ? query : spanish,
    image: { enabled, source: enabled ? 'pexels' : null, url: null, photographer: null, photographerUrl: null, pexelsUrl: null }
  });
}

fs.writeFileSync('data/words.json', JSON.stringify(allWords, null, 2), 'utf-8');
fs.writeFileSync('data/vocab_400.csv', existingCsv.trim() + '\n' + b1_lines.join('\n'), 'utf-8');

console.log(`Successfully generated 400 total words! A1: ${a1}, A2: ${a2}, B1: ${b1}, B2: ${b2}`);
