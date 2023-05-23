import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnnotationsControl } from "../../src/components/Annotations/Control";
import React from "react";
import {
  AnnotationsContextProvider,
  AppContextProvider,
} from "../../src/context";

describe("AnnotationsControl", () => {
  it("should render", () => {
    render(
      <AppContextProvider>
        <AnnotationsContextProvider>
          <AnnotationsControl />
        </AnnotationsContextProvider>
      </AppContextProvider>
    );
    expect(screen);
  });
});
