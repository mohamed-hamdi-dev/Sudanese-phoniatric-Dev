const fs = require('fs');
const data = fs.readFileSync('C:/Users/Mohamed hamdi/.gemini/antigravity-ide/brain/fe177ccc-fe89-4b10-95d1-149b4f4fa95b/.system_generated/logs/transcript.jsonl', 'utf8');
const lines = data.split('\n');
for(let l of lines) {
  if(l.includes('step_index":449,')) {
    const obj = JSON.parse(l);
    const text = obj.content;
    const i = text.indexOf('const toggleShort = event.target.closest');
    console.log(text.substring(i, i + 3500));
    break;
  }
}
