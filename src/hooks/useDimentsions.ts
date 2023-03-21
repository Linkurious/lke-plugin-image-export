import { useCallback, useState, useLayoutEffect } from "react";

export function useDimensions(): [
  (node: HTMLDivElement) => void,
  DOMRect | undefined
] {
  const [node, setNode] = useState<HTMLElement>();
  const ref = useCallback((node: HTMLElement) => setNode(node), []);
  const [dimensions, setDimensions] = useState<DOMRect>();
  useLayoutEffect(() => {
    if (node) setDimensions(node.getBoundingClientRect());
  }, [node]);
  return [ref, dimensions];
}
