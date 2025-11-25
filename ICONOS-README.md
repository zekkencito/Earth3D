# Iconos para PWA - Tierra 3D

Para que tu PWA funcione correctamente, necesitas crear los iconos en diferentes tamaños.

## 📱 Tamaños de iconos necesarios:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## 🎨 Cómo crear los iconos:

### Opción 1: Usar un generador online (MÁS FÁCIL)
1. Ve a: https://www.pwabuilder.com/imageGenerator
2. Sube una imagen del planeta (idealmente 512x512px o más grande)
3. Descarga el paquete de iconos
4. Coloca los archivos en la carpeta `icons/`

### Opción 2: Crear manualmente con una herramienta
1. Crea una imagen cuadrada del planeta (mínimo 512x512px)
2. Usa herramientas como:
   - Photoshop
   - GIMP (gratis)
   - Figma (gratis)
   - Canva (gratis)
3. Exporta en los tamaños listados arriba
4. Guarda como PNG con el nombre: `icon-{tamaño}.png`
   Ejemplo: `icon-192x192.png`

### Opción 3: Usar ImageMagick (línea de comandos)
Si tienes ImageMagick instalado:

```bash
# Desde una imagen original de 512x512
convert icon-512x512.png -resize 72x72 icon-72x72.png
convert icon-512x512.png -resize 96x96 icon-96x96.png
convert icon-512x512.png -resize 128x128 icon-128x128.png
convert icon-512x512.png -resize 144x144 icon-144x144.png
convert icon-512x512.png -resize 152x152 icon-152x152.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 384x384 icon-384x384.png
```

## 🌍 Diseño sugerido del icono:
- Fondo oscuro espacial (#0a0a1a)
- Tierra con estilo low poly en el centro
- Quizás algunas estrellas de fondo
- Borde sutil con color cyan (#00ffff) para que resalte

## 📁 Estructura de carpetas:
```
Earth3D/
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
├── index.html
├── manifest.json
├── sw.js
└── ...otros archivos
```

## 🚀 Una vez tengas los iconos:
Tu PWA estará lista para instalarse en dispositivos móviles y escritorios!
