// Shared geometry for the hand-drawn SVG charts.
//
// Charts are drawn rather than pulled from a chart library so each one can
// animate itself in — a stroke drawing along its own path, bars growing from
// the baseline — and so the whole dashboard shares one visual language.
//
// All charts render into a fixed viewBox and stretch with
// preserveAspectRatio="none". Strokes carry vector-effect="non-scaling-stroke"
// so they stay an even width however the box is scaled.
export const VIEW = { width: 300, height: 120 };

export function scalePoints(values, { width = VIEW.width, height = VIEW.height, padY = 10 } = {}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  return values.map((value, index) => ({
    x: index * step,
    y: height - padY - ((value - min) / span) * (height - padY * 2),
    value,
  }));
}

// A smooth curve through the points, using a simple midpoint bezier so the
// line reads as a trend rather than a zigzag.
export function toSmoothPath(points) {
  if (points.length < 2) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1];
    const current = points[i];
    const midX = (previous.x + current.x) / 2;
    path += ` Q ${previous.x} ${previous.y} ${midX} ${(previous.y + current.y) / 2}`;
    path += ` Q ${current.x} ${current.y} ${current.x} ${current.y}`;
  }
  return path;
}

export function toAreaPath(points, height = VIEW.height) {
  if (points.length < 2) return '';
  return `${toSmoothPath(points)} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
}

export const CHART_EASE = [.16, 1, .3, 1];
