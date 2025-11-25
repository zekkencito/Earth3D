"""
Generador simple de iconos PWA
Requiere: pip install Pillow

Este script toma una imagen base y genera todos los tamaños necesarios
para la PWA de Tierra 3D.
"""

from PIL import Image
import os

# Tamaños necesarios para la PWA
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

def generar_iconos(imagen_base, carpeta_salida='icons'):
    """
    Genera iconos en diferentes tamaños desde una imagen base.
    
    Args:
        imagen_base: Ruta a la imagen base (preferiblemente 512x512 o mayor)
        carpeta_salida: Carpeta donde se guardarán los iconos
    """
    
    # Crear carpeta si no existe
    if not os.path.exists(carpeta_salida):
        os.makedirs(carpeta_salida)
        print(f"✅ Carpeta '{carpeta_salida}' creada")
    
    try:
        # Abrir imagen base
        img = Image.open(imagen_base)
        print(f"📂 Imagen base cargada: {imagen_base}")
        print(f"   Tamaño original: {img.size}")
        
        # Convertir a RGBA si no lo es
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Generar cada tamaño
        for size in SIZES:
            # Redimensionar con alta calidad
            icono = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Nombre del archivo
            nombre_archivo = f"icon-{size}x{size}.png"
            ruta_salida = os.path.join(carpeta_salida, nombre_archivo)
            
            # Guardar
            icono.save(ruta_salida, 'PNG', optimize=True)
            print(f"✅ Generado: {nombre_archivo}")
        
        print("\n🎉 ¡Todos los iconos generados correctamente!")
        print(f"📁 Ubicación: ./{carpeta_salida}/")
        
    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{imagen_base}'")
        print("   Asegúrate de que la ruta sea correcta.")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    print("🌍 Generador de Iconos PWA - Tierra 3D")
    print("=" * 50)
    
    # Solicitar ruta de la imagen base
    print("\n📝 Ingresa la ruta de tu imagen base (512x512px recomendado):")
    print("   Ejemplo: tierra.png  o  C:/Users/tu-usuario/Desktop/planeta.png")
    
    imagen = input("\nRuta de la imagen: ").strip()
    
    if not imagen:
        print("\n❌ No se especificó ninguna imagen.")
        print("💡 Tip: Crea una imagen cuadrada del planeta (512x512px)")
        print("   y guárdala en la carpeta del proyecto.")
    else:
        print("\n⏳ Generando iconos...")
        generar_iconos(imagen)
    
    input("\n✨ Presiona Enter para salir...")
