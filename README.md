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

## Installation

Include the Progress Arc component in your project by adding the following script tag to your HTML file:

```html
<script type="module" src="path/to/progress-arc.js"></script>
```

## Usage

To use the Progress Arc component in your HTML, add the `<progress-arc>` custom element:

```html
<progress-arc percentage="40" label="Active users"> </progress-arc>
```

## API

The Progress Arc component accepts the following attributes:

| Attribute            | Type   | Default             | Description                                                   |
| -------------------- | ------ | ------------------- | ------------------------------------------------------------- |
| `percentage`         | Number | 0                   | The progress percentage (0-100)                               |
| `label`              | String | ''                  | The label text above the percentage                           |
| `size`               | Number | 200                 | The size of the arc in pixels                                 |
| `thickness`          | Number | 20                  | The thickness of the arc line in pixels                       |
| `color`              | String | '#7c3aed'           | The color of the progress arc                                 |
| `bg-color`           | String | '#e0e0e0'           | The color of the background arc                               |
| `label-size`         | Number | 14                  | Font size of the label in pixels                              |
| `value-size`         | Number | 36                  | Font size of the percentage value in pixels                   |
| `duration`           | Number | 1500                | Animation duration in milliseconds                            |
| `decimal-places`     | Number | 0                   | Number of decimal places for the percentage value             |
| `start-angle`        | Number | -90                 | Starting angle of the arc in degrees                          |
| `direction`          | String | 'clockwise'         | Direction of the progress ("clockwise" or "counterclockwise") |
| `font-family`        | String | 'Arial, sans-serif' | Font family for the text                                      |
| `font-weight`        | String | 'bold'              | Font weight for the text                                      |
| `progress-cap`       | String | 'round'             | The shape of the progress line end ("round" or "butt")        |
| `background-opacity` | Number | 0.2                 | Opacity of the background arc                                 |

## Examples

### Basic Usage

```html
<progress-arc percentage="40" label="Active users"> </progress-arc>
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
>
</progress-arc>
```

## Edge Cases and Error Handling

The Progress Arc component is designed to handle various edge cases gracefully. Here are some examples of how it manages potentially problematic inputs:

### Percentage Out of Range

```html
<progress-arc percentage="150" label="Over 100%"></progress-arc>
<progress-arc percentage="-20" label="Negative percentage"></progress-arc>
```

In these cases, the component will clamp the percentage to the valid range (0-100). A console warning will be logged:

```
console.warn('Progress Arc: Percentage value out of range. Clamping to 0-100.');
```

### Invalid Size or Thickness

```html
<progress-arc
  percentage="50"
  size="-100"
  thickness="5"
  label="Negative size"
></progress-arc>
<progress-arc
  percentage="50"
  size="100"
  thickness="60"
  label="Thickness > radius"
></progress-arc>
```

The component will use default values for invalid sizes or thicknesses. Console warnings will be logged:

```
console.warn('Progress Arc: Invalid size. Using default value.');
console.warn('Progress Arc: Thickness cannot be greater than radius. Adjusting to fit.');
```

### Invalid Color Values

```html
<progress-arc
  percentage="60"
  color="not-a-color"
  bg-color="#FF00"
  label="Invalid colors"
></progress-arc>
```

The component will fall back to default colors for invalid color strings. A console warning will be logged:

```
console.warn('Progress Arc: Invalid color value. Using default color.');
```

### Non-Numeric Inputs for Numeric Attributes

```html
<progress-arc
  percentage="half"
  size="large"
  label="Non-numeric inputs"
></progress-arc>
```

The component will attempt to parse numeric values and fall back to defaults if parsing fails. Console warnings will be logged:

```
console.warn('Progress Arc: Invalid numeric input. Using default value.');
```

### Excessive Decimal Places

```html
<progress-arc
  percentage="33.33333"
  decimal-places="10"
  label="Too many decimals"
></progress-arc>
```

The component will limit the maximum number of decimal places to prevent visual clutter. A console info message will be logged:

```
console.info('Progress Arc: Decimal places limited to improve readability.');
```

### Invalid Direction

```html
<progress-arc
  percentage="75"
  direction="sideways"
  label="Invalid direction"
></progress-arc>
```

The component will default to 'clockwise' for any invalid direction input. A console warning will be logged:

```
console.warn('Progress Arc: Invalid direction. Defaulting to clockwise.');
```

These edge cases are handled gracefully by the component to prevent errors and maintain a consistent appearance. Developers can monitor the console for warnings and adjust their usage accordingly.

## Browser Support

This component uses modern web technologies and should work in all evergreen browsers that support Custom Elements v1 and ES6 modules.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
