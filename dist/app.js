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
  $("notApplicable").hidden = item.applies;
  $("flowContent").hidden = !item.applies;
  if (!item.applies) return;

  $("flowDiagram").innerHTML = steps.map((step, index) => {
    const state = index < item.progress ? "done" : index === item.progress ? (item.incident ? "blocked" : "current") : "pending";
    const connector = index < steps.length - 1 ? `<span class="connector ${index < item.progress ? "done" : ""}"></span>` : "";
    return `<div class="step-wrap"><article class="step ${state}"><span class="step-number">${state === "done" ? "✓" : index + 1}</span><strong>${step.label}</strong><small>${index < item.progress ? "Completada" : index === item.progress ? item.owner : "Pendiente"}</small></article>${connector}</div>`;
  }).join("");

  const current = steps[Math.min(item.progress, steps.length - 1)];
  $("currentStage").textContent = item.progress >= steps.length ? "Actualización cerrada" : current.label;
  $("currentOwner").textContent = item.owner;
  $("nextAction").textContent = item.progress >= steps.length ? "No hay acciones pendientes" : current.action;
  $("advanceButton").disabled = item.progress >= steps.length || Boolean(item.incident);
  $("blockButton").disabled = item.progress >= steps.length || Boolean(item.incident);

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
