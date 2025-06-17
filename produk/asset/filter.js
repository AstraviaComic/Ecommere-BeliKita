function potongDeskripsi(deskripsi) {
      if (!deskripsi) return "Tidak ada deskripsi";
      if (deskripsi.length > 100) {
        return deskripsi.substring(0, 100) + '...';
      }
      return deskripsi;
    }

    document.addEventListener('DOMContentLoaded', function() {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      const filterType = params.get('filterType') || 'semua';
      const minPrice = parseInt(params.get('minPrice')) || 0;
      const maxPrice = parseInt(params.get('maxPrice')) || Infinity;

      document.getElementById('searchInput').value = q;
      document.getElementById('filterHarga').value = filterType;
      
      if (filterType === 'kurang' || filterType === 'lebih') {
        document.getElementById('hargaMin').classList.remove('hidden');
        document.getElementById('hargaMin').value = minPrice || '';
      } else if (filterType === 'antara') {
        document.getElementById('hargaMin').classList.remove('hidden');
        document.getElementById('hargaMax').classList.remove('hidden');
        document.getElementById('hargaMin').value = minPrice || '';
        document.getElementById('hargaMax').value = maxPrice !== Infinity ? maxPrice : '';
      }

      const filterTags = document.getElementById('filterTags');
      filterTags.innerHTML = '';
      
      if (q) {
        const searchTag = document.createElement('div');
        searchTag.className = 'filter-tag';
        searchTag.innerHTML = `Pencarian: "${q}" <span class="remove-tag" onclick="removeSearch()">&times;</span>`;
        filterTags.appendChild(searchTag);
      }
      
      if (filterType === 'kurang') {
        const priceTag = document.createElement('div');
        priceTag.className = 'filter-tag';
        priceTag.innerHTML = `Harga ≤ Rp ${minPrice.toLocaleString('id-ID')} <span class="remove-tag" onclick="removePriceFilter()">&times;</span>`;
        filterTags.appendChild(priceTag);
      } else if (filterType === 'lebih') {
        const priceTag = document.createElement('div');
        priceTag.className = 'filter-tag';
        priceTag.innerHTML = `Harga ≥ Rp ${minPrice.toLocaleString('id-ID')} <span class="remove-tag" onclick="removePriceFilter()">&times;</span>`;
        filterTags.appendChild(priceTag);
      } else if (filterType === 'antara') {
        const priceTag = document.createElement('div');
        priceTag.className = 'filter-tag';
        priceTag.innerHTML = `Harga Rp ${minPrice.toLocaleString('id-ID')} - Rp ${maxPrice.toLocaleString('id-ID')} <span class="remove-tag" onclick="removePriceFilter()">&times;</span>`;
        filterTags.appendChild(priceTag);
      }

      const produk = JSON.parse(localStorage.getItem("produk")) || [];
      const productGrid = document.getElementById('productGrid');
      productGrid.innerHTML = '';

      const produkFiltered = produk.filter(item => {
        const matchSearch = item.nama.toLowerCase().includes(q.toLowerCase()) || 
                          (item.deskripsi && item.deskripsi.toLowerCase().includes(q.toLowerCase()));
        

        let matchHarga = true;
        switch(filterType) {
          case 'kurang':
            matchHarga = item.harga <= minPrice;
            break;
          case 'lebih':
            matchHarga = item.harga >= minPrice;
            break;
          case 'antara':
            matchHarga = item.harga >= minPrice && item.harga <= maxPrice;
            break;
          default:
            matchHarga = true;
        }
        
        return matchSearch && matchHarga;
      });
      document.getElementById('resultsCount').textContent = `${produkFiltered.length} produk ditemukan`;
      
      if (produkFiltered.length === 0) {
        productGrid.innerHTML = `
          <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>Tidak ditemukan produk yang sesuai</h3>
            <p>Coba gunakan kata kunci atau filter yang berbeda</p>
          </div>
        `;
        return;
      }

      produkFiltered.forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const totalStok = item.variasi ? item.variasi.reduce((total, variasi) => total + (variasi.stok || 0), 0) : 0;
        const totalTerjual = item.variasi ? item.variasi.reduce((total, variasi) => total + (variasi.terjual || 0), 0) : 0;
        
        const gambarSrc = item.gambar && (item.gambar.startsWith('data:image/') || item.gambar.startsWith('http'))
          ? item.gambar 
          : 'https://via.placeholder.com/300x180?text=Produk+Tidak+Tersedia';

        productCard.innerHTML = `
          <img src="${gambarSrc}" alt="${item.nama}" class="product-image" />
          <div class="product-body">
            <span class="product-category">${item.kategori || 'Uncategorized'}</span>
            <h3 class="product-title">${item.nama || 'Produk Tanpa Nama'}</h3>
            <p class="product-description">${potongDeskripsi(item.deskripsi)}</p>
            <div class="product-meta">
              <div><i class="fas fa-box"></i> ${totalStok} stok</div>
              <div><i class="fas fa-chart-line"></i> ${totalTerjual} terjual</div>
            </div>
            <div class="product-price">Rp ${item.harga ? item.harga.toLocaleString('id-ID') : '0'}</div>
          </div>
        `;

        productCard.onclick = () => {
          window.location.href = `detail.html?nama=${encodeURIComponent(item.nama)}`;
        };

        productGrid.appendChild(productCard);
      });
    });

    function removeSearch() {
      const params = new URLSearchParams(window.location.search);
      params.delete('q');
      window.location.search = params.toString();
    }

    function removePriceFilter() {
      const params = new URLSearchParams(window.location.search);
      params.delete('filterType');
      params.delete('minPrice');
      params.delete('maxPrice');
      window.location.search = params.toString();
    }

    document.getElementById('filterHarga').addEventListener('change', function() {
      const hargaMin = document.getElementById('hargaMin');
      const hargaMax = document.getElementById('hargaMax');
      
      hargaMin.classList.add('hidden');
      hargaMax.classList.add('hidden');
      
      switch(this.value) {
        case 'kurang':
        case 'lebih':
          hargaMin.classList.remove('hidden');
          break;
        case 'antara':
          hargaMin.classList.remove('hidden');
          hargaMax.classList.remove('hidden');
          break;
      }
    });

    document.getElementById('searchForm').addEventListener('submit', function(e) {
      const filterType = document.getElementById('filterHarga').value;
      const minPrice = document.getElementById('hargaMin');
      const maxPrice = document.getElementById('hargaMax');
      
      if (filterType === 'antara') {
        if (!minPrice.value || !maxPrice.value) {
          e.preventDefault();
          alert('Harap isi kedua nilai harga untuk filter rentang');
          return;
        }
        if (parseInt(minPrice.value) > parseInt(maxPrice.value)) {
          e.preventDefault();
          alert('Harga minimum tidak boleh lebih besar dari harga maksimum');
          return;
        }
      } else if ((filterType === 'kurang' || filterType === 'lebih') && !minPrice.value) {
        e.preventDefault();
        alert('Harap isi nilai harga');
        return;
      }
    });