import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Success = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    useEffect(() => {
        // Clear cart items from local storage
        localStorage.removeItem('cart'); // Replace 'cartItems' with your key

        // Optionally, you could redirect to another page after a short delay
        // setTimeout(() => {
        //     navigate('/'); // Redirect to home or any other page
        // }, 3000);
    }, [navigate]);

    return (
        <div>
            <h1>Payment Successful!</h1>
            <p>Your order has been created successfully.</p>
            {/* Optionally add a button to go back to home or view orders */}
            <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
    );
};

export default Success;
