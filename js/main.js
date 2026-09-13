(function () {
  "use strict";

  document.body.classList.add("is-loading");

  /* -----------------------------------------------------
     Preloader
  ----------------------------------------------------- */
  var preloader = document.getElementById("preloader");
  var minTime = 1200;
  var startTime = Date.now();

  function hidePreloader() {
    var elapsed = Date.now() - startTime;
    var wait = Math.max(minTime - elapsed, 0);
    window.setTimeout(function () {
      preloader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, wait);
  }

  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader);
    window.setTimeout(hidePreloader, 3500); // fallback safety
  }

  /* -----------------------------------------------------
     Sticky header
  ----------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 60) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* -----------------------------------------------------
     Scroll progress bar
  ----------------------------------------------------- */
  var progressBar = document.getElementById("scrollProgress");
  function onScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  onScrollProgress();
  window.addEventListener("scroll", onScrollProgress, { passive: true });

  /* -----------------------------------------------------
     Mobile nav toggle
  ----------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mainNav.querySelectorAll(".nav__link").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* -----------------------------------------------------
     Scroll-reveal animations
  ----------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* -----------------------------------------------------
     Gallery lightbox
  ----------------------------------------------------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    var img = galleryItems[index].querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showRelative(delta) {
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    var img = galleryItems[currentIndex].querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () { openLightbox(index); });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", function () { showRelative(-1); });
  lightboxNext.addEventListener("click", function () { showRelative(1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showRelative(-1);
    if (e.key === "ArrowRight") showRelative(1);
  });

  /* -----------------------------------------------------
     Contact form (client-side only)
  ----------------------------------------------------- */
  var contactForm = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        formNote.textContent = "Please fill in the required fields.";
        return;
      }
      formNote.textContent = "Thanks! Your request has been noted — we'll be in touch shortly.";
      contactForm.reset();
    });
  }

  /* -----------------------------------------------------
     Footer year
  ----------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
