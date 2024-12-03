import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    customer: {
        name: '',
        phone: '',
        address: '',
    },
    details: [],
    totalPrice: 0,
};

function updateTotalPrice(state) {
    state.totalPrice = state.details.reduce((prevPrice, currDetail) => {
        return prevPrice + currDetail.quantity * currDetail.price;
    }, 0);
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        add: (state, action) => {
            //add
            const indexDetail = state.details.findIndex((detail) => detail.product === action.payload._id);
            if (indexDetail !== -1) {
                if (state.details[indexDetail].quantity === action.payload.quantity) {
                    return state;
                } else {
                    state.details[indexDetail].quantity += 1;
                }
            } else {
                state.details.push({
                    product: action.payload._id,
                    price: action.payload.price,
                    quantity: 1,
                });
            }
            updateTotalPrice(state);
        },

        // action: _id
        remove: (state, action) => {
            state.details = state.details.filter((detail) => detail.product !== action.payload);
            updateTotalPrice(state);
        },

        // action: {product, quantity}
        updateQuantity: (state, action) => {
            const indexDetail = state.details.findIndex((detail) => detail.product === action.payload.product._id);
            if (indexDetail !== -1) {
                if (action.payload.product.quantity < Number(action.payload.quantity)) {
                    return state;
                }
                state.details[indexDetail].quantity = Number(action.payload.quantity);
            }
            updateTotalPrice(state);
        },

        updateCustomer: (state, action) => {
            state.customer = action.payload;
        },
        reset: () => initialState,
    },
});

// Action creators are generated for each case reducer function
const orderReducer = orderSlice.reducer;
const orderActions = orderSlice.actions;

export default orderReducer;
export { orderActions };
