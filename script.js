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
  const activeIframe = document.querySelector('#main-content iframe');
  if (activeIframe) {
    activeIframe.contentWindow.postMessage('theme:' + nextTheme, '*');
  }
});

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

function setupRevealAnimations() {
  document.querySelectorAll('#main-content .reveal').forEach((node, index) => {
    node.style.transitionDelay = `${index * 70}ms`;
    revealObserver.observe(node);
  });
}

setupRevealAnimations();

document.getElementById('year').textContent = new Date().getFullYear();
updateThemeLabel();


let staticOriginalMainContent = '';
document.addEventListener('DOMContentLoaded', () => {
  const mc = document.getElementById('main-content');
  if (mc) {
    staticOriginalMainContent = mc.innerHTML;
    mc.dataset.originalHtml = staticOriginalMainContent;
  }
});

function restoreOriginalMainContent() {
  const mc = document.getElementById('main-content');
  if (mc && !mc.dataset.originalHtml && staticOriginalMainContent) {
    mc.dataset.originalHtml = staticOriginalMainContent;
  }
  if (mc && mc.dataset.originalHtml) {
    mc.innerHTML = mc.dataset.originalHtml;
    setupRevealAnimations();
  }
}

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
      restoreOriginalMainContent();
      return;
    }


    if (selectedTech === 'flutter') {
      techStatus.hidden = true;
      techStatus.textContent = '';
      const mc = document.getElementById('main-content');
      if (mc) {
        if (!mc.dataset.originalHtml) {
          mc.dataset.originalHtml = mc.innerHTML;
        }
        mc.innerHTML = `<div class="container section tech-placeholder" style="min-height:60vh;display:flex;align-items:center;justify-content:center;"><iframe src="flutter_web/index.html" style="width:100%;height:70vh;border:none;box-shadow:0 2px 16px #0001;border-radius:12px;background:transparent;"></iframe></div>`;
        // Send current theme to Flutter iframe after it loads
        const iframe = mc.querySelector('iframe');
        if (iframe) {
          iframe.addEventListener('load', () => {
            const theme = document.body.getAttribute('data-theme') || 'light';
            iframe.contentWindow.postMessage('theme:' + theme, '*');
          });
        }
      }
      return;
    }

    // React and Angular are better viewed full-page instead of nested in an iframe.
    techStatus.textContent = '';
    techStatus.hidden = true;
    const mc = document.getElementById('main-content');
    if (mc) {
      if (!mc.dataset.originalHtml) {
        mc.dataset.originalHtml = mc.innerHTML;
      }
      const src = selectedTech === 'react' ? 'react_web/index.html' : 'angular_web/browser/index.html';
      const title = selectedTech === 'react' ? 'React Portfolio' : 'Angular Portfolio';
      mc.innerHTML = `
        <section class="hero container reveal">
          <p class="eyebrow">${selectedTech === 'react' ? 'React Build' : 'Angular Build'}</p>
          <h1>${title}</h1>
          <p class="intro">
            This version opens as a full page for a cleaner experience.
            The embedded mini-site preview has been removed.
          </p>
          <div class="hero-actions">
            <a class="button primary" href="${src}">Open Full Page</a>
            <a class="button ghost" href="${src}" target="_blank" rel="noreferrer">Open In New Tab</a>
          </div>
        </section>
      `;
      setupRevealAnimations();
    }
  });
});
