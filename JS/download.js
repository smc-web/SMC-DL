document.addEventListener("DOMContentLoaded", () => {
  const tasks = document.querySelectorAll(".task-card");
  const timer = document.getElementById("timer");
  const continueButton = document.getElementById("continueButton");

  let completedTasks = 0;
  let timerStarted = false;
  let timeLeft = 10;

  // =========================
  // TASK CLICK
  // =========================

  tasks.forEach((task) => {
    const button = task.querySelector(".task-button");

    if (!button) return;

    button.addEventListener("click", () => {

      // Jangan dihitung dua kali
      if (task.classList.contains("completed")) {
        return;
      }

      task.classList.add("completed");

      const number = task.querySelector(".task-number");

      if (number) {
        number.textContent = "✓";
        number.classList.add("completed-number");
      }

      button.textContent = "✓ Done";
      button.classList.add("completed-button");

      completedTasks++;

      // Mulai timer setelah task pertama dibuka
      startTimer();

      checkComplete();
    });
  });


  // =========================
  // TIMER
  // =========================

  function startTimer() {

    if (timerStarted) {
      return;
    }

    timerStarted = true;

    const interval = setInterval(() => {

      timeLeft--;

      timer.textContent = timeLeft;

      if (timeLeft <= 0) {

        clearInterval(interval);

        timer.textContent = "✓";

        timer.classList.add("timer-complete");

        checkComplete();
      }

    }, 1000);
  }


  // =========================
  // CHECK COMPLETE
  // =========================

  function checkComplete() {

    if (
      completedTasks === tasks.length &&
      timeLeft <= 0
    ) {

      continueButton.disabled = false;

      continueButton.classList.add("ready");

      const spans =
        continueButton.querySelectorAll("span");

      if (spans[0]) {
        spans[0].textContent =
          "Continue to Download";
      }

    }
  }


  // =========================
  // CONTINUE
  // =========================

  continueButton.addEventListener("click", () => {

    if (continueButton.disabled) {
      return;
    }

    /*
      Untuk sementara kembali ke halaman addon.

      Nanti bisa diganti menjadi:
      file-download.html?id=...
    */

    const params =
      new URLSearchParams(window.location.search);

    const addonId = params.get("id");

    if (addonId) {

      window.location.href =
        `file-download.html?id=${encodeURIComponent(addonId)}`;

    } else {

      window.location.href =
        "addons.html";

    }

  });

});
