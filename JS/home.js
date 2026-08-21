/* =========================================================
   SMC DL
   HOME.JS
   Supabase Homepage
   FINAL + DASHBOARD
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
  "https://rtwljeoxxhlfortcputj.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_stZa8kHgp-sokGGLRQIfrA_dM9ec8x-";


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
   DASHBOARD DOM
   ========================================================= */

const totalUploadsElement =
  document.getElementById(
    "totalUploads"
  );

const totalViewsElement =
  document.getElementById(
    "totalViews"
  );

const mediafirePercentElement =
  document.getElementById(
    "mediafirePercent"
  );


/* =========================================================
   CONFIG
   ========================================================= */

const MAX_HOME_ITEMS = 5;


/* =========================================================
   HORIZONTAL SCROLL STYLE
   ========================================================= */

const homeCardStyle =
  document.createElement("style");


homeCardStyle.textContent = `

  .addon-grid {

    display: flex !important;

    flex-direction: row !important;

    flex-wrap: nowrap !important;

    gap: 12px;

    overflow-x: auto;

    overflow-y: hidden;

    padding:
      4px
      2px
      12px;

    scroll-behavior: smooth;

    -webkit-overflow-scrolling: touch;

    scrollbar-width: thin;

  }


  .addon-grid::-webkit-scrollbar {

    height: 5px;

  }


  .addon-grid::-webkit-scrollbar-track {

    background:
      rgba(10, 30, 55, .35);

    border-radius: 10px;

  }


  .addon-grid::-webkit-scrollbar-thumb {

    background:
      rgba(40, 155, 255, .45);

    border-radius: 10px;

  }


  .addon-grid .addon-card {

    flex:
      0 0 205px;

    width:
      205px;

    min-width:
      205px;

  }


  .addon-grid .addon-card-link {

    display:
      block;

    width:
      100%;

    text-decoration:
      none;

  }


  .addon-grid .addon-image-wrapper {

    width:
      100%;

    aspect-ratio:
      16 / 9;

    overflow:
      hidden;

  }


  .addon-grid .addon-image {

    width:
      100%;

    height:
      100%;

    display:
      block;

    object-fit:
      cover;

  }


  /* =====================================================
     DASHBOARD ANIMATION
  ===================================================== */

  .home-dashboard {

    animation:
      dashboardAppear
      .7s
      ease
      both;

  }


  .dashboard-card {

    position:
      relative;

    overflow:
      hidden;

  }


  .dashboard-card::after {

    content:
      "";

    position:
      absolute;

    top:
      -100%;

    left:
      -80%;

    width:
      60%;

    height:
      300%;

    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,.10),
        transparent
      );

    transform:
      rotate(25deg);

    animation:
      dashboardShine
      4s
      ease-in-out
      infinite;

    pointer-events:
      none;

  }


  @keyframes dashboardAppear {

    from {

      opacity:
        0;

      transform:
        translateY(15px)
        scale(.97);

    }

    to {

      opacity:
        1;

      transform:
        translateY(0)
        scale(1);

    }

  }


  @keyframes dashboardShine {

    0%,
    55% {

      left:
        -100%;

    }

    75%,
    100% {

      left:
        160%;

    }

  }


  @media (max-width: 600px) {

    .addon-grid {

      gap:
        9px;

      padding-bottom:
        10px;

    }


    .addon-grid .addon-card {

      flex:
        0 0 175px;

      width:
        175px;

      min-width:
        175px;

    }

  }


  @media (max-width: 380px) {

    .addon-grid .addon-card {

      flex:
        0 0 160px;

      width:
        160px;

      min-width:
        160px;

    }

  }

`;


document.head.appendChild(
  homeCardStyle
);


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

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   FORMAT DOWNLOADS
   ========================================================= */

function formatDownloads(value) {

  const number =
    Number(value) || 0;


  if (
    number >= 1000000
  ) {

    return (
      number / 1000000
    ).toFixed(1) + "M";

  }


  if (
    number >= 1000
  ) {

    return (
      number / 1000
    ).toFixed(1) + "K";

  }


  return number.toString();

}


/* =========================================================
   FORMAT FILE SIZE
   ========================================================= */

function formatFileSize(value) {

  if (!value) {

    return "";

  }


  return String(value);

}


/* =========================================================
   FORMAT CATEGORY
   ========================================================= */

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
   CREATE ADDON CARD
   ========================================================= */

function createAddonCard(addon) {


  const id =
    encodeURIComponent(
      addon.id
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
   * ID OTOMATIS DARI DATABASE
   *
   * Setiap addon punya ID berbeda.
   */

  const detailURL =
    `download.html?id=${id}`;


  return `

    <article
      class="addon-card"
      data-addon-id="${id}"
    >

      <a
        href="${detailURL}"
        class="addon-card-link"
      >

        <div
          class="addon-image-wrapper"
        >

          <img
            src="${image}"
            alt="${name}"
            class="addon-image"
            loading="lazy"

            onerror="
              this.onerror=null;
              this.src='assets/icons/grass.webp';
            "
          >

        </div>


        <div
          class="addon-card-content"
        >

          <span
            class="addon-category"
          >

            ${category}

          </span>


          <h3
            class="addon-title"
          >

            ${name}

          </h3>


          <p
            class="addon-description"
          >

            ${description}

          </p>


          <div
            class="addon-meta"
          >

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


            <span
              class="addon-downloads"
            >

              ↓ ${downloads}

            </span>

          </div>


          ${
            author
              ? `
                <div
                  class="addon-author"
                >

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
   RENDER ADDONS
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

      .slice(
        0,
        MAX_HOME_ITEMS
      )

      .map(
        createAddonCard
      )

      .join("");

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
   SUPABASE COLUMNS
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
   DASHBOARD
   ========================================================= */

async function loadDashboardStats() {

  if (
    !totalUploadsElement &&
    !totalViewsElement &&
    !mediafirePercentElement
  ) {

    return;

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient

        .from("addons")

        .select(
          "download_url, view_count"
        )

        .eq(
          "status",
          "published"
        );


    if (error) {

      throw error;

    }


    const addons =
      data || [];


    /* =========================================
       TOTAL UPLOADS
    ========================================= */

    const totalUploads =
      addons.length;


    if (totalUploadsElement) {

      totalUploadsElement.textContent =
        totalUploads.toLocaleString(
          "id-ID"
        );

    }


    /* =========================================
       TOTAL VIEWS
    ========================================= */

    const totalViews =
      addons.reduce(
        function (
          total,
          addon
        ) {

          return (
            total +
            (
              Number(
                addon.view_count
              ) || 0
            )
          );

        },
        0
      );


    if (totalViewsElement) {

      totalViewsElement.textContent =
        totalViews.toLocaleString(
          "id-ID"
        );

    }


    /* =========================================
       MEDIAFIRE PERCENTAGE
    ========================================= */

    const mediafireCount =
      addons.filter(
        function (addon) {

          const url =
            String(
              addon.download_url ||
              ""
            ).toLowerCase();


          return url.includes(
            "mediafire.com"
          );

        }
      ).length;


    let mediafirePercent = 100;


    if (addons.length > 0) {

      mediafirePercent =
        Math.round(
          (
            mediafireCount /
            addons.length
          ) * 100
        );

    }


    if (mediafirePercentElement) {

      mediafirePercentElement.textContent =
        `${mediafirePercent}%`;

    }


    console.log(
      "[SMC DL] Dashboard:",
      {
        totalUploads,
        totalViews,
        mediafirePercent
      }
    );


  } catch (error) {

    console.error(
      "[SMC DL] Dashboard error:",
      error
    );


    /*
     * Jangan bikin halaman rusak
     * kalau statistik gagal.
     */

    if (totalUploadsElement) {

      totalUploadsElement.textContent =
        "0";

    }


    if (totalViewsElement) {

      totalViewsElement.textContent =
        "0";

    }


    if (mediafirePercentElement) {

      mediafirePercentElement.textContent =
        "100%";

    }

  }

}


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
  } =
    await supabaseClient

      .from("addons")

      .select(
        addonColumns
      )

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
  } =
    await supabaseClient

      .from("addons")

      .select(
        addonColumns
      )

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
  } =
    await supabaseClient

      .from("addons")

      .select(
        addonColumns
      )

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
    } =
      await supabaseClient

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
    } =
      await supabaseClient

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
    } =
      await supabaseClient

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
    } =
      await supabaseClient

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
          searchInput?.value ||
          ""
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


/* =========================================================
   CLOSE MENU
   ========================================================= */

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


/* =========================================================
   MENU EVENTS
   ========================================================= */

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

  if (!SUPABASE_URL) {

    console.error(
      "[SMC DL] Supabase URL belum diisi."
    );

    return;

  }


  if (!SUPABASE_ANON_KEY) {

    console.error(
      "[SMC DL] Supabase anon key belum diisi."
    );

    return;

  }


  await Promise.all([

    loadDashboardStats(),

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
   GLOBAL ACCESS
   ========================================================= */

window.smcIncrementView =
  incrementViewCount;


window.smcIncrementDownload =
  incrementDownloadCount;
/* =========================================================
   HERO TYPING ANIMATION
   ========================================================= */

const typingText = document.getElementById("typingText");

if (typingText) {

  const text =
    "Temukan addon, mod, shader, texture, map dan berbagai konten Minecraft favoritmu.";

  let index = 0;

  function typeText() {

    if (index < text.length) {

      typingText.textContent += text.charAt(index);

      index++;

      setTimeout(typeText, 38);

    }

  }

  typeText();

}
