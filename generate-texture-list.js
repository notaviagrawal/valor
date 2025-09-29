#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to get all files in the textures/equirectangular directory
function getTextureFiles() {
    const texturesDir = path.join(__dirname, 'textures', 'equirectangular');
    
    try {
        const files = fs.readdirSync(texturesDir);
        // Filter for image files (jpg, jpeg, png, hdr, exr)
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.hdr', '.exr'].includes(ext);
        });
        
        return imageFiles;
    } catch (error) {
        console.error('Error reading textures directory:', error);
        return [];
    }
}

// Generate the texture list
const textures = getTextureFiles();
console.log('Found textures:', textures);

// Generate JavaScript code for the HTML file
const jsCode = `// Auto-generated texture list - update this when adding new textures
const availableTextures = ${JSON.stringify(textures, null, 4)};`;

console.log('\nGenerated code:');
console.log(jsCode);

// Write to a file that can be included
fs.writeFileSync(path.join(__dirname, 'texture-list.js'), jsCode);
console.log('\nTexture list saved to texture-list.js');
