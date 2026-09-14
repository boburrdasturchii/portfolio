/**
 * ===================================================
 * BOBUR DASTURCHI — PORTFOLIO 2.0 (ADVANCED JAVASCRIPT)
 * Muallif: Bobur Mirboboyev
 * Xususiyatlar:
 *  - Dinamik yosh (8-noyabr algoritmi)
 *  - Rang mavzularini almashtiruvchi (Theme Accent Switcher)
 *  - Veb Audio mexanik klaviatura ovoz effekti
 *  - Interaktiv CLI Terminal & Buyruqlar konsoli
 *  - Kiber Matrix yomg'iri (Matrix Digital Rain)
 *  - Sof JS bayramona konfetti (Canvas Confetti)
 *  - Loyihalar filtri va Modal oynasi
 *  - Obsidian Ikkinchi Miya Interaktiv Bilimlar Grafigi
 *  - Dasturchi Viktorinasi (Dev Quiz & Test)
 *  - Animatsiyali statistika hisoblagichlari
 *  - Mehmonlar kitobi (Guestbook) & Telegramga to'g'ridan xabar
 *  - Mobil menyu, Scroll Progress va Back-to-Top
 * ===================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 0. DINAMIK YOSH HISOBLASH (Tug'ilgan sana: 8-noyabr 2012-yil)
  // Har doim sana 8-noyabrdan o'tganda yosh avtomatik ravishda 1 yoshga oshadi!
  // --------------------------------------------------------------------------
  function calculateBoburAge() {
    const birthYear = 2012;
    const birthMonth = 10; // JavaScript oylarida 10 = Noyabr (0-indeksli)
    const birthDay = 8;

    const today = new Date();
    let age = today.getFullYear() - birthYear;
    const monthDiff = today.getMonth() - birthMonth;

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
      age--;
    }
    return age;
  }

  const currentAge = calculateBoburAge();
  document.querySelectorAll(".dynamic-age").forEach((el) => {
    el.textContent = currentAge;
  });

  // --------------------------------------------------------------------------
  // 1. SOUND FX: MEXANIK KLAVIATURA OVOZ EFFEKTI (Web Audio API)
  // Hech qanday tashqi audio fayl talab qilinmaydi, sintezator orqali hosil qilinadi
  // --------------------------------------------------------------------------
  let audioEnabled = localStorage.getItem("bobur_audio_fx") === "true";
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playKeyClick(type = "key") {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === "enter") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "success") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        // Oddiy mexanik chertish
        osc.type = "triangle";
        const freq = 600 + Math.random() * 200;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      // Audio brauzer tomonidan bloklangan bo'lsa
    }
  }

  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  function updateSoundBtnUI() {
    if (!soundToggleBtn) return;
    if (audioEnabled) {
      soundToggleBtn.classList.add("active");
      soundToggleBtn.setAttribute("title", "Ovoz effekti: Yoqilgan");
      soundToggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        <span class="btn-tooltip">Ovoz: Yoqilgan</span>
      `;
    } else {
      soundToggleBtn.classList.remove("active");
      soundToggleBtn.setAttribute("title", "Ovoz effekti: O'chirilgan");
      soundToggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
        <span class="btn-tooltip">Ovoz: O'chiq</span>
      `;
    }
  }
  updateSoundBtnUI();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      audioEnabled = !audioEnabled;
      localStorage.setItem("bobur_audio_fx", audioEnabled ? "true" : "false");
      if (audioEnabled) {
        initAudio();
        playKeyClick("enter");
        showToast("Ovoz effektlari yoqildi! 🎵");
      } else {
        showToast("Ovoz effektlari o'chirildi.");
      }
      updateSoundBtnUI();
    });
  }

  // Sahifadagi umumiy tugmalarga xavfsiz klik tovushi qo'shish
  document.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest(".btn") || e.target.closest(".nav-link")) {
      playKeyClick("key");
    }
  });

  // --------------------------------------------------------------------------
  // 2. THEME ACCENT SWITCHER (RANG MAVZULARI)
  // Standart (Cyber Violet), Mars Olovrangi, Matrix Yashili, Google Ko'ki
  // --------------------------------------------------------------------------
  const savedTheme = localStorage.getItem("bobur_theme") || "cyber";
  applyTheme(savedTheme);

  function applyTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("bobur_theme", themeName);
    document.querySelectorAll(".theme-option").forEach((btn) => {
      if (btn.getAttribute("data-theme-name") === themeName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  document.querySelectorAll(".theme-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme-name");
      applyTheme(theme);
      playKeyClick("enter");
      showToast(`Mavzu o'zgartirildi: ${btn.getAttribute("title") || theme}`);
    });
  });

  // --------------------------------------------------------------------------
  // 3. SCROLL PROGRESS BAR & BACK TO TOP TUGMASI
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById("scroll-progress-bar");
  const backToTopBtn = document.getElementById("back-to-top-btn");

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.pageYOffset / totalHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (window.pageYOffset > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      playKeyClick("enter");
    });
  }

  // --------------------------------------------------------------------------
  // 4. NAVBAR INTERAKTIV DROPDOWN & MOBIL MENYU (HAMBURGER DRAWER) & SCROLLSPY
  // --------------------------------------------------------------------------
  // Navbar Dropdown (Interaktiv bo'limlar)
  const navDropdownBtn = document.getElementById("nav-dropdown-btn");
  const navDropdownMenu = document.getElementById("nav-dropdown-menu");

  if (navDropdownBtn && navDropdownMenu) {
    navDropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      playKeyClick("key");
      const isOpen = navDropdownMenu.classList.contains("open");
      if (isOpen) {
        navDropdownMenu.classList.remove("open");
        navDropdownBtn.classList.remove("active");
      } else {
        navDropdownMenu.classList.add("open");
        navDropdownBtn.classList.add("active");
      }
    });

    document.addEventListener("click", (e) => {
      if (!navDropdownMenu.contains(e.target) && e.target !== navDropdownBtn) {
        navDropdownMenu.classList.remove("open");
        navDropdownBtn.classList.remove("active");
      }
    });

    navDropdownMenu.querySelectorAll(".dropdown-link").forEach((link) => {
      link.addEventListener("click", () => {
        navDropdownMenu.classList.remove("open");
        navDropdownBtn.classList.remove("active");
        playKeyClick("enter");
      });
    });
  }

  // Sahifa aylantirilganda Navbar shisha orolchasini yanada ixchamlashtirish
  const navbarWrapper = document.querySelector(".navbar-wrapper");
  window.addEventListener("scroll", () => {
    if (navbarWrapper) {
      if (window.pageYOffset > 30) {
        navbarWrapper.classList.add("scrolled");
      } else {
        navbarWrapper.classList.remove("scrolled");
      }
    }
  });

  // Mobil Menyu
  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const mobileMenuDrawer = document.getElementById("mobile-menu-drawer");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function toggleMobileMenu() {
    const isOpen = mobileMenuDrawer.classList.contains("open");
    if (isOpen) {
      mobileMenuDrawer.classList.remove("open");
      mobileMenuOverlay.classList.remove("open");
      menuToggleBtn.classList.remove("active");
      document.body.style.overflow = "";
    } else {
      mobileMenuDrawer.classList.add("open");
      mobileMenuOverlay.classList.add("open");
      menuToggleBtn.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  if (menuToggleBtn && mobileMenuDrawer) {
    menuToggleBtn.addEventListener("click", () => {
      playKeyClick("key");
      toggleMobileMenu();
    });
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", toggleMobileMenu);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu();
    });
  });

  // Scrollspy: Navigatsiya havolalarini faol qilish
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4.1 COMMAND PALETTE & TEZKOR QIDIRUV (CTRL + K)
  // --------------------------------------------------------------------------
  const quickSearchBtn = document.getElementById("quick-search-btn");
  const quickSearchModal = document.getElementById("quick-search-modal");
  const quickSearchBackdrop = document.getElementById("search-modal-backdrop");
  const quickSearchInput = document.getElementById("quick-search-input");
  const searchCloseBtn = document.getElementById("search-close-btn");
  const searchResultsList = document.getElementById("search-results-list");

  const navigationIndex = [
    { title: "Bosh sahifa", category: "Bo'lim", hash: "#home", icon: "🏠", keywords: "bosh sahifa hero kirish bobur mirboboyev" },
    { title: "Men haqimda", category: "Bo'lim", hash: "#about", icon: "👨‍💻", keywords: "haqimda yosh maktab 10-maktab intizom falsafa" },
    { title: "Ko'nikmalar va Vositalar", category: "Bo'lim", hash: "#skills", icon: "⚡", keywords: "skills html css javascript obsidian git dsa" },
    { title: "Obsidian Bilimlar Grafigi", category: "Interaktiv", hash: "#brain-graph", icon: "🧠", keywords: "ikkinchi miya second brain graph tarmoq bilimlar" },
    { title: "Google Sari Yo'l Xaritasi", category: "Reja", hash: "#roadmap", icon: "🗺️", keywords: "roadmap yo'l xaritasi senior engineer google maqsad" },
    { title: "Tanlangan Loyihalar", category: "Loyihalar", hash: "#projects", icon: "📂", keywords: "loyihalar barcha amaliy ishlar portfolio" },
    { title: "Supermarket POS Kassa Tizimi", category: "Loyiha", hash: "#projects", icon: "🛒", keywords: "pos supermarket kassa skaner shtrix chek" },
    { title: "Bobur dasturchi Portfolio 2.0", category: "Loyiha", hash: "#projects", icon: "💎", keywords: "portfolio sayt dark mode glassmorphism cli" },
    { title: "E-Commerce Savat & Buyurtma", category: "Loyiha", hash: "#projects", icon: "🛍️", keywords: "savat savdo mahsulot narx do'kon" },
    { title: "Mars Space Xakaton Ishi", category: "Loyiha", hash: "#projects", icon: "🚀", keywords: "xakaton hackathon mars innovatsiya" },
    { title: "Dasturchi Viktorinasi (Test)", category: "O'yin", hash: "#quiz", icon: "🎮", keywords: "quiz viktorina test savollar o'yin ball" },
    { title: "Mars IT School & Mars Space", category: "Ta'lim", hash: "#mars-space", icon: "🪐", keywords: "mars space it maktab mars coins gamifikatsiya" },
    { title: "Mehmonlar Kitobi & Fikrlar", category: "Muloqot", hash: "#guestbook", icon: "✍️", keywords: "mehmonlar doska tilak izoh fikr telegram" },
    { title: "Telegram Profil (@Mirboboyev_08)", category: "Aloqa", hash: "#contact", icon: "✈️", keywords: "telegram aloqa mirboboyev bog'lanish chat" },
    { title: "Telefon Qo'ng'iroq (+998 99 138-08-10)", category: "Aloqa", hash: "#contact", icon: "📞", keywords: "telefon aloqa nomer sms qo'ng'iroq" },
  ];

  function openCommandPalette() {
    if (!quickSearchModal) return;
    quickSearchModal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (quickSearchInput) {
      quickSearchInput.value = "";
      quickSearchInput.focus();
    }
    renderSearchResults("");
    playKeyClick("enter");
  }

  function closeCommandPalette() {
    if (!quickSearchModal) return;
    quickSearchModal.classList.remove("open");
    document.body.style.overflow = "";
    playKeyClick("key");
  }

  function renderSearchResults(query) {
    if (!searchResultsList) return;
    const cleanQuery = query.toLowerCase().trim();

    const filtered = navigationIndex.filter((item) => {
      if (!cleanQuery) return true;
      return (
        item.title.toLowerCase().includes(cleanQuery) ||
        item.category.toLowerCase().includes(cleanQuery) ||
        item.keywords.toLowerCase().includes(cleanQuery)
      );
    });

    if (filtered.length === 0) {
      searchResultsList.innerHTML = `
        <div class="search-empty-state">
          <span>🔍</span>
          <p>Hech qanday bo'lim yoki loyiha topilmadi.</p>
        </div>
      `;
      return;
    }

    searchResultsList.innerHTML = filtered
      .map(
        (item, index) => `
        <div class="search-item ${index === 0 ? "selected" : ""}" data-hash="${item.hash}">
          <div class="search-item-icon">${item.icon}</div>
          <div class="search-item-info">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="search-item-category">${item.category}</span>
          </div>
          <span class="search-item-arrow">→</span>
        </div>
      `
      )
      .join("");

    searchResultsList.querySelectorAll(".search-item").forEach((el) => {
      el.addEventListener("click", () => {
        const hash = el.getAttribute("data-hash");
        closeCommandPalette();
        playKeyClick("enter");
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  if (quickSearchBtn) {
    quickSearchBtn.addEventListener("click", openCommandPalette);
  }
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener("click", closeCommandPalette);
  }
  if (quickSearchBackdrop) {
    quickSearchBackdrop.addEventListener("click", closeCommandPalette);
  }

  if (quickSearchInput) {
    quickSearchInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });

    quickSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const firstItem = searchResultsList.querySelector(".search-item");
        if (firstItem) {
          firstItem.click();
        }
      }
    });
  }

  // Klaviatura qisqa buyrug'i (Ctrl+K yoki Cmd+K)
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (quickSearchModal && quickSearchModal.classList.contains("open")) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === "Escape" && quickSearchModal && quickSearchModal.classList.contains("open")) {
      closeCommandPalette();
    }
  });

  // --------------------------------------------------------------------------
  // 5. ANIMATSIYALI STATISTIKA SANAGICHLARI (COUNTERS)
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll(".count-up");
  let animatedStats = false;

  function animateCounters() {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const suffix = counter.getAttribute("data-suffix") || "";
      const duration = 1800;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing effekti (easeOutQuad)
        const currentVal = Math.floor(progress * (2 - progress) * target);
        counter.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target + suffix;
        }
      }
      requestAnimationFrame(updateCount);
    });
  }

  const statsSection = document.getElementById("stats-section");
  if (statsSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedStats) {
            animatedStats = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 6. TERMINAL KARTASINING 3D EFFEKTI
  // --------------------------------------------------------------------------
  const terminal = document.querySelector(".terminal-card");
  if (terminal) {
    terminal.addEventListener("mousemove", (e) => {
      const rect = terminal.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      terminal.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    terminal.addEventListener("mouseleave", () => {
      terminal.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  }

  // --------------------------------------------------------------------------
  // 7. TO'LIQ INTERAKTIV CLI TERMINAL & BUYRUQLAR KONSOLI
  // --------------------------------------------------------------------------
  const cliInput = document.getElementById("cli-terminal-input");
  const cliOutput = document.getElementById("cli-terminal-output");
  const cliForm = document.getElementById("cli-terminal-form");
  const cliTabToggle = document.getElementById("cli-toggle-view");
  const terminalInteractiveBox = document.getElementById("terminal-interactive-box");
  const terminalCodeBox = document.getElementById("terminal-code-box");

  let commandHistory = [];
  let historyIndex = -1;

  if (cliTabToggle) {
    cliTabToggle.addEventListener("click", () => {
      playKeyClick("key");
      const isCodeVisible = terminalCodeBox.style.display !== "none";
      if (isCodeVisible) {
        terminalCodeBox.style.display = "none";
        terminalInteractiveBox.style.display = "flex";
        cliTabToggle.innerHTML = `<span>💻 Kod rejimiga o'tish</span>`;
        if (cliInput) cliInput.focus();
        showToast("Interaktiv konsol faollashdi! 'help' deb yozib ko'ring.");
      } else {
        terminalCodeBox.style.display = "block";
        terminalInteractiveBox.style.display = "none";
        cliTabToggle.innerHTML = `<span>⚡ Interaktiv CLI rejimiga o'tish</span>`;
      }
    });
  }

  function appendCliOutput(text, type = "normal") {
    if (!cliOutput) return;
    const line = document.createElement("div");
    line.className = `cli-line cli-${type}`;
    line.innerHTML = text;
    cliOutput.appendChild(line);
    cliOutput.scrollTop = cliOutput.scrollHeight;
  }

  const commands = {
    help: () => {
      return `
<strong>🚀 Mavjud buyruqlar ro'yxati:</strong>
  • <code>about</code>     - Bobur Mirboboyev haqida qisqacha ma'lumot
  • <code>age</code>       - Boburning dinamik yoshi va hisoblash qoidasi
  • <code>skills</code>    - O'zlashtirilgan dasturlash ko'nikmalari
  • <code>projects</code>  - Yaratilgan amaliy veb loyihalar
  • <code>roadmap</code>   - Google va Senior darajasiga yo'l rejasi
  • <code>mars</code>      - Mars IT School & Mars Space haqida
  • <code>contact</code>   - Aloqa: Telegram va telefon
  • <code>matrix</code>    - Kiber Matrix yomg'iri effektini yoqish/o'chirish
  • <code>confetti</code>  - Sahifada bayramona konfetti otish 🎉
  • <code>sound</code>     - Klaviatura ovoz effektini o'zgartirish
  • <code>theme</code>     - Mavzular: <em>cyber, mars, matrix, google</em> (masalan: <code>theme mars</code>)
  • <code>calc &lt;ifoda&gt;</code> - Oddiy matematik hisoblagich (masalan: <code>calc 2026-2012</code>)
  • <code>quote</code>     - Dasturchilar uchun maxsus motivatsiya
  • <code>clear</code>     - Konsol oynasini tozalash`;
    },
    about: () => {
      return `<strong>👨‍💻 Bobur Mirboboyev (Bobur dasturchi):</strong><br>
13 yoshli Frontend dasturchi. 10-maktab va Mars IT School (Mars Space) o'quvchisi.<br>
Katta maqsad: Senior Software Engineer bo'lib Google jamoasida ishlash! 🌟`;
    },
    age: () => {
      return `🎂 Boburning joriy yoshi: <strong>${currentAge} yosh</strong>.<br>
Tug'ilgan sana: 8-noyabr 2012-yil. Har yili 8-noyabr o'tganda tizim yoshni avtomatik ravishda 1 yoshga oshiradi! 🔄`;
    },
    skills: () => {
      return `<strong>🛠️ Texnologiyalar va Vositalar:</strong><br>
  - HTML5 (Semantika, Accessibility, SEO) - 90%<br>
  - CSS3 (Flexbox, Grid, Animatsiyalar, Glassmorphism) - 88%<br>
  - JavaScript (ES6+, DOM, Asinxronlik) - 65%<br>
  - Obsidian PKM (Shaxsiy bilimlarni boshqarish) - 92%<br>
  - Git & GitHub (Versiyalar nazorati) - Boshlang'ich`;
    },
    projects: () => {
      return `<strong>📂 Asosiy amaliy loyihalar:</strong><br>
  1. <em>Supermarket POS</em> - Mahsulotlarni skanerlovchi kassa tizimi<br>
  2. <em>Bobur Portfolio 2.0</em> - Shaxsiy zamonaviy tashrif qog'ozi<br>
  3. <em>Savat Loyihasi</em> - Onlayn savdo va buyurtma tizimi<br>
  4. <em>Haktakon Ishi</em> - Mars Space xakatoniga maxsus tezkor yechim<br>
  5. <em>Obsidian Second Brain</em> - Bog'langan qaydlar tizimi`;
    },
    roadmap: () => {
      return `<strong>🗺️ 4 Bosqichli Katta Reja:</strong><br>
  1. Frontend Mastery (HTML, CSS, JS, React) [Hozirda 🔄]<br>
  2. Backend & Fullstack (Node.js/Python, DB, REST API)<br>
  3. DSA & Algorithms (LeetCode, Data Structures, System Design)<br>
  4. Senior Engineer @ Google (Global innovatsiyalar) 🌟`;
    },
    mars: () => {
      return `🪐 <strong>Mars IT School & Mars Space:</strong><br>
Boburning ilk dasturlash qadami aynan Mars IT School orqali boshlangan.<br>
Interaktiv platforma, amaliy darslar va Mars Coinlar ekotizimi! Tavsiya etiladi! ⭐`;
    },
    contact: () => {
      return `📞 <strong>Bog'lanish:</strong><br>
  - Telegram: <a href="https://t.me/Mirboboyev_08" target="_blank" style="color:var(--accent-color);">@Mirboboyev_08</a><br>
  - Telefon: <a href="tel:+998991380810" style="color:var(--accent-color);">+998 (99) 138-08-10</a>`;
    },
    matrix: () => {
      toggleMatrixRain();
      return `🟩 Matrix kiber-effekti holati o'zgartirildi!`;
    },
    confetti: () => {
      triggerConfetti();
      playKeyClick("success");
      return `🎉 Tabriklaymiz! Sahifada bayramona konfetti otildi!`;
    },
    sound: () => {
      audioEnabled = !audioEnabled;
      localStorage.setItem("bobur_audio_fx", audioEnabled ? "true" : "false");
      updateSoundBtnUI();
      return `🔊 Ovoz effektlari hozir: <strong>${audioEnabled ? "YOQILGAN" : "O'CHIRILGAN"}</strong>`;
    },
    quote: () => {
      const quotes = [
        `"Har qanday buyuk natija kichik qadamlar va qat'iyat bilan boshlanadi." — Bobur dasturchi`,
        `"Dasturlash — bu faqat kod yozish emas, balki fikrlashni o'rganishdir." — Stiv Jobs`,
        `"Katta maqsadlar sari har kuni 1% bo'lsa ham intiling!" — Mars Space falsafasi`,
        `"Eng yaxshi xato — bu saboq beradigan xatodir." — Google Engineers`,
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];
    },
    clear: () => {
      if (cliOutput) cliOutput.innerHTML = "";
      return null;
    },
  };

  if (cliForm && cliInput) {
    cliForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawInput = cliInput.value.trim();
      if (!rawInput) return;

      playKeyClick("enter");
      commandHistory.push(rawInput);
      historyIndex = commandHistory.length;

      // Kiritilgan buyruqni chiqarish
      appendCliOutput(`<span class="cli-prompt">bobur@dev:~$</span> ${escapeHtml(rawInput)}`, "input");
      cliInput.value = "";

      const parts = rawInput.split(" ");
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(" ").trim();

      // Maxsus parametrli buyruqlar
      if (cmd === "theme") {
        const validThemes = ["cyber", "mars", "matrix", "google"];
        if (validThemes.includes(arg)) {
          applyTheme(arg);
          appendCliOutput(`🎨 Mavzu muvaffaqiyatli o'zgartirildi: <strong>${arg}</strong>`, "success");
        } else {
          appendCliOutput(`⚠️ Noto'g'ri mavzu! Mavjud variantlar: <code>${validThemes.join(", ")}</code>`, "error");
        }
      } else if (cmd === "calc") {
        if (!arg) {
          appendCliOutput(`⚠️ Iltimos, ifoda kiriting. Masalan: <code>calc 13 * 12</code>`, "error");
        } else {
          try {
            // Xavfsiz faqat raqamlar va arifmetik amallarni hisoblash
            if (/^[0-9+\-*/().\s]+$/.test(arg)) {
              // eslint-disable-next-line no-eval
              const res = Function(`'use strict'; return (${arg})`)();
              appendCliOutput(`🔢 Natija: <strong>${arg} = ${res}</strong>`, "success");
            } else {
              appendCliOutput(`⚠️ Faqat oddiy matematik raqamlar va belgilardan foydalaning!`, "error");
            }
          } catch (err) {
            appendCliOutput(`⚠️ Hisoblashda xatolik yuz berdi.`, "error");
          }
        }
      } else if (commands[cmd]) {
        const result = commands[cmd]();
        if (result !== null) {
          appendCliOutput(result, "response");
        }
      } else {
        appendCliOutput(
          `❌ Buyruq topilmadi: <code>${escapeHtml(cmd)}</code>. Mavjud buyruqlarni ko'rish uchun <code>help</code> deb yozing.`,
          "error"
        );
      }
    });

    // Klaviatura o'q tugmalari orqali tarixda yurish (Up / Down)
    cliInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          cliInput.value = commandHistory[historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          cliInput.value = commandHistory[historyIndex] || "";
        } else {
          historyIndex = commandHistory.length;
          cliInput.value = "";
        }
      } else if (e.key === "Tab") {
        // Avtomatik to'ldirish
        e.preventDefault();
        const cur = cliInput.value.trim().toLowerCase();
        if (cur) {
          const matched = Object.keys(commands).filter((c) => c.startsWith(cur));
          if (matched.length === 1) {
            cliInput.value = matched[0];
          }
        }
      }
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }[tag] || tag));
  }

  // --------------------------------------------------------------------------
  // 8. MATRIX RAIN CANVAS EFFEKTI
  // --------------------------------------------------------------------------
  const matrixCanvas = document.getElementById("matrix-rain-canvas");
  let matrixActive = false;
  let matrixInterval = null;

  function toggleMatrixRain() {
    if (!matrixCanvas) return;
    matrixActive = !matrixActive;

    if (matrixActive) {
      matrixCanvas.classList.add("active");
      initMatrix();
      showToast("Matrix kiber yomg'iri yoqildi! 🟩");
    } else {
      matrixCanvas.classList.remove("active");
      clearInterval(matrixInterval);
      showToast("Matrix effekti o'chirildi.");
    }
  }

  const matrixToggleBtn = document.getElementById("matrix-toggle-btn");
  if (matrixToggleBtn) {
    matrixToggleBtn.addEventListener("click", () => {
      playKeyClick("key");
      toggleMatrixRain();
    });
  }

  function initMatrix() {
    if (!matrixCanvas) return;
    const ctx = matrixCanvas.getContext("2d");
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const chars = "BOBUR0123456789MARSDEV<>/{}[];*+-~=GoogleFrontend";
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }

    clearInterval(matrixInterval);
    matrixInterval = setInterval(() => {
      ctx.fillStyle = "rgba(7, 9, 14, 0.08)";
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = "#22c55e";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);
  }

  window.addEventListener("resize", () => {
    if (matrixActive && matrixCanvas) {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }
  });

  // --------------------------------------------------------------------------
  // 9. SOF CANVAS CONFETTI EFFEKTI
  // --------------------------------------------------------------------------
  function triggerConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    const pieces = [];
    const colors = ["#6366f1", "#a855f7", "#ec4899", "#38bdf8", "#34d399", "#fbbf24", "#ef4444"];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 50,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.8) * 20,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
      });
    }

    let frame = 0;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeCount = 0;

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // Gravitatsiya
        p.rotation += p.rotationSpeed;
        p.alpha -= 0.008;

        if (p.alpha > 0) {
          activeCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      frame++;
      if (activeCount > 0 && frame < 180) {
        requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
      }
    }
    requestAnimationFrame(renderConfetti);
  }

  // --------------------------------------------------------------------------
  // 10. LOYIHALAR FILTRATSIYASI VA MODAL OYNA TIZIMI
  // --------------------------------------------------------------------------
  const projectsData = [
    {
      id: "pos",
      category: "frontend",
      title: "Supermarket POS Kassa Tizimi",
      shortDesc: "Zamonaviy mahsulotlar skaneri, savat boshqaruvi, chegirmalar va elektron chek chiqarish tizimi.",
      fullDesc:
        "Ushbu loyiha haqiqiy chakana savdo do'konlari va supermarketlar uchun yaratilgan qulay POS (Point of Sale) veb-platformasi hisoblanadi. Unda mahsulot shtrix-kodlarini skanerlash (kamera orqali), savatga qo'shish, jami hisob-kitob, to'lov turlari va chek chiqarish imkoniyatlari to'liq realizatsiya qilingan.",
      tags: ["JavaScript ES6", "HTML5 Skaner", "CSS Grid", "LocalStorage", "POS UI"],
      status: "Tayyor & Faol",
      highlights: [
        "Kamera orqali shtrix-kodlarni aniqlash",
        "Jonli savat hisob-kitoblari va soliq stavkalari",
        "Termal chek formatida chop etish moduli",
        "Offline ishlashga moslashgan arxitektura",
      ],
    },
    {
      id: "portfolio",
      category: "frontend",
      title: "Bobur dasturchi Portfolio 2.0",
      shortDesc: "Ultra-zamonaviy Dark Glassmorphism, interaktiv CLI terminal, rang mavzulari va bilimlar grafigi.",
      fullDesc:
        "Bobur Mirboboyevning shaxsiy premium veb-sayti. Sof semantik HTML5, ilg'or CSS animatsiyalari, Web Audio API yordamida mexanik klaviatura ovozlari, interaktiv buyruqlar konsoli va Obsidian bilimlari integratsiyasi bilan boyitilgan.",
      tags: ["HTML5", "Modern CSS", "Web Audio API", "Canvas", "Responsive"],
      status: "Yangi Upgrade 2.0",
      highlights: [
        "8-noyabr sanasiga bog'langan dinamik yosh hisoblagich",
        "4 xil neon rang mavzulari almashinuvi",
        "Interaktiv kiber konsol va Matrix effekti",
        "Obsidian 'Ikkinchi Miya' interaktiv tarmog'i",
      ],
    },
    {
      id: "savat",
      category: "frontend",
      title: "E-Commerce Savat va Xarid Tizimi",
      shortDesc: "Mahsulotlar katalogi, dinamik savat hisoblagichi, buyurtma shakllantirish va qulay filtrlar.",
      fullDesc:
        "Onlayn magazinlar uchun maxsus yaratilgan interaktiv savat moduli. Foydalanuvchilar tovarlarni saralashi, bitta bosish bilan savatga qo'shishi, miqdorini oshirish/kamaytirishi va umumiy narxni jonli kuzatishi mumkin.",
      tags: ["JavaScript DOM", "CSS Flexbox", "State Management", "E-Commerce"],
      status: "Amaliy Loyiha",
      highlights: [
        "Real vaqtda narxlarni qayta hisoblash",
        "Mahsulotlarni toifalar bo'yicha saralash",
        "Animatsiyali qo'shish/o'chirish effektlari",
        "To'liq mobil moslashuvchanlik",
      ],
    },
    {
      id: "hackathon",
      category: "mars",
      title: "Mars Space Xakaton Maxsus Loyihasi",
      shortDesc: "Mars IT School xakatonida qisqa vaqt ichida jamoaviy ruhda yaratilgan innovatsion veb yechim.",
      fullDesc:
        "Mars Space ta'lim markazi xakaton musobaqasida cheklangan vaqt davomida yaratilgan kreativ platforma. Loyiha tezkor ishlash, innovatsion yondashuv va yorqin foydalanuvchi tajribasiga ega.",
      tags: ["Hackathon", "Mars Space", "Rapid Prototyping", "UI/UX"],
      status: "Taqdim etilgan",
      highlights: [
        "Qisqa muddatli sprintda kodlash amaliyoti",
        "Muammolarni tezkor tahlil qilish va yechim berish",
        "Jamoaviy kodlash va taqdimot tajribasi",
      ],
    },
    {
      id: "obsidian",
      category: "pkm",
      title: "Obsidian Digital Brain (Second Brain)",
      shortDesc: "Obsidian omborida o'zaro bog'langan bilimlar tarmog'i, dars konspektlari va maqsadlar tizimi.",
      fullDesc:
        "Bobur dasturchining shaxsiy bilimlarni boshqarish (Personal Knowledge Management - PKM) tizimi. Har bir o'rganilgan Frontend mavzusi, Google rejalari va Mars IT darslari o'zaro ikki tomonlama havolalar (backlinks) bilan tizimlashtirilgan.",
      tags: ["Obsidian", "Markdown", "Graph Theory", "Knowledge Base"],
      status: "Doimiy Yuritiladi",
      highlights: [
        "120 dan ortiq bog'langan konspekt va qaydlar",
        "Zettelkasten va raqamli bog'lanish tamoyillari",
        "Senior darajasi uchun tizimli o'quv yo'l xaritasi",
      ],
    },
    {
      id: "soglom",
      category: "frontend",
      title: "Sog'lom Keksalik Ijtimoiy Loyihasi",
      shortDesc: "Katta avlod vakillari uchun qulay, o'qilishi oson va foydali ma'lumotlarga boy veb sahifa.",
      fullDesc:
        "Kattalar va nuroniylar salomatligini saqlash, to'g'ri turmush tarzi va mashqlar bo'yicha tavsiyalarni o'z ichiga olgan ijtimoiy yo'naltirilgan veb-platforma. Katta shriftlar va yuqori kontrastli qulay interfeys.",
      tags: ["Accessibility", "HTML5", "CSS Typography", "Social Good"],
      status: "Tugallangan",
      highlights: [
        "Maxsus qulay o'qiladigan shriftlar va yuqori kontrast",
        "Sodda va tushunarli navigatsiya",
        "Salomatlik bo'yicha amaliy maslahatlar to'plami",
      ],
    },
  ];

  // Loyihalarni filtrlash
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      playKeyClick("key");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          card.classList.add("fade-in");
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Modal oynani boshqarish
  const projectModal = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalDesc = document.getElementById("modal-description");
  const modalHighlights = document.getElementById("modal-highlights");
  const modalTags = document.getElementById("modal-tags");

  function openProjectModal(projectId) {
    const p = projectsData.find((item) => item.id === projectId);
    if (!p || !projectModal) return;

    if (modalTitle) modalTitle.textContent = p.title;
    if (modalCategory) modalCategory.textContent = p.status;
    if (modalDesc) modalDesc.textContent = p.fullDesc;

    if (modalHighlights) {
      modalHighlights.innerHTML = p.highlights
        .map((h) => `<li><span class="hl-dot">✔</span> ${h}</li>`)
        .join("");
    }

    if (modalTags) {
      modalTags.innerHTML = p.tags.map((t) => `<span class="tag">${t}</span>`).join("");
    }

    projectModal.classList.add("open");
    document.body.style.overflow = "hidden";
    playKeyClick("enter");
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove("open");
    document.body.style.overflow = "";
    playKeyClick("key");
  }

  document.querySelectorAll(".view-project-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute("data-project-id");
      openProjectModal(pId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeProjectModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projectModal && projectModal.classList.contains("open")) {
      closeProjectModal();
    }
  });

  // --------------------------------------------------------------------------
  // 11. OBSIDIAN INTERAKTIV BILIMLAR GRAFIGI (CANVAS CONSTELLATION GRAPH)
  // --------------------------------------------------------------------------
  const graphCanvas = document.getElementById("brain-graph-canvas");
  if (graphCanvas) {
    const gCtx = graphCanvas.getContext("2d");
    let gWidth, gHeight;

    function resizeGraph() {
      const container = graphCanvas.parentElement;
      gWidth = graphCanvas.width = container.clientWidth;
      gHeight = graphCanvas.height = Math.max(380, container.clientHeight || 420);
    }
    resizeGraph();
    window.addEventListener("resize", resizeGraph);

    // Bilim tugunlari (Knowledge Nodes)
    const nodes = [
      { id: "bobur", label: "Bobur dasturchi", r: 24, color: "#a855f7", x: 0.5, y: 0.5, vx: 0, vy: 0, desc: "Bosh markaz: Bobur Mirboboyevning bilimlar yadrosi." },
      { id: "html", label: "HTML5", r: 16, color: "#f97316", x: 0.32, y: 0.3, vx: 0, vy: 0, desc: "Semantik teglar, Accessibility, Formlar va toza struktura." },
      { id: "css", label: "Premium CSS", r: 18, color: "#38bdf8", x: 0.28, y: 0.65, vx: 0, vy: 0, desc: "Flexbox, CSS Grid, Glassmorphism, animatsiyalar." },
      { id: "js", label: "JavaScript ES6+", r: 18, color: "#facc15", x: 0.68, y: 0.32, vx: 0, vy: 0, desc: "DOM, Hodisalar, Asinxron dasturlash, Mantiq." },
      { id: "mars", label: "Mars Space", r: 20, color: "#ef4444", x: 0.45, y: 0.22, vx: 0, vy: 0, desc: "Mars IT School ta'limi, amaliyot va Mars Coinlar." },
      { id: "obsidian", label: "Obsidian PKM", r: 18, color: "#818cf8", x: 0.72, y: 0.68, vx: 0, vy: 0, desc: "Ikkinchi Miya: bog'langan qaydlar va Zettelkasten." },
      { id: "google", label: "Google Maqsad", r: 22, color: "#34d399", x: 0.5, y: 0.82, vx: 0, vy: 0, desc: "Senior Software Engineer @ Google orzusi va rejasi." },
      { id: "git", label: "Git & GitHub", r: 14, color: "#f43f5e", x: 0.82, y: 0.48, vx: 0, vy: 0, desc: "Versiyalarni boshqarish va ochiq kodli loyihalar." },
      { id: "dsa", label: "Algoritmlar", r: 15, color: "#c084fc", x: 0.18, y: 0.45, vx: 0, vy: 0, desc: "Data Structures & LeetCode masalalari." },
    ];

    const edges = [
      ["bobur", "html"],
      ["bobur", "css"],
      ["bobur", "js"],
      ["bobur", "mars"],
      ["bobur", "obsidian"],
      ["bobur", "google"],
      ["bobur", "git"],
      ["bobur", "dsa"],
      ["html", "css"],
      ["css", "js"],
      ["js", "git"],
      ["mars", "html"],
      ["mars", "bobur"],
      ["obsidian", "google"],
      ["google", "dsa"],
      ["js", "dsa"],
    ];

    let mouse = { x: -1000, y: -1000, active: false };
    let selectedNode = nodes[0];

    const nodeInfoBox = document.getElementById("graph-node-info");

    function updateNodeInfo(node) {
      if (!nodeInfoBox) return;
      nodeInfoBox.innerHTML = `
        <div class="node-info-badge" style="background: ${node.color}20; color: ${node.color}; border: 1px solid ${node.color}40;">
          ${node.label}
        </div>
        <h4>${node.label}</h4>
        <p>${node.desc}</p>
      `;
    }
    updateNodeInfo(nodes[0]);

    graphCanvas.addEventListener("mousemove", (e) => {
      const rect = graphCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // Tugun ustiga kelganda tekshirish
      nodes.forEach((n) => {
        const nx = n.x * gWidth;
        const ny = n.y * gHeight;
        const dist = Math.hypot(mouse.x - nx, mouse.y - ny);
        if (dist < n.r + 5) {
          selectedNode = n;
          updateNodeInfo(n);
        }
      });
    });

    graphCanvas.addEventListener("mouseleave", () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });

    graphCanvas.addEventListener("click", () => {
      if (selectedNode) {
        playKeyClick("key");
        triggerConfettiMini(selectedNode.x * gWidth, selectedNode.y * gHeight, selectedNode.color);
      }
    });

    function triggerConfettiMini(x, y, color) {
      // Kichik yulduzcha effekti
      showToast(`Tugun tanlandi: ${selectedNode.label}`);
    }

    let angle = 0;
    function renderGraph() {
      gCtx.clearRect(0, 0, gWidth, gHeight);
      angle += 0.008;

      // Bog'lovchi chiziqlarni chizish
      edges.forEach(([fromId, toId]) => {
        const from = nodes.find((n) => n.id === fromId);
        const to = nodes.find((n) => n.id === toId);
        if (!from || !to) return;

        const fx = from.x * gWidth;
        const fy = from.y * gHeight;
        const tx = to.x * gWidth;
        const ty = to.y * gHeight;

        gCtx.beginPath();
        gCtx.moveTo(fx, fy);
        gCtx.lineTo(tx, ty);
        gCtx.strokeStyle = "rgba(148, 163, 184, 0.18)";
        gCtx.lineWidth = 1.2;
        gCtx.stroke();
      });

      // Tugunlarni chizish
      nodes.forEach((n) => {
        // Yumshoq tebranish
        const floatX = Math.sin(angle + n.r) * 3;
        const floatY = Math.cos(angle + n.r) * 3;
        const nx = n.x * gWidth + floatX;
        const ny = n.y * gHeight + floatY;

        // Sichqoncha yaqinlashganda tortilish
        if (mouse.active) {
          const dx = mouse.x - nx;
          const dy = mouse.y - ny;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            gCtx.beginPath();
            gCtx.moveTo(nx, ny);
            gCtx.lineTo(mouse.x, mouse.y);
            gCtx.strokeStyle = `${n.color}44`;
            gCtx.lineWidth = 1;
            gCtx.stroke();
          }
        }

        // Tashqi nur (Glow aura)
        const isHovered = selectedNode && selectedNode.id === n.id;
        const glowR = isHovered ? n.r * 2.2 : n.r * 1.5;

        const gradient = gCtx.createRadialGradient(nx, ny, 0, nx, ny, glowR);
        gradient.addColorStop(0, `${n.color}66`);
        gradient.addColorStop(1, `${n.color}00`);

        gCtx.beginPath();
        gCtx.arc(nx, ny, glowR, 0, Math.PI * 2);
        gCtx.fillStyle = gradient;
        gCtx.fill();

        // Asosiy tugun doirasi
        gCtx.beginPath();
        gCtx.arc(nx, ny, isHovered ? n.r + 3 : n.r, 0, Math.PI * 2);
        gCtx.fillStyle = n.color;
        gCtx.shadowColor = n.color;
        gCtx.shadowBlur = isHovered ? 18 : 8;
        gCtx.fill();
        gCtx.shadowBlur = 0;

        // Yozuv (Label)
        gCtx.font = "600 12px 'Plus Jakarta Sans', sans-serif";
        gCtx.fillStyle = "#f8fafc";
        gCtx.textAlign = "center";
        gCtx.fillText(n.label, nx, ny + n.r + 16);
      });

      requestAnimationFrame(renderGraph);
    }
    renderGraph();
  }

  // --------------------------------------------------------------------------
  // 12. DASTURCHI VIKTORINASI (DEV QUIZ & TEST)
  // --------------------------------------------------------------------------
  const quizQuestions = [
    {
      question: "HTML5 da veb-sahifaning asosiy navigatsiya havolalari qaysi semantik teg ichida yoziladi?",
      options: ["<navigation>", "<nav>", "<links>", "<menu-bar>"],
      correct: 1,
      explanation: "<nav> tegi HTML5 da veb-saytning asosiy navigatsion blokini belgilash uchun xizmat qiladi.",
    },
    {
      question: "CSS da elementlarni bir qatorda yoki ustunda qulay joylashtirish uchun qaysi texnologiya eng qulay?",
      options: ["Float", "Flexbox (display: flex)", "Table layout", "Clearfix"],
      correct: 1,
      explanation: "Flexbox (Flexible Box Layout) zamonaviy bir o'lchamli joylashuvlarni mukammal boshqaradi.",
    },
    {
      question: "Bobur dasturchining yoshi har yili qaysi sanada avtomatik 1 yoshga oshadi?",
      options: ["1-yanvar", "8-mart", "8-noyabr", "1-sentyabr"],
      correct: 2,
      explanation: "Bobur Mirboboyev 2012-yil 8-noyabrda tavallud topgan, shuning uchun 8-noyabrda yoshi oshadi!",
    },
    {
      question: "JavaScript da o'zgarmas (qayta qiymat berib bo'lmaydigan) o'zgaruvchi qaysi kalit so'z bilan e'lon qilinadi?",
      options: ["var", "let", "const", "static"],
      correct: 2,
      explanation: "'const' kalit so'zi o'zgarmas qattiq qiymatli identifikatorlarni yaratishda qo'llaniladi.",
    },
    {
      question: "Bobur dasturchining eng katta oliy maqsadi qaysi kompaniyaga Senior muhandis bo'lib kirish?",
      options: ["Google", "Microsoft", "Meta", "Amazon"],
      correct: 0,
      explanation: "Boburning katta maqsadi — Senior Software Engineer darajasida Google jamoasiga qo'shilish!",
    },
  ];

  let currentQuizIndex = 0;
  let quizScore = 0;

  const quizQuestionEl = document.getElementById("quiz-question");
  const quizOptionsEl = document.getElementById("quiz-options");
  const quizProgressEl = document.getElementById("quiz-progress-text");
  const quizFeedbackEl = document.getElementById("quiz-feedback");
  const quizBox = document.getElementById("quiz-box");
  const quizResultBox = document.getElementById("quiz-result-box");
  const quizFinalScoreEl = document.getElementById("quiz-final-score");
  const quizRestartBtn = document.getElementById("quiz-restart-btn");

  function loadQuizQuestion() {
    if (!quizQuestionEl || !quizOptionsEl) return;
    const q = quizQuestions[currentQuizIndex];

    quizQuestionEl.textContent = `${currentQuizIndex + 1}. ${q.question}`;
    if (quizProgressEl) {
      quizProgressEl.textContent = `Savol ${currentQuizIndex + 1} / ${quizQuestions.length}`;
    }
    if (quizFeedbackEl) {
      quizFeedbackEl.innerHTML = "";
      quizFeedbackEl.className = "quiz-feedback";
    }

    quizOptionsEl.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt-btn";
      btn.innerHTML = `<span class="opt-prefix">${String.fromCharCode(65 + idx)}</span> <span class="opt-text">${opt}</span>`;
      btn.addEventListener("click", () => handleQuizAnswer(idx, btn));
      quizOptionsEl.appendChild(btn);
    });
  }

  function handleQuizAnswer(selectedIndex, clickedBtn) {
    const q = quizQuestions[currentQuizIndex];
    const allBtns = quizOptionsEl.querySelectorAll(".quiz-opt-btn");
    allBtns.forEach((b) => (b.disabled = true));

    if (selectedIndex === q.correct) {
      quizScore++;
      clickedBtn.classList.add("correct");
      playKeyClick("success");
      quizFeedbackEl.className = "quiz-feedback success";
      quizFeedbackEl.innerHTML = `<span>✔ To'g'ri javob!</span> ${q.explanation}`;
    } else {
      clickedBtn.classList.add("wrong");
      allBtns[q.correct].classList.add("correct");
      playKeyClick("enter");
      quizFeedbackEl.className = "quiz-feedback error";
      quizFeedbackEl.innerHTML = `<span>✖ Noto'g'ri.</span> To'g'ri javob: <strong>${q.options[q.correct]}</strong>. ${q.explanation}`;
    }

    setTimeout(() => {
      currentQuizIndex++;
      if (currentQuizIndex < quizQuestions.length) {
        loadQuizQuestion();
      } else {
        showQuizResults();
      }
    }, 2200);
  }

  function showQuizResults() {
    if (!quizBox || !quizResultBox) return;
    quizBox.style.display = "none";
    quizResultBox.style.display = "block";

    if (quizFinalScoreEl) {
      quizFinalScoreEl.innerHTML = `
        <div class="result-score-circle">
          <span class="score-num">${quizScore}</span>
          <span class="score-total">/ ${quizQuestions.length}</span>
        </div>
        <h3>${quizScore >= 4 ? "🌟 Ajoyib natija! Siz haqiqiy bilimdonsiz!" : "👍 Yaxshi harakat! Bilimlarni yanada mustahkamlaymiz!"}</h3>
        <p>${quizScore === 5 ? "Siz Bobur dasturchi kabi 100% barcha savollarga to'g'ri javob berdingiz!" : "Dasturlash sarguzashtida sizga ulkan omadlar tilaymiz!"}</p>
      `;
    }

    triggerConfetti();
    playKeyClick("success");
  }

  if (quizRestartBtn) {
    quizRestartBtn.addEventListener("click", () => {
      currentQuizIndex = 0;
      quizScore = 0;
      quizResultBox.style.display = "none";
      quizBox.style.display = "block";
      loadQuizQuestion();
      playKeyClick("enter");
    });
  }

  loadQuizQuestion();

  // --------------------------------------------------------------------------
  // 13. MEHMONLAR KITOBI (GUESTBOOK) VA DIRECT TELEGRAM HABAR
  // --------------------------------------------------------------------------
  const guestForm = document.getElementById("guestbook-form");
  const guestList = document.getElementById("guestbook-list");
  const guestNameInput = document.getElementById("guest-name");
  const guestRoleInput = document.getElementById("guest-role");
  const guestMsgInput = document.getElementById("guest-message");
  const sendTelegramBtn = document.getElementById("send-telegram-direct");

  // Standart dastlabki xabarlar
  const defaultGuestMessages = [
    {
      name: "Ustoz (Mars IT)",
      role: "Frontend Mentor",
      msg: "Bobur, tirishqoqligingiz va intilishingizga qoyil! Tez orada Google darajasidagi yetuk dasturchi bo'lib yetishasiz.",
      date: "2026-09-10",
    },
    {
      name: "Sinfdosh (10-maktab)",
      role: "Do'st",
      msg: "Bobur dasturchi portfoliongiz juda zo'r chiqibdi! O'yinlar va veb-saytlar yaratishda omad!",
      date: "2026-09-12",
    },
  ];

  function getGuestMessages() {
    try {
      const saved = localStorage.getItem("bobur_guestbook");
      return saved ? JSON.parse(saved) : defaultGuestMessages;
    } catch (e) {
      return defaultGuestMessages;
    }
  }

  function saveGuestMessages(list) {
    try {
      localStorage.setItem("bobur_guestbook", JSON.stringify(list));
    } catch (e) {}
  }

  function renderGuestList() {
    if (!guestList) return;
    const list = getGuestMessages();
    guestList.innerHTML = list
      .map(
        (item) => `
        <div class="guest-card glass-card">
          <div class="guest-card-header">
            <div class="guest-avatar">${item.name.charAt(0).toUpperCase()}</div>
            <div class="guest-meta">
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.role || "Tashrif buyuruvchi")} &bull; ${item.date}</span>
            </div>
          </div>
          <p class="guest-body">${escapeHtml(item.msg)}</p>
        </div>
      `
      )
      .join("");
  }
  renderGuestList();

  if (guestForm) {
    guestForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = guestNameInput.value.trim();
      const role = guestRoleInput.value.trim();
      const msg = guestMsgInput.value.trim();

      if (!name || !msg) {
        showToast("Iltimos, ismingiz va xabaringizni yozing!");
        return;
      }

      const list = getGuestMessages();
      const today = new Date().toISOString().split("T")[0];
      list.unshift({ name, role, msg, date: today });
      saveGuestMessages(list);

      renderGuestList();
      guestForm.reset();
      playKeyClick("success");
      triggerConfetti();
      showToast("Xabaringiz doskaga muvaffaqiyatli saqlandi! Rahmat! ✨");
    });
  }

  // To'g'ridan-to'g'ri Telegramga yo'naltiruvchi havola
  if (sendTelegramBtn) {
    sendTelegramBtn.addEventListener("click", () => {
      const name = guestNameInput ? guestNameInput.value.trim() : "";
      const msg = guestMsgInput ? guestMsgInput.value.trim() : "";

      let text = `Salom Bobur dasturchi!`;
      if (name) text += ` Men: ${name}.`;
      if (msg) text += ` Xabarim: ${msg}`;
      else text += ` Sizning portfoliongizni ko'rib chiqdim, juda ajoyib!`;

      const encoded = encodeURIComponent(text);
      window.open(`https://t.me/Mirboboyev_08?text=${encoded}`, "_blank");
      playKeyClick("enter");
    });
  }

  // --------------------------------------------------------------------------
  // 14. NUSXA OLISH (CLIPBOARD) VA TOAST BILDIRISHNOMASI
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll(".copy-btn");
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (err) {
        const tempInput = document.createElement("input");
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      const originalHTML = btn.innerHTML;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span style="color: #4ade80; font-weight: 700;">Nusxalandi!</span>
      `;
      btn.style.borderColor = "rgba(74, 222, 128, 0.5)";

      showToast(`Nusxalandi: ${textToCopy}`);
      playKeyClick("success");

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.borderColor = "";
      }, 2000);
    });
  });

  // --------------------------------------------------------------------------
  // 15. KONSOLDA BOBUR DASTURCHI UCHUN TABRIK
  // --------------------------------------------------------------------------
  console.log(
    `%c🚀 Bobur dasturchi — Portfolio 2.0 faollashtirildi! Yosh: ${currentAge} yosh (8-noyabr algoritmi)`,
    "color: #ff4b2b; font-size: 15px; font-weight: bold; background: #07090e; padding: 8px 12px; border-radius: 6px;"
  );
  console.log(
    "%c10-maktab & Mars Space IT School o'quvchisi | Maqsad: Senior Software Engineer @ Google! 💻",
    "color: #38bdf8; font-size: 13px;"
  );
});
