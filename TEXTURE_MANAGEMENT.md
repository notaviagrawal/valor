# Texture Management System

This project automatically detects and loads all texture files from the `textures/equirectangular/` directory.

## How it works:

1. **Automatic Detection**: The system scans the `textures/equirectangular/` folder for image files
2. **Supported Formats**: `.jpg`, `.jpeg`, `.png`, `.hdr`, `.exr`
3. **Dynamic Dropdown**: All detected textures appear in the GUI dropdown

## Adding New Textures:

1. **Add your image file** to the `textures/equirectangular/` directory
2. **Run the updater**: `node update-textures.js`
3. **Refresh the page** - your new texture will appear in the dropdown!

## Current Textures:

- `over-the-clouds-sunset-w-mountain_8K_6bd6575a-89b5-49da-b113-406b6b415133.jpg` - Sunset mountain scene
- `sci-fi-above-alien-planet-atmosphere_8K_77aba538-cd17-4658-ae6f-2ce129130070.jpg` - Sci-fi alien planet
- `shanghai-bund_8K_14fbad8f-9183-441c-8144-25424a0f629a.jpg` - Shanghai cityscape
- `spruit_sunrise_4k.hdr.jpg` - Sunrise scene
- `vaporwave-hdri_4K_fddb5d9d-ca66-4936-8d7e-9f8cf638f85d.jpg` - Vaporwave HDRI

## Quick Update Command:

```bash
node update-textures.js
```

This will automatically:
- Scan the textures directory
- Update the HTML file with the new texture list
- Show you all detected textures
- Tell you when it's done!

**That's it!** No manual copying needed - just refresh your browser and the new textures will be available in the dropdown.