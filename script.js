// ============================================
// CONFIGURACIÓN DE LA ESCENA 3D
// ============================================

let scene, camera, renderer, earth, stars, lines = [];
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let autoRotateSpeed = 0.001;
let isFirstInteraction = true;

// Referencias a elementos HTML
const dialogoDiv = document.getElementById('dialogo');
const textoDialogo = document.getElementById('texto-dialogo');
const instrucciones = document.getElementById('instrucciones');

// ============================================
// SISTEMA DE AUDIO
// ============================================
let musicaFondo;
let sonidoClick;
let audioInicializado = false;
let ultimoClick = 0; // Para evitar múltiples clicks rápidos
const DEBOUNCE_TIME = 200; // Milisegundos entre clicks

function inicializarAudio() {
    if (audioInicializado) return;
    
    // Música de fondo espacial animada y relajante
    // Usando una música espacial más atmosférica y agradable
    musicaFondo = new Audio('./sounds/music.mp3');
    musicaFondo.loop = true;
    musicaFondo.volume = 0.2; // Volumen moderado
    
    // Sonido de clic suave y agradable (UI click) — reproducir solo una vez
    sonidoClick = new Audio('./sounds/click.wav');
    sonidoClick.loop = false; // IMPORTANTE: NO repetir
    sonidoClick.volume = 0.4;
    
    audioInicializado = true;
    console.log('🔊 Audio inicializado');
}

function reproducirMusicaFondo() {
    if (musicaFondo && audioInicializado) {
        musicaFondo.play().catch(e => console.log('No se pudo reproducir música:', e));
    }
}

function reproducirSonidoClick() {
    if (sonidoClick && audioInicializado) {
        // Evitar clicks múltiples rápidos (debounce)
        const ahora = Date.now();
        if (ahora - ultimoClick < DEBOUNCE_TIME) {
            return;
        }
        ultimoClick = ahora;
        
        // Detener el sonido si está reproduciéndose
        sonidoClick.pause();
        sonidoClick.currentTime = 0;
        sonidoClick.play().catch(e => console.log('No se pudo reproducir sonido:', e));
    }
}

// ============================================
// DIÁLOGOS EDUCATIVOS
// ============================================
const dialogos = [
  {
    texto: "👋 ¡Hola, explorador del planeta! 🌎\n¿Ves esta línea que pasa justo por el centro? Es el **Ecuador**. 😄\nDivide a la Tierra en dos mitades: el **Hemisferio Norte** y el **Hemisferio Sur**.",
    color: "#38bdf8" // celeste
  },
  {
    texto: "☀️ Un poco más arriba está el **Trópico de Cáncer**, y más abajo el **Trópico de Capricornio**. 🌴\nEntre ellos, el clima es muuuy calientito… ¡perfecto para las vacaciones! 🏖️😎",
    color: "#facc15" // amarillo cálido
  },
  {
    texto: "❄️ Si viajamos hacia los extremos del planeta, llegamos a los **círculos polares**. 🧊\nAllí hace muchísimo frío y hay hielo casi todo el año. 🐧🥶",
    color: "#60a5fa" // azul polar
  },
  {
    texto: "🧭 Ahora mira esas líneas que van de arriba a abajo.\nSe llaman **meridianos**, y el más importante es el **Meridiano de Greenwich**. 📍\nNos ayudan a ubicar los lugares en el mapa. 🗺️",
    color: "#4ade80" // verde claro
  },
  {
    texto: "✨ ¡Y listo, pequeño explorador! 🚀\nAunque estas líneas no se ven en la vida real, son muy importantes para **entender cómo está organizado nuestro planeta Tierra**. 💫🌏",
    color: "#c084fc" // violeta mágico
  }
];


let dialogoActual = 0;
let dialogoTimeout;
let dialogosCompletados = false;
let cooldownActivo = false;
const COOLDOWN_TIME = 5000; // 5 segundos de espera después de completar todos los diálogos

// ============================================
// INICIALIZACIÓN
// ============================================
function init() {
    // Crear escena
    scene = new THREE.Scene();
    
    // Crear campo de estrellas
    createStarfield();

    // Configurar cámara
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Configurar renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    // Crear la Tierra (cargará el modelo GLB)
    createEarth();

    // Configurar iluminación
    setupLights();

    // Event listeners para interacción
    setupEventListeners();
    
    // Configurar botón de música
    setupMusicToggle();
    
    // NO inicializar audio aquí - se hará al hacer clic en "Comenzar"

    // NO mostrar diálogos automáticamente, esperar a que el usuario toque el fondo

    // Animar
    animate();
}

// ============================================
// CONFIGURAR BOTÓN DE MÚSICA
// ============================================
function setupMusicToggle() {
    const musicButton = document.getElementById('toggle-music');
    let musicPlaying = true; // La música empieza sonando automáticamente
    
    musicButton.addEventListener('click', () => {
        if (!audioInicializado) {
            inicializarAudio();
        }
        
        if (musicPlaying) {
            // Pausar música
            if (musicaFondo) {
                musicaFondo.pause();
            }
            musicButton.textContent = '🔇';
            musicButton.classList.add('muted');
            musicPlaying = false;
        } else {
            // Reproducir música
            reproducirMusicaFondo();
            musicButton.textContent = '🔊';
            musicButton.classList.remove('muted');
            musicPlaying = true;
        }
    });
}

// ============================================
// CREAR CAMPO DE ESTRELLAS
// ============================================
function createStarfield() {
    // Crear geometría para las estrellas
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000; // Número de estrellas
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // Posiciones aleatorias en una esfera grande
        const radius = 100 + Math.random() * 400;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Colores variados (blanco, azulado, amarillento)
        const colorVariation = Math.random();
        if (colorVariation < 0.7) {
            // Estrellas blancas (mayoría)
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        } else if (colorVariation < 0.85) {
            // Estrellas azuladas
            colors[i * 3] = 0.7;
            colors[i * 3 + 1] = 0.8;
            colors[i * 3 + 2] = 1;
        } else {
            // Estrellas amarillentas
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.9;
            colors[i * 3 + 2] = 0.7;
        }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material para las estrellas
    const starMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Añadir gradiente de fondo espacial
    scene.background = new THREE.Color(0x000510);
    
    // Opcional: añadir niebla para efecto de profundidad
    scene.fog = new THREE.FogExp2(0x000510, 0.001);
}

// ============================================
// CREAR LA TIERRA (CON MODELO GLB)
// ============================================
function createEarth() {
    console.log('🌍 Intentando cargar modelo GLB...');
    
    const loader = new THREE.GLTFLoader();
    loader.load(
        './scene.glb', // Archivo GLB
        function (gltf) {
            const model = gltf.scene;
            
            console.log('📦 Modelo cargado:', model);
            
            // Ajustar tamaño del modelo PRIMERO (más pequeño para móviles)
            model.scale.set(1.4, 1.4, 1.4);
            
            // Calcular el bounding box DESPUÉS del escalado
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            console.log('📍 Centro del modelo:', center);
            console.log('📏 Tamaño del modelo:', size);
            
            // Mover el modelo para que su centro esté en (0,0,0)
            model.position.set(-center.x, -center.y, -center.z);
            
            // Crear un grupo contenedor centrado en (0,0,0)
            earth = new THREE.Group();
            earth.add(model);
            
            // Añadir el grupo a la escena
            scene.add(earth);
            
            // Calcular radio basado en la mitad del tamaño máximo
            const radius = Math.max(size.x, size.y, size.z) / 2;
            console.log('🎯 Radio calculado para las líneas:', radius);
            
            // Crear las líneas en el centro del grupo (0,0,0)
            createLatitudeLines(radius);
            
            console.log('✅ Modelo y líneas centrados en el mismo punto');
        },
        function (xhr) {
            const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
            console.log(`⏳ Cargando: ${percent}%`);
        },
        function (error) {
            console.error('❌ Error cargando el modelo:', error);
            console.error('Verifica que uses Live Server, no abrir el HTML directamente');
        }
    );
}

// ============================================
// CREAR LÍNEAS (PARALELOS Y MERIDIANOS)
// ============================================

// Función auxiliar para crear un sprite de texto flotante
function createTextLabel(text, position, color = 0xffffff) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 96;
    
    // Dibujar fondo semi-transparente con esquinas redondeadas
    const borderRadius = 20;
    const padding = 10;
    
    context.fillStyle = 'rgba(0, 5, 15, 0.5)';
    context.beginPath();
    context.roundRect(padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, borderRadius);
    context.fill();
    
    // Borde sutil para darle más definición
    context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, borderRadius);
    context.stroke();
    
    // Texto con fuente más legible
    context.font = 'Bold 32px Arial, sans-serif';
    context.fillStyle = '#' + color.toString(16).padStart(6, '0');
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Crear textura y sprite
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        depthTest: false // Siempre visible por encima
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(1.2, 0.3, 1); // Tamaño más compacto
    
    return sprite;
}

function createLatitudeLines(radius) {
    if (!earth) return; // Verificar que earth exista
    
    // � El radio ahora se calcula dinámicamente basado en el tamaño real del modelo
    console.log('🎨 Creando líneas con radio:', radius);
    
    // Calcular la posición de los trópicos proporcionalmente
    // 23.5° de latitud = aproximadamente 0.4 en coordenadas normalizadas
    const tropicOffset = radius * 0.5;
    
    // PARALELOS (Líneas horizontales)
    // Ecuador (amarillo) - centro del modelo
    createParallelLine(
        radius, 
        0, 
        0xffd700, 
        'Ecuador', // Nombre corto para la etiqueta
        'El Ecuador divide a la Tierra en dos mitades: norte y sur.\n¡Aquí los días y las noches duran casi lo mismo todo el año! 🌞🌙' // Descripción al tocar
    );

    // Trópico de Cáncer (rojo) - 23.5° norte
    createParallelLine(
        radius, 
        tropicOffset, 
        0xff6b6b, 
        'Trópico de Cáncer',
        'El Trópico de Cáncer marca el punto más al norte donde el Sol puede brillar justo encima. ☀️\n¡Pasa por países como México y Egipto!'
    );
    
    // Trópico de Capricornio (azul claro) - 23.5° sur
    createParallelLine(
        radius, 
        -tropicOffset, 
        0x4ecdc4, 
        'Trópico de Capricornio',
        'El Trópico de Capricornio está al sur.\n¡Allí el Sol llega directo en diciembre, cuando en el norte es invierno! ❄️☀️'
    );
    
    // MERIDIANOS (Líneas verticales)
    // Meridiano de Greenwich (verde)
    createMeridianLine(
        radius, 
        0, 
        0x00ff00, 
        'Antimeridiano',
        'El Antimeridiano está justo al otro lado del planeta del Meridiano de Greenwich.\n¡Cruza el océano Pacífico, donde cambia el día! 🌊🗓️'
    );
    
    // Meridiano opuesto (morado claro)
    createMeridianLine(
        radius, 
        Math.PI, 
        0xaa88ff, 
        'Greenwich',
        'El Meridiano de Greenwich es el punto de partida para medir las horas del mundo. 🕒\n¡Pasa por Londres, Inglaterra!'
    
     );
    
    // Meridianos adicionales cada 90 grados
    createMeridianLine(
        radius, 
        Math.PI / 2, 
        0xffaa00, 
        'Meridiano 90° E',
        'El Meridiano 90° Este pasa por Asia.\n¡Por aquí el Sol sale mucho antes que en América! 🌅'
    );
    createMeridianLine(
        radius, 
        -Math.PI / 2, 
        0xff88aa, 
        'Meridiano 90° O',
        'El Meridiano 90° Oeste pasa por América.\n¡Por aquí el Sol se pone más tarde que en Europa! 🌇'
    );
}

// Crear un paralelo (línea horizontal, como el Ecuador)
function createParallelLine(radius, yPosition, color, shortName, description) {
    const segments = 64;
    const points = [];
    
    // Calcular el radio del círculo (fuera del bucle para usarlo después)
    const circleRadius = Math.sqrt(radius * radius - yPosition * yPosition);

    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = Math.cos(theta) * circleRadius;
        const z = Math.sin(theta) * circleRadius;
        points.push(new THREE.Vector3(x, yPosition, z));
    }

    // Crear curva desde los puntos
    const curve = new THREE.CatmullRomCurve3(points, true);
    
    // Crear tubo para línea gruesa (TubeGeometry en lugar de Line)
    const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.015, 8, true);
    
    const material = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.9
    });

    const line = new THREE.Mesh(tubeGeometry, material);
    line.name = shortName; // Nombre corto
    line.userData.description = description; // Descripción completa para el diálogo
    earth.add(line);
    lines.push(line); // Añadir la línea visible también
    
    // Crear etiqueta de texto flotante con el nombre corto
    const labelPosition = new THREE.Vector3(circleRadius, yPosition, 0);
    const label = createTextLabel(shortName, labelPosition, color);
    earth.add(label);
    
    // Crear área de toque invisible más grande para móviles (5x más grande)
    const touchArea = new THREE.TubeGeometry(curve, segments, 0.085, 8, true);
    const touchMaterial = new THREE.MeshBasicMaterial({
        visible: false // Completamente invisible, no se renderiza
    });
    const touchMesh = new THREE.Mesh(touchArea, touchMaterial);
    touchMesh.name = shortName; // Nombre corto
    touchMesh.userData.description = description; // Descripción completa
    touchMesh.userData.isInteractive = true;
    touchMesh.visible = true; // Necesario para raycasting pero no se dibuja
    earth.add(touchMesh);
    lines.push(touchMesh); // Añadir el área de toque a la lista de líneas
}

// Crear un meridiano (línea vertical, de polo a polo)
function createMeridianLine(radius, longitude, color, shortName, description) {
    const segments = 64;
    const points = [];

    // Crear línea vertical desde polo norte a polo sur
    for (let i = 0; i <= segments; i++) {
        const phi = (i / segments) * Math.PI; // De 0 (polo norte) a PI (polo sur)
        const x = radius * Math.sin(phi) * Math.cos(longitude);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(longitude);
        points.push(new THREE.Vector3(x, y, z));
    }

    // Crear curva desde los puntos
    const curve = new THREE.CatmullRomCurve3(points, false);
    
    // Crear tubo para línea gruesa
    const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.015, 8, false);
    
    const material = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.9
    });

    const line = new THREE.Mesh(tubeGeometry, material);
    line.name = shortName; // Nombre corto
    line.userData.description = description; // Descripción completa para el diálogo
    earth.add(line);
    lines.push(line); // Añadir la línea visible también
    
    // Crear etiqueta de texto flotante en el ecuador del meridiano con el nombre corto
    const labelX = radius * Math.cos(longitude);
    const labelZ = radius * Math.sin(longitude);
    const labelPosition = new THREE.Vector3(labelX, 0, labelZ);
    const label = createTextLabel(shortName, labelPosition, color);
    earth.add(label);
    
    // Crear área de toque invisible más grande para móviles (5x más grande)
    const touchArea = new THREE.TubeGeometry(curve, segments, 0.075, 8, false);
    const touchMaterial = new THREE.MeshBasicMaterial({
        visible: false // Completamente invisible, no se renderiza
    });
    const touchMesh = new THREE.Mesh(touchArea, touchMaterial);
    touchMesh.name = shortName; // Nombre corto
    touchMesh.userData.description = description; // Descripción completa
    touchMesh.userData.isInteractive = true;
    touchMesh.visible = true; // Necesario para raycasting pero no se dibuja
    earth.add(touchMesh);
    lines.push(touchMesh); // Añadir el área de toque a la lista de líneas
}

// ============================================
// CONFIGURAR ILUMINACIÓN
// ============================================
function setupLights() {
    // Luz ambiental suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Luz direccional principal (simula el sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Luz de relleno desde atrás
    const backLight = new THREE.DirectionalLight(0x4ecdc4, 0.3);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);
}

// ============================================
// CONFIGURAR EVENTOS DE INTERACCIÓN
// ============================================
function setupEventListeners() {
    // Mouse events (escritorio)
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onCanvasClick);

    // Touch events (móvil)
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd);
    renderer.domElement.addEventListener('touchend', onTouchClick);

    // Resize
    window.addEventListener('resize', onWindowResize);
}

// Variables para raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let clickStartPos = { x: 0, y: 0 };

function onMouseDown(event) {
    // Reproducir sonido de click
    reproducirSonidoClick();
    
    isDragging = true;
    clickStartPos = {
        x: event.clientX,
        y: event.clientY
    };
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    hideInstructions();
}

function onMouseMove(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    earth.rotation.y += deltaX * 0.005;
    earth.rotation.x += deltaY * 0.005;

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseUp() {
    isDragging = false;
}

function onTouchStart(event) {
    event.preventDefault();
    
    // Reproducir sonido de click
    reproducirSonidoClick();
    
    if (event.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
        hideInstructions();
    }
}

function onTouchMove(event) {
    event.preventDefault();
    if (!isDragging || event.touches.length !== 1) return;

    const deltaX = event.touches[0].clientX - previousMousePosition.x;
    const deltaY = event.touches[0].clientY - previousMousePosition.y;

    earth.rotation.y += deltaX * 0.005;
    earth.rotation.x += deltaY * 0.005;

    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
}

function onTouchEnd() {
    isDragging = false;
}

// Detectar clic en canvas (mouse)
function onCanvasClick(event) {
    // Solo hacer clic si no hubo arrastre
    const dx = event.clientX - clickStartPos.x;
    const dy = event.clientY - clickStartPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) return; // Fue un arrastre, no un clic

    checkLineClick(event.clientX, event.clientY);
    checkBackgroundClick(event.clientX, event.clientY);
}

// Detectar clic en líneas (touch)
function onTouchClick(event) {
    if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        checkLineClick(touch.clientX, touch.clientY);
        checkBackgroundClick(touch.clientX, touch.clientY);
    }
}

// Función principal para detectar clic en líneas
function checkLineClick(clientX, clientY) {
    // Convertir coordenadas de pantalla a coordenadas normalizadas
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    // Actualizar raycaster
    raycaster.setFromCamera(mouse, camera);

    // Detectar intersecciones con las líneas
    const intersects = raycaster.intersectObjects(lines, false);

    if (intersects.length > 0) {
        const clickedLine = intersects[0].object;
        if (clickedLine.userData.isInteractive) {
            // Mostrar descripción completa de la línea
            mostrarDescripcionLinea(clickedLine.name, clickedLine.userData.description);
        }
    }
}

// Función para detectar clic en el fondo (estrellas)
function checkBackgroundClick(clientX, clientY) {
    // Convertir coordenadas de pantalla a coordenadas normalizadas
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    // Actualizar raycaster
    raycaster.setFromCamera(mouse, camera);

    // Detectar intersecciones con la Tierra y las líneas
    const allObjects = earth ? earth.children : [];
    const intersects = raycaster.intersectObjects(allObjects, true);

    // Si NO hay intersecciones, significa que clickearon el fondo (estrellas)
    if (intersects.length === 0) {
        mostrarSiguienteDialogo();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function hideInstructions() {
    if (isFirstInteraction) {
        instrucciones.classList.add('oculto');
        isFirstInteraction = false;
    }
}

// ============================================
// SISTEMA DE DIÁLOGOS
// ============================================
function mostrarSiguienteDialogo() {
    // Si está en cooldown, ignorar
    if (cooldownActivo) {
        console.log('⏳ Diálogos en cooldown, espera un momento...');
        return;
    }

    // Si ya se completó el ciclo, iniciar cooldown y reiniciar
    if (dialogosCompletados) {
        console.log('✅ Todos los diálogos ya fueron mostrados, iniciando cooldown...');
        iniciarCooldown();
        return;
    }

    // Limpiar timeout anterior
    if (dialogoTimeout) {
        clearTimeout(dialogoTimeout);
    }

    // Obtener el diálogo actual
    const dialogoActualObj = dialogos[dialogoActual];
    
    // Mostrar el diálogo con su color y texto
    textoDialogo.innerHTML = dialogoActualObj.texto.replace(/\n/g, '<br>');
    dialogoDiv.style.background = `linear-gradient(90deg, ${dialogoActualObj.color}33, ${dialogoActualObj.color}55)`;
    dialogoDiv.style.borderColor = `${dialogoActualObj.color}88`;
    dialogoDiv.classList.remove('oculto');

    console.log(`📖 Mostrando diálogo ${dialogoActual + 1}/${dialogos.length}`);

    // Calcular duración basada en la longitud del texto (aumentado a 12-15 segundos)
    const duracion = dialogoActualObj.texto.length > 200 ? 15000 : 12000;

    // Ocultar después del tiempo calculado
    dialogoTimeout = setTimeout(() => {
        dialogoDiv.classList.add('oculto');
        
        // Avanzar al siguiente diálogo
        dialogoActual++;
        
        // Si llegamos al final, marcar como completado
        if (dialogoActual >= dialogos.length) {
            console.log('🎉 Todos los diálogos mostrados');
            dialogosCompletados = true;
            iniciarCooldown();
        }
    }, duracion);
}

function iniciarCooldown() {
    cooldownActivo = true;
    console.log(`⏱️ Cooldown iniciado: ${COOLDOWN_TIME/1000} segundos`);
    
    setTimeout(() => {
        cooldownActivo = false;
        dialogosCompletados = false;
        dialogoActual = 0;
        console.log('✨ Cooldown terminado, puedes tocar el fondo de nuevo');
    }, COOLDOWN_TIME);
}

// Función para mostrar nombre de línea clickeada
function mostrarDescripcionLinea(nombre, descripcion) {
    // Reproducir sonido de clic
    reproducirSonidoClick();
    
    // Mostrar el nombre en negrita y la descripción completa
    textoDialogo.innerHTML = `📍 <strong>${nombre}</strong><br><br>${descripcion.replace(/\n/g, '<br>')}`;
    dialogoDiv.style.background = 'linear-gradient(90deg, #1e293b99, #334155aa)';
    dialogoDiv.style.borderColor = '#00ffff55';
    dialogoDiv.classList.remove('oculto');
    
    // Ocultar después de 10 segundos (tiempo aumentado para mejor lectura)
    if (dialogoTimeout) {
        clearTimeout(dialogoTimeout);
    }
    dialogoTimeout = setTimeout(() => {
        dialogoDiv.classList.add('oculto');
    }, 10000);
}

// ============================================
// FUNCIONES AUXILIARES PARA ESTRELLAS (NO USADAS ACTUALMENTE)
// ============================================

var CreateCloseStars = function() {
        this.mesh = new THREE.Object3D();
        var geom = new THREE.SphereGeometry(2,6,6);
        this.mat = new THREE.MeshPhongMaterial({
            shininess: 100,
            specular: 0xffffff,
            transparent: true
        });

        var star;
        var startCount = 155;

        for (var i = 0; i < startCount; i++) {
            star = new THREE.Mesh(geom, this.mat);
            star.position.x = Math.random() * (WIDTH + 1) - WIDTH/2;
            star.position.y = Math.random() * (HEIGHT + 1) - HEIGHT/2;
            star.position.z = Math.floor(Math.random() * (1200 - 1)) - 1500;
            star.scale.set(.5,.5,.5);
            this.mesh.add( star );
        }
    };

    var closeStars;
    var distantStars

    function createCosmos() {
        distantStars = new CreateDistantStars();
        closeStars = new CreateCloseStars();
        closeStars.mesh.position.set(0,0,0);
        distantStars.mesh.position.set(0,0,0);
        scene.add(distantStars.mesh, closeStars.mesh);
    }


// ============================================
// ANIMACIÓN PRINCIPAL
// ============================================
function animate() {
    requestAnimationFrame(animate);

    // Rotación automática si no se está arrastrando (y si earth ya existe)
    if (earth && !isDragging) {
        earth.rotation.y += autoRotateSpeed;
    }

    // Animar el campo de estrellas con rotación lenta
    if (stars) {
        stars.rotation.y += 0.0001;
        stars.rotation.x += 0.00005;
    }

    // Hacer que las líneas brillen suavemente
    lines.forEach((line, index) => {
        // Solo animar líneas visibles que tengan material con opacity
        if (line.material && line.material.opacity !== undefined && line.material.visible !== false) {
            const time = Date.now() * 0.001;
            line.material.opacity = 0.75 + Math.sin(time + index) * 0.2;
            line.material.transparent = true;
        }
    });

    renderer.render(scene, camera);
}

// ============================================
// INICIAR LA APLICACIÓN
// ============================================
// Configurar el botón de comenzar
document.addEventListener('DOMContentLoaded', function() {
    const botonComenzar = document.getElementById('boton-comenzar');
    const pantallaInicio = document.getElementById('pantalla-inicio');
    
    botonComenzar.addEventListener('click', function() {
        // Ocultar pantalla de inicio con animación
        pantallaInicio.classList.add('ocultar');
        
        // Esperar a que termine la animación antes de iniciar
        setTimeout(() => {
            pantallaInicio.style.display = 'none';
            
            // Iniciar la aplicación Three.js
            init();
            
            // Inicializar y reproducir música de fondo
            inicializarAudio();
            reproducirMusicaFondo();
        }, 800); // Duración de la animación de desvanecer
    });
});
