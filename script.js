
class MovieTheater {
  constructor(container, movieSelect, datePicker, countDisplay, totalDisplay) {
    this.container = container;
    this.movieSelect = movieSelect;
    this.datePicker = datePicker;
    this.countDisplay = countDisplay;
    this.totalDisplay = totalDisplay;

    // Load stored movie and date selection
    this.ticketPrice = +this.movieSelect.value;
    this.currentDate = localStorage.getItem('selectedDate') || this.datePicker.value || this.getTodayDate();
    this.datePicker.value = this.currentDate;

    this.seats = document.querySelectorAll('.row .seat:not(.occupied)');

    this.populateUI();
    this.addEventListeners();
    this.updateSelectedCount();
  }

  getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getStorageKey() {
    // Unique key per movie and date
    return `selectedSeats_${this.currentDate}_${this.movieSelect.selectedIndex}`;
  }

  setMovieData(index, price) {
    localStorage.setItem('selectedMovieIndex', index);
    localStorage.setItem('selectedMoviePrice', price);
  }

  updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const seatIndices = [...selectedSeats].map(seat => [...this.seats].indexOf(seat));
    localStorage.setItem(this.getStorageKey(), JSON.stringify(seatIndices));
    const count = selectedSeats.length;
    this.countDisplay.innerText = count;
    this.totalDisplay.innerText = count * this.ticketPrice;
  }

  populateUI() {
    this.clearSeats();

    const storedSeats = localStorage.getItem(this.getStorageKey());
    let selectedSeats = [];

    try {
      selectedSeats = JSON.parse(storedSeats) || [];
    } catch (e) {
      console.warn('Invalid stored seat data', e);
    }

    if (Array.isArray(selectedSeats)) {
      this.seats.forEach((seat, index) => {
        if (selectedSeats.includes(index)) {
          seat.classList.add('selected');
        }
      });
    }

    const movieIndex = localStorage.getItem('selectedMovieIndex');
    if (movieIndex !== null) {
      this.movieSelect.selectedIndex = movieIndex;
      this.ticketPrice = +this.movieSelect.value;
    }
  }

  clearSeats() {
    this.seats.forEach(seat => seat.classList.remove('selected'));
  }

  addEventListeners() {
    this.movieSelect.addEventListener('change', (e) => {
      this.ticketPrice = +e.target.value;
      this.setMovieData(e.target.selectedIndex, e.target.value);
      this.populateUI(); // Refresh for current date + movie
      this.updateSelectedCount();
    });

    this.datePicker.addEventListener('change', (e) => {
      this.currentDate = e.target.value || this.getTodayDate();
      localStorage.setItem('selectedDate', this.currentDate); // Persist selected date
      this.populateUI(); // Refresh seat selection for new date
      this.updateSelectedCount();
    });

    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        this.updateSelectedCount();
      }
    });
  }
}

// Initialize
const theater = new MovieTheater(
  document.querySelector('.container'),
  document.getElementById('movie'),
  document.getElementById('movieDate'),
  document.getElementById('count'),
  document.getElementById('total')
);
