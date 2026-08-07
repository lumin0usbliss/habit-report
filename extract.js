const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/soyou/.gemini/antigravity/brain/35254e31-dcd2-4b08-9f6d-cf5cb00f6e5d/.system_generated/logs/transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('Page09Prescription.tsx') && line.includes('write_to_file')) {
       try {
           const obj = JSON.parse(line);
           if (obj.tool_calls) {
              console.log(JSON.stringify(obj.tool_calls).substring(0, 500));
              break;
           }
       } catch (e) {
       }
    }
  }
}

processLineByLine();
