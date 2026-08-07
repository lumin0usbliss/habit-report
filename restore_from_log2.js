const fs = require('fs');
const content = fs.readFileSync('transcript_p09.jsonl', 'utf16le');
const lines = content.split('\n').filter(Boolean);
for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'default_api:write_to_file' || call.name === 'default_api:replace_file_content') {
           if (call.arguments.TargetFile && call.arguments.TargetFile.endsWith('Page09Prescription.tsx')) {
              console.log('FOUND IT!');
              if (call.arguments.CodeContent) {
                 fs.writeFileSync('restored_Page09.tsx', call.arguments.CodeContent, 'utf8');
              } else if (call.arguments.ReplacementContent) {
                 console.log('Got replacement content', call.arguments.ReplacementContent.substring(0, 50));
              }
           }
        }
      }
    }
  } catch (e) { console.error('Parse error on line:', e.message); }
}
