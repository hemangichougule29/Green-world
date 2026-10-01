
// ==========================================
// GET CORRECT IMAGE PATH
// ==========================================

function getHistoryImagePath(image) {

    if (!image) {
        return "Frontend/images/plant-placeholder.jpg";
    }

    image = String(image).trim();

    // Windows path convert
    image = image.replaceAll("\\", "/");


    // Already correct
    if (image.startsWith("Frontend/images/")) {
        return image;
    }


    // Old Bootstrap path
    if (image.startsWith("Bootstrap/images/")) {

        return image.replace(
            "Bootstrap/images/",
            "Frontend/images/"
        );

    }


    // images/plant.jpg
    if (image.startsWith("images/")) {

        return "Frontend/" + image;

    }


    // Only filename
    if (
        !image.includes("/") &&
        !image.includes(":")
    ) {

        return "Frontend/images/" + image;

    }


    return image;

}



// ==========================================
// RENDER ORDERS HTML
// ==========================================
function renderOrders(orders) {
    let historyContainer = document.getElementById("historyContainer");

    if (!orders || orders.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <h3>No orders found 🌱</h3>
                <p>Your placed orders will appear here.</p>
            </div>
        `;
        return;
    }

    historyContainer.innerHTML = "";
    
    // Newest order first
    orders.forEach(order => {
        let productsHTML = "";

        if (order.products) {
            order.products.forEach(product => {
                let price = Number(product.price) || 0;
                let quantity = Number(product.quantity) || 1;
                let subtotal = price * quantity;
                let imagePath = getHistoryImagePath(product.image);

                productsHTML += `
                    <div class="history-product">
                        <img src="${imagePath}" alt="${product.name}" width="80" height="80" 
                             style="object-fit: cover; border-radius: 10px;" 
                             onerror="this.onerror=null; this.src='Frontend/images/plant-placeholder.jpg';">
                        <div>
                            <h3>${product.name}</h3>
                            <p>Price: ₹${price}</p>
                            <p>Quantity: ${quantity}</p>
                            <p>Subtotal: ₹${subtotal}</p>
                        </div>
                    </div>
                `;
            });
        }

        historyContainer.innerHTML += `
            <div class="order-card">
                <h2>Order ID: ${order.orderId}</h2>
                <p>Date: ${order.date}</p>
                <hr>
                ${productsHTML}
                <h2>Total: ₹${order.total}</h2>
            </div>
        `;
    });
}

// ==========================================
// LOAD HISTORY
// ==========================================
async function loadHistory() {
    const userEmail = localStorage.getItem("greenleafUserEmail");

    if (userEmail) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/orders/${userEmail}`);
            const data = await response.json();
            
            if (response.ok && data.success) {
                renderOrders(data.orders);
            } else {
                console.error("Failed to load history from server");
            }
        } catch (err) {
            console.error(err);
            // Fallback
            let localOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
            renderOrders(localOrders.reverse());
        }
    } else {
        let localOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
        renderOrders(localOrders.reverse());
    }
}

// Run
loadHistory();

