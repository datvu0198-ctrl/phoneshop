import { FaMapMarkerAlt, FaPhone, FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* COL 1: Thông tin cửa hàng */}
        <div className="footer-col">
          <h3 className="footer-logo" style={{ color: '#38bdf8', marginBottom: '15px' }}>
            📱 PhoneShop
          </h3>
          <p className="footer-desc">
            Cửa hàng điện thoại chính hãng, giá tốt, bảo hành uy tín.
          </p>
          <div className="footer-social">
            <a title="Facebook" style={{color: '#1877F2'}}><FaFacebook /></a>
            <a title="Youtube" style={{color: '#FF0000'}}><FaYoutube /></a>
            <a title="Tiktok" style={{color: '#fff'}}><FaTiktok /></a>
            <a title="Zalo" style={{color: '#0068FF'}}><SiZalo /></a>
          </div>
        </div>

        {/* COL 2: Liên hệ */}
       <div className="footer-col">
          <h4>Liên hệ</h4>
          <p><FaMapMarkerAlt /> Gò Vấp, TP.HCM</p>
          <p><FaPhone /> 0123 456 789</p>
          <p>📞 Mua hàng: 1800 1234</p>
          <p>🛠 Kỹ thuật: 1800 5678</p>
        </div>

        {/* COL 3: Hỗ trợ */}
        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <a href="#">Chính sách bảo hành</a>
          <a href="#">Chính sách đổi trả</a>
          <a href="#">Hướng dẫn mua hàng</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản sử dụng</a>
        </div>

        {/* COL 4: Website cùng tập đoàn - Chép vào đây cho đúng hàng lối */}
        <div className="footer-col">
        <h4>Website cùng tập đoàn</h4>

        <div className="footer-logos">
          <a href="https://www.topzone.vn" target="_blank" rel="noopener noreferrer">
            <img src="/logos/topzone.png" alt="topzone" />
          </a>

          <a href="https://www.dienmayxanh.com" target="_blank" rel="noopener noreferrer">
            <img src="/logos/dmx.png" alt="dmx" />
          </a>

          <a href="https://www.bachhoaxanh.com" target="_blank" rel="noopener noreferrer">
            <img src="/logos/bhx.png" alt="bhx" />
          </a>

          <a href="https://www.nhathuocankhang.com" target="_blank" rel="noopener noreferrer">
            <img src="/logos/ankhang.png" alt="ankhang" />
          </a>

          <a href="https://www.avakids.com" target="_blank" rel="noopener noreferrer">
            <img src="/logos/ava.png" alt="ava" />
          </a>

          <a href="https://vieclam.thegioididong.com" target="_blank" rel="noopener noreferrer">
            <img src="/logos/vieclam.png" alt="vieclam" />
          </a>
        </div>
      </div>
        {/* COL 5: Thanh toán */}
        <div className="footer-col">
        <h4>Thanh toán</h4>
        <div className="payment-logos">
          <img src="/logos/visa.png" alt="visa" />
          <img src="/logos/mastercard.png" alt="mastercard" />
          <img src="/logos/momo.png" alt="momo" />
          <img src="/logos/zalopay.png" alt="zalopay" />
        </div>
      </div>

    </div>

      <div className="footer-bottom">
        © 2026 PhoneShop - All rights reserved.
      </div>
    </footer>
  );
}

export default Footer