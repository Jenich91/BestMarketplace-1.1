import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Connect to PostgreSQL database
const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
});

// Define interfaces and classes for models

// Define interfaces for User model
interface UserAttributes {
    id?: number;
    login: string;
    password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public login!: string;
    public password!: string;
}

User.init({
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'user',
    freezeTableName: true,
});

// Define interfaces for Product model
interface ProductAttributes {
    id?: number;
    title: string;
    photo?: string | null;
    description?: string | null;
    vendorInfo?: string | null;
    price: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public title!: string;
    public photo!: string | null;
    public description!: string | null;
    public vendorInfo!: string | null;
    public price!: number;
}

Product.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    vendorInfo: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { sequelize, modelName: 'product', freezeTableName: true });

// Define interfaces for Order model
interface OrderAttributes {
    id?: number;
    userId: number;
    orderDate?: Date;
    deliveryAddress: string;
    deliveryDate?: Date | null;
    orderStatus?: string;
    totalCost?: number;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public userId!: number;
    public orderDate!: Date;
    public deliveryAddress!: string;
    public deliveryDate!: Date | null;
    public orderStatus!: string;
    public totalCost!: number;
}

Order.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
    },
    totalCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    }
}, { sequelize, modelName: 'order', freezeTableName: true });

// Define interfaces for OrderProduct model
interface OrderProductAttributes {
    id?: number;
    orderId: number;
    productId: number;
    quantity: number;
}

interface OrderProductCreationAttributes extends Optional<OrderProductAttributes, "id"> {}

class OrderProduct extends Model<OrderProductAttributes, OrderProductCreationAttributes> implements OrderProductAttributes {
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
}

OrderProduct.init({
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, { sequelize, modelName: "order_product", freezeTableName: true });

// Define interfaces for Cart model
interface CartAttributes {
    id?: number;
    userId: number;
    productId: number; // ID of the product added to the cart
    quantity?: number; // Quantity of the product in the cart
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
    public id!: number;
    public userId!: number;
    public productId!: number;
    public quantity!: number;
}

// Initialize Cart model
Cart.init({
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, { sequelize, modelName: "cart", freezeTableName: true });

// Set up associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

// Function for creating tables and filling in data
async function initializeDatabase() {
    try {
        await sequelize.sync({ force: true }); // Creates tables if there are none and clears them if necessary

        // Filling the Product table with initial data
        await Product.bulkCreate([
            {
                title: 'Apple iPhone 13',
                photo: 'iphone13.png',
                description: 'The Apple iPhone 13 is the latest addition to the iPhone family, featuring the powerful A15 Bionic chip that ensures lightning-fast performance and exceptional battery life. With a stunning Super Retina XDR display, your photos and videos will come to life with vibrant colors and incredible detail. Capture your memories with the advanced dual-camera system, which includes Night mode for low-light photography and Cinematic mode for professional-quality video recording. The iPhone 13 also supports 5G connectivity, allowing for faster downloads and streaming. With its sleek design and durable construction, this smartphone is perfect for anyone looking for a premium device that combines style with functionality.',
                vendorInfo: 'Apple',
                price: 999.99,
            },
            {
                title: 'Samsung Galaxy S21',
                photo: 'galaxy_s21.png',
                description: 'Experience the future of mobile technology with the Samsung Galaxy S21. This flagship smartphone boasts a stunning Dynamic AMOLED display that offers vibrant colors and deep contrasts, making everything from gaming to streaming a visual delight. Equipped with a powerful Exynos processor and ample RAM, multitasking is seamless and efficient. The Galaxy S21 features a triple-camera system that allows you to capture stunning photos in any lighting condition, while the 8K video recording capability brings your memories to life like never before. With its sleek design and premium materials, the Galaxy S21 is not just a phone; it’s a statement.',
                vendorInfo: 'Samsung',
                price: 799.99,
            },
            {
                title: 'Google Pixel 6',
                photo: 'pixel_6.png',
                description: 'The Google Pixel 6 redefines smartphone photography with its advanced AI capabilities and exceptional camera technology. Featuring a unique design and an impressive OLED display, this smartphone offers an immersive viewing experience for all your media needs. The Pixel 6 comes with stock Android for a clean user interface and timely updates directly from Google. Its powerful Tensor chip enhances performance while optimizing battery life, ensuring that you stay connected throughout the day. With features like Magic Eraser for photo editing and real-time translation capabilities, the Pixel 6 is perfect for tech-savvy users who value innovation.',
                vendorInfo: 'Google',
                price: 599.99,
            },
            {
                title: 'OnePlus 9',
                photo: 'oneplus_9.png',
                description: 'Introducing the OnePlus 9, designed for speed and performance without compromise. This smartphone features a fluid AMOLED display that refreshes at 120Hz for an ultra-smooth experience whether you’re gaming or scrolling through social media. The OnePlus 9’s Hasselblad camera partnership ensures stunning photography with natural colors and incredible detail in every shot. With Warp Charge technology, you can quickly recharge your phone in minutes, giving you more time to enjoy what matters most. Its sleek design and powerful hardware make it an excellent choice for anyone looking to elevate their mobile experience.',
                vendorInfo: 'OnePlus',
                price: 729.99,
            },
            {
                title: 'Xiaomi Mi 11',
                photo: 'mi_11.png',
                description: 'The Xiaomi Mi 11 is a flagship smartphone packed with cutting-edge technology and features that cater to every need. With its stunning AMOLED display that supports HDR10+ content, every image comes alive with rich colors and deep blacks. The Snapdragon processor ensures top-notch performance whether you’re gaming or multitasking between apps. The Mi 11’s triple-camera setup allows you to capture breathtaking photos in any environment, while its sleek design makes it comfortable to hold and use throughout the day. Enjoy seamless connectivity with 5G support and an array of smart features designed to enhance your daily life.',
                vendorInfo: 'Xiaomi',
                price: 749.99,
            },
            {
                title: 'Sony Xperia 5 III',
                photo: 'xperia_5_iii.png',
                description: 'The Sony Xperia 5 III is engineered for those who appreciate high-quality media consumption and photography. Featuring a vibrant OLED display with a cinematic aspect ratio, it’s perfect for watching movies or playing games on-the-go. The Xperia’s triple-lens camera system provides versatility in shooting options, allowing you to switch between wide-angle shots to telephoto zoom effortlessly. With advanced audio technology integrated into its design, enjoy immersive sound quality whether you’re listening to music or watching videos. The Xperia 5 III combines style, performance, and functionality in one compact device.',
                vendorInfo: 'Sony',
                price: 999.99,
            },
            {
                title: 'Nokia G50',
                photo: 'nokia_g50.png',
                description: 'The Nokia G50 is designed for those who want reliability without breaking the bank. Equipped with a large display that enhances your viewing experience, it’s perfect for streaming videos or browsing social media feeds. With its robust battery life, you can stay connected longer without worrying about charging frequently. The G50 supports 5G connectivity, ensuring faster download speeds when browsing or streaming content online. Its durable design means it can withstand everyday wear and tear while providing essential smartphone functionalities at an affordable price.',
                vendorInfo: 'Nokia',
                price: 299.99,
            },
            {
                title: 'Motorola Moto G Power',
                photo: 'moto_g_power.png',
                description: 'The Motorola Moto G Power is all about long-lasting battery life without sacrificing performance or features. With its massive battery capacity, this phone can last up to three days on a single charge—perfect for users who are always on-the-go. The vibrant display brings your content to life while the capable camera system captures great photos in various conditions. Enjoy smooth performance thanks to its efficient processor that handles everyday tasks effortlessly. The Moto G Power combines functionality with endurance in one affordable package.',
                vendorInfo: 'Motorola',
                price: 249.99,
            },
            {
                title: 'Huawei P40 Pro',
                photo: 'huawei_p40_pro.png',
                description: 'The Huawei P40 Pro stands out with its exceptional camera capabilities and elegant design. Featuring a quad-camera setup powered by advanced AI technology, it delivers stunning photography results even in low-light conditions. The immersive OLED display enhances your viewing experience whether you’re gaming or watching videos online. With fast charging support and long-lasting battery life, this smartphone keeps up with your busy lifestyle while providing seamless performance across all applications.',
                vendorInfo: 'Huawei',
                price: 899.99,
            },
            {
                title: 'Oppo Find X3 Pro',
                photo: 'oppo_find_x3_pro.png',
                description: 'The Oppo Find X3 Pro redefines luxury smartphones with its exquisite design and top-tier specifications. Its stunning AMOLED display offers vibrant colors and deep contrasts for an unparalleled visual experience—perfect for gaming or media consumption. The Find X3 Pro’s advanced camera system captures exceptional images with clarity and detail thanks to its innovative sensor technology. Enjoy fast charging capabilities that ensure you spend less time plugged in and more time enjoying what matters most.',
                vendorInfo: 'Oppo',
                price: 1149.99,
            },
        ]);

        console.log('Database initialized and products added.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Function for connecting with repeated attempts
const connectWithRetry = () => {
    return sequelize.sync()
        .then(() => {
            console.log('PostgreSQL connected');
            // Starting database initialization
            setTimeout(initializeDatabase, 5000);
        })
        .catch(err => {
            console.error('Error connecting to PostgreSQL:', err);
            setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
        });
};

// Export models and connect function
export { sequelize, connectWithRetry, User, Product, Order, OrderProduct, Cart, initializeDatabase };
