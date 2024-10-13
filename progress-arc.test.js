// At the top of your test file
window.customElements = {
  define: jest.fn(),
};

import "./progress-arc.js";

describe("ProgressArc", () => {
  let progressArc;

  beforeEach(() => {
    progressArc = document.createElement("progress-arc");
    document.body.appendChild(progressArc);
    // Force the component to render
    progressArc.connectedCallback();
  });

  afterEach(() => {
    document.body.removeChild(progressArc);
  });

  function waitForUpdate() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
  }

  test("renders with default values", async () => {
    await waitForUpdate();
    expect(
      progressArc.shadowRoot.querySelector(".progress-container")
    ).not.toBeNull();
    expect(progressArc.shadowRoot.querySelector(".value").textContent).toBe(
      "0%"
    );
    // Check if .label exists before accessing its textContent
    const label = progressArc.shadowRoot.querySelector(".label");
    expect(label ? label.textContent : "").toBe("");
  });

  test("updates percentage when attribute changes", async () => {
    progressArc.setAttribute("percentage", "50");
    await waitForUpdate();
    expect(progressArc.shadowRoot.querySelector(".value").textContent).toBe(
      "50%"
    );
  });

  test("handles invalid percentage values", async () => {
    progressArc.setAttribute("percentage", "150");
    await waitForUpdate();
    expect(progressArc.shadowRoot.querySelector(".value").textContent).toBe(
      "100%"
    );

    progressArc.setAttribute("percentage", "-20");
    await waitForUpdate();
    expect(progressArc.shadowRoot.querySelector(".value").textContent).toBe(
      "0%"
    );
  });

  test("updates label when attribute changes", () => {
    progressArc.setAttribute("label", "Test Label");
    expect(progressArc.shadowRoot.querySelector(".label").textContent).toBe(
      "Test Label"
    );
  });

  test("updates size when attribute changes", () => {
    progressArc.setAttribute("size", "200");
    expect(
      progressArc.shadowRoot.querySelector("svg").getAttribute("width")
    ).toBe("200");
    expect(
      progressArc.shadowRoot.querySelector("svg").getAttribute("height")
    ).toBe("200");
  });

  test("updates thickness when attribute changes", () => {
    progressArc.setAttribute("thickness", "20");
    expect(
      progressArc.shadowRoot
        .querySelector(".background")
        .getAttribute("stroke-width")
    ).toBe("20");
    expect(
      progressArc.shadowRoot
        .querySelector(".progress")
        .getAttribute("stroke-width")
    ).toBe("20");
  });

  test("updates colors when attributes change", async () => {
    progressArc.setAttribute("color", "#FF0000");
    progressArc.setAttribute("bg-color", "#00FF00");
    await waitForUpdate();
    expect(
      progressArc.shadowRoot.querySelector(".progress").getAttribute("stroke")
    ).toBe("#FF0000");
    expect(
      progressArc.shadowRoot.querySelector(".background").getAttribute("stroke")
    ).toBe("#00FF00");
  });

  test("handles invalid color values", () => {
    progressArc.setAttribute("color", "invalid");
    progressArc.setAttribute("bg-color", "invalid");
    expect(
      progressArc.shadowRoot.querySelector(".progress").getAttribute("stroke")
    ).not.toBe("invalid");
    expect(
      progressArc.shadowRoot.querySelector(".background").getAttribute("stroke")
    ).not.toBe("invalid");
  });

  test("updates start angle when attribute changes", async () => {
    progressArc.setAttribute("start-angle", "90");
    await waitForUpdate();
    const transform = progressArc.shadowRoot
      .querySelector(".progress")
      .getAttribute("transform");
    expect(transform).toContain("rotate(90");
  });

  test("updates direction when attribute changes", async () => {
    progressArc.setAttribute("direction", "ccw");
    await waitForUpdate();
    const transform = progressArc.shadowRoot
      .querySelector(".progress")
      .getAttribute("transform");
    expect(transform).toContain("scale(-1, 1)");
  });

  test("updates animation duration when attribute changes", async () => {
    progressArc.setAttribute("animation-duration", "2000");
    await waitForUpdate();
    const style = progressArc.shadowRoot.querySelector("style").textContent;
    expect(style).toContain("transition: stroke-dashoffset 2000ms ease-out");
  });

  test("formats percentage with correct decimal places", async () => {
    progressArc.setAttribute("percentage", "33.333");
    await waitForUpdate();
    expect(progressArc.shadowRoot.querySelector(".value").textContent).toBe(
      "33.33%"
    );

    progressArc.setAttribute("percentage", "66.6");
    await waitForUpdate();
    expect(progressArc.shadowRoot.querySelector(".value").textContent).toBe(
      "66.6%"
    );
  });

  // Add more tests for other attributes, methods, and edge cases
});
