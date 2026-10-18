"use client";

import { useRef, useState, type ComponentProps, type PointerEvent } from "react";
import { beginDrag, dragOffset, type Drag, type Offset } from "@/lib/drag";

// A box that moves when dragged by a child marked data-drag, kept inside its [data-drag-area].
export default function Draggable({ style, children, ...rest }: ComponentProps<"div">) {
  const [offset, setOffset] = useState<Offset>([0, 0]);
  const drag = useRef<Drag | null>(null);

  function start(event: PointerEvent<HTMLDivElement>) {
    const target = event.target as Element;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (!target.closest("[data-drag]") || target.closest("a, button")) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = beginDrag(event.currentTarget, event.clientX, event.clientY, offset);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (drag.current) setOffset(dragOffset(drag.current, event.clientX, event.clientY));
  }

  function end() {
    drag.current = null;
  }

  const [x, y] = offset;
  return (
    <div
      {...rest}
      // No transform until moved, matching the deck cards (see CardDeck).
      style={{ ...style, transform: x || y ? `translate(${x}px, ${y}px)` : undefined }}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {children}
    </div>
  );
}
