'use client';

import { axiosInstance } from '@/libs/axios.config';
import { Order } from '@/models/reservation.model';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FaMoon } from 'react-icons/fa';
type OrderStatusType =
  | 'pending_payment'
  | 'awaiting_confirmation'
  | 'success'
  | 'cancelled';
interface OrderStatusProps {
  status: OrderStatusType;
}
const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const statusStyles: Record<OrderStatusType, React.CSSProperties> = {
    pending_payment: { color: 'blue' },
    awaiting_confirmation: { color: '#FFD700' },
    success: { color: 'green' },
    cancelled: { color: 'red' },
  };
  const transformStatusText = (status: OrderStatusType) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="font-semibold text-sm" style={statusStyles[status]}>
      {transformStatusText(status)}
    </div>
  );
};
function MyOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance().get(
          `http://localhost:8000/api/reservations/user/myOrder`,
        );
        console.log('Response data:', response.data);
        const orders: Order[] = response.data.data;
        setOrders(orders);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchOrders();
  }, []);
  const calculateDurationInDays = (
    checkInDate: Date,
    checkOutDate: Date,
  ): number => {
    const diff = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  console.log(orders);
  return (
    <>
      <div>
        <div>
          <p className="p-6 font-bold text-lg">Your Orders</p>
        </div>
        <div className="flex flex-col gap-4 pb-4">
          {orders.map((order) => (
            <div key={order.id}>
              <div>
                <div className="flex flex-col space-y-3 rounded-xl shadow-lg p-3 max-w-xs md:max-w-4xl mx-auto md:m-0 md:ml-6  border border-white bg-white">
                  <div className="flex flex-row gap-5 justify-between md:justify-normal">
                    <div>
                      <img
                        src="https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-mobile/tix-hotel/images-web/2020/10/28/0ddd6698-87b8-41c5-8732-0a6992564443-1603891614072-8cf982cb8d7d912e29d615edd0a503f5.jpg" // Use room.pic for the image source
                        alt="hotel" // Use room.type for the alt text
                        className="rounded-xl"
                        width={100}
                      />
                    </div>
                    <div className="font-bold">{order.property.name}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold">{order.room.type} Room</div>
                    <div className="font-normal">{order.room.desc}</div>
                  </div>
                  <div className="flex flex-row gap-6 font-semibold">
                    <div>
                      {dayjs(order?.checkIn_date).format('DD MMMM YYYY')} -{' '}
                      {dayjs(order?.checkOut_date).format('DD MMMM YYYY')}
                    </div>
                    <div className="">
                      <div className="flex gap-3 font-semibold text-[#ED777B]">
                        {' '}
                        {calculateDurationInDays(
                          new Date(order.checkIn_date),
                          new Date(order.checkOut_date),
                        )}{' '}
                        <span className="hidden md:block font-semibold text-[#ED777B]">
                          {order.total_room > 1 ? 'Nights' : 'Night'}
                        </span>
                        <FaMoon className="mt-1 md:hidden" />
                      </div>
                    </div>
                  </div>
                  <div className="border"></div>
                  <OrderStatus status={order.status as OrderStatusType} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyOrder;