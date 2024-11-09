class ProgressArc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._percentage = 0;
    this._size = 200;
    this._thickness = 20;
    this._color = "#7c3aed";
    this._bgColor = "#e0e0e0";
    this._backgroundOpacity = 1;
    this._labelColor = "#000000";
    this._valueColor = "#000000";
    this._decimalPlaces = 0;
    this._duration = 1500;
    this._currentPercentage = 0;
    this.MIN_SIZE = 100;
    this.MAX_DECIMAL_PLACES = 2;

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: inline-block;
        position: relative;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      :host(.loaded) {
        opacity: 1;
      }
      .placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: var(--bg-color, #e0e0e0);
      }
    `;
    this.shadowRoot.appendChild(style);

    const placeholder = document.createElement("div");
    placeholder.classList.add("placeholder");
    this.shadowRoot.appendChild(placeholder);
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
    this._currentPercentage = 0;
    this.updateArc(false);

    setTimeout(() => {
      const placeholder = this.shadowRoot.querySelector(".placeholder");
      if (placeholder) {
        placeholder.remove();
      }
      this.classList.add("loaded");

      setTimeout(() => {
        this.updateArc(true);
      }, 50);
    }, 0);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "bg-color") {
        this._bgColor = this.validateColor(newValue) || this._bgColor;
      } else if (name === "background-opacity") {
        this._backgroundOpacity = parseFloat(newValue) || 1;
      } else if (name === "size") {
        this._size = Math.max(this.MIN_SIZE, parseInt(newValue) || this._size);
      } else if (name === "decimal-places") {
        this._decimalPlaces = Math.min(
          this.MAX_DECIMAL_PLACES,
          Math.max(0, parseInt(newValue) || 0)
        );
      } else if (name === "percentage") {
        this._percentage = Math.min(
          100,
          Math.max(0, parseFloat(newValue) || 0)
        );
        this.updateArc(true);
      } else {
        this[`_${name.replace("-", "")}`] = newValue;
      }

      if (this.isConnected && this.shadowRoot) {
        this.render();
        this.updateArc(name === "percentage");
      }
    }
  }

  validateColor(color) {
    const colorRegex = /^#([0-9A-F]{3}){1,2}$/i;
    return colorRegex.test(color) ? color : null;
  }

  render() {
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
    const circumference = radius * 2 * Math.PI;

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
            stroke-dasharray="${circumference} ${circumference}"
            stroke-dashoffset="${circumference}"
          />
        </svg>
        ${label ? `<div class="label">${label}</div>` : ""}
        <div class="value">0%</div>
      </div>
    `;
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
      default:
        return "top: 40%;";
    }
  }

  getValuePositionStyle(position, noLabel) {
    if (noLabel) {
      return "top: 50%;";
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
      default:
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
    const newPercentage = Math.min(
      100,
      Math.max(0, parseFloat(this._percentage) || 0)
    );
    const newDashOffset = ((100 - newPercentage) / 100) * circumference;

    progress.style.strokeDasharray = `${circumference} ${circumference}`;

    if (animate && parseInt(this._duration) > 0 && window.gsap) {
      gsap.fromTo(
        progress,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: newDashOffset,
          duration: this._duration / 1000,
          ease: "power2.out",
        }
      );

      this.animateValue(0, newPercentage);
    } else {
      progress.style.strokeDashoffset = newDashOffset;
      valueDisplay.textContent = this.formatPercentage(newPercentage);
    }

    this._currentPercentage = newPercentage;
  }

  animateValue(start, end) {
    const valueDisplay = this.shadowRoot.querySelector(".value");
    const duration = parseInt(this._duration) / 1000;

    gsap.fromTo(
      { value: start },
      {
        value: end,
        duration: duration,
        ease: "power2.out",
        onUpdate: function () {
          valueDisplay.textContent = this.formatPercentage(
            this.targets()[0].value
          );
        }.bind(this),
      }
    );
  }

  formatPercentage(value) {
    return `${value.toFixed(this._decimalPlaces)}%`;
  }
}

customElements.define("progress-arc", ProgressArc);
