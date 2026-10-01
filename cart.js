
function getCorrectImagePath(image) {

    // Image नसल्यास
    if (!image) {
        return "Frontend/images/plant-placeholder.jpg";
    }

    image = String(image).trim();

    // Windows path असेल तर / मध्ये convert करा
    image = image.replaceAll("\\", "/");

    // आधीच Frontend/images path असेल
    if (image.startsWith("Frontend/images/")) {
        return image;
    }

    // Bootstrap/images जुना path
    if (image.startsWith("Bootstrap/images/")) {
        return image.replace(
            "Bootstrap/images/",
            "Frontend/images/"
        );
    }

    // images/plant.jpg असेल
    if (image.startsWith("images/")) {
        return "Frontend/" + image;
    }

    // फक्त plant.jpg filename असेल
    if (
        !image.includes("/") &&
        !image.includes(":")
    ) {
        return "Frontend/images/" + image;
    }

    return image;
}



// ==========================================
// ADD TO CART
// ==========================================

async function addToCart(name, price, image) {

    // Image path correct करा
    let correctImage = getCorrectImagePath(image);
    
    const email = localStorage.getItem("greenleafUserEmail");

    if (email) {
        // User is logged in -> Sync with Backend
        try {
            const response = await fetch("http://127.0.0.1:5000/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, price, image: correctImage })
            });
            
            if (response.ok) {
                alert(name + " added to cart! 🌱");
            } else {
                const data = await response.json();
                alert("Failed to add to cart: " + data.message);
            }
        } catch (error) {
            console.error("Cart Error:", error);
            alert("❌ Could not connect to the server.");
        }
    } else {
        // User is not logged in -> Use Local Storage (Old way)
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let existingProduct = cart.find(product => product.name === name);

        if (existingProduct) {
            existingProduct.quantity = Number(existingProduct.quantity || 1) + 1;
            existingProduct.image = correctImage;
        } else {
            cart.push({
                name: name,
                price: Number(price),
                image: correctImage,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(name + " added to cart! 🌱 (Please login to save your cart online)");
    }
}
