const programmingLanguages = [
  'c',
  'c++',
  'c#',
  'objective c',
  'swift',
  'go',
  'JavaScript',
  'Java',
  'go',
  'html',
  'css',
  'frontend',
  'backend',
  'php',
  'python',
  'ruby',
  'haskell',
  'typescript',
  'bash',
  'powershell',
  'R',
  'sql',
]

const fs = require('fs');
console.log(
    programmingLanguages.join('\n'),
);
fs.writeFile('./programming-languages.csv', 
  programmingLanguages.join('\n'),
  err => {
    console.log(err);
  }
);