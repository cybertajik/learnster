const fs = require('fs');
const words = JSON.parse(fs.readFileSync('data/words.json', 'utf-8'));

words.forEach(w => {
  if (w.level === 'noun') {
    w.level = 'B1';
  }
});

fs.writeFileSync('data/words.json', JSON.stringify(words, null, 2), 'utf-8');

const csvHeader = "id,spanish,english,level,partOfSpeech,imageQuery\n";
const csvRows = words.map(w => `${w.id},"${w.spanish}","${w.english}",${w.level},${w.partOfSpeech},"${w.imageQuery}"`).join("\n");

fs.writeFileSync('data/vocab_2000.csv', csvHeader + csvRows, 'utf-8');
fs.writeFileSync('data/vocab_1200.csv', csvHeader + csvRows, 'utf-8');

console.log('Fixed level tags successfully!');
