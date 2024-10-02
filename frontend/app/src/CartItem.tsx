import React from 'react';
import {useAppDispatch, useAppSelector} from './store';
import {removeFromCartAsync, updateQuantityAsync} from './slices/cartSlice';
import {selectUser} from './slices/userSlice';
import {useProductNavigation} from './ProductCard';
import styled from 'styled-components';

interface Product {
    id: number;
    title: string;
    photo: string;
    price: number;
    quantity: number;
    description: string;
}

interface CartItemProps {
    product: Product;
}

const CartItem: React.FC<CartItemProps> = ({product}) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const {handleCardClick} = useProductNavigation();

    const handleRemove = () => {
        dispatch(removeFromCartAsync({userId: user.userData.id, productId: product.id}));
    };

    const handleIncrease = () => {
        dispatch(updateQuantityAsync({
            userId: user.userData.id,
            productId: product.id,
            quantity: product.quantity + 1
        }));
    };

    const handleDecrease = () => {
        if (product.quantity > 1) {
            dispatch(updateQuantityAsync({
                userId: user.userData.id,
                productId: product.id,
                quantity: product.quantity - 1
            }));
        } else {
            handleRemove();
        }
    };

    return (
        <CartItemContainer>
            <ProductImage onClick={() => handleCardClick(product.id)} src={`/images/${product.photo}`}
                          alt={product.title}/>
            <InfoContainer>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductDescription>{product.description.substring(0, 512)}...</ProductDescription>
            </InfoContainer>
            <PriceAndControls>
                <Price>${product.price}</Price>
                <QuantityControl>
                    <Button onClick={handleDecrease}>-</Button>
                    <span>{product.quantity}</span>
                    <Button onClick={handleIncrease}>+</Button>
                </QuantityControl>
                <RemoveButton onClick={handleRemove}>Remove</RemoveButton>
            </PriceAndControls>
        </CartItemContainer>
    );
};

const CartItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: calc(100vh / 6);
`;

const ProductImage = styled.img`
  height: 100%;
  margin-right: 20px;
  object-fit: contain;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductTitle = styled.h3`
  margin: 0;
  text-align: center;
`;

const ProductDescription = styled.p`
  margin: 0;
  text-align: center;

  overflow-wrap: break-word; /* Ensures long words break */
  word-wrap: break-word; /* For older browsers */
  word-break: break-word; /* Break long words */

  max-height: calc(100vh / 7); /* Set a maximum height */
  overflow: hidden; /* Hide overflow */
`;

const PriceAndControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Price = styled.p`
  margin: 0;
`;

const QuantityControl = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Button = styled.button`
  padding: 5px; /* Adjust padding for buttons */
`;

const RemoveButton = styled.button`
  font-size: 60%;
`;

export default CartItem;