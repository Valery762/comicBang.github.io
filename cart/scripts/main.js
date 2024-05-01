// Функция для преобразования строки в число
function toNum(str) {
  const num = Number(str.replace(/ /g, ""));
  return isNaN(num) ? 0 : num; // Добавлено обработка случая, когда строка не может быть преобразована в число
}

// Функция для форматирования числа в валюту
function toCurrency(num) {
  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(num);
  return format;
}

// Класс для корзины
class Cart {
  constructor() {
    this.products = [];
  }

  get count() {
    return this.products.length;
  }

  addProduct(product) {
    this.products.push(product);
    this.saveToLocalStorage();
  }

  removeProduct(index) {
    this.products.splice(index, 1);
    this.saveToLocalStorage();
  }

  get cost() {
    const prices = this.products.map(product => toNum(product.price));
    return prices.reduce((acc, num) => acc + num, 0);
  }

  get costDiscount() {
    const prices = this.products.map(product => toNum(product.priceDiscount));
    return prices.reduce((acc, num) => acc + num, 0);
  }

  get discount() {
    return this.cost - this.costDiscount;
  }

  // Сохранение корзины в localStorage
  saveToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(this.products));
  }

  // Загрузка корзины из localStorage
  loadFromLocalStorage() {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart && savedCart.products) {
      this.products = savedCart.products;
    } else {
      this.products = [];
    }
  }
}

// Класс для продукта
class Product {
  constructor(card) {
    this.imageSrc = card.querySelector(".card__image").children[0].src;
    this.name = card.querySelector(".card__title").innerText;
    this.price = card.querySelector(".card__price--common").innerText;
    this.priceDiscount = card.querySelector(".card__price--discount").innerText;
  }
}

// Инициализация корзины
const myCart = new Cart();
myCart.loadFromLocalStorage();

// Обновление счетчика корзины на странице
const cartNum = document.querySelector("#cart_num");
cartNum.textContent = myCart.count;

// Объявление переменной cardAddArr
const cardAddArr = Array.from(document.querySelectorAll(".card__add"));

// Добавление обработчиков событий на кнопки "Добавить в корзину"
cardAddArr.forEach(cardAdd => {
  cardAdd.addEventListener("click", (e) => {
    e.preventDefault();
    const card = e.target.closest(".card");
    const product = new Product(card);
    myCart.addProduct(product);
    cartNum.textContent = myCart.count;
    updateCartTotal();
  });
});

// Функция для обновления итоговой суммы в корзине
function updateCartTotal() {
  const cartTotal = document.querySelector("#cart_total");
  if (cartTotal && myCart) { // Проверяем, существует ли cartTotal и myCart
    cartTotal.textContent = toCurrency(myCart.costDiscount); // Используем цену со скидкой
  }
}

// Добавление обработчика события для закрытия попапа
const popupCloseBtn = document.querySelector("#popup_close");
if (popupCloseBtn) { // Проверяем, существует ли элемент popup_close
  popupCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.remove("popup--open");
    body.classList.remove("lock");
  });
}

// Попап

const popup = document.querySelector(".popup");
const popupClose = document.querySelector("#popup_close");
const body = document.body;
const popupContainer = document.querySelector("#popup_container");
const popupProductList = document.querySelector("#popup_product_list");
const popupCost = document.querySelector("#popup_cost");
const popupDiscount = document.querySelector("#popup_discount");
const popupCostDiscount = document.querySelector("#popup_cost_discount");

const cart = document.querySelector("#cart"); // Добавлено определение переменной cart

// Обработчик события открытия попапа при клике на кнопку "Корзина"
cart.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.add("popup--open");
  body.classList.add("lock");
  popupContainerFill();
});

// Функция для заполнения контейнера товаров в попапе
function popupContainerFill(price) {
  popupProductList.innerHTML = "";

  // Получение товаров из корзины и добавление их в попап
  myCart.products.forEach(product => {
    const productItem = document.createElement("div");
    productItem.classList.add("popup__product");

    const productWrap1 = document.createElement("div");
    productWrap1.classList.add("popup__product-wrap");
    const productWrap2 = document.createElement("div");
    productWrap2.classList.add("popup__product-wrap");

    const productImage = document.createElement("img");
    productImage.classList.add("popup__product-image");
    productImage.setAttribute("src", product.imageSrc);

    const productTitle = document.createElement("h2");
    productTitle.classList.add("popup__product-title");
    productTitle.innerText = product.name;

    const productPrice = document.createElement("div");
    productPrice.classList.add("popup__product-price");
    productPrice.innerText = product.priceDiscount; // Используем цену со скидкой

    const productDelete = document.createElement("button");
    productDelete.classList.add("popup__product-delete");
    productDelete.innerHTML = "&#10006;";

    productDelete.addEventListener("click", () => {
  if (myCart) { // Проверяем, существует ли myCart
    myCart.removeProduct(product);
    updateCartTotal(); // Обновляем итоговую сумму после удаления товара
    popupContainerFill(); // Заполняем контейнер товаров в попапе заново
  }
});

    productWrap1.appendChild(productImage);
    productWrap1.appendChild(productTitle);
    productWrap2.appendChild(productPrice);
    productWrap2.appendChild(productDelete);
    productItem.appendChild(productWrap1);
    productItem.appendChild(productWrap2);

    popupProductList.appendChild(productItem);
  });

  // Обновляем итоговую сумму в попапе
  popupCost.textContent = toCurrency(myCart.cost);
  popupDiscount.textContent = toCurrency(myCart.discount);
  popupCostDiscount.textContent = toCurrency(myCart.costDiscount);
}

// Обработчик события нажатия на кнопку "купить"
cardAddArr.forEach(cardAdd => {
  cardAdd.addEventListener("click", (e) => {
    e.preventDefault();
    const card = e.target.closest(".card");
    const priceElement = card.querySelector(".card__price");
    const price = priceElement ? priceElement.textContent : null; // Получаем текст цены или null, если элемент не найден
    popupContainerFill(price);
  });
});


