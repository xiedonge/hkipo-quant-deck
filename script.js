const reveals = document.querySelectorAll(".reveal");
const toast = document.getElementById("toast");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((el) => observer.observe(el));

const copyButton = document.getElementById("copy-template");
const templateText = document.getElementById("template-text");

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
};

if (copyButton && templateText) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(templateText.innerText.trim());
      showToast("模板已复制");
    } catch (error) {
      showToast("复制失败，请手动选择文本");
    }
  });
}

const scrollButton = document.querySelector("[data-scroll='model']");
if (scrollButton) {
  scrollButton.addEventListener("click", () => {
    const target = document.getElementById("model");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}
