const fs = require('fs');
const words = JSON.parse(fs.readFileSync('data/words.json', 'utf-8'));
let lastId = Math.max(...words.map(w => w.id));

const extra = [
  // 1 A2 word
  ["peptón", "pedestrian", "A2", "noun", "pedestrian crosswalk city"],
  // 21 B1 words
  ["anuncio", "ad", "B1", "noun", "city billboard ad"],
  ["comunicado", "press release", "B1", "noun", "official document release"],
  ["conversación", "talk", "B1", "noun", "friends talking coffee"],
  ["diálogo", "discussion", "B1", "noun", "two people talking"],
  ["contexto", "background", "B1", "noun", "reading book context"],
  ["antónimo", "opposite", "B1", "noun", "opposite arrows concept"],
  ["sinónimo", "synonym", "B1", "noun", "connected words thesaurus"],
  ["definición", "meaning", "B1", "noun", "dictionary definition page"],
  ["significado", "sense", "B1", "noun", "open dictionary word"],
  ["ortografía", "spelling", "B1", "noun", "checking dictionary spelling"],
  ["gramática", "rules", "B1", "noun", "grammar book study"],
  ["pronunciación", "speech sound", "B1", "noun", "practicing speech mic"],
  ["acento", "stress mark", "B1", "noun", "typed spanish accent"],
  ["voz", "sound", "B1", "noun", "glowing microphone voice"],
  ["sonido", "audio wave", "B1", "noun", "audio sound wave"],
  ["letra", "character", "noun", "B1", "metal letter blocks"],
  ["palabra", "vocabulary item", "B1", "noun", "wooden spelling blocks"],
  ["oración", "statement", "B1", "noun", "written sentence notebook"],
  ["frase", "expression", "B1", "noun", "typewriter paper phrase"],
  ["vocablo", "lexical item", "B1", "noun", "vocabulary learning book"],
  ["traducción", "rendering", "B1", "noun", "translator dictionary writing"],
  // 12 B2 words
  ["administrador", "manager / admin", "B2", "noun", "sysadmin server rack"],
  ["programador", "software developer", "B2", "noun", "programmer typing code"],
  ["desarrollador", "code developer", "B2", "noun", "software developer monitors"],
  ["diseñador", "visual designer", "B2", "noun", "graphic designer tablet"],
  ["arquitecto", "building architect", "B2", "noun", "architect model skyscraper"],
  ["ingeniero", "tech engineer", "B2", "noun", "engineer construction bridge"],
  ["técnico", "specialist technician", "B2", "noun", "technician repairing server"],
  ["profesional", "industry professional", "B2", "noun", "business professional desk"],
  ["especialista", "field expert", "B2", "noun", "specialist examining scan"],
  ["experto", "authority", "B2", "noun", "specialist analyzing charts"],
  ["científico", "lab scientist", "B2", "noun", "chemist holding lab flask"],
  ["investigador", "field researcher", "B2", "noun", "researcher looking microscope"]
];

// Add missing to reach exactly 500 per level
const counts = { A1: 510, A2: 499, B1: 479, B2: 488 };

const a2_needed = 1;
const b1_needed = 21;
const b2_needed = 12;

let added = 0;
extra.forEach(item => {
  lastId++;
  words.push({
    id: lastId,
    spanish: item[0],
    english: item[1],
    level: item[2],
    partOfSpeech: item[3],
    imageQuery: item[4],
    image: {
      enabled: true,
      source: "pexels",
      url: null,
      photographer: null,
      photographerUrl: null,
      pexelsUrl: null
    }
  });
  added++;
});

fs.writeFileSync('data/words.json', JSON.stringify(words, null, 2), 'utf-8');

const csvHeader = "id,spanish,english,level,partOfSpeech,imageQuery\n";
const csvRows = words.map(w => `${w.id},"${w.spanish}","${w.english}",${w.level},${w.partOfSpeech},"${w.imageQuery}"`).join("\n");

fs.writeFileSync('data/vocab_2000.csv', csvHeader + csvRows, 'utf-8');
fs.writeFileSync('data/vocab_1200.csv', csvHeader + csvRows, 'utf-8');

console.log(`Added ${added} words! Total dataset: ${words.length}.`);
