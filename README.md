# Progress Arc

A customizable, animated circular progress indicator built as a web component.

## Features

- Smooth animation with easing
- Customizable colors, sizes, and fonts
- Configurable start angle and direction
- Adjustable animation duration
- Responsive design

## Installation

You can include the Progress Arc component in your project by adding the following script tag to your HTML file:

```html
<script type="module" src="path/to/progress-arc.js"></script>
```

## Usage

To use the Progress Arc component in your HTML, simply add the `<progress-arc>` custom element:

```html
<progress-arc 
  percentage="40" 
  label="Active users">
</progress-arc>
```

## API

The Progress Arc component accepts the following attributes:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `percentage` | Number | 0 | The progress percentage (0-100) |
| `label` | String | '' | The label text above the percentage |
| `size` | Number | 200 | The size of the arc in pixels |
| `thickness` | Number | 20 | The thickness of the arc line in pixels |
| `color` | String | '#7c3aed' | The color of the progress arc |
| `bg-color` | String | '#e0e0e0' | The color of the background arc |
| `label-size` | Number | 14 | Font size of the label in pixels |
| `value-size` | Number | 36 | Font size of the percentage value in pixels |
| `duration` | Number | 1500 | Animation duration in milliseconds |
| `decimal-places` | Number | 0 | Number of decimal places for the percentage value |
| `start-angle` | Number | -90 | Starting angle of the arc in degrees |
| `direction` | String | 'clockwise' | Direction of the progress ("clockwise" or "counterclockwise") |
| `font-family` | String | 'Arial, sans-serif' | Font family for the text |
| `font-weight` | String | 'bold' | Font weight for the text |
| `progress-cap` | String | 'round' | The shape of the progress line end ("round" or "butt") |
| `background-opacity` | Number | 0.2 | Opacity of the background arc |

## Examples

### Basic Usage

```html
<progress-arc 
  percentage="40" 
  label="Active users">
</progress-arc>
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
  background-opacity="0.1">
</progress-arc>
```

## Browser Support

This component uses modern web technologies and should work in all evergreen browsers that support Custom Elements v1 and ES6 modules.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.