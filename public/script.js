const controls = document.querySelector("#controls");
const btnPlay = document.querySelector("#play-control");
let index = 0;
let currentMusic;
let isPlaying = false;

controls.addEventListener("click", function (event) {
  const audios = [];
  let music = {};

  if (event.target.id != "controls") {
    let musics;
    try {
      musics = event.target.closest("#controls").querySelectorAll(".music-item");
    } catch (error) {
      console.error("Failed to get musics: ", error);
      return;
    }

    musics.forEach(function (item) {
      if (item.nodeType === Node.ELEMENT_NODE) {
        try {
          let nameNode = item.childNodes[3]?.childNodes[0];
          let artistNode = item.childNodes[5]?.childNodes[0];
          let imageNode = item.childNodes[1]?.childNodes[1];
          let audioNode = item.childNodes[7]?.childNodes[1];

          if (nameNode && artistNode && imageNode && audioNode) {
            music.name = nameNode.data || "";
            music.artist = artistNode.data || "";
            music.image = imageNode.currentSrc || "";
            music.audio = audioNode || null;

            if (music.audio) {
              audios.push(music);
            }
          }

          music = {};
        } catch (error) {
          console.error("Error accessing child nodes: ", error);
        }
      }
    });
  }

  function updateDataMusic() {
    currentMusic = audios[index];
    if (currentMusic) {
      document.querySelector("#currentImg").src = currentMusic.image || "";
      document.querySelector("#currentName").innerText = currentMusic.name || "";
      document.querySelector("#currentArtist").innerText = currentMusic.artist || "";
      document.querySelector("#volume").value = currentMusic.audio.volume * 100 || 100;

      const lichanged = document.querySelectorAll(".li-changed");
      for (let i = 0; i < lichanged.length; i++) {
        lichanged[i].style.background = 'none';
      }
      if (lichanged[index]) {
        lichanged[index].style.background = '#1c1c1c';
      }

      const progressbar = document.querySelector("#progressbar");
      const textCurrentDuration = document.querySelector("#current-duration");
      const textTotalDuration = document.querySelector("#total-duration");

      progressbar.max = currentMusic.audio.duration || 0;
      textTotalDuration.innerText = secondsToMinutes(currentMusic.audio.duration || 0);

      currentMusic.audio.ontimeupdate = function () {
        textCurrentDuration.innerText = secondsToMinutes(
          currentMusic.audio.currentTime
        );
        progressbar.valueAsNumber = currentMusic.audio.currentTime;
      };
    } else {
      console.error("No current music found.");
    }
  }

  if (event.target.id == "play-control") {
    if (index == 0) {
      updateDataMusic();
    }

    if (!isPlaying) {
      btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
      currentMusic.audio.play();
      isPlaying = true;
    } else {
      btnPlay.classList.replace("bi-pause-fill", "bi-play-fill");
      currentMusic.audio.pause();
      isPlaying = false;
    }
    musicEnded();
  }

  if (event.target.id == "vol-icon") {
    currentMusic.audio.muted = !currentMusic.audio.muted;
    if (currentMusic.audio.muted) {
      event.target.classList.replace(
        "bi-volume-up-fill",
        "bi-volume-mute-fill"
      );
    } else {
      event.target.classList.replace(
        "bi-volume-mute-fill",
        "bi-volume-up-fill"
      );
    }
    musicEnded();
  }

  if (event.target.id == "volume") {
    currentMusic.audio.volume = event.target.valueAsNumber / 100;
    musicEnded();
  }
  if (event.target.id == "progressbar") {
    currentMusic.audio.currentTime = event.target.valueAsNumber;
    musicEnded();
  }

  if (event.target.id == "next-control") {
    index++;
    if (index == audios.length) {
      index = 0;
    }

    currentMusic.audio.pause();
    updateDataMusic();
    currentMusic.audio.play();
    btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
  }

  if (event.target.id == "prev-control") {
    index--;

    if (index == -1) {
      index = audios.length - 1;
    }

    currentMusic.audio.pause();
    updateDataMusic();
    currentMusic.audio.play();
    btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
    musicEnded();
  }

  function musicEnded() {
    currentMusic.audio.addEventListener("ended", function () {
      index++;

      if (index == -1) {
        index = 0;
      }

      currentMusic.audio.pause();
      updateDataMusic();
      currentMusic.audio.play();
      btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
    });
  }
});

function secondsToMinutes(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
}
