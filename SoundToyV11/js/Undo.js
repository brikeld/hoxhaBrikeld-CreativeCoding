import * as SEGMENT from './Segment.js';

export default function Undo(allLines, placedIcons, placedTexts, playedSounds) {
    // Check if any lines, icons, or texts exist and undo the last added element
    if (placedIcons.length > 0) {
        placedIcons.pop(); // Remove the last placed icon
        playedSounds.pop(); // Remove the last played sound
    } else if (placedTexts.length > 0) {
        placedTexts.pop(); // Remove the last placed text
        playedSounds.pop(); // Remove the last played sound
    } else if (allLines.length > 0) {
        const segment = SEGMENT.removeLastsegment();
        if (segment) {
            segment.lines.forEach(line => {
                const index = allLines.indexOf(line);
                if (index > -1) {
                    allLines.splice(index, 1);
                }
            });
            playedSounds.pop(); // Remove the last played sound
        }
    }
}
