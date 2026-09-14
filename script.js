/**
 * BOBUR DASTURCHI — PORTFOLIO JAVASCRIPT
 * Dinamik yosh hisoblash (8-noyabr), interaktiv effektlar, nusxalash va xabarnomalar
 */

document.addEventListener("DOMContentLoaded", () => {
  // 0. DINAMIK YOSH HISOBLASH (Tug'ilgan kun: 8-noyabr 2012-yil)
  // Har doim sana 8-noyabrdan o'tganda yosh avtomatik ravishda 1 yoshga oshadi!
  function calculateBoburAge() {
    const birthYear = 2012;
    const birthMonth = 10; // JavaScript oylarida 10 = Noyabr (0-indeksli)
    const birthDay = 8; // 8-noyabr

    const today = new Date();
    let age = today.getFullYear() - birthYear;
    const monthDiff = today.getMonth() - birthMonth;

    // Agar hali 8-noyabr sanasi kelmagan bo'lsa, 1 yosh ayirib turiladi
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
      age--;
    }
    return age;
  }

  const currentAge = calculateBoburAge();

  // Sahifadagi barcha yosh ko'rsatkichlarini avtomatik yangilash
  document.querySelectorAll(".dynamic-age").forEach((element) => {
    element.textContent = currentAge;
  });

  // 1. Menyu havolalarini faollashtirish (ScrollSpy)
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
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

  // 2. Terminal kartasining sichqoncha harakatiga mos 3D burchak effekti
  const terminal = document.querySelector(".terminal-card");
  if (terminal) {
    terminal.addEventListener("mousemove", (e) => {
      const rect = terminal.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      terminal.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    terminal.addEventListener("mouseleave", () => {
      terminal.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  }

  // 3. Nusxa olish (Copy to clipboard) va Premium Toast xabarnomasi
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
    }, 2800);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (err) {
        // Eski brauzerlar uchun zaxira usul
        const tempInput = document.createElement("input");
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      // Tugmada vizual muvaffaqiyat holati
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span style="color: #4ade80; font-weight: 700;">Nusxalandi!</span>
      `;
      btn.style.borderColor = "rgba(74, 222, 128, 0.5)";

      showToast(`Muvaffaqiyatli nusxalandi: ${textToCopy}`);

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.borderColor = "";
      }, 2000);
    });
  });

  // 4. Konsolda Bobur dasturchi uchun xush kelibsiz xabari
  console.log(
    `%cSalom, Bobur dasturchi! 🚀 Hozirgi yoshingiz: ${currentAge} yosh (8-noyabrda avtomatik yangilanadi)`,
    "color: #ff4b2b; font-size: 16px; font-weight: bold; background: #07090e; padding: 10px; border-radius: 8px;",
  );
  console.log(
    "%cTa'lim: 10-maktab & Mars IT School (Mars Space) | Katta maqsad: Senior Engineer @ Google!",
    "color: #38bdf8; font-size: 13px;",
  );
});
