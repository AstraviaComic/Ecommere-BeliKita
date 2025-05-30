let produk = JSON.parse(localStorage.getItem("produk")) || [];
    let editIndex = null;
    let variasiSementara = [];
    let gambarBase64 = null;

    // Event listener untuk preview gambar
    document.getElementById('gambar').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
          gambarBase64 = event.target.result;
          const preview = document.getElementById('imagePreview');
          preview.src = gambarBase64;
          preview.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
      }
    });

    function simpanProduk() {
      const nama = document.getElementById("nama").value.trim();
      const deskripsi = document.getElementById("deskripsi").value.trim();
      const harga = parseInt(document.getElementById("harga").value);
      const kategori = document.getElementById("kategori").value.trim();
      const stok = variasiSementara.reduce((a, b) => a + b.stok, 0);

      if (!nama || isNaN(harga) || !kategori || variasiSementara.length === 0) {
        alert("Isi semua data produk dan setidaknya satu variasi.");
        return;
      }

      // Default terjual 0 untuk semua variasi baru
      const variasiDenganTerjual = variasiSementara.map(v => ({
        ...v,
        terjual: v.terjual !== undefined ? v.terjual : 0
      }));

      const item = { 
        nama, 
        deskripsi, 
        harga, 
        stok, 
        kategori, 
        gambar: gambarBase64,
        terjual: variasiDenganTerjual.reduce((a,b) => a + b.terjual, 0), 
        variasi: variasiDenganTerjual 
      };

      if (editIndex !== null) {
        produk[editIndex] = item;
        editIndex = null;
      } else {
        produk.push(item);
      }

      localStorage.setItem("produk", JSON.stringify(produk));
      resetForm();
      tampilkanProduk();
    }

    function resetForm() {
      document.getElementById("nama").value = "";
      document.getElementById("deskripsi").value = "";
      document.getElementById("harga").value = "";
      document.getElementById("kategori").value = "";
      document.getElementById("gambar").value = "";
      document.getElementById("namaVariasi").value = "";
      document.getElementById("stokVariasi").value = "";
      document.getElementById("daftarVariasi").innerHTML = "";
      document.getElementById("imagePreview").style.display = "none";
      variasiSementara = [];
      gambarBase64 = null;
      editIndex = null;
    }

    function tampilkanProduk() {
      const tbody = document.getElementById("tabelProduk");
      tbody.innerHTML = "";

      produk.forEach((item, i) => {
        let opsiVariasi = `<option value="semua">Semua</option>`;
        item.variasi.forEach(v => {
          opsiVariasi += `<option value="${v.nama}">${v.nama}</option>`;
        });

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><img src="${item.gambar}" onerror="this.src='https://via.placeholder.com/40'" style="max-width: 40px; max-height: 40px;" /></td>
          <td>${item.nama}</td>
          <td>${item.kategori}</td>
          <td>Rp ${item.harga.toLocaleString()}</td>
          <td>
            <select id="filterVariasi-${i}" class="variase-filter" onchange="updateRowProduk(${i})">
              ${opsiVariasi}
            </select>
          </td>
          <td id="stokProduk-${i}">${item.stok}</td>
          <td id="terjualProduk-${i}">${item.terjual}</td>
          <td>
            <button class="aksi-btn edit" onclick="editProduk(${i})">Edit</button>
            <button class="aksi-btn hapus" onclick="hapusProduk(${i})">Hapus</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      produk.forEach((_, i) => updateRowProduk(i));
    }

    function editProduk(i) {
      const item = produk[i];
      document.getElementById("nama").value = item.nama;
      document.getElementById("deskripsi").value = item.deskripsi;
      document.getElementById("harga").value = item.harga;
      document.getElementById("kategori").value = item.kategori;
      
      // Set gambar preview jika ada
      if (item.gambar) {
        gambarBase64 = item.gambar;
        const preview = document.getElementById('imagePreview');
        preview.src = gambarBase64;
        preview.style.display = 'block';
      }
      
      variasiSementara = [...item.variasi];
      tampilkanDaftarVariasi();
      editIndex = i;
      
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Fungsi-fungsi lainnya tetap sama (tambahVariasi, tampilkanDaftarVariasi, hapusVariasi, updateRowProduk, hapusProduk)
    function tambahVariasi() {
      const nama = document.getElementById("namaVariasi").value.trim();
      const stok = parseInt(document.getElementById("stokVariasi").value);
      if (!nama || isNaN(stok)) return alert("Isi variasi dan stok");

      variasiSementara.push({ nama, stok });
      tampilkanDaftarVariasi();
      document.getElementById("namaVariasi").value = "";
      document.getElementById("stokVariasi").value = "";
    }

    function tampilkanDaftarVariasi() {
      const ul = document.getElementById("daftarVariasi");
      ul.innerHTML = "";
      variasiSementara.forEach((v, i) => {
        const li = document.createElement("li");
        li.innerHTML = `${v.nama} - Stok: ${v.stok}`;
        
        const delBtn = document.createElement("button");
        delBtn.innerHTML = "❌";
        delBtn.onclick = () => hapusVariasi(i);
        
        li.appendChild(delBtn);
        ul.appendChild(li);
      });
    }

    function hapusVariasi(i) {
      variasiSementara.splice(i, 1);
      tampilkanDaftarVariasi();
    }

    function updateRowProduk(index) {
      const filterSelect = document.getElementById(`filterVariasi-${index}`);
      const filter = filterSelect.value;

      const produkItem = produk[index];
      let stokFiltered = 0;
      let terjualFiltered = 0;

      if(filter === "semua") {
        stokFiltered = produkItem.variasi.reduce((a, b) => a + b.stok, 0);
        terjualFiltered = produkItem.variasi.reduce((a, b) => a + (b.terjual || 0), 0);
      } else {
        const varFiltered = produkItem.variasi.find(v => v.nama === filter);
        stokFiltered = varFiltered ? varFiltered.stok : 0;
        terjualFiltered = varFiltered ? varFiltered.terjual || 0 : 0;
      }

      document.getElementById(`stokProduk-${index}`).textContent = stokFiltered;
      document.getElementById(`terjualProduk-${index}`).textContent = terjualFiltered;
    }

    function hapusProduk(i) {
      if (confirm("Yakin ingin hapus produk ini?")) {
        produk.splice(i, 1);
        localStorage.setItem("produk", JSON.stringify(produk));
        tampilkanProduk();
      }
    }

    tampilkanProduk();