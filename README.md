# 🛒 React Redux Shopping Cart with React Query & Bootstrap

**Eccomerce Web App**

This is a **Eccomerce Web App** built with **React, Redux Toolkit, React Query, Axios, and Bootstrap**.  
It fetches products from **FakeStoreAPI**, allowing users to browse categories, add/remove items from the cart, and proceed to checkout.  
The cart state is managed globally using **Redux Toolkit**, and data fetching is optimized using **React Query**.

---

##  **Features**
✔ **Product Listing** – Displays all products fetched dynamically from FakeStoreAPI  
✔ **Category Filtering** – Users can filter products by category using a dropdown  
✔ **Cart Management** – Users can add, update, and remove products from the shopping cart  
✔ **Session Persistence** – Cart state is stored in `sessionStorage` for persistence  
✔ **Checkout Simulation** – Users can complete a purchase (cart clears after checkout)  
✔ **Responsive Design** – Uses Bootstrap to ensure a seamless experience on all screen sizes  
✔ **Optimized API Requests** – Uses React Query for efficient caching and re-fetching  

---

## 🛠 **Technologies Used**
- **React** – UI development  
- **Redux Toolkit** – Global state management for cart functionality  
- **React Query** – Fetching & caching API data  
- **Axios** – Handling API requests  
- **Bootstrap (React-Bootstrap)** – Styling & responsiveness  
- **FakeStoreAPI** – Provides mock product data  

---

## 🔧 **Installation & Setup**
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/shopping-cart-app.git
cd shopping-cart-app

npm install

npm run dev


🛠 API Reference

FakeStoreAPI – https://fakestoreapi.com
	•	Get all products: https://fakestoreapi.com/products
	•	Get categories: https://fakestoreapi.com/products/categories
	•	Get products by category: https://fakestoreapi.com/products/category/{category}