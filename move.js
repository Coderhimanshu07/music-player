const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'music-app');
const targetDir = __dirname;

function moveFiles(source, target) {
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    fs.renameSync(sourcePath, targetPath);
  }
}

moveFiles(sourceDir, targetDir);
fs.rmdirSync(sourceDir);
console.log('Moved files successfully');
