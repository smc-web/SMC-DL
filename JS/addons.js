document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("addonSearch");
  const addonGrid = document.getElementById("addonGrid");
  const categoryButtons =
    document.querySelectorAll("[data-category]");

  let addons = [];
  let currentCategory = "all";


  // =========================
  // LOAD ADDONS
  // =========================

  async function loadAddons() {
    try {

      /*
       * Untuk sekarang data addon kosong.
       * Nanti bagian ini akan diganti
       * dengan database/API SMC DL.
       */

      addons = [];

      renderAddons();

    } catch (error) {

      console.error(
        "Gagal memuat addon:",
        error
      );

      showEmpty(
        "Gagal memuat data addon."
      );
    }
  }


  // =========================
  // RENDER ADDONS
  // =========================

  function renderAddons() {

    if (!addonGrid) return;

    const search =
      searchInput
        ? searchInput.value
            .trim()
            .toLowerCase()
        : "";

    const filtered = addons.filter((addon) => {

      const matchesSearch =
        !search ||
        addon.name
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        currentCategory === "all" ||
        addon.category === currentCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });


    if (filtered.length === 0) {

      showEmpty(
        addons.length === 0
          ? "Belum ada addon tersedia."
          : "Addon tidak ditemukan."
      );

      return;
    }


    addonGrid.innerHTML = "";

    filtered.forEach((addon) => {

      addonGrid.appendChild(
        createAddonCard(addon)
      );

    });
  }


  // =========================
  // ADDON CARD
  // =========================

  function createAddonCard(addon) {

    const card =
      document.createElement("article");

    card.className = "addon-card";


    const image =
      document.createElement("img");

    image.className = "addon-image";

    image.src = addon.image || "";
    image.alt = addon.name;

    image.loading = "lazy";


    const content =
      document.createElement("div");

    content.className = "addon-content";


    const title =
      document.createElement("h3");

    title.className = "addon-title";

    title.textContent =
      addon.name;


    const category =
      document.createElement("span");

    category.className = "addon-category";

    category.textContent =
      addon.category || "Addon";


    const description =
      document.createElement("p");

    description.className =
      "addon-description";

    description.textContent =
      addon.description || "";


    const favorite =
      document.createElement("button");

    favorite.className =
      "favorite-button";

    favorite.type = "button";

    favorite.setAttribute(
      "aria-label",
      "Tambah ke favorit"
    );

    favorite.textContent = "♡";


    favorite.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        toggleFavorite(
          addon.id,
          favorite
        );
      }
    );


    content.appendChild(title);
    content.appendChild(category);
    content.appendChild(description);

    card.appendChild(image);
    card.appendChild(content);
    card.appendChild(favorite);


    card.addEventListener(
      "click",
      () => {

        if (!addon.id) return;

        window.location.href =
          `download.html?id=${encodeURIComponent(addon.id)}`;
      }
    );


    return card;
  }


  // =========================
  // EMPTY STATE
  // =========================

  function showEmpty(message) {

    if (!addonGrid) return;

    addonGrid.innerHTML = `
      <div class="empty-addon">
        <div class="empty-icon">
          ⛏
        </div>

        <h3>
          ${escapeHTML(message)}
        </h3>

        <p>
          Addon baru akan muncul di sini
          setelah ditambahkan.
        </p>
      </div>
    `;
  }


  // =========================
  // SEARCH
  // =========================

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {
        renderAddons();
      }
    );
  }


  // =========================
  // CATEGORY
  // =========================

  categoryButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        categoryButtons.forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        currentCategory =
          button.dataset.category || "all";

        renderAddons();
      }
    );
  });


  // =========================
  // FAVORITE
  // =========================

  function getFavorites() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "smc_dl_favorites"
        )
      ) || [];

    } catch {

      return [];
    }
  }


  function saveFavorites(favorites) {

    localStorage.setItem(
      "smc_dl_favorites",
      JSON.stringify(favorites)
    );
  }


  function toggleFavorite(
    addonId,
    button
  ) {

    const favorites =
      getFavorites();

    const index =
      favorites.indexOf(addonId);


    if (index === -1) {

      favorites.push(addonId);

      button.textContent = "♥";

      button.classList.add(
        "active"
      );

    } else {

      favorites.splice(index, 1);

      button.textContent = "♡";

      button.classList.remove(
        "active"
      );
    }


    saveFavorites(favorites);
  }


  // =========================
  // ESCAPE HTML
  // =========================

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  // =========================
  // START
  // =========================

  loadAddons();

});
