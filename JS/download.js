document.addEventListener("DOMContentLoaded", async () => {

  const tasks =
    document.querySelectorAll(".task-card");

  const timer =
    document.getElementById("timer");

  const continueButton =
    document.getElementById("continueButton");


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
  // AMBIL ID ADDON
  // =====================================

  const params =
    new URLSearchParams(
      window.location.search
    );

  const addonId =
    params.get("id");


  if (!addonId) {

    console.error(
      "[SMC DL] ID addon tidak ditemukan."
    );

    if (continueButton) {

      continueButton.disabled = true;

    }

    return;
  }


  console.log(
    "[SMC DL] Addon ID:",
    addonId
  );


  // =====================================
  // AMBIL DOWNLOAD URL
  // =====================================

  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/addons?id=eq.${encodeURIComponent(addonId)}&select=id,name,download_url,download_count`,
        {

          method: "GET",

          headers: {

            "apikey":
              SUPABASE_KEY,

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


    const data =
      await response.json();


    if (
      !data ||
      data.length === 0
    ) {

      throw new Error(
        "Addon tidak ditemukan."
      );

    }


    downloadUrl =
      data[0].download_url;


    if (!downloadUrl) {

      throw new Error(
        "download_url masih kosong di Supabase."
      );

    }


    console.log(
      "[SMC DL] Download URL:",
      downloadUrl
    );


  } catch (error) {

    console.error(
      "[SMC DL] Gagal mengambil addon:",
      error
    );


    if (continueButton) {

      continueButton.disabled = true;


      const span =
        continueButton.querySelector(
          "span"
        );


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
      task.querySelector(
        ".task-button"
      );


    if (!button) {
      return;
    }


    button.addEventListener(
      "click",
      () => {

        if (
          task.classList.contains(
            "completed"
          )
        ) {

          return;

        }


        task.classList.add(
          "completed"
        );


        const number =
          task.querySelector(
            ".task-number"
          );


        if (number) {

          number.textContent =
            "✓";

          number.classList.add(
            "completed-number"
          );

        }


        button.textContent =
          "✓ Done";


        button.classList.add(
          "completed-button"
        );


        completedTasks++;


        startTimer();

        checkComplete();

      }
    );

  });


  // =====================================
  // TIMER
  // =====================================

  function startTimer() {

    if (timerStarted) {
      return;
    }


    timerStarted = true;


    const interval =
      setInterval(
        () => {

          timeLeft--;


          if (timer) {

            timer.textContent =
              timeLeft;

          }


          if (timeLeft <= 0) {

            clearInterval(
              interval
            );


            if (timer) {

              timer.textContent =
                "✓";

              timer.classList.add(
                "timer-complete"
              );

            }


            checkComplete();

          }

        },
        1000
      );

  }


  // =====================================
  // CHECK COMPLETE
  // =====================================

  function checkComplete() {

    if (
      completedTasks ===
        tasks.length &&

      timeLeft <= 0 &&

      downloadUrl
    ) {

      continueButton.disabled =
        false;


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
  // TAMBAH DOWNLOAD COUNT
  // =====================================

  async function incrementDownloadCount() {

    if (!addonId) {

      console.error(
        "[SMC DL] addonId kosong."
      );

      return false;

    }


    try {

      console.log(
        "[SMC DL] Menambah download_count..."
      );


      /*
       * Ambil download_count terbaru
       */

      const getResponse =
        await fetch(
          `${SUPABASE_URL}/rest/v1/addons?id=eq.${encodeURIComponent(addonId)}&select=download_count`,
          {

            method: "GET",

            headers: {

              "apikey":
                SUPABASE_KEY,

              "Authorization":
                `Bearer ${SUPABASE_KEY}`

            }

          }
        );


      if (!getResponse.ok) {

        throw new Error(
          `Gagal mengambil download_count: ${getResponse.status}`
        );

      }


      const data =
        await getResponse.json();


      if (
        !data ||
        data.length === 0
      ) {

        throw new Error(
          "Addon tidak ditemukan saat update download."
        );

      }


      const currentCount =
        Number(
          data[0].download_count
        ) || 0;


      const newCount =
        currentCount + 1;


      /*
       * Update download_count
       */

      const updateResponse =
        await fetch(
          `${SUPABASE_URL}/rest/v1/addons?id=eq.${encodeURIComponent(addonId)}`,
          {

            method: "PATCH",

            headers: {

              "apikey":
                SUPABASE_KEY,

              "Authorization":
                `Bearer ${SUPABASE_KEY}`,

              "Content-Type":
                "application/json",

              "Prefer":
                "return=minimal"

            },

            body:
              JSON.stringify({
                download_count:
                  newCount
              })

          }
        );


      if (!updateResponse.ok) {

        const errorText =
          await updateResponse.text();


        throw new Error(
          `Gagal update download_count: ${updateResponse.status} ${errorText}`
        );

      }


      console.log(
        `[SMC DL] Download count berhasil: ${currentCount} → ${newCount}`
      );


      return true;


    } catch (error) {

      console.error(
        "[SMC DL] Download count error:",
        error
      );


      return false;

    }

  }


  // =====================================
  // CONTINUE → DOWNLOAD
  // =====================================

  if (continueButton) {

    continueButton.addEventListener(
      "click",
      async () => {

        if (
          continueButton.disabled ||
          !downloadUrl
        ) {

          return;

        }


        /*
         * Cegah klik dua kali
         */

        continueButton.disabled =
          true;


        const originalText =
          continueButton.querySelector(
            "span"
          );


        if (originalText) {

          originalText.textContent =
            "Preparing Download...";

        }


        // =================================
        // VALIDASI URL
        // =================================

        let url;


        try {

          url =
            new URL(
              downloadUrl
            );


          if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
          ) {

            throw new Error(
              "URL tidak valid."
            );

          }

        } catch (error) {

          console.error(
            "[SMC DL] URL download invalid:",
            error
          );


          alert(
            "Link download tidak valid."
          );


          continueButton.disabled =
            false;


          if (originalText) {

            originalText.textContent =
              "Continue to Download";

          }


          return;

        }


        // =================================
        // TAMBAH DOWNLOAD COUNT
        // =================================

        const counted =
          await incrementDownloadCount();


        if (!counted) {

          /*
           * Jangan tetap redirect
           * kalau count gagal.
           *
           * Dengan begini kamu bisa tahu
           * kalau RLS Supabase bermasalah.
           */

          alert(
            "Download gagal dicatat. Silakan coba lagi."
          );


          continueButton.disabled =
            false;


          if (originalText) {

            originalText.textContent =
              "Continue to Download";

          }


          return;

        }


        // =================================
        // REDIRECT
        // =================================

        console.log(
  "[SMC DL] Redirect ke:",
  url.href
);

// TAMBAH DOWNLOAD COUNT
try {

  const countResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/increment_download_count`,
    {
      method: "POST",

      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        addon_id: addonId
      })
    }
  );

  if (!countResponse.ok) {
    console.error(
      "[SMC DL] Gagal menambah download count:",
      await countResponse.text()
    );
  } else {
    console.log(
      "[SMC DL] Download count berhasil ditambah!"
    );
  }

} catch (error) {

  console.error(
    "[SMC DL] RPC error:",
    error
  );

}


// BARU REDIRECT
window.location.href =
  url.href;

      }
    );

  }

});
