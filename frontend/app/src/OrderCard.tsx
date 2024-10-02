import React from 'react';
import styled from 'styled-components';
import {useProductNavigation} from "./ProductCard";

interface Order {
    id: number;
    deliveryAddress: string;
    deliveryDate: string;
    orderDate: string;
    orderStatus: string;
    totalCost: number;
    products: Array<{
        id: number;
        photo: string;
        title: string;
    }>;
}

interface OrderCardProps {
    order: Order; // Define type for props
}

const OrderCard: React.FC<OrderCardProps> = ({order}) => {
    const deliveryDateFormatted = new Date(order.deliveryDate).toLocaleDateString();
    const orderDateFormatted = new Date(order.orderDate).toLocaleDateString();
    const {handleCardClick} = useProductNavigation();

    return (
        <CardContainer>
            <InfoContainer>
                <h3>Order Nº: {order.id}</h3>
                <AddressText>Delivery address: {order.deliveryAddress}</AddressText>
                <AddressText>Delivery date: {deliveryDateFormatted}</AddressText>
                <p>Order date: {orderDateFormatted}</p>
            </InfoContainer>

            <ProductContainer>
                {order.products.slice(0, 3).map(product => (
                    <ProductImage
                        onClick={() => handleCardClick(product.id)}
                        key={product.id}
                        src={`/images/${product.photo}`}
                        alt={product.title}/>
                ))}
            </ProductContainer>

            <StatusContainer>
                <p>Order status: {order.orderStatus}</p>
                <p>Total cost: ${parseFloat(order.totalCost.toString()).toFixed(2)}</p>
            </StatusContainer>
        </CardContainer>
    );
};


const CardContainer = styled.div`
  display: flex;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  flex-direction: row; /* Row layout by default */

  @media (max-width: 880px) {
    flex-direction: column; /* Stack elements vertically on small screens */
  }
`;

const ProductContainer = styled.div`
  flex: 5;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding-right: 10px;
`;

const ProductImage = styled.img`
  height: calc(100vh / 6);
  object-fit: contain;

  @media (max-width: 880px) {
    overflow-x: auto;
  }
`;

const StatusContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const AddressText = styled.p`
  padding-left: 10%;
`;

export default OrderCard;