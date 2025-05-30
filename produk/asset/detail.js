document.addEventListener("DOMContentLoaded", () => {
      const params = new URLSearchParams(window.location.search);
      const nama = params.get("nama");
      const data = JSON.parse(localStorage.getItem("produk")) || [];

      const produk = data.find(p => p.nama === nama);

      if (!produk) {
        document.getElementById("productName").textContent = "Produk tidak ditemukan";
        return;
      }

      const productImage = document.getElementById("productImage");
      productImage.src = produk.gambar || 'https://via.placeholder.com/300x160';
      productImage.alt = produk.nama;

      document.getElementById("productName").textContent = produk.nama;
      document.getElementById("productCategory").textContent = produk.kategori;
      document.getElementById("productPrice").textContent = produk.harga.toLocaleString('id-ID');

      const totalStok = produk.variasi ? produk.variasi.reduce((a, v) => a + (v.stok || 0), 0) : 0;
      const totalTerjual = produk.variasi ? produk.variasi.reduce((a, v) => a + (v.terjual || 0), 0) : 0;

      document.getElementById("totalStock").textContent = totalStok;
      document.getElementById("totalSold").textContent = totalTerjual;
      document.getElementById("productDescription").textContent = produk.deskripsi || "Tidak ada deskripsi produk";

      const produkList = JSON.parse(localStorage.getItem("produk")) || [];
      const produkIndex = produkList.findIndex(p => p.nama === nama);
      const variasiSelect = document.getElementById("variasi");
      const jumlahSpan = document.getElementById("jumlah");
      const tambahBtn = document.getElementById("tambah");
      const kurangBtn = document.getElementById("kurang");
      const tambahKeranjangBtn = document.getElementById("tambahKeranjang");

      produk.variasi?.forEach((v, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${v.nama} (Stok: ${v.stok})`;
        variasiSelect.appendChild(opt);
      });

      let jumlah = 1;
      jumlahSpan.textContent = jumlah;

      tambahBtn.addEventListener("click", () => {
        const selectedVarian = produk.variasi[variasiSelect.value];
        if (jumlah < selectedVarian.stok) {
          jumlah++;
          jumlahSpan.textContent = jumlah;
        } else {
          alert("Tidak bisa melebihi stok yang tersedia!");
        }
      });

      kurangBtn.addEventListener("click", () => {
        if (jumlah > 1) {
          jumlah--;
          jumlahSpan.textContent = jumlah;
        }
      });

      tambahKeranjangBtn.addEventListener("click", () => {
        const indexVarian = parseInt(variasiSelect.value);
        const varian = produk.variasi[indexVarian];

        if (jumlah > varian.stok) {
          alert("Jumlah melebihi stok!");
          return;
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(item =>
          item.nama === produk.nama &&
          item.varian === varian.nama
        );

        if (existing) {
          if (existing.jumlah + jumlah > varian.stok) {
            alert("Jumlah total melebihi stok tersedia!");
            return;
          }
          existing.jumlah += jumlah;
        } else {
          cart.push({
            nama: produk.nama,
            gambar: produk.gambar,
            harga: produk.harga,
            varian: varian.nama,
            jumlah: jumlah
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${jumlah} produk ditambahkan ke keranjang`);
      });
    });