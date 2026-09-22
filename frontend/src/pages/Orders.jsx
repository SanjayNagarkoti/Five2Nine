import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import { getMyOrders } from "../service/orderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        alert(
          error.response?.data ||
            "Failed to load orders."
        );
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <AppNav />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">
          My Orders
        </h1>

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          {orders.length === 0 && (
            <div className="bg-white border rounded-xl p-8 text-gray-500">
              No orders yet.
            </div>
          )}

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-xl p-6"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-[#1F8A70] font-semibold">
                    ORDER #{order.id}
                  </p>

                  <h2 className="text-xl font-bold mt-1">
                    {order.serviceTitle ||
                      order.projectTitle ||
                      "Custom Work"}
                  </h2>
                </div>

                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs h-fit">
                  {order.status}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <p>
                  <b>Client:</b> {order.clientName}
                </p>

                <p>
                  <b>Freelancer:</b>{" "}
                  {order.freelancerName}
                </p>

                <p>
                  <b>Agreed Price:</b> ₹
                  {order.agreedPrice}
                </p>

                <p>
                  <b>Delivery:</b>{" "}
                  {order.agreedDeliveryDate}
                </p>
              </div>

              <div className="border-t mt-5 pt-5">
                <p className="font-semibold">
                  Requirements
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {order.requirements}
                </p>

                <p className="font-semibold mt-4">
                  Description
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {order.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}