const fs = require('fs');
const lines = fs.readFileSync('transcript_p09.jsonl', 'utf8').split('\n').filter(Boolean);
for (const line of lines) {
  const obj = JSON.parse(line);
  if (obj.tool_calls) {
    for (const call of obj.tool_calls) {
      if (call.name === 'default_api:write_to_file' || call.name === 'default_api:replace_file_content') {
         if (call.arguments.TargetFile && call.arguments.TargetFile.endsWith('Page09Prescription.tsx')) {
            console.log('FOUND IT!');
            if (call.arguments.CodeContent) {
               fs.writeFileSync('restored_Page09.tsx', call.arguments.CodeContent, 'utf8');
            }
         }
      }
    }
  }
}
