const sectionButtons = Array.from(document.querySelectorAll("[data-section]"));
const sectionPanels = Array.from(document.querySelectorAll("[data-panel]"));
const contentSpace = document.querySelector("#content-space");
const soundToggle = document.querySelector("#sound-toggle");
const backgroundAudio = document.querySelector("#background-audio");
const speakerMuted = document.querySelector("#speaker-muted");
const speakerPlaying = document.querySelector("#speaker-playing");

function showSection(sectionName) {
  sectionPanels.forEach((panel) => {
    const isCurrent = panel.dataset.panel === sectionName;
    panel.hidden = !isCurrent;

    if (isCurrent && sectionName !== "home") {
      panel.classList.remove("section-enter");
      void panel.offsetWidth;
      panel.classList.add("section-enter");
    }
  });

  sectionButtons.forEach((button) => {
    const isCurrent = button.dataset.section === sectionName;
    button.classList.toggle("is-active", isCurrent);
    button.setAttribute("aria-selected", String(isCurrent));
    button.tabIndex = isCurrent ? 0 : -1;
  });

  const isHome = sectionName === "home";
  contentSpace.classList.toggle("is-home", isHome);
  contentSpace.classList.toggle("is-content", !isHome);
}

function updateSoundState(isPlaying) {
  soundToggle.classList.toggle("is-active", isPlaying);
  soundToggle.setAttribute("aria-pressed", String(isPlaying));
  soundToggle.setAttribute(
    "aria-label",
    isPlaying ? "Pause background music" : "Play background music",
  );
  speakerMuted.hidden = isPlaying;
  speakerPlaying.hidden = !isPlaying;
}

sectionButtons.forEach((button, index) => {
  button.addEventListener("click", () => showSection(button.dataset.section));

  button.addEventListener("keydown", (event) => {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % sectionButtons.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + sectionButtons.length) % sectionButtons.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = sectionButtons.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextButton = sectionButtons[nextIndex];
    showSection(nextButton.dataset.section);
    nextButton.focus();
  });
});

soundToggle.addEventListener("click", async () => {
  if (backgroundAudio.paused) {
    try {
      await backgroundAudio.play();
      updateSoundState(true);
    } catch {
      updateSoundState(false);
    }
  } else {
    backgroundAudio.pause();
    updateSoundState(false);
  }
});

backgroundAudio.addEventListener("pause", () => updateSoundState(false));
backgroundAudio.addEventListener("play", () => updateSoundState(true));

showSection("home");
updateSoundState(false);
