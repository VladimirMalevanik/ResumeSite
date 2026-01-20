
const PROJECTS = [
  {
    id: "p1",
    title: "Image Processor",
    cover: "https://cms.interestingengineering.com/wp-content/uploads/2024/03/Image-of-Lena-Forsen-used-in-many-image-processing-experiments.jpg",
    description:
      "Это мой первый проект в целом, его я писал в марте 2025 года на курсе по С++. Задача была реализовать консольное приложение, позволяющее применять к изображениям различные фильтры, аналогичные фильтрам в популярных графических редакторах.",
    repo: "https://github.com/VladimirMalevanik/image_processor",
    tags: ["C++"]
  },
  {
    id: "p2",
    title: "Pokoroche bot",
    cover: "https://avatars.mds.yandex.net/i?id=7ecc82a4b50efe34912b71ed2d165ed5_l-8744112-images-thumbs&n=13",
    description:
      "Первый серьезный и к тому же коллективный проект, написанный в ноябре 2025 в нем я отвечал за написание БД и тестирования. Задача была создать бота, который, будучи добавленным в групповой чат, анализирует сообщения, фильтрует информационный шум и предоставляет пользователям краткую ежедневную сводку по действительно важным упоминаниям и темам.",
    repo: "https://github.com/nikepf/Pokoroche_bot",
    tags: ["Python", "tg_bot", "ML"]
  },
  {
    id: "p3",
    title: "AntiSpoof",
    cover: "https://avatars.mds.yandex.net/i?id=bd9d80434b2aa85e8f2d90f9e1e7d91e8780660a-10153545-images-thumbs&n=13",
    description:
      "Это моя собственноручно написанная модель. Ее я написал на практике по глубинному обучению в июле 2025. Цель была обучить модельку, которая убирала лишние шумы из звуковой дорожки.",
    repo: "https://github.com/VladimirMalevanik/anti_spoof",
    tags: ["Python", "DL"]
  },
  {
    id: "p4",
    title: "Petly Startapp",
    cover: "https://static.vecteezy.com/system/resources/previews/007/456/149/non_2x/two-funny-cartoon-dogs-comic-animal-characters-vector.jpg",
    description:
      "Данный сайт являлся MVP для нашего студенческого стартапа про умные ошейники. Навайбкодил его в сентябре 2025",
    repo: "https://github.com/VladimirMalevanik/petly-site",
    tags: ["Web", "Frontend"]
  },
  {
    id: "p5",
    title: "Умная табличка для дисциплины",
    cover: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1200&q=80",
    description:
      "Ладно, не такая уж она и умная. Написал этого бота, чтобы он помогал людям избавляться от вредных привычек и приобретать полезные, путем улучшения на 1%. Бот выдает табличку как для печати так и excel, за скромную подписку на мой тг канал.",
    repo: "https://github.com/VladimirMalevanik/schedule",
    tags: ["Python", "tg_bot"]
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
