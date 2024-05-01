document.querySelector('.upper-menu h2 a').addEventListener('click', function(event) {
  event.preventDefault(); 
  window.scrollTo({ top: 0, behavior: 'smooth' }); 
});


const addToCartButtons = document.querySelectorAll('.card__add');
addToCartButtons.forEach((button, index) => {
  button.addEventListener('click', function() {
    const modal = document.getElementById(`modal-${index}`); 
    modal.style.display = 'block';
    setupModal(modal);
  });
});

const closeButtons = document.querySelectorAll('.close-modal');
closeButtons.forEach((button) => {
  button.addEventListener('click', function() {
    const modal = button.closest('.modal'); 
    modal.style.display = 'none';
  });
});

function setupModal(modal) {
  const prevButton = modal.querySelector('.prev-button');
  const nextButton = modal.querySelector('.next-button');
  const slides = Array.from(modal.querySelectorAll('.slide'));
  let slideIndex = 0;

  slides.forEach((slide, index) => {
    if (index === 0) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }
  });

  prevButton.addEventListener('click', showPreviousSlide);
  nextButton.addEventListener('click', showNextSlide);

  function showPreviousSlide() {
    slides[slideIndex].style.display = 'none'; 
    slideIndex = (slideIndex - 1 + slides.length) % slides.length; 
    slides[slideIndex].style.display = 'block'; 
  }

  function showNextSlide() {
    slides[slideIndex].style.display = 'none'; 
    slideIndex = (slideIndex + 1) % slides.length; 
    slides[slideIndex].style.display = 'block'; 
  }
}
