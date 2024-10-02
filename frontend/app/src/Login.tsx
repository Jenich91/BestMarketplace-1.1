import React, {useState} from 'react';
import styled from 'styled-components';
import {useAppDispatch} from './store';
import {fetchLogin} from './slices/userSlice';
import {useNavigate} from "react-router-dom";
import Header from "./Header";

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userData = {login, password};
        await dispatch(fetchLogin(userData));
        navigate("/");
    };

    return (
        <div>
            <Header/>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Label>Login</Label>
                    <Input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required/>
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <Button type="submit">Sign in</Button>
                    <Footer>
                        New to BestMarketPlace? <StyledLink href="/signup">Create an account</StyledLink>
                    </Footer>
                </Form>
            </Container>
        </div>
    );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Label = styled.label`
  margin-bottom: 5px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3; /* Darker shade on hover */
  }
`;

const Footer = styled.p`
  margin-top: 10px; /* Added margin for spacing */
`;

const StyledLink = styled.a`
  color: #007bff; /* Link color */

  &:hover {
    text-decoration: underline; /* Underline on hover */
  }
`;

export default Login;