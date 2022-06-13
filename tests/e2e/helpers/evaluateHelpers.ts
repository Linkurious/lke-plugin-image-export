import type Ogma from '@linkurious/ogma';

declare global {
  interface Window {
    ogma: Ogma;
  }
}

export const elementsSize = (): number[] => {
  return [window.ogma.getNodes().size, window.ogma.getEdges().size];
};
