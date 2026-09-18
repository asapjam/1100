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

class DatabaseObject {
  toString() {
    throw new Error("Not implemented...");
  }
}

class Product extends DatabaseObject {
  constructor(name, inventory) {
    super();
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
      " of " +
      this.product +
      " to " +
      this.address +
      " at " +
      this.scheduledTime
    );
  }
  static create(params) {
    // const{address, scheduledTime, product, quantity} = params;
    // return new Delivery(address, scheduledTime, product, quantity);
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
    throw new Error("No getbyname method...");
  }
  update(product) {
    throw new Error("No update method");
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
    const productAsJson = this.database.getItem("product");
    const productData = productAsJson
      ? JSON.parse(productAsJson)
      : ProductDao.seeds; //if productAsJson is valid, return JSON.parse... else return seeds
    return productData.map((productData) => {
      const { name, inventory } = productData;
      new Product(name, inventory);
    });
  }
  getProductByName(name) {
    const products = this.getAll;
    return products.find((product) => product.name == name);
  }
  update(product) {
    const existingProducts = this.getAll();
    const indexToDelete = existingProducts.findIndex(
      (productInList) => productInList.name == product.name,
    );
    existingProducts.splice(indexToDelete, 1, product);
  }
}

class SessionStorageDeliveryDao extends DeliveryDao {
  constructor() {
    super();
    this.database = sessionStorage;
  }
  getAll() {
    const deliveriesAsJson = this.database.getItem("deliveries") || [];
    const deliveriesData = JSON.parse(deliveriesAsJson);
    return deliveriesData.map((deliveryData) => {
      return Delivery.create(deliveryData);
    });
  }
  create(delivery) {
    const deliveries = this.getAll();
    existingDeliveries.push(delivery);
    this.database.setItem("deliveries", JSON.stringify(deliveries));
  }
}

class CreateDeliveryService {
  constructor(productDao, deliveryDao) {}
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

const productDao = new SessionStorageProductDao();
const deliveryDao = new SessionStorageDeliveryDao();
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
const products = productDao.getAll();
for (let i = 0; i < product.length; i++) {
  const product = products[i];
  const option = document.createElement("option");
  option.innerText = product.toString();
  option.setAttribute("value", product.name);
  productNameSelect.appendChild(option);
}

// class CookiesStorageProductDao extends ProductDao{
//     constructor(){
//         this.database = document.cookie;
//     }
//     getAll(){

//     }
//     update(product){

//     }
// }
