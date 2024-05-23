import Line from "./Line";



export default function PlayFunction(allLines, monPiano) {
  let delay = 0;
  allLines.forEach((line) => {
    setTimeout(() => {
      line.playNote();
    }, delay);
    delay += 1500; 
  });
}