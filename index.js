import { menuArray } from './data.js';

const menuContainerEl = document.getElementById('menu-container');
const orderContainerEl = document.getElementById('order-container');
const paymentContainer = document.getElementById('payment-container');
const paymentForm = document.getElementById('payment-form');
const nameInput = document.getElementById('name');
let orderListArray = [];

document.addEventListener("click", function(e) {
    console.log(e.target.dataset.id)
    if (e.target.dataset.id !== undefined && e.target.dataset.id !== "order-btn" && e.target.dataset.id !== "pay-btn") {
        const addItem = findItem(menuArray, e);
        const updateItem = findItem(orderListArray, e);
        if (updateItem) {
            if (e.target.classList.contains('remove-btn')) {
                if (updateItem.quantity > 1) {
                    updateItem.quantity--;
                    updateItem.total -= updateItem.price;
                } else {
                    orderListArray = orderListArray.filter(item => item.id !== updateItem.id);
                }
            } else {
                updateItem.quantity++;
                updateItem.total = updateItem.quantity * updateItem.price;
            }
        } else {
            orderListArray.push(addItem);
            addItem.quantity = 1;
            addItem.total = addItem.quantity * addItem.price;
        }
        renderOrderList();
    }

    if (e.target.dataset.id === "order-btn") {
        paymentContainer.style.display = "flex";
    } else if (e.target === paymentContainer) {
        paymentContainer.style.display = "none"; 
    }
});

paymentForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = nameInput.value;
    paymentContainer.style.display = "none";
    orderContainerEl.innerHTML = `
        <p class="payment-accepted">Thanks, ${name}! <br/>Your order is on its way!</p>`;
    orderListArray = [];
    document.querySelectorAll('input').forEach(function(input) {
        input.value = ``;
    });
})

function findItem(arr, e) {
    return arr.find(item => item.id === Number(e.target.dataset.id));
};

function renderMenuArray(){
    let menuListString = ``;
    menuArray.forEach(function(menu){
        menuListString += `        
        <div id="menu-item" class="menu-item">
            <p class="menu-image">${menu.emoji}</p>
            <div class="menu-info">
                <h3 class="menu-title">${menu.name}</h3>
                <p class="menu-description">${menu.ingredients.join(' - ')}</p>
                <p class="menu-price">$${menu.price}</p>
            </div>
            <button id="add-menu-btn" class="add-menu-btn" data-id="${menu.id}">+</button>
        </div>`;
    });
    menuContainerEl.innerHTML = menuListString;
};

function renderOrderList(){
    if (orderListArray.length !== 0) {
        let orderListString = ``;
        orderListArray.forEach(function(menu) {
            orderListString += `
                <div class="order-item">
                    <p><span class="order-quantity">${menu.quantity} x</span> ${menu.name}<span class='remove-btn' data-id="${menu.id}">remove</span></p>
                    <p>$${menu.total}</p>
                </div>`;
        });
        let orderListRender = `
            <div>
                <h3 class="order-list-title">Your order</h3>
                <div class="order-list">
                    ${orderListString}
                </div>
            </div>
            <div class="abajo">
                <div class="order-total">
                    <p>Total:</p>
                    <p>$${calculateTotal(orderListArray)}</p>
                </div>
                <button class="order-btn" data-id="order-btn">Complete order</button>
            </div>`;
        orderContainerEl.innerHTML = orderListRender;
    } else {
        orderContainerEl.innerHTML = ``;
    }
};

function calculateTotal(arr) {
    let total = 0;
    arr.forEach(function(order){
        total += order.total;
    });
    return total;
};

renderMenuArray();