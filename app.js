/**
 * ТУТ ТЫ МЕНЯЕШЬ ВСЁ ПОД СЕБЯ:
 * title: название проекта
 * cover: ссылка на картинку (локально ./assets/xxx.jpg или URL)
 * description: описание (можно много строк)
 * repo: ссылка на репозиторий
 * tags: массив маленьких тэгов
 */
const PROJECTS = [
  {
    id: "p1",
    title: "Проект №1",
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    description:
      "Здесь будет описание проекта №1.\n\nКоротко: что делает, стек, фичи, результаты.",
    repo: "https://github.com/USERNAME/REPO1",
    tags: ["Python", "DL"]
  },
  {
    id: "p2",
    title: "Проект №2",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Описание проекта №2.\n\nЧто именно ты сделал(а), чем гордишься, что дальше.",
    repo: "https://github.com/USERNAME/REPO2",
    tags: ["C++", "Algorithms"]
  },
  {
    id: "p3",
    title: "Проект №3",
    cover: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=1200&q=80",
    description:
      "Описание проекта №3.\n\nМожно вставлять списки:\n- пункт 1\n- пункт 2",
    repo: "https://github.com/USERNAME/REPO3",
    tags: ["Telegram", "Bot"]
  },
  {
    id: "p4",
    title: "Проект №4",
    cover: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80",
    description:
      "Описание проекта №4.\n\nНапиши, для кого это и какую боль решает.",
    repo: "https://github.com/USERNAME/REPO4",
    tags: ["Web", "Frontend"]
  },
  {
    id: "p5",
    title: "Проект №5",
    cover: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1200&q=80",
    description:
      "Описание проекта №5.\n\nДобавь метрики/результаты, если есть.",
    repo: "https://github.com/USERNAME/REPO5",
    tags: ["Other"]
  },
];

const $ = (sel) => document.querySelector(sel);

const grid = $("#grid");
const empty = $("#empty");
const search = $("#search");

const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");
const modalImg = $("#modalImg");
const modalLink = $("#modalLink");
const modalTags = $("#modalTags");

$("#year").textContent = new Date().getFullYear();

function makeTag(text){
  const el = document.createElement("span");
  el.className = "tag";
  el.textContent = text;
  return el;
}

function cardTemplate(p){
  const card = document.createElement("article");
  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Открыть: ${p.title}`);

  card.innerHTML = `
    <div class="card__media">
      <img class="card__img" src="${escapeAttr(p.cover)}" alt="${escapeAttr(p.title)}" loading="lazy"/>
      <div class="card__overlay" aria-hidden="true"></div>
    </div>
    <div class="card__body">
      <div>
        <div class="card__title">${escapeHtml(p.title)}</div>
        <div class="card__hint">Нажми, чтобы открыть описание</div>
      </div>
      <div class="pill">Открыть</div>
    </div>
  `;

  card.addEventListener("click", () => openModal(p));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(p);
    }
  });

  return card;
}

function render(list){
  grid.innerHTML = "";
  list.forEach(p => grid.appendChild(cardTemplate(p)));
  empty.classList.toggle("hidden", list.length !== 0);
}

function openModal(p){
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.description || "";
  modalImg.src = p.cover || "";
  modalImg.alt = p.title;

  modalTags.innerHTML = "";
  (p.tags || []).forEach(t => modalTags.appendChild(makeTag(t)));

  if (p.repo && p.repo.trim().length > 0){
    modalLink.href = p.repo;
    modalLink.setAttribute("aria-disabled", "false");
  } else {
    modalLink.href = "#";
    modalLink.setAttribute("aria-disabled", "true");
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // фокус на крестик
  const closeBtn = modal.querySelector("[data-close]");
  closeBtn && closeBtn.focus();
}

function closeModal(){
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (e) => {
  const target = e.target;
  if (target && target.closest && target.closest("[data-close]")) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

search.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();
  if (!q) return render(PROJECTS);

  const filtered = PROJECTS.filter(p => {
    const hay = [
      p.title || "",
      p.description || "",
      ...(p.tags || [])
    ].join(" ").toLowerCase();
    return hay.includes(q);
  });

  render(filtered);
});

function escapeHtml(s){
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s){
  return escapeHtml(s).replaceAll("\n", " ");
}

render(PROJECTS);
