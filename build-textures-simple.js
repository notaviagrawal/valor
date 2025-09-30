#!/usr/bin/env node

/**
 * Simplified Texture Build Pipeline (No external dependencies required)
 * 
 * This script prepares textures for optimized loading:
 * 1. Generates multiple resolution levels
 * 2. Creates optimized preview images
 * 3. Prepares manifest for progressive loading
 * 
 * For full KTX2 compression, use build-textures.js with toktx installed.
 * This simplified version focuses on:
 * - Multi-resolution generation
 * - Preview creation for progressive loading
 * - Manifest generation for LOD selection
 * 
 * Usage: npm run build:textures:simple
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
    inputDir: path.join(__dirname, 'textures', 'equirectangular'),
    outputDir: path.join(__dirname, 'textures', 'processed'),

    // Quality levels - NEW: More granular control between medium and max
    qualities: {
        medium: {
            width: 2048,
            height: 1024,
            quality: 85,
            format: 'webp'
        },
        'high-mid': {
            width: 4096,
            height: 2048,
            quality: 95,
            format: 'jpeg'
        },
        'very-high': {
            width: 6144,
            height: 3072,
            quality: 98,
            format: 'jpeg'
        },
        ultra: {
            width: 8192,
            height: 4096,
            quality: 100,
            format: 'jpeg'
        },
        max: {
            width: 10240,
            height: 5120,
            quality: 100,  // Maximum quality
            format: 'jpeg'
        }
    }
};

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function ensureDirectories() {
    const dirs = [
        CONFIG.outputDir,
        path.join(CONFIG.outputDir, 'medium'),
        path.join(CONFIG.outputDir, 'high-mid'),
        path.join(CONFIG.outputDir, 'very-high'),
        path.join(CONFIG.outputDir, 'ultra'),
        path.join(CONFIG.outputDir, 'max'),
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            log(`  Created directory: ${dir}`, colors.blue);
        }
    });
}

function getTextureFiles() {
    if (!fs.existsSync(CONFIG.inputDir)) {
        log(`❌ Input directory not found: ${CONFIG.inputDir}`, colors.red);
        return [];
    }

    const files = fs.readdirSync(CONFIG.inputDir);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(ext);
    });

    log(`\n📁 Found ${imageFiles.length} texture(s) to process`, colors.cyan);
    return imageFiles;
}

async function processTexture(filename) {
    log(`\n${'='.repeat(60)}`, colors.cyan);
    log(`Processing: ${filename}`, colors.bright + colors.cyan);
    log('='.repeat(60), colors.cyan);

    const inputPath = path.join(CONFIG.inputDir, filename);
    const basename = path.basename(filename, path.extname(filename));

    const inputStats = fs.statSync(inputPath);
    const inputSizeMB = (inputStats.size / (1024 * 1024)).toFixed(2);
    log(`📊 Input size: ${inputSizeMB} MB`, colors.yellow);

    const results = {};

    for (const [qualityName, config] of Object.entries(CONFIG.qualities)) {
        log(`\n🎨 Generating ${qualityName} quality (${config.width}x${config.height})...`, colors.blue);

        const outputFilename = `${basename}.${config.format === 'webp' ? 'webp' : 'jpg'}`;
        const outputPath = path.join(CONFIG.outputDir, qualityName, outputFilename);

        try {
            const processor = sharp(inputPath)
                .resize(config.width, config.height, {
                    fit: 'cover',
                    position: 'center'
                });

            if (config.format === 'webp') {
                await processor.webp({ quality: config.quality }).toFile(outputPath);
            } else {
                await processor.jpeg({ quality: config.quality }).toFile(outputPath);
            }

            const outputStats = fs.statSync(outputPath);
            const outputSizeMB = (outputStats.size / (1024 * 1024)).toFixed(2);
            const reduction = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(1);

            log(`   ✅ ${qualityName}: ${outputSizeMB} MB (${reduction}% reduction)`, colors.green);

            results[qualityName] = {
                path: `textures/processed/${qualityName}/${outputFilename}`,
                width: config.width,
                height: config.height,
                size: outputStats.size,
                sizeMB: outputSizeMB,
                format: config.format
            };

        } catch (error) {
            log(`   ❌ Failed to process ${qualityName}: ${error.message}`, colors.red);
        }
    }

    return { filename, basename, results };
}

async function generateManifest(processedTextures) {
    log(`\n📝 Generating texture manifest...`, colors.cyan);

    const manifest = {
        version: '1.0.0',
        buildType: 'simple',
        generated: new Date().toISOString(),
        textures: {}
    };

    processedTextures.forEach(({ filename, basename, results }) => {
        manifest.textures[basename] = {
            original: filename,
            variants: results
        };
    });

    const manifestPath = path.join(CONFIG.outputDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    log(`✅ Manifest saved: ${manifestPath}`, colors.green);

    return manifest;
}

function printSummary(manifest) {
    log(`\n${'='.repeat(60)}`, colors.green);
    log('📊 BUILD SUMMARY', colors.bright + colors.green);
    log('='.repeat(60), colors.green);

    const textureCount = Object.keys(manifest.textures).length;
    log(`\n✅ Processed ${textureCount} texture(s)`, colors.green);

    let totalInputSize = 0;
    let totalOutputSize = 0;
    const qualitySizes = { preview: 0, low: 0, medium: 0, high: 0 };

    Object.entries(manifest.textures).forEach(([name, data]) => {
        log(`\n  📸 ${name}:`, colors.cyan);
        Object.entries(data.variants).forEach(([quality, info]) => {
            log(`     ${quality.padEnd(10)}: ${info.width}x${info.height} - ${info.sizeMB} MB (${info.format})`, colors.yellow);
            totalOutputSize += info.size;
            qualitySizes[quality] += info.size;
        });
    });

    const totalOutputMB = (totalOutputSize / (1024 * 1024)).toFixed(2);

    log(`\n📦 Total output size: ${totalOutputMB} MB`, colors.bright);
    log('\n💾 Size by quality:', colors.cyan);
    Object.entries(qualitySizes).forEach(([quality, size]) => {
        log(`   ${quality.padEnd(10)}: ${(size / (1024 * 1024)).toFixed(2)} MB`, colors.yellow);
    });

    log(`\n🎯 Format breakdown:`, colors.cyan);
    log(`   Preview, Low, Medium: WebP (better compression)`, colors.yellow);
    log(`   High: JPEG (maximum compatibility)`, colors.yellow);

    log(`\n${'='.repeat(60)}`, colors.green);
    log(`\n💡 Next steps:`, colors.cyan);
    log(`   1. Review generated textures in textures/processed/`, colors.white);
    log(`   2. Proceed to Step 2: Implement client-side progressive loading`, colors.white);
    log(`   3. For even better compression, install toktx and use build-textures.js\n`, colors.white);
}

async function main() {
    log('\n🚀 Simplified Texture Build Pipeline', colors.bright + colors.cyan);
    log('Generating multi-resolution variants with WebP/JPEG\n', colors.cyan);

    // Create output directories
    ensureDirectories();

    // Get textures to process
    const textures = getTextureFiles();
    if (textures.length === 0) {
        log('\n⚠️  No textures found to process\n', colors.yellow);
        log('💡 Add JPG/PNG images to textures/equirectangular/\n', colors.cyan);
        return;
    }

    // Process each texture
    const processedTextures = [];
    for (const texture of textures) {
        const result = await processTexture(texture);
        processedTextures.push(result);
    }

    // Generate manifest
    const manifest = await generateManifest(processedTextures);

    // Print summary
    printSummary(manifest);

    log('🎉 Build complete!\n', colors.green);
}

if (require.main === module) {
    main().catch(error => {
        log(`\n❌ Build failed: ${error.message}`, colors.red);
        console.error(error);
        process.exit(1);
    });
}

module.exports = { CONFIG, processTexture, generateManifest };
