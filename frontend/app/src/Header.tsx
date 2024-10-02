import React from 'react';
import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from './store';
import {logout, selectUser} from './slices/userSlice';
import styled from "styled-components";
import {isSafari} from "./App";

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);

    const handleLogout = () => {
        dispatch(logout());
        // dispatch(clearCart());
    };

    const emojiCart = !isSafari() ? '🛒' : 'cart';
    const emojiOrders = !isSafari() ? '🛍️' : 'orders';

    return (
        <HeaderContainer>
            <Logo>
                <StyledLink to="/">BestMarketPlace</StyledLink>
            </Logo>

            {user.isAuthenticated && (
                <IconContainer>
                    <StyledLink to="/my-orders">{emojiOrders}</StyledLink>
                    <StyledLink to="/cart">{emojiCart}</StyledLink>
                    <LogoutButton onClick={handleLogout}>🚪</LogoutButton>
                </IconContainer>
            )}
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f8f8;
`;

const Logo = styled.h1`
  margin-left: 7.5%;

  @media (max-width: 768px) {
    margin-left: -2.5%; // Adjust margin for smaller screens
    white-space: nowrap; // Prevent text wrapping
    overflow: hidden; // Hide overflow
    text-overflow: ellipsis; // Add ellipsis for overflow text
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:visited {
    color: inherit;
  }

  &:hover {
    opacity: 0.7;
  }

  &:focus {
    outline: none;
  }

  font-family: 'Gill Sans', 'Verdana', sans-serif;
  font-size: 42px;
  line-height: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;

  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1px black;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  line-height: 14px;
  font-size: 42px;

  &:hover {
    opacity: 0.7;
  }
`;

export default Header;