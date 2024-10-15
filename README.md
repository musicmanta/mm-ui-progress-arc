# Progress Arc Component

A customizable, animated circular progress indicator built as a web component.

## Features

- Smooth animation with easing
- Customizable colors, sizes, and fonts
- Configurable start angle and direction
- Adjustable animation duration
- Responsive design
- Robust error handling and edge case management
- Decimal places limited to a maximum of 2 for readability
- Customizable label and value positions
- Cumulative Layout Shift (CLS) prevention

## Installation

Include the Progress Arc component in your project by adding the following script tag to your HTML file:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/gh/musicmanta/mm-ui-progress-arc@main/progress-arc.js"
></script>
```

## Usage

To use the Progress Arc component in your HTML, add the `<progress-arc>` custom element:

```html
<progress-arc percentage="40" label="Active users"></progress-arc>
```

## API

The Progress Arc component accepts the following attributes:

| Attribute            | Type   | Default             | Description                                                        |
| -------------------- | ------ | ------------------- | ------------------------------------------------------------------ |
| `percentage`         | Number | 0                   | The progress percentage (0-100)                                    |
| `label`              | String | ''                  | The label text above the percentage                                |
| `size`               | Number | 200                 | The size of the arc in pixels                                      |
| `thickness`          | Number | 20                  | The thickness of the arc line in pixels                            |
| `color`              | String | '#7c3aed'           | The color of the progress arc                                      |
| `bg-color`           | String | '#e0e0e0'           | The color of the background arc                                    |
| `label-size`         | Number | 14                  | Font size of the label in pixels                                   |
| `value-size`         | Number | 36                  | Font size of the percentage value in pixels                        |
| `duration`           | Number | 1500                | Animation duration in milliseconds                                 |
| `decimal-places`     | Number | 0                   | Number of decimal places for the percentage value                  |
| `start-angle`        | Number | -90                 | Starting angle of the arc in degrees                               |
| `direction`          | String | 'clockwise'         | Direction of the progress ("clockwise" or "counterclockwise")      |
| `font-family`        | String | 'Arial, sans-serif' | Font family for the text                                           |
| `font-weight`        | String | 'bold'              | Font weight for the text                                           |
| `progress-cap`       | String | 'round'             | The shape of the progress line end ("round" or "butt")             |
| `background-opacity` | Number | 1                   | Opacity of the background arc                                      |
| `label-color`        | String | '#000000'           | Color of the label text                                            |
| `value-color`        | String | '#000000'           | Color of the percentage value text                                 |
| `label-position`     | String | 'inside'            | Position of the label ('inside', 'top', 'bottom', 'left', 'right') |
| `value-position`     | String | 'inside'            | Position of the value ('inside', 'top', 'bottom', 'left', 'right') |

## Examples

### Basic Usage

```html
<progress-arc percentage="40" label="Active users"></progress-arc>
```

### Customized Appearance

```html
<progress-arc
  percentage="75"
  label="Download Progress"
  size="300"
  thickness="30"
  color="#4CAF50"
  bg-color="#E0E0E0"
  label-size="18"
  value-size="48"
  duration="2000"
  decimal-places="1"
  start-angle="0"
  direction="counterclockwise"
  font-family="Roboto, sans-serif"
  font-weight="normal"
  progress-cap="butt"
  background-opacity="0.1"
  label-color="#333333"
  value-color="#4CAF50"
  label-position="outside"
  value-position="inside"
>
</progress-arc>
```

## Webflow Integration

To use the Progress Arc component in Webflow:

1. Add the component script to your project's Custom Code in the <head> section:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/gh/musicmanta/mm-ui-progress-arc@main/progress-arc.js"
></script>
```

2. Add a Custom HTML embed in your Webflow page with the Progress Arc HTML:

```html
<progress-arc
  percentage="0"
  label="Progress"
  size="200"
  thickness="20"
  color="#7c3aed"
  bg-color="#e0e0e0"
  duration="2000"
></progress-arc>
```

3. Add the following script to your project's Custom Code at the end of the <body> section to handle animation:

```html
<script>
  document.addEventListener("DOMContentLoaded", (event) => {
    function animateProgressArc(arc, startPercentage, endPercentage, duration) {
      const startTime = performance.now();

      function update(currentTime) {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          const currentPercentage =
            startPercentage + (endPercentage - startPercentage) * progress;
          arc.setAttribute("percentage", currentPercentage.toFixed(2));
          requestAnimationFrame(update);
        } else {
          arc.setAttribute("percentage", endPercentage);
        }
      }

      requestAnimationFrame(update);
    }

    function initializeProgressArcs() {
      const arcs = document.querySelectorAll("progress-arc");
      arcs.forEach((arc, index) => {
        if (arc.updateArc) {
          setTimeout(() => {
            const duration = parseInt(arc.getAttribute("duration")) || 2000;
            animateProgressArc(arc, 0, 75, duration);
          }, 100 + index * 100); // Stagger animations if multiple arcs
        } else {
          // If component is not ready, try again after a short delay
          setTimeout(initializeProgressArcs, 50);
        }
      });
    }

    // Initial attempt to initialize and animate
    initializeProgressArcs();
  });
</script>
```

This setup ensures proper animation and CLS prevention in Webflow.

## Browser Support

This component uses modern web technologies and should work in all evergreen browsers that support Custom Elements v1 and ES6 modules.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
