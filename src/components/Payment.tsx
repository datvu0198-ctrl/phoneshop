interface PaymentProps {
  payment: string;
  setPayment: (method: string) => void;
}

const Payment = ({ payment, setPayment }: PaymentProps) => {
  return (
    <div
      className="payment-methods"
      style={{
        marginTop: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
        Phương thức thanh toán:
      </p>

      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
        <input
          type="radio"
          name="payment-group"
          checked={payment === "cod"}
          onChange={() => setPayment("cod")}
        />
        <span>💵 Thanh toán khi nhận hàng</span>
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
        <input
          type="radio"
          name="payment-group"
          checked={payment === "momo"}
          onChange={() => setPayment("momo")}
        />
        <span>📱 Ví Momo</span>
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
        <input
          type="radio"
          name="payment-group"
          checked={payment === "bank"}
          onChange={() => setPayment("bank")}
        />
        <span>🏦 Chuyển khoản</span>
      </label>
    </div>
  );
};

export default Payment;