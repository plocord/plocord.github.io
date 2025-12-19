// Main JavaScript entry for the portfolio site
// Small, well-commented helpers: mobile nav behavior and optional smooth scrolling.
document.addEventListener('DOMContentLoaded', function(){
  console.log('Portfolio main.js loaded');

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
    // Feature detect scroll behavior support
    var supportsSmooth = 'scrollBehavior' in document.documentElement.style;

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

      // Prevent default jump and smooth-scroll instead
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 8; // slight offset

      if(supportsSmooth){
        window.scrollTo({ top: top, behavior: 'smooth' });
      } else {
        window.scrollTo(0, top);
      }
      // Update location.hash without jumping
      history.replaceState(null, '', '#' + id);
    });
  })();

});
