document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    const themeToggle = document.getElementById("theme-toggle");
    const ctx = document.getElementById("myPieChart").getContext("2d");

    let expenses = [];
    let myPieChart = null;

    // ADD EXPENSE
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date,
        };

        expenses.push(expense);
        displayExpenses(expenses);
        updateTotalAmount();
        updatePieChart();

        expenseForm.reset();
    });

    // EDIT / DELETE
    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter((expense) => expense.id !== id);
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find((expense) => expense.id === id);

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            expenses = expenses.filter((expense) => expense.id !== id);
        }

        displayExpenses(expenses);
        updateTotalAmount();
        updatePieChart();
    });

    // FILTER CATEGORY
    filterCategory.addEventListener("change", () => {
        const category = filterCategory.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filtered = expenses.filter(expense => expense.category === category);
            displayExpenses(filtered);
        }
    });

    // DISPLAY TABLE
    function displayExpenses(data) {
        expenseList.innerHTML = "";
        data.forEach((expense) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;
            expenseList.appendChild(row);
        });
    }

    // UPDATE TOTAL
    function updateTotalAmount() {
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    //  PIE CHART 
    function updatePieChart() {
        const categoryTotals = {};
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        if (myPieChart) myPieChart.destroy(); // remove old chart

        myPieChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5733"]
                }]
            }
        });
    }

    //  DARK MODE , CHART COLOR CHANGE
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "Switch to Light Mode";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "Switch to Light Mode";
            localStorage.setItem("theme", "dark");
        } else {
            themeToggle.textContent = "Switch to Dark Mode";
            localStorage.setItem("theme", "light");
        }

        updatePieChart(); // refresh chart in dark mode
    });
});
