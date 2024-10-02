import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from './store';
import {useNavigate, useParams} from 'react-router-dom';
import {addToCartAsync} from './slices/cartSlice';
import {selectUser} from './slices/userSlice';
import Header from "./Header";
import styled from 'styled-components';

const ProductDetails: React.FC = () => {
    const {productId} = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        if (!user.isAuthenticated) {
            alert("Please log in.");
            navigate("/login");
            return;
        }

        await dispatch(addToCartAsync({userId: user.userData.id, productId: product.id, quantity: 1}));
        navigate("/cart");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Header/>
            <Container>
                <Content>
                    <LeftColumn>
                        <Title>{product.title}</Title>
                        <Image src={`/images/${product.photo}`} alt={product.title}/>
                        <VendorInfo>Vendor info: {product.vendorInfo}</VendorInfo>
                    </LeftColumn>

                    <RightColumn>
                        <DescriptionTitle>Product description:</DescriptionTitle>
                        <Description>{product.description}</Description>
                        <PriceAndButtonContainer>
                            <Price>Price: ${product.price}</Price>
                            <AddButton onClick={handleAddToCart}>Add to cart</AddButton>
                        </PriceAndButtonContainer>
                    </RightColumn>
                </Content>
            </Container>
        </div>
    );
};

const Container = styled.div`
  padding: 20px;
  width: 80%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftColumn = styled.div`
  flex: 1;
  text-align: center;
  margin-right: 20px;
`;

const RightColumn = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2em;
`;

const Image = styled.img`
  height: calc(100vh / 4);
  object-fit: contain;
`;

const VendorInfo = styled.p`
  margin-top: 10px;
`;

const DescriptionTitle = styled.h2`
  font-size: 1.5em;
`;

const Description = styled.p`
  margin-top: 10px;

  max-height: calc(100vh / 6); /* Limit height for small screens */
  overflow-y: auto; /* Enable vertical scrolling */
`;

const PriceAndButtonContainer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Price = styled.h3`
  font-size: 1.5em;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
`;

export default ProductDetails;