if (!localStorage.getItem('access_token')) {
    window.location.href = 'login/login.html';
}

if (sessionStorage.getItem('mode') === "light"){
    const body = document.querySelector('body');
    body.classList.toggle('light-mode');
}

import {
    expenseList, addExpense, removeExpense,
    getAllExpenses, getCategoryById,
    getCategoryExpenseSums, getTotal, getTopCategory
} from "./expenseManager.js";

let backgroundDark = true;
const recentExpenses = document.querySelector('.recent-expenses');
const totalExpense = document.getElementById('total-expenses');
const topCategoryIcon = document.getElementById('top-category-icon');
const topCategoryTitle = document.getElementById('top-category-title');
const topCategoryAmount = document.getElementById('top-category-amount');
const chartContainer = document.getElementById('chart-container');

let sum = 0;

document.getElementById('mode-btn').addEventListener('click', function(){
    const mode = sessionStorage.getItem('mode');
    if (mode === "light"){
        backgroundDark = false
    }

    const body = document.querySelector('body');
    body.classList.toggle('light-mode');
    

    const modeBtn = document.querySelector('#mode-btn');
    if (backgroundDark) {
        modeBtn.textContent = '🌑';
        sessionStorage.removeItem("mode");
        sessionStorage.setItem("mode", "light");
    }
    else {
        modeBtn.textContent = '☀️';
        sessionStorage.removeItem("mode");
        sessionStorage.setItem("mode", "dark");
    }
    backgroundDark = !backgroundDark;
});

async function renderExpenses(){
    const header = document.createElement('h2');
    header.textContent = 'Recent Expenses';
    recentExpenses.innerHTML = "";
    recentExpenses.appendChild(header);
    try{
        const expenses = await getAllExpenses();
        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        let slicedExpenses = expenses;
        if (expenses.length > 3) {
            slicedExpenses = expenses.slice(expenses.length - 3);
        }

        for(const expense of slicedExpenses) {
            let category;
            try {
                category = await getCategoryById(expense.category_id);
            } catch (error) {
                console.error(`Error fetching category with id ${expense.category_id}:`, error);
                continue;
            }

            if (!category || !category.name) {
                console.error(`Category with id ${expense.category_id} is undefined or missing a name.`);
                continue;
            }

            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');

            const expenseInfo = document.createElement('div');
            expenseInfo.classList.add('expense-info');

            const expenseIcon = document.createElement('div');
            expenseIcon.classList.add('expense-icon');

            expenseIcon.textContent = category.name.split(' ')[0];
            expenseInfo.appendChild(expenseIcon);

            const expenseInfoChildDiv = document.createElement('div');
            const expenseTitle = document.createElement('p');
            expenseTitle.textContent = expense.name;
            const expenseCategoryNameAndDate = document.createElement('p');
            expenseCategoryNameAndDate.textContent = `${category.name.split(' ')[1]} • ${expense.date}`;
            expenseInfoChildDiv.append(expenseTitle, expenseCategoryNameAndDate);
            expenseInfo.appendChild(expenseInfoChildDiv);

            const expenseAmount = document.createElement('div');
            expenseAmount.classList.add('expense-amount');

            const expenseAmountSpan = document.createElement('span');
            expenseAmountSpan.textContent = `$${parseFloat(expense.amount).toFixed(2)}`;
            expenseAmount.appendChild(expenseAmountSpan);

            const deleteItemButton = document.createElement('button');
            deleteItemButton.classList.add('delete-btn');
            deleteItemButton.textContent = '🗑️';
            deleteItemButton.addEventListener('click', async () => {
                await removeExpense(expense.id);
                renderExpenses();
                calculateTopCategory();
                showChart();
            });

            expenseAmount.appendChild(deleteItemButton);
            expenseItem.appendChild(expenseInfo);
            expenseItem.appendChild(expenseAmount);
            recentExpenses.appendChild(expenseItem);
        }
        sum = await getTotal()
        if (sum === null) sum = 0;
        totalExpense.innerHTML = `$${sum.toFixed(2)}`;
    }catch(e){
        console.error(e);
    }
}


async function calculateTopCategory() {
    const expenses = await getAllExpenses();
    if (expenses.length > 0) {
        document.getElementById('top-category-info').style.visibility = 'visible';
    }
    else {
        document.getElementById('top-category-info').style.visibility = 'hidden';
        return;
    }

    const topCategory = await getTopCategory();

    topCategoryIcon.innerHTML = topCategory.icon;
    topCategoryTitle.innerHTML = topCategory.category;
    topCategoryAmount.innerHTML = parseFloat(topCategory.sum).toFixed(2);
}

document.getElementById('add-expense-btn').addEventListener('click', function(){
    const expenseName = document.getElementById('expense-name');
    const expenseAmount = document.getElementById('expense-amount');
    const expenseCategory = document.getElementById('expense-category');
    const expenseDate = document.getElementById('expense-date');

    if (expenseName.value === '' || expenseAmount.value === ''
        || expenseCategory.value === '' || expenseDate.value === '') {
        alert('all fields are required!');
        return;
    }

    addExpense(expenseName.value, parseFloat(expenseAmount.value), expenseCategory.value, expenseDate.value);

    expenseName.value = '';
    expenseAmount.value = '';
    expenseDate.value = '';
    showChart();
    calculateTopCategory();
    renderExpenses();
});

async function showChart(){
    try {
        const expenseCategorySums = await getCategoryExpenseSums();
        const categories = expenseCategorySums.map(ecs => ecs.category);
        const sums = expenseCategorySums.map(ecs => ecs.sum);

        chartContainer.style.visibility = 'visible';

        const canvas = document.getElementById("myChart");
        if(!canvas){
            console.error("Canvas element with id 'myChart' not found.");
            return;
        }
        const ctx = canvas.getContext("2d");

        if(window.myExpenseChart){
            window.myExpenseChart.destroy();
        }

        window.myExpenseChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: categories,
                datasets: [{
                    backgroundColor: [
                        "#DCA06D",
                        "#007074",
                        "#EB5B00",
                        "#ADB2D4",
                        "#210F37",
                        "#EC7FA9",
                        "#211C84",
                        "#854836",
                        "#16C47F",
                        "#E1FFBB"
                    ].slice(0, categories.length),
                    data: sums
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Expense Chart"
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error in showChart:", error);
    }
}

document.getElementById('logout-btn').addEventListener('click', function(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    window.location.href = "login/login.html";
})

function updateWelcomeMsg() {
    const username = localStorage.getItem("username"); // Assuming you save the username in localStorage upon logintorage.getItem('username') || "User";
    document.getElementById('welcome-msg').textContent = `Hello, ${username}`;
}

updateWelcomeMsg();

renderExpenses().catch(e => console.error(e));
calculateTopCategory().catch(e => console.error(e));
showChart().catch(e => console.error(e));
