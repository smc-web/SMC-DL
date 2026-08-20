document.addEventListener("DOMContentLoaded", () => {

  const favoriteGrid =
    document.getElementById("favoriteGrid");

  const emptyState =
    document.getElementById("favoriteEmpty");


  // =========================
  // FAVORITE STORAGE
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


  // =========================
  // LOAD FAVORITES
  // =========================

  function loadFavorites() {

    const favorites =
      getFavorites();

    if (!favoriteGrid) return;


    /*
     * Untuk sekarang belum ada
     * database addon.
     *
     * Jadi halaman favorit
     * tetap kosong sampai data
     * addon asli tersedia.
     */

    favoriteGrid.innerHTML = "";


    if (favorites.length === 0) {

      showEmpty();

      return;
    }


    /*
     * Nanti setelah database/API
     * dibuat, addon berdasarkan ID
     * favorit akan dimuat di sini.
     */

    showEmpty(
      "Data addon belum tersedia."
    );
  }


  // =========================
  // EMPTY STATE
  // =========================

  function showEmpty(
    message = "Belum ada addon favorit."
  ) {

    if (favoriteGrid) {
      favoriteGrid.innerHTML = "";
    }

    if (!emptyState) return;

    emptyState.classList.add(
      "show"
    );

    const title =
      emptyState.querySelector(
        ".empty-title"
      );

    if (title) {
      title.textContent = message;
    }
  }


  // =========================
  // START
  // =========================

  loadFavorites();

});
