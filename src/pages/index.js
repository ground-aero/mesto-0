// index.js - Корневая точка проекта. Файл содержит только инициализацию необходимых главной странице модулей — функций и классов
// В файле index.js должно остаться только создание классов и добавление некоторых обработчиков.
// import './index.css';
import { FormValidator } from '../components/FormValidator.js';
import { Card } from '../components/Card.js';
import { Section } from '../components/Section.js';
import PopupWithImage from '../components/PopupWithImage.js';
import { UserInfo } from '../components/UserInfo.js';
import {
  btnEditProfile,
  btnAddPlace,
  initialCards,
  inputEditName,
  inputEditJob,
  config,
} from '../utils/constants.js';
import { PopupWithForm } from '../components/PopupWithForm.js';

// Card ----------- создает экз, и возвращает разметку
function initialiseCard(dataCard) {
  const newCard = new Card(
    { data: dataCard, handleCardClick }, //handleCardClick: open, handleRemoveCard
    '#card-template'
  );

  return newCard.generateCard(); //возвращает разметку карточки, методом на экземпляре класса. вызываем генерацию карточки на том что нам вернул экземпляр класса
}

// -----------------------------------------------

// обработчик формы Edit / "сохранить" данные из инпутов формы профиля
function handleProfileFormSubmit(formDataObject) {
  newUser.setUserInfo(formDataObject); // сохраняем в DOM данные вводимые <- из полей формы профиля // setEditNodeTextContent();
  newPopupProfile.close(); // закрываем попап
}

// обработчик формы Place (перекидываем из index -> PopupWithForm)
function handlePlaceFormSubmit(formDataObject) {
  // const newCard = initialiseCard(formDataObject); //создает экз класса и возвращает разметку. Она требует данные (данные реализованы здесь выше)
  // section.addItem(newCard); //добавляется своя карточка в момент нажатия сабмит формы
  //  вариант-2
  section.addItem(initialiseCard(formDataObject));
}

// Section ---------------------------------------- (cardsList = section)
// Ф-ция говорит что нужно сделать для одной карточки когда получим данные, то что вернет initialiseCard() -готовую разметку. // Выгружаю начальные карточки. Инициализирую класс Section, передаю: {initialCards, renderer}, containerSelect
const section = new Section(
  {
    items: initialCards,
    renderer: (cardItem, container) => {
      //описывает что сделать с данными при переборе в цикле. //cardItem, container - просто параметры
      section.addItem(initialiseCard(cardItem, container));
    },
  },
  '.elements__list'
);

//----- new POPUPs ----------------------------
//При создании экземпляра PopupWithForm под попап "редактирования" ты в него передаешь колбэк, который будет рулить сабмитом формы "редактирования".
const newPopupProfile = new PopupWithForm(
  '#overlay_edit',
  '#form-add-profile',
  handleProfileFormSubmit
);
newPopupProfile.setEventListeners(); // слушатель вызываем в прямом потоке кода, после создания экземпляра класса

const newPopupAddPlace = new PopupWithForm(
  '#overlay_add-place',
  '#form-place',
  handlePlaceFormSubmit
);
newPopupAddPlace.setEventListeners(); //вызываем на экземпляре в прямом потоке кода

const popupWithImage = new PopupWithImage('#overlay_img-zoom');
popupWithImage.setEventListeners();

function handleCardClick(data) {
  popupWithImage.open(data);
}

//----------NEW UserInfo ---------------------------------------
// function initialiseUser() {
// const { nameSelector, jobSelector } = userInfo;
const newUser = new UserInfo({
  nameSelector: '.profile__name',
  jobSelector: '.profile__job',
}); // name: '.profile__name', // job: '.profile__job'

// -- ОБРАБОТЧИКИ НА ОТКРЫТИЕ: ---------------------------------

// кнопка "edit"
function handleButtonEditClick() {
  // вызв заполнение полей - РЕВЬЮ/ЗАМЕЧАНИЕ.
  const userInfo = newUser.getUserInfo(); //получаем объект {name:.., job:..}
  inputEditName.value = userInfo.name; //Жак-Ив Кусто
  inputEditJob.value = userInfo.job; //Исследователь

  newPopupProfile.open();
}

// кнопка "+" / add place
function handleButtonAddPlaceClick() {
  newPopupAddPlace.open();
  // formPlaceValid.toggleButtonState(); // ИСПРАВЛЕНО. методы класса FormValidator активир / деактивир кнопку сабмита и очищают ошибки
  formValidators['place'].toggleButtonState(); //'profile' - атрибут name, формы
}

//-------- СЛУШАТЕЛИ КНОПОК
btnEditProfile.addEventListener('click', handleButtonEditClick); // "edit profile"
btnAddPlace.addEventListener('click', handleButtonAddPlaceClick); // "+" ("add")

// Включение валидации // --- Вар - 1 ---------------------------------------------

// const formProfileValid = new FormValidator(formProfile, config);
// formProfileValid.enableValidation();

// const formPlaceValid = new FormValidator(formPlace, config);
// formPlaceValid.enableValidation();

// Включение валидации // --- Вар - 2 ---
const formValidators = {};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formClass));
  formList.forEach((formElement) => {
    const validator = new FormValidator(formElement, config);
    // получаем данные из атрибута `name` у формы
    const formName = formElement.getAttribute('name');

    // вот тут в объект записываем под именем формы
    formValidators[formName] = validator;
    validator.enableValidation();
  });
};

enableValidation(config);

section.renderItems(initialCards);
