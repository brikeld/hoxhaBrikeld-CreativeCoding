export default function Undo(allLines, placedIcons, placedTexts) {
    // Check if any lines, icons, or texts exist and undo the last added element
    if (allLines.length > 0) {
      allLines.pop(); // Remove the last drawn line
    } else if (placedIcons.length > 0) {
      placedIcons.pop(); // Remove the last placed icon
    } else if (placedTexts.length > 0) {
      placedTexts.pop(); // Remove the last placed text
    }
  }
  