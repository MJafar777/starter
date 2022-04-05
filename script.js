'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let latitude = 0;
let longitude = 0;
let mapevent = '';
let map;

class Joy {
  date = new Date();
  id = (Date.now() + '').slice(-7);
  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
  _setTavsif() {
    // prettier-ignore
    const months = ['January','February','March','April','May', 'June','Jule','August','September','October','November','december']
    this.malumot = `${this.type[0].toUppercase()}${this.type.slice(1)}on ${
      months[this.date.getMonth()]
    }${this.date.getDate}`;
  }
}

class Yugurish extends Joy {
  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this.calcTime();
  }
  calcTime() {
    this.tezlik = this.distance / this.duration;
    return this.tezlik;
  }
}
class Velik extends Joy {
  constructor(distance, duration, coords, elevation) {
    super(distance, duration, coords);
    this.elevation = elevation;
    this.calcSpeed();
  }
  calcSpeed() {
    this.tezlik = this.distance / this.duration;
    return this.tezlik;
  }
}
// const yugurUmid = new Yugurish(2, 2, [22, 55], 20);
// const velikUmid = new Velik(5, 7, [66, 88], 10);
// console.log(yugurUmid);
// class Piyoda extends Joy {
//   constructor(qayegaBorishimiz, qayerdanBorshimiz, tezlik) {}
// }

class App {
  #mashqlar = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._createObject.bind(this));
    inputType.addEventListener('change', this._toogleSelect);
  }

  // hozirgi urnimizni koordinatalarni olish metodi
  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._showMap.bind(this),
      function () {
        alert('xatolik. olinmadi');
      }
    );
  }
  // urnimizni olgan  koordinatalarni map ga berish metodi
  _showMap(e) {
    latitude = e.coords.latitude;
    longitude = e.coords.longitude;

    map = L.map('map', {
      zoomControl: false,
    }).setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
    this._showForm();
  }
  // formani ochish metodi
  _showForm(e) {
    map.on('click', function (e) {
      mapevent = e;

      form.classList.remove('hidden');
      inputDistance.focus();
      L.Routing.control({
        waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
      }).addTo(map);
      // console.log(e);
    });
  }
  // forma subbmit bulsa marker chiqarish
  _addMarker(e) {
    L.marker([e.coords[0], e.coords[1]])
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 300,
          minWIdth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
          .setLatLng([e.coords[0], e.coords[1]])
          .setContent('Working')
          .openOn(map)
      )
      .openPopup();
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
  }
  _toogleSelect(e) {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }
  // form malumotlarini constructorga olish
  _createObject(e) {
    e.preventDefault();
    let mashq = '';
    const checkNumber = (...inputs) => {
      return inputs.every(val => Number.isFinite(val));
    };
    const checkMusbat = (...inputs) => {
      return inputs.every(val => val > 0);
    };
    let distance = +inputDistance.value;
    let duration = +inputDuration.value;
    let type = inputType.value;
    if (type === 'running') {
      let cadence = +inputCadence.value;

      if (
        !checkNumber(distance, duration, cadence) ||
        !checkMusbat(distance, duration)
      ) {
        return alert('Musbat sonlar kiriting');
      }
      mashq = new Yugurish(
        distance,
        duration,
        [mapevent.latlng.lat, mapevent.latlng.lng],
        distance
      );
      this._addMarker(mashq);
    }
    if (type === 'cycling') {
      let elevation = +inputElevation.value;

      if (
        !checkNumber(distance, duration, elevation) ||
        !checkMusbat(distance, duration)
      ) {
        return alert('Musbat sonlar kiriting');
      }
      mashq = new Velik(
        distance,
        duration,
        [mapevent.latlng.lat, mapevent.latlng.lng],
        distance
      );
    }
    this._addMarker(mashq);
    this.#mashqlar.push(mashq);
    this._setLocalStorage(this.#mashqlar);
  }
  _setLocalStorage(mashqlar) {
    localStorage.setItem('one', JSON.stringify(mashqlar));
  }
  _moveCenter(e) {
    let element = e.target.closest('.workout');

    let objs = this.#mashqlar.find(val => {
      return element.getAttribute('data-id') == val.id;
    });
    let cordinata = objs.coords;
    map.setView;
  }
}
const magicMap = new App();

// setTimeout(function () {
//   console.log(latitude, longitude);
// }, 3000);
