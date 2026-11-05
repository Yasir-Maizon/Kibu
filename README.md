# Kibu v0.8 — Aprender con lo que tienes

Prototipo web educativo de preescolar para familias y niños de 3 a 5 años. Se basa directamente en el código de **Kibu v0.7**; conserva el menú, la navegación, las actividades, favoritos, consejos y la identidad visual original. No existe una sección docente en esta versión, como se solicitó.

## Abrir sin instalar nada
1. Extrae el ZIP completo.
2. Abre `index.html` con Chrome o Brave (doble clic). No es necesario Node.js para el modo local.
3. Completa el onboarding o introduce un apodo opcional. Edad y apoyos se pueden modificar en Perfil.
4. Explora actividades, minijuegos, chat con Kibu, favoritos, estrellas y stickers.

**No hay conexión con IA real cuando se abre directamente el HTML.** Las respuestas se basan en reglas programadas, con memoria temática temporal, y las actividades son propuestas locales. Se indica “Modo prototipo”. La foto se previsualiza pero no se analiza sin servidor.

## Funciones de v0.8
- Mantiene tipografía redondeada (Nunito/Baloo 2 si están instaladas; alternativas de sistema sin cargar fuentes externas), paneles ilustrados y colores propios.
- Paleta blanca/lavanda/naranja/morada para modo claro y ciruela oscura cálida/crema en oscuro, sin acento azul en la interfaz. En Perfil puedes cambiar entre claro, oscuro y automático.
- Trece imágenes PNG personalizadas de los adjuntos, optimizadas y recortadas en `assets/stickers/` (sin texto superpuesto).
- Chat directo sin cuestionario obligatorio. Personalización opcional por edad, área, materiales y apoyos. Respuestas educativas por temas, variaciones y sugerencias de continuación.
- Entrada de voz por micrófono en navegadores compatibles, reproducción de voz en español con entonación más aguda y botón para detener. **La voz exacta depende de las voces del sistema/navegador**; no se garantiza voz sintética de personaje. Reconocimiento de voz puede requerir permisos, HTTPS o proveedor externo del navegador.
- Juegos con progresión amable: números y cantidades, vocales, letras, sílabas, inglés básico y colores/formas. Las respuestas correctas dan estrellas y desbloquean stickers. Voz por pregunta, incluida pronunciación inglesa.
- Foto por cámara/galería, validación de JPG/PNG/WebP de hasta 6 MB, vista previa y eliminación. En modo local la actividad se genera usando la descripción, no la foto.
- Búsqueda de videos educativos; con YouTube Data API configurada se consulta el servidor, si no se abre una búsqueda externa. Se pide confirmación adulta antes de abrir YouTube.
- Nombre del niño opcional y guardado exclusivamente en este navegador, usado en saludo, consejos del chat, actividades, felicitaciones y Perfil.
- Diseño responsive de tres escalas: móvil (menú inferior), tablet (rejillas táctiles), computadora (barra lateral y distribución amplia).

## Conexión opcional a IA y YouTube
El servidor incluido en la v0.7 se conserva: `server.js` en Node.js 20+. Para activarlo:

```powershell
$env:OPENAI_API_KEY="tu_clave_privada_de_OpenAI"
$env:YOUTUBE_API_KEY="tu_clave_opcional_de_YouTube"
node server.js
```

Abre **http://localhost:8787**. La aplicación sigue funcionando sin claves en modo demostración. Mantén las claves en el servidor/variables de entorno, jamás en el código HTML, JS, ni en localStorage. El servidor escucha solo en 127.0.0.1, pensado para desarrollo local, no para publicación pública.

Una suscripción personal a ChatGPT no incluye automáticamente créditos de OpenAI API. La IA real y YouTube API no pudieron verificarse aquí sin credenciales. La privacidad y protección de menores requieren revisión antes de desplegar públicamente.

## Privacidad y límites
- Perfil > Borrar mis datos elimina el perfil, los progresos, favoritos y preferencias almacenados por la app en este navegador.
- El chat en modo prototipo no se sincroniza ni almacena como conversación remota. Las sugerencias no son diagnósticos.
- Los stickers son recursos del usuario; se integraron y procesaron localmente. Los dibujos de pasos existentes representan áreas generales, **no fotografías ni ilustraciones específicas generadas por IA**.
- Evita subir fotos con rostros de menores. Las imágenes solo se envían al servidor cuando se activa IA real y la persona pulsa explícitamente generar.
- El servicio opcional de reconocimiento de voz puede utilizar servicios externos del navegador; debe haber permiso del usuario.
- YouTube es externo y un adulto debe revisar el contenido. El filtro de YouTube API no sustituye la supervisión.
- No se ha hecho una auditoría de seguridad ni pruebas de despliegue público.

## Validación
- Sintaxis de `js/app.js`, `js/v08.js` y `server.js` comprobada con Node.
- Pruebas de interfaz en Chromium mediante inyección de archivos locales: onboarding, nombre, chat y respuestas, minijuegos, controles de foto, tema oscuro, y ausencia de desbordamiento horizontal en móvil y computadora. Se incluirán resultados adicionales en las notas de entrega.
- El entorno bloqueó abrir páginas `file://` y `http://127.0.0.1` directamente en el navegador de pruebas: no se debe afirmar que se probó la ejecución directa de `index.html` desde el ZIP en este entorno. La estructura y las rutas relativas sí se verificaron.
- Micrófono, voces reales disponibles y llamadas externas necesitan validarse en dispositivos de destino.
