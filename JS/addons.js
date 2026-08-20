const SUPABASE_URL =
  "https://rtwljeoxxhlfortcputj.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_stZa8kHgp-sokGGLRQIfrA_dM9ec8x-";


document.addEventListener("DOMContentLoaded", () => {

  const searchInput =
    document.getElementById("addonSearch");

  const addonGrid =
    document.getElementById("addonGrid");

  const addonCount =
    document.getElementById("addonCount");

  const emptyState =
    document.getElementById("emptyState");

  const noResult =
    document.getElementById("noResult");

  const categoryButtons =
    document.querySelectorAll(
      "[data-category]"
    );


  let addons = [];

  let currentCategory = "all";


  // =====================================================
  // LOAD ADDONS FROM SUPABASE
  // =====================================================

  async function loadAddons() {

    if (!addonGrid) return;

    try {

      addonGrid.innerHTML = `
        <div class="loading-addon">
          Memuat addon...
        </div>
      `;

      if (emptyState) {
        emptyState.style.display = "none";
      }

      if (noResult) {
        noResult.style.display = "none";
      }


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


      updateCount(addons.length);

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


      updateCount(0);
    }
  }


  // =====================================================
  // RENDER ADDONS
  // =====================================================

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


    // =========================================
    // UPDATE COUNT
    // =========================================

    updateCount(filtered.length);


    // =========================================
    // EMPTY STATE
    // =========================================

    if (filtered.length === 0) {

      addonGrid.innerHTML = "";


      if (addons.length === 0) {

        if (emptyState) {
          emptyState.style.display = "flex";
        }

        if (noResult) {
          noResult.style.display = "none";
        }

      } else {

        if (emptyState) {
          emptyState.style.display = "none";
        }

        if (noResult) {
          noResult.style.display = "flex";
        }
      }

      return;
    }


    // =========================================
    // HIDE EMPTY STATE
    // =========================================

    if (emptyState) {
      emptyState.style.display = "none";
    }

    if (noResult) {
      noResult.style.display = "none";
    }


    // =========================================
    // CREATE CARDS
    // =========================================

    addonGrid.innerHTML = "";


    filtered.forEach((addon) => {

      const card =
        createAddonCard(addon);

      addonGrid.appendChild(card);

    });
  }


  // =====================================================
  // CREATE ADDON CARD
  // =====================================================

  function createAddonCard(addon) {

    const card =
      document.createElement("article");

    card.className =
      "addon-card";


    // =========================================
    // THUMBNAIL
    // =========================================

    const thumbnail =
      document.createElement("div");

    thumbnail.className =
      "addon-thumbnail";


    const image =
      document.createElement("img");

    image.src =
      addon.image_url || "";

    image.alt =
      addon.name || "Addon";

    image.loading =
      "lazy";


    thumbnail.appendChild(image);


    // =========================================
    // CATEGORY
    // =========================================

    const category =
      document.createElement("span");

    category.className =
      "addon-category";

    category.textContent =
      addon.category || "Addon";


    thumbnail.appendChild(category);


    // =========================================
    // CARD INFO
    // =========================================

    const info =
      document.createElement("div");

    info.className =
      "addon-info";


    // =========================================
    // TITLE
    // =========================================

    const title =
      document.createElement("h3");

    title.className =
      "addon-title";

    title.textContent =
      addon.name || "Untitled";


    // =========================================
    // DESCRIPTION
    // =========================================

    const description =
      document.createElement("p");

    description.className =
      "addon-description";

    description.textContent =
      addon.description || "";


    // =========================================
    // META
    // =========================================

    const meta =
      document.createElement("div");

    meta.className =
      "addon-meta";


    const metaLeft =
      document.createElement("span");

    metaLeft.textContent =
      "Minecraft";


    const rating =
      document.createElement("span");

    rating.className =
      "addon-rating";


    if (
      addon.rating !== undefined &&
      addon.rating !== null &&
      addon.rating !== ""
    ) {

      rating.textContent =
        `★ ${addon.rating}`;

    } else {

      rating.textContent =
        "★ —";
    }


    meta.appendChild(metaLeft);
    meta.appendChild(rating);


    // =========================================
    // ACTIONS
    // =========================================

    const actions =
      document.createElement("div");

    actions.className =
      "addon-actions";


    // DOWNLOAD BUTTON

    const downloadButton =
      document.createElement("button");

    downloadButton.type =
      "button";

    downloadButton.className =
      "download-button";

    downloadButton.textContent =
      "DOWNLOAD";


    downloadButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();


        if (!addon.id) return;


        window.location.href =
          `download.html?id=${encodeURIComponent(
            addon.id
          )}`;
      }
    );


    // FAVORITE BUTTON

    const favoriteButton =
      document.createElement("button");

    favoriteButton.type =
      "button";

    favoriteButton.className =
      "favorite-button";


    updateFavoriteButton(
      favoriteButton,
      addon.id
    );


    favoriteButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();


        toggleFavorite(
          addon.id,
          favoriteButton
        );
      }
    );


    actions.appendChild(
      downloadButton
    );

    actions.appendChild(
      favoriteButton
    );


    // =========================================
    // BUILD INFO
    // =========================================

    info.appendChild(title);

    info.appendChild(description);

    info.appendChild(meta);

    info.appendChild(actions);


    // =========================================
    // BUILD CARD
    // =========================================

    card.appendChild(thumbnail);

    card.appendChild(info);


    // =========================================
    // CARD CLICK
    // =========================================

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


  // =====================================================
  // UPDATE COUNT
  // =====================================================

  function updateCount(count) {

    if (!addonCount) return;


    addonCount.textContent =
      `${count} addon${count === 1 ? "" : ""}`;
  }


  // =====================================================
  // SEARCH
  // =====================================================

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {

        renderAddons();

      }
    );
  }


  // =====================================================
  // SEARCH FORM
  // =====================================================

  const searchForm =
    document.getElementById(
      "addonSearchForm"
    );


  if (searchForm) {

    searchForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        renderAddons();

      }
    );
  }


  // =====================================================
  // CATEGORY FILTER
  // =====================================================

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


  // =====================================================
  // FAVORITES
  // =====================================================

  function getFavorites() {

    try {

      const data =
        JSON.parse(
          localStorage.getItem(
            "smc_dl_favorites"
          )
        );


      return Array.isArray(data)
        ? data
        : [];


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


  function updateFavoriteButton(
    button,
    id
  ) {

    if (isFavorite(id)) {

      button.textContent =
        "♥";

      button.classList.add(
        "active"
      );

    } else {

      button.textContent =
        "♡";

      button.classList.remove(
        "active"
      );
    }
  }


  function toggleFavorite(
    id,
    button
  ) {

    if (!id) return;


    const favorites =
      getFavorites();


    const index =
      favorites.indexOf(id);


    if (index === -1) {

      favorites.push(id);

    } else {

      favorites.splice(
        index,
        1
      );
    }


    saveFavorites(
      favorites
    );


    updateFavoriteButton(
      button,
      id
    );
  }


  // =====================================================
  // START
  // =====================================================

  loadAddons();

});
