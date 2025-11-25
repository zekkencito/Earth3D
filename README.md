# 🌍 Tierra 3D Interactiva - PWA

Una Progressive Web App educativa para explorar la Tierra en 3D con estilo low poly retro.

## ✨ Características

- 🌍 Modelo 3D de la Tierra con estilo low poly Nintendo 64
- ⭐ Campo de estrellas espacial con 3000 estrellas animadas
- 🌐 Paralelos (Ecuador, Trópicos) y Meridianos con etiquetas flotantes
- 👆 Interacción táctil optimizada para móvil
- 💬 Sistema de diálogos educativos con colores dinámicos
- 🔄 Rotación automática e interactiva
- 🎵 Música de ambiente espacial y efectos de sonido
- 📱 **PWA instalable** - Funciona offline como una app nativa
- 🔊 Control de audio integrado

## � Controles

### Escritorio (Mouse):
- **Arrastra**: Rotar la Tierra
- **Click en líneas**: Ver nombre del paralelo/meridiano

### Móvil (Touch):
- **Arrastra con el dedo**: Rotar la Tierra
- **Toca las líneas**: Ver nombre del paralelo/meridiano
- **Área de toque ampliada**: 5x más grande que la línea visible

## 🎨 Líneas geográficas

### Paralelos (horizontales):
- 🟡 **Ecuador** - Centro de la Tierra
- 🔴 **Trópico de Cáncer** - 23.5° Norte
- 🔵 **Trópico de Capricornio** - 23.5° Sur

### Meridianos (verticales):
- 🟢 **Meridiano de Greenwich** - 0°
- 🟣 **Meridiano 180°** - Línea de cambio de fecha
- 🟠 **Meridiano 90°E** - Este
- 🩷 **Meridiano 90°W** - Oeste

## 📱 Estructura del proyecto

```
Earth3D/
├── index.html          # Página principal
├── style.css           # Estilos visuales
├── script.js           # Lógica Three.js completa
├── scene.glb           # Modelo 3D de la Tierra
├── manifest.json       # Manifest de PWA
├── sw.js              # Service Worker para offline
├── icons/             # Iconos de la aplicación
│   └── icon-*.png     # Diferentes tamaños (72px - 512px)
├── ICONOS-README.md   # Guía para crear iconos
└── README.md          # Esta guía
```

## 🚀 Cómo ejecutar

### Opción 1: Live Server (Recomendado)
1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"
4. La app se abrirá en tu navegador

### Opción 2: Servidor local con Python
```bash
python -m http.server 8000
```
Luego abre: http://localhost:8000

⚠️ **IMPORTANTE**: No abrir el HTML directamente (doble click). Los modelos GLB y el Service Worker requieren un servidor local.

## 📲 Instalar como PWA

### En Android (Chrome/Edge):
1. Abre la aplicación en tu navegador
2. Toca el menú (⋮) → "Agregar a pantalla de inicio"
3. Confirma el nombre y presiona "Agregar"
4. ¡Listo! Ahora tienes un ícono en tu pantalla

### En iPhone/iPad (Safari):
1. Abre la aplicación en Safari
2. Presiona el botón "Compartir" (□↑)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma y presiona "Agregar"

### En Escritorio (Chrome/Edge):
1. Abre la aplicación en tu navegador
2. Busca el ícono de instalación (⊕) en la barra de direcciones
3. Click en "Instalar Tierra 3D"
4. La app se abrirá en una ventana independiente

### Características offline:
- ✅ Funciona sin conexión a internet después de la primera carga
- ✅ Todos los recursos se cachean automáticamente
- ✅ Música y sonidos disponibles offline

## 🎨 Crear iconos para la PWA

**IMPORTANTE:** Para que la PWA sea instalable, necesitas crear los iconos.

### Método rápido (recomendado):
1. Ve a: https://www.pwabuilder.com/imageGenerator
2. Sube una imagen cuadrada del planeta (512x512px mínimo)
3. Descarga el paquete de iconos
4. Extrae los archivos en la carpeta `icons/`

### Tamaños necesarios:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

📖 **Lee `ICONOS-README.md` para más opciones y detalles**

## 🔧 Personalización

### Ajustar grosor de líneas
En `script.js`, busca las funciones `createParallelLine` y `createMeridianLine`:
```javascript
const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.015, 8, true);
// Cambia 0.015 a 0.020, 0.025, etc. para líneas más gruesas
```

### Ajustar área de toque (móvil)
```javascript
const touchArea = new THREE.TubeGeometry(curve, segments, 0.08, 8, true);
// Cambia 0.08 a 0.10, 0.12, etc. para área más grande
```

### Cantidad de estrellas
En la función `createStarfield()`:
```javascript
const starCount = 3000; // Aumenta o disminuye según prefieras
```

### Velocidad de rotación automática
En las primeras líneas:
```javascript
let autoRotateSpeed = 0.001; // Aumenta para más rápido, disminuye para más lento
```

### Editar diálogos educativos
Busca el array `dialogos` al inicio de `script.js`:
```javascript
const dialogos = [
    "Tu mensaje aquí...",
    "Otro mensaje...",
    // Añade más mensajes
];
```

## � Características técnicas

### Sistema de cálculo automático
- El tamaño de las líneas se calcula dinámicamente según el modelo
- Centrado automático del modelo en (0,0,0)
- Escalado proporcional de paralelos y meridianos

### Interacción táctil optimizada
- Área invisible de 5.3x más grande que la línea visible
- Detección de arrastre vs. clic (>5px = arrastre)
- Compatible con mouse y touch simultáneamente

### Campo de estrellas
- 3000 estrellas en posiciones aleatorias
- 3 colores: blancas (70%), azuladas (15%), amarillentas (15%)
- Distribuidas en una esfera de radio 100-500 unidades
- Niebla espacial para efecto de profundidad

## 🐛 Solución de problemas

### Las estrellas no se ven
- ✅ Ya implementadas en `createStarfield()`
- Verifica que la función se llame en `init()`
- El fondo es muy oscuro (`0x000510`), las estrellas son blancas

### Las líneas son difíciles de tocar en móvil
- Área de toque actual: `0.08` (5.3x más grande)
- Aumenta el valor en `touchArea` si necesitas

### El modelo no carga
- Verifica que `scene.glb` esté en la carpeta
- DEBES usar Live Server o servidor local
- Revisa la consola (F12) para errores

### Rotación muy lenta/rápida
- Ajusta `autoRotateSpeed` (línea 8)
- Valores típicos: 0.0005 (lento) a 0.003 (rápido)

## 📚 Diálogos educativos incluidos

1. Explicación del Ecuador
2. Trópicos de Cáncer y Capricornio
3. Círculos polares y clima
4. Meridianos y Greenwich
5. Resumen de líneas imaginarias

## � Próximas mejoras sugeridas

- [ ] Añadir círculos polares
- [ ] Modo día/noche en la Tierra
- [ ] Más información al tocar continentes
- [ ] Animación de rotación de estrellas
- [ ] Efecto de atmósfera mejorado

---

This work is based on "Low Poly Planet Earth" (https://sketchfab.com/3d-models/low-poly-planet-earth-7b1dc4f802a54a6297e7a46888a85f77) by Jacobs Development (https://sketchfab.com/Jacobs_Development) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)

