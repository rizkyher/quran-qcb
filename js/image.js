document.addEventListener('DOMContentLoaded', function() {
    // Pastikan DOM sudah siap sebelum menjalankan kode ini
  
    // Cari elemen dengan id "page"
    var pageElement = document.getElementById('page');
  
    // Buat elemen gambar baru
    var newImage = document.createElement('img');
    newImage.src = 'img/174.jpg'; // Ganti dengan path gambar yang diinginkan
    newImage.className = 'img-fluid'; // Tambahkan kelas Bootstrap untuk responsif
    newImage.alt = 'Responsive image'; // Tambahkan teks alternatif untuk gambar
  
    // Tambahkan gambar ke dalam elemen dengan id "page"
    pageElement.appendChild(newImage);
  });
  