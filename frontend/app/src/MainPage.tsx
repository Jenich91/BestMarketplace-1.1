import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from './store';
import {fetchProducts} from './slices/productSlice';
import {fetchCart, loadCartFromLocalStorage} from './slices/cartSlice';
import ProductList from './ProductList';
import Header from './Header';
import SearchAndSort from './SearchAndSort';
import {selectUser} from './slices/userSlice';
import styled from "styled-components";

const useFetchData = (user: { isAuthenticated: boolean; userData: { id: number } }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const cachedProducts = localStorage.getItem('products');
            if (!cachedProducts) {
                await dispatch(fetchProducts());
            } else {
                const products = JSON.parse(cachedProducts);
                dispatch({type: 'products/fetchProducts/fulfilled', payload: products});
            }

            if (user.isAuthenticated) {
                dispatch(loadCartFromLocalStorage());
                await dispatch(fetchCart({userId: user.userData.id}));
            }
        };

        fetchData();
    }, [dispatch, user]);
};

interface Product {
    id: number;
    title: string;
    photo: string;
    price: number;
}

const MainPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const productsData = useAppSelector(state => state.products.items);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData);
    const [sortOrder, setSortOrder] = useState<string>('asc');

    useFetchData(user);

    useEffect(() => {
        setFilteredProducts(productsData);
    }, [productsData]);

    const handleSearch = (searchTerm: string) => {
        const filtered = productsData.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleSort = (sortType: string) => {
        let sorted;

        if (sortType === 'alphabetical') {
            sorted = [...filteredProducts].sort((a, b) =>
                a.title.localeCompare(b.title)
            );
        } else if (sortType === 'price') {
            sorted = [...filteredProducts].sort((a, b) =>
                sortOrder === 'asc' ? a.price - b.price : b.price - a.price
            );
        }
        setFilteredProducts(sorted);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        handleSort('price');
    };

    return (
        <div>
            <Header/>
            <MainPageContainer>
                <SearchAndSort
                    onSearch={handleSearch}
                    onSort={handleSort}
                    sortOrder={sortOrder}
                    toggleSortOrder={toggleSortOrder}
                />
                <ProductList products={filteredProducts}/>
            </MainPageContainer>
        </div>
    );
};

const MainPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 480px;
`;

export default MainPage;