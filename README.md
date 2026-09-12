# Edudata Flujo

MVP local para visualizar el avance mensual de las bases de datos de Edudata.

## Despliegue con Docker (Producción / Servidor)

La aplicación está completamente dockerizada sobre **Nginx 1.27 Alpine**, optimizada para alto rendimiento con compresión Gzip, cabeceras de seguridad y proxy inverso para sincronización en vivo sin problemas de CORS.

### Con Docker Compose (Recomendado)

```bash
docker compose up -d --build
```
La aplicación estará disponible inmediatamente en `http://localhost:8080`.

### Con Docker CLI

```bash
# Construir la imagen
docker build -t edudata-flujo:latest .

# Ejecutar el contenedor
docker run -d --name edudata-flujo -p 8080:80 --restart unless-stopped edudata-flujo:latest
```

### Comprobación de salud (Healthcheck)
El contenedor incluye un endpoint de verificación de salud en `/health` consultado automáticamente cada 30 segundos:
```bash
curl -f http://localhost:8080/health
```

---

## Ejecución Local (Sin Docker)

Abra `dist/index.html` directamente en cualquier navegador moderno o ejecute un servidor local ligero:
```bash
npx serve dist -l 8080
# o con Python:
python -m http.server 8080 --directory dist
```

---

## Módulos y Funcionalidades

### 1. Flujo de Bases de Datos
- Resumen ejecutivo por periodo con métricas de avance consolidado y tarjetas KPI interactivas.
- **Modo Concentración (Zen Mode)**:
  - Oculta el panel lateral de fuentes con una animación fluida para enfocar el 100% de la pantalla en el diagrama de flujo.
  - Activación mediante botón **Concentración** en la barra flotante, botón en el encabezado del panel lateral o la tecla de atajo **`Z`**.
  - Botón flotante accesible **"Mostrar bases (Z)"** para regresar al modo estándar en cualquier momento.
  - Re-encuadre inteligente y automático (`fitView`) para aprovechar al máximo el nuevo ancho panorámico.
- **Transición ágil y reactiva entre bases de datos**:
  - Retroalimentación visual inmediata con skeleton ultra-rápido (~85 ms) sin retrasos perceptibles ni bloqueos de interfaz.
  - Cancelación instantánea ante clics rápidos sucesivos para navegar sin esperas.
- **Lienzo interactivo profesional** estilo Miro / Figma / React Flow:
  - Arrastre libre (*Pan*) y zoom con rueda del ratón centrado en el cursor.
  - Barra de herramientas flotante: Zoom In/Out, 100%, **Ajustar a pantalla (`F`)**, **Enfocar etapa actual**, cuadrícula cíclica (puntos, cuadrícula, limpio), exportación **SVG / PNG** y **Pantalla completa**.
  - **Minimapa Radar** interactivo en tiempo real con visor de arrastre y navegación instantánea.
  - Nodos profesionales tipo tarjeta con franja de color semántico, esquinas squircle, responsable asignado y halo de pulso en la etapa activa.
  - Conectores ortogonales con curvas Bezier suaves y etiquetas de decisión legibles.
  - Barra de acciones rápidas sobre nodo y panel lateral técnico (*Drawer*) de inspección de insumos y entregables.
  - Búsqueda instantánea de bases con atajo **`Ctrl + K`** y filtros por estado (*Todas, En curso, Atención, Cerradas*).
- Atajos de teclado completos: `Z` (Concentración), `F` (Ajustar vista), `Ctrl+K` (Buscar), `V` (Selección), `H` / `Espacio` (Mover lienzo), `+` / `-` / `0` (Zoom), `Esc` (Deseleccionar / Salir de concentración).
- Colores semánticos de avance, espera, bloqueo y no aplicación.
- Cambio manual de etapa y registro modal de bloqueos e incidencias.

### 2. Seguimiento de Actividades (Google Sheets en Vivo con Auto-Sync)
- **Sincronización automática periódica en segundo plano**:
  - Polling automático cada **4 horas** (`14400000 ms`) sin intervención del usuario.
  - Sincronización manual on-demand inmediata al pulsar el botón **"Sincronizar"**.
  - Parámetro anti-caché (`_cb=timestamp`) y cabeceras `no-store` para garantizar datos siempre frescos.
  - Insignia visible `Auto · cada 4 h` con hora exacta de sincronización y botón manual de refresco forzado.
- **Cero latencia al cargar**: incluye snapshot inicial bundled y caché en `localStorage` para renderizado instantáneo incluso sin conexión.
- **Proxy inverso inteligente de Nginx (`/api/sheets-sync`)**: solventa las restricciones de CORS del navegador al consultar la hoja oficial en servidores de producción, con triple mecanismo de contingencia (Nginx -> Fetch directo -> Proxy CORS secundario).
- **Tarjetas KPI en vivo**: Total de actividades registradas, Finalizadas (% cumplimiento), En progreso, Atrasadas y Sin iniciar.
- **Filtro dinámico por responsable(s)**: desagrega asignaciones compuestas (*Eduardo*, *Manuel*, *María Isabel*, *Sebastián*, *Alejandro*, *Nini*, *Todos*).
- **Pestañas por estado y buscador en tiempo real** sobre tareas, descripciones y comentarios.
- **Modos de visualización integrados**:
  - **Tablero Kanban**: 4 columnas organizadas (*Sin Iniciar*, *En Progreso*, *Atrasada*, *Finalizada*) con etiquetas de fecha, badges numéricos, avatares por responsable y notas de seguimiento.
  - **Tabla detallada**: vista tabular con formato enriquecido para revisión exhaustiva de filas y comentarios.
- Botón manual de **Sincronizar** con indicador giratorio y enlace directo a la hoja oficial de Google Sheets.

### 3. Equipo (Módulo Dedicado de Carga y Talento)
- Accesible directamente desde la barra superior de navegación principal (`[Flujo de Bases]`, `[Seguimiento de Actividades]`, `[Equipo]`).
- **Resumen Ejecutivo en Tabla ("Tabla del Equipo")**:
  - Resumen tabular ejecutivo con columnas de Integrante (avatar, nombre, rol), Tareas Asignadas, Finalizadas, En Progreso, Atrasadas, Sin Iniciar, barra de % Avance visual con gradiente y botón interactivo directo **"Ver en Kanban ➔"**.
  - Fila de consolidado en `tfoot` con las métricas globales del equipo (Total asignaciones, total finalizadas, promedio global de avance).
- **KPIs Globales de Talento**:
  - Integrantes / Grupos activos.
  - Carga total distribuida.
  - Tareas completadas y % general.
  - Tareas en desarrollo.
  - Tareas atrasadas / alertas de atención.
- **Tarjetas Operativas por Integrante**:
  - Desglose con buscador instantáneo y pestañas de filtro (*Todos, Con atrasadas, Con activas, 100% al día*).
  - Actividades en foco con fechas, etiquetas de estado, comentarios y acceso directo al tablero Kanban.

---

## Persistencia

Los cambios manuales del flujo y la caché de actividades se guardan en el almacenamiento local del navegador (`localStorage`). Para reiniciar los datos iniciales use el botón **Reiniciar** en la barra superior o **Restablecer demo** en el pie de página.


