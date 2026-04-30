/**
 * EHub Telematics — static site behaviors
 * - Mobile nav toggle
 * - Smooth scroll-friendly offset (sticky header)
 * - Scroll reveal
 * - Metric counters
 */

(function () {
  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    siteNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /** Scroll reveal */
  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    revealItems.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /** Animated counters for .metric-value[data-target] */
  function animateValue(el, target, suffix) {
    suffix = suffix || "";
    var duration = 1400;
    var start = 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = Math.floor(start + (target - start) * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll(".metric-value[data-target]").forEach(function (el) {
    var raw = el.getAttribute("data-target");
    var target = parseInt(raw, 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (!isNaN(target)) {
      el.textContent = "0" + suffix;
      var obs = new IntersectionObserver(
        function (entries, o) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateValue(el, target, suffix);
              o.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      obs.observe(el.closest(".metric-card") || el);
    }
  });
})();
