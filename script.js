const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('site-theme');

if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
}

const updateThemeLabel = () => {
  const activeTheme = document.body.getAttribute('data-theme') || 'light';
  themeToggle.textContent = activeTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
};

themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.body.setAttribute('data-theme', nextTheme);
  localStorage.setItem('site-theme', nextTheme);
  updateThemeLabel();
});

const revealNodes = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealNodes.forEach((node, index) => {
  node.style.transitionDelay = `${index * 70}ms`;
  revealObserver.observe(node);
});

document.getElementById('year').textContent = new Date().getFullYear();
updateThemeLabel();
