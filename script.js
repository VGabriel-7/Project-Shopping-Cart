const olCart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const clearCart = document.querySelector('.empty-cart');
const showCartButton = document.querySelector('.show-cart-button');
const dadCart = document.querySelector('.dad-cart');

showCartButton.addEventListener('click', () => {
  if (dadCart.classList[1] === 'cart-hide' || dadCart.classList.length === 1) {
    dadCart.classList.remove('cart-hide');
    dadCart.classList.add('show-cart');
  } else {
    dadCart.classList.remove('show-cart');
    dadCart.classList.add('cart-hide');
  }
});

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const getTotalPrice = () => {
  const products = document.querySelectorAll('.cart__item');
  let total = 0;
  products.forEach((element) => {
    const price = element.innerHTML.split('$')[1];
    total += (+price);
  });
  totalPrice.innerHTML = `Valor total: ${total
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
};

const cartItemClickListener = (event) => {
  olCart.removeChild(event.target);
  saveCartItems(olCart.innerHTML);
  getTotalPrice();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const insertProductPost = async () => {
  const { results } = await fetchProducts('computador');
  document.querySelector('.loading').remove();
  results.forEach(({ id, title, thumbnail }) => {
    const postProduct = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items').appendChild(postProduct);
  });
};

const insertCartProduct = async () => {
  document.querySelector('.items')
    .addEventListener('click', async (event) => {
      if (event.target.classList[0] === 'item__add') {
        const idItem = getSkuFromProductItem(event.target.parentNode);
        const { id, title, price } = await fetchItem(idItem);
        const product = createCartItemElement({ sku: id, name: title, salePrice: price });
        olCart.appendChild(product);
        saveCartItems(olCart.innerHTML);
        getTotalPrice();
      }
    });
};

insertCartProduct();

const shoppingCartSaved = () => {
  if (localStorage.cartItems) {
    olCart.innerHTML = getSavedCartItems();
    olCart.addEventListener('click', cartItemClickListener);
  }
};

clearCart.addEventListener('click', () => {
  olCart.innerHTML = '';
  localStorage.removeItem('cartItems');
  getTotalPrice();
});

window.onload = () => { 
  insertProductPost();
  shoppingCartSaved();
  getTotalPrice();
 };
