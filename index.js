
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Password123!', 
    createdAt: new Date()
  }
];

// Products Data
let products = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Electronics"
  },
  {
    id: 3,
    name: "Laptop Stand",
    description: "Ergonomic aluminum laptop stand",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    category: "Accessories"
  },
  {
    id: 4,
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with multiple ports",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500",
    category: "Accessories"
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    category: "Electronics"
  },
  {
    id: 6,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    category: "Accessories"
  }
];


// AUTH ROUTES

// Register new user
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email already registered' 
    });
  }

  // Password validation (done on frontend, but double-check here)
  if (password.length < 8) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 8 characters' 
    });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password, // In production: hash with bcrypt!
    createdAt: new Date()
  };

  users.push(newUser);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: userWithoutPassword
  });
});

// Login user
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  // Find user
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }

  // Check password (in production, use bcrypt.compare)
  if (user.password !== password) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    message: 'Login successful',
    user: userWithoutPassword,
    token: `token-${user.id}-${Date.now()}` // Simple token (use JWT in production)
  });
});

// Get all users (for testing)
app.get('/api/auth/users', (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});


// PRODUCT ROUTES

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    image: req.body.image,
    category: req.body.category || 'General'
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});


// START SERVER

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running: http://localhost:${PORT}`);
  console.log(`📊 Registered users: ${users.length}`);
  console.log(`📦 Products available: ${products.length}`);
});