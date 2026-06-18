const swiper = new Swiper(".cuteSwiper", {
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    spaceBetween: 30,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    effect: "coverflow",
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 120,
      modifier: 2,
      slideShadows: false,
    },
  });

  function openPreview(src) {
    const modal = document.getElementById("previewModal");
    const img = document.getElementById("previewImage");
    img.src = src;
    modal.classList.remove("hidden");
  }

  function closePreview() {
    const modal = document.getElementById("previewModal");
    modal.classList.add("hidden");
  }