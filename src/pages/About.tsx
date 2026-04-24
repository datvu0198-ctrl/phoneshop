

const About = () => {
  return (
    <div className="container mt-5 text-white p-5" style={{ 
      background: 'rgba(255, 255, 255, 0.05)', 
      backdropFilter: 'blur(10px)', 
      borderRadius: '20px',
      border: '1px solid rgba(255, 252, 252, 0.1)' 
    }}>
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#56bbf8' }}>GIỚI THIỆU PHONESHOP</h2>
      <div className="row align-items-center">
        <div className="col-md-6">
          <p className="lead">Chào mừng bạn đến với <strong>PhoneShop</strong> – điểm đến tin cậy cho những tín đồ công nghệ tại TP. Hồ Chí Minh.</p>
          <p>Chúng tôi chuyên cung cấp các dòng điện thoại thông minh chính hãng từ iPhone, Samsung đến các dòng máy Gaming như Realme, Oppo với mức giá cạnh tranh nhất thị trường.</p>
          <ul>
            <li>📍 Địa chỉ: Quận Gò Vấp, TP. Hồ Chí Minh.</li>
            <li>🚀 Giao hàng nhanh chóng toàn quốc.</li>
            <li>🛡️ Bảo hành uy tín lên đến 12 tháng.</li>
          </ul>
        </div>
        <div className="col-md-6 text-center">
          <img 
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500" 
            alt="Smartphone Store" 
            className="img-fluid rounded-3 shadow-lg"
            style={{ maxWidth: '80%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default About;