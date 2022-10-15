import React from "react";
import { useRouter } from "next/router";

function OrderPage(props) {
  const router = useRouter();
  const { orderId } = router.query;
  return <div>{orderId}</div>;
}

export default OrderPage;
