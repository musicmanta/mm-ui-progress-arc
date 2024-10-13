class ProgressArc extends HTMLElement {
  constructor() {
    super();
    this._percentage = 0;
    this._size = 200; // Default size
    this._thickness = 20;
    this._color = "#7c3aed";
    this._bgColor = "#e0e0e0";
    this._backgroundOpacity = 1;
    this._labelColor = "#000000";
    this._valueColor = "#000000";
    this._decimalPlaces = 0;
    this._duration = 1500;
    this._currentPercentage = 0;
    this.MIN_SIZE = 100; // Minimum size
    this.MAX_DECIMAL_PLACES = 2; // Changed from 4 to 2
  }

  static get observedAttributes() {
    return [
      "percentage",
      "label",
      "size",
      "thickness",
      "color",
      "bg-color",
      "start-angle",
      "direction",
      "animation-duration",
    ];
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.render();
    }
    this.updateAll();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case "percentage":
          this.updatePercentage(newValue);
          break;
        case "label":
          this.updateLabel(newValue);
          break;
        case "size":
          this.updateSize(newValue);
          break;
        case "thickness":
          this.updateThickness(newValue);
          break;
        case "color":
        case "bg-color":
          this.updateColors();
          break;
        case "start-angle":
          this.updateStartAngle(newValue);
          break;
        case "direction":
          this.updateDirection(newValue);
          break;
        case "animation-duration":
          this.updateAnimationDuration(newValue);
          break;
      }
    }
  }

  validateColor(color) {
    const colorRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (colorRegex.test(color)) {
      return color;
    }
    return null;
  }

  render() {
    // Ensure size is at least the minimum size
    const size = Math.max(this.MIN_SIZE, this._size);
    const startAngle = this.getAttribute("start-angle") || "-90";
    const label = this.getAttribute("label") || "";
    const backgroundOpacity =
      this.getAttribute("background-opacity") || this._backgroundOpacity;
    this._labelColor = this.getAttribute("label-color") || "#000000";
    this._valueColor = this.getAttribute("value-color") || "#000000";
    const labelPosition = this.getAttribute("label-position") || "inside";
    const valuePosition = this.getAttribute("value-position") || "inside";

    const radius = (size - this._thickness) / 2;

    this.shadowRoot.innerHTML = `
      <style>
        .progress-container {
          position: relative;
          width: ${size}px;
          height: ${size}px;
        }
        .svg-container {
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
          position: absolute;
          text-align: center;
          line-height: 1.2;
          font-family: ${
            this.getAttribute("font-family") || "Arial, sans-serif"
          };
          font-weight: ${this.getAttribute("font-weight") || "bold"};
          transform: translate(-50%, -50%);
          left: 50%;
        }
        .label {
          font-size: ${this.getAttribute("label-size") || "14"}px;
          color: ${this._labelColor};
          display: ${label ? "block" : "none"};
          ${this.getLabelPositionStyle(labelPosition)}
        }
        .value {
          font-size: ${this.getAttribute("value-size") || "36"}px;
          color: ${this._valueColor};
          ${this.getValuePositionStyle(valuePosition, !label)}
        }
      </style>
      <div class="progress-container">
        <svg class="svg-container" width="${size}" height="${size}">
          <circle class="background"
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            stroke-width="${this._thickness}"
          />
          <circle class="progress"
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            stroke-width="${this._thickness}"
            stroke-dasharray="0 100"
          />
        </svg>
        ${label ? `<div class="label">${label}</div>` : ""}
        <div class="value">0%</div>
      </div>
    `;

    this.updateArc(false);
  }

  getLabelPositionStyle(position) {
    switch (position) {
      case "top":
        return "top: 10%;";
      case "bottom":
        return "bottom: 10%;";
      case "left":
        return "top: 50%; left: 10%;";
      case "right":
        return "top: 50%; right: 10%; transform: translate(50%, -50%);";
      default: // inside
        return "top: 40%;";
    }
  }

  getValuePositionStyle(position, noLabel) {
    if (noLabel) {
      return "top: 50%;"; // Center the value when there's no label
    }
    switch (position) {
      case "top":
        return "top: 30%;";
      case "bottom":
        return "bottom: 30%;";
      case "left":
        return "top: 50%; left: 30%;";
      case "right":
        return "top: 50%; right: 30%; transform: translate(50%, -50%);";
      default: // inside
        return "top: 60%;";
    }
  }

  updateArc(animate = false) {
    if (!this.shadowRoot) return;

    const progress = this.shadowRoot.querySelector(".progress");
    const valueDisplay = this.shadowRoot.querySelector(".value");

    if (!progress || !valueDisplay) return;

    const radius = (this._size - this._thickness) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min(
      100,
      Math.max(0, parseFloat(this._percentage) || 0)
    );
    const dashOffset = circumference - (percentage / 100) * circumference;

    // Ensure the direction is being applied
    const startAngle = this._direction === "counterclockwise" ? 0 : Math.PI * 2;
    const endAngle =
      this._direction === "counterclockwise"
        ? (1 - percentage / 100) * Math.PI * 2
        : (percentage / 100) * Math.PI * 2;

    // Apply the calculated angles to the SVG arc
    progress.setAttribute(
      "d",
      this.describeArc(
        this._size / 2,
        this._size / 2,
        radius,
        startAngle,
        endAngle
      )
    );

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

  // Helper function to create SVG arc path
  describeArc(x, y, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  polarToCartesian(centerX, centerY, radius, angleInRadians) {
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  updateAll() {
    this.updatePercentage(this.getAttribute("percentage"));
    this.updateLabel(this.getAttribute("label"));
    this.updateSize(this.getAttribute("size"));
    this.updateThickness(this.getAttribute("thickness"));
    this.updateColors();
    this.updateStartAngle(this.getAttribute("start-angle"));
    this.updateDirection(this.getAttribute("direction"));
    this.updateAnimationDuration(this.getAttribute("animation-duration"));
  }

  updatePercentage(value) {
    const percentage = Math.min(100, Math.max(0, parseFloat(value) || 0));
    this._percentage = percentage;
    this.shadowRoot.querySelector(".value").textContent =
      percentage.toFixed(2) + "%";
    this.updateArc();
  }

  updateLabel(value) {
    const label = this.shadowRoot.querySelector(".label");
    if (label) {
      label.textContent = value || "";
      label.style.display = value ? "block" : "none";
    }
  }

  updateSize(value) {
    this._size = Math.max(this.MIN_SIZE, parseInt(value) || this._size);
    this.render();
  }

  updateThickness(value) {
    this._thickness = parseInt(value) || this._thickness;
    this.render();
  }

  updateColors() {
    this._color = this.validateColor(this.getAttribute("color")) || this._color;
    this._bgColor =
      this.validateColor(this.getAttribute("bg-color")) || this._bgColor;
    this.render();
  }

  updateStartAngle(value) {
    const startAngle = parseInt(value) || -90;
    this.shadowRoot.querySelector(
      ".svg-container"
    ).style.transform = `rotate(${startAngle}deg)`;
  }

  updateDirection(value) {
    this._direction =
      value === "counterclockwise" ? "counterclockwise" : "clockwise";
    this.updateArc();
  }

  updateAnimationDuration(value) {
    this._duration = parseInt(value) || this._duration;
    this.render();
  }
}

customElements.define("progress-arc", ProgressArc);
