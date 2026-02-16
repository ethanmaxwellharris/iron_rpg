const byId = (id) => document.getElementById(id);

const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

const titleCase = (raw) =>
  raw
    .replaceAll("_", " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const MILESTONE_LADDER = {
  squat: [335, 365, 405, 455, 500],
  bench: [185, 200, 225, 245, 275, 315],
  deadlift: [405, 455, 500, 545, 600],
  total: [900, 1000, 1100, 1200, 1300],
};

const HISTORICAL_TIMELINES = {
  squat: [
    { lift: 250, era: "1940s", figure: "John Davis", note: "early elite post-war standard" },
    { lift: 300, era: "1950s", figure: "Doug Hepburn", note: "strength-era benchmark" },
    { lift: 350, era: "1960s", figure: "Reg Park", note: "iconic old-school threshold" },
    { lift: 400, era: "1970s", figure: "Franco Columbu", note: "classic power crossover" },
    { lift: 500, era: "1980s", figure: "Ed Coan", note: "all-time power milestone" },
  ],
  bench: [
    { lift: 150, era: "1940s", figure: "John Davis", note: "early international standard" },
    { lift: 185, era: "1950s", figure: "Reg Park", note: "strongman-era benchmark" },
    { lift: 225, era: "1970s", figure: "Arnold", note: "classic two-plate milestone" },
    { lift: 275, era: "1980s", figure: "Coan-era lifters", note: "serious advanced marker" },
    { lift: 315, era: "Modern", figure: "Open-class standard", note: "three-plate prestige" },
  ],
  deadlift: [
    { lift: 300, era: "1950s", figure: "Doug Hepburn", note: "vintage strength target" },
    { lift: 400, era: "1960s", figure: "Reg Park lineage", note: "hard threshold of power" },
    { lift: 500, era: "1980s", figure: "Ed Coan", note: "hallmark elite jump" },
    { lift: 600, era: "1990s", figure: "Kirk Karwoski era", note: "serious competitive tier" },
    { lift: 700, era: "Modern", figure: "High-level open", note: "mythic territory" },
  ],
  total: [
    { lift: 700, era: "1960s", figure: "Hepburn-style totals", note: "old-school strength class" },
    { lift: 900, era: "1970s", figure: "regional elite", note: "major all-around milestone" },
    { lift: 1100, era: "1980s", figure: "Coan-era benchmark", note: "competitive platform standard" },
    { lift: 1300, era: "1990s", figure: "national contender", note: "advanced meet total" },
    { lift: 1500, era: "Modern", figure: "high-level open", note: "upper competitive tier" },
  ],
};

const nextMilestones = (current, ladder, count = 3) => ladder.filter((mark) => mark > current).slice(0, count);

const renderMilestone = (label, current, key) => {
  const milestones = nextMilestones(current, MILESTONE_LADDER[key]);

  if (!milestones.length) {
    return `
      <div class="milestone">
        <h3>${label}</h3>
        <p>Current: <b>${current} lb</b></p>
        <p class="muted">You cleared the current ladder. Time to define your next tier.</p>
      </div>
    `;
  }

  return `
    <div class="milestone">
      <h3>${label}</h3>
      <p>Current: <b>${current} lb</b></p>
      <ul>
        ${milestones
          .map((mark) => `<li><b>${mark} lb</b> <span class="muted">(${mark - current} lb to go)</span></li>`)
          .join("")}
      </ul>
    </div>
  `;
};

const timelineRows = (timeline, current) => {
  const rows = timeline.map((entry) => {
    const status = entry.lift <= current ? "achieved" : "upcoming";
    const delta = entry.lift - current;

    return `
      <div class="timeline-row ${status}">
        <div>
          <b>${entry.lift} lb</b>
          <span class="muted"> · ${entry.era}</span>
        </div>
        <div>${entry.figure}</div>
        <div class="muted">${entry.note}</div>
        <div>${delta <= 0 ? "✅ Cleared" : `${delta} lb to go`}</div>
      </div>
    `;
  });

  return rows.join("");
};

const initTimelineTabs = () => {
  const buttons = Array.from(document.querySelectorAll("[data-timeline-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-timeline-panel]"));

  const activate = (target) => {
    buttons.forEach((button) => {
      const active = button.dataset.timelineTab === target;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel) => {
      const active = panel.dataset.timelinePanel === target;
      panel.hidden = !active;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => activate(button.dataset.timelineTab));
  });

  if (buttons.length) {
    activate(buttons[0].dataset.timelineTab);
  }
};

const renderTimeline = (lifts) => {
  const tabs = [
    { key: "squat", label: "Squat", current: lifts.squat_lb },
    { key: "bench", label: "Bench", current: lifts.bench_lb },
    { key: "deadlift", label: "Deadlift", current: lifts.deadlift_lb },
    { key: "total", label: "Total", current: lifts.total_lb },
  ];

  byId("timeline").innerHTML = `
    <h2>Historical Milestone Timeline</h2>
    <p class="muted">Here you are on the timeline: compare your current numbers to iconic era markers.</p>
    <div class="timeline-tabs" role="tablist" aria-label="Historical timeline views">
      ${tabs
        .map(
          (tab) =>
            `<button class="tab-btn" type="button" role="tab" data-timeline-tab="${tab.key}" aria-selected="false">${tab.label}</button>`
        )
        .join("")}
    </div>
    ${tabs
      .map(
        (tab) => `
          <section class="timeline-panel" data-timeline-panel="${tab.key}" role="tabpanel" hidden>
            <p><b>Current ${tab.label}:</b> ${tab.current} lb</p>
            <div class="timeline-grid">
              ${timelineRows(HISTORICAL_TIMELINES[tab.key], tab.current)}
            </div>
          </section>
        `
      )
      .join("")}
  `;

  initTimelineTabs();
};

const render = (data) => {
  byId("universe").textContent = data.universe;
  byId("app-name").textContent = data.bookmark.app_idea.name;
  byId("app-description").textContent = data.bookmark.app_idea.description;

  byId("character").innerHTML = `
    <h2>${data.character.name} — ${data.character.title}</h2>
    <p><b>Class:</b> ${data.character.class} (${data.character.subclass})</p>
    <p><b>Alignment:</b> ${data.character.alignment}</p>
    <p><b>Archetype:</b> ${data.character.archetype}</p>
    <p><b>Domain:</b> ${data.character.domain}</p>
    <div>${data.character.themes.map((theme) => `<span class="badge">${theme}</span>`).join("")}</div>
    <p class="quote">“${data.backstory.canonical_quote}”</p>
  `;

  byId("stats").innerHTML = `
    <h2>Core Attributes</h2>
    <div class="grid-two">
      ${Object.entries(data.stats)
        .filter(([k]) => k !== "derived")
        .map(([k, v]) => `<div class="stat">${titleCase(k)}: <b>${v}</b></div>`)
        .join("")}
      ${Object.entries(data.stats.derived)
        .map(([k, v]) => `<div class="stat">${titleCase(k)}: <b>${v}</b></div>`)
        .join("")}
    </div>
  `;

  byId("lifts").innerHTML = `
    <h2>Real-World Lifts</h2>
    <ul>
      <li>Squat: <b>${data.real_world_lifts.squat_lb} lb</b></li>
      <li>Bench: <b>${data.real_world_lifts.bench_lb} lb</b></li>
      <li>Deadlift: <b>${data.real_world_lifts.deadlift_lb} lb</b></li>
      <li>Total: <b>${data.real_world_lifts.total_lb} lb</b></li>
    </ul>
    <p><b>Historical Match:</b> ${data.real_world_lifts.historical_match}</p>
  `;

  byId("milestones").innerHTML = `
    <h2>Next Milestones</h2>
    <p class="muted">Suggested targets based on your current lifts.</p>
    <div class="milestone-grid">
      ${renderMilestone("Squat", data.real_world_lifts.squat_lb, "squat")}
      ${renderMilestone("Bench", data.real_world_lifts.bench_lb, "bench")}
      ${renderMilestone("Deadlift", data.real_world_lifts.deadlift_lb, "deadlift")}
      ${renderMilestone("Total", data.real_world_lifts.total_lb, "total")}
    </div>
  `;

  byId("signature").innerHTML = `
    <h2>Signature Ability</h2>
    <p><b>${data.abilities.signature.name}</b></p>
    <p>${data.abilities.signature.effect}</p>
    <p><b>Cooldown:</b> ${data.abilities.signature.cooldown}</p>
    <h3>Actives</h3>
    ${list(data.abilities.actives)}
  `;

  byId("passives").innerHTML = `
    <h2>Passives</h2>
    ${list(data.passives)}
  `;

  byId("artifacts").innerHTML = `
    <h2>Artifacts & Equipment</h2>
    <ul>
      ${data.equipment.artifacts
        .map(
          (artifact) => `
          <li>
            <b>${artifact.name}</b> — ${artifact.rarity}
            ${list(artifact.effects)}
          </li>`
        )
        .join("")}
    </ul>
  `;

  const arcs = Object.values(data.questline).map((arc) => {
    const bosses = arc.bosses ?? [arc.boss ?? arc.final_boss];
    return `<li><b>${arc.name}</b> — ${arc.focus}${list(bosses)}</li>`;
  });

  byId("questline").innerHTML = `
    <h2>Questline</h2>
    <ol>${arcs.join("")}</ol>
  `;

  byId("progression").innerHTML = `
    <h2>Progression</h2>
    <p><b>Ascension Titles</b></p>
    ${list(data.progression.ascension_titles)}
    <p><b>Lineage Path</b></p>
    ${list(data.progression.lineage_path)}
  `;

  renderTimeline(data.real_world_lifts);

  byId("future-features").innerHTML = `
    <h2>App Roadmap</h2>
    <p><b>Core Modes</b></p>
    ${list(data.bookmark.app_idea.core_modes)}
    <p><b>Future Features</b></p>
    ${list(data.bookmark.app_idea.future_features)}
  `;

  byId("epilogue").innerHTML = `
    <h2>${data.epilogue.title}</h2>
    <p>${data.backstory.summary}</p>
    <p class="quote">${data.epilogue.prophecy}</p>
  `;
};

fetch("./data/ethan_profile.json")
  .then((res) => res.json())
  .then(render)
  .catch((err) => {
    byId("app-description").textContent = "Unable to load character data.";
    console.error("Failed to load payload", err);
  });
