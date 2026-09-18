const steps = [
  { id: "solicitud", label: "Solicitud", action: "Enviar o confirmar la solicitud" },
  { id: "recepcion", label: "Recepción", action: "Confirmar que la base fue recibida" },
  { id: "procesamiento", label: "Procesamiento", action: "Preparar y validar los datos" },
  { id: "revision", label: "Revisión", action: "Revisar el procesamiento" },
  { id: "drive", label: "Carga al Drive", action: "Subir el archivo aprobado" },
  { id: "lago", label: "Lago de datos", action: "Cargar al lago de datos" },
  { id: "tablero", label: "Actualizar tablero", action: "Publicar los cambios del tablero" },
  { id: "final", label: "Revisión final", action: "Confirmar cifras y visualizaciones" },
  { id: "terminada", label: "Terminada", action: "Cerrar la actualización" }
];

const periods = {
  "2026-09": [
    ["SIMAT", "Cobertura", "Carolina Correa", "Estudiantes", "Eduardo", true, 6, "active"],
    ["HUMANO", "Administrativa y Financiera", "Glasford", "Docentes", "Eduardo", true, 2, "active"],
    ["PAE", "Cobertura", "Jaime Moreno", "Establecimientos", "Sebastian", true, 1, "waiting"],
    ["EJECUCIONES PRESUPUESTALES", "Planeación Económica y Social", "Nini Johana Sánchez", "Proyectos", "Sebastian", true, 2, "active"],
    ["SIMPADE", "Cobertura", "Paola Tapia", "No aplica", "Manuel", true, 1, "waiting"],
    ["ICFES Clasificación", "Calidad educativa", "Jenniffer Pedraza", "Pruebas Saber", "Sebastian", false, 0, "na"],
    ["ICFES Territorial", "Calidad educativa", "Jenniffer Pedraza", "Pruebas Saber", "Sebastian", false, 0, "na"],
    ["DUE SEDES", "Inspección y vigilancia", "Olga", "Establecimientos, mapa y otros", "Manuel", false, 0, "na"],
    ["DUE ESTABLECIMIENTOS", "Inspección y vigilancia", "Olga", "Establecimientos, mapa y otros", "Manuel", false, 0, "na"],
    ["Cobertura en cifras", "Cobertura", "Carolina Correa", "Estudiantes y mapa", "Eduardo", false, 0, "na"],
    ["Notas", "Planeación Económica y Social", "María Isabel Gómez y Sebastian Dow", "Todos los tableros", "Sebastian", true, 0, "waiting"],
    ["1S", "Planeación Económica y Social", "Caterine Gonzales", "Proyectos", "Sebastian", true, 0, "waiting"],
    ["3S", "Planeación Económica y Social", "Caterine Gonzales", "Proyectos", "Sebastian", true, 0, "waiting"],
    ["4S", "Planeación Económica y Social", "Caterine Gonzales", "Proyectos", "Sebastian", true, 0, "waiting"],
    ["Infraestructura", "Por definir", "Por definir", "Por definir", "Por definir", true, 0, "blocked", "Falta definir responsables y alcance"],
    ["ZPSPOAI", "Planeación Económica y Social", "Alejandro Reyes", "Proyectos", "Sebastian", false, 0, "na"]
  ],
  "2026-08": [
    ["SIMAT", "Cobertura", "Carolina Correa", "Estudiantes", "Eduardo", true, 9, "done"],
    ["HUMANO", "Administrativa y Financiera", "Glasford", "Docentes", "Eduardo", true, 9, "done"],
    ["PAE", "Cobertura", "Jaime Moreno", "Establecimientos", "Sebastian", true, 9, "done"],
    ["EJECUCIONES PRESUPUESTALES", "Planeación Económica y Social", "Nini Johana Sánchez", "Proyectos", "Sebastian", true, 9, "done"],
    ["SIMPADE", "Cobertura", "Paola Tapia", "No aplica", "Manuel", true, 9, "done"],
    ["ICFES Clasificación", "Calidad educativa", "Jenniffer Pedraza", "Pruebas Saber", "Sebastian", false, 0, "na"],
    ["ICFES Territorial", "Calidad educativa", "Jenniffer Pedraza", "Pruebas Saber", "Sebastian", false, 0, "na"],
    ["DUE SEDES", "Inspección y vigilancia", "Olga", "Varios tableros", "Manuel", false, 0, "na"],
    ["DUE ESTABLECIMIENTOS", "Inspección y vigilancia", "Olga", "Varios tableros", "Manuel", false, 0, "na"],
    ["Cobertura en cifras", "Cobertura", "Carolina Correa", "Estudiantes y mapa", "Eduardo", false, 0, "na"],
    ["Notas", "Planeación Económica y Social", "María Isabel Gómez y Sebastian Dow", "Todos los tableros", "Sebastian", true, 9, "done"],
    ["1S", "Planeación Económica y Social", "Caterine Gonzales", "Proyectos", "Sebastian", true, 9, "done"],
    ["3S", "Planeación Económica y Social", "Caterine Gonzales", "Proyectos", "Sebastian", true, 9, "done"],
    ["4S", "Planeación Económica y Social", "Caterine Gonzales", "Proyectos", "Sebastian", true, 8, "active"],
    ["Infraestructura", "Por definir", "Por definir", "Por definir", "Por definir", true, 0, "blocked", "Falta definir responsables y alcance"],
    ["ZPSPOAI", "Planeación Económica y Social", "Alejandro Reyes", "Proyectos", "Sebastian", false, 0, "na"]
  ]
};

const storageKey = "edudata-flujo-demo-v2";
const closedPeriodsKey = "edudata-flujo-closed-periods";
const periodLabelsKey = "edudata-flujo-period-labels";

const defaultPeriodLabels = { "2026-09": "Septiembre 2026", "2026-08": "Agosto 2026" };
const defaultClosedPeriods = ["2026-08"];

function loadPeriodLabels() {
  try { return JSON.parse(localStorage.getItem(periodLabelsKey)) || { ...defaultPeriodLabels }; }
  catch { return { ...defaultPeriodLabels }; }
}
function savePeriodLabels() { localStorage.setItem(periodLabelsKey, JSON.stringify(periodLabels)); }

function loadClosedPeriods() {
  try { return JSON.parse(localStorage.getItem(closedPeriodsKey)) || [...defaultClosedPeriods]; }
  catch { return [...defaultClosedPeriods]; }
}
function saveClosedPeriods() { localStorage.setItem(closedPeriodsKey, JSON.stringify(closedPeriods)); }

let periodLabels = loadPeriodLabels();
let closedPeriods = loadClosedPeriods();

const seed = () => Object.fromEntries(Object.entries(periods).map(([period, rows]) => [period, rows.map(([name, organism, sourceOwner, dashboard, owner, applies, progress, health, incident]) => ({ name, organism, sourceOwner, dashboard, owner, applies, progress, health, incident: incident ? { reason: incident, owner: "Coordinación Edudata" } : null }))]));
let data = loadData();
let selectedPeriod = Object.keys(periodLabels).sort((a, b) => b.localeCompare(a))[0] || "2026-09";
let selectedName = "SIMAT";

const $ = (id) => document.getElementById(id);

if (typeof window !== "undefined") {
  window.getSelectedName = () => selectedName;
  window.getSelectedPeriod = () => selectedPeriod;
  window.getPeriodLabels = () => periodLabels;
  window.getClosedPeriods = () => closedPeriods;
  window.getData = () => data;
}

function loadData() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || seed(); }
  catch { return seed(); }
}

function saveData() { localStorage.setItem(storageKey, JSON.stringify(data)); }
function currentRows() { return data[selectedPeriod] || []; }
function selectedBase() { return currentRows().find((item) => item.name === selectedName) || currentRows()[0]; }
function percent(item) { return item.applies ? Math.round((item.progress / steps.length) * 100) : 0; }

function getUnresolvedPendingCut(item) {
  if (!item || !item.pendingCut) return null;
  const prevPeriod = item.pendingCut.period;
  if (!prevPeriod || !data[prevPeriod]) return null;
  const prevBase = data[prevPeriod].find((b) => b.name.trim().toLowerCase() === item.name.trim().toLowerCase());
  if (prevBase && prevBase.applies && prevBase.health !== "done" && prevBase.progress < steps.length) {
    return {
      period: prevPeriod,
      periodLabel: periodLabels[prevPeriod] || item.pendingCut.periodLabel || prevPeriod,
      progress: prevBase.progress,
      stageLabel: steps[prevBase.progress]?.label || "En curso",
      owner: prevBase.owner || item.owner
    };
  }
  return null;
}

function deriveHealth(item) {
  if (!item.applies) return "na";
  if (item.incident) return "blocked";
  if (item.progress >= steps.length) return "done";
  return item.health === "waiting" ? "waiting" : "active";
}

function healthLabel(health) {
  return { done: "Terminada", active: "En curso", waiting: "Esperando respuesta", blocked: "Bloqueada", na: "No aplica" }[health];
}

const nodeMeta = {
  "inicio": {
    stepIndex: -1,
    title: "Inicio",
    subtitle: "Apertura mensual",
    icon: `<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    owner: "Coordinación Edudata",
    desc: "Apertura del ciclo operativo del mes para verificar qué fuentes deben actualizarse según el calendario institucional.",
    inputs: ["Calendario del año en curso", "Matriz de disponibilidad de fuentes"],
    outputs: ["Determinación de vigencia y apertura de requerimientos"]
  },
  "aplica": {
    stepIndex: -1,
    title: "¿Aplica este mes?",
    subtitle: "Calendario oficial",
    owner: "Líder de Base",
    desc: "Evaluación de periodicidad (mensual, trimestral o semestral). Si no aplica en el mes, la base pasa a reposo sin penalizar el avance mensual.",
    inputs: ["Frecuencia de corte de la entidad origen"],
    outputs: ["Ruta A: Solicitud formal / Ruta B: Registro No Aplica"]
  },
  "solicitud": {
    stepIndex: 0,
    step: "01",
    title: "Enviar solicitud",
    subtitle: "Requerimiento formal",
    icon: `<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    owner: (it) => it.name === "HUMANO" ? "Manuel" : (it.requester || it.owner),
    desc: "Emisión de requerimiento formal ante el custodio de la entidad fuente (Glasford Britton para HUMANO) para apertura del corte mensual.",
    inputs: ["Oficio de solicitud o comunicación formal", "Periodo de corte solicitado"],
    outputs: ["Comprobante de radicado o ticket de solicitud emitido"]
  },
  "recibida": {
    stepIndex: 1,
    title: "¿Base recibida?",
    subtitle: "Confirmación de entrega",
    owner: (it) => it.owner,
    desc: "Comprobación de que el archivo o conjunto de datos fue efectivamente transferido al equipo técnico.",
    inputs: ["Descarga de archivos o lectura de API de la entidad"],
    outputs: ["Ruta A: Pasa a procesamiento / Ruta B: Recordatorio y escalamiento"]
  },
  "procesamiento": {
    stepIndex: 2,
    step: "02",
    title: "Procesar datos",
    subtitle: "Limpieza y ETL",
    icon: `<circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    owner: (it) => it.owner,
    desc: "Ejecución de scripts de normalización, saneamiento de tipos, cruces de llaves (DANE) y cálculo de métricas agregadas.",
    inputs: ["Dataset bruto entregado por la entidad"],
    outputs: ["Tablas maestras transformadas y consolidadas"]
  },
  "validacion": {
    stepIndex: 3,
    title: "¿Validado?",
    subtitle: "Control de calidad",
    owner: (it) => "Responsabilidad compartida: Eduardo (apoyo de Nini, Sebastián y Manuel)",
    desc: "Revisión técnica de integridad, completitud y consistencia histórica. Responsabilidad compartida del equipo: normalmente revisa Eduardo, con apoyo de Nini y, según el caso, Sebastián y Manuel.",
    inputs: ["Reglas de validación y datos del mes anterior"],
    outputs: ["Ruta A: Aprobado a almacenamiento / Ruta B: Devolución para corrección"]
  },
  "drive": {
    stepIndex: 4,
    title: "¿Requiere Drive?",
    subtitle: "Respaldo y entrega",
    owner: (it) => it.owner,
    desc: "Evaluación de si la base debe archivarse en Google Drive para consumo directo por dependencias externas.",
    inputs: ["Políticas de distribución de la base"],
    outputs: ["Ruta A: Subir a Google Drive / Ruta B: Continuar directo"]
  },
  "lago": {
    stepIndex: 5,
    title: "¿Requiere Lago?",
    subtitle: "Almacén analítico",
    owner: (it) => it.owner,
    desc: "Determinación de si la tabla debe integrarse a la capa analítica de datos en Supabase / Data Warehouse.",
    inputs: ["Requerimientos del modelo de datos"],
    outputs: ["Ruta A: Cargar al lago de datos / Ruta B: Paso a visualización"]
  },
  "tablero": {
    stepIndex: 6,
    step: "06",
    title: "Actualizar tablero",
    subtitle: "Publicar en visualizador",
    icon: `<line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    owner: (it) => it.owner,
    desc: "Actualización de modelos de Power BI, vistas de Supabase o componentes web del Observatorio con los nuevos datos.",
    inputs: ["Tablas validadas del mes"],
    outputs: ["Reportes y dashboards actualizados en entorno de pruebas"]
  },
  "revision-final": {
    stepIndex: 7,
    title: "¿Revisión OK?",
    subtitle: "Aprobación de cifras",
    owner: "Coordinación Edudata",
    desc: "Revisión cruzada de cifras con directivos y líderes temáticos antes de liberar al público.",
    inputs: ["Tablero publicado en pre-producción"],
    outputs: ["Ruta A: Aprobado para cierre / Ruta B: Ajuste de visualizaciones"]
  },
  "terminada": {
    stepIndex: 8,
    step: "OK",
    title: "Terminada",
    subtitle: "Actualización cerrada",
    icon: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/><polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    owner: "Coordinación Edudata",
    desc: "Cierre exitoso del ciclo mensual. Las cifras quedan disponibles públicamente y se emite notificación de actualización.",
    inputs: ["Acta o visto bueno de revisión final"],
    outputs: ["Publicación en portal web y cierre de ciclo del periodo"]
  },
  "no-aplica": {
    stepIndex: -1,
    step: "N/A",
    title: "No aplica",
    subtitle: "Pausa para este mes",
    icon: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    owner: "Sin asignación",
    desc: "Esta base no tiene periodicidad programada para este mes. Queda registrada en pausa técnica.",
    inputs: ["Calendario de publicación oficial"],
    outputs: ["Estado neutral en indicadores de avance"]
  },
  "recordatorio": {
    stepIndex: 1,
    step: "REI",
    title: "Recordatorio",
    subtitle: "Reiteración a fuente",
    icon: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="12 7 12 12 15 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    owner: (it) => it.name === "HUMANO" ? "Manuel" : (it.requester || "Manuel"),
    desc: "Reiteración formal de la solicitud ante la dependencia fuente (Glasford Britton para HUMANO). Manuel realiza hasta 2 requerimientos de insistencia antes de escalar.",
    inputs: ["Días de mora desde la fecha límite", "Historial de solicitudes"],
    outputs: ["Hasta 2 comunicaciones de reiteración", "Ruta A: Entrega de base / Ruta B: Escalamiento a Nini"]
  },
  "escalamiento": {
    stepIndex: 1,
    step: "ESC",
    title: "Escalamiento",
    subtitle: "Solicitud Subsecretaría",
    icon: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    owner: "Nini (Líder de proceso)",
    desc: "Si tras dos reiteraciones de Manuel a Glasford no se recibe la base, Manuel escala la situación a la líder de proceso (Nini) para que realice la solicitud oficial a la Subsecretaría.",
    inputs: ["2 reiteraciones a Glasford sin respuesta", "Alerta formal de mora"],
    outputs: ["Solicitud oficial emitida ante la Subsecretaría", "Desbloqueo de entrega de datos"]
  },
  "corregir-datos": {
    stepIndex: 2,
    step: "DEV",
    title: "Corregir datos",
    subtitle: "Devolución y saneamiento",
    icon: `<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    owner: (it) => it.owner,
    desc: "Corrección interna de anomalías detectadas en la validación o solicitud de reemplazo de archivo a la fuente.",
    inputs: ["Reporte de inconsistencias de validación"],
    outputs: ["Dataset subsanado listo para re-validación"]
  },
  "subir-drive": {
    stepIndex: 4,
    step: "04",
    title: "Subir a Drive",
    subtitle: "Carga en nube institucional",
    icon: `<path d="M19 18H6a4 4 0 0 1-.8-7.92 5 5 0 0 1 9.9-1.08 4 4 0 0 1 3.9 5A3.5 3.5 0 0 1 19 18z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    owner: (it) => it.owner,
    desc: "Almacenamiento de archivos finales y reportes en carpetas compartidas de Google Workspace.",
    inputs: ["Archivos aprobados"],
    outputs: ["Enlace de descarga institucional público o restringido"]
  },
  "cargar-lago": {
    stepIndex: 5,
    step: "05",
    title: "Cargar al lago",
    subtitle: "Depósito de analítica",
    icon: `<ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" stroke-width="2" fill="none"/>`,
    owner: (it) => it.owner,
    desc: "Carga en tablas relacionales de base de datos para habilitar consultas SQL y analítica avanzada.",
    inputs: ["Esquema de base de datos y dataset saneado"],
    outputs: ["Registros insertados o actualizados en base de datos"]
  },
  "corregir-tablero": {
    stepIndex: 6,
    step: "REV",
    title: "Ajustar tablero",
    subtitle: "Corrección de reporte",
    icon: `<path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    owner: (it) => it.owner,
    desc: "Ajuste de filtros, tarjetas numéricas o leyendas reportadas durante la revisión previa de visualizaciones.",
    inputs: ["Observaciones de la revisión directiva"],
    outputs: ["Tablero corregido y listo para re-inspección"]
  }
};

const nodeEdgeMap = {
  "inicio": ["e-inicio-aplica"],
  "aplica": ["e-inicio-aplica", "e-aplica-solicitud", "e-aplica-noaplica", "b-aplica-yes", "b-aplica-no"],
  "solicitud": ["e-aplica-solicitud", "e-solicitud-recibida", "e-escalamiento-solicitud", "b-aplica-yes", "b-escalamiento-res"],
  "recibida": ["e-solicitud-recibida", "e-recibida-procesamiento", "e-recibida-recordatorio", "e-ret-recordatorio", "b-recibida-yes", "b-recibida-no"],
  "procesamiento": ["e-recibida-procesamiento", "e-procesamiento-validacion", "e-ret-corregir-datos", "b-recibida-yes"],
  "validacion": ["e-procesamiento-validacion", "e-validacion-drive", "e-validacion-corregir-datos", "e-ret-corregir-datos", "b-validacion-yes", "b-validacion-no"],
  "drive": ["e-validacion-drive", "e-drive-lago", "e-drive-subirdrive", "e-ret-subirdrive", "b-drive-yes", "b-drive-no"],
  "lago": ["e-drive-lago", "e-lago-tablero", "e-lago-cargarlago", "e-ret-cargarlago", "b-lago-yes", "b-lago-no"],
  "tablero": ["e-lago-tablero", "e-tablero-revision", "e-ret-cargarlago", "e-ret-corregir-tablero"],
  "revision-final": ["e-tablero-revision", "e-revision-terminada", "e-revision-corregir-tablero", "e-ret-corregir-tablero", "b-revision-yes", "b-revision-no"],
  "terminada": ["e-revision-terminada", "b-revision-yes"],
  "no-aplica": ["e-aplica-noaplica", "b-aplica-no"],
  "recordatorio": ["e-recibida-recordatorio", "e-ret-recordatorio", "e-recordatorio-escalamiento", "b-recibida-no", "b-recordatorio-escalar"],
  "escalamiento": ["e-recordatorio-escalamiento", "e-escalamiento-solicitud", "b-recordatorio-escalar", "b-escalamiento-res"],
  "corregir-datos": ["e-validacion-corregir-datos", "e-ret-corregir-datos", "b-validacion-no"],
  "subir-drive": ["e-drive-subirdrive", "e-ret-subirdrive", "b-drive-yes"],
  "cargar-lago": ["e-lago-cargarlago", "e-ret-cargarlago", "b-lago-yes"],
  "corregir-tablero": ["e-revision-corregir-tablero", "e-ret-corregir-tablero", "b-revision-no"]
};

function graphState(item, stepIndex) {
  if (!item.applies) return "pending";
  if (item.incident && item.progress === stepIndex) return "blocked";
  if (item.progress > stepIndex) return "done";
  if (item.progress === stepIndex) return "current";
  return "pending";
}

function edgeBadge(id, text, cx, cy, type = "yes") {
  const w = Math.max(34, Math.round(text.length * 6.8 + 14));
  const h = 20;
  return `<g class="edge-badge" id="${id}" transform="translate(${cx - w/2}, ${cy - h/2})">
    <rect class="edge-badge-rect ${type}" width="${w}" height="${h}" rx="10"/>
    <text class="edge-badge-text ${type}" x="${w/2}" y="${h/2 + 3.5}" text-anchor="middle">${text}</text>
  </g>`;
}

function renderPorts(cx, cy, w, h, isDecision = false) {
  if (isDecision) {
    return `<circle class="node-port" cx="${cx - w/2}" cy="${cy}" r="3.5"/>
      <circle class="node-port" cx="${cx + w/2}" cy="${cy}" r="3.5"/>
      <circle class="node-port" cx="${cx}" cy="${cy - h/2}" r="3.5"/>
      <circle class="node-port" cx="${cx}" cy="${cy + h/2}" r="3.5"/>`;
  }
  const x = cx - w/2;
  const y = cy - h/2;
  return `<circle class="node-port" cx="${x}" cy="${cy}" r="3.5"/>
    <circle class="node-port" cx="${x + w}" cy="${cy}" r="3.5"/>
    <circle class="node-port" cx="${cx}" cy="${y}" r="3.5"/>
    <circle class="node-port" cx="${cx}" cy="${y + h}" r="3.5"/>`;
}

function renderSelection(cx, cy, w, h, isDecision = false) {
  const pad = 6;
  if (isDecision) {
    const sw = w + pad * 2;
    const sh = h + pad * 2;
    const pts = `${cx},${cy - sh/2} ${cx + sw/2},${cy} ${cx},${cy + sh/2} ${cx - sw/2},${cy}`;
    return `<g class="selection-group">
      <polygon class="node-selection-box" points="${pts}"/>
      <rect class="selection-handle" x="${cx - 3.5}" y="${cy - sh/2 - 3.5}" width="7" height="7"/>
      <rect class="selection-handle" x="${cx + sw/2 - 3.5}" y="${cy - 3.5}" width="7" height="7"/>
      <rect class="selection-handle" x="${cx - 3.5}" y="${cy + sh/2 - 3.5}" width="7" height="7"/>
      <rect class="selection-handle" x="${cx - sw/2 - 3.5}" y="${cy - 3.5}" width="7" height="7"/>
    </g>`;
  }
  const x = cx - w/2 - pad;
  const y = cy - h/2 - pad;
  const sw = w + pad * 2;
  const sh = h + pad * 2;
  return `<g class="selection-group">
    <rect class="node-selection-box" x="${x}" y="${y}" width="${sw}" height="${sh}"/>
    <rect class="selection-handle" x="${x - 3.5}" y="${y - 3.5}" width="7" height="7"/>
    <rect class="selection-handle" x="${x + sw - 3.5}" y="${y - 3.5}" width="7" height="7"/>
    <rect class="selection-handle" x="${x + sw - 3.5}" y="${y + sh - 3.5}" width="7" height="7"/>
    <rect class="selection-handle" x="${x - 3.5}" y="${y + sh - 3.5}" width="7" height="7"/>
  </g>`;
}

function cardNode({ id, cx, cy, meta, state, isActive, isSelected, item }) {
  const w = 152;
  const h = 76;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const owner = typeof meta.owner === "function" ? meta.owner(item) : meta.owner;

  const colors = {
    done: { accent: "#10b981", iconBg: "#ecfdf5", iconColor: "#10b981" },
    current: { accent: "#2563eb", iconBg: "#eff6ff", iconColor: "#2563eb" },
    blocked: { accent: "#ef4444", iconBg: "#fef2f2", iconColor: "#ef4444" },
    waiting: { accent: "#f59e0b", iconBg: "#fffbeb", iconColor: "#f59e0b" },
    branch: { accent: "#8b5cf6", iconBg: "#f5f3ff", iconColor: "#8b5cf6" },
    pending: { accent: "#94a3b8", iconBg: "#f8fafc", iconColor: "#64748b" }
  };
  const theme = colors[state] || colors.pending;

  const stepBadge = meta.step ? `<rect class="node-step-pill" x="${x + w - 38}" y="${y + 7}" width="30" height="17" rx="8.5"/><text class="node-step-text" x="${x + w - 23}" y="${y + 19}" text-anchor="middle">${meta.step}</text>` : "";

  const beacon = isActive ? `
    <circle cx="${x + w / 2}" cy="${y - 6}" r="9" fill="${theme.accent}" opacity="0.25" class="beacon-pulse-ring"/>
    <circle cx="${x + w / 2}" cy="${y - 6}" r="4" fill="${theme.accent}"/>
  ` : "";

  return `<g class="graph-node ${state} ${isSelected ? 'selected' : ''}" data-node="${id}" data-title="${meta.title}" data-desc="${meta.subtitle}" data-owner="${owner}" data-status="${state}">
    ${isSelected ? renderSelection(cx, cy, w, h, false) : ''}
    <rect class="node-card-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>
    <rect class="node-card-stripe" x="${x + 1}" y="${y + 1}" width="${w - 2}" height="3.5" rx="2" fill="${theme.accent}"/>
    ${renderPorts(cx, cy, w, h, false)}
    ${beacon}
    ${meta.icon ? `
      <rect class="node-icon-bg" x="${x + 9}" y="${y + 14}" width="24" height="24" rx="6" fill="${theme.iconBg}"/>
      <g transform="translate(${x + 13}, ${y + 18})" style="color: ${theme.iconColor}">
        <svg width="16" height="16" viewBox="0 0 24 24">${meta.icon}</svg>
      </g>
    ` : ""}
    <text class="node-title" x="${x + (meta.icon ? 39 : 14)}" y="${y + 28}">${meta.title}</text>
    <text class="node-subtitle" x="${x + (meta.icon ? 39 : 14)}" y="${y + 44}">${meta.subtitle}</text>
    <line x1="${x + 10}" y1="${y + 55}" x2="${x + w - 10}" y2="${y + 55}" stroke="#f1f5f9" stroke-width="1"/>
    <g transform="translate(${x + 12}, ${y + 60})" opacity="0.6">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
    </g>
    <text class="node-owner-text" x="${x + 26}" y="${y + 68}">${owner || "Sin asignar"}</text>
    ${stepBadge}
  </g>`;
}

function decisionNode({ id, cx, cy, meta, state, isActive, isSelected, item }) {
  const w = 126;
  const h = 76;
  const points = `${cx},${cy - h/2} ${cx + w/2},${cy} ${cx},${cy + h/2} ${cx - w/2},${cy}`;
  const owner = typeof meta.owner === "function" ? meta.owner(item) : meta.owner;
  const beacon = isActive ? `
    <circle cx="${cx}" cy="${cy - h/2 - 7}" r="9" fill="var(--blue)" opacity="0.25" class="beacon-pulse-ring"/>
    <circle cx="${cx}" cy="${cy - h/2 - 7}" r="4" fill="var(--blue)"/>
  ` : "";

  return `<g class="graph-node decision ${state} ${isSelected ? 'selected' : ''}" data-node="${id}" data-title="${meta.title}" data-desc="${meta.subtitle}" data-owner="${owner}" data-status="${state}">
    ${isSelected ? renderSelection(cx, cy, w, h, true) : ''}
    <polygon class="node-card-bg decision-bg" points="${points}"/>
    <polygon class="decision-inner" points="${cx},${cy - h/2 + 5} ${cx + w/2 - 7},${cy} ${cx},${cy + h/2 - 5} ${cx - w/2 + 7},${cy}"/>
    ${renderPorts(cx, cy, w, h, true)}
    ${beacon}
    <g class="decision-icon" transform="translate(${cx - 6}, ${cy - 24})">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 17v.01M12 13.5a2.5 2.5 0 0 0 2-4 2.5 2.5 0 0 0-4.5 1"/></svg>
    </g>
    <text class="node-title decision-title" x="${cx}" y="${cy - 1}" text-anchor="middle">${meta.title}</text>
    <text class="node-subtitle decision-subtitle" x="${cx}" y="${cy + 15}" text-anchor="middle">${meta.subtitle}</text>
  </g>`;
}

function renderGraph(item, selectedNodeId = null) {
  const waiting = item.applies && item.health === "waiting" && item.progress <= 1;
  const dataBlocked = Boolean(item.incident) && item.progress <= 3;
  const boardBlocked = Boolean(item.incident) && item.progress >= 6;

  const nodeStates = {
    "inicio": item.applies ? "done" : "current",
    "aplica": item.applies ? "done" : "current",
    "solicitud": graphState(item, 0),
    "recibida": graphState(item, 1),
    "procesamiento": graphState(item, 2),
    "validacion": graphState(item, 3),
    "drive": graphState(item, 4),
    "lago": graphState(item, 5),
    "tablero": graphState(item, 6),
    "revision-final": graphState(item, 7),
    "terminada": graphState(item, 8),
    "no-aplica": item.applies ? "branch" : "current",
    "recordatorio": waiting ? "waiting" : "branch",
    "escalamiento": waiting ? "waiting" : "branch",
    "corregir-datos": dataBlocked ? "blocked" : "branch",
    "subir-drive": graphState(item, 4),
    "cargar-lago": graphState(item, 5),
    "corregir-tablero": boardBlocked ? "blocked" : "branch"
  };

  const isStepActive = (stepIdx) => item.applies && !item.incident && item.progress === stepIdx;

  const mainPathClass = (fromIdx) => {
    if (!item.applies) return "pending";
    if (item.progress > fromIdx) return "done";
    if (item.progress === fromIdx && !item.incident) return "current";
    return "pending";
  };

  const nodes = [
    cardNode({ id: "inicio", cx: 90, cy: 270, meta: nodeMeta["inicio"], state: nodeStates["inicio"], isActive: false, isSelected: selectedNodeId === "inicio", item }),
    decisionNode({ id: "aplica", cx: 265, cy: 270, meta: nodeMeta["aplica"], state: nodeStates["aplica"], isActive: !item.applies, isSelected: selectedNodeId === "aplica", item }),
    cardNode({ id: "solicitud", cx: 440, cy: 270, meta: nodeMeta["solicitud"], state: nodeStates["solicitud"], isActive: isStepActive(0), isSelected: selectedNodeId === "solicitud", item }),
    decisionNode({ id: "recibida", cx: 615, cy: 270, meta: nodeMeta["recibida"], state: nodeStates["recibida"], isActive: waiting, isSelected: selectedNodeId === "recibida", item }),
    cardNode({ id: "procesamiento", cx: 790, cy: 270, meta: nodeMeta["procesamiento"], state: nodeStates["procesamiento"], isActive: isStepActive(2), isSelected: selectedNodeId === "procesamiento", item }),
    decisionNode({ id: "validacion", cx: 965, cy: 270, meta: nodeMeta["validacion"], state: nodeStates["validacion"], isActive: dataBlocked, isSelected: selectedNodeId === "validacion", item }),
    decisionNode({ id: "drive", cx: 1140, cy: 270, meta: nodeMeta["drive"], state: nodeStates["drive"], isActive: isStepActive(4), isSelected: selectedNodeId === "drive", item }),
    decisionNode({ id: "lago", cx: 1315, cy: 270, meta: nodeMeta["lago"], state: nodeStates["lago"], isActive: isStepActive(5), isSelected: selectedNodeId === "lago", item }),
    cardNode({ id: "tablero", cx: 1490, cy: 270, meta: nodeMeta["tablero"], state: nodeStates["tablero"], isActive: isStepActive(6), isSelected: selectedNodeId === "tablero", item }),
    decisionNode({ id: "revision-final", cx: 1665, cy: 270, meta: nodeMeta["revision-final"], state: nodeStates["revision-final"], isActive: boardBlocked, isSelected: selectedNodeId === "revision-final", item }),
    cardNode({ id: "terminada", cx: 1840, cy: 270, meta: nodeMeta["terminada"], state: nodeStates["terminada"], isActive: item.applies && item.progress >= 9, isSelected: selectedNodeId === "terminada", item }),
    cardNode({ id: "no-aplica", cx: 265, cy: 462, meta: nodeMeta["no-aplica"], state: nodeStates["no-aplica"], isActive: !item.applies, isSelected: selectedNodeId === "no-aplica", item }),
    cardNode({ id: "recordatorio", cx: 615, cy: 78, meta: nodeMeta["recordatorio"], state: nodeStates["recordatorio"], isActive: waiting, isSelected: selectedNodeId === "recordatorio", item }),
    cardNode({ id: "escalamiento", cx: 350, cy: 78, meta: nodeMeta["escalamiento"], state: nodeStates["escalamiento"], isActive: false, isSelected: selectedNodeId === "escalamiento", item }),
    cardNode({ id: "corregir-datos", cx: 965, cy: 462, meta: nodeMeta["corregir-datos"], state: nodeStates["corregir-datos"], isActive: dataBlocked, isSelected: selectedNodeId === "corregir-datos", item }),
    cardNode({ id: "subir-drive", cx: 1140, cy: 78, meta: nodeMeta["subir-drive"], state: nodeStates["subir-drive"], isActive: false, isSelected: selectedNodeId === "subir-drive", item }),
    cardNode({ id: "cargar-lago", cx: 1315, cy: 462, meta: nodeMeta["cargar-lago"], state: nodeStates["cargar-lago"], isActive: false, isSelected: selectedNodeId === "cargar-lago", item }),
    cardNode({ id: "corregir-tablero", cx: 1665, cy: 78, meta: nodeMeta["corregir-tablero"], state: nodeStates["corregir-tablero"], isActive: boardBlocked, isSelected: selectedNodeId === "corregir-tablero", item })
  ].join("");

  return `<svg class="graph-svg" id="mainGraphSvg" viewBox="0 0 1960 590" role="img" aria-label="Flujo de actualización de ${item.name}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1.5L8 5L0 8.5z" fill="#cbd5e1"/></marker>
      <marker id="arrow-done" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1.5L8 5L0 8.5z" fill="#10b981"/></marker>
      <marker id="arrow-current" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1.5L8 5L0 8.5z" fill="#2563eb"/></marker>
      <marker id="arrow-blocked" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1.5L8 5L0 8.5z" fill="#ef4444"/></marker>
    </defs>

    <g class="edges">
      <!-- Main Spine Connections -->
      <path id="e-inicio-aplica" class="${item.applies ? 'done' : 'current'}" d="M166 270H202"/>
      <path id="e-aplica-solicitud" class="${mainPathClass(0)}" d="M328 270H364"/>
      <path id="e-solicitud-recibida" class="${mainPathClass(0)}" d="M516 270H552"/>
      <path id="e-recibida-procesamiento" class="${mainPathClass(1)}" d="M678 270H714"/>
      <path id="e-procesamiento-validacion" class="${mainPathClass(2)}" d="M866 270H902"/>
      <path id="e-validacion-drive" class="${mainPathClass(3)}" d="M1028 270H1077"/>
      <path id="e-drive-lago" class="${mainPathClass(4)}" d="M1203 270H1252"/>
      <path id="e-lago-tablero" class="${mainPathClass(5)}" d="M1378 270H1414"/>
      <path id="e-tablero-revision" class="${mainPathClass(6)}" d="M1566 270H1602"/>
      <path id="e-revision-terminada" class="${mainPathClass(7)}" d="M1728 270H1764"/>

      <!-- Branch: Aplica -> No aplica -->
      <path id="e-aplica-noaplica" class="branch ${!item.applies ? 'chosen' : ''}" d="M265 308V424"/>

      <!-- Branch: Recibida -> Recordatorio -->
      <path id="e-recibida-recordatorio" class="branch ${waiting ? 'chosen' : ''}" d="M615 232V116"/>
      <path id="e-ret-recordatorio" class="return ${waiting ? 'chosen' : ''}" d="M691 78 H 710 A 10 10 0 0 1 720 88 V 185 A 10 10 0 0 1 710 195 H 625 A 10 10 0 0 0 615 205 V 232"/>

      <!-- Branch: Recordatorio -> Escalamiento a Líder (Nini) -->
      <path id="e-recordatorio-escalamiento" class="branch ${waiting ? 'chosen' : ''}" d="M539 78 H 426"/>
      <path id="e-escalamiento-solicitud" class="return ${waiting ? 'chosen' : ''}" d="M350 116 V 175 A 10 10 0 0 0 360 185 H 430 A 10 10 0 0 1 440 195 V 232"/>

      <!-- Branch: Validación -> Corregir datos -->
      <path id="e-validacion-corregir-datos" class="branch ${dataBlocked ? 'chosen' : ''}" d="M965 308V424"/>
      <path id="e-ret-corregir-datos" class="return ${dataBlocked ? 'chosen' : ''}" d="M889 462 H 800 A 10 10 0 0 1 790 452 V 308"/>

      <!-- Branch: Drive -> Subir a Drive -->
      <path id="e-drive-subirdrive" class="branch ${nodeStates['subir-drive'] === 'done' ? 'done' : ''}" d="M1140 232V116"/>
      <path id="e-ret-subirdrive" class="return ${nodeStates['subir-drive'] === 'done' ? 'done' : ''}" d="M1216 78 H 1235 A 10 10 0 0 1 1245 88 V 260 A 10 10 0 0 0 1255 270 H 1252"/>

      <!-- Branch: Lago -> Cargar al lago -->
      <path id="e-lago-cargarlago" class="branch ${nodeStates['cargar-lago'] === 'done' ? 'done' : ''}" d="M1315 308V424"/>
      <path id="e-ret-cargarlago" class="return ${nodeStates['cargar-lago'] === 'done' ? 'done' : ''}" d="M1391 462 H 1400 A 10 10 0 0 0 1410 452 V 280 A 10 10 0 0 1 1420 270 H 1414"/>

      <!-- Branch: Revisión final -> Corregir tablero -->
      <path id="e-revision-corregir-tablero" class="branch ${boardBlocked ? 'chosen' : ''}" d="M1665 232V116"/>
      <path id="e-ret-corregir-tablero" class="return ${boardBlocked ? 'chosen' : ''}" d="M1589 78 H 1500 A 10 10 0 0 0 1490 88 V 232"/>
    </g>

    <!-- Clear Edge Decision Badges -->
    <g class="edge-badges">
      ${edgeBadge("b-aplica-yes", "Sí", 346, 252, "yes")}
      ${edgeBadge("b-aplica-no", "No", 265, 366, "no")}

      ${edgeBadge("b-recibida-yes", "Sí", 696, 252, "yes")}
      ${edgeBadge("b-recibida-no", "No", 615, 173, "no")}

      ${edgeBadge("b-recordatorio-escalar", "> 2 reiteraciones", 482, 56, "no")}
      ${edgeBadge("b-escalamiento-res", "Vía Subsecretaría", 395, 185, "info")}

      ${edgeBadge("b-validacion-yes", "Sí", 1052, 252, "yes")}
      ${edgeBadge("b-validacion-no", "No", 965, 366, "no")}

      ${edgeBadge("b-drive-yes", "Sí", 1140, 173, "yes")}
      ${edgeBadge("b-drive-no", "No", 1227, 252, "info")}

      ${edgeBadge("b-lago-yes", "Sí", 1315, 366, "yes")}
      ${edgeBadge("b-lago-no", "No", 1396, 252, "info")}

      ${edgeBadge("b-revision-yes", "Sí", 1746, 252, "yes")}
      ${edgeBadge("b-revision-no", "No", 1665, 173, "no")}
    </g>

    <g class="nodes">${nodes}</g>
  </svg>`;
}

function renderMinimapSvg(item) {
  const waiting = item.applies && item.health === "waiting" && item.progress <= 1;
  const dataBlocked = Boolean(item.incident) && item.progress <= 3;
  const boardBlocked = Boolean(item.incident) && item.progress >= 6;

  const colorOf = (state) => {
    if (state === "done") return "#10b981";
    if (state === "current") return "#2563eb";
    if (state === "blocked") return "#ef4444";
    if (state === "waiting") return "#f59e0b";
    return "#cbd5e1";
  };

  const nodeMap = [
    { x: 14, y: 232, w: 152, h: 76, state: item.applies ? "done" : "current" },
    { x: 202, y: 232, w: 126, h: 76, state: item.applies ? "done" : "current" },
    { x: 364, y: 232, w: 152, h: 76, state: graphState(item, 0) },
    { x: 552, y: 232, w: 126, h: 76, state: graphState(item, 1) },
    { x: 714, y: 232, w: 152, h: 76, state: graphState(item, 2) },
    { x: 902, y: 232, w: 126, h: 76, state: graphState(item, 3) },
    { x: 1077, y: 232, w: 126, h: 76, state: graphState(item, 4) },
    { x: 1252, y: 232, w: 126, h: 76, state: graphState(item, 5) },
    { x: 1414, y: 232, w: 152, h: 76, state: graphState(item, 6) },
    { x: 1602, y: 232, w: 126, h: 76, state: graphState(item, 7) },
    { x: 1764, y: 232, w: 152, h: 76, state: graphState(item, 8) },
    // Branches
    { x: 189, y: 424, w: 152, h: 76, state: item.applies ? "pending" : "current" },
    { x: 539, y: 40, w: 152, h: 76, state: waiting ? "waiting" : "pending" },
    { x: 274, y: 40, w: 152, h: 76, state: waiting ? "waiting" : "pending" },
    { x: 889, y: 424, w: 152, h: 76, state: dataBlocked ? "blocked" : "pending" },
    { x: 1064, y: 40, w: 152, h: 76, state: graphState(item, 4) },
    { x: 1239, y: 424, w: 152, h: 76, state: graphState(item, 5) },
    { x: 1589, y: 40, w: 152, h: 76, state: boardBlocked ? "blocked" : "pending" }
  ];

  return `<line x1="90" y1="270" x2="1840" y2="270" stroke="#cbd5e1" stroke-width="10"/>
    ${nodeMap.map((n) => `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="14" fill="${colorOf(n.state)}" opacity=".85"/>`).join("")}`;
}

class FlowCanvas {
  constructor() {
    this.container = $("canvasContainer");
    this.viewport = $("canvasViewport");
    this.stage = $("canvasStage");
    this.gridBg = $("canvasGridBg");
    this.zoomPercent = $("zoomPercent");
    this.minimapBody = $("minimapBody");
    this.minimapSvg = $("minimapSvg");
    this.minimapWindow = $("minimapWindow");
    this.tooltip = $("nodeTooltip");
    this.actionBar = $("nodeActionBar");
    this.inspector = $("nodeInspector");

    this.toolMode = "select"; // "select" | "hand"
    this.gridModes = ["grid-dots", "grid-lines", "grid-clean"];
    this.gridIndex = 0;

    this.scale = 0.85;
    this.translateX = 40;
    this.translateY = 30;
    this.minScale = 0.32;
    this.maxScale = 2.4;

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.startTranslateX = 0;
    this.startTranslateY = 0;

    this.isMinimapDragging = false;
    this.miniStartX = 0;
    this.miniStartY = 0;

    this.selectedNodeId = null;
    this.isMinimapCollapsed = false;
    this.diagramWidth = 1960;
    this.diagramHeight = 590;

    if (this.inspector) { this.inspector.hidden = true; this.inspector.style.display = "none"; }
    if (this.actionBar) { this.actionBar.hidden = true; this.actionBar.style.display = "none"; }
    if (this.tooltip) { this.tooltip.hidden = true; this.tooltip.style.display = "none"; }

    this.initEvents();
  }

  initEvents() {
    // Tool Mode Toggles
    $("btnToolSelect")?.addEventListener("click", () => this.setToolMode("select"));
    $("btnToolHand")?.addEventListener("click", () => this.setToolMode("hand"));

    // Viewport pointer events
    this.viewport.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".tool-btn") || e.target.closest(".node-action-bar") || e.target.closest(".node-inspector")) return;

      const node = e.target.closest(".graph-node");
      if (this.toolMode === "select" && node) {
        // Handled by node click
        return;
      }

      // Deselect if clicking on empty canvas
      if (!node) {
        this.deselectNode();
      }

      this.isDragging = true;
      this.viewport.classList.add("is-dragging");
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.startTranslateX = this.translateX;
      this.startTranslateY = this.translateY;
      this.viewport.setPointerCapture(e.pointerId);
    });

    this.viewport.addEventListener("pointermove", (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      this.translateX = this.startTranslateX + dx;
      this.translateY = this.startTranslateY + dy;
      this.applyTransform(false);
      this.updateActionBarPosition();
    });

    const stopDrag = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.viewport.classList.remove("is-dragging");
      try { this.viewport.releasePointerCapture(e.pointerId); } catch {}
    };
    this.viewport.addEventListener("pointerup", stopDrag);
    this.viewport.addEventListener("pointercancel", stopDrag);

    // Mouse wheel zoom
    this.viewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = this.viewport.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      const targetScale = Math.min(this.maxScale, Math.max(this.minScale, this.scale * factor));
      if (targetScale === this.scale) return;

      this.translateX = cursorX - (cursorX - this.translateX) * (targetScale / this.scale);
      this.translateY = cursorY - (cursorY - this.translateY) * (targetScale / this.scale);
      this.scale = targetScale;
      this.applyTransform(false);
      this.updateActionBarPosition();
    }, { passive: false });

    // Buttons
    $("btnZoomIn")?.addEventListener("click", () => this.zoomStep(1.2));
    $("btnZoomOut")?.addEventListener("click", () => this.zoomStep(0.8));
    $("btnZoomReset")?.addEventListener("click", () => this.resetZoom());
    $("btnFitView")?.addEventListener("click", () => this.fitView(true));
    $("btnFocusCurrent")?.addEventListener("click", () => this.focusCurrent(true));
    $("btnZenMode")?.addEventListener("click", () => toggleZenMode());
    $("btnGridCycle")?.addEventListener("click", () => this.cycleGrid());
    $("btnFullscreen")?.addEventListener("click", () => this.toggleFullscreen());
    $("btnExportSvg")?.addEventListener("click", () => this.exportSvg());
    $("btnExportPng")?.addEventListener("click", () => this.exportPng());

    // Minimap interaction
    $("btnToggleMinimap")?.addEventListener("click", () => {
      this.isMinimapCollapsed = !this.isMinimapCollapsed;
      $("canvasMinimap")?.classList.toggle("collapsed", this.isMinimapCollapsed);
      $("btnToggleMinimap").textContent = this.isMinimapCollapsed ? "▴" : "▾";
    });

    this.minimapBody?.addEventListener("click", (e) => {
      if (e.target === this.minimapWindow) return;
      const rect = this.minimapBody.getBoundingClientRect();
      const ratioX = (e.clientX - rect.left) / rect.width;
      const ratioY = (e.clientY - rect.top) / rect.height;
      this.centerOn(ratioX * this.diagramWidth, ratioY * this.diagramHeight, true);
    });

    // Draggable minimap window
    this.minimapWindow?.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      this.isMinimapDragging = true;
      this.miniStartX = e.clientX;
      this.miniStartY = e.clientY;
      this.minimapWindow.setPointerCapture(e.pointerId);
    });

    this.minimapWindow?.addEventListener("pointermove", (e) => {
      if (!this.isMinimapDragging) return;
      const dx = e.clientX - this.miniStartX;
      const dy = e.clientY - this.miniStartY;
      this.miniStartX = e.clientX;
      this.miniStartY = e.clientY;

      const bodyW = this.minimapBody.clientWidth || 230;
      const bodyH = this.minimapBody.clientHeight || 82;
      const mapScaleX = bodyW / this.diagramWidth;
      const mapScaleY = bodyH / this.diagramHeight;

      this.translateX -= (dx / mapScaleX) * this.scale;
      this.translateY -= (dy / mapScaleY) * this.scale;
      this.applyTransform(false);
      this.updateActionBarPosition();
    });

    const stopMiniDrag = (e) => {
      if (!this.isMinimapDragging) return;
      this.isMinimapDragging = false;
      try { this.minimapWindow.releasePointerCapture(e.pointerId); } catch {}
    };
    this.minimapWindow?.addEventListener("pointerup", stopMiniDrag);
    this.minimapWindow?.addEventListener("pointercancel", stopMiniDrag);

    // Action Bar Actions
    $("actCloseBar")?.addEventListener("click", () => this.deselectNode());
    $("actSetCurrent")?.addEventListener("click", () => {
      if (!this.selectedNodeId) return;
      const meta = nodeMeta[this.selectedNodeId];
      if (meta && meta.stepIndex >= 0) {
        const item = selectedBase();
        item.progress = meta.stepIndex;
        item.health = item.progress >= steps.length ? "done" : "active";
        item.incident = null;
        saveData();
        render();
        this.selectNode(this.selectedNodeId);
      }
    });
    $("actReportBlock")?.addEventListener("click", () => {
      if (!this.selectedNodeId) return;
      const meta = nodeMeta[this.selectedNodeId];
      $("blockReason").value = `Bloqueo en etapa: ${meta ? meta.title : this.selectedNodeId}`;
      $("blockDialog").showModal();
    });
    $("actOpenInspector")?.addEventListener("click", () => {
      if (this.selectedNodeId) this.openInspector(this.selectedNodeId);
    });

    // Inspector Drawer Events
    $("inspClose")?.addEventListener("click", () => this.closeInspector());
    $("inspAdvanceBtn")?.addEventListener("click", () => {
      $("advanceButton").click();
      if (this.selectedNodeId) this.openInspector(this.selectedNodeId);
    });
    $("inspBlockBtn")?.addEventListener("click", () => {
      if (this.selectedNodeId) {
        const meta = nodeMeta[this.selectedNodeId];
        $("blockReason").value = `Bloqueo en etapa: ${meta ? meta.title : this.selectedNodeId}`;
      }
      $("blockDialog").showModal();
    });

    // Global Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        this.setToolMode("hand");
      } else if (e.key === "v" || e.key === "V") {
        this.setToolMode("select");
      } else if (e.key === "h" || e.key === "H") {
        this.setToolMode("hand");
      } else if (e.key === "f" || e.key === "F") {
        this.fitView(true);
      } else if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        toggleZenMode();
      } else if (e.key === "1" || e.key === "0") {
        this.resetZoom();
      } else if (e.key === "+" || e.key === "=") {
        this.zoomStep(1.2);
      } else if (e.key === "-" || e.key === "_") {
        this.zoomStep(0.8);
      } else if (e.key === "Escape") {
        if (isZenMode && !this.selectedNodeId && !$("blockDialog").open) {
          toggleZenMode(false);
          return;
        }
        this.deselectNode();
        this.closeInspector();
        this.hideTooltip();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") {
        this.setToolMode("select");
      }
    });

    const ro = new ResizeObserver(() => {
      this.applyTransform(false);
      this.updateActionBarPosition();
    });
    ro.observe(this.viewport);
  }

  setToolMode(mode) {
    this.toolMode = mode;
    $("btnToolSelect")?.classList.toggle("active", mode === "select");
    $("btnToolHand")?.classList.toggle("active", mode === "hand");
    this.viewport.classList.toggle("is-select-mode", mode === "select");
    this.viewport.classList.toggle("is-hand-mode", mode === "hand");
  }

  cycleGrid() {
    this.gridBg.classList.remove(this.gridModes[this.gridIndex]);
    this.gridIndex = (this.gridIndex + 1) % this.gridModes.length;
    this.gridBg.classList.add(this.gridModes[this.gridIndex]);
    const names = ["Puntos", "Cuadrícula", "Limpio"];
    $("btnGridCycle").title = `Trama actual: ${names[this.gridIndex]} (clic para cambiar)`;
  }

  applyTransform(smooth = false) {
    if (smooth) {
      this.stage.style.transition = "transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)";
      setTimeout(() => { this.stage.style.transition = ""; }, 320);
    } else {
      this.stage.style.transition = "";
    }

    this.stage.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    if (this.zoomPercent) {
      this.zoomPercent.textContent = `${Math.round(this.scale * 100)}%`;
    }

    if (this.gridBg) {
      this.gridBg.style.backgroundPosition = `${this.translateX}px ${this.translateY}px`;
      this.gridBg.style.backgroundSize = `${24 * this.scale}px ${24 * this.scale}px`;
    }

    this.updateMinimap();
  }

  zoomStep(factor) {
    const targetScale = Math.min(this.maxScale, Math.max(this.minScale, this.scale * factor));
    const cx = this.viewport.clientWidth / 2;
    const cy = this.viewport.clientHeight / 2;
    this.translateX = cx - (cx - this.translateX) * (targetScale / this.scale);
    this.translateY = cy - (cy - this.translateY) * (targetScale / this.scale);
    this.scale = targetScale;
    this.applyTransform(true);
    this.updateActionBarPosition();
  }

  resetZoom() {
    const cx = this.viewport.clientWidth / 2;
    const cy = this.viewport.clientHeight / 2;
    const targetScale = 1;
    this.translateX = cx - (cx - this.translateX) * (targetScale / this.scale);
    this.translateY = cy - (cy - this.translateY) * (targetScale / this.scale);
    this.scale = targetScale;
    this.applyTransform(true);
    this.updateActionBarPosition();
  }

  fitView(smooth = true) {
    const vw = this.viewport.clientWidth || 1000;
    const vh = this.viewport.clientHeight || 550;
    const padding = 32;
    const scaleX = (vw - padding * 2) / this.diagramWidth;
    const scaleY = (vh - padding * 2) / this.diagramHeight;
    this.scale = Math.min(1.05, Math.min(scaleX, scaleY));
    this.translateX = (vw - this.diagramWidth * this.scale) / 2;
    this.translateY = (vh - this.diagramHeight * this.scale) / 2;
    this.applyTransform(smooth);
    this.updateActionBarPosition();
  }

  centerOn(x, y, smooth = true) {
    const vw = this.viewport.clientWidth || 1000;
    const vh = this.viewport.clientHeight || 550;
    this.translateX = vw / 2 - x * this.scale;
    this.translateY = vh / 2 - y * this.scale;
    this.applyTransform(smooth);
    this.updateActionBarPosition();
  }

  focusCurrent(smooth = true) {
    const activeNode = document.querySelector(".graph-node.current") ||
                       document.querySelector(".graph-node.blocked") ||
                       document.querySelector(".graph-node.waiting");
    if (activeNode && typeof activeNode.getBBox === "function") {
      const bbox = activeNode.getBBox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      if (this.scale < 0.85) this.scale = 0.9;
      this.centerOn(cx, cy, smooth);
    } else {
      this.fitView(smooth);
    }
  }

  toggleFullscreen() {
    const isFull = this.container.classList.contains("is-fullscreen") || document.fullscreenElement === this.container;
    if (isFull) {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      this.container.classList.remove("is-fullscreen");
      $("btnFullscreen")?.classList.remove("active");
    } else {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen().catch(() => {
          this.container.classList.add("is-fullscreen");
        });
      } else {
        this.container.classList.add("is-fullscreen");
      }
      $("btnFullscreen")?.classList.add("active");
    }
    setTimeout(() => {
      this.fitView(true);
      this.updateActionBarPosition();
    }, 180);
  }

  updateMinimap() {
    if (!this.minimapBody || !this.minimapWindow) return;
    const bodyW = this.minimapBody.clientWidth || 230;
    const bodyH = this.minimapBody.clientHeight || 82;
    const vw = this.viewport.clientWidth;
    const vh = this.viewport.clientHeight;

    const mapScaleX = bodyW / this.diagramWidth;
    const mapScaleY = bodyH / this.diagramHeight;

    const visibleLeft = -this.translateX / this.scale;
    const visibleTop = -this.translateY / this.scale;
    const visibleWidth = vw / this.scale;
    const visibleHeight = vh / this.scale;

    const winLeft = Math.max(0, Math.min(bodyW, visibleLeft * mapScaleX));
    const winTop = Math.max(0, Math.min(bodyH, visibleTop * mapScaleY));
    const winWidth = Math.min(bodyW - winLeft, Math.max(16, visibleWidth * mapScaleX));
    const winHeight = Math.min(bodyH - winTop, Math.max(12, visibleHeight * mapScaleY));

    this.minimapWindow.style.left = `${winLeft}px`;
    this.minimapWindow.style.top = `${winTop}px`;
    this.minimapWindow.style.width = `${winWidth}px`;
    this.minimapWindow.style.height = `${winHeight}px`;
  }

  // Node Selection & Quick Actions
  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    const item = selectedBase();
    $("flowDiagram").innerHTML = renderGraph(item, this.selectedNodeId);
    this.bindNodeEvents();

    const nodeEl = document.querySelector(`.graph-node[data-node="${nodeId}"]`);
    if (!nodeEl || !this.actionBar) return;

    const meta = nodeMeta[nodeId] || { title: nodeId };
    $("actNodeTitle").textContent = meta.title;
    $("actNodeBadge").textContent = meta.step || (meta.stepIndex === -1 ? "CONDICIÓN" : "ETAPA");

    $("actSetCurrent").disabled = meta.stepIndex < 0 || !item.applies;
    $("actReportBlock").disabled = !item.applies;

    this.actionBar.hidden = false;
    this.actionBar.style.display = "flex";
    this.updateActionBarPosition();
  }

  deselectNode() {
    if (!this.selectedNodeId) return;
    this.selectedNodeId = null;
    if (this.actionBar) {
      this.actionBar.hidden = true;
      this.actionBar.style.display = "none";
    }
    const item = selectedBase();
    $("flowDiagram").innerHTML = renderGraph(item, null);
    this.bindNodeEvents();
  }

  updateActionBarPosition() {
    if (!this.selectedNodeId || !this.actionBar || this.actionBar.hidden) return;
    const nodeEl = document.querySelector(`.graph-node[data-node="${this.selectedNodeId}"]`);
    if (!nodeEl) return;

    const bbox = nodeEl.getBoundingClientRect();
    const cRect = this.container.getBoundingClientRect();
    let x = bbox.left - cRect.left + bbox.width / 2;
    const y = bbox.top - cRect.top;

    const halfW = this.actionBar.offsetWidth ? this.actionBar.offsetWidth / 2 : 140;
    if (x - halfW < 12) x = halfW + 12;
    if (x + halfW > cRect.width - 12) x = cRect.width - halfW - 12;

    const isNearTop = y < 70;
    if (isNearTop) {
      this.actionBar.classList.add("is-below");
      this.actionBar.style.top = `${bbox.bottom - cRect.top}px`;
    } else {
      this.actionBar.classList.remove("is-below");
      this.actionBar.style.top = `${y}px`;
    }
    this.actionBar.style.left = `${x}px`;
  }

  openInspector(nodeId) {
    const meta = nodeMeta[nodeId];
    if (!meta || !this.inspector) return;
    const item = selectedBase();

    $("inspBadge").textContent = meta.step ? `ETAPA ${meta.step}` : "CONDICIÓN DE FLUJO";
    $("inspTitle").textContent = meta.title;
    $("inspDesc").textContent = meta.desc || meta.subtitle;

    const owner = typeof meta.owner === "function" ? meta.owner(item) : meta.owner;
    $("inspOwner").textContent = owner || "Por definir";

    const state = graphState(item, meta.stepIndex);
    const stateLabel = { done: "Completado", current: "Etapa actual", waiting: "En espera", blocked: "Bloqueado", branch: "Ruta opcional", pending: "Pendiente" }[state] || state;
    $("inspStatusPill").textContent = stateLabel.toUpperCase();
    $("inspStatusPill").className = `status-pill ${state}`;

    const inputsList = $("inspInputs");
    inputsList.innerHTML = (meta.inputs || ["Parámetros operativos de la base"]).map((t) => `<li>${t}</li>`).join("");

    const outputsList = $("inspOutputs");
    outputsList.innerHTML = (meta.outputs || ["Avance hacia la siguiente fase"]).map((t) => `<li>${t}</li>`).join("");

    $("inspAdvanceBtn").disabled = !item.applies || item.progress >= steps.length || Boolean(item.incident);
    $("inspBlockBtn").disabled = !item.applies || item.progress >= steps.length || Boolean(item.incident);

    this.inspector.hidden = false;
    this.inspector.style.display = "flex";
  }

  closeInspector() {
    if (this.inspector) {
      this.inspector.hidden = true;
      this.inspector.style.display = "none";
    }
  }

  // Hover Tooltip & Path Tracing
  showTooltip(node) {
    if (!this.tooltip) return;
    const title = node.dataset.title;
    const desc = node.dataset.desc;
    const owner = node.dataset.owner;
    const status = node.dataset.status;

    $("ttTitle").textContent = title;
    $("ttDesc").textContent = desc;
    $("ttOwner").textContent = owner || "Por definir";
    const statusLabel = { done: "Completado", current: "Etapa actual", waiting: "En espera", blocked: "Bloqueado", branch: "Ruta opcional", pending: "Pendiente" }[status] || status;
    $("ttStatus").textContent = statusLabel;

    const badge = $("ttBadge");
    badge.textContent = statusLabel.toUpperCase();
    badge.className = `tooltip-badge ${status}`;

    const bbox = node.getBoundingClientRect();
    const cRect = this.container.getBoundingClientRect();
    let left = bbox.left - cRect.left + bbox.width / 2 - 135;
    let top = bbox.bottom - cRect.top + 10;

    if (left < 14) left = 14;
    if (left + 280 > cRect.width - 14) left = cRect.width - 290;
    if (top + 170 > cRect.height - 14) top = bbox.top - cRect.top - 175;

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
    this.tooltip.hidden = false;
    this.tooltip.style.display = "block";
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.hidden = true;
      this.tooltip.style.display = "none";
    }
  }

  highlightPaths(nodeId) {
    this.viewport.classList.add("has-hover-focus");
    const edgeIds = nodeEdgeMap[nodeId] || [];
    edgeIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add("highlighted");
    });
  }

  clearPathHighlights() {
    this.viewport.classList.remove("has-hover-focus");
    document.querySelectorAll(".highlighted").forEach((el) => el.classList.remove("highlighted"));
  }

  bindNodeEvents() {
    document.querySelectorAll(".graph-node").forEach((node) => {
      const id = node.dataset.node;
      node.addEventListener("mouseenter", () => {
        this.showTooltip(node);
        this.highlightPaths(id);
      });
      node.addEventListener("mouseleave", () => {
        this.hideTooltip();
        this.clearPathHighlights();
      });
      node.addEventListener("click", (e) => {
        e.stopPropagation();
        this.hideTooltip();
        this.selectNode(id);
      });
    });
  }

  exportSvg() {
    const svg = document.getElementById("mainGraphSvg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `edudata-flujo-${selectedName.toLowerCase().replace(/\s+/g, "-")}-${selectedPeriod}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportPng() {
    const svg = document.getElementById("mainGraphSvg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = this.diagramWidth * 2;
      canvas.height = this.diagramHeight * 2;
      const ctx = canvas.getContext("2d");
      ctx.scale(2, 2);
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, this.diagramWidth, this.diagramHeight);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob((pngBlob) => {
        const pngUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `edudata-flujo-${selectedName.toLowerCase().replace(/\s+/g, "-")}-${selectedPeriod}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  }
}

let flowCanvas = null;

let filterMode = "all"; // "all" | "active" | "attention" | "done"

function renderSummary() {
  const applicable = currentRows().filter((item) => item.applies);
  const totalProgress = applicable.length ? Math.round(applicable.reduce((sum, item) => sum + percent(item), 0) / applicable.length) : 0;
  const healths = applicable.map(deriveHealth);
  $("overallProgress").textContent = `${totalProgress}%`;
  $("overallBar").style.width = `${totalProgress}%`;
  $("doneCount").textContent = healths.filter((value) => value === "done").length;
  $("activeCount").textContent = healths.filter((value) => value === "active").length;
  $("attentionCount").textContent = healths.filter((value) => value === "waiting" || value === "blocked").length;
}

let switchTimeout = null;
let fadeTimeout = null;
let isZenMode = false;

function toggleZenMode(forceState) {
  isZenMode = typeof forceState === "boolean" ? forceState : !isZenMode;
  
  const workspace = $("workspace") || document.querySelector(".workspace");
  const btnZen = $("btnZenMode");
  const btnRestore = $("btnRestoreSidebar");
  
  if (workspace) {
    workspace.classList.toggle("is-zen-mode", isZenMode);
  }
  
  if (btnZen) {
    btnZen.classList.toggle("active", isZenMode);
    btnZen.setAttribute("aria-pressed", isZenMode ? "true" : "false");
    const label = btnZen.querySelector(".btn-label");
    if (label) label.textContent = isZenMode ? "Salir concentración" : "Concentración";
    btnZen.title = isZenMode 
      ? "Salir del Modo Concentración (Z)" 
      : "Modo Concentración (Z) - Ocultar panel lateral";
  }

  if (btnRestore) {
    btnRestore.hidden = !isZenMode;
    btnRestore.style.display = isZenMode ? "inline-flex" : "none";
  }

  // Smoothly refit canvas to fill the full widescreen once layout transition completes
  setTimeout(() => {
    if (flowCanvas) {
      flowCanvas.fitView(true);
    }
  }, 240);
}

function selectBaseWithTransition(baseName) {
  if (baseName === selectedName) {
    if (flowCanvas) flowCanvas.focusCurrent(true);
    return;
  }

  // Cancel any pending switch from rapid clicks - NEVER block or drop clicks!
  if (switchTimeout) {
    clearTimeout(switchTimeout);
    switchTimeout = null;
  }
  if (fadeTimeout) {
    clearTimeout(fadeTimeout);
    fadeTimeout = null;
  }

  const skeletonEl = $("canvasSkeleton");
  const skeletonName = $("skeletonBaseName");
  const heading = document.querySelector(".flow-heading");
  const detailGrid = document.querySelector(".detail-grid");
  const diagram = $("flowDiagram");

  // Immediate visual feedback on the clicked list item
  document.querySelectorAll(".base-item").forEach((b) => {
    const isTarget = b.dataset.name === baseName;
    b.classList.toggle("is-loading", isTarget);
    b.classList.toggle("active", isTarget);
  });

  if (skeletonName) skeletonName.textContent = baseName;
  if (skeletonEl) {
    skeletonEl.classList.remove("fade-out");
    skeletonEl.hidden = false;
    skeletonEl.style.display = "flex";
  }
  if (heading) heading.classList.add("is-switching");
  if (detailGrid) detailGrid.classList.add("is-switching");

  // Snappy switch: 85ms flash gives clear visual transition without perceptible waiting
  switchTimeout = setTimeout(() => {
    selectedName = baseName;
    render();
    if (flowCanvas) {
      flowCanvas.deselectNode();
      flowCanvas.focusCurrent(true);
    }

    if (diagram) {
      diagram.classList.remove("is-entering");
      void diagram.offsetWidth;
      diagram.classList.add("is-entering");
    }

    if (heading) heading.classList.remove("is-switching");
    if (detailGrid) detailGrid.classList.remove("is-switching");

    if (skeletonEl) {
      skeletonEl.classList.add("fade-out");
      fadeTimeout = setTimeout(() => {
        skeletonEl.hidden = true;
        skeletonEl.style.display = "none";
        skeletonEl.classList.remove("fade-out");
        document.querySelectorAll(".base-item").forEach((b) => b.classList.remove("is-loading"));
        fadeTimeout = null;
      }, 70);
    } else {
      document.querySelectorAll(".base-item").forEach((b) => b.classList.remove("is-loading"));
    }
    switchTimeout = null;
  }, 85);
}

const BASE_PERIODICITIES = {
  "SIMAT": { type: "mensual", label: "Mensual", emoji: "🟣", fullLabel: "Mensual (12/año)" },
  "HUMANO": { type: "mensual", label: "Mensual", emoji: "🟣", fullLabel: "Mensual (12/año)" },
  "PAE": { type: "lectivo", label: "Lectivo", emoji: "🔵", fullLabel: "Mensual Lectivo" },
  "EJECUCIONES PRESUPUESTALES": { type: "mensual", label: "Mensual", emoji: "🟣", fullLabel: "Mensual (12/año)" },
  "SIMPADE": { type: "lectivo", label: "Lectivo", emoji: "🔵", fullLabel: "Mensual Lectivo" },
  "ICFES Clasificación": { type: "anual", label: "Anual", emoji: "🟢", fullLabel: "Anual" },
  "ICFES Territorial": { type: "anual", label: "Anual", emoji: "🟢", fullLabel: "Anual" },
  "IDESC": { type: "anual", label: "Anual", emoji: "🟢", fullLabel: "Anual" },
  "DUE SEDES": { type: "trimestral", label: "Trimestral", emoji: "🟠", fullLabel: "Trimestral (4/año)" },
  "DUE ESTABLECIMIENTOS": { type: "trimestral", label: "Trimestral", emoji: "🟠", fullLabel: "Trimestral (4/año)" },
  "Cobertura en cifras": { type: "trimestral", label: "Trimestral", emoji: "🟠", fullLabel: "Trimestral" },
  "Notas": { type: "mensual", label: "Mensual", emoji: "🟣", fullLabel: "Mensual (12/año)" },
  "1S": { type: "trimestral", label: "Trimestral", emoji: "🟠", fullLabel: "Trimestral (4/año)" },
  "3S": { type: "trimestral", label: "Trimestral", emoji: "🟠", fullLabel: "Trimestral (4/año)" },
  "4S": { type: "trimestral", label: "Trimestral", emoji: "🟠", fullLabel: "Trimestral (4/año)" },
  "Infraestructura": { type: "mensual", label: "Por definir", emoji: "⚪", fullLabel: "Por definir" },
  "ZPSPOAI": { type: "anual", label: "Anual", emoji: "🟢", fullLabel: "Anual" }
};

function renderList() {
  const term = $("baseSearch").value.trim().toLowerCase();
  let rows = currentRows().filter((item) => `${item.name} ${item.dashboard} ${item.organism}`.toLowerCase().includes(term));
  
  if (filterMode === "active") {
    rows = rows.filter((item) => item.applies && deriveHealth(item) === "active");
  } else if (filterMode === "attention") {
    rows = rows.filter((item) => item.applies && (deriveHealth(item) === "waiting" || deriveHealth(item) === "blocked"));
  } else if (filterMode === "done") {
    rows = rows.filter((item) => item.applies && deriveHealth(item) === "done");
  } else if (filterMode === "pending") {
    rows = rows.filter((item) => Boolean(getUnresolvedPendingCut(item)));
  }

  const pendingCount = currentRows().filter((item) => Boolean(getUnresolvedPendingCut(item))).length;
  const badgeEl = $("badgePendingCount");
  if (badgeEl) {
    badgeEl.textContent = pendingCount;
    const tabPending = document.querySelector(".filter-tab-pending");
    if (tabPending) tabPending.classList.toggle("has-pending", pendingCount > 0);
  }

  $("baseCount").textContent = `${rows.length} de ${currentRows().length}`;

  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.filter === filterMode);
  });

  $("baseList").innerHTML = rows.map((item) => {
    const health = deriveHealth(item);
    const orgClass = (item.organism || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const per = BASE_PERIODICITIES[item.name] || { type: "mensual", label: "Mensual", emoji: "🟣", fullLabel: "Mensual" };
    const pendingDebt = getUnresolvedPendingCut(item);
    return `<button class="base-item ${item.name === selectedName ? "active" : ""}" data-name="${item.name}">
      <div class="base-item-main">
        <span class="dot ${health}"></span>
        <div class="base-item-content">
          <div class="base-item-title-row">
            <strong>${item.name}</strong>
            <span class="periodicity-badge-sm ${per.type}" title="Periodicidad: ${per.fullLabel}">${per.label}</span>
            <span class="org-tag ${orgClass}">${item.organism}</span>
            ${pendingDebt ? `<span class="pending-cut-tag" title="Corte pendiente de ${escapeHtml(pendingDebt.periodLabel)}">⚠️ Corte pendiente</span>` : ""}
          </div>
          <small>${item.dashboard}</small>
        </div>
      </div>
      <span class="mini-progress ${health}">${item.applies ? `${percent(item)}%` : "N/A"}</span>
    </button>`;
  }).join("");

  document.querySelectorAll(".base-item").forEach((button) => button.addEventListener("click", () => {
    selectBaseWithTransition(button.dataset.name);
  }));
}

function renderFlow() {
  const item = selectedBase();
  selectedName = item.name;
  const health = deriveHealth(item);
  const per = BASE_PERIODICITIES[item.name] || { type: "mensual", label: "Mensual", emoji: "🟣", fullLabel: "Mensual" };
  $("baseOrganism").textContent = item.organism;
  $("baseTitle").textContent = item.name;
  $("baseMeta").innerHTML = `${escapeHtml(item.dashboard)} · <span class="periodicity-badge ${per.type}" style="padding:2px 7px; font-size:0.7rem;" title="Periodicidad de corte">${per.emoji} ${escapeHtml(per.fullLabel)}</span> · Responsable: ${escapeHtml(item.owner)}`;
  $("healthBadge").textContent = healthLabel(health);
  $("healthBadge").className = `health-badge ${health}`;
  $("notApplicable").hidden = true;
  $("flowContent").hidden = false;

  const pendingDebt = getUnresolvedPendingCut(item);
  const banner = $("pendingCutBanner");
  if (banner) {
    if (pendingDebt) {
      banner.hidden = false;
      banner.style.display = "flex";
      $("pendingCutTitle").textContent = `⚠️ Corte pendiente: ${pendingDebt.periodLabel}`;
      $("pendingCutDesc").textContent = `Esta base no completó el ciclo del mes anterior (quedó en Etapa: ${pendingDebt.stageLabel}). Requiere gestión de cobro y entrega con ${escapeHtml(item.sourceOwner || item.owner)}.`;
      const btnJump = $("btnViewPendingCut");
      if (btnJump) {
        btnJump.onclick = () => {
          selectedPeriod = pendingDebt.period;
          updatePeriodSelectOptions();
          $("periodSelect").value = pendingDebt.period;
          selectBaseWithTransition(item.name);
        };
      }
    } else {
      banner.hidden = true;
      banner.style.display = "none";
    }
  }

  $("flowDiagram").innerHTML = renderGraph(item, flowCanvas?.selectedNodeId);
  $("minimapSvg").innerHTML = renderMinimapSvg(item);

  if (flowCanvas) {
    flowCanvas.bindNodeEvents();
    flowCanvas.updateMinimap();
    flowCanvas.updateActionBarPosition();
  }

  const current = steps[Math.min(item.progress, steps.length - 1)];
  let stageOwner = item.owner;
  if (item.applies) {
    if (item.progress === 0) {
      stageOwner = (typeof nodeMeta["solicitud"]?.owner === "function" ? nodeMeta["solicitud"].owner(item) : nodeMeta["solicitud"]?.owner) || item.owner;
    } else if (item.progress === 3) {
      stageOwner = (typeof nodeMeta["validacion"]?.owner === "function" ? nodeMeta["validacion"].owner(item) : nodeMeta["validacion"]?.owner) || item.owner;
    }
  }
  $("currentStage").textContent = !item.applies ? "No aplica en este periodo" : item.progress >= steps.length ? "Actualización cerrada" : current.label;
  $("currentOwner").textContent = item.applies ? stageOwner : "Sin asignación";
  $("nextAction").textContent = !item.applies ? "Revisar nuevamente el próximo mes" : item.progress >= steps.length ? "No hay acciones pendientes" : current.action;
  $("advanceButton").disabled = !item.applies || item.progress >= steps.length || Boolean(item.incident);
  $("blockButton").disabled = !item.applies || item.progress >= steps.length || Boolean(item.incident);

  $("incidentCard").className = `incident-card ${item.incident ? "blocked" : ""}`;
  $("incidentTitle").textContent = item.incident ? item.incident.reason : "Sin bloqueos reportados";
  $("incidentText").textContent = item.incident ? `Debe resolver: ${item.incident.owner}` : "La actualización puede continuar según el flujo previsto.";
  $("clearBlockButton").hidden = !item.incident;
}

function render() {
  renderSummary();
  renderList();
  renderFlow();
  if (window.annualMatrixManager) {
    window.annualMatrixManager.syncWithFlowData();
    window.annualMatrixManager.render();
  }
}

function updatePeriodSelectOptions() {
  const sel = $("periodSelect");
  if (!sel) return;
  sel.innerHTML = "";
  Object.entries(periodLabels)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .forEach(([value, label]) => {
      sel.insertAdjacentHTML("beforeend", `<option value="${value}">${label}</option>`);
    });
  sel.value = selectedPeriod;
}

updatePeriodSelectOptions();
$("periodSelect").addEventListener("change", (event) => {
  selectedPeriod = event.target.value;
  selectedName = currentRows()[0]?.name || "SIMAT";
  render();
  if (flowCanvas) flowCanvas.fitView(true);
});
$("baseSearch").addEventListener("input", renderList);

document.querySelectorAll(".filter-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    filterMode = tab.dataset.filter;
    renderList();
  });
});

window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    $("baseSearch")?.focus();
    $("baseSearch")?.select();
  }
});

function showToast(message, duration = 4200) {
  let toast = document.querySelector(".toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="font-size: 1.15rem;">🗓️</span> <span>${escapeHtml(message)}</span>`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function getNextPeriod(periodKey) {
  const parts = periodKey.split("-");
  let year = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10);
  month += 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  const nextKey = `${year}-${String(month).padStart(2, "0")}`;
  const MONTH_NAMES = {
    1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
    5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
    9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
  };
  return {
    key: nextKey,
    label: `${MONTH_NAMES[month]} ${year}`,
    monthName: MONTH_NAMES[month].toLowerCase(),
    year
  };
}

$("btnOpenRolloverModal")?.addEventListener("click", () => {
  const sortedPeriods = Object.keys(periodLabels).sort((a, b) => b.localeCompare(a));
  const closingPeriod = selectedPeriod || sortedPeriods[0];
  let targetClosingPeriod = closingPeriod;
  let targetOpeningPeriod = getNextPeriod(closingPeriod);

  if (data[targetOpeningPeriod.key]) {
    targetClosingPeriod = targetOpeningPeriod.key;
    targetOpeningPeriod = getNextPeriod(targetOpeningPeriod.key);
  }

  const rows = data[targetClosingPeriod] || [];
  const doneItems = rows.filter((i) => i.applies && (i.health === "done" || i.progress >= steps.length));
  const pendingItems = rows.filter((i) => i.applies && !(i.health === "done" || i.progress >= steps.length));
  const naItems = rows.filter((i) => !i.applies);

  const modal = $("rolloverDialog");
  if (!modal) return;

  $("rolloverModalTitle").textContent = `Cerrar ${periodLabels[targetClosingPeriod] || targetClosingPeriod} y Abrir ${targetOpeningPeriod.label}`;
  $("rolloverClosingPeriodName").textContent = periodLabels[targetClosingPeriod] || targetClosingPeriod;
  $("rolloverOpeningPeriodName").textContent = targetOpeningPeriod.label;

  $("rbDoneCount").textContent = doneItems.length;
  $("rbPendingCount").textContent = pendingItems.length;
  $("rbNaCount").textContent = naItems.length;

  const pendingList = $("rolloverPendingList");
  if (pendingList) {
    if (pendingItems.length === 0) {
      pendingList.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--green); font-size: 0.8rem; font-weight: 750;">✓ ¡Excelente! Todas las bases aplicables están terminadas. Ninguna quedará con corte pendiente.</div>`;
    } else {
      pendingList.innerHTML = pendingItems.map((item) => {
        const stepLabel = steps[item.progress]?.label || "En curso";
        return `
          <div class="rollover-pending-item">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <div style="font-size: 0.68rem; color: var(--muted);">${escapeHtml(item.organism)}</div>
            </div>
            <div style="text-align: right;">
              <span style="display: block; font-weight: 750; color: #b91c1c;">Quedó en: ${escapeHtml(stepLabel)} (${percent(item)}%)</span>
              <span style="display: block; font-size: 0.68rem; color: var(--muted);">Resp: ${escapeHtml(item.owner)}</span>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  $("btnConfirmRolloverText").textContent = `Confirmar Cierre y Abrir ${targetOpeningPeriod.label}`;
  modal.dataset.closingPeriod = targetClosingPeriod;
  modal.dataset.openingKey = targetOpeningPeriod.key;
  modal.dataset.openingLabel = targetOpeningPeriod.label;
  modal.dataset.openingMonth = targetOpeningPeriod.monthName;

  modal.showModal();
});

$("btnConfirmRollover")?.addEventListener("click", () => {
  const modal = $("rolloverDialog");
  if (!modal) return;

  const closingPeriod = modal.dataset.closingPeriod;
  const openingKey = modal.dataset.openingKey;
  const openingLabel = modal.dataset.openingLabel;
  const openingMonth = modal.dataset.openingMonth;

  if (!closingPeriod || !openingKey) return;

  if (!closedPeriods.includes(closingPeriod)) {
    closedPeriods.push(closingPeriod);
    saveClosedPeriods();
  }

  const prevRows = data[closingPeriod] || [];
  const newRows = ANNUAL_BASES_DATA.map((matrixBase) => {
    const isScheduled = matrixBase.scheduledMonths.includes(openingMonth);
    const prevItem = prevRows.find((p) => p.name.trim().toLowerCase() === matrixBase.name.trim().toLowerCase());

    let pendingCut = null;
    if (prevItem && prevItem.applies && prevItem.health !== "done" && prevItem.progress < steps.length) {
      pendingCut = {
        period: closingPeriod,
        periodLabel: periodLabels[closingPeriod] || closingPeriod,
        progress: prevItem.progress,
        stageLabel: steps[prevItem.progress]?.label || "En curso"
      };
    }

    return {
      name: matrixBase.name,
      organism: matrixBase.organism,
      sourceOwner: matrixBase.sourceOwner,
      dashboard: prevItem ? prevItem.dashboard : "Tableros EduData",
      owner: prevItem ? prevItem.owner : "Eduardo",
      applies: isScheduled,
      progress: 0,
      health: isScheduled ? "waiting" : "na",
      incident: null,
      pendingCut: pendingCut
    };
  });

  data[openingKey] = newRows;
  periodLabels[openingKey] = openingLabel;

  selectedPeriod = openingKey;
  selectedName = newRows.find((r) => r.applies)?.name || newRows[0].name;

  saveData();
  savePeriodLabels();
  saveClosedPeriods();

  modal.close();
  updatePeriodSelectOptions();
  render();

  showToast(`¡Periodo ${openingLabel} abierto exitosamente! El flujo de bases ha vuelto al inicio.`);
});

$("btnCloseRolloverModal")?.addEventListener("click", () => $("rolloverDialog")?.close());
$("btnCancelRollover")?.addEventListener("click", () => $("rolloverDialog")?.close());

$("btnResetTop")?.addEventListener("click", () => $("resetButton").click());
$("btnCollapseSidebar")?.addEventListener("click", () => toggleZenMode(true));
$("btnRestoreSidebar")?.addEventListener("click", () => toggleZenMode(false));

$("advanceButton").addEventListener("click", () => {
  const item = selectedBase();
  item.progress = Math.min(steps.length, item.progress + 1);
  item.health = item.progress >= steps.length ? "done" : "active";
  saveData();
  render();
  if (flowCanvas) flowCanvas.focusCurrent(true);
});
$("blockButton").addEventListener("click", () => $("blockDialog").showModal());
$("saveBlockButton").addEventListener("click", (event) => {
  const reason = $("blockReason").value.trim();
  const owner = $("blockOwner").value.trim();
  if (!reason || !owner) { event.preventDefault(); return; }
  selectedBase().incident = { reason, owner };
  saveData();
  $("blockForm").reset();
  render();
  if (flowCanvas) flowCanvas.focusCurrent(true);
});
$("clearBlockButton").addEventListener("click", () => {
  selectedBase().incident = null;
  selectedBase().health = "active";
  saveData();
  render();
  if (flowCanvas) flowCanvas.focusCurrent(true);
});
$("resetButton").addEventListener("click", () => {
  data = seed();
  closedPeriods = [...defaultClosedPeriods];
  periodLabels = { ...defaultPeriodLabels };
  saveData();
  saveClosedPeriods();
  savePeriodLabels();
  selectedPeriod = "2026-09";
  selectedName = "SIMAT";
  filterMode = "all";
  if (isZenMode) toggleZenMode(false);
  updatePeriodSelectOptions();
  $("baseSearch").value = "";
  render();
  if (flowCanvas) {
    flowCanvas.deselectNode();
    flowCanvas.fitView(true);
  }
});

// Initialize canvas engine
flowCanvas = new FlowCanvas();
window.flowCanvas = flowCanvas;
window.FlowCanvas = FlowCanvas;

if ($("canvasSkeleton")) {
  $("canvasSkeleton").hidden = true;
  $("canvasSkeleton").style.display = "none";
}
if ($("btnRestoreSidebar")) {
  $("btnRestoreSidebar").hidden = true;
  $("btnRestoreSidebar").style.display = "none";
}

render();
setTimeout(() => flowCanvas.fitView(false), 50);


// =============================================================================
// SEGUIMIENTO DE ACTIVIDADES - GOOGLE SHEETS LIVE SYNC
// =============================================================================

const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTdwoOQjy8dccue3tQnaDbQv5os6SptjZJ1risMayUjT99z2JCr683c_V9MzGMM2qBEeR6ECVDD4TES/pub?gid=1312885523&single=true&output=csv";
const NGINX_PROXY_URL = "/api/sheets-sync";

// Bundled snapshot for zero-latency instant offline/initial rendering
const DEFAULT_ACTIVITIES_SNAPSHOT = [
  {
    "id": "1",
    "task": "Manuales tableros. Establecimientos educativos",
    "owner": "Eduardo",
    "start": "29/7/2026",
    "end": "28/08/2026",
    "status": "Sin iniciar",
    "comments": "Incluir todo el paso a paso con los flujos."
  },
  {
    "id": "2",
    "task": "Manuales tableros. Estudiantes",
    "owner": "Eduardo",
    "start": "",
    "end": "",
    "status": "Finalizada",
    "comments": "Entregado Jul 9 2026. Revisar. Incluir todo el paso a paso con los flujos."
  },
  {
    "id": "3",
    "task": "Correcciones Resumen CEPAL",
    "owner": "Eduardo",
    "start": "28/7/2026",
    "end": "29/7/2026",
    "status": "Finalizada",
    "comments": "Falta aprobación de Nini"
  },
  {
    "id": "4",
    "task": "Análisis base de Convivencia Escolar--SIUCE",
    "owner": "Eduardo",
    "start": "6/8/2026",
    "end": "",
    "status": "En progreso",
    "comments": ""
  },
  {
    "id": "5",
    "task": "Solicitud SIIED (DANE)",
    "owner": "Eduardo",
    "start": "10/6/2026",
    "end": "",
    "status": "Atrasada",
    "comments": ""
  },
  {
    "id": "6",
    "task": "Cálculo de indicadores para Planeación",
    "owner": "Eduardo + María Isabel",
    "start": "",
    "end": "09/09/2026",
    "status": "En progreso",
    "comments": ""
  },
  {
    "id": "1",
    "task": "Documento RFI (Alejandro Reyes)",
    "owner": "Manuel + Eduardo",
    "start": "28/7/2026",
    "end": "30/07/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "2",
    "task": "Elaboración Acuerdo de confidencialidad y transferencia de información bases Convivencia Escolar (Adriana Quiñonez)",
    "owner": "Manuel + María Isabel",
    "start": "29/7/2026",
    "end": "30/07/2026",
    "status": "Finalizada",
    "comments": "Seguimiento con Adriana Quiñonez."
  },
  {
    "id": "3",
    "task": "Matriz de seguimiento Agosto",
    "owner": "Manuel + María Isabel",
    "start": "24/8/2026",
    "end": "28/08/2026",
    "status": "Sin iniciar",
    "comments": ""
  },
  {
    "id": "4",
    "task": "Actualizar fuentes y custodios de información (\"araña\")",
    "owner": "Manuel",
    "start": "",
    "end": "",
    "status": "En progreso",
    "comments": ""
  },
  {
    "id": "5",
    "task": "Solicitud de bases de datos: SIMAT, DUE, HUMANO",
    "owner": "Manuel",
    "start": "",
    "end": "06/08/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "6",
    "task": "Exposición documentos enviados por Blend360",
    "owner": "Manuel",
    "start": "7/8/2026",
    "end": "28/08/2026",
    "status": "En progreso",
    "comments": ""
  },
  {
    "id": "7",
    "task": "Tablero organizaciones aliadas",
    "owner": "Manuel",
    "start": "",
    "end": "",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "8",
    "task": "Análisis bases de datos y retroalimentación custodios de la información.",
    "owner": "Manuel",
    "start": "25/8/2026",
    "end": "01/09/2026",
    "status": "En progreso",
    "comments": "Ya se identificaron las inconsistencias del HUMANO. Se proyetó el correo para Glasford Britton."
  },
  {
    "id": "9",
    "task": "Formato de seguimiento actualización bases de datos de EduData",
    "owner": "Manuel",
    "start": "6/8/2026",
    "end": "01/09/2026",
    "status": "En progreso",
    "comments": "Ya Manuel tiene una propuesta que pondrá a consideración del equipo. Falta aprobación de Nini."
  },
  {
    "id": "10",
    "task": "Flujo de procesos",
    "owner": "Manuel + Sebasián",
    "start": "",
    "end": "",
    "status": "En progreso",
    "comments": ""
  },
  {
    "id": "1",
    "task": "Revisión de reportes",
    "owner": "María Isabel",
    "start": "29/7/2026",
    "end": "",
    "status": "En progreso",
    "comments": "Se revisaron los reportes de los tableros de establecimientos, docentes y estudiantes. Sin embargo, dado que todavía presentaban múltiples discrepancias e inconsistencias en los datos (e.g., no se había incorporado la matrícula de la sede Marisol de la IE Gabriela Mistral; faltaba 1 docente en el reporte de Establecimientos y de Docentes; había una discrepancia de los datos en el número de instituciones en el tablero de Establecimientos vs. su reporte) se paró la revisión hasta que Sebastián termine de realizar los ajustes."
  },
  {
    "id": "2",
    "task": "Seguimiento a la recepción de las bases de indicadores (Caterine): 1S, 3S y 4S",
    "owner": "María Isabel",
    "start": "29/7/2026",
    "end": "04/08/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "3",
    "task": "Revisión documento RFI",
    "owner": "María Isabel",
    "start": "28/7/2026",
    "end": "28/07/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "4",
    "task": "Estudio técnico zonas de difícil acceso",
    "owner": "María Isabel",
    "start": "11/07/2026",
    "end": "30/7/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "5",
    "task": "Revisión guion y pauta metodológica invitado Foro Plan decenal de educación Cali 2027-2036",
    "owner": "María Isabel",
    "start": "28/7/2026",
    "end": "31/7/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "6",
    "task": "Revisión resumen CEPAL",
    "owner": "María Isabel",
    "start": "24/7/2026",
    "end": "28/7/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "7",
    "task": "Matriz seguimiento Julio",
    "owner": "María Isabel + Manuel",
    "start": "29/7/2026",
    "end": "31/7/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "8",
    "task": "Revisión ajustes EduData",
    "owner": "María Isabel",
    "start": "29/7/2026",
    "end": "29/7/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "9",
    "task": "Gestionar taller con el equipo del Plan Estadístico (Otálora + Torres)",
    "owner": "María Isabel",
    "start": "29/7/2029",
    "end": "3/8/2026",
    "status": "Finalizada",
    "comments": "El taller se realizará el 18 de agosto de 2026, de 8:00 a.m. a 12 m.\nLugar: Secretaría de Educación Distrital de Cali, salón X, piso Y."
  },
  {
    "id": "10",
    "task": "Reunión con Abogado Yarce + Despacho SED + Nini. Asunto: Institucionalización EduData Cali",
    "owner": "María Isabel",
    "start": "3/8/2026",
    "end": "4/8/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "11",
    "task": "Socialización EduData equipo Subsecretaría de Calidad Educativa",
    "owner": "María Isabel",
    "start": "3/8/2026",
    "end": "5/8/2026",
    "status": "Finalizada",
    "comments": "Se agendó la asesoría virtual (lunes, 10 de agosto) para el reconocimiento de la plataforma EduData Cali para el equipo de Ecosistemas de innovación de la Subsecretaría de Calidad Educativa"
  },
  {
    "id": "12",
    "task": "Revisión actualización EduData. Próximo lunes, 10 de agosto",
    "owner": "María Isabel",
    "start": "30/7/2026",
    "end": "10/8/2026",
    "status": "finalizado",
    "comments": ""
  },
  {
    "id": "13",
    "task": "Crear carpeta con documentos del Observatorio para el Abogado Yarce",
    "owner": "María Isabel",
    "start": "4/8/2026",
    "end": "5/8/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "14",
    "task": "Elaborar oficios invitando a cada Subsecretaría + correos socialización interna EduData (lo firma Sara + Niki)",
    "owner": "María Isabel",
    "start": "5/8/2026",
    "end": "10/8/2026",
    "status": "En progreso",
    "comments": "Neidy ayudó a conseguir los espacios pero consiguió el Odín. Vamos a buscar un espacio más grande. Ya concerté con Nini el cronograma, fechas, hora y espacio para cada Subsecretaría. A la espera del VoBo de Nini para enviar a Ilda para orfear."
  },
  {
    "id": "15",
    "task": "Revisión bases premio INNOVA 2026",
    "owner": "María Isabel",
    "start": "6/8/2026",
    "end": "7/8/2026",
    "status": "En progreso",
    "comments": "A la espera de Reunión con Nini para definir si podemos participar o no"
  },
  {
    "id": "16",
    "task": "Revisión Ficha Técnica y tablero de Mapa de emergencia",
    "owner": "María Isabel",
    "start": "24/8/2026",
    "end": "25/8/2026",
    "status": "En progreso",
    "comments": ""
  },
  {
    "id": "17",
    "task": "Revisión Resolución Observatorio de la Educación enviada por el abogado Cristian Yarce",
    "owner": "María Isabel",
    "start": "27/8/2026",
    "end": "7/9/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "1",
    "task": "Proyecto BP26005337",
    "owner": "Alejandro",
    "start": "",
    "end": "",
    "status": "En progreso",
    "comments": "Alejandro se encargó de todo el componente financiero de este proyecto. Debemos estar atentos al envío del concepto de DATIC."
  },
  {
    "id": "1",
    "task": "Manuales tableros. Proyectos y PDD",
    "owner": "Sebastián",
    "start": "",
    "end": "",
    "status": "Atrasada",
    "comments": "30 días de atraso"
  },
  {
    "id": "2",
    "task": "Manuales tableros. Docentes",
    "owner": "Sebastián",
    "start": "29/7/2026",
    "end": "",
    "status": "En progreso",
    "comments": "Incluir todo el paso a paso con los flujos."
  },
  {
    "id": "3",
    "task": "Manuales tableros. ICFES",
    "owner": "Sebastián",
    "start": "",
    "end": "",
    "status": "En progreso",
    "comments": ""
  },
  {
    "id": "4",
    "task": "Mapa interactivo para los establecimientos educativos no oficiales",
    "owner": "Sebastián",
    "start": "29/7/2026",
    "end": "28/08/2026",
    "status": "En progreso",
    "comments": ""
  },
  {
    "id": "5",
    "task": "Actualizar las notas técnicas de EduData",
    "owner": "Sebastián",
    "start": "24/7/2026",
    "end": "",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "1",
    "task": "Encontrar solución a fallos en la ETL y elaborar informe técnico",
    "owner": "Todos",
    "start": "05/08/2026",
    "end": "25/08/2026",
    "status": "Finalizada",
    "comments": ""
  },
  {
    "id": "2",
    "task": "Documento técnico Modelos predictivos",
    "owner": "Eduardo + María Isabel",
    "start": "31/07/2026",
    "end": "",
    "status": "En progreso",
    "comments": "Eduardo culminó el componente conceptual. María Isabel debe revisar. Eduardo está trabajando en la Metodología"
  },
  {
    "id": "3,1",
    "task": "Participación Premio de Innovación que INNPACTA 2026",
    "owner": "Todos",
    "start": "",
    "end": "14/09/2026",
    "status": "Sin iniciar",
    "comments": "Leer las condiciones y escoger la categoría donde como entidad pública podemos participar."
  },
  {
    "id": "3,2",
    "task": "Participación Premio de Innovación que INNPACTA 2026",
    "owner": "María Isabel",
    "start": "05/08/2026",
    "end": "28/08/2026",
    "status": "Sin iniciar",
    "comments": "Hablar con Beatriz Barona. Nota de EduData en las redes sociales."
  },
  {
    "id": "4",
    "task": "Módulo de 'accountability' en el tablero de Proyectos. El propósito es poder identificar el número de beneficiarios (estudiantes, docentes, sedes, etc.) por cada proyecto según la vigencia. Y proyectos por sede educativa",
    "owner": "Sebastián",
    "start": "",
    "end": "",
    "status": "Sin iniciar",
    "comments": ""
  },
  {
    "id": "1",
    "task": "Realizar lectura Resumen EduData para CEPAL",
    "owner": "Nini",
    "start": "03/08/2026",
    "end": "",
    "status": "Atrasada",
    "comments": ""
  },
  {
    "id": "2",
    "task": "Revisión oficios subsecreterarías--socialización EduData",
    "owner": "Nini",
    "start": "",
    "end": "",
    "status": "Sin iniciar",
    "comments": ""
  },
  {
    "id": "3",
    "task": "Revisión convocatoria logo EduData",
    "owner": "Nini",
    "start": "",
    "end": "",
    "status": "Sin iniciar",
    "comments": ""
  },
  {
    "id": "1",
    "task": "Revisión formato 6A SIMAT para compartir con los compañeros de Bancos",
    "owner": "Todos",
    "start": "",
    "end": "",
    "status": "Sin iniciar",
    "comments": ""
  }
];

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseCSV(csvText) {
  const lines = [];
  let row = [""];
  let inQuotes = false;
  for (let i = 0; i < csvText.length; i++) {
    const c = csvText[i];
    const next = csvText[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push("");
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      if (row.length > 1 || row[0] !== "") {
        lines.push(row);
      }
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  return lines;
}

function normalizeStatus(raw) {
  if (!raw) return "Sin iniciar";
  const s = raw.trim().toLowerCase();
  if (s.includes("finaliz") || s.includes("hecho") || s.includes("cerrad") || s.includes("terminad")) return "Finalizada";
  if (s.includes("progres") || s.includes("proces") || s.includes("curso")) return "En progreso";
  if (s.includes("atras") || s.includes("retras") || s.includes("demor") || s.includes("bloque")) return "Atrasada";
  if (s.includes("sin") || s.includes("iniciar") || s.includes("pendient")) return "Sin iniciar";
  return raw.trim();
}

function normalizeOwner(raw) {
  if (!raw) return "Sin asignar";
  return raw.replace(/Sebasián/g, "Sebastián").trim();
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getOwnerColor(name) {
  const n = name.toLowerCase();
  if (n.includes("eduardo")) return { bg: "#eff6ff", color: "#1d4ed8" };
  if (n.includes("manuel")) return { bg: "#f0fdf4", color: "#15803d" };
  if (n.includes("maría") || n.includes("maria") || n.includes("isabel")) return { bg: "#fdf2f8", color: "#be185d" };
  if (n.includes("sebastián") || n.includes("sebastian")) return { bg: "#faf5ff", color: "#7e22ce" };
  if (n.includes("alejandro")) return { bg: "#fff7ed", color: "#c2410c" };
  if (n.includes("nini")) return { bg: "#ecfeff", color: "#0e7490" };
  if (n.includes("todos")) return { bg: "#f1f5f9", color: "#475569" };
  return { bg: "#f8fafc", color: "#64748b" };
}

function renderOwnerBadges(ownerStr) {
  if (!ownerStr || ownerStr.trim() === "") {
    return `<span class="owner-badge"><span class="owner-avatar" style="background:#f1f5f9;color:#64748b;">?</span>Sin asignar</span>`;
  }
  const parts = ownerStr.split("+").map(s => s.trim()).filter(Boolean);
  return parts.map(name => {
    const norm = normalizeOwner(name);
    const ini = getInitials(norm);
    const col = getOwnerColor(norm);
    return `<span class="owner-badge" title="${norm}"><span class="owner-avatar" style="background:${col.bg};color:${col.color};">${ini}</span>${norm}</span>`;
  }).join(" ");
}

function getStatusClass(status) {
  const s = status.toLowerCase();
  if (s.includes("finaliz")) return "finalizada";
  if (s.includes("progres")) return "enprogreso";
  if (s.includes("atras")) return "atrasada";
  return "sininiciar";
}

class ActivitiesManager {
  constructor() {
    this.items = [];
    this.filter = {
      search: "",
      owner: "all",
      status: "all"
    };
    this.viewMode = (typeof localStorage !== "undefined" && localStorage.getItem("edudata_act_view_mode")) || "kanban";
    this.isSyncing = false;
  }

  init() {
    // 1. Load cached items if available, or bundled snapshot
    let cached = null;
    let lastSynced = null;
    if (typeof localStorage !== "undefined") {
      try {
        cached = localStorage.getItem("edudata_activities_cache");
        lastSynced = localStorage.getItem("edudata_activities_synced_at");
      } catch (e) {}
    }

    if (cached) {
      try {
        this.items = JSON.parse(cached);
      } catch (e) {
        this.items = [...DEFAULT_ACTIVITIES_SNAPSHOT];
      }
    } else {
      this.items = [...DEFAULT_ACTIVITIES_SNAPSHOT];
    }
    this.items = this.items.map((it) => ({
      ...it,
      status: normalizeStatus(it.status),
      owner: normalizeOwner(it.owner)
    }));

    this.teamSearchQuery = "";
    this.teamFilterStatus = "all";

    if (lastSynced) {
      try {
        const d = new Date(lastSynced);
        const syncText = `Sincronizado: ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
        if ($("actSyncTime")) $("actSyncTime").textContent = syncText;
        if ($("teamSyncTime")) $("teamSyncTime").textContent = syncText;
      } catch (e) {}
    }

    // 2. Set up event listeners
    this.bindEvents();

    // 3. Populate filters and view mode
    this.populateOwnerFilter();
    this.setViewMode(this.viewMode);
    this.render();

    // 4. Trigger quiet background sync with Google Sheets on startup
    setTimeout(() => {
      this.fetchFromSheets(false);
    }, 400);

    // 5. Automatic periodic background sync (every 4 hours)
    if (typeof setInterval !== "undefined") {
      this.autoSyncInterval = setInterval(() => {
        this.fetchFromSheets(false);
      }, 14400000);
    }

    // 6. Automatic background sync on tab visibility and window focus (every 4 hours)
    if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          this.checkAndSyncIfNeeded(14400000);
        }
      });
    }
    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      window.addEventListener("focus", () => {
        this.checkAndSyncIfNeeded(14400000);
      });
    }
  }

  checkAndSyncIfNeeded(minElapsedMs = 14400000) {
    if (typeof localStorage === "undefined" || this.isSyncing) return;
    try {
      const lastSync = localStorage.getItem("edudata_activities_synced_at");
      const elapsed = lastSync ? Date.now() - new Date(lastSync).getTime() : Infinity;
      if (elapsed > minElapsedMs) {
        this.fetchFromSheets(false);
      }
    } catch (e) {
      this.fetchFromSheets(false);
    }
  }

  bindEvents() {
    // Search input
    $("actSearchInput")?.addEventListener("input", (e) => {
      this.filter.search = e.target.value.trim().toLowerCase();
      this.renderCardsAndTable();
    });

    // Owner filter
    $("actOwnerFilter")?.addEventListener("change", (e) => {
      this.filter.owner = e.target.value;
      this.renderCardsAndTable();
    });

    // Status tabs (Activities workspace)
    document.querySelectorAll(".act-status-tabs:not(#teamStatusTabs) .act-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".act-status-tabs:not(#teamStatusTabs) .act-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.filter.status = tab.dataset.status;
        this.renderCardsAndTable();
      });
    });

    // View mode buttons in Activities
    $("btnModeKanban")?.addEventListener("click", () => this.setViewMode("kanban"));
    $("btnModeTable")?.addEventListener("click", () => this.setViewMode("table"));

    // Sync button (Activities)
    $("btnSyncSheets")?.addEventListener("click", () => this.fetchFromSheets(true));

    // Team Search Input
    $("teamSearchInput")?.addEventListener("input", (e) => {
      this.teamSearchQuery = e.target.value.trim().toLowerCase();
      this.renderTeamView();
    });

    // Team Status Filter Tabs
    document.querySelectorAll("#teamStatusTabs .act-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll("#teamStatusTabs .act-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.teamFilterStatus = tab.dataset.teamFilter || "all";
        this.renderTeamView();
      });
    });

    // Sync button (Team view)
    $("btnSyncTeam")?.addEventListener("click", () => this.fetchFromSheets(true));
  }

  setViewMode(mode) {
    this.viewMode = mode;
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("edudata_act_view_mode", mode);
      } catch (e) {}
    }
    const kanban = $("actKanbanView");
    const table = $("actTableView");
    const btnKanban = $("btnModeKanban");
    const btnTable = $("btnModeTable");

    if (mode === "table") {
      if (kanban) kanban.hidden = true;
      if (table) table.hidden = false;
      btnTable?.classList.add("active");
      btnKanban?.classList.remove("active");
    } else {
      if (kanban) kanban.hidden = false;
      if (table) table.hidden = true;
      btnKanban?.classList.add("active");
      btnTable?.classList.remove("active");
    }
  }

  populateOwnerFilter() {
    const select = $("actOwnerFilter");
    if (!select) return;
    const currentVal = select.value || "all";
    const ownersSet = new Set();
    this.items.forEach((it) => {
      if (it.owner) {
        it.owner.split("+").forEach((o) => {
          const clean = normalizeOwner(o);
          if (clean && clean.toLowerCase() !== "sin asignar") {
            ownersSet.add(clean);
          }
        });
      }
    });

    const sortedOwners = Array.from(ownersSet).sort((a, b) => a.localeCompare(b, "es"));
    let html = `<option value="all">Todos los responsables</option>`;
    sortedOwners.forEach((owner) => {
      html += `<option value="${escapeHtml(owner)}">${escapeHtml(owner)}</option>`;
    });
    select.innerHTML = html;
    if (sortedOwners.includes(currentVal)) {
      select.value = currentVal;
    } else {
      select.value = "all";
      this.filter.owner = "all";
    }
  }

  async fetchFromSheets(isManual = false) {
    if (this.isSyncing) return;
    this.isSyncing = true;

    const btn = $("btnSyncSheets");
    const syncText = $("syncBtnText");
    const syncTime = $("actSyncTime");

    if (btn) btn.classList.add("is-syncing");
    if (syncText) syncText.textContent = "Sincronizando...";

    let rawCsv = null;
    const cb = `_cb=${Date.now()}`;
    const nginxUrl = NGINX_PROXY_URL + (NGINX_PROXY_URL.includes("?") ? "&" : "?") + cb;
    const directUrl = GOOGLE_SHEETS_CSV_URL + (GOOGLE_SHEETS_CSV_URL.includes("?") ? "&" : "?") + cb;

    // Strategy 1: Nginx proxy (/api/sheets-sync)
    try {
      const res = await fetch(nginxUrl, { cache: "no-store" });
      if (res.ok) {
        rawCsv = await res.text();
      }
    } catch (e) {}

    // Strategy 2: Direct fetch to Google Sheets
    if (!rawCsv) {
      try {
        const res = await fetch(directUrl, { cache: "no-store" });
        if (res.ok) {
          rawCsv = await res.text();
        }
      } catch (e) {}
    }

    // Strategy 3: CORS proxy fallback
    if (!rawCsv) {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(directUrl);
        const res = await fetch(proxyUrl, { cache: "no-store" });
        if (res.ok) {
          rawCsv = await res.text();
        }
      } catch (e) {}
    }

    if (rawCsv && rawCsv.trim().length > 0) {
      try {
        const parsedRows = parseCSV(rawCsv);
        const dataRows = parsedRows.slice(1).filter((r) => r[0] && r[0].trim() !== "");
        const newItems = dataRows.map((r) => {
          return {
            id: r[0]?.trim() || "",
            task: r[1]?.trim() || "",
            owner: normalizeOwner(r[2]?.trim() || "Sin asignar"),
            start: r[3]?.trim() || "",
            end: r[4]?.trim() || "",
            status: normalizeStatus(r[5]?.trim() || "Sin iniciar"),
            comments: r[6]?.trim() || ""
          };
        });

        if (newItems.length > 0) {
          this.items = newItems;
          const now = new Date();
          if (typeof localStorage !== "undefined") {
            try {
              localStorage.setItem("edudata_activities_cache", JSON.stringify(this.items));
              localStorage.setItem("edudata_activities_synced_at", now.toISOString());
            } catch (e) {}
          }

          const syncStr = `Sincronizado: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
          if ($("actSyncTime")) $("actSyncTime").textContent = syncStr;
          if ($("teamSyncTime")) $("teamSyncTime").textContent = syncStr;

          this.populateOwnerFilter();
          this.render();

          if (syncText) syncText.textContent = isManual ? "¡Actualizado!" : "Sincronizar";
        }
      } catch (err) {
        console.error("Error al procesar CSV de actividades:", err);
        if (syncText) syncText.textContent = "Error";
      }
    } else {
      if (typeof localStorage !== "undefined" && !localStorage.getItem("edudata_activities_synced_at")) {
        if ($("actSyncTime")) $("actSyncTime").textContent = "Caché local (sin conexión)";
        if ($("teamSyncTime")) $("teamSyncTime").textContent = "Caché local (sin conexión)";
      }
      if (syncText) syncText.textContent = isManual ? "Sin conexión" : "Sincronizar";
    }

    if (btn) btn.classList.remove("is-syncing");
    this.isSyncing = false;

    if (isManual) {
      setTimeout(() => {
        if (syncText) syncText.textContent = "Sincronizar";
      }, 2500);
    }
  }

  getFilteredItems() {
    return this.items.filter((item) => {
      // 1. Search text match
      if (this.filter.search) {
        const text = `${item.id} ${item.task} ${item.owner} ${item.comments}`.toLowerCase();
        if (!text.includes(this.filter.search)) return false;
      }

      // 2. Owner filter
      if (this.filter.owner !== "all") {
        const target = this.filter.owner.toLowerCase();
        const itemOwner = item.owner.toLowerCase();
        if (itemOwner !== "todos" && !itemOwner.includes(target)) {
          return false;
        }
      }

      // 3. Status filter
      if (this.filter.status !== "all") {
        if (normalizeStatus(item.status).toLowerCase() !== normalizeStatus(this.filter.status).toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }

  renderKPIs() {
    const total = this.items.length;
    let done = 0;
    let progress = 0;
    let delayed = 0;
    let notstarted = 0;

    this.items.forEach((it) => {
      const s = it.status.toLowerCase();
      if (s.includes("finaliz")) done++;
      else if (s.includes("progres")) progress++;
      else if (s.includes("atras")) delayed++;
      else notstarted++;
    });

    if ($("actCountTotal")) $("actCountTotal").textContent = total;
    if ($("actCountDone")) $("actCountDone").textContent = done;
    if ($("actPercentDone")) {
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      $("actPercentDone").textContent = `${pct}% completado`;
    }
    if ($("actCountProgress")) $("actCountProgress").textContent = progress;
    if ($("actCountDelayed")) $("actCountDelayed").textContent = delayed;
    if ($("actCountNotStarted")) $("actCountNotStarted").textContent = notstarted;
  }

  renderCardsAndTable() {
    const filtered = this.getFilteredItems();

    // 1. Render Kanban Columns
    const cols = {
      notstarted: [],
      inprogress: [],
      delayed: [],
      done: []
    };

    filtered.forEach((it) => {
      const s = it.status.toLowerCase();
      if (s.includes("finaliz")) cols.done.push(it);
      else if (s.includes("progres")) cols.inprogress.push(it);
      else if (s.includes("atras")) cols.delayed.push(it);
      else cols.notstarted.push(it);
    });

    if ($("badgeColNotStarted")) $("badgeColNotStarted").textContent = cols.notstarted.length;
    if ($("badgeColInProgress")) $("badgeColInProgress").textContent = cols.inprogress.length;
    if ($("badgeColDelayed")) $("badgeColDelayed").textContent = cols.delayed.length;
    if ($("badgeColDone")) $("badgeColDone").textContent = cols.done.length;

    const renderCard = (it) => {
      const datesHtml = (it.start || it.end)
        ? `<span class="card-dates" title="Inicio: ${it.start || 'No definida'} · Fin: ${it.end || 'No definida'}"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${it.start || '...'} → ${it.end || '...'}</span>`
        : "";

      const commentHtml = it.comments
        ? `<div class="card-comment">${escapeHtml(it.comments).replace(/\n/g, "<br/>")}</div>`
        : "";

      return `
        <article class="kanban-card">
          <div class="card-top-row">
            <span class="card-num-badge">#${it.id}</span>
            ${datesHtml}
          </div>
          <h4 class="card-title">${escapeHtml(it.task)}</h4>
          <div class="card-meta-row">
            <div class="owners-wrap">${renderOwnerBadges(it.owner)}</div>
          </div>
          ${commentHtml}
        </article>
      `;
    };

    const emptyHtml = `<div style="padding: 24px 10px; text-align: center; color: #94a3b8; font-size: 0.75rem; font-style: italic;">Sin actividades</div>`;

    if ($("colNotStartedList")) {
      $("colNotStartedList").innerHTML = cols.notstarted.length > 0 ? cols.notstarted.map(renderCard).join("") : emptyHtml;
    }
    if ($("colInProgressList")) {
      $("colInProgressList").innerHTML = cols.inprogress.length > 0 ? cols.inprogress.map(renderCard).join("") : emptyHtml;
    }
    if ($("colDelayedList")) {
      $("colDelayedList").innerHTML = cols.delayed.length > 0 ? cols.delayed.map(renderCard).join("") : emptyHtml;
    }
    if ($("colDoneList")) {
      $("colDoneList").innerHTML = cols.done.length > 0 ? cols.done.map(renderCard).join("") : emptyHtml;
    }

    // 2. Render Table Rows
    const tableBody = $("actTableBody");
    if (tableBody) {
      if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 28px; color: #94a3b8; font-size: 0.82rem;">No se encontraron actividades que coincidan con los filtros aplicados.</td></tr>`;
      } else {
        tableBody.innerHTML = filtered.map((it) => {
          const statusClass = getStatusClass(it.status);
          const commentsFormatted = it.comments ? escapeHtml(it.comments).replace(/\n/g, "<br/>") : '<span style="color:#cbd5e1;">—</span>';
          return `
            <tr>
              <td><span class="card-num-badge">#${it.id}</span></td>
              <td><strong>${escapeHtml(it.task)}</strong></td>
              <td><div class="owners-wrap">${renderOwnerBadges(it.owner)}</div></td>
              <td style="color:#475569; font-size:0.74rem;">${it.start || '<span style="color:#cbd5e1;">—</span>'}</td>
              <td style="color:#475569; font-size:0.74rem;">${it.end || '<span style="color:#cbd5e1;">—</span>'}</td>
              <td><span class="act-status-badge ${statusClass}">${it.status}</span></td>
              <td style="line-height:1.4; color:#334155; font-size:0.75rem;">${commentsFormatted}</td>
            </tr>
          `;
        }).join("");
      }
    }
  }

  renderTeamView() {
    const grid = $("teamMembersGrid");
    const summaryPills = $("teamSummaryPills");
    const countBadge = $("teamMembersCountBadge");
    if (!grid) return;

    const MEMBER_ROLES = {
      "María Isabel": "Coordinación, Enlaces & Socialización",
      "Manuel": "Custodia de Datos, Calidad & Procesos",
      "Eduardo": "Modelación Econométrica & Analítica",
      "Sebastián": "Visualización PowerBI & Mapas",
      "Nini": "Dirección Estratégica & Despacho",
      "Alejandro": "Finanzas & Estructuración BP",
      "Todos": "Compromisos Colectivos & ETL"
    };

    // Aggregate by individual member
    const membersMap = {};

    this.items.forEach((item) => {
      const normStatus = normalizeStatus(item.status);
      const owners = item.owner ? item.owner.split("+").map((s) => normalizeOwner(s.trim())).filter(Boolean) : ["Sin asignar"];
      
      owners.forEach((owner) => {
        if (!membersMap[owner]) {
          membersMap[owner] = {
            name: owner,
            role: MEMBER_ROLES[owner] || "Integrante del Equipo",
            total: 0,
            done: 0,
            prog: 0,
            delay: 0,
            wait: 0,
            tasks: []
          };
        }
        const m = membersMap[owner];
        m.total++;
        if (normStatus === "Finalizada") m.done++;
        else if (normStatus === "En progreso") m.prog++;
        else if (normStatus === "Atrasada") m.delay++;
        else m.wait++;

        m.tasks.push({
          id: item.id,
          task: item.task,
          status: normStatus,
          start: item.start,
          end: item.end,
          comments: item.comments
        });
      });
    });

    const allMembersList = Object.values(membersMap).sort((a, b) => b.total - a.total);

    // Calculate aggregated team KPIs
    let totalAssigned = 0;
    let totalDone = 0;
    let totalProg = 0;
    let totalDelay = 0;
    allMembersList.forEach((m) => {
      totalAssigned += m.total;
      totalDone += m.done;
      totalProg += m.prog;
      totalDelay += m.delay;
    });
    const avgPercent = totalAssigned > 0 ? Math.round((totalDone / totalAssigned) * 100) : 0;

    // Update Team KPI cards in DOM
    if ($("teamKpiMembers")) $("teamKpiMembers").textContent = allMembersList.length;
    if ($("teamKpiTotal")) $("teamKpiTotal").textContent = totalAssigned;
    if ($("teamKpiDone")) $("teamKpiDone").textContent = totalDone;
    if ($("teamKpiPercent")) $("teamKpiPercent").textContent = `${avgPercent}% completado`;
    if ($("teamKpiProg")) $("teamKpiProg").textContent = totalProg;
    if ($("teamKpiDelay")) $("teamKpiDelay").textContent = totalDelay;

    if (countBadge) {
      countBadge.textContent = `${allMembersList.length} integrantes / grupos`;
    }

    // Render summary pills
    if (summaryPills) {
      summaryPills.innerHTML = `
        <div class="team-summary-pill"><span>Total Asignaciones:</span> <strong>${totalAssigned}</strong></div>
        <div class="team-summary-pill" style="color:var(--green)"><span>Completadas:</span> <strong>${totalDone}</strong></div>
        <div class="team-summary-pill" style="color:var(--blue)"><span>En Desarrollo:</span> <strong>${totalProg}</strong></div>
        <div class="team-summary-pill" style="color:var(--red)"><span>Atrasadas / Alertas:</span> <strong>${totalDelay}</strong></div>
      `;
    }

    // Render Executive Summary Table ("esa tablita")
    const tbody = $("teamSummaryTableBody");
    const tfoot = $("teamSummaryTableFoot");
    if (tbody) {
      tbody.innerHTML = allMembersList.map((m) => {
        const initials = getInitials(m.name);
        const color = getOwnerColor(m.name);
        const percent = m.total > 0 ? Math.round((m.done / m.total) * 100) : 0;
        const hasDelay = m.delay > 0;
        const barGradient = percent >= 50 ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #2563eb, #3b82f6)';

        return `
          <tr>
            <td>
              <div class="team-member-cell">
                <span class="team-avatar-sm" style="background:${color.bg}; color:${color.color}; border: 1.5px solid ${color.color}35;">${initials}</span>
                <div class="team-member-name-wrap">
                  <strong class="team-member-name">${escapeHtml(m.name)}</strong>
                  <span class="team-member-role-sub">${escapeHtml(m.role)}</span>
                </div>
              </div>
            </td>
            <td style="text-align: center;">
              <span class="team-badge-total">${m.total}</span>
            </td>
            <td style="text-align: center;">
              <span class="team-badge-status done">${m.done}</span>
            </td>
            <td style="text-align: center;">
              <span class="team-badge-status prog">${m.prog}</span>
            </td>
            <td style="text-align: center;">
              <span class="team-badge-status delay ${hasDelay ? 'has-delay' : ''}">${m.delay}</span>
            </td>
            <td style="text-align: center;">
              <span class="team-badge-status wait">${m.wait}</span>
            </td>
            <td>
              <div class="team-table-progress-wrap">
                <div class="team-table-progress-bar">
                  <div class="team-table-progress-fill" style="width: ${percent}%; background: ${barGradient};"></div>
                </div>
                <span class="team-table-percent-text">${percent}%</span>
              </div>
            </td>
            <td style="text-align: center;">
              <button class="btn-table-kanban" data-owner="${escapeHtml(m.name)}" title="Ver tareas de ${escapeHtml(m.name)} en tablero Kanban">
                <span>Ver en Kanban ➔</span>
              </button>
            </td>
          </tr>
        `;
      }).join("");

      // Bind click on table action buttons
      tbody.querySelectorAll(".btn-table-kanban").forEach((btn) => {
        btn.addEventListener("click", () => {
          const owner = btn.dataset.owner;
          const ownerSelect = $("actOwnerFilter");
          if (ownerSelect) {
            ownerSelect.value = owner;
            this.filter.owner = owner;
          }
          switchAppView("activities");
          this.setViewMode("kanban");
          this.renderCardsAndTable();
        });
      });
    }

    if (tfoot) {
      let totalWait = 0;
      allMembersList.forEach((m) => { totalWait += m.wait; });
      tfoot.innerHTML = `
        <tr>
          <td>
            <div class="team-member-cell" style="padding-left: 6px;">
              <strong style="font-size: 0.88rem; color: var(--ink);">Total Equipo</strong>
            </div>
          </td>
          <td style="text-align: center;"><span class="team-badge-total" style="background:#dbeafe; color:#1e40af;">${totalAssigned}</span></td>
          <td style="text-align: center;"><span class="team-badge-status done">${totalDone}</span></td>
          <td style="text-align: center;"><span class="team-badge-status prog">${totalProg}</span></td>
          <td style="text-align: center;"><span class="team-badge-status delay ${totalDelay > 0 ? 'has-delay' : ''}">${totalDelay}</span></td>
          <td style="text-align: center;"><span class="team-badge-status wait">${totalWait}</span></td>
          <td>
            <div class="team-table-progress-wrap">
              <div class="team-table-progress-bar">
                <div class="team-table-progress-fill" style="width: ${avgPercent}%; background: linear-gradient(90deg, #16a34a, #22c55e);"></div>
              </div>
              <span class="team-table-percent-text" style="color: var(--green);">${avgPercent}%</span>
            </div>
          </td>
          <td style="text-align: center; color: #64748b; font-size: 0.75rem; font-weight: 700;">Consolidado</td>
        </tr>
      `;
    }

    // Filter members list by search query and status filter
    let filteredMembers = allMembersList;
    if (this.teamSearchQuery) {
      const q = this.teamSearchQuery;
      filteredMembers = filteredMembers.filter((m) => {
        const nameMatch = m.name.toLowerCase().includes(q);
        const roleMatch = m.role.toLowerCase().includes(q);
        const taskMatch = m.tasks.some(
          (t) => t.task.toLowerCase().includes(q) || (t.comments && t.comments.toLowerCase().includes(q))
        );
        return nameMatch || roleMatch || taskMatch;
      });
    }

    if (this.teamFilterStatus && this.teamFilterStatus !== "all") {
      if (this.teamFilterStatus === "delay") {
        filteredMembers = filteredMembers.filter((m) => m.delay > 0);
      } else if (this.teamFilterStatus === "prog") {
        filteredMembers = filteredMembers.filter((m) => m.prog > 0);
      } else if (this.teamFilterStatus === "done") {
        filteredMembers = filteredMembers.filter((m) => m.done === m.total && m.total > 0);
      }
    }

    if (filteredMembers.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: #fff; border: 1.5px dashed var(--line); border-radius: var(--radius-md);">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🔍</div>
          <h4 style="margin: 0 0 6px; font-weight: 700; color: var(--ink);">Sin coincidencias para los filtros</h4>
          <p style="margin: 0; color: var(--muted); font-size: 0.85rem;">Prueba buscando otro nombre o cambiando el filtro de estado.</p>
        </div>
      `;
      return;
    }

    // Render members grid
    grid.innerHTML = filteredMembers.map((m) => {
      const initials = getInitials(m.name);
      const color = getOwnerColor(m.name);
      const percent = m.total > 0 ? Math.round((m.done / m.total) * 100) : 0;
      const hasDelay = m.delay > 0;

      // Sort tasks: delayed and in progress first
      const sortedTasks = [...m.tasks].sort((a, b) => {
        const order = { "Atrasada": 0, "En progreso": 1, "Sin iniciar": 2, "Finalizada": 3 };
        return (order[a.status] ?? 4) - (order[b.status] ?? 4);
      });

      // Show up to 4 focus tasks on the card
      const focusTasks = sortedTasks.slice(0, 4);
      const remainingCount = sortedTasks.length - focusTasks.length;

      const tasksHtml = focusTasks.map((t) => {
        const sClass = getStatusClass(t.status);
        const datesStr = (t.start || t.end) ? `<span style="color:#64748b; font-size:0.66rem;">📅 ${t.start || '...'} → ${t.end || '...'}</span>` : "";
        const noteStr = t.comments ? `<div class="team-task-note">"${escapeHtml(t.comments.length > 95 ? t.comments.substring(0, 92) + '...' : t.comments)}"</div>` : "";
        return `
          <div class="team-task-item ${sClass}">
            <div class="team-task-row">
              <span class="team-task-id">#${t.id}</span>
              <span class="act-status-badge ${sClass}" style="font-size:0.62rem; padding:1px 5px;">${t.status}</span>
            </div>
            <p class="team-task-name">${escapeHtml(t.task)}</p>
            ${datesStr}
            ${noteStr}
          </div>
        `;
      }).join("");

      return `
        <article class="team-member-card" style="--card-stripe:${color.color}">
          <div class="team-card-head">
            <div class="team-card-user">
              <div class="team-avatar-lg" style="background:${color.bg}; color:${color.color}; box-shadow:0 0 0 1.5px ${color.color};">
                ${initials}
              </div>
              <div class="team-user-info">
                <h4>${escapeHtml(m.name)}</h4>
                <span class="team-user-role">${escapeHtml(m.role)}</span>
              </div>
            </div>
            <span class="team-card-total">${m.total} ${m.total === 1 ? 'tarea' : 'tareas'}</span>
          </div>

          <div class="team-progress-wrap">
            <div class="team-progress-labels">
              <span>Avance de entregables</span>
              <strong>${percent}% (${m.done} de ${m.total})</strong>
            </div>
            <div class="team-progress-bar-bg">
              <div class="team-progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
          </div>

          <div class="team-status-pills">
            <div class="team-pill done">
              <span>Hechas</span>
              <strong>${m.done}</strong>
            </div>
            <div class="team-pill prog">
              <span>En curso</span>
              <strong>${m.prog}</strong>
            </div>
            <div class="team-pill delay ${hasDelay ? 'has-delay' : ''}">
              <span>Atrasadas</span>
              <strong>${m.delay}</strong>
            </div>
            <div class="team-pill wait">
              <span>Pendientes</span>
              <strong>${m.wait}</strong>
            </div>
          </div>

          <div class="team-tasks-list">
            <div class="team-tasks-header">
              <span>Actividades en foco</span>
              ${remainingCount > 0 ? `<span style="font-size:0.65rem; color:#64748b;">+${remainingCount} adicionales</span>` : ''}
            </div>
            ${tasksHtml}
          </div>

          <div class="team-card-actions">
            <span style="font-size:0.68rem; color:#64748b;">Ver flujo en tablero:</span>
            <button class="team-filter-btn" data-owner="${escapeHtml(m.name)}">
              <span>Ver en Kanban ➔</span>
            </button>
          </div>
        </article>
      `;
    }).join("");

    // Attach click events on "Ver en Kanban" buttons
    grid.querySelectorAll(".team-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const owner = btn.dataset.owner;
        const ownerSelect = $("actOwnerFilter");
        if (ownerSelect) {
          ownerSelect.value = owner;
          this.filter.owner = owner;
        }
        switchAppView("activities");
        this.setViewMode("kanban");
        this.renderCardsAndTable();
      });
    });
  }

  render() {
    this.renderKPIs();
    this.renderCardsAndTable();
    this.renderTeamView();
  }
}

// Global View Switcher
function switchAppView(view) {
  const tabFlow = $("tabNavFlow");
  const tabAct = $("tabNavActivities");
  const tabTeam = $("tabNavTeam");
  const viewFlow = $("viewFlow");
  const viewAct = $("viewActivities");
  const viewTeam = $("viewTeam");
  const periodCtrl = $("headerPeriodControl");

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("edudata_active_app_view", view);
    } catch (e) {}
  }

  // Deactivate all tabs
  [tabFlow, tabAct, tabTeam].forEach((t) => {
    t?.classList.remove("active");
    t?.setAttribute("aria-selected", "false");
  });

  // Hide all view containers
  [viewFlow, viewAct, viewTeam].forEach((v) => {
    if (v) {
      v.hidden = true;
      v.classList.remove("active");
    }
  });

  if (view === "flow") {
    tabFlow?.classList.add("active");
    tabFlow?.setAttribute("aria-selected", "true");
    if (viewFlow) {
      viewFlow.hidden = false;
      viewFlow.classList.add("active");
    }
    const matrixActive = $("btnSubViewMatrix")?.classList.contains("active");
    if (periodCtrl) periodCtrl.style.display = matrixActive ? "none" : "";

    if (matrixActive && window.annualMatrixManager) {
      window.annualMatrixManager.render();
    } else if (window.flowCanvas) {
      setTimeout(() => window.flowCanvas.fitView(false), 50);
    }
  } else if (view === "team") {
    tabTeam?.classList.add("active");
    tabTeam?.setAttribute("aria-selected", "true");
    if (viewTeam) {
      viewTeam.hidden = false;
      viewTeam.classList.add("active");
    }
    if (periodCtrl) periodCtrl.style.display = "none";

    if (window.activitiesManager) {
      window.activitiesManager.renderTeamView();
      window.activitiesManager.checkAndSyncIfNeeded(14400000);
    }
  } else {
    // view === "activities"
    tabAct?.classList.add("active");
    tabAct?.setAttribute("aria-selected", "true");
    if (viewAct) {
      viewAct.hidden = false;
      viewAct.classList.add("active");
    }
    if (periodCtrl) periodCtrl.style.display = "none";

    if (window.activitiesManager) {
      window.activitiesManager.render();
      window.activitiesManager.checkAndSyncIfNeeded(14400000);
    }
  }
}

// Bind Top Navigation Tabs
$("tabNavFlow")?.addEventListener("click", () => switchAppView("flow"));
$("tabNavActivities")?.addEventListener("click", () => switchAppView("activities"));
$("tabNavTeam")?.addEventListener("click", () => switchAppView("team"));

// Initialize Activities Manager
const activitiesManager = new ActivitiesManager();
window.activitiesManager = activitiesManager;
activitiesManager.init();

// ==========================================
// MATRIZ ANUAL DE BASES DE DATOS (HOJA BASE)
// ==========================================
const ANNUAL_BASES_DATA = [
  {
    name: "SIMAT",
    organism: "Cobertura",
    sourceOwner: "Carolina Correa",
    drive: true,
    periodicity: "mensual",
    periodicityLabel: "Mensual (12/año)",
    periodicityEmoji: "🟣",
    scheduledMonths: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    cadenceNote: "Reporte mensual continuo de matrícula de estudiantes oficiales y no oficiales",
    monthly: {
      enero: "actualizada", febrero: "actualizada", marzo: "actualizada", abril: "actualizada",
      mayo: "actualizada", junio: "actualizada", julio: "actualizada", agosto: "solicitud",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "HUMANO",
    organism: "Administrativa y Financiera",
    sourceOwner: "Glasford",
    drive: true,
    periodicity: "mensual",
    periodicityLabel: "Mensual (12/año)",
    periodicityEmoji: "🟣",
    scheduledMonths: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    cadenceNote: "Reporte mensual continuo de nómina, planta docente y personal administrativo",
    monthly: {
      enero: "actualizada", febrero: "actualizada", marzo: "actualizada", abril: "actualizada",
      mayo: "actualizada", junio: "actualizada", julio: "actualizada", agosto: "solicitud",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "PAE",
    organism: "Cobertura",
    sourceOwner: "Jaime Moreno",
    drive: false,
    periodicity: "lectivo",
    periodicityLabel: "Mensual Lectivo",
    periodicityEmoji: "🔵",
    scheduledMonths: ["junio", "julio", "agosto", "septiembre", "octubre", "noviembre"],
    cadenceNote: "Alimentación escolar activa durante el calendario escolar; inicia entregas en Junio",
    monthly: {
      enero: "no_aplica", febrero: "no_aplica", marzo: "no_aplica", abril: "no_aplica",
      mayo: "no_aplica", junio: "actualizada", julio: "actualizada", agosto: "solicitud",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "EJECUCIONES PRESUPUESTALES",
    organism: "Planeación Económica y Social",
    sourceOwner: "Nini Johana Sánchez",
    drive: false,
    periodicity: "mensual",
    periodicityLabel: "Mensual (12/año)",
    periodicityEmoji: "🟣",
    scheduledMonths: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    cadenceNote: "Ejecución financiera, presupuestal y de gastos mensual de la Secretaría",
    monthly: {
      enero: "actualizada", febrero: "actualizada", marzo: "actualizada", abril: "actualizada",
      mayo: "actualizada", junio: "actualizada", julio: "actualizada", agosto: "solicitud",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "SIMPADE",
    organism: "Cobertura",
    sourceOwner: "Paola Tapia",
    drive: true,
    periodicity: "lectivo",
    periodicityLabel: "Mensual Lectivo",
    periodicityEmoji: "🔵",
    scheduledMonths: ["mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre"],
    cadenceNote: "Permanencia y deserción escolar activa tras consolidación de matrícula (inicia en Mayo)",
    monthly: {
      enero: "no_aplica", febrero: "no_aplica", marzo: "no_aplica", abril: "no_aplica",
      mayo: "actualizada", junio: "actualizada", julio: "actualizada", agosto: "solicitud",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "ICFES Clasificación",
    organism: "Calidad educativa",
    sourceOwner: "Jenniffer Pedraza",
    drive: true,
    periodicity: "anual",
    periodicityLabel: "Anual (1 corte/año)",
    periodicityEmoji: "🟢",
    scheduledMonths: ["noviembre"],
    cadenceNote: "Corte anual oficial tras la publicación de resultados de Pruebas Saber 11",
    monthly: {
      enero: "no_aplica", febrero: "empty", marzo: "empty", abril: "empty",
      mayo: "empty", junio: "empty", julio: "empty", agosto: "empty",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "ICFES Territorial",
    organism: "Calidad educativa",
    sourceOwner: "Jenniffer Pedraza",
    drive: true,
    periodicity: "anual",
    periodicityLabel: "Anual (1 corte/año)",
    periodicityEmoji: "🟢",
    scheduledMonths: ["noviembre"],
    cadenceNote: "Consolidación territorial anual de índices de calidad educativa distrital",
    monthly: {
      enero: "no_aplica", febrero: "empty", marzo: "empty", abril: "empty",
      mayo: "empty", junio: "empty", julio: "empty", agosto: "empty",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "IDESC",
    organism: "Planeación Distrital",
    sourceOwner: "Julio",
    drive: true,
    periodicity: "anual",
    periodicityLabel: "Anual (1 corte/año)",
    periodicityEmoji: "🟢",
    scheduledMonths: ["enero"],
    cadenceNote: "Corte anual de infraestructura de datos espaciales y geográficos de Santiago de Cali",
    monthly: {
      enero: "actualizada", febrero: "empty", marzo: "empty", abril: "empty",
      mayo: "empty", junio: "empty", julio: "empty", agosto: "empty",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "DUE SEDES",
    organism: "Inspección y vigilancia",
    sourceOwner: "Olga",
    drive: true,
    periodicity: "trimestral",
    periodicityLabel: "Trimestral (4/año)",
    periodicityEmoji: "🟠",
    scheduledMonths: ["enero", "abril", "julio", "octubre"],
    cadenceNote: "Directorio Único de Sedes Educativas con cortes trimestrales de actualización por resolución",
    monthly: {
      enero: "actualizada", febrero: "empty", marzo: "empty", abril: "actualizada",
      mayo: "empty", junio: "empty", julio: "empty", agosto: "empty",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "DUE ESTABLECIMIENTOS",
    organism: "Inspección y vigilancia",
    sourceOwner: "Olga",
    drive: true,
    periodicity: "trimestral",
    periodicityLabel: "Trimestral (4/año)",
    periodicityEmoji: "🟠",
    scheduledMonths: ["enero", "abril", "julio", "octubre"],
    cadenceNote: "Directorio Único de Establecimientos con cortes trimestrales de actualización por resolución",
    monthly: {
      enero: "actualizada", febrero: "empty", marzo: "empty", abril: "actualizada",
      mayo: "empty", junio: "empty", julio: "empty", agosto: "empty",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "Notas",
    organism: "Planeación Económica y Social",
    sourceOwner: "María Isabel Gómez y Sebastián Dow",
    drive: false,
    periodicity: "mensual",
    periodicityLabel: "Mensual (12/año)",
    periodicityEmoji: "🟣",
    scheduledMonths: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    cadenceNote: "Calificaciones continuas y evaluaciones periódicas del sistema escolar",
    monthly: {
      enero: "actualizada", febrero: "actualizada", marzo: "actualizada", abril: "actualizada",
      mayo: "actualizada", junio: "actualizada", julio: "actualizada", agosto: "empty",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "1S",
    organism: "Planeación Económica y Social",
    sourceOwner: "Caterine Gonzales",
    drive: false,
    periodicity: "trimestral",
    periodicityLabel: "Trimestral (4/año)",
    periodicityEmoji: "🟠",
    scheduledMonths: ["enero", "abril", "julio", "octubre"],
    cadenceNote: "Seguimiento a metas y compromisos estratégicos (Corte Trimestral)",
    monthly: {
      enero: "actualizada", febrero: "empty", marzo: "empty", abril: "actualizada",
      mayo: "empty", junio: "empty", julio: "empty", agosto: "empty",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "3S",
    organism: "Planeación Económica y Social",
    sourceOwner: "Caterine Gonzales",
    drive: false,
    periodicity: "trimestral",
    periodicityLabel: "Trimestral (4/año)",
    periodicityEmoji: "🟠",
    scheduledMonths: ["enero", "abril", "julio", "octubre"],
    cadenceNote: "Seguimiento a metas y compromisos estratégicos (Corte Trimestral)",
    monthly: {
      enero: "actualizada", febrero: "empty", marzo: "empty", abril: "actualizada",
      mayo: "empty", junio: "empty", julio: "empty", agosto: "empty",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  },
  {
    name: "4S",
    organism: "Planeación Económica y Social",
    sourceOwner: "Caterine Gonzales",
    drive: false,
    periodicity: "trimestral",
    periodicityLabel: "Trimestral (4/año)",
    periodicityEmoji: "🟠",
    scheduledMonths: ["enero", "abril", "julio", "octubre"],
    cadenceNote: "Seguimiento a metas y compromisos estratégicos (Corte Trimestral)",
    monthly: {
      enero: "actualizada", febrero: "empty", marzo: "empty", abril: "actualizada",
      mayo: "empty", junio: "empty", julio: "empty", agosto: "empty",
      septiembre: "empty", octubre: "empty", noviembre: "empty", diciembre: "empty"
    }
  }
];

class AnnualMatrixManager {
  constructor() {
    this.data = ANNUAL_BASES_DATA.map((item) => ({
      ...item,
      monthly: { ...item.monthly }
    }));
    this.filter = {
      search: "",
      organism: "all",
      periodicity: "all",
      driveOnly: false
    };
    this.months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    this.monthShort = {
      enero: "Ene", febrero: "Feb", marzo: "Mar", abril: "Abr",
      mayo: "May", junio: "Jun", julio: "Jul", agosto: "Ago",
      septiembre: "Sep", octubre: "Oct", noviembre: "Nov", diciembre: "Dic"
    };
    this.statusLabels = {
      actualizada: "Actualizada",
      solicitud: "En gestión (mes actual)",
      corte_pendiente: "Corte pendiente",
      no_aplica: "No existe base en ese mes",
      empty: "Pendiente / Sin reporte"
    };
    this.statusIcons = {
      actualizada: "✓",
      solicitud: "⏳",
      corte_pendiente: "⚠️",
      no_aplica: "—",
      empty: "·"
    };
  }

  getPeriodForMonth(monthName) {
    const NUM_BY_MONTH = {
      enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
      julio: "07", agosto: "08", septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
    };
    const num = NUM_BY_MONTH[monthName];
    if (!num || typeof data === "undefined" || !data) return null;
    return Object.keys(data).find((p) => p.endsWith(`-${num}`)) || null;
  }

  getFlowItemForMonth(baseName, monthName) {
    const period = this.getPeriodForMonth(monthName);
    if (!period || !data[period]) return null;
    return data[period].find((item) => item.name.trim().toLowerCase() === baseName.trim().toLowerCase()) || null;
  }

  syncWithFlowData() {
    if (typeof data === "undefined" || !data) return;

    const MONTH_BY_NUM = {
      "01": "enero", "02": "febrero", "03": "marzo", "04": "abril",
      "05": "mayo", "06": "junio", "07": "julio", "08": "agosto",
      "09": "septiembre", "10": "octubre", "11": "noviembre", "12": "diciembre"
    };

    Object.entries(data).forEach(([periodKey, baseRows]) => {
      const parts = periodKey.split("-");
      if (parts.length < 2) return;
      const monthNum = parts[1];
      const monthName = MONTH_BY_NUM[monthNum];
      if (!monthName) return;

      const isPeriodClosed = typeof closedPeriods !== "undefined" && closedPeriods.includes(periodKey);

      baseRows.forEach((flowItem) => {
        const matrixBase = this.data.find(
          (b) => b.name.trim().toLowerCase() === flowItem.name.trim().toLowerCase()
        );
        if (!matrixBase) return;

        if (!flowItem.applies) {
          matrixBase.monthly[monthName] = "no_aplica";
        } else if (flowItem.health === "done" || flowItem.progress >= steps.length) {
          matrixBase.monthly[monthName] = "actualizada";
        } else if (flowItem.health === "waiting" || flowItem.health === "active" || flowItem.progress > 0 || flowItem.incident) {
          matrixBase.monthly[monthName] = isPeriodClosed ? "corte_pendiente" : "solicitud";
        } else {
          matrixBase.monthly[monthName] = isPeriodClosed ? "corte_pendiente" : "empty";
        }
      });
    });
  }

  init() {
    this.syncWithFlowData();
    this.populateOrgFilter();
    this.bindEvents();
    this.render();
  }

  populateOrgFilter() {
    const select = $("matrixOrgFilter");
    if (!select) return;
    const orgs = Array.from(new Set(this.data.map((d) => d.organism))).sort((a, b) => a.localeCompare(b, "es"));
    let html = `<option value="all">Todos los organismos (${orgs.length})</option>`;
    orgs.forEach((org) => {
      html += `<option value="${escapeHtml(org)}">${escapeHtml(org)}</option>`;
    });
    select.innerHTML = html;
  }

  bindEvents() {
    $("matrixSearchInput")?.addEventListener("input", (e) => {
      this.filter.search = e.target.value.trim().toLowerCase();
      this.render();
    });

    $("matrixPeriodicityFilter")?.addEventListener("change", (e) => {
      this.setPeriodicityFilter(e.target.value);
    });

    $("matrixOrgFilter")?.addEventListener("change", (e) => {
      this.filter.organism = e.target.value;
      this.render();
    });

    $("matrixDriveOnlyCheck")?.addEventListener("change", (e) => {
      this.filter.driveOnly = e.target.checked;
      this.render();
    });

    // Bind periodicity filter chips
    document.querySelectorAll(".periodicity-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const per = chip.dataset.periodicity || "all";
        this.setPeriodicityFilter(per);
      });
    });

    // Bind segmented bar items
    document.querySelectorAll(".periodicity-segmented-bar .seg-item").forEach((seg) => {
      seg.addEventListener("click", () => {
        if (seg.classList.contains("seg-mensual")) this.setPeriodicityFilter("mensual");
        else if (seg.classList.contains("seg-lectivo")) this.setPeriodicityFilter("lectivo");
        else if (seg.classList.contains("seg-trimestral")) this.setPeriodicityFilter("trimestral");
        else if (seg.classList.contains("seg-anual")) this.setPeriodicityFilter("anual");
      });
    });
  }

  setPeriodicityFilter(periodicity) {
    this.filter.periodicity = periodicity;
    const select = $("matrixPeriodicityFilter");
    if (select) select.value = periodicity;

    document.querySelectorAll(".periodicity-chip").forEach((c) => {
      c.classList.toggle("active", (c.dataset.periodicity || "all") === periodicity);
    });

    this.render();
  }

  getFilteredData() {
    return this.data.filter((item) => {
      if (this.filter.driveOnly && !item.drive) return false;
      if (this.filter.periodicity !== "all" && item.periodicity !== this.filter.periodicity) return false;
      if (this.filter.organism !== "all" && item.organism !== this.filter.organism) return false;
      if (this.filter.search) {
        const q = this.filter.search;
        const nameMatch = item.name.toLowerCase().includes(q);
        const orgMatch = item.organism.toLowerCase().includes(q);
        const ownerMatch = item.sourceOwner.toLowerCase().includes(q);
        const perMatch = (item.periodicityLabel || "").toLowerCase().includes(q);
        if (!nameMatch && !orgMatch && !ownerMatch && !perMatch) return false;
      }
      return true;
    });
  }

  render() {
    this.syncWithFlowData();
    const tbody = $("annualMatrixTableBody");
    if (!tbody) return;

    const filtered = this.getFilteredData();

    // Calculate annual KPIs & counts
    const totalBases = this.data.length;
    const driveBases = this.data.filter((d) => d.drive).length;
    let totalUpdated = 0;
    let totalSolicitud = 0;
    let totalPending = 0;

    this.data.forEach((d) => {
      this.months.forEach((m) => {
        const st = d.monthly[m];
        if (st === "actualizada") totalUpdated++;
        else if (st === "solicitud") totalSolicitud++;
        else if (st === "corte_pendiente") totalPending++;
      });
    });

    // Counts by periodicity
    const countMensual = this.data.filter((d) => d.periodicity === "mensual").length;
    const countLectivo = this.data.filter((d) => d.periodicity === "lectivo").length;
    const countTrimestral = this.data.filter((d) => d.periodicity === "trimestral").length;
    const countAnual = this.data.filter((d) => d.periodicity === "anual").length;

    if ($("chipCountAll")) $("chipCountAll").textContent = totalBases;
    if ($("chipCountMensual")) $("chipCountMensual").textContent = countMensual;
    if ($("chipCountLectivo")) $("chipCountLectivo").textContent = countLectivo;
    if ($("chipCountTrimestral")) $("chipCountTrimestral").textContent = countTrimestral;
    if ($("chipCountAnual")) $("chipCountAnual").textContent = countAnual;

    if ($("annualKpiTotal")) $("annualKpiTotal").textContent = totalBases;
    if ($("annualKpiDrive")) $("annualKpiDrive").textContent = `${driveBases} (${Math.round((driveBases / totalBases) * 100)}%)`;
    if ($("annualKpiUpdated")) $("annualKpiUpdated").textContent = totalUpdated;
    if ($("annualKpiRequests")) $("annualKpiRequests").textContent = totalSolicitud;
    if ($("annualKpiPending")) $("annualKpiPending").textContent = totalPending;

    if ($("matrixFilterCount")) {
      $("matrixFilterCount").textContent = `${filtered.length} de ${totalBases} bases`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="18" style="padding: 40px 16px; text-align: center; color: var(--muted);">
            <div style="font-size: 1.5rem; margin-bottom: 6px;">🔍</div>
            <strong>No se encontraron bases con los filtros seleccionados</strong>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map((item) => {
      const initials = getInitials(item.sourceOwner);
      const color = getOwnerColor(item.sourceOwner);
      const driveBadge = item.drive
        ? `<span class="drive-badge drive-yes" title="Se carga al Drive del lago de datos">Sí</span>`
        : `<span class="drive-badge drive-no" title="No se carga al Drive del lago">No</span>`;

      const monthCells = this.months.map((m) => {
        const rawStatus = item.monthly[m] || "empty";
        const isScheduled = item.scheduledMonths.includes(m);
        const isNoCut = (item.periodicity !== "mensual" && !isScheduled && (rawStatus === "empty" || rawStatus === "no_aplica"));

        let status = rawStatus;
        let icon = this.statusIcons[status] || "·";
        let cellClass = status;

        const period = this.getPeriodForMonth(m);
        const flowItem = this.getFlowItemForMonth(item.name, m);
        const hasWorkflow = Boolean(period) && !isNoCut;

        let tooltipText = `${escapeHtml(item.name)} · ${this.monthShort[m]}: ${this.statusLabels[status] || status}`;

        if (isNoCut) {
          cellClass = "no-cut";
          icon = "⏸";
          tooltipText = `${escapeHtml(item.name)} · ${this.monthShort[m]}: Sin corte programado (${escapeHtml(item.periodicityLabel)}) · ${escapeHtml(item.cadenceNote)}`;
        } else if (status === "no_aplica") {
          cellClass = "no_aplica";
          icon = "—";
          tooltipText = `${escapeHtml(item.name)} · ${this.monthShort[m]}: No existe base en ese mes (${escapeHtml(item.periodicityLabel)}) · ${escapeHtml(item.cadenceNote)}`;
        } else if (status === "corte_pendiente") {
          cellClass = "corte_pendiente";
          icon = "⚠️";
          const stepMeta = flowItem && steps[flowItem.progress] ? steps[flowItem.progress].label : "En curso";
          tooltipText = `${escapeHtml(item.name)} · ${this.monthShort[m]}: Corte pendiente (Mes vencido sin entrega, quedó en: ${stepMeta})`;
        } else if (flowItem) {
          if (flowItem.health === "done" || flowItem.progress >= steps.length) {
            tooltipText = `${escapeHtml(item.name)} · ${this.monthShort[m]}: Actualizada (Flujo cerrado)`;
          } else if (flowItem.incident) {
            tooltipText = `${escapeHtml(item.name)} · ${this.monthShort[m]}: Bloqueada (${escapeHtml(flowItem.incident.reason)})`;
          } else if (flowItem.progress > 0) {
            const stepMeta = steps[flowItem.progress] || { label: "En proceso" };
            tooltipText = `${escapeHtml(item.name)} · ${this.monthShort[m]}: En curso - ${stepMeta.label} (${percent(flowItem)}%)`;
          } else if (flowItem.health === "waiting") {
            tooltipText = `${escapeHtml(item.name)} · ${this.monthShort[m]}: En espera de entrega por la fuente`;
          }
        }

        if (hasWorkflow) tooltipText += " (Clic para ver flujo)";

        return `
          <td class="col-month-cell">
            <span class="matrix-cell-badge ${cellClass}" 
                  data-base="${escapeHtml(item.name)}" 
                  data-month="${m}" 
                  data-has-workflow="${hasWorkflow}"
                  title="${tooltipText}">
              ${icon}
            </span>
          </td>
        `;
      }).join("");

      return `
        <tr>
          <td class="col-sticky-base">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${item.drive ? 'var(--blue)' : '#cbd5e1'};"></span>
              <strong>${escapeHtml(item.name)}</strong>
            </div>
          </td>
          <td style="white-space: nowrap;">
            <span class="periodicity-badge ${item.periodicity}" title="${escapeHtml(item.cadenceNote)}">
              ${item.periodicityEmoji} ${escapeHtml(item.periodicityLabel)}
            </span>
          </td>
          <td><span style="color: #475569; font-size: 0.78rem;">${escapeHtml(item.organism)}</span></td>
          <td>
            <div class="team-member-cell">
              <span class="team-avatar-sm" style="width: 26px; height: 26px; font-size: 0.64rem; background:${color.bg}; color:${color.color}; border:1px solid ${color.color}35;">${initials}</span>
              <span style="font-size: 0.78rem; color: var(--ink); font-weight: 600;">${escapeHtml(item.sourceOwner)}</span>
            </div>
          </td>
          <td style="text-align: center;">${driveBadge}</td>
          ${monthCells}
          <td style="text-align: center;">
            <button class="btn-matrix-drilldown" data-base="${escapeHtml(item.name)}" title="Ver flujo paso a paso de ${escapeHtml(item.name)}">
              <span>Ver Flujo ➔</span>
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Bind drilldown actions
    tbody.querySelectorAll(".btn-matrix-drilldown").forEach((btn) => {
      btn.addEventListener("click", () => {
        const baseName = btn.dataset.base;
        this.drillDownToBase(baseName, null);
      });
    });

    tbody.querySelectorAll(".matrix-cell-badge").forEach((cell) => {
      cell.addEventListener("click", () => {
        const baseName = cell.dataset.base;
        const month = cell.dataset.month;
        const hasWorkflow = cell.dataset.hasWorkflow === "true";
        if (hasWorkflow) {
          const period = this.getPeriodForMonth(month);
          if (period) {
            this.drillDownToBase(baseName, period);
          }
        }
      });
    });
  }

  drillDownToBase(baseName, targetPeriod) {
    if (targetPeriod && periodLabels[targetPeriod]) {
      selectedPeriod = targetPeriod;
      const periodSelect = $("periodSelect");
      if (periodSelect) periodSelect.value = targetPeriod;
    }
    selectedName = baseName;
    switchFlowSubView("diagram");
    render();
    if (window.flowCanvas) {
      setTimeout(() => window.flowCanvas.fitView(false), 80);
    }
  }
}

// Flow Subview Switcher (Diagram vs Annual Matrix)
function switchFlowSubView(subview) {
  const btnDiagram = $("btnSubViewDiagram");
  const btnMatrix = $("btnSubViewMatrix");
  const diagramView = $("flowDiagramSubView");
  const matrixView = $("flowMatrixSubView");
  const periodCtrl = $("headerPeriodControl");

  if (subview === "matrix") {
    btnMatrix?.classList.add("active");
    btnMatrix?.setAttribute("aria-selected", "true");
    btnDiagram?.classList.remove("active");
    btnDiagram?.setAttribute("aria-selected", "false");

    if (diagramView) diagramView.hidden = true;
    if (matrixView) matrixView.hidden = false;
    if (periodCtrl) periodCtrl.style.display = "none";

    if (window.annualMatrixManager) {
      window.annualMatrixManager.syncWithFlowData();
      window.annualMatrixManager.render();
    }
  } else {
    // subview === "diagram"
    btnDiagram?.classList.add("active");
    btnDiagram?.setAttribute("aria-selected", "true");
    btnMatrix?.classList.remove("active");
    btnMatrix?.setAttribute("aria-selected", "false");

    if (diagramView) diagramView.hidden = false;
    if (matrixView) matrixView.hidden = true;
    if (periodCtrl) periodCtrl.style.display = "";

    if (window.flowCanvas) {
      setTimeout(() => window.flowCanvas.fitView(false), 50);
    }
  }
}

// Bind Flow Subview Switcher
$("btnSubViewDiagram")?.addEventListener("click", () => switchFlowSubView("diagram"));
$("btnSubViewMatrix")?.addEventListener("click", () => switchFlowSubView("matrix"));

// Initialize Annual Matrix Manager
const annualMatrixManager = new AnnualMatrixManager();
window.annualMatrixManager = annualMatrixManager;
annualMatrixManager.init();

// Restore active view preference if saved, or default to flow
try {
  if (typeof localStorage !== "undefined") {
    const savedView = localStorage.getItem("edudata_active_app_view");
    if (savedView && (savedView === "activities" || savedView === "team")) {
      switchAppView(savedView);
    }
  }
} catch (e) {}
