export type Offset = [number, number];

export type Drag = {
  startX: number;
  startY: number;
  origin: Offset;
  // Offset limits that keep the element inside its nearest [data-drag-area].
  min: Offset;
  max: Offset;
};

export function beginDrag(element: Element, clientX: number, clientY: number, origin: Offset): Drag {
  const box = element.getBoundingClientRect();
  const areaElement = element.parentElement!.closest("[data-drag-area]")!;
  const area = areaElement.getBoundingClientRect();
  // data-drag-area="12" keeps elements 12px inside the area's edges.
  const inset = Number(areaElement.getAttribute("data-drag-area")) || 0;
  return {
    startX: clientX,
    startY: clientY,
    origin,
    min: [origin[0] + area.left + inset - box.left, origin[1] + area.top + inset - box.top],
    max: [origin[0] + area.right - inset - box.right, origin[1] + area.bottom - inset - box.bottom],
  };
}

export function dragOffset(drag: Drag, clientX: number, clientY: number): Offset {
  const clamp = (value: number, axis: 0 | 1) => Math.min(Math.max(value, drag.min[axis]), drag.max[axis]);
  return [
    clamp(drag.origin[0] + clientX - drag.startX, 0),
    clamp(drag.origin[1] + clientY - drag.startY, 1),
  ];
}
