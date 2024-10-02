import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from './store';
import {addToCartAsync, clearCart, removeFromCartAsync, selectCartItems, updateQuantityAsync} from './slices/cartSlice';
import {selectProducts} from './slices/productSlice';
import {selectUser} from './slices/userSlice';
import Header from './Header';
import CartItem from './CartItem';
import OrderDialog from './OrderDialog';
import styled from 'styled-components';

const CartPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);
    const products = useAppSelector(selectProducts);
    const user = useAppSelector(selectUser);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleCreateOrder = async ({deliveryAddress, deliveryDate}: {
        deliveryAddress: string;
        deliveryDate: string
    }) => {
        const response = await fetch('http://localhost:5000/my-orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.userData.id,
                deliveryAddress,
                deliveryDate,
            }),
        });

        if (response.ok) {
            alert("Order successfully created!");
            dispatch(clearCart());
        } else {
            alert("Error creating order");
        }
    };

    const handleOpenDialog = () => {
        if (Object.keys(cartItems).length === 0) {
            alert("Cart is empty");
        } else {
            setDialogOpen(true);
        }
    };

    const handleQuantityChange = async (productId: number, quantity: number) => {
        if (quantity > 0) {
            await dispatch(updateQuantityAsync({userId: user.userData.id, productId, quantity}));
            await dispatch(addToCartAsync({userId: user.userData.id, productId, quantity}));
        } else {
            await handleRemove(productId);
        }
    };

    const handleRemove = async (productId: number) => {
        await dispatch(removeFromCartAsync({userId: user.userData.id, productId}));
    };

    const cartProducts = Object.keys(cartItems).map(productId => {
        const product = products.find(p => p.id === Number(productId));
        return {
            ...product,
            quantity: cartItems[productId],
        };
    });

    const totalPrice = cartProducts.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalCount = cartProducts.reduce((count, item) => count + item.quantity, 0);

    return (
        <Container>
            <Header/>
            <Content>
                <ProductList>
                    {cartProducts.length === 0 ? (
                        <EmptyCartMessage>Cart is empty</EmptyCartMessage>
                    ) : (
                        cartProducts.map(item => (
                            <CartItem
                                key={item.id}
                                product={item}
                                onRemove={handleRemove}
                                onQuantityChange={handleQuantityChange}
                            />
                        ))
                    )}
                </ProductList>

                {cartProducts.length > 0 && (
                    <OrderSummary>
                        <h3>Order Summary:</h3>
                        <p>Total items: {totalCount}</p>
                        <p>Total price: <b>{Number(totalPrice).toFixed(2)}</b></p>
                        <CreateOrderButton onClick={handleOpenDialog}>Create Order</CreateOrderButton>
                    </OrderSummary>
                )}
            </Content>

            <OrderDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleCreateOrder}
            />
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  margin: 10px;

  @media (max-width: 880px) {
    flex-direction: column;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex: 80;
  min-width: 33vw;
  margin-right: 2%;
  text-align: center;
`;

const EmptyCartMessage = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const OrderSummary = styled.div`
  flex: 20;
  border: 1px solid #ccc;
  padding: 20px;
  text-align: center;
  height: calc(calc(100vh / 6) - 21px);

  overflow: hidden;
  min-width: 25%;

  @media (max-width: 880px) {
    overflow-x: auto;
    margin-right: 2%;
  }
`;

const CreateOrderButton = styled.button`
  height: 20%;
  min-height: 40px;
  width: 75%;
`;

export default CartPage;