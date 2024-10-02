import express from 'express';
import { User, Product, Cart, Order, OrderProduct } from './models';

const router = express.Router();

// User registration
router.post('/signup', async (req, res) => {
    const { login, password } = req.body;

    try {
        const newUser = await User.create({ login, password });
        res.status(201).json({ message: 'User successfully created', user: newUser });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ where: { login, password } });

        if (user) {
            const { password, ...userData } = user.get(); // Exclude password from response
            res.status(200).json({ message: 'Login successful', userData });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error });
    }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }

    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error });
    }
});

// Get cart items by user ID
router.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await Cart.findAll({ where: { userId }, include: [Product] });

        if (cartItems.length === 0) return res.status(404).json({ error: 'Cart is empty' });

        res.json(cartItems);

    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error });
    }
});

// Add product to cart
router.post('/cart', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (quantity === 0) {
            await Cart.destroy({ where: { userId, productId } });
            return res.status(200).json({ message: 'Product removed from cart' });
        }

        const existingItem = await Cart.findOne({ where: { userId, productId } });

        if (existingItem) {
            existingItem.quantity = quantity;
            await existingItem.save();
        } else {
            await Cart.create({ userId, productId, quantity });
        }

        res.status(201).json({ message: 'Product added to cart' });

    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error });
    }
});

// Remove product from cart
router.delete('/cart/:productId', async (req, res) => {
    const userId = req.body.userId;
    const productId = req.params.productId;

    try {
        if (!userId) return res.status(400).json({ error: 'User ID is required' });

        const result = await Cart.destroy({ where: { userId, productId } });

        if (result === 0) return res.status(404).json({ error: 'Product not found in cart' });

        res.json({ message: 'Product removed from cart' });

    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error });
    }
});

// Create a new order
router.post('/my-orders', async (req, res) => {
    try {
        const { userId, deliveryAddress } = req.body;

        const cartItems = await Cart.findAll({ where: { userId } });

        if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        const totalCostPromises = cartItems.map(async item => {
            const product = await Product.findByPk(item.productId);
            if (!product) throw new Error('Product not found'); // Check for product existence

            return item.quantity * product.price;
        });

        const totalCostArray = await Promise.all(totalCostPromises);
        const totalAmount = totalCostArray.reduce((total: number, amount: number) => total + amount, 0);

        const newOrder = await Order.create({
            userId,
            totalCost: totalAmount,
            deliveryAddress,
            orderStatus: 'Pending',
        });

        await Promise.all(cartItems.map(async item => OrderProduct.create({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
        })));

        await Cart.destroy({ where: { userId } });

        res.status(201).json({ message: 'Order created', orderId: newOrder.id });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user orders
router.get('/my-orders', async (req, res) => {
    try {
        const userId = req.query.userId as string;

        const orders = await Order.findAll({
            where: { userId },
            include: [{
                model: Product,
                through: {
                    attributes: ['quantity'], // Specify additional attributes if needed
                },
                attributes: ['id', 'title', 'photo', 'price'], // Product attributes
            }],
        });

        if (!orders.length) return res.status(404).json({ message: 'Orders not found' });

        res.status(200).json(orders);

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router
export default router;


