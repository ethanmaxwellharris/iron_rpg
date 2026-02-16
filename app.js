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
