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

const storageKey = "edudata-flujo-demo-v1";
const seed = () => Object.fromEntries(Object.entries(periods).map(([period, rows]) => [period, rows.map(([name, organism, sourceOwner, dashboard, owner, applies, progress, health, incident]) => ({ name, organism, sourceOwner, dashboard, owner, applies, progress, health, incident: incident ? { reason: incident, owner: "Coordinación Edudata" } : null }))]));
let data = loadData();
let selectedPeriod = "2026-09";
let selectedName = "SIMAT";

const $ = (id) => document.getElementById(id);
const periodLabels = { "2026-09": "Septiembre 2026", "2026-08": "Agosto 2026" };

function loadData() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || seed(); }
  catch { return seed(); }
}

function saveData() { localStorage.setItem(storageKey, JSON.stringify(data)); }
function currentRows() { return data[selectedPeriod]; }
function selectedBase() { return currentRows().find((item) => item.name === selectedName) || currentRows()[0]; }
function percent(item) { return item.applies ? Math.round((item.progress / steps.length) * 100) : 0; }

function deriveHealth(item) {
  if (!item.applies) return "na";
  if (item.incident) return "blocked";
  if (item.progress >= steps.length) return "done";
  return item.health === "waiting" ? "waiting" : "active";
}

function healthLabel(health) {
  return { done: "Terminada", active: "En curso", waiting: "Esperando respuesta", blocked: "Bloqueada", na: "No aplica" }[health];
}

function graphState(item, stepIndex) {
  if (!item.applies) return "pending";
  if (item.incident && item.progress === stepIndex) return "blocked";
  if (item.progress > stepIndex) return "done";
  if (item.progress === stepIndex) return "current";
  return "pending";
}

function graphText(lines, x, y, className = "node-label") {
  const start = y - ((lines.length - 1) * 8);
  return `<text class="${className}" x="${x}" y="${start}" text-anchor="middle">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? 17 : 0}">${line}</tspan>`).join("")}</text>`;
}

function rectNode(id, x, y, lines, state) {
  return `<g class="graph-node ${state}" data-node="${id}"><rect x="${x}" y="${y}" width="132" height="70" rx="12"/>${graphText(lines, x + 66, y + 39)}</g>`;
}

function decisionNode(id, cx, cy, lines, state) {
  const points = `${cx},${cy - 55} ${cx + 72},${cy} ${cx},${cy + 55} ${cx - 72},${cy}`;
  return `<g class="graph-node decision ${state}" data-node="${id}"><polygon points="${points}"/>${graphText(lines, cx, cy + 4)}</g>`;
}

function renderGraph(item) {
  const mainEdge = (stepIndex) => graphState(item, stepIndex) === "done" ? "done" : "pending";
  const waiting = item.applies && item.health === "waiting" && item.progress <= 1;
  const dataBlocked = Boolean(item.incident) && item.progress <= 3;
  const boardBlocked = Boolean(item.incident) && item.progress >= 6;
  const nodes = [
    rectNode("inicio", 12, 265, ["Inicio"], item.applies ? "done" : "current"),
    decisionNode("aplica", 185, 300, ["¿Aplica este", "mes?"], item.applies ? "done" : "current"),
    rectNode("solicitud", 280, 265, ["Enviar", "solicitud"], graphState(item, 0)),
    decisionNode("recibida", 505, 300, ["¿Base", "recibida?"], graphState(item, 1)),
    rectNode("procesamiento", 600, 265, ["Procesar", "datos"], graphState(item, 2)),
    decisionNode("validacion", 825, 300, ["¿Validación", "aprobada?"], graphState(item, 3)),
    decisionNode("drive", 990, 300, ["¿Requiere", "Drive?"], graphState(item, 4)),
    decisionNode("lago", 1155, 300, ["¿Requiere", "lago?"], graphState(item, 5)),
    rectNode("tablero", 1250, 265, ["Actualizar", "tablero"], graphState(item, 6)),
    decisionNode("revision-final", 1475, 300, ["¿Revisión final", "aprobada?"], graphState(item, 7)),
    rectNode("terminada", 1570, 265, ["Terminada"], graphState(item, 8)),
    rectNode("no-aplica", 119, 465, ["Registrar", "No aplica"], item.applies ? "branch" : "current"),
    rectNode("recordatorio", 439, 70, ["Recordatorio", "y escalamiento"], waiting ? "waiting" : "branch"),
    rectNode("corregir-datos", 759, 465, ["Corregir o", "devolver datos"], dataBlocked ? "blocked" : "branch"),
    rectNode("subir-drive", 924, 70, ["Subir al", "Drive"], graphState(item, 4)),
    rectNode("cargar-lago", 1089, 465, ["Cargar al", "lago de datos"], graphState(item, 5)),
    rectNode("corregir-tablero", 1409, 70, ["Corregir", "tablero"], boardBlocked ? "blocked" : "branch")
  ].join("");

  return `<div class="graph-legend"><span><i class="done"></i>Completado</span><span><i class="current"></i>Etapa actual</span><span><i class="waiting"></i>Esperando</span><span><i class="blocked"></i>Bloqueado</span></div>
  <svg class="graph-svg" viewBox="0 0 1715 585" role="img" aria-label="Flujo con decisiones y retornos de ${item.name}">
    <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker></defs>
    <g class="edges">
      <path class="${mainEdge(-1)}" d="M144 300H108"/><path class="${mainEdge(0)}" d="M257 300H280"/>
      <path class="${mainEdge(0)}" d="M412 300H433"/><path class="${mainEdge(1)}" d="M577 300H600"/>
      <path class="${mainEdge(2)}" d="M732 300H753"/><path class="${mainEdge(3)}" d="M897 300H918"/>
      <path class="${mainEdge(4)}" d="M1062 300H1083"/><path class="${mainEdge(5)}" d="M1227 300H1250"/>
      <path class="${mainEdge(6)}" d="M1382 300H1403"/><path class="${mainEdge(7)}" d="M1547 300H1570"/>
      <path class="branch ${item.applies ? "" : "chosen"}" d="M185 355V465"/>
      <path class="branch ${waiting ? "chosen" : ""}" d="M505 245V140"/><path class="return ${waiting ? "chosen" : ""}" d="M571 105H595V215H505V245"/>
      <path class="branch ${dataBlocked ? "chosen" : ""}" d="M825 355V465"/><path class="return ${dataBlocked ? "chosen" : ""}" d="M759 500H690V335"/>
      <path class="branch" d="M990 245V140"/><path class="return" d="M1056 105H1155V245"/>
      <path class="branch" d="M1155 355V465"/><path class="return" d="M1221 500H1235V335H1250"/>
      <path class="branch ${boardBlocked ? "chosen" : ""}" d="M1475 245V140"/><path class="return ${boardBlocked ? "chosen" : ""}" d="M1409 105H1360V265"/>
    </g>
    <g class="edge-labels">
      <text x="267" y="287">Sí</text><text x="197" y="408">No</text>
      <text x="584" y="287">Sí</text><text x="518" y="194">No</text>
      <text x="905" y="287">Sí</text><text x="838" y="408">No</text>
      <text x="1069" y="287">No</text><text x="1003" y="194">Sí</text>
      <text x="1233" y="287">No</text><text x="1168" y="408">Sí</text>
      <text x="1554" y="287">Sí</text><text x="1488" y="194">No</text>
    </g>${nodes}
  </svg>`;
}

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

function renderList() {
  const term = $("baseSearch").value.trim().toLowerCase();
  const rows = currentRows().filter((item) => `${item.name} ${item.dashboard}`.toLowerCase().includes(term));
  $("baseCount").textContent = `${currentRows().length} bases`;
  $("baseList").innerHTML = rows.map((item) => {
    const health = deriveHealth(item);
    return `<button class="base-item ${item.name === selectedName ? "active" : ""}" data-name="${item.name}">
      <span class="dot ${health}"></span><span><strong>${item.name}</strong><small>${item.dashboard}</small></span>
      <span class="mini-progress">${item.applies ? `${percent(item)}%` : "N/A"}</span>
    </button>`;
  }).join("");
  document.querySelectorAll(".base-item").forEach((button) => button.addEventListener("click", () => { selectedName = button.dataset.name; render(); }));
}

function renderFlow() {
  const item = selectedBase();
  selectedName = item.name;
  const health = deriveHealth(item);
  $("baseOrganism").textContent = item.organism;
  $("baseTitle").textContent = item.name;
  $("baseMeta").textContent = `${item.dashboard} · Responsable de actualización: ${item.owner}`;
  $("healthBadge").textContent = healthLabel(health);
  $("healthBadge").className = `health-badge ${health}`;
  $("notApplicable").hidden = true;
  $("flowContent").hidden = false;
  $("flowDiagram").innerHTML = renderGraph(item);

  const current = steps[Math.min(item.progress, steps.length - 1)];
  $("currentStage").textContent = !item.applies ? "No aplica en este periodo" : item.progress >= steps.length ? "Actualización cerrada" : current.label;
  $("currentOwner").textContent = item.applies ? item.owner : "Sin asignación";
  $("nextAction").textContent = !item.applies ? "Revisar nuevamente el próximo mes" : item.progress >= steps.length ? "No hay acciones pendientes" : current.action;
  $("advanceButton").disabled = !item.applies || item.progress >= steps.length || Boolean(item.incident);
  $("blockButton").disabled = !item.applies || item.progress >= steps.length || Boolean(item.incident);

  $("incidentCard").className = `incident-card ${item.incident ? "blocked" : ""}`;
  $("incidentTitle").textContent = item.incident ? item.incident.reason : "Sin bloqueos reportados";
  $("incidentText").textContent = item.incident ? `Debe resolver: ${item.incident.owner}` : "La actualización puede continuar según el flujo previsto.";
  $("clearBlockButton").hidden = !item.incident;
}

function render() { renderSummary(); renderList(); renderFlow(); }

Object.entries(periodLabels).forEach(([value, label]) => $("periodSelect").insertAdjacentHTML("beforeend", `<option value="${value}">${label}</option>`));
$("periodSelect").value = selectedPeriod;
$("periodSelect").addEventListener("change", (event) => { selectedPeriod = event.target.value; selectedName = currentRows()[0].name; render(); });
$("baseSearch").addEventListener("input", renderList);
$("advanceButton").addEventListener("click", () => { const item = selectedBase(); item.progress = Math.min(steps.length, item.progress + 1); item.health = item.progress >= steps.length ? "done" : "active"; saveData(); render(); });
$("blockButton").addEventListener("click", () => $("blockDialog").showModal());
$("saveBlockButton").addEventListener("click", (event) => {
  const reason = $("blockReason").value.trim(); const owner = $("blockOwner").value.trim();
  if (!reason || !owner) { event.preventDefault(); return; }
  selectedBase().incident = { reason, owner }; saveData(); $("blockForm").reset(); render();
});
$("clearBlockButton").addEventListener("click", () => { selectedBase().incident = null; selectedBase().health = "active"; saveData(); render(); });
$("resetButton").addEventListener("click", () => { data = seed(); saveData(); selectedPeriod = "2026-09"; selectedName = "SIMAT"; $("periodSelect").value = selectedPeriod; render(); });

render();
