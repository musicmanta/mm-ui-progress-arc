class ProgressArc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._percentage = 0;
    this._size = 200;
    this._thickness = 20;
    this._color = "#7c3aed";
    this._bgColor = "#e0e0e0";
    this._labelColor = "#000000";
    this._valueColor = "#000000";
    this._decimalPlaces = 0;
    this._duration = 1500;
    this._currentPercentage = 0;
    this.MIN_SIZE = 100; // Define minimum size constant
    this.MAX_DECIMAL_PLACES = 4; // Define maximum decimal places
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
      "duration",
      "decimal-places",
      "label-color",
      "value-color",
    ];
  }

  connectedCallback() {
    this.render();
    this.updateArc(true);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "size") {
        // Clamp size to minimum value
        this._size = Math.max(
          this.MIN_SIZE,
          parseInt(newValue) || this.MIN_SIZE
        );
      } else if (name === "thickness") {
        // Clamp thickness to maximum of half the diameter
        const maxThickness = this._size / 2;
        this._thickness = Math.min(
          maxThickness,
          Math.max(1, parseInt(newValue) || 20)
        );
      } else if (
        ["color", "bg-color", "label-color", "value-color"].includes(name)
      ) {
        // Validate color inputs
        this[`_${name.replace("-", "")}`] =
          this.validateColor(newValue) || this[`_${name.replace("-", "")}`];
      } else if (name === "decimal-places") {
        // Clamp decimal places between 0 and MAX_DECIMAL_PLACES
        this._decimalPlaces = Math.min(
          this.MAX_DECIMAL_PLACES,
          Math.max(0, parseInt(newValue) || 0)
        );
      } else {
        this[`_${name.replace("-", "")}`] = newValue;
      }
      if (this.shadowRoot) {
        this.updateArc(name === "percentage");
      }
    }
  }

  validateColor(color) {
    // Simple color validation regex
    const colorRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (colorRegex.test(color)) {
      return color;
    }
    // You could add more complex color validation here (e.g., named colors, rgb(), etc.)
    return null;
  }

  render() {
    const startAngle = this.getAttribute("start-angle") || "-90";
    const label = this.getAttribute("label") || "";
    const backgroundOpacity = this.getAttribute("background-opacity") || 1;
    this._labelColor = this.getAttribute("label-color") || "#000000";
    this._valueColor = this.getAttribute("value-color") || "#000000";

    // Ensure thickness is not greater than half the diameter
    const maxThickness = this._size / 2;
    this._thickness = Math.min(maxThickness, this._thickness);

    const radius = (this._size - this._thickness) / 2;

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
          opacity: ${backgroundOpacity};
        }
        .progress {
          fill: none;
          stroke: ${this._color};
          stroke-linecap: ${this.getAttribute("progress-cap") || "round"};
          transition: stroke-dashoffset ${this._duration}ms ease-out;
        }
        .label, .value {
          position: relative;
          text-align: center;
          line-height: 1.2;
          font-family: ${
            this.getAttribute("font-family") || "Arial, sans-serif"
          };
          font-weight: ${this.getAttribute("font-weight") || "bold"};
        }
        .label {
          font-size: ${this.getAttribute("label-size") || "14"}px;
          margin-bottom: 5px;
          color: ${this._labelColor};
          ${label ? "" : "display: none;"}
        }
        .value {
          font-size: ${this.getAttribute("value-size") || "36"}px;
          color: ${this._valueColor};
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
            stroke-dasharray="0 100"
          />
        </svg>
        ${label ? `<div class="label">${label}</div>` : ""}
        <div class="value">0%</div>
      </div>
    `;
  }

  updateArc(animate = false) {
    const progress = this.shadowRoot.querySelector(".progress");
    const valueDisplay = this.shadowRoot.querySelector(".value");
    const radius = (this._size - this._thickness) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min(
      100,
      Math.max(0, parseFloat(this._percentage) || 0)
    );
    const dashOffset = circumference - (percentage / 100) * circumference;

    if (parseInt(this._duration) === 0 || !animate) {
      progress.style.transition = "none";
      progress.setAttribute(
        "stroke-dasharray",
        `${circumference} ${circumference}`
      );
      progress.setAttribute("stroke-dashoffset", dashOffset);
      valueDisplay.textContent = this.formatPercentage(percentage);
    } else {
      progress.style.transition = `stroke-dashoffset ${this._duration}ms ease-out`;
      progress.setAttribute(
        "stroke-dasharray",
        `${circumference} ${circumference}`
      );
      progress.setAttribute("stroke-dashoffset", circumference); // Start from 0%
      setTimeout(() => {
        progress.setAttribute("stroke-dashoffset", dashOffset);
        this.animateValue(0, percentage); // Always start from 0
      }, 50);
    }

    this._currentPercentage = percentage;
  }

  animateValue(start, end) {
    const valueDisplay = this.shadowRoot.querySelector(".value");
    const duration = parseInt(this._duration);
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const currentValue =
          start + (end - start) * this.easeOutCubic(progress);
        valueDisplay.textContent = this.formatPercentage(currentValue);
        requestAnimationFrame(updateValue);
      } else {
        valueDisplay.textContent = this.formatPercentage(end);
      }
    };

    requestAnimationFrame(updateValue);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  formatPercentage(value) {
    return `${value.toFixed(this._decimalPlaces)}%`;
  }
}

customElements.define("progress-arc", ProgressArc);
