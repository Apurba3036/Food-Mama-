import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { assets } from '../../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';

const PlaceOrder = () => {
    const { token,url } = useContext(StoreContext);
    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const navigate = useNavigate();
    const location = useLocation(); // Use location to access state
    const { totalAmount, deliveryCharge } = location.state || {}; // Destructure totalAmount and deliveryCharge from state
    const currency = "$"; // Currency symbol

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    };

    const getCartItems = () => {
        return JSON.parse(localStorage.getItem('cart')) || {};
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        const cartItems = getCartItems();
        const userId = localStorage.getItem('userId');
        let orderItems = Object.keys(cartItems).map(itemId => ({
            id: itemId,
            name: cartItems[itemId].name,
            price: cartItems[itemId].price,
            quantity: cartItems[itemId].quantity,
        }));

        let orderData = {
            userId: userId,
            address: data,
            items: orderItems,
            deliveryCharge: deliveryCharge,
            amount: totalAmount + deliveryCharge, // Use the passed totalAmount
        };

        try {
            let response;
            if (payment === "stripe") {
                response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
            } else if (payment === "SSL") {
                response = await axios.post(`${url}/create-payment`, orderData, { headers: { token } });
            } else {
                response = await axios.post(`${url}/api/order/placecod`, orderData, { headers: { token } });
            }

            if (response.data.success || response.data.paymentUrl) {
                if (payment === "stripe") {
                    const { session_url } = response.data;
                    localStorage.removeItem('cart');
                    window.location.replace(session_url);
                } else if (payment === "SSL") {
                    window.location.replace(response.data.paymentUrl);
                } else {
                    navigate("/myorders");
                    toast.success(response.data.message);
                    localStorage.removeItem('cart'); // Clear the cart after placing the order
                }
            } else {
                toast.error("Something Went Wrong");
            }
        } catch (error) {
            toast.error("Error occurred while placing the order");
            console.error(error);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("To place an order, sign in first");
            navigate('/cart');
        }
        else if (!totalAmount) { // Redirect to cart if totalAmount is not available
            navigate('/cart');
        }
    }, [token, totalAmount]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{totalAmount}</p></div> {/* Use totalAmount */}
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{totalAmount === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{totalAmount === 0 ? 0 : totalAmount + deliveryCharge}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                    <div onClick={() => setPayment("SSL")} className="payment-option">
                        <img src={payment === "SSL" ? assets.checked : assets.un_checked} alt="" />
                        <p>SSL Commerze ( All)</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
            </div>
        </form>
    );
};

export default PlaceOrder;
