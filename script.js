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
  // Notify Flutter iframe of theme change
  const flutterIframe = document.querySelector('#main-content iframe');
  if (flutterIframe) {
    flutterIframe.contentWindow.postMessage('theme:' + nextTheme, '*');
  }
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


const mainContent = document.getElementById('main-content');
// Store a static copy of the original HTML at page load
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
  // If the data attribute is missing, restore from the static copy
  if (mc && !mc.dataset.originalHtml && staticOriginalMainContent) {
    mc.dataset.originalHtml = staticOriginalMainContent;
  }
  if (mc && mc.dataset.originalHtml) {
    mc.innerHTML = mc.dataset.originalHtml;
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


    // Diagnostic logging
    console.log('Tab clicked:', selectedTech);




    // Always restore original content for HTML
    if (selectedTech === 'html') {
      console.log('Restoring original main content');
      techStatus.hidden = true;
      techStatus.textContent = '';
      // If the data attribute is missing (e.g., after React/Angular placeholder), re-initialize it from the current content
      const mc = document.getElementById('main-content');
      if (mc && !mc.dataset.originalHtml) {
        mc.dataset.originalHtml = mc.innerHTML;
      }
      restoreOriginalMainContent();
      return;
    }


    // Only show iframe for Flutter
    if (selectedTech === 'flutter') {
      console.log('Embedding Flutter iframe');
      techStatus.hidden = true;
      techStatus.textContent = '';
      const mc = document.getElementById('main-content');
      if (mc) {
        // If original HTML is missing (e.g., after iframe replacement), re-initialize it
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

    // Show placeholder for React/Angular
    techStatus.textContent = '';
    techStatus.hidden = true;
    const mc = document.getElementById('main-content');
    if (mc) {
      // If original HTML is missing (e.g., after iframe replacement), re-initialize it
      if (!mc.dataset.originalHtml) {
        mc.dataset.originalHtml = mc.innerHTML;
      }
      mc.innerHTML = `<div class="container section tech-placeholder"><h2>${selectedTech.charAt(0).toUpperCase() + selectedTech.slice(1)} Version</h2><p>${upcomingTechMessage[selectedTech] || 'This version is in progress. Coming soon.'}</p></div>`;
    }
  });
});
