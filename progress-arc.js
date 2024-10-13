class ProgressArc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const percentage = this.getAttribute("percentage") || "0";
    const label = this.getAttribute("label") || "";
    const size = this.getAttribute("size") || "200";
    const thickness = this.getAttribute("thickness") || "20";
    const color = this.getAttribute("color") || "#7c3aed";
    const bgColor = this.getAttribute("bg-color") || "#e0e0e0";
    const labelSize = this.getAttribute("label-size") || "14";
    const valueSize = this.getAttribute("value-size") || "36";
    const startAngle = this.getAttribute("start-angle") || "-90";
    const direction = this.getAttribute("direction") || "clockwise";
    const fontFamily = this.getAttribute("font-family") || "Arial, sans-serif";
    const fontWeight = this.getAttribute("font-weight") || "bold";
    const progressCap = this.getAttribute("progress-cap") || "round";
    const backgroundOpacity = this.getAttribute("background-opacity") || "0.2";
    const labelColor = this.getAttribute("label-color") || "#666";
    const valueColor = this.getAttribute("value-color") || "#333";

    const radius = (size - thickness) / 2;
    const circumference = radius * 2 * Math.PI;
    const dashOffset = direction === "clockwise" ? 0 : circumference;

    this.shadowRoot.innerHTML = `
      <style>
        .progress-container {
          position: relative;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        svg {
          position: absolute;
          top: 0;
          left: 0;
          transform: rotate(${startAngle}deg);
        }
        .background {
          fill: none;
          stroke: ${bgColor};
          stroke-width: ${thickness};
          opacity: ${backgroundOpacity};
        }
        .progress {
          fill: none;
          stroke: ${color};
          stroke-width: ${thickness};
          stroke-dasharray: ${circumference};
          stroke-dashoffset: ${circumference};
          stroke-linecap: ${progressCap};
          transition: stroke-dashoffset 0.5s ease-out;
        }
        .label, .value {
          position: relative;
          text-align: center;
          width: 100%;
          line-height: 1.2;
          font-family: ${fontFamily};
          font-weight: ${fontWeight};
        }
        .label {
          font-size: ${labelSize}px;
          color: ${labelColor};
          margin-bottom: 5px;
          display: ${label ? "block" : "none"}; /* Hide if label is empty */
        }
        .value {
          font-size: ${valueSize}px;
          color: ${valueColor};
        }
      </style>
      <div class="progress-container">
        <svg width="${size}" height="${size}">
          <circle class="background" cx="${size / 2}" cy="${
      size / 2
    }" r="${radius}"/>
          <circle class="progress" cx="${size / 2}" cy="${
      size / 2
    }" r="${radius}"/>
        </svg>
        ${label ? `<div class="label">${label}</div>` : ""}
        <div class="value">0%</div>
      </div>
    `;

    this.setupAnimation();
  }

  setupAnimation() {
    const percentage = parseFloat(this.getAttribute("percentage")) || 0;
    const duration = parseFloat(this.getAttribute("duration"));
    const decimalPlaces = parseInt(this.getAttribute("decimal-places")) || 0;

    const progressCircle = this.shadowRoot.querySelector(".progress");
    const valueElement = this.shadowRoot.querySelector(".value");
    const circumference =
      parseFloat(progressCircle.getAttribute("r")) * 2 * Math.PI;

    if (duration === 0) {
      // Immediately set the final state without animation
      progressCircle.style.strokeDashoffset =
        circumference - (percentage / 100) * circumference;
      valueElement.textContent = `${percentage.toFixed(decimalPlaces)}%`;
      return;
    }

    const startTime = performance.now();
    const endTime = startTime + (duration || 1500); // Use 1500ms as default if duration is not set

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      if (currentTime >= endTime) {
        progressCircle.style.strokeDashoffset =
          circumference - (percentage / 100) * circumference;
        valueElement.textContent = `${percentage.toFixed(decimalPlaces)}%`;
        return;
      }

      const elapsedTime = currentTime - startTime;
      const rawProgress = elapsedTime / (duration || 1500);
      const easedProgress = easeOutCubic(rawProgress);
      const progress = easedProgress * percentage;

      const dashOffset = circumference - (progress / 100) * circumference;
      progressCircle.style.strokeDashoffset = dashOffset;
      valueElement.textContent = `${progress.toFixed(decimalPlaces)}%`;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}

customElements.define("progress-arc", ProgressArc);
