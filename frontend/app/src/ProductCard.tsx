import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addToCartAsync, removeFromCartAsync, updateQuantityAsync} from './slices/cartSlice';
import {selectUser} from './slices/userSlice';
import {useNavigate} from "react-router-dom";
import styled from 'styled-components';

interface Product {
    id: number;
    title: string;
    photo: string;
    price: number;
}

interface ProductCardProps {
    product: Product;
}

export const useProductNavigation = () => {
    const navigate = useNavigate();

    const handleCardClick = (productId: number) => {
        navigate(`/products/${productId}`);
    };

    return {handleCardClick};
};

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const cartItems = useSelector((state) => state.cart.items);

    const [quantity, setQuantity] = useState<number>(0);

    useEffect(() => {
        setQuantity(cartItems[product.id] || 0);
    }, [cartItems, product.id]);

    const handleIncrease = async () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        await dispatch(updateQuantityAsync({userId: user.userData.id, productId: product.id, quantity: newQuantity}));
    };

    const handleDecrease = async () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            await dispatch(updateQuantityAsync({
                userId: user.userData.id,
                productId: product.id,
                quantity: newQuantity
            }));
        } else if (quantity === 1) {
            setQuantity(0);
            await dispatch(removeFromCartAsync({userId: user.userData.id, productId: product.id}));
        }
    };

    const handleAddToCart = async () => {
        if (!user.isAuthenticated) {
            alert("Please log in.");
            navigate("/login");
        } else {
            const newQuantity = quantity > 0 ? quantity : 1;
            setQuantity(newQuantity);
            await dispatch(addToCartAsync({userId: user.userData.id, productId: product.id, quantity: newQuantity}));
        }
    };

    return (
        <Card>
            <Image onClick={() => navigate(`/products/${product.id}`)} src={'/images/' + product.photo}
                   alt={product.title}/>
            <Title>{product.title}</Title>
            <Price>${product.price}</Price>
            {quantity === 0 ? (
                <AddButton onClick={handleAddToCart}>Add to cart</AddButton>
            ) : (
                <QuantityContainer>
                    <Button onClick={handleDecrease}>-</Button>
                    <span>{quantity}</span>
                    <Button onClick={handleIncrease}>+</Button>
                </QuantityContainer>
            )}
        </Card>
    );
};

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: calc((100% / 5) - 20px);

  @media (max-width: 1024px) {
    width: calc((100% / 4) - 20px);
  }

  @media (max-width: 768px) {
    width: calc((100% / 3) - 20px);
  }

  @media (max-width: 648px) {
    width: calc(100% - 20px);
  }

  @media (max-width: 480px) {
    width: calc(100% - 20px);
  }

  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 100%;
  height: calc(100vh / 3);
  object-fit: contain;
`;

const Title = styled.p`
  font-size: 14px;
  margin: 10px 0;
`;

const Price = styled.p`
  font-size: 14px;
`;

const AddButton = styled.button`
  font-size: 16px;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  padding: 5px; /* Adjust padding for buttons */
`;

export default ProductCard;
