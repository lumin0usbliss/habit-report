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
              for (const call of obj.tool_calls) {
                 if (call.name === 'write_to_file' || call.name === 'replace_file_content' || call.name === 'default_api:write_to_file' || call.name === 'default_api:replace_file_content') {
                    if (call.args && call.args.TargetFile && call.args.TargetFile.endsWith('Page09Prescription.tsx')) {
                       console.log('Found write to Page09Prescription.tsx');
                       if (call.args.CodeContent) {
                          fs.writeFileSync('restored_Page09.tsx', call.args.CodeContent, 'utf8');
                          console.log('Saved to restored_Page09.tsx');
                       }
                    } else if (call.arguments && call.arguments.TargetFile && call.arguments.TargetFile.endsWith('Page09Prescription.tsx')) {
                       if (call.arguments.CodeContent) {
                          fs.writeFileSync('restored_Page09.tsx', call.arguments.CodeContent, 'utf8');
                          console.log('Saved to restored_Page09.tsx');
                       }
                    }
                 }
              }
           }
       } catch (e) {
       }
    }
  }
}

processLineByLine();
