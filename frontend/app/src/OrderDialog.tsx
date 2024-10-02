import React, {useState} from 'react';
import styled from 'styled-components';

interface OrderDialogProps {
    open: boolean; // Dialog visibility status
    onClose: () => void; // Function to close the dialog
    onSubmit: (data: { deliveryAddress: string; deliveryDate: string }) => void; // Function to handle submission
}

const OrderDialog: React.FC<OrderDialogProps> = ({open, onClose, onSubmit}) => {
    const [deliveryAddress, setDeliveryAddress] = useState<string>('');
    const [deliveryDate, setDeliveryDate] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({deliveryAddress, deliveryDate});
        onClose(); // Close dialog after submission
    };

    if (!open) return null; // Do not render if the dialog is not open

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Overlay onClick={onClose}/>
            <DialogContainer>
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <label>Delivery address:</label>
                        <Input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Delivery date:</label>
                        <Input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            required
                            min={today} // Set minimum date to today
                        />
                    </FormGroup>
                    <ButtonContainer>
                        <Button type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Create order</Button>
                    </ButtonContainer>
                </form>
            </DialogContainer>
        </>
    );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  width: 300px;
  z-index: 2;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: calc(100% - 16px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 8px;
`;

export default OrderDialog;