export const ParseJson = (jsonFile) => {
  const tempo = jsonFile.automations.tempo[0].bpm;
  const measures = jsonFile.measures;

  let complAlphaTex = "";
  measures.forEach((ele, index1) => {
    const signature = ele.signature;
    if (signature) {
      complAlphaTex += `\\ts ${signature[0]} ${signature[1]} `;
    }

    let isTuplet = false;
    ele.voices[0].beats.forEach((elem2, index2) => {
      let duration = elem2.duration[0];
      let alphaTexBeat = "";
      if (ele.index === 18) {
        console.log(elem2);
      }
      if (elem2.tupletStart) {
        isTuplet = true;
      }

      if (duration === 1) {
        duration = elem2.duration[1];
      }
      if (elem2.rest) {
        if (duration % 2 === 1 && duration !== 1) {
          //odd
          alphaTexBeat = `r.${Math.ceil(duration / 2)}{d} `;
        } else {
          alphaTexBeat = `r.${duration} `;
        }
      } else {
        alphaTexBeat = "(";
        elem2.notes.forEach((elem3, index3) => {
          const fret = elem3.fret;
          const string = elem3.string + 1;
          alphaTexBeat += `${fret}.${string}`;

          if (elem3.dead) {
            alphaTexBeat += "{x}";
          }

          if (isTuplet) {
            alphaTexBeat += "{tu 3}";
          }

          if (index3 < elem2.notes.length - 1) {
            alphaTexBeat += ` `;
          }
        });
        if (isTuplet) {
          alphaTexBeat += `) `;
        } else if (elem2.dotted) {
          alphaTexBeat += `).${Math.ceil(elem2.duration[1] / 2)}{d} `;
        } else {
          alphaTexBeat += `).${duration} `;
        }
      }

      complAlphaTex += alphaTexBeat;
      if (elem2.tupletStop) {
        isTuplet = false;
      }
    });
    if (index1 >= measures.length - 1) {
      // complAlphaTex += `${alphaTexBeat}`;
    } else {
      complAlphaTex += `| `;
    }
  });

  return {
    bpm: tempo,
    notes: complAlphaTex,
  };
};
