import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnnotationsControl } from "../../src/components/Annotations/Control";
import React from "react";

describe("AnnotationsControl", () => {
  it("should render", () => {
    render(<AnnotationsControl />);
  });
});
