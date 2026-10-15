import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import 'lenis/dist/lenis.css';
import './styles/fonts.css';
import './styles/global.css';
import { App } from './App';
import { getMotion } from './lib/motion';

// Resolve the motion setting (URL param, localStorage, OS) before hydration.
getMotion();

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is prerendered (scripts/prerender.mjs); dev serves an empty shell.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
