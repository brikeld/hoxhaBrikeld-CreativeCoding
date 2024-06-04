export const segments = []

export function startSegment() {
    
  segments.push({
    lines: [],
  })
}

export function addLine(line) {
    segments[segments.length - 1]?.lines.push(line)
}

export function removeLastsegment() {
    return segments.pop()
}