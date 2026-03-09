const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('site-theme');
const techTabs = document.querySelectorAll('.tech-tab');
const techStatus = document.getElementById('tech-status');

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

const upcomingTechMessage = {
  flutter: 'Flutter version is in progress. Coming soon.',
  react: 'React version is in progress. Coming soon.',
  angular: 'Angular version is in progress. Coming soon.'
};

techTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    techTabs.forEach((node) => {
      node.classList.remove('is-active');
      node.setAttribute('aria-pressed', 'false');
    });

    tab.classList.add('is-active');
    tab.setAttribute('aria-pressed', 'true');

    const selectedTech = tab.dataset.tech;
    if (selectedTech === 'html') {
      techStatus.hidden = true;
      techStatus.textContent = '';
      return;
    }

    techStatus.textContent = upcomingTechMessage[selectedTech] || 'This version is in progress. Coming soon.';
    techStatus.hidden = false;
  });
});
