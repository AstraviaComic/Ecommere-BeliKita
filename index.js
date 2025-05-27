if (!localStorage.getItem("produk")) {
      localStorage.setItem("produk", JSON.stringify(contohProduk));
    }

    function potongDeskripsi(deskripsi) {
      if (!deskripsi) return "Tidak ada deskripsi";
      if (deskripsi.length > 50) {
        return deskripsi.substring(0, 50) + '...';
      }
      return deskripsi;
    }

    function tampilkanProduk() {
      const produk = JSON.parse(localStorage.getItem("produk")) || [];
      const daftarBarang = document.getElementById('daftarBarang');
      daftarBarang.innerHTML = '';

      if (produk.length === 0) {
        daftarBarang.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Tidak ada produk tersedia</p>';
        return;
      }

      produk.forEach(item => {
  const kartuBarang = document.createElement('div');
  kartuBarang.className = 'kartu-barang';
  kartuBarang.setAttribute('data-category', item.kategori || 'Uncategorized');

  const deskripsiSingkat = potongDeskripsi(item.deskripsi);

  const totalStok = item.variasi ? item.variasi.reduce((total, variasi) => total + (variasi.stok || 0), 0) : 0;
  const totalTerjual = item.variasi ? item.variasi.reduce((total, variasi) => total + (variasi.terjual || 0), 0) : 0;

  kartuBarang.innerHTML = `
    <img src="${item.gambar || 'https://via.placeholder.com/300x160'}" alt="${item.nama}" class="gambar-barang" />
    <div class="isi-barang">
      <div class="kategori-barang">${item.kategori || 'Uncategorized'}</div>
      <div class="nama-barang">${item.nama || 'Produk Tanpa Nama'}</div>
      <div class="deskripsi-barang">${deskripsiSingkat}</div>
      <div class="info-stok">
        <div><i class="fas fa-box"></i> Stok: ${totalStok}</div>
        <div><i class="fas fa-chart-line"></i> Terjual: ${totalTerjual}</div>
      </div>
      <div class="harga-barang">Rp ${item.harga ? item.harga.toLocaleString('id-ID') : '0'}</div>
    </div>
  `;

  kartuBarang.onclick = () => {
    window.location.href = `produk/detail.html?nama=${encodeURIComponent(item.nama)}`;
  };

  daftarBarang.appendChild(kartuBarang);
});

    }

    function filterCategory(kategori, event) {
      const barang = document.querySelectorAll('.kartu-barang');
      const tombol = document.querySelectorAll('.kategori button');

      tombol.forEach(btn => btn.classList.remove('aktif'));
      event.target.classList.add('aktif');

      barang.forEach(item => {
        const itemKategori = item.getAttribute('data-category');
        if (kategori === 'all' || kategori === itemKategori) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }

    document.addEventListener('DOMContentLoaded', tampilkanProduk);

