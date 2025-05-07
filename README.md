# ExpenseTrack

ExpenseTrack is a full‑stack expense tracking application built using FastAPI on the backend and vanilla JavaScript with Chart.js on the frontend. It features user authentication (registration, login, logout) using JWT and provides full CRUD functionality for managing expenses. Each user can track their own expenses, view totals, see interactive charts, and get category‑wise summaries.

---

## Features

- **User Authentication & Authorization**  
  - Register and log in with JWT‑based authentication.  
  - Secure endpoints so that each user accesses only their own expenses.
  
- **Expense Management**  
  - Add, view, and delete expenses.  
  - Calculate the total expense sum.  
  - Display expenses on an interactive chart.
  
- **Category & Summary**  
  - Pre‑defined categories with icons.  
  - Calculate expense sums per category.  
  - Display the top expense category.
  
- **Responsive UI with Light/Dark Mode**  
  - Modern, responsive design using HTML, CSS, and vanilla JavaScript.  
  - Toggle between light and dark modes.

---

## File Structure

**ExpenseTrackerAPI**  
- **routers/**  
  - `auth_router.py`: Endpoints for authentication (register, login)  
  - `category_router.py`: Endpoints for category management  
  - `expense_router.py`: Endpoints for expense management  
- **services/**  
  - `category_service.py`: Business logic for categories  
  - `expense_service.py`: Business logic for expenses  
- **utilities/**  
  - `auth.py`: JWT and password hashing utilities  
  - `dependencies.py`: Dependencies for authentication (e.g., `get_current_user`)  
- `database.py`: Database connection and session creation  
- `main.py`: FastAPI application entry point  
- `models.py`: SQLAlchemy models (User, Expense, Category)  
- `schemas.py`: Pydantic schemas for API validation  


**ExpenseTrackerWeb**  
- `index.html`: Main application page (protected; requires login)  
- `styles.css`: CSS styles for the main page  
- `script.js`: Main frontend logic (expense rendering, chart, etc.)  
- `expenseManager.js`: Utility functions for API calls (expenses, categories, etc.)  
- **login/**  
  - `login.html`: Login/Signup page  
  - `style.css`: CSS for the login page  
  - `auth.js`: Handles login/registration logic

---

**Installation**

1. **Clone the Repository**
  ```bash
  git clone https://github.com/Sahak-Sargsyan/expense-tracker.git
  ```
2. **Create & Activate a Virtual Environment**
  ```bash
  cd ExpenseTracker/ExpenseTrackerAPI
  python -m venv venv
  # On macOS/Linux:
  source venv/bin/activate
  # On Windows:
  venv\Scripts\activate
  ```
3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the Backend Server**
   ```bash
   uvicorn main:app --reload
   ```

## Frontend Installation

1. **Run a server**
  ```bash
  cd ~/ExpenseTracker/ExpenseTrackerWeb
  python -m http.server 5000
  ```
2. **Open `index.html` via the browser**
  - http://localhost:5000/index.html
---

## Usage

1. **Start the Application:**  
   Simply open `index.html` in your browser. The application automatically checks if you are logged in. If not, it will redirect you to the login page.

2. **Authentication:**  
   - **Register:**  
     On the login page, use the Sign Up form to create a new account.
   - **Login:**  
     Use the Login form to sign in. Upon successful authentication, the JWT token and username are stored, and you are redirected back to `index.html`.

3. **Expense Management:**  
   - **Adding Expenses:**  
     On the main page (`index.html`), fill out the expense form with the expense name, amount, date, and category, then submit it to save your expense.
   - **Viewing Expenses:**  
     Your recent expenses are displayed on the main page, and the total expense sum is updated dynamically.
   - **Deleting Expenses:**  
     Click the trash icon next to an expense to delete it. The UI (including charts and totals) updates automatically.

4. **Charts & Summary:**  
   - **Pie Chart:**  
     The main page displays a pie chart that shows the distribution of your expenses by category (calculated via the backend).
   - **Top Category:**  
     The application calculates and displays the category with the highest total expense.

5. **Logout:**  
   Click the Logout button in the header to clear your session and return to the login page.

All functionalities become available as soon as you open `index.html`—if you're not logged in, you'll be prompted to do so automatically.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/) – A modern, fast (high-performance) web framework for building APIs with Python.
- [Chart.js](https://www.chartjs.org/) – An open source JavaScript charting library.
- [Passlib](https://passlib.readthedocs.io/) – A password hashing library for Python.
- [PyJWT](https://pyjwt.readthedocs.io/) – A Python library for encoding and decoding JSON Web Tokens.
- [Google Fonts](https://fonts.google.com/) – A collection of free fonts for web projects.
- Thanks to all contributors of the open-source libraries used in this project.

