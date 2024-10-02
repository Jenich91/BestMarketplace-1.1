import React from 'react';
import ProductCard from './ProductCard';
import styled from 'styled-components';

interface ProductListProps {
    products: Array<{
        id: number;
        title: string;
        photo: string;
        price: number;
    }>;
}

const ProductList: React.FC<ProductListProps> = ({products}) => {
    return (
        <Container>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                products.map(product => (
                    <ProductCard key={product.id} product={product}/>
                ))
            )}
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export default ProductList;