/**
 * BridgeX Cooperation — Main JS
 * Advanced motions: particles, magnetic buttons, tilt cards,
 * scroll reveals, counter animations, custom cursor,
 * smooth loader, nav scroll behavior.
 */

(function () {
  "use strict";

  /* ============================================================
     LOADER
  ============================================================ */
  const loader = document.getElementById("loader");
  const loaderProgress = document.getElementById("loaderProgress");

  if (loader) {
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        if (loaderProgress) loaderProgress.style.width = "100%";
        setTimeout(() => {
          loader.classList.add("hidden");
          document.body.style.overflow = "";
        }, 420);
      }
      if (loaderProgress) loaderProgress.style.width = prog + "%";
    }, 80);
    document.body.style.overflow = "hidden";
  }

  /* ============================================================
     CUSTOM CURSOR
  ============================================================ */
  const cursor = document.getElementById("cursor");
  const cursorFollower = document.getElementById("cursorFollower");

  if (cursor && cursorFollower && window.matchMedia("(hover: hover)").matches) {
    let mx = -100, my = -100, fx = -100, fy = -100;
    let rafId = null;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    });

    function followCursor() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      cursorFollower.style.left = fx + "px";
      cursorFollower.style.top = fy + "px";
      rafId = requestAnimationFrame(followCursor);
    }
    followCursor();

    const hoverEls = document.querySelectorAll("a, button, .service-card, .team-card, .why-item, [data-hover]");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
        cursorFollower.classList.add("hover");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
        cursorFollower.classList.remove("hover");
      });
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      cursorFollower.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = "1";
    });
  }

  /* ============================================================
     NAV SCROLL BEHAVIOR
  ============================================================ */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     MOBILE NAV TOGGLE
  ============================================================ */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.classList.toggle("open");
      navLinks.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    // Close on link click
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ============================================================
     HERO PARTICLE CANVAS
  ============================================================ */
  const canvas = document.getElementById("heroCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];
    const COUNT = 80;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,198,255,${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,198,255,${0.07 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ============================================================
     MAGNETIC BUTTONS
  ============================================================ */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  /* ============================================================
     3D TILT CARDS
  ============================================================ */
  document.querySelectorAll(".service-card, .glass-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ============================================================
     SCROLL REVEAL (IntersectionObserver)
  ============================================================ */
  const revealSelectors = [
    ".reveal-up", ".reveal-left", ".reveal-scale",
    ".reveal-card", ".reveal-tl", ".reveal-row"
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.dataset.delay || 0) * 1000;
          setTimeout(() => el.classList.add("in-view"), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(revealSelectors.join(",")).forEach((el) => observer.observe(el));

  /* ============================================================
     COUNTER ANIMATION
  ============================================================ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const ticker = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(ticker);
    }, 16);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

  /* ============================================================
     HERO TITLE STAGGER (letter reveal)
  ============================================================ */
  document.querySelectorAll(".title-line").forEach((line, i) => {
    line.style.animationDelay = `${0.1 + i * 0.15}s`;
  });

  /* ============================================================
     SMOOTH SECTION PARALLAX (hero bg grid)
  ============================================================ */
  const heroGrid = document.querySelector(".hero-grid");
  if (heroGrid) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      heroGrid.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  /* ============================================================
     PROCESS STEP ACTIVE STATE ON SCROLL
  ============================================================ */
  const steps = document.querySelectorAll(".process-step");
  if (steps.length) {
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("active", entry.isIntersecting);
        });
      },
      { threshold: 0.6 }
    );
    steps.forEach((step) => stepObserver.observe(step));
  }

  /* ============================================================
     CONTACT FORM VALIDATION & SUBMIT
  ============================================================ */
  const form = document.getElementById("contactForm");
  if (form) {
    const submitBtn = document.getElementById("submitBtn");
    const formSuccess = document.getElementById("formSuccess");

    function getField(id) { return document.getElementById(id); }
    function setError(inputId, errorId, msg) {
      const input = getField(inputId);
      const error = getField(errorId);
      if (input) input.classList.toggle("error", !!msg);
      if (error) error.textContent = msg || "";
    }

    function validateEmail(email) {
      // Basic email format validation
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validate() {
      let valid = true;
      const firstName = getField("firstName");
      const lastName = getField("lastName");
      const email = getField("email");
      const message = getField("message");

      if (!firstName || !firstName.value.trim()) {
        setError("firstName", "firstNameError", "First name is required.");
        valid = false;
      } else { setError("firstName", "firstNameError", ""); }

      if (!lastName || !lastName.value.trim()) {
        setError("lastName", "lastNameError", "Last name is required.");
        valid = false;
      } else { setError("lastName", "lastNameError", ""); }

      if (!email || !email.value.trim()) {
        setError("email", "emailError", "Email address is required.");
        valid = false;
      } else if (!validateEmail(email.value.trim())) {
        setError("email", "emailError", "Please enter a valid email address.");
        valid = false;
      } else { setError("email", "emailError", ""); }

      if (!message || !message.value.trim()) {
        setError("message", "messageError", "Please enter a message.");
        valid = false;
      } else if (message.value.trim().length < 20) {
        setError("message", "messageError", "Message must be at least 20 characters.");
        valid = false;
      } else { setError("message", "messageError", ""); }

      return valid;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) return;

      const btnText = submitBtn.querySelector(".btn-text");
      const btnLoading = submitBtn.querySelector(".btn-loading");
      submitBtn.disabled = true;
      if (btnText) btnText.hidden = true;
      if (btnLoading) btnLoading.hidden = false;

      // Simulate async submission
      setTimeout(() => {
        submitBtn.hidden = true;
        if (formSuccess) formSuccess.hidden = false;
        form.reset();
      }, 1400);
    });

    // Live validation on blur
    ["firstName", "lastName", "email", "message"].forEach((id) => {
      const el = getField(id);
      if (el) el.addEventListener("blur", validate);
    });
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLL
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ============================================================
     CTA PARTICLES (small sparkles)
  ============================================================ */
  const ctaParticles = document.getElementById("ctaParticles");
  if (ctaParticles) {
    for (let i = 0; i < 18; i++) {
      const dot = document.createElement("span");
      Object.assign(dot.style, {
        position: "absolute",
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        borderRadius: "50%",
        background: `rgba(0,198,255,${Math.random() * 0.4 + 0.1})`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float-orb ${4 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 4}s`,
        pointerEvents: "none",
      });
      ctaParticles.appendChild(dot);
    }
  }

  /* ============================================================
     LINK ANIMATIONS (page transitions)
  ============================================================ */
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto") &&
      !href.startsWith("tel") &&
      !href.startsWith("http") &&
      link.target !== "_blank"
    ) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.style.opacity = "0";
        document.body.style.transition = "opacity 0.35s ease";
        setTimeout(() => {
          window.location.href = href;
        }, 350);
      });
    }
  });

  // Fade in on page load
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  });

})();
