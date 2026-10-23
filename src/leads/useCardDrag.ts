import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { StageId } from './data';

export type DragState = {
  id: string;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  overStage: StageId | null;
  beforeId: string | null;
};

const LONG_PRESS_MS = 250;
const EDGE = 48;
const SCROLL_SPEED = 12;

/** Finds the column under the pointer and the card the dragged one would land before. */
function locate(x: number, y: number, dragId: string) {
  const column = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-stage]');
  if (!column) return { overStage: null, beforeId: null };
  const before = [...column.querySelectorAll<HTMLElement>('[data-lead-id]')]
    .filter((card) => card.dataset.leadId !== dragId)
    .find((card) => {
      const rect = card.getBoundingClientRect();
      return y < rect.top + rect.height / 2;
    });
  return { overStage: column.dataset.stage as StageId, beforeId: before?.dataset.leadId ?? null };
}

/**
 * Pointer-based drag and drop, so it works with mouse and touch alike.
 * Mouse drags start after a few pixels of movement; touch drags start on a long press,
 * so a normal swipe still scrolls the board.
 */
export function useCardDrag(onDrop: (id: string, stage: StageId, beforeId: string | null) => void) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const onDropRef = useRef(onDrop);

  useEffect(() => {
    onDropRef.current = onDrop;
  });

  function startDrag(e: ReactPointerEvent<HTMLElement>, id: string) {
    if (e.button !== 0 || (e.target as HTMLElement).closest('select, button, a, input')) return;

    const card = e.currentTarget;
    const pointerId = e.pointerId;
    const isTouch = e.pointerType !== 'mouse';
    const start = { x: e.clientX, y: e.clientY };
    let pointer = start;
    let active = false;
    let frame = 0;
    const timer = isTouch ? window.setTimeout(begin, LONG_PRESS_MS) : 0;

    function begin() {
      active = true;
      const rect = card.getBoundingClientRect();
      setDrag({
        id,
        x: pointer.x,
        y: pointer.y,
        offsetX: start.x - rect.left,
        offsetY: start.y - rect.top,
        width: rect.width,
        height: rect.height,
        ...locate(pointer.x, pointer.y, id),
      });
      if (isTouch) navigator.vibrate?.(15);
      frame = requestAnimationFrame(autoScroll);
    }

    function update() {
      setDrag((d) => d && { ...d, x: pointer.x, y: pointer.y, ...locate(pointer.x, pointer.y, id) });
    }

    // Scrolls the board sideways (and the page vertically) while the card is held near an edge.
    function autoScroll() {
      const board = boardRef.current;
      let scrolled = false;
      if (board) {
        const rect = board.getBoundingClientRect();
        if (pointer.x < rect.left + EDGE) {
          board.scrollLeft -= SCROLL_SPEED;
          scrolled = true;
        } else if (pointer.x > rect.right - EDGE) {
          board.scrollLeft += SCROLL_SPEED;
          scrolled = true;
        }
      }
      if (pointer.y < EDGE) {
        window.scrollBy(0, -SCROLL_SPEED);
        scrolled = true;
      } else if (pointer.y > window.innerHeight - EDGE) {
        window.scrollBy(0, SCROLL_SPEED);
        scrolled = true;
      }
      if (scrolled) update();
      frame = requestAnimationFrame(autoScroll);
    }

    function onMove(ev: PointerEvent) {
      if (ev.pointerId !== pointerId) return;
      pointer = { x: ev.clientX, y: ev.clientY };
      if (active) return update();
      const distance = Math.hypot(pointer.x - start.x, pointer.y - start.y);
      // A finger that moves before the long press fires is scrolling, not dragging.
      if (isTouch && distance > 8) finish();
      else if (!isTouch && distance > 4) begin();
    }

    function onUp(ev: PointerEvent) {
      if (ev.pointerId !== pointerId) return;
      if (active) {
        const { overStage, beforeId } = locate(ev.clientX, ev.clientY, id);
        if (overStage) onDropRef.current(id, overStage, beforeId);
      }
      finish();
    }

    function onCancel(ev: PointerEvent) {
      if (ev.pointerId === pointerId) finish();
    }

    // Stops the page from scrolling under the finger once a touch drag is under way.
    function blockTouchScroll(ev: TouchEvent) {
      if (active) ev.preventDefault();
    }

    function finish() {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('touchmove', blockTouchScroll);
      if (active) setDrag(null);
      active = false;
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    window.addEventListener('touchmove', blockTouchScroll, { passive: false });
  }

  return { drag, boardRef, startDrag };
}
