# HANZZZ AI

Aplikasi chat web mobile-friendly dengan tema biru. HTML adalah antarmuka; `server.js` menyimpan API key di environment server dan menghubungkan chat ke OpenAI Responses API.

## Menjalankan di komputer

1. Pasang Node.js 18 atau lebih baru.
2. Atur API key sebagai environment variable. Jangan menaruh key asli ke `index.html` atau membagikannya.
   - Linux/macOS: `export OPENAI_API_KEY="API_KEY_KAMU"`
   - Windows PowerShell: `$env:OPENAI_API_KEY="API_KEY_KAMU"`
3. Jalankan `npm start`.
4. Buka `http://localhost:3000`.

Model default diatur melalui `OPENAI_MODEL` dan dapat diganti dengan model yang tersedia di akun API kamu.

## Penting tentang API key dan biaya

- ChatGPT Plus/Free dan OpenAI API adalah layanan penagihan terpisah; penggunaan API bisa memerlukan billing/kredit API.
- Jangan masukkan API key ke HTML, JavaScript browser, atau APK. Key disimpan di server sebagai `OPENAI_API_KEY`.
- Jika akan dipublikasikan, tambahkan autentikasi, pembatasan penggunaan, rate limiting, dan HTTPS.

## Menjadikan APK Android

Folder ini adalah aplikasi web, bukan APK siap instal. Untuk APK, host frontend/backend dengan aman lalu bungkus URL frontend menggunakan Android Studio WebView atau Capacitor. Jangan memasukkan API key ke APK. Server harus tetap online agar AI dapat menjawab.
