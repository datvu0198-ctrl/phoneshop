import { useEffect, useState } from "react";
import "../../styles/pages/admin.css";

type Order = {
  id: number;
  total: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: number;
  payment?: string;
  customer?: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  items?: any[];
};

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount * 25000);

  const updateStatus = async (id: number, status: Order["status"]) => {
    await fetch(`http://localhost:3000/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    await fetchOrders();
    showToast("Đã cập nhật ✔");
  };

  const filteredOrders = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;

    const matchSearch =
      (o.customer?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.phone || "").includes(search) ||
      o.id.toString().includes(search);

    return matchFilter && matchSearch;
  });

  const revenue = orders
    .filter((o) => o.status === "confirmed")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="admin-container">

      {/* DASHBOARD */}
      <div className="dashboard">
        <div className="admin-card glass glow">
          <h4>📦 Tổng đơn</h4>
          <p className="value primary">{orders.length}</p>
        </div>

        <div className="admin-card glass glow">
          <h4>💰 Doanh thu</h4>
          <p className="value success">{formatVND(revenue)}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="glass order-toolbar">
        <input
          placeholder="🔍 Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="pending">⏳ Chờ</option>
          <option value="confirmed">✅ Xác nhận</option>
          <option value="cancelled">❌ Hủy</option>
        </select>
      </div>

      {/* EMPTY */}
      {filteredOrders.length === 0 && (
        <div className="glass empty">Không có đơn 😢</div>
      )}

      {/* LIST */}
      <div className="order-list">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="glass order-card hover-glow"
            onClick={() => setSelectedOrder(order)}
          >
            {/* HEADER */}
            <div className="order-top">
              <div>
                <div className="order-id">#{order.id}</div>
                <div className="order-date">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("vi-VN")
                    : "---"}
                </div>
              </div>

              <span className={`status ${order.status}`}>
                {order.status === "pending" && "⏳"}
                {order.status === "confirmed" && "✅"}
                {order.status === "cancelled" && "❌"}
              </span>
            </div>

            {/* INFO */}
            <div className="order-info">
              <p>👤 {order.customer?.name || "Không có"}</p>
              <p>📞 {order.customer?.phone || "---"}</p>
              <p>📧 {order.customer?.email || "---"}</p>
              <p>📍 {order.customer?.address || "---"}</p>
            </div>

            {/* ẢNH - FIX TO */}
            <div className="order-items-preview">
              {(order.items || []).slice(0, 2).map((item: any) => (
               <img
                  key={item.id}
                  src={
                    item.img
                      ? item.img.startsWith("http")
                        ? item.img
                        : `http://localhost:3000/${item.img.replace(/^\/+/, "")}`
                      : "https://via.placeholder.com/80"
                  }
                  alt={item.name}
                  className="order-img"
                 onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrder(null);   // 👈 thêm dòng này
                  setSelectedItem(item);
                }}
                />
              ))}
            </div>

            {/* TOTAL + BUTTON */}
            <div className="order-bottom">
              <h3 className="order-total">{formatVND(order.total)}</h3>

              <div
                className="order-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn success"
                  onClick={() => updateStatus(order.id, "confirmed")}
                >
                  ✔
                </button>
                <button
                  className="btn warning"
                  onClick={() => updateStatus(order.id, "pending")}
                >
                  ⏳
                </button>
                <button
                  className="btn danger"
                  onClick={() => updateStatus(order.id, "cancelled")}
                >
                  ✖
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="modal" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Đơn #{selectedOrder.id}</h3>

            <p>👤 {selectedOrder.customer?.name}</p>

            <div>
              {selectedOrder.items?.map((item: any) => (
                <div key={item.id} style={{ display: "flex", gap: 10 }}>
                  <img
                    src={
                      item.img
                        ? item.img.startsWith("http")
                          ? item.img
                          : `http://localhost:3000/${item.img.replace(/^\/+/, "")}`
                        : "https://via.placeholder.com/80"
                    }
                    alt={item.name}
                    className="order-img"
                  />
                  <div>
                    <p>{item.name}</p>
                    <span>x{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            <h4>{formatVND(selectedOrder.total)}</h4>

            <button onClick={() => setSelectedOrder(null)}>Đóng</button>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT SẢN PHẨM */}
        {selectedItem && (
        <div className="modal" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <h3>🛒 Chi tiết sản phẩm</h3>

            <img
              src={
                selectedItem.img
                  ? selectedItem.img.startsWith("http")
                    ? selectedItem.img
                    : `http://localhost:3000/${selectedItem.img.replace(/^\/+/, "")}`
                  : "https://via.placeholder.com/150"
              }
              alt={selectedItem.name}
              className="product-preview"
            />

            <p><b>Tên:</b> {selectedItem.name}</p>
            <p><b>Số lượng:</b> {selectedItem.quantity}</p>

            {/* thêm giá nếu có */}
            {selectedItem.price && (
              <p><b>Giá:</b> {formatVND(selectedItem.price)}</p>
            )}

            <button onClick={() => setSelectedItem(null)}>Đóng</button>
          </div>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
    
  );
}

export default AdminOrders;