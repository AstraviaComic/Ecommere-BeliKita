// Navigasi ke halaman metode pembayaran
document.addEventListener("DOMContentLoaded", () => {
  const btnPembayaran = document.getElementById("btnMetodePembayaran");

  if (btnPembayaran) {
    btnPembayaran.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../payment/payment_methods.html";
    });
  }

  // Ambil metode pembayaran dari localStorage
  const metode = localStorage.getItem("metodePembayaran");

  const imageMap = {
    "cod": "aset/cod.png",
    "bk-cash": "aset/bkcash.png",
    "mandiri": "aset/logo mandiri.png",
    "bri": "aset/logo bri.png",
    "bni": "aset/logo bni.png",
    "bca": "aset/logo bca.png",
    "dana": "aset/logo dana.png",
    "ovo": "aset/logo ovo.jpeg",
    "gopay": "aset/logo gopay.png",
    "shopeepay": "aset/logo shopeepay.png"
  };

  const pmpDiv = document.querySelector(".pmp");

  if (metode && imageMap[metode]) {
    const imgSrc = "../payment/" + imageMap[metode];
    pmpDiv.innerHTML = `
      <button id="btnMetodePembayaran">Metode Pembayaran</button>
      <img src="${imgSrc}" alt="${metode}" width="70px" height="auto">
    `;
  } else {
    pmpDiv.innerHTML = `
      <button id="btnMetodePembayaran">Pilih Metode Pembayaran</button>
    `;
  }

  // Re-attach event listener setelah innerHTML diganti
  const btnBaru = document.getElementById("btnMetodePembayaran");
  if (btnBaru) {
    btnBaru.addEventListener("click", function () {
      window.location.href = "../payment/payment_methods.html";
    });
  }
});
