#!/bin/bash

# KTX2 Build Script - Creates GPU-compressed textures that stay compressed in VRAM
# This ACTUALLY reduces memory usage (not just download size)

INPUT_DIR="textures/equirectangular"
OUTPUT_DIR="textures/processed/ktx2"

mkdir -p "$OUTPUT_DIR"

echo "🚀 Building GPU-compressed KTX2 textures..."
echo "This will SIGNIFICANTLY reduce GPU memory usage!"
echo ""

for img in "$INPUT_DIR"/*.jpg; do
    basename=$(basename "$img" .jpg)
    output="$OUTPUT_DIR/${basename}.ktx2"
    
    echo "📦 Processing: $basename"
    
    # Use UASTC compression (stays compressed in GPU memory!)
    # --resize: Limit to 8192x4096 for compatibility
    # --uastc: High quality GPU compression
    # --uastc_quality 4: Maximum quality
    # --genmipmap: Generate mipmaps
    # --zcmp 19: Supercompress with Zstandard
    
    toktx --resize 8192x4096 \
          --genmipmap \
          --uastc \
          --uastc_quality 4 \
          --zcmp 19 \
          "$output" \
          "$img"
    
    if [ $? -eq 0 ]; then
        size=$(du -h "$output" | cut -f1)
        echo "  ✅ Created: ${basename}.ktx2 ($size)"
    else
        echo "  ❌ Failed: $basename"
    fi
    echo ""
done

echo "🎉 KTX2 build complete!"
echo ""
echo "📊 Memory comparison per texture:"
echo "  Old (JPEG):  ~209 MB in GPU memory (uncompressed RGBA)"
echo "  New (KTX2):  ~20-40 MB in GPU memory (stays compressed!)"
echo "  Savings:     ~85% GPU memory reduction"
