import {} from "@coderline/alphatab";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import * as songs from "./assets/index";
import { ParseJson } from "./Utilities/ParseJSON";

function App() {
  const ref = useRef(null);
  const [alphaTab, setAlphaTab] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [song, setSong] = useState("");
  const wrapper = useRef(null);
  useEffect(() => {
    const processedSong = ParseJson(songs.windsong);
    setSong(
      `\\tempo ${processedSong.bpm} \\tuning e5 b4 g4 d4 a3 e3 . ${processedSong.notes}`
    );

    setProcessing(true);
  }, []);

  useEffect(() => {
    const settings = {
      core: {
        tex: true,
      },
      display: {
        staveProfile: "Default",
        resources: {
          // staffLineColor: "rgb(200, 10, 110)"
        },
      },
      notation: {
        elements: {
          scoreTitle: false,
          scoreWordsAndMusic: false,
          effectTempo: true,
          guitarTuning: false,
        },
      },
      player: {
        enablePlayer: true,
        enableUserInteraction: true,
        enableCursor: true,
        soundFont: `https://alphatab-kpy7o.codesandbox.io/sound_fonts/guitar_acoustic.sf2`,
        scrollElement: document.querySelector(".at-viewport"),
      },
    };
    setAlphaTab(new window.alphaTab.AlphaTabApi(ref.current, settings));
  }, [processing]);

  useEffect(() => {
    if (alphaTab) {
      alphaTab.soundFontLoaded.on(() => {
        setLoaded(true);
      });
      const playerIndicator = document.querySelector(
        ".at-controls .at-player-progress"
      );
      alphaTab.soundFontLoad.on((e) => {
        const percentage = Math.floor((e.loaded / e.total) * 100);
        playerIndicator.innerText = percentage + "%";
      });
      alphaTab.playerReady.on(() => {
        playerIndicator.style.display = "none";
      });

      const playPause = document.querySelector(
        ".at-controls .at-player-play-pause"
      );
      const stop = document.querySelector(".at-controls .at-player-stop");

      alphaTab.playerReady.on(() => {
        playPause.classList.remove("disabled");
        stop.classList.remove("disabled");
      });
      alphaTab.playerStateChanged.on((e) => {
        const icon = playPause.querySelector("i.fas");
        if (e.state === alphaTab.player._state) {
          icon.classList.remove("fa-play");
          icon.classList.add("fa-pause");
        } else {
          icon.classList.remove("fa-pause");
          icon.classList.add("fa-play");
        }
      });

      const songPosition = document.querySelector(".at-song-position");
      let previousTime = -1;
      alphaTab.playerPositionChanged.on((e) => {
        // reduce number of UI updates to second changes.
        const currentSeconds = (e.currentTime / 1000) | 0;
        if (currentSeconds == previousTime) {
          return;
        }

        songPosition.innerText =
          formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);
      });
    }
  }, [alphaTab]);

  function formatDuration(milliseconds) {
    let seconds = milliseconds / 1000;
    const minutes = (seconds / 60) | 0;
    seconds = (seconds - minutes * 60) | 0;
    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  }

  return (
    <div className="at-wrap" ref={wrapper}>
      <div className="at-content">
        <div className="at-viewport">
          Viewport will scroll, at-main will contain music sheet
          <div className="at-main" ref={ref}>
            {song}
          </div>
        </div>
      </div>
      <div className="at-controls">
        <div className="at-controls-left">
          <a
            className="btn at-player-stop disabled"
            onClick={(e) => {
              if (e.target.classList.contains("disabled")) {
                return;
              }
              alphaTab.stop();
            }}
          >
            <i className="fas fa-step-backward"></i>
          </a>
          <a
            className="btn at-player-play-pause disabled"
            onClick={(e) => {
              if (e.target.classList.contains("disabled")) {
                return;
              }
              alphaTab.playPause();
            }}
          >
            <i className="fas fa-play"></i>
          </a>
          <span className="at-player-progress">0%</span>
          <div className="at-song-position">00:00 / 00:00</div>
          <div className="at-zoom">
            <i className="fas fa-hourglass-half"></i>
            <select
              onChange={(e) => {
                alphaTab.playbackSpeed = e.currentTarget.value / 100;
              }}
            >
              <option value="25">0.25</option>
              <option value="50">0.50</option>
              <option value="75">0.75</option>
              <option value="90">0.90</option>
              <option value="100" selected>
                1.0
              </option>
              <option value="110">1.10</option>
              <option value="125">1.25</option>
              <option value="150">1.50</option>
              <option value="200">2.00</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
