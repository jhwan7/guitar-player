import {} from "@coderline/alphatab";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import secondRun from "./assets/secondRun.json";
import twilight from "./assets/twilight.json";
import { ParseJson } from "./Utilities/ParseJSON";

function App() {
  const ref = useRef(null);
  const apiRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [song, setSong] = useState("");
  useEffect(() => {
    const processedSong = ParseJson(secondRun);
    console.log(processedSong);
    setSong(
      `\\tempo ${processedSong.bpm} \\tuning e5 b4 g4 d4 a3 e3 . \\ts ${processedSong.ts} ${processedSong.notes}`
    );

    setProcessing(true);
  }, []);

  useEffect(() => {
    apiRef.current = new window.alphaTab.AlphaTabApi(ref.current, {
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
        scrollMode: "off",
        enablePlayer: true,
        enableUserInteraction: true,
        enableCursor: true,
        soundFont: `https://alphatab-kpy7o.codesandbox.io/sound_fonts/guitar_acoustic.sf2`,
      },
    });

    apiRef.current.soundFontLoaded.on(() => {
      setLoaded(true);
    });
  }, [processing]);

  return (
    <div className="App">
      <button
        onClick={() => {
          apiRef.current.play();
        }}
        disabled={!loaded}
      >
        play
      </button>
      <button
        onClick={() => {
          apiRef.current.pause();
        }}
        disabled={!loaded}
      >
        pause
      </button>
      <div ref={ref}>{song}</div>
    </div>
  );
}

export default App;
