"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart } from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";

import { CartList } from "@/components/features/cart/compositions/CartList";
import { CartSummary } from "@/components/features/cart/compositions/CartSummary";
import { CartLayout } from "@/components/features/cart/layouts/CartLayout";

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const courses = useSelector((state: RootState) => state.courses.list);

  const dispatch = useDispatch();
  const router = useRouter();

  const cartIds = new Set(cart.map((i) => i.id));
  const cartCourses = courses.filter((c) => cartIds.has(c.id));
  const total = cartCourses.reduce(
    (acc, c) => acc + (c.active_price?.final_inr || 0),
    0,
  );

  return (
    <CartLayout
      list={
        <CartList
          items={cart}
          courses={courses}
          onRemove={(id: number) => dispatch(removeFromCart(id))}
        />
      }
      summary={<CartSummary total={total} />}
      action={
        <button
          disabled={cart.length === 0}
          onClick={() => router.push("/student/checkout")}
        >
          Checkout
        </button>
      }
    />
  );
}
