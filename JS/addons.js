const SUPABASE_URL =
  "https://rtwljeoxxhlfortcputj.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_stZa8kHgp-sokGGLRQIfrA_dM9ec8x-";


document.addEventListener("DOMContentLoaded", () => {

  const searchInput =
    document.getElementById("addonSearch");

  const addonGrid =
    document.getElementById("addonGrid");

  const categoryButtons =
    document.querySelectorAll(
      "[data-category]"
    );


  let addons = [];

  let currentCategory = "all";


  // =========================
  // LOAD FROM SUPABASE
  // =========================

  async function loadAddons() {

    if (!addonGrid) return;

    try {

      addonGrid.innerHTML = `
        <div class="loading-addon">
          Memuat addon...
        </div>
      `;


      const response =
        await fetch(
          `${SUPABASE_URL}/rest/v1/addons?select=*&order=created_at.desc`,
          {
            method: "GET",

            headers: {
              "apikey": SUPABASE_KEY,

              "Authorization":
                `Bearer ${SUPABASE_KEY}`,

              "Content-Type":
                "application/json"
            }
          }
        );


      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          `Supabase ${response.status}: ${errorText}`
        );
      }


      addons =
        await response.json();


      renderAddons();


    } catch (error) {

      console.error(
        "Gagal mengambil addon:",
        error
      );


      addonGrid.innerHTML = `
        <div class="empty-addon">

          <div class="empty-icon">
            ⚠️
          </div>

          <h3>
            Gagal memuat addon
          </h3>

          <p>
            Periksa koneksi Supabase
            atau konfigurasi API.
          </p>

        </div>
      `;
    }
  }


  // =========================
  // RENDER
  // =========================

  function renderAddons() {

    if (!addonGrid) return;


    const search =
      searchInput
        ? searchInput.value
            .trim()
            .toLowerCase()
        : "";


    const filtered =
      addons.filter((addon) => {

        const name =
          String(addon.name || "")
            .toLowerCase();

        const description =
          String(addon.description || "")
            .toLowerCase();

        const category =
          String(addon.category || "")
            .toLowerCase();


        const matchesSearch =
          !search ||
          name.includes(search) ||
          description.includes(search) ||
          category.includes(search);


        const matchesCategory =
          currentCategory === "all" ||
          category ===
            currentCategory.toLowerCase();


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
  // CREATE CARD
  // =========================

  function createAddonCard(addon) {

    const card =
      document.createElement("article");

    card.className =
      "addon-card";


    const image =
      document.createElement("img");

    image.className =
      "addon-image";

    image.src =
      addon.image_url || "";

    image.alt =
      addon.name || "Addon";

    image.loading =
      "lazy";


    const content =
      document.createElement("div");

    content.className =
      "addon-content";


    const title =
      document.createElement("h3");

    title.className =
      "addon-title";

    title.textContent =
      addon.name || "Untitled";


    const category =
      document.createElement("span");

    category.className =
      "addon-category";

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

    favorite.type =
      "button";

    favorite.className =
      "favorite-button";

    favorite.textContent =
      isFavorite(addon.id)
        ? "♥"
        : "♡";


    if (isFavorite(addon.id)) {

      favorite.classList.add(
        "active"
      );
    }


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
          `download.html?id=${encodeURIComponent(
            addon.id
          )}`;
      }
    );


    return card;
  }


  // =========================
  // EMPTY
  // =========================

  function showEmpty(message) {

    addonGrid.innerHTML = `

      <div class="empty-addon">

        <div class="empty-icon">
          ⛏️
        </div>

        <h3>
          ${escapeHTML(message)}
        </h3>

        <p>
          Addon yang tersedia akan
          muncul di sini.
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
      renderAddons
    );
  }


  // =========================
  // CATEGORY
  // =========================

  categoryButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          categoryButtons.forEach(
            (item) => {

              item.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          currentCategory =
            button.dataset.category ||
            "all";


          renderAddons();
        }
      );

    }
  );


  // =========================
  // FAVORITES
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


  function saveFavorites(
    favorites
  ) {

    localStorage.setItem(
      "smc_dl_favorites",
      JSON.stringify(
        favorites
      )
    );
  }


  function isFavorite(id) {

    return getFavorites()
      .includes(id);
  }


  function toggleFavorite(
    id,
    button
  ) {

    const favorites =
      getFavorites();


    const index =
      favorites.indexOf(id);


    if (index === -1) {

      favorites.push(id);

      button.textContent =
        "♥";

      button.classList.add(
        "active"
      );

    } else {

      favorites.splice(
        index,
        1
      );

      button.textContent =
        "♡";

      button.classList.remove(
        "active"
      );
    }


    saveFavorites(
      favorites
    );
  }


  // =========================
  // ESCAPE HTML
  // =========================

  function escapeHTML(
    value
  ) {

    return String(value)
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      );
  }


  // =========================
  // START
  // =========================

  loadAddons();

});
