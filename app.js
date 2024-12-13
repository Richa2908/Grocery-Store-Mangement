const tableBody = document.querySelector("#grocery-table tbody");

// Function to fetch items from backend
async function fetchItems() {
    const response = await fetch("http://127.0.0.1:5000/items");
    const items = await response.json();
    tableBody.innerHTML = ""; // Clear existing rows

    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>
                <button onclick="editItem(${item.id})">Edit</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Call fetchItems on page load
window.onload = fetchItems;

const form = document.querySelector("#grocery-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newItem = {
        name: document.querySelector("#name").value,
        quantity: document.querySelector("#quantity").value,
        price: document.querySelector("#price").value
    };

    await fetch("http://127.0.0.1:5000/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
    });

    form.reset(); // Clear form fields
    fetchItems(); // Refresh table
});


async function editItem(id) {
    const name = prompt("Enter new name:");
    const quantity = prompt("Enter new quantity:");
    const price = prompt("Enter new price:");

    if (name && quantity && price) {
        await fetch(`http://127.0.0.1:5000/item/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, quantity, price })
        });

        fetchItems(); // Refresh table
    }
}


async function deleteItem(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        await fetch(`http://127.0.0.1:5000/item/${id}`, {
            method: "DELETE"
        });

        fetchItems(); // Refresh table
    }
}
