
import { CartItemType, ShippingInfo, User } from "./types";

export interface UserReduerInitialState {
    user: User | null;
    loading: boolean;
}

export interface CartReduerInitialState {
    loading: boolean;
    cartItems: CartItemType[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo;
}
 