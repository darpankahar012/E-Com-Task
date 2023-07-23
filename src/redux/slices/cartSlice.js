import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Instance } from '../../axios';
import { Routes } from '../../helpers/routeHelper';

const initialState = {
    cartLoaderId: null,
    itemAdded: "",
    cartLoader: false,
    cartList: []
};

export const addToCart = createAsyncThunk('addToCart', async (data) => {
    try {
        const response = await Instance.post(Routes.cart.addToCart, data)
        return response.data;
    } catch (e) {
        console.log(e.message)
    }
})
export const myCartList = createAsyncThunk('myBucket', async () => {
    try {
        const response = await Instance.get(Routes.cart.cartList)
        return response.data;
    } catch (e) {
        console.log(e.message)
    }
})

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload);
        },
        emptyCart: (state) => {
            state.cart = [];
        },
        resetMessage: (state) => {
            state.cartLoaderId = null
            state.itemAdded = ""
        },
    },
    extraReducers: {
        [addToCart.pending]: (state, action) => {
            state.cartLoaderId = action.meta.arg.productId
        },
        [addToCart.fulfilled]: (state, action) => {
            state.cartLoaderId = null
            state.itemAdded = action.payload.message
        },
        [addToCart.rejected]: (state, action) => {
            state.cartLoaderId = null
        },
        [myCartList.pending]: (state, action) => {
            state.cartLoader = true
        },
        [myCartList.fulfilled]: (state, action) => {
            state.cartLoader = false
            state.cartList = action.payload
        },
        [myCartList.rejected]: (state, action) => {
            state.cartLoader = false
        },
    }
});


export const { resetMessage, removeFromCart, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;