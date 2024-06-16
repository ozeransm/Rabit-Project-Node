
const fs = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, 'cards.json');

async function readFJ() {
    const list = await fs.readFile(filePath, 'utf8');
    return JSON.parse(list);
}
async function writeFJ(jsonData) {
    try {
        await fs.writeFile(filePath, JSON.stringify(jsonData), 'utf8');
        
    } catch (err) {
        console.error('Error parsing JSON:', err);
        return;
    }

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }

        console.log('File has been updated');
    });
}


module.exports = {
    readFJ,
    writeFJ    
}