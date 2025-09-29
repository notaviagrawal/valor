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

// Function to update the HTML file with new texture list
function updateHTMLFile(textures) {
    const htmlFile = path.join(__dirname, 'webgl_loader_texture_ultrahdr.html');
    
    try {
        let htmlContent = fs.readFileSync(htmlFile, 'utf8');
        
        // Create the new texture array string
        const textureArrayString = textures.map(texture => `"${texture}"`).join(',\n\t\t\t\t');
        
        // Replace the availableTextures array
        const regex = /const availableTextures = \[[\s\S]*?\];/;
        const replacement = `const availableTextures = [\n\t\t\t\t${textureArrayString}\n\t\t\t];`;
        
        htmlContent = htmlContent.replace(regex, replacement);
        
        // Write the updated content back to the file
        fs.writeFileSync(htmlFile, htmlContent, 'utf8');
        
        console.log('✅ HTML file updated successfully!');
        console.log(`📁 Found ${textures.length} textures:`);
        textures.forEach((texture, index) => {
            console.log(`   ${index + 1}. ${texture}`);
        });
        
    } catch (error) {
        console.error('❌ Error updating HTML file:', error);
    }
}

// Main execution
console.log('🔍 Scanning textures directory...');
const textures = getTextureFiles();

if (textures.length === 0) {
    console.log('⚠️  No texture files found in textures/equirectangular/');
    process.exit(1);
}

console.log('📝 Updating HTML file...');
updateHTMLFile(textures);

console.log('🎉 Done! Refresh your browser to see the new textures.');
