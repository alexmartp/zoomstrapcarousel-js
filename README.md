# Zoomstrap Carousel

A lightweight JavaScript library that adds zoom functionality to Bootstrap carousels for product image galleries.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- Smooth image zoom with configurable zoom factor
- Mobile-friendly with touch gestures support
- Intuitive mouse movement for zoom positioning
- Seamless integration with Bootstrap carousel
- Customizable zoom behavior and animations
- Lightweight with no external dependencies (except Bootstrap)

## Installation

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/gh/alexmartp/zoomstrapcarousel-js/zoomstrap-carousel.min.js"></script>
```

## Basic Usage

1. Set up a bootstrap carousel using the default bootrstap structure

```html
<div id="product-carousel" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="product-image-1.jpg" class="d-block w-100" alt="Product Image 1">
    </div>
    <div class="carousel-item">
      <img src="product-image-2.jpg" class="d-block w-100" alt="Product Image 2">
    </div>
    <!-- More carousel items -->
  </div>
  
  <!-- Carousel controls -->
  <button class="carousel-control-prev" type="button" data-bs-target="#product-carousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#product-carousel" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
```

2. Initialize the zoom functionality:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Basic initialization
  new BootstrapZoomCarousel();
  
  // OR with options
  new BootstrapZoomCarousel({
    carouselSelector: '#product-carousel',
    zoomFactor: 2.0,
    animationDuration: 200
  });
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `carouselSelector` | String | `'#product-carousel'` | CSS selector for the carousel |
| `zoomFactor` | Number | `1.5` | Magnification level when zoomed |
| `animationDuration` | Number | `300` | Transition duration in milliseconds |
| `mobileIconSize` | Number | `24` | Size of the zoom icon on mobile devices |

## Custom Data Attributes

You can also configure the behavior using data attributes on your carousel element:

```html
<div id="product-carousel" 
     class="carousel slide" 
     data-bs-ride="carousel"
     data-zoom-factor="2.5"
     data-animation-duration="500">
  <!-- Carousel content -->
</div>
```

## Browser Support

- Chrome
- Firefox
- Safari
- Edge
- Opera
- iOS Safari
- Android Browser

## API Methods

```javascript
// Get the instance
const zoomCarousel = new BootstrapZoomCarousel({
  carouselSelector: '#product-carousel'
});

// Manual control methods
zoomCarousel.enterZoomMode(carouselItem, event);
zoomCarousel.exitZoomMode();
zoomCarousel.updateZoomPosition(event);
```

## Events

The library works with standard Bootstrap carousel events and adds a few custom ones:

```javascript
document.querySelector('#product-carousel').addEventListener('zoommodeentered', function(e) {
  console.log('Zoom mode entered');
});

document.querySelector('#product-carousel').addEventListener('zoommodeexited', function(e) {
  console.log('Zoom mode exited');
});
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/) - The most popular HTML, CSS, and JS library