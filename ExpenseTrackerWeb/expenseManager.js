export const expenseList = [];
let idCounter = 1;


function Expense(name, amount, category_id, date){
    this.id = idCounter++;
    this.name = name;
    this.amount = amount;
    this.category_id = category_id;
    this.date = date;
}

export async function getAllExpenses() {
    const accessToken = localStorage.getItem('access_token');
    const expenses = await fetch('http://127.0.0.1:8000/expenses', {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return expenses.json();
}

export async function getCategoryById(id) {
    const accessToken = localStorage.getItem('access_token');
    let category = await fetch(`http://127.0.0.1:8000/categories/${id}`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return category.json();
}

export async function getCategoryExpenseSums(){
    const accessToken = localStorage.getItem('access_token');
    let categoryExpenseSums = await fetch('http://127.0.0.1:8000/expenses/category-sum', {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return categoryExpenseSums.json();
}

export function addExpense(name, amount, category, date){
    const accessToken = localStorage.getItem('access_token');
    const expense = new Expense(name, amount, category, date);
    const {id, ...requestObj} = expense;
    fetch("http://127.0.0.1:8000/expenses/", {
        method: "POST",
        headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`},
        body: JSON.stringify(requestObj)
    })
        .then(async res => {
            if (!res.ok) {
                const errorData = await res.json();
                console.error("Validation error:", errorData);
            } else {
                const data = await res.json();
                console.log(data);
            }
        })
        .catch(err => console.error(err));
}

export async function removeExpense(id){
    const accessToken = localStorage.getItem('access_token');
    const deletedExpense = await fetch(`http://127.0.0.1:8000/expenses/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return deletedExpense.json();
}

export async function getTotal(){
    const accessToken = localStorage.getItem('access_token');
    const total = await fetch(`http://127.0.0.1:8000/expenses/sum/`,
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
    return total.json();
}

export async function getTopCategory(){
    const accessToken = localStorage.getItem('access_token');
    const topCategory = await fetch(`http://127.0.0.1:8000/expenses/top-category`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return topCategory.json();
}