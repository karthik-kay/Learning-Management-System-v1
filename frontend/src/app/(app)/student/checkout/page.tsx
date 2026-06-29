"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

import { fetchCourses } from "@/redux/slices/coursesSlice";
import {
  createOrderThunk,
  verifyPaymentThunk,
} from "@/redux/thunks/paymentThunks";
import { clearCart } from "@/redux/slices/cartSlice";

import { CheckoutList } from "@/components/features/checkout/compositions/CheckoutList";
import { CheckoutLayout } from "@/components/features/checkout/layouts/CheckoutLayout";
import { CartSummary } from "@/components/features/cart/compositions/CartSummary";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // ✅ STATE
  const cart = useAppSelector((state: RootState) => state.cart.items);

  const courses = useAppSelector((state: RootState) => state.courses.list);

  const coursesStatus = useAppSelector(
    (state: RootState) => state.courses.listStatus,
  );

  // ✅ FETCH COURSES (FIXED)
  useEffect(() => {
    if (coursesStatus === "idle") {
      dispatch(fetchCourses());
    }
  }, [dispatch, coursesStatus]);

  // ✅ DERIVED DATA
  const cartIds = useMemo(() => new Set(cart.map((i) => i.id)), [cart]);

  const cartCourses = useMemo(
    () => courses.filter((c) => cartIds.has(c.id)),
    [courses, cartIds],
  );

  const total = useMemo(
    () =>
      cartCourses.reduce((acc, c) => acc + (c.active_price?.final_inr || 0), 0),
    [cartCourses],
  );

  // ✅ PAYMENT HANDLER
  const handlePay = async () => {
    if (typeof window === "undefined") return;

    if (!(window as any).Razorpay) {
      alert("Payment system not loaded");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty bruv");
      return;
    }

    const result: any = await dispatch(
      createOrderThunk({
        items: cart.map((c) => ({ course_id: c.id })),
        sales_link_token: localStorage.getItem("ref"),
      }),
    );

    if (!result.payload) return;

    const data = result.payload;

    // ✅ FREE COURSES AUTO ENROLL
    if (data.auto_enrolled?.length > 0) {
      dispatch(clearCart());
      router.push("/student/courses/my-courses");
      return;
    }

    const rzp = new (window as any).Razorpay({
      key: data.key_id,
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,

      handler: async (response: any) => {
        await dispatch(
          verifyPaymentThunk({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        );

        dispatch(clearCart());
        router.push("/student/courses/my-courses");
      },
    });

    rzp.open();
  };

  // ✅ LOADING STATE
  if (coursesStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading checkout...
      </div>
    );
  }

  // ✅ EMPTY CART STATE
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Your cart is empty bruv 🥲
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase</p>
        </div>

        {/* LAYOUT */}
        <CheckoutLayout
          list={
            <div className="bg-background border rounded-2xl p-5 shadow-sm">
              <CheckoutList items={cart} courses={cartCourses} />
            </div>
          }
          summary={
            <div className="bg-background border rounded-2xl p-5 shadow-sm">
              <CartSummary total={total} />
            </div>
          }
          action={
            <button
              onClick={handlePay}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-medium hover:opacity-90 transition"
            >
              Pay ₹{total}
            </button>
          }
        />
      </div>
    </div>
  );
}
