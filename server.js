const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data storage
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data
let data = {
    testimonials: [],
    menu: [
        { id: 1, name: "Plain Butter & Cheese", price: 99, category: "classic", image: "plain.jpg" },
        { id: 2, name: "Cheese and Beans", price: 135, category: "signature", image: "cnb.jpg" },
        { id: 3, name: "Cheese and Tuna", price: 135, category: "signature", image: "cnt.jpg" },
        { id: 4, name: "Cheese and Creamy Mushroom Chicken", price: 170, category: "premium", image: "mushroom.jpg" },
        { id: 5, name: "Cheese and Chili Con Carne", price: 175, category: "premium", image: "cnchili.jpg" },
        { id: 6, name: "Cheese with Bacon & Ham", price: 145, category: "premium", image: "cnh.jpg" },
        { id: 7, name: "Cheese with Beans & Tuna", price: 165, category: "signature", image: "beans.jpg" }
    ],
    addons: [
        { id: 1, name: "Cheddarella", price: 30 },
        { id: 2, name: "Butter", price: 10 },
        { id: 3, name: "Sriracha", price: 10 },
        { id: 4, name: "Crispy Onion", price: 10 },
        { id: 5, name: "Chili Flakes", price: 5 },
        { id: 6, name: "Cheese Sauce", price: 20 },
        { id: 7, name: "Chili Garlic Sauce", price: 20 },
        { id: 8, name: "Extra Beans", price: 30 },
        { id: 9, name: "Extra Tuna", price: 30 },
        { id: 10, name: "Extra Bacon", price: 35 }
    ],
    baseSizes: [
        { id: 1, name: "Small", price: 79 },
        { id: 2, name: "Large", price: 99 }
    ],
    orders: []
};

// Load data
if (fs.existsSync(DATA_FILE)) {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data = { ...data, ...saved };
} else {
    // Default testimonials
    data.testimonials = [
        { id: 1, author: "Emma K.", text: "The best jacket potatoes I've ever had! The combination of perfectly crispy skin and fluffy inside, paired with fresh toppings, is unbeatable.", rating: 5, date: new Date().toISOString() },
        { id: 2, author: "David R.", text: "I visit Spudtacular multiple times a week. The team is friendly, the food is fantastic, and it's become my favorite lunch spot!", rating: 5, date: new Date().toISOString() },
        { id: 3, author: "Lisa T.", text: "Great quality, creative options, and fair prices. Spudtacular has elevated the humble jacket potato to an art form!", rating: 5, date: new Date().toISOString() }
    ];
    saveData();
}

function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/testimonials', (req, res) => {
    res.json(data.testimonials);
});

app.post('/api/testimonials', (req, res) => {
    const { author, text, rating } = req.body;
    const newTestimonial = {
        id: Date.now(),
        author: author.trim(),
        text: text.trim(),
        rating: rating,
        date: new Date().toISOString()
    };
    data.testimonials.unshift(newTestimonial);
    saveData();
    res.status(201).json(newTestimonial);
});

app.delete('/api/testimonials/:id', (req, res) => {
    data.testimonials = data.testimonials.filter(t => t.id != req.params.id);
    saveData();
    res.json({ success: true });
});

app.get('/api/menu', (req, res) => {
    res.json(data.menu);
});

app.get('/api/addons', (req, res) => {
    res.json(data.addons);
});

app.get('/api/base-sizes', (req, res) => {
    res.json(data.baseSizes);
});

app.post('/api/orders', (req, res) => {
    const order = {
        id: Date.now(),
        ...req.body,
        date: new Date().toISOString(),
        status: 'pending'
    };
    data.orders.push(order);
    saveData();
    res.status(201).json(order);
});

app.get('/api/orders', (req, res) => {
    res.json(data.orders);
});

app.listen(PORT, () => {
    console.log(`\n🌱 Spudtacular E-Commerce is running!`);
    console.log(`📍 Open: http://localhost:${PORT}`);
    console.log(`📁 Images: ${path.join(__dirname, 'public', 'images')}\n`);
});