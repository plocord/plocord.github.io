// Main JavaScript entry for the portfolio site
// Small, well-commented helpers: mobile nav behavior and optional smooth scrolling.
// Page fade-in (very small, accessible):
// - Add a 'js' class to <html> so CSS-only fallback remains visible for no-JS users.
// - Add 'is-rendered' to <body> once DOM is ready (or immediately if already ready) to trigger the CSS opacity transition.
(function enablePageFadeIn(){
  try{
    // Mark that JS is present (so default is visible if JS is absent)
    document.documentElement.classList.add('js');

    // If user prefers reduced motion, skip animations: show immediately
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function showNow(){
      if(!document.body) return requestAnimationFrame(showNow);
      document.body.classList.add('is-rendered');
    }

    if(prefersReduced){
      // No transition — set visible immediately
      if(document.body) document.body.classList.add('is-rendered');
      else document.addEventListener('DOMContentLoaded', function(){ document.body.classList.add('is-rendered'); });
      return;
    }

    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', showNow);
    } else {
      // DOM already ready — run on next frame so CSS has time to apply
      requestAnimationFrame(showNow);
    }
  }catch(e){/* noop — fail silently */}
})();
// Manage keyboard vs pointer focus visibility for accessibility
// - Adds/removes `user-is-tabbing` on <html> so CSS can show focus styles
//   only for keyboard users (fallback for browsers without :focus-visible).
(function manageKeyboardFocus(){
  try{
    var docEl = document.documentElement;
    var handleFirstTab = function(e){
      if(e.key === 'Tab' || e.keyCode === 9){
        docEl.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('pointerdown', handleMouseDown);
        window.addEventListener('touchstart', handleMouseDown);
      }
    };
    var handleMouseDown = function(){
      docEl.classList.remove('user-is-tabbing');
      // revert to listening for Tab again
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('pointerdown', handleMouseDown);
      window.removeEventListener('touchstart', handleMouseDown);
      window.addEventListener('keydown', handleFirstTab);
    };

    // Start listening for keyboard usage
    window.addEventListener('keydown', handleFirstTab);
  }catch(e){/* noop */}
})();
document.addEventListener('DOMContentLoaded', function(){
  console.log('Portfolio main.js loaded');

  // Fill dynamic year in any element with id="year" (keeps pages DRY)
  (function fillYear(){
    var el = document.getElementById('year');
    if(el) el.textContent = new Date().getFullYear();
  })();

  // Mark current nav link for accessibility (aria-current)
  (function markCurrentNav(){
    try{
      var path = window.location.pathname.split('/').pop() || 'index.html';
      var nav = document.getElementById('primary-menu');
      if(!nav) return;
      var links = nav.querySelectorAll('a');
      links.forEach(function(a){
        // Compare href filename (simple, works for this static site)
        var href = a.getAttribute('href') || '';
        if(href === path || (href === 'index.html' && path === '')){
          a.setAttribute('aria-current','page');
        }
      });
    }catch(e){/* noop */}
  })();

  /*
    Mobile navigation helper:
    - When a navigation link is clicked on small screens, close the checkbox-based hamburger menu.
    - The markup expects an input#nav-toggle (type=checkbox) and a ul.nav-list as siblings.
  */
  (function mobileNavCloseOnClick(){
    var navToggle = document.getElementById('nav-toggle');
    var navList = document.getElementById('primary-menu');
    if(!navToggle || !navList) return; // nothing to do if structure missing

    // Delegate clicks on links inside the nav-list
    navList.addEventListener('click', function(e){
      var target = e.target;
      if(target && target.tagName === 'A'){
        // Small timeout to allow the link to be followed in single-page anchors.
        // If the link is external or page navigation occurs, unchecking is harmless.
        setTimeout(function(){ navToggle.checked = false; }, 50);
      }
    });
  })();

  /*
    Smooth scrolling for same-page anchor links (optional, minimal):
    - Only targets links that begin with '#' and refer to an element on the page.
    - Uses native scroll behavior when available.
  */
  (function enableSmoothScrolling(){
    // Prefer CSS native smooth scrolling. If the browser supports the
    // CSS 'scroll-behavior' property, let CSS handle in-page anchor
    // navigation and avoid intercepting clicks. Otherwise fall back to
    // a small JS handler that performs smooth scroll behavior.
    if('scrollBehavior' in document.documentElement.style) return;

    // Attach handler to the document for delegated clicks on anchor links
    document.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if(!a || !a.getAttribute) return;
      var href = a.getAttribute('href') || '';
      if(href.charAt(0) !== '#') return; // not an in-page anchor

      var id = href.slice(1);
      if(!id) return; // href="#" or empty

      var target = document.getElementById(id);
      if(!target) return; // no element to scroll to

      // Prevent default jump and smooth-scroll instead (fallback)
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 8; // slight offset
      window.scrollTo({ top: top });
      // Update location.hash without jumping
      history.replaceState(null, '', '#' + id);
    });
  })();

});
