/* ============================================================
   Oluwashola Akanni – Personal Site
   Vanilla JS: progress bar, reveal, nav, rotator, counters
   ============================================================ */

(function () {
  "use strict";

  /* ---- Motion preference ---- */
  var motionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  function prefersReducedMotion() {
    return !!(motionQuery && motionQuery.matches);
  }

  /* ---- Current year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Scroll progress bar ---- */
  var progress = document.getElementById("scrollProgress");
  var nav = document.getElementById("nav");

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    if (nav) nav.classList.toggle("is-scrolled", scrollTop > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el, i) {
      // subtle stagger for grouped elements
      el.style.transitionDelay = (i % 4) * 0.08 + "s";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Hero word rotator ---- */
  var rotator = document.getElementById("rotator");
  if (rotator && !prefersReducedMotion()) {
    var words = ["automation", "developer tools", "clean pipelines", "delightful UX"];
    var idx = 0;
    var rotatorTimer = setInterval(function () {
      idx = (idx + 1) % words.length;
      rotator.style.opacity = "0";
      rotator.style.transition = "opacity 0.3s ease";
      setTimeout(function () {
        rotator.textContent = words[idx];
        rotator.style.opacity = "1";
      }, 300);
    }, 2600);

    // stop rotating if the user turns reduced motion on mid-visit
    if (motionQuery && motionQuery.addEventListener) {
      motionQuery.addEventListener("change", function (e) {
        if (e.matches) {
          clearInterval(rotatorTimer);
          rotator.style.opacity = "1";
        }
      });
    }
  }

  /* ---- Animated stat counters ---- */
  var counters = document.querySelectorAll(".stat__num");
  var counted = false;
  function runCounters() {
    if (counted) return;
    var aboutStats = document.querySelector(".about__stats");
    if (!aboutStats) return;
    var rect = aboutStats.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      counted = true;
      counters.forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        if (prefersReducedMotion()) {
          el.textContent = target;
          return;
        }
        var start = 0;
        var duration = 1400;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var p = Math.min((ts - startTime) / duration, 1);
          // easeOutCubic
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(start + (target - start) * eased);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }
  window.addEventListener("scroll", runCounters, { passive: true });
  runCounters();
})();
