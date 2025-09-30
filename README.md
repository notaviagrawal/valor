# Valor 3D Showcase

A stunning Three.js web application featuring the Valor logo with dynamic background environments.

## Features

- **Interactive 3D Valor Logo** - Rotating 3D model with realistic materials
- **Dynamic Backgrounds** - 31+ high-quality HDR environments to choose from
- **Real-time Controls** - Adjust material properties, exposure, and more
- **Responsive Design** - Works on desktop and mobile devices

## Background Environments

The app includes diverse environments:
- Natural landscapes (mountains, forests, deserts)
- Urban scenes (Shanghai, city sunsets)
- Sci-fi atmospheres (alien planets, abstract lighting)
- Space scenes (Earth from space, milky way)
- Abstract environments (neon lights, reflective halls)

## Controls

- **Auto Rotate** - Toggle automatic logo rotation
- **Metalness** - Adjust material metallic properties
- **Roughness** - Control surface roughness
- **Exposure** - Adjust scene brightness
- **Background Image** - Switch between 31+ environments
- **Data Type** - Choose between HalfFloat and Float precision

## Technology Stack

- **Three.js** - 3D graphics and WebGL rendering
- **UltraHDR Loader** - High dynamic range image support
- **GLTF Loader** - 3D model loading
- **Orbit Controls** - Interactive camera controls
- **Lil-GUI** - User interface controls

## Deployment

This project is deployed on Vercel and can be accessed at: [Your Vercel URL]

## Local Development

1. Clone the repository
2. Open `webgl_loader_texture_ultrahdr.html` in a web browser
3. Or run a local server: `python3 -m http.server 3000`

## File Structure

```
├── webgl_loader_texture_ultrahdr.html  # Main application
├── main.css                           # Styling
├── valerlogo.gltf                     # 3D model
├── textures/equirectangular/          # Background images
├── build/                             # Three.js core files
├── jsm/                               # Three.js modules
└── vercel.json                        # Deployment config
```

## Adding New Textures

1. Add image files to `textures/equirectangular/`
2. Run `node update-textures.js` to update the texture list
3. Refresh the page to see new backgrounds

## License

MIT License - Feel free to use and modify.
