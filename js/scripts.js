var myCarousel = document.querySelector('#carouselControls');
var carousel;
var myModalEl = document.getElementById('portfolioModal');
myModalEl.addEventListener('show.bs.modal', function (event) {
  const _idx = event.relatedTarget.getAttribute('data-photo-idx');
  if (!carousel) {
    carousel = new bootstrap.Carousel(myCarousel, {
      interval: false
    });
  }
  carousel.to(_idx);
});