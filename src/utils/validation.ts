export const validateForm = (data: any) => {
  const errors: any = {}

  if (!data.name || data.name.trim() === "") {
    errors.name = "Không được để trống tên"
  }

  if (!/^[0-9]{10}$/.test(data.phone)) {
    errors.phone = "Số điện thoại phải 10 số"
  }

  if (!data.address || data.address.trim() === "") {
    errors.address = "Địa chỉ không được để trống"
  }

  if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email không hợp lệ"
  }

  return errors
}