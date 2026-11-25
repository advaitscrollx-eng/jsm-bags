/* ==========================================================================
   JSM BAGS - CINEMATIC DUAL-SCENE SCROLL-CONTROLLED VIDEO ENGINE
   High-performance frame scrubbing via HTML5 Canvas, GSAP ScrollTrigger,
   dual-sequence progressive WebP loading, and zero main-thread blocking.

   Scene 1: 360° Studio Showcase (Video 1: 149 frames)
   Scene 2: Rajahmundry Artisan Stitching & Assembly (Video 2: 153 frames)
   ========================================================================== */

(function () {
  'use strict';

  // Configuration for both cinematic sequences
  const SCENE1 = {
    totalFrames: 149,
    dir: 'assets/images/jsm-scroll-frames/',
    prefix: 'frame_',
    ext: '.webp',
    badge: '✨ 360° STUDIO SHOWCASE',
    title: 'Precision Form &bull; Signature Architecture',
    subtitle: 'Scroll to explore complete 360° contours, edge reinforcement, and balanced geometry.'
  };

  const SCENE2 = {
    totalFrames: 153,
    dir: 'assets/images/second-video-frames/',
    prefix: 'frame_',
    ext: '.webp',
    badge: '🪡 RAJAHMUNDRY WORKSHOP',
    title: 'Artisan Needlecraft &bull; Industrial Assembly',
    subtitle: 'Witness master craftsmanship, heavy-duty lockstitching, and authentic bag production.'
  };

  // Helper to format frame file paths: frame_0001.webp
  function getFramePath(scene, index) {
    const num = String(index + 1).padStart(4, '0');
    return `${scene.dir}${scene.prefix}${num}${scene.ext}`;
  }

  // Dual Frame Buffers
  const loadedFrames1 = new Array(SCENE1.totalFrames).fill(null);
  const loadedFrames2 = new Array(SCENE2.totalFrames).fill(null);

  // Engine State
  let lastDrawnImg = null;
  let isPriorityReady = false;
  let currentProgress = 0;
  let activeSceneNum = 1;
  let rafId = null;
  let scrollTriggerInstance = null;
  let isEnginePaused = false;

  // DOM Elements
  let section, stickyWrapper, canvas, ctx, poster, loader, loaderPercent, scrollHint;
  let chapterPill1, chapterPill2, cinematicBadge, cinematicTitle, cinematicSubtitle, progressFill;

  // Render Engine: Draws requested image onto canvas preserving aspect ratio
  function drawImageOnCanvas(img, alpha = 1.0, scaleMultiplier = 1.0) {
    if (!canvas || !ctx) return;
    if (!img || !img.complete || img.naturalWidth === 0) {
      if (lastDrawnImg && lastDrawnImg.complete && lastDrawnImg.naturalWidth > 0) {
        img = lastDrawnImg;
      } else {
        return;
      }
    }

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;

    // Both videos are normalized to 720 x 1280 (9:16 portrait)
    const imgW = img.naturalWidth || 720;
    const imgH = img.naturalHeight || 1280;
    const imgRatio = imgW / imgH;
    const canvasRatio = cw / ch;

    let drawW, drawH, drawX, drawY;

    // "contain" fit - ensures the entire bag & artisan workshop remain in full view
    if (canvasRatio > imgRatio) {
      drawH = ch * scaleMultiplier;
      drawW = ch * imgRatio * scaleMultiplier;
    } else {
      drawW = cw * scaleMultiplier;
      drawH = (cw / imgRatio) * scaleMultiplier;
    }

    drawX = (cw - drawW) / 2;
    drawY = (ch - drawH) / 2;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Fill background only when starting fresh or scaling down
    if (scaleMultiplier < 0.999 || alpha < 0.999) {
      ctx.fillStyle = '#080E0A';
      ctx.fillRect(0, 0, cw, ch);
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    lastDrawnImg = img;

    // Hide poster once canvas paints successfully
    if (poster && poster.style.display !== 'none') {
      poster.style.display = 'none';
    }
  }

  // Find loaded frame or closest neighbor to avoid any dropped frames
  function getLoadedFrame(framesArray, totalFrames, targetIndex) {
    if (framesArray[targetIndex] && framesArray[targetIndex].complete && framesArray[targetIndex].naturalWidth > 0) {
      return framesArray[targetIndex];
    }
    // Backward search
    for (let i = targetIndex - 1; i >= 0; i--) {
      if (framesArray[i] && framesArray[i].complete && framesArray[i].naturalWidth > 0) {
        return framesArray[i];
      }
    }
    // Forward search
    for (let i = targetIndex + 1; i < totalFrames; i++) {
      if (framesArray[i] && framesArray[i].complete && framesArray[i].naturalWidth > 0) {
        return framesArray[i];
      }
    }
    return lastDrawnImg;
  }

  // Master Render Loop based on scroll progress (0.0 to 1.0)
  function renderProgress(progress) {
    if (isEnginePaused) return;
    const p = Math.max(0, Math.min(1, progress));
    currentProgress = p;

    // Update Bottom Progress Fill Bar
    if (progressFill) {
      progressFill.style.width = `${(p * 100).toFixed(1)}%`;
    }

    // SCENE TIMELINE BREAKDOWN:
    // 0.00 -> 0.46: Scene 1 (360° Studio Showcase, frames 0..148)
    // 0.46 -> 0.54: Seamless 3D Transition / Cross-dissolve between Scene 1 & Scene 2
    // 0.54 -> 1.00: Scene 2 (Rajahmundry Workshop Craftsmanship, frames 0..152)

    if (p <= 0.46) {
      // --- SCENE 1 ACTIVE ---
      updateSceneUI(1);
      const normalizedP = Math.max(0, Math.min(1, p / 0.46));
      const frameIdx = Math.min(SCENE1.totalFrames - 1, Math.round(normalizedP * (SCENE1.totalFrames - 1)));
      const img = getLoadedFrame(loadedFrames1, SCENE1.totalFrames, frameIdx);
      drawImageOnCanvas(img, 1.0, 1.0);
    } else if (p >= 0.54) {
      // --- SCENE 2 ACTIVE ---
      updateSceneUI(2);
      const normalizedP = Math.max(0, Math.min(1, (p - 0.54) / 0.46));
      const frameIdx = Math.min(SCENE2.totalFrames - 1, Math.round(normalizedP * (SCENE2.totalFrames - 1)));
      const img = getLoadedFrame(loadedFrames2, SCENE2.totalFrames, frameIdx);
      drawImageOnCanvas(img, 1.0, 1.0);
    } else {
      // --- SCENE 1 -> SCENE 2 SEAMLESS TRANSITION ZONE (0.46 to 0.54) ---
      const t = (p - 0.46) / 0.08; // 0.0 -> 1.0
      updateSceneUI(t < 0.5 ? 1 : 2);

      // 3D Perspective breathing scale (subtle 2% focal zoom during cut)
      const scaleEffect = 1.0 + Math.sin(t * Math.PI) * 0.02;

      // Draw end of Scene 1 as base
      const img1 = getLoadedFrame(loadedFrames1, SCENE1.totalFrames, SCENE1.totalFrames - 1);
      const img2 = getLoadedFrame(loadedFrames2, SCENE2.totalFrames, 0);

      if (canvas && ctx) {
        ctx.fillStyle = '#080E0A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw Base Scene 1
      drawImageOnCanvas(img1, 1.0 - (t * 0.4), scaleEffect);

      // Cross-dissolve Incoming Scene 2 on top
      if (img2) {
        drawImageOnCanvas(img2, t, scaleEffect);
      }
    }
  }

  // Throttled RAF renderer
  function requestProgressRender(progress) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      renderProgress(progress);
    });
  }

  // Update Chapter Pills & Header Text smoothly
  function updateSceneUI(sceneNum) {
    if (activeSceneNum === sceneNum) return;
    activeSceneNum = sceneNum;

    if (chapterPill1 && chapterPill2) {
      if (sceneNum === 1) {
        chapterPill1.classList.add('active');
        chapterPill2.classList.remove('active');
      } else {
        chapterPill2.classList.add('active');
        chapterPill1.classList.remove('active');
      }
    }

    const conf = sceneNum === 1 ? SCENE1 : SCENE2;
    if (cinematicBadge) cinematicBadge.innerHTML = conf.badge;
    if (cinematicTitle) cinematicTitle.innerHTML = conf.title;
    if (cinematicSubtitle) cinematicSubtitle.innerHTML = conf.subtitle;
  }

  // Canvas Resizing based on container dimensions & device pixel ratio
  function resizeCanvas() {
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Cap DPR at 1.75 on mobile, 2.0 on desktop to preserve memory & battery
    const isMobile = window.innerWidth <= 768;
    const maxDpr = isMobile ? 1.75 : 2.0;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    requestProgressRender(currentProgress);
  }

  // Progressive Preloading Engine for Both Sequences
  function preloadAllSequences() {
    let priorityLoadedCount = 0;
    const priorityThresholdScene1 = 25; // First 25 frames of Scene 1
    const priorityThresholdScene2 = 15; // First 15 frames of Scene 2
    const totalPriorityThreshold = priorityThresholdScene1 + priorityThresholdScene2;

    function handlePriorityLoad() {
      priorityLoadedCount++;
      if (loaderPercent) {
        const pct = Math.min(100, Math.round((priorityLoadedCount / totalPriorityThreshold) * 100));
        loaderPercent.textContent = `${pct}%`;
      }

      if (!isPriorityReady && priorityLoadedCount >= totalPriorityThreshold) {
        isPriorityReady = true;
        if (loader) {
          loader.classList.add('faded');
          setTimeout(() => {
            if (loader) loader.style.display = 'none';
          }, 400);
        }
      }
    }

    // 1. Scene 1 - Instant Frame 0 Decode
    const s1f0 = new Image();
    s1f0.src = getFramePath(SCENE1, 0);
    if ('decode' in s1f0) {
      s1f0.decode().then(() => {
        loadedFrames1[0] = s1f0;
        handlePriorityLoad();
        requestProgressRender(0);
      }).catch(() => {
        s1f0.onload = () => {
          loadedFrames1[0] = s1f0;
          handlePriorityLoad();
          requestProgressRender(0);
        };
      });
    } else {
      s1f0.onload = () => {
        loadedFrames1[0] = s1f0;
        handlePriorityLoad();
        requestProgressRender(0);
      };
    }

    // 2. Scene 2 - Instant Frame 0 Decode (for seamless transition)
    const s2f0 = new Image();
    s2f0.src = getFramePath(SCENE2, 0);
    if ('decode' in s2f0) {
      s2f0.decode().then(() => {
        loadedFrames2[0] = s2f0;
        handlePriorityLoad();
      }).catch(() => {
        s2f0.onload = () => {
          loadedFrames2[0] = s2f0;
          handlePriorityLoad();
        };
      });
    } else {
      s2f0.onload = () => {
        loadedFrames2[0] = s2f0;
        handlePriorityLoad();
      };
    }

    // 3. Priority Batch: Scene 1 frames 1..24
    for (let i = 1; i < priorityThresholdScene1; i++) {
      const img = new Image();
      img.src = getFramePath(SCENE1, i);
      img.onload = () => {
        loadedFrames1[i] = img;
        handlePriorityLoad();
      };
      img.onerror = () => handlePriorityLoad();
    }

    // 4. Priority Batch: Scene 2 frames 1..14
    for (let i = 1; i < priorityThresholdScene2; i++) {
      const img = new Image();
      img.src = getFramePath(SCENE2, i);
      img.onload = () => {
        loadedFrames2[i] = img;
        handlePriorityLoad();
      };
      img.onerror = () => handlePriorityLoad();
    }

    // 5. Background Lazy Chunks for Remaining Frames
    let s1Next = priorityThresholdScene1;
    let s2Next = priorityThresholdScene2;

    function loadRemainingChunks() {
      const chunkSize = 16;
      let moreToLoad = false;

      // Load chunk of Scene 1
      if (s1Next < SCENE1.totalFrames) {
        const end = Math.min(SCENE1.totalFrames, s1Next + chunkSize);
        for (let i = s1Next; i < end; i++) {
          const img = new Image();
          img.src = getFramePath(SCENE1, i);
          img.onload = () => { loadedFrames1[i] = img; };
        }
        s1Next = end;
        moreToLoad = true;
      }

      // Load chunk of Scene 2
      if (s2Next < SCENE2.totalFrames) {
        const end = Math.min(SCENE2.totalFrames, s2Next + chunkSize);
        for (let i = s2Next; i < end; i++) {
          const img = new Image();
          img.src = getFramePath(SCENE2, i);
          img.onload = () => { loadedFrames2[i] = img; };
        }
        s2Next = end;
        moreToLoad = true;
      }

      if (moreToLoad) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadRemainingChunks, { timeout: 250 });
        } else {
          setTimeout(loadRemainingChunks, 50);
        }
      }
    }

    // Start lazy background chunking
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadRemainingChunks, { timeout: 400 });
    } else {
      setTimeout(loadRemainingChunks, 100);
    }
  }

  // Setup Scroll Animation (GSAP ScrollTrigger or Native Fallback)
  function setupScrollAnimation() {
    if (!section || !stickyWrapper) return;

    // Kill any existing ScrollTrigger before creating a new one
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }

    // Check for Reduced Motion accessibility or Mobile viewport (<= 768px)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;

    if (isMobile || prefersReducedMotion) {
      if (loader) loader.style.display = 'none';
      if (scrollHint) scrollHint.style.display = 'none';
      renderProgress(0);
      setupMobileShowcase();
      return;
    }

    // GSAP + ScrollTrigger Engine (Desktop only - avoids mobile pin fights & dead space)
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Pin the stickyWrapper using GSAP's pin spacer.
      // (CSS .cinematic-sticky-wrapper has position: relative to avoid fighting GSAP)
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyWrapper,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.6, // Smooth scrubbing forward and backward
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (isEnginePaused) return;
          requestProgressRender(self.progress);

          // Fade scroll hint once scrolling starts
          if (scrollHint) {
            if (self.progress > 0.03) {
              scrollHint.classList.add('faded');
            } else {
              scrollHint.classList.remove('faded');
            }
          }
        }
      });
    } else {
      // Fallback: Apply fallback class for CSS sticky positioning
      section.classList.add('no-gsap');

      let ticking = false;
      const onNativeScroll = () => {
        if (isEnginePaused || ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect();
          const totalScrollable = section.offsetHeight - window.innerHeight;

          if (totalScrollable > 0) {
            const currentScroll = -rect.top;
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
            requestProgressRender(progress);

            if (scrollHint) {
              if (progress > 0.03) {
                scrollHint.classList.add('faded');
              } else {
                scrollHint.classList.remove('faded');
              }
            }
          }
          ticking = false;
        });
      };

      window.addEventListener('scroll', onNativeScroll, { passive: true });
    }
  }

  // Mobile Clean Showcase: Seamless frame rotation loop & touch scrub without scroll-trapping
  let mobileLoopTimer = null;
  let mobileCurrentProgress = 0;

  function setupMobileShowcase() {
    if (!section || !canvas) return;

    let isSectionVisible = false;
    let isUserTouching = false;
    let touchStartX = 0;
    let touchStartProgress = 0;

    // Interactive Touch Swipe on Canvas to rotate 360°
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isUserTouching = true;
        touchStartX = e.touches[0].clientX;
        touchStartProgress = mobileCurrentProgress;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (isUserTouching && e.touches.length === 1 && touchStartX) {
        const dx = e.touches[0].clientX - touchStartX;
        const deltaProgress = -dx / (window.innerWidth * 1.2);
        let newP = touchStartProgress + deltaProgress;
        if (newP < 0) newP = 0;
        if (newP > 1) newP = 1;
        mobileCurrentProgress = newP;
        requestProgressRender(newP);
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      isUserTouching = false;
    }, { passive: true });

    // Smooth subtle frame rotation loop when visible in viewport
    function loopStep() {
      if (!isEnginePaused && isSectionVisible && !isUserTouching) {
        if (mobileCurrentProgress <= 0.45) {
          mobileCurrentProgress += 0.0025;
          if (mobileCurrentProgress > 0.45) mobileCurrentProgress = 0;
        } else if (mobileCurrentProgress >= 0.54) {
          mobileCurrentProgress += 0.0025;
          if (mobileCurrentProgress > 0.99) mobileCurrentProgress = 0.55;
        }
        requestProgressRender(mobileCurrentProgress);
      }
      mobileLoopTimer = requestAnimationFrame(loopStep);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isSectionVisible = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      observer.observe(section);
    } else {
      isSectionVisible = true;
    }

    if (mobileLoopTimer) cancelAnimationFrame(mobileLoopTimer);
    mobileLoopTimer = requestAnimationFrame(loopStep);
  }

  // Interactive Chapter Click Seeking
  window.seekCinematicScene = function (sceneNum) {
    if (!section) return;
    const targetProgress = sceneNum === 1 ? 0.02 : 0.58;
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      mobileCurrentProgress = targetProgress;
      requestProgressRender(targetProgress);
      return;
    }

    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sectionStart = rect.top + scrollTop;
    const totalScrollable = section.offsetHeight - window.innerHeight;

    if (totalScrollable > 0) {
      const targetScroll = sectionStart + (totalScrollable * targetProgress);
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Initialize Experience
  function initCinematicEngine() {
    section = document.getElementById('cinematicExperience');
    if (!section) return;

    stickyWrapper = document.getElementById('cinematicStickyWrapper');
    canvas = document.getElementById('cinematicCanvas');
    if (canvas) ctx = canvas.getContext('2d', { alpha: false }); // alpha: false optimizes canvas composite
    poster = document.getElementById('cinematicPoster');
    loader = document.getElementById('cinematicLoader');
    loaderPercent = document.getElementById('loaderPercent');
    scrollHint = document.getElementById('cinematicScrollHint');
    chapterPill1 = document.getElementById('chapterPill1');
    chapterPill2 = document.getElementById('chapterPill2');
    cinematicBadge = document.getElementById('cinematicBadge');
    cinematicTitle = document.getElementById('cinematicTitle');
    cinematicSubtitle = document.getElementById('cinematicSubtitle');
    progressFill = document.getElementById('cinematicProgressFill');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    preloadAllSequences();
    setupScrollAnimation();
  }

  // Safe Lifecycle Hooks for SPA View Transitions
  window.refreshCinematicScroll = function () {
    if (isEnginePaused) return;
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
    resizeCanvas();
  };

  window.pauseCinematicScroll = function () {
    isEnginePaused = true;
    if (scrollTriggerInstance) {
      scrollTriggerInstance.disable();
    }
  };

  window.resumeCinematicScroll = function () {
    isEnginePaused = false;
    if (scrollTriggerInstance) {
      scrollTriggerInstance.enable();
      window.ScrollTrigger?.refresh();
    }
    resizeCanvas();
  };

  // Auto-init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCinematicEngine);
  } else {
    initCinematicEngine();
  }
})();
