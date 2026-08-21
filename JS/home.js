/* =========================================================
   SMC DL
   HOME.JS
   Supabase Homepage
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL = "https://rtwljeoxxhlfortcputj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_stZa8kHgp-sokGGLRQIfrA_dM9ec8x-";



const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


/* =========================================================
   DOM
========================================================= */

const recommendedAddons =
  document.getElementById(
    "recommendedAddons"
  );

const latestAddons =
  document.getElementById(
    "latestAddons"
  );

const popularAddons =
  document.getElementById(
    "popularAddons"
  );

const searchForm =
  document.getElementById(
    "searchForm"
  );

const searchInput =
  document.getElementById(
    "searchInput"
  );


/* =========================================================
   CONFIG
========================================================= */

const MAX_HOME_ITEMS = 6;


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function formatDownloads(value) {

  const number =
    Number(value) || 0;

  if (number >= 1000000) {

    return (
      (number / 1000000)
        .toFixed(1) +
      "M"
    );
  }

  if (number >= 1000) {

    return (
      (number / 1000)
        .toFixed(1) +
      "K"
    );
  }

  return number.toString();
}


function formatFileSize(value) {

  if (!value) {
    return "";
  }

  return String(value);
}


function formatCategory(value) {

  if (!value) {
    return "Minecraft";
  }

  const text =
    String(value);

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
}


/* =========================================================
   ADDON CARD
   ========================================================= */

function createAddonCard(addon) {

  const id =
    encodeURIComponent(
      addon.id
    );


  const slug =
    encodeURIComponent(
      addon.slug || ""
    );


  const name =
    escapeHTML(
      addon.name ||
      "Untitled Addon"
    );


  const description =
    escapeHTML(
      addon.description ||
      "Minecraft addon"
    );


  const image =
    escapeHTML(
      addon.image_url ||
      "assets/icons/grass.webp"
    );


  const category =
    escapeHTML(
      formatCategory(
        addon.category
      )
    );


  const minecraftVersion =
    escapeHTML(
      addon.minecraft_version ||
      ""
    );


  const addonVersion =
    escapeHTML(
      addon.addon_version ||
      ""
    );


  const fileSize =
    escapeHTML(
      formatFileSize(
        addon.file_size
      )
    );


  const downloads =
    formatDownloads(
      addon.download_count
    );


  const author =
    escapeHTML(
      addon.author ||
      ""
    );


  /*
   * Detail URL menggunakan slug.
   * Jika slug kosong, fallback ke ID.
   */

  const detailValue =
    addon.slug
      ? `slug=${slug}`
      : `id=${id}`;


  /* =======================================================
     CARD
  ======================================================= */

  return `
    <article
      class="addon-card"
      data-addon-id="${id}"
      style="
        width: 100%;
        min-width: 0;
        overflow: hidden;
      "
    >

      <a
        href="addon.html?${detailValue}"
        class="addon-card-link"
        style="
          display: block;
          width: 100%;
          min-width: 0;
          text-decoration: none;
          color: inherit;
        "
      >


        <!-- =============================================
             IMAGE
             16:9 seperti addons.html
        ============================================== -->

        <div
          class="addon-image-wrapper"
          style="
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            overflow: hidden;
            background: #030b15;
          "
        >

          <img
            src="${image}"
            alt="${name}"
            class="addon-image"
            loading="lazy"
            style="
              width: 100%;
              height: 100%;
              display: block;
              object-fit: cover;
              object-position: center;
              transition: transform .45s ease,
                          filter .45s ease;
            "
            onerror="
              this.onerror=null;
              this.src='assets/icons/grass.webp';
            "
          >

        </div>


        <!-- =============================================
             CARD CONTENT
        ============================================== -->

        <div
          class="addon-card-content"
          style="
            min-width: 0;
          "
        >


          <!-- CATEGORY -->

          <span class="addon-category">
            ${category}
          </span>


          <!-- TITLE -->

          <h3 class="addon-title">
            ${name}
          </h3>


          <!-- DESCRIPTION -->

          <p class="addon-description">
            ${description}
          </p>


          <!-- META -->

          <div class="addon-meta">

            ${
              minecraftVersion
                ? `
                  <span>
                    MC ${minecraftVersion}
                  </span>
                `
                : ""
            }


            ${
              addonVersion
                ? `
                  <span>
                    v${addonVersion}
                  </span>
                `
                : ""
            }


            ${
              fileSize
                ? `
                  <span>
                    ${fileSize}
                  </span>
                `
                : ""
            }


            <span class="addon-downloads">
              ↓ ${downloads}
            </span>

          </div>


          <!-- AUTHOR -->

          ${
            author
              ? `
                <div class="addon-author">
                  ${author}
                </div>
              `
              : ""
          }


        </div>

      </a>

    </article>
  `;
}


/* =========================================================
   RENDER
========================================================= */

function renderAddons(
  container,
  addons
) {

  if (!container) {
    return;
  }


  if (
    !addons ||
    addons.length === 0
  ) {

    container.innerHTML = "";

    return;
  }


  container.innerHTML =
    addons
      .map(createAddonCard)
      .join("");


  /*
   * Pastikan homepage menggunakan
   * 2 card kiri-kanan.
   */

  container.style.display =
    "grid";

  container.style.gridTemplateColumns =
    "repeat(2, minmax(0, 1fr))";

  container.style.gap =
    "14px";

  container.style.width =
    "100%";


  /*
   * Hover gambar.
   */

  const cards =
    container.querySelectorAll(
      ".addon-card"
    );


  cards.forEach(
    (card) => {

      const image =
        card.querySelector(
          ".addon-image"
        );


      if (!image) {
        return;
      }


      card.addEventListener(
        "mouseenter",
        () => {

          image.style.transform =
            "scale(1.035)";

          image.style.filter =
            "brightness(1.08)";
        }
      );


      card.addEventListener(
        "mouseleave",
        () => {

          image.style.transform =
            "scale(1)";

          image.style.filter =
            "brightness(1)";
        }
      );

    }
  );
}


/* =========================================================
   LOADING
========================================================= */

function showLoading(
  container
) {

  if (!container) {
    return;
  }


  container.innerHTML = `
    <div class="addon-loading">
      Memuat addon...
    </div>
  `;
}


/* =========================================================
   ERROR
========================================================= */

function showError(
  container,
  message
) {

  if (!container) {
    return;
  }


  container.innerHTML = `
    <div class="addon-error">
      ${escapeHTML(message)}
    </div>
  `;
}


/* =========================================================
   SUPABASE SELECT
========================================================= */

const addonColumns = `
  id,
  name,
  slug,
  category,
  description,
  image_url,
  minecraft_version,
  addon_version,
  file_size,
  download_url,
  download_count,
  view_count,
  author,
  status,
  featured,
  created_at,
  updated_at
`;


/* =========================================================
   RECOMMENDED
   featured = true
========================================================= */

async function loadRecommended() {

  if (!recommendedAddons) {
    return;
  }


  showLoading(
    recommendedAddons
  );


  const {
    data,
    error
  } = await supabaseClient
    .from("addons")
    .select(addonColumns)
    .eq(
      "status",
      "published"
    )
    .eq(
      "featured",
      true
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    )
    .limit(
      MAX_HOME_ITEMS
    );


  if (error) {

    console.error(
      "[SMC DL] Recommended error:",
      error
    );


    showError(
      recommendedAddons,
      "Gagal memuat rekomendasi addon."
    );

    return;
  }


  renderAddons(
    recommendedAddons,
    data
  );
}


/* =========================================================
   LATEST
   created_at DESC
========================================================= */

async function loadLatest() {

  if (!latestAddons) {
    return;
  }


  showLoading(
    latestAddons
  );


  const {
    data,
    error
  } = await supabaseClient
    .from("addons")
    .select(addonColumns)
    .eq(
      "status",
      "published"
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    )
    .limit(
      MAX_HOME_ITEMS
    );


  if (error) {

    console.error(
      "[SMC DL] Latest error:",
      error
    );


    showError(
      latestAddons,
      "Gagal memuat addon terbaru."
    );

    return;
  }


  renderAddons(
    latestAddons,
    data
  );
}


/* =========================================================
   POPULAR
   download_count DESC
========================================================= */

async function loadPopular() {

  if (!popularAddons) {
    return;
  }


  showLoading(
    popularAddons
  );


  const {
    data,
    error
  } = await supabaseClient
    .from("addons")
    .select(addonColumns)
    .eq(
      "status",
      "published"
    )
    .order(
      "download_count",
      {
        ascending: false
      }
    )
    .limit(
      MAX_HOME_ITEMS
    );


  if (error) {

    console.error(
      "[SMC DL] Popular error:",
      error
    );


    showError(
      popularAddons,
      "Gagal memuat addon populer."
    );

    return;
  }


  renderAddons(
    popularAddons,
    data
  );
}


/* =========================================================
   VIEW COUNT
========================================================= */

async function incrementViewCount(
  addonId
) {

  if (!addonId) {
    return;
  }


  try {

    const {
      data: addon,
      error: fetchError
    } = await supabaseClient
      .from("addons")
      .select(
        "view_count"
      )
      .eq(
        "id",
        addonId
      )
      .single();


    if (fetchError) {

      console.error(
        "[SMC DL] View fetch error:",
        fetchError
      );

      return;
    }


    const currentViews =
      Number(
        addon?.view_count
      ) || 0;


    const {
      error: updateError
    } = await supabaseClient
      .from("addons")
      .update({
        view_count:
          currentViews + 1
      })
      .eq(
        "id",
        addonId
      );


    if (updateError) {

      console.error(
        "[SMC DL] View update error:",
        updateError
      );

    }

  } catch (error) {

    console.error(
      "[SMC DL] View error:",
      error
    );

  }
}


/* =========================================================
   DOWNLOAD COUNT
========================================================= */

async function incrementDownloadCount(
  addonId
) {

  if (!addonId) {
    return;
  }


  try {

    const {
      data: addon,
      error: fetchError
    } = await supabaseClient
      .from("addons")
      .select(
        "download_count"
      )
      .eq(
        "id",
        addonId
      )
      .single();


    if (fetchError) {

      console.error(
        "[SMC DL] Download fetch error:",
        fetchError
      );

      return;
    }


    const currentDownloads =
      Number(
        addon?.download_count
      ) || 0;


    const {
      error: updateError
    } = await supabaseClient
      .from("addons")
      .update({
        download_count:
          currentDownloads + 1
      })
      .eq(
        "id",
        addonId
      );


    if (updateError) {

      console.error(
        "[SMC DL] Download update error:",
        updateError
      );

    }

  } catch (error) {

    console.error(
      "[SMC DL] Download error:",
      error
    );

  }
}


/* =========================================================
   SEARCH
========================================================= */

if (searchForm) {

  searchForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const query =
        String(
          searchInput?.value || ""
        ).trim();


      if (!query) {

        if (searchInput) {
          searchInput.focus();
        }

        return;
      }


      window.location.href =
        `addons.html?search=${encodeURIComponent(
          query
        )}`;

    }
  );

}


/* =========================================================
   SIDE MENU
========================================================= */

const menuButton =
  document.getElementById(
    "menuButton"
  );

const closeMenu =
  document.getElementById(
    "closeMenu"
  );

const sideMenu =
  document.getElementById(
    "sideMenu"
  );

const menuOverlay =
  document.getElementById(
    "menuOverlay"
  );


function openMenu() {

  if (sideMenu) {

    sideMenu.classList.add(
      "open"
    );

  }


  if (menuOverlay) {

    menuOverlay.classList.add(
      "active"
    );

  }


  if (menuButton) {

    menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

  }


  document.body.classList.add(
    "menu-open"
  );
}


function closeSideMenu() {

  if (sideMenu) {

    sideMenu.classList.remove(
      "open"
    );

  }


  if (menuOverlay) {

    menuOverlay.classList.remove(
      "active"
    );

  }


  if (menuButton) {

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  document.body.classList.remove(
    "menu-open"
  );
}


if (menuButton) {

  menuButton.addEventListener(
    "click",
    openMenu
  );

}


if (closeMenu) {

  closeMenu.addEventListener(
    "click",
    closeSideMenu
  );

}


if (menuOverlay) {

  menuOverlay.addEventListener(
    "click",
    closeSideMenu
  );

}


/* =========================================================
   ESC TO CLOSE MENU
========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key ===
      "Escape"
    ) {

      closeSideMenu();

    }

  }
);


/* =========================================================
   LOAD HOME
========================================================= */

async function loadHome() {

  if (
    !SUPABASE_URL ||
    SUPABASE_URL ===
      "YOUR_SUPABASE_URL"
  ) {

    console.error(
      "[SMC DL] Supabase URL belum diisi."
    );

    return;
  }


  if (
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY ===
      "YOUR_SUPABASE_ANON_KEY"
  ) {

    console.error(
      "[SMC DL] Supabase anon key belum diisi."
    );

    return;
  }


  await Promise.all([

    loadRecommended(),

    loadLatest(),

    loadPopular()

  ]);

}


/* =========================================================
   START
========================================================= */

loadHome();


/* =========================================================
   OPTIONAL GLOBAL ACCESS
========================================================= */

window.smcIncrementView =
  incrementViewCount;

window.smcIncrementDownload =
  incrementDownloadCount;
