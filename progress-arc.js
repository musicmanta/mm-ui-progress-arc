class ProgressArc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._percentage = 0;
    this._size = 200;
    this._thickness = 20;
    this._color = "#7c3aed";
    this._bgColor = "#e0e0e0";
    this._decimalPlaces = 0;
    this._duration = 1500;
    this._currentPercentage = 0;
  }

  static get observedAttributes() {
    return [
      "percentage",
      "label",
      "size",
      "thickness",
      "color",
      "bg-color",
      "label-size",
      "value-size",
      "start-angle",
      "direction",
      "font-family",
      "font-weight",
      "progress-cap",
      "background-opacity",
      "label-color",
      "value-color",
      "duration",
      "decimal-places",
    ];
  }

  connectedCallback() {
    this.updateArc();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[`_${name.replace("-", "")}`] = newValue;
      this.updateArc();
    }
  }

  updateArc() {
    // Handle percentage out of range
    this._percentage = Math.max(
      0,
      Math.min(100, parseFloat(this._percentage) || 0)
    );

    // Handle invalid size
    this._size = Math.max(50, parseFloat(this._size) || 200);

    // Handle invalid thickness
    const maxThickness = this._size / 4;
    this._thickness = Math.min(
      maxThickness,
      Math.max(1, parseFloat(this._thickness) || 20)
    );

    // Handle invalid colors
    this._color = this.isValidColor(this._color) ? this._color : "#7c3aed";
    this._bgColor = this.isValidColor(this._bgColor)
      ? this._bgColor
      : "#e0e0e0";

    // Handle invalid direction
    this._direction =
      this._direction === "counterclockwise" ? "counterclockwise" : "clockwise";

    // Handle excessive decimal places
    this._decimalPlaces = Math.min(
      2,
      Math.max(0, parseInt(this._decimalPlaces) || 0)
    );

    // Handle invalid duration
    this._duration = Math.max(0, parseFloat(this._duration) || 1500);

    this.render();
    this.animate();
  }

  isValidColor(color) {
    const s = new Option().style;
    s.color = color;
    return s.color !== "";
  }

  render() {
    const radius = (this._size - this._thickness) / 2;
    const circumference = radius * 2 * Math.PI;
    const startAngle = this.getAttribute("start-angle") || "-90";
    const label = this.getAttribute("label") || "";

    this.shadowRoot.innerHTML = `
      <style>
        .progress-container {
          position: relative;
          width: ${this._size}px;
          height: ${this._size}px;
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
          stroke: ${this._bgColor};
        }
        .progress {
          fill: none;
          stroke: ${this._color};
          stroke-linecap: round;
          transition: stroke-dashoffset 0.5s ease-out;
        }
        .label, .value {
          position: relative;
          text-align: center;
          line-height: 1.2;
        }
        .label {
          font-size: ${this._labelsize || "14"}px;
          margin-bottom: 5px;
          ${label ? "" : "display: none;"}
        }
        .value {
          font-size: ${this._valuesize || "36"}px;
          font-weight: bold;
        }
      </style>
      <div class="progress-container">
        <svg width="${this._size}" height="${this._size}">
          <circle class="background"
            cx="${this._size / 2}"
            cy="${this._size / 2}"
            r="${radius}"
            stroke-width="${this._thickness}"
          />
          <circle class="progress"
            cx="${this._size / 2}"
            cy="${this._size / 2}"
            r="${radius}"
            stroke-width="${this._thickness}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference}"
          />
        </svg>
        ${label ? `<div class="label">${label}</div>` : ""}
        <div class="value">0%</div>
      </div>
    `;
  }

  animate() {
    const progress = this.shadowRoot.querySelector(".progress");
    const valueDisplay = this.shadowRoot.querySelector(".value");
    const radius = (this._size - this._thickness) / 2;
    const circumference = radius * 2 * Math.PI;

    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / this._duration, 1);
      const easedProgress = this.easeOutCubic(progress);

      const currentPercentage = easedProgress * this._percentage;
      const dashOffset =
        circumference - (currentPercentage / 100) * circumference;

      this.shadowRoot.querySelector(".progress").style.strokeDashoffset =
        dashOffset;
      valueDisplay.textContent = `${currentPercentage.toFixed(
        this._decimalPlaces
      )}%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}

customElements.define("progress-arc", ProgressArc);
