const qaItems = [
  {
    question: "How do I track my package?",
    answer:
      "You can easily track your package using our online tracking system. Simply enter your tracking number on our website to get real-time updates on your delivery's status.",
  },
  {
    question: "What should I do if my package is damaged or lost?",
    answer:
      "If your package arrives damaged or is lost in transit, please contact us immediately. We will investigate the matter and arrange for a replacement or refund as per our policy.",
  },
  {
    question: "Can I change my delivery address after placing an order?",
    answer:
      "Yes, you can change your delivery address as long as the package has not been dispatched. Please contact our customer service team as soon as possible to make any changes.",
  },
  {
    question: "Are there any items that cannot be shipped?",
    answer:
      "Yes, there are certain restrictions on items that can be shipped due to safety and legal reasons. Please refer to our shipping policy or contact us for more information on prohibited items.",
  },
];

const accordionDiv = document.getElementById("accordion");

function handleClick() {}

qaItems.forEach((item) => {
  const questionText = item.question;
  const answerText = item.answer;

  const questionDiv = document.createElement("div");
  questionDiv.classList.add("accordion-question");
  questionDiv.textContent = questionText;

  const answerDiv = document.createElement("div");
  answerDiv.classList.add("accordion-answer");
  answerDiv.textContent = answerText;

  questionDiv.appendChild(answerDiv);

  questionDiv.addEventListener("click", () => {
    questionDiv.classList.toggle("active");
    answerDiv.classList.toggle("active");
  });

  accordionDiv.appendChild(questionDiv);
});

//OOP PRACTICE START

class DatabaseObject {
  toString() {
    throw new Error("Not implemented...");
  }
}

class Product extends DatabaseObject {
  constructor(name, inventory) {
    super();
    this.name = name;
    this.inventory = inventory;
  }
  toString() {
    return this.name + ": " + this.inventory + " left in stock";
  }
}

class Delivery extends DatabaseObject {
  constructor(params) {
    super();
    const { address, scheduledTime, product, quantity } = params;
    this.address = address;
    this.scheduledTime = scheduledTime;
    this.product = product;
    this.quantity = quantity;
  }
  toString() {
    return (
      "Delivering " +
      this.quantity +
      " " +
      this.product.name +
      " to " +
      this.address +
      " at " +
      this.scheduledTime
    );
  }
  static create(params) {
    return new Delivery(params);
  }
}

class ProductDao {
  static seeds = [
    {
      name: "Apples",
      inventory: 100,
    },
    {
      name: "Bananas",
      inventory: 70,
    },
    {
      name: "Peaches",
      inventory: 90,
    },
  ];
  getAll() {
    throw new Error("No get all method...");
  }
  getProductByName(name) {
    const products = this.getAll();
    return products.find((product) => product.name == name);
  }
  update(product) {
    throw new Error("No update method");
  }
}

class CookieStorageProductDao extends ProductDao{
  constructor(){
    super();
    this.database = document.cookie;
  }
  getAll(){
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("products="));
    
    const productsData = cookieValue ? JSON.parse(cookieValue.split("=")[1]) : ProductDao.seeds;
    return productsData.map((productData) => new Product(productData.name, productData.inventory));

  }
  update(product) {
    const existingProducts = this.getAll();
    const indexToDelete = existingProducts.findIndex(
      (productInList) => productInList.name == product.name,
    );
    existingProducts.splice(indexToDelete, 1, product);
    console.log(indexToDelete);
    document.cookie = 'products=' + JSON.stringify(existingProducts) + '; SameSite=Lax; Secure;';
  }
}

class DeliveryDao {
  getAll() {
    throw new Error("No getall method");
  }
  create() {
    throw new Error("No create method");
  }
}

class SessionStorageProductDao extends ProductDao {
  constructor() {
    super();
    this.database = sessionStorage;
  }
  getAll() {
    const productAsJson = this.database.getItem("products");
    const productsData = productAsJson
      ? JSON.parse(productAsJson)
      : ProductDao.seeds; //if productAsJson is valid, return JSON.parse... else return seeds
    return productsData.map((productData) => {
      const { name, inventory } = productData;
      return new Product(name, inventory);
    });
  }
  update(product) {
    const existingProducts = this.getAll();
    const indexToDelete = existingProducts.findIndex(
      (productInList) => productInList.name == product.name,
    );
    existingProducts.splice(indexToDelete, 1, product);
    console.log(indexToDelete);
    this.database.setItem("products", JSON.stringify(existingProducts));
  }
}

class SessionStorageDeliveryDao extends DeliveryDao {
  constructor() {
    super();
    this.database = sessionStorage;
  }
  getAll() {
    const deliveriesInSessionStorage = this.database.getItem("deliveries");
    const deliveriesData = deliveriesInSessionStorage ? JSON.parse(deliveriesInSessionStorage) : [];
    return deliveriesData.map((deliveryData) => {
      return Delivery.create(deliveryData);
    });
  }
  create(delivery) {
    const deliveryList = this.getAll();
    deliveryList.push(delivery);
    this.database.setItem("deliveries", JSON.stringify(deliveryList));
  }
}

class CookieStorageDeliveryDao extends DeliveryDao{
  constructor() {
    super();
    this.database = document.cookie;
  }
  getAll() {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("deliveries="));
    
    const deliveriesData = cookieValue ? JSON.parse(cookieValue.split("=")[1]) : [];
    return deliveriesData.map((deliveryData) => new Delivery(deliveryData));
  }
  create(delivery) {
    const existingDeliveries = this.getAll();
    existingDeliveries.push(delivery);
    document.cookie = 'deliveries=' + JSON.stringify(existingDeliveries) + '; SameSite=Lax; Secure;';;
  }
}

class CreateDeliveryService {
  constructor(productDao, deliveryDao) {
    this.productDao = productDao;
    this.deliveryDao = deliveryDao;
  }
  createDelivery(productName, quantity, address, scheduledTime) {
    const product = this.productDao.getProductByName(productName);
    const newInventory = product.inventory - quantity;
    product.inventory = newInventory;
    const deliveryData = {
      product,
      quantity,
      address,
      scheduledTime,
    };
    this.deliveryDao.create(deliveryData);
    this.productDao.update(product);
  }
}

// const productDao = new SessionStorageProductDao();
// const deliveryDao = new SessionStorageDeliveryDao();

const productDao = new CookieStorageProductDao();
const deliveryDao = new CookieStorageDeliveryDao();

const createDeliveryService = new CreateDeliveryService(
  productDao,
  deliveryDao,
);

const deliveryList = document.getElementById("deliveries-list");
const deliveries = deliveryDao.getAll();

for (let i = 0; i < deliveries.length; i++) {
  const delivery = deliveries[i];
  const deliveryLi = document.createElement("li");
  deliveryLi.textContent = delivery.toString();
  deliveryList.appendChild(deliveryLi);
}

const productNameSelect = document.querySelector("#deliveries form select");
const quantityInput = document.querySelector("#deliveries form input[name='quantity']");


const products = productDao.getAll();
for (let i = 0; i < products.length; i++) {
  const product = products[i];
  const option = document.createElement("option");
  option.innerText = product.toString();
  option.setAttribute("value", product.name);
  const existingInventory = product.inventory; 
  if(i == 0){
    quantityInput.setAttribute("max", existingInventory);
  }
  if(existingInventory > 0){
    productNameSelect.appendChild(option);
  }
}

function handleChangeToProductName(event){
  const productName = event.target.value;
  const selectedProduct = productDao.getProductByName(productName);
  const existingInventory = selectedProduct.inventory;
  quantityInput.setAttribute("max", existingInventory);
}

productNameSelect.addEventListener("change", handleChangeToProductName);

const createDeliveryForm = document.querySelector("#deliveries form");
createDeliveryForm.addEventListener("submit", (event) =>{
  const formData = new FormData(event.target);
  const address = formData.get("address");
  const scheduledTime = formData.get("scheduledTime");
  const productName = formData.get("productName");
  const quantity = formData.get("quantity");
  createDeliveryService.createDelivery(productName, quantity, address, scheduledTime);
})

//PAUSE 50 MIN INTO VIDEO 2

// class CookiesStorageProductDao extends ProductDao{
//     constructor(){
//         this.database = document.cookie;
//     }
//     getAll(){

//     }
//     update(product){

//     }
// }
