(() => {
  const header = document.querySelector(".site-header");
  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const sections = navLinks
    .map((link) => {
      const hash = link.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return null;
      return document.querySelector(hash);
    })
    .filter(Boolean);

  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (!id) return;
        const link = navLinks.find((node) => node.getAttribute("href") === `#${id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((node) => node.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { threshold: 0.55, rootMargin: "-40% 0px -40% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
})();
