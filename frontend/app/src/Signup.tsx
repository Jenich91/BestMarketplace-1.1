import React, {useState} from 'react';
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";
import Header from "./Header";

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({login, password}),
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                navigate("/login");
            } else {
                setError(data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setError('An error occurred. Please try again later.');
        }
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
                    <Label>Repeat Password</Label>
                    <Input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}
                           required/>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Button type="submit">Sign up</Button>
                    <p>Already have an account? <a href="/login">Sign in</a></p>
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
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
`;

export default Signup;