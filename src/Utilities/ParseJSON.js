export const ParseJson = (jsonFile) => {
  const tempo = jsonFile.automations.tempo[0].bpm;
  const measures = jsonFile.measures;

  const signature = measures[0].signature;
  let ts = `${signature[0]} ${signature[1]}`;
  let maxBeat = signature[1];

  let complAlphaTex = "";
  measures.forEach((ele, index) => {
    ele.voices[0].beats.forEach((elem2) => {
      let duration = elem2.duration[0];
      let alphaTexBeat = "";
      if (duration === 1) {
        duration = elem2.duration[1];
      }
      if (elem2.rest) {
        console.log(duration);
        if (duration % 2 === 1 && duration !== 1) {
          //odd
          alphaTexBeat = `r.${Math.ceil(duration / 2)}{d} `;
        } else {
          alphaTexBeat = `r.${duration} `;
        }
      } else {
        alphaTexBeat = "(";
        elem2.notes.forEach((elem3, index) => {
          const fret = elem3.fret;
          const string = elem3.string + 1;
          alphaTexBeat += `${fret}.${string}`;

          if (elem3.dead) {
            alphaTexBeat += "{x}";
          }

          if (index < elem2.notes.length - 1) {
            alphaTexBeat += ` `;
          }
        });
        alphaTexBeat += `).${duration} `;
      }

      complAlphaTex += alphaTexBeat;
    });
    if (index >= measures.length - 1) {
      // complAlphaTex += `${alphaTexBeat}`;
    } else {
      complAlphaTex += `| `;
    }
  });

  console.log(complAlphaTex);
  return {
    bpm: tempo,
    ts: ts,
    notes: complAlphaTex,
  };
};
