const fs = require('fs');
const buffer = fs.readFileSync('transcript_p09.jsonl');
console.log(buffer.slice(0, 50));
