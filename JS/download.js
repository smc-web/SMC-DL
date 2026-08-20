document.addEventListener("DOMContentLoaded", async () => {
  const tasks = document.querySelectorAll(".task-card");
  const timer = document.getElementById("timer");
  const continueButton = document.getElementById("continueButton");

  let completedTasks = 0;
  let timerStarted = false;
  let timeLeft = 10;
  let downloadUrl = null;

  // =====================================
  // SUPABASE CONFIG
  // =====================================

  const SUPABASE_URL =
    "https://rtwljeoxxhlfortcputj.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_stZa8kHgp-sokGGLRQIfrA_dM9ec8x-";

  // =====================================
  // AMBIL ID ADDON DARI URL
  // =====================================

  const params = new URLSearchParams(
    window.location.search
  );

  const addonId = params.get("id");

  if (!addonId) {
    console.error("ID addon tidak ditemukan.");

    if (continueButton) {
      continueButton.disabled = true;
    }

    return;
  }

  // =====================================
  // AMBIL DOWNLOAD URL DARI SUPABASE
  // =====================================

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/addons?id=eq.${encodeURIComponent(addonId)}&select=download_url`,
      {
        method: "GET",

        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `Supabase error: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error(
        "Addon tidak ditemukan."
      );
    }

    downloadUrl = data[0].download_url;

    if (!downloadUrl) {
      throw new Error(
        "download_url masih kosong di Supabase."
      );
    }

    console.log(
      "Download URL berhasil:",
      downloadUrl
    );

  } catch (error) {
    console.error(
      "Gagal mengambil link download:",
      error
    );

    if (continueButton) {
      continueButton.disabled = true;

      const span =
        continueButton.querySelector("span");

      if (span) {
        span.textContent =
          "Download unavailable";
      }
    }

    return;
  }

  // =====================================
  // TASK CLICK
  // =====================================

  tasks.forEach((task) => {
    const button =
      task.querySelector(".task-button");

    if (!button) return;

    button.addEventListener("click", () => {

      if (
        task.classList.contains("completed")
      ) {
        return;
      }

      task.classList.add("completed");

      const number =
        task.querySelector(".task-number");

      if (number) {
        number.textContent = "✓";

        number.classList.add(
          "completed-number"
        );
      }

      button.textContent = "✓ Done";

      button.classList.add(
        "completed-button"
      );

      completedTasks++;

      startTimer();

      checkComplete();
    });
  });

  // =====================================
  // TIMER
  // =====================================

  function startTimer() {

    if (timerStarted) {
      return;
    }

    timerStarted = true;

    const interval = setInterval(() => {

      timeLeft--;

      if (timer) {
        timer.textContent = timeLeft;
      }

      if (timeLeft <= 0) {

        clearInterval(interval);

        if (timer) {
          timer.textContent = "✓";

          timer.classList.add(
            "timer-complete"
          );
        }

        checkComplete();
      }

    }, 1000);
  }

  // =====================================
  // CHECK COMPLETE
  // =====================================

  function checkComplete() {

    if (
      completedTasks === tasks.length &&
      timeLeft <= 0 &&
      downloadUrl
    ) {

      continueButton.disabled = false;

      continueButton.classList.add(
        "ready"
      );

      const spans =
        continueButton.querySelectorAll(
          "span"
        );

      if (spans[0]) {
        spans[0].textContent =
          "Continue to Download";
      }
    }
  }

  // =====================================
  // CONTINUE → MEDIAFIRE
  // =====================================

  continueButton.addEventListener(
    "click",
    () => {

      if (
        continueButton.disabled ||
        !downloadUrl
      ) {
        return;
      }

      try {

        const url =
          new URL(downloadUrl);

        if (
          url.protocol !== "http:" &&
          url.protocol !== "https:"
        ) {
          throw new Error(
            "URL tidak valid."
          );
        }

        // LANGSUNG KE MEDIAFIRE
        window.location.href =
          url.href;

      } catch (error) {

        console.error(
          "URL download tidak valid:",
          error
        );

        alert(
          "Link download tidak valid."
        );
      }
    }
  );

});
