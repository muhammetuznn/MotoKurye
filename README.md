# Kaçak Kurye: Son Paket

Bu klasördeki tasarım dokümanına göre hazırlanmış oynanabilir MVP prototipi.

## Çalıştırma

En pratik yol:

```bash
node server.cjs
```

Sonra tarayıcıda `http://127.0.0.1:4173/` adresini açın.

İsterseniz `index.html` dosyasını doğrudan tarayıcıda da açabilirsiniz. Oyun bağımlılıksız HTML, CSS ve Canvas ile çalışır.

## Kontrol

- Mouse/touch basılı tut: kurye yükselir.
- Bırak: kurye alçalır.
- Klavye: Space veya Yukarı ok.

## MVP Özellikleri

- Ana menü
- Tek dokunuş sonsuz kaçış oynanışı
- Mesafe skoru
- Coin toplama
- 7 engel/etki: araba kapısı, martı/leylek, kedi, çukur, zabıta bariyeri, kasis, yağmur bulutu
- Her 300 metrede teslimat noktası
- Teslimat bonusu ve combo çarpanı
- Oyun sonu ekranı
- Basit market ve 4 motor skini
- `localStorage` ile coin, en iyi skor ve seçili skin kaydı

## Faz 2 Ekleri

- Kask power-up: bir çarpmayı affeder.
- Turbo power-up: kısa süre hızı artırır.
- Manyetik çanta power-up: yakındaki coinleri kuryeye çeker.
- Yağmur bulutu: öldürmez, kısa süre hız ve kontrolü düşürür.
- Yakın sıyrılma bonusu: engele çok yakın geçince +2 coin verir.
- Daha yumuşak fizik, daha adil ilk saniyeler ve zorluk artışı.

## Rekor ve Motor Sistemi

- Mesafe rekoru ve paket rekoru `localStorage` içinde saklanır.
- Rekor tablosu en iyi 5 koşuyu paket sayısına, eşitlikte mesafeye göre sıralar.
- Motor kilitleri paket rekoruna göre açılır.
- Motorların `Hız` ve `Güç` değerleri oynanışı etkiler.
- Hız değeri genel akış hızını belirgin şekilde artırır ve HUD'da anlık km/s olarak görünür.
- Güç değeri basılı tutunca yukarı çıkış gücünü artırır.
- Yağmur motor hızını düşürür; bazı motorlarda yağmur direnci daha yüksektir.
- Motor kilit eşikleri daha uzun vadeli hedefler olacak şekilde ayarlandı.
- Oyun içi HUD mesafe, hız, paket sayısı ve coin bilgisini gösterir.
- Mobil dikey ekranda kamera daha yakın çalışır; oyun alanı minik kalmaz.
- Yol artık anında öldürmez; kurye yola inip sürer. Çukur, kasis, kedi ve bariyer gibi alt engeller bu yüzden gerçek engel olarak çalışır.

Motor görselleri için hazır dosya yolları:

- `Asssets/motors/motor-01.png`
- `Asssets/motors/motor-02.png`
- `Asssets/motors/motor-03.png`
- `Asssets/motors/motor-04.png`
- `Asssets/motors/motor-05.png`
- `Asssets/motors/motor-06.png`
- `Asssets/motors/motor-07.png`
- `Asssets/motors/motor-08.png`
- `Asssets/motors/motor-09.png`
- `Asssets/motors/motor-10.png`

Bu dosyalar yoksa market renkli placeholder gösterir. Dosyaları ekleyip sayfayı yenileyince otomatik görünür.

## Şehir Sistemi

- Şehir temaları marketten coin ile açılır.
- Market Windows/desktop görünümü için Motorlar ve Şehirler sekmelerine ayrılmıştır.
- Şehirler pahalıdır ve coin harcayarak satın alınır.
- Seçilen şehir arka plan paletini, skyline hissini, yol rengini ve ışık rengini değiştirir.
- Şehir görseli eklerseniz procedural arka plan yerine o görsel kullanılır.

Hazır şehir görsel yolları:

- `Asssets/cities/istanbul.png`
- `Asssets/cities/new-york.png`
- `Asssets/cities/mexico-city.png`
- `Asssets/cities/tokyo.png`
- `Asssets/cities/dubai.png`

## Asset Eşleşmesi

Oyun `Asssets` klasöründeki şu dosya adlarını doğrudan kullanır:

- `kurye.png`: oyuncu karakteri
- `araç.png`: açılan araba kapısı engeli
- `leylek.png`: uçan kuş engeli
- `kedi.png`: yola atlayan kedi
- `cukur.png`: çukur
- `zabıta.png`: zabıta bariyeri
- `tümsek.png`: kasis
- `teslimat.png`: teslimat noktası
- `bulut.png`: yağmur bulutu

Bu dosyaları aynı adlarla şeffaf PNG sürümleriyle değiştirirseniz kod tarafında ekstra değişiklik gerekmez.

Not: Mevcut assetler oyun performansı için 512x512 PNG olarak optimize edildi. Dama arka planlı ilk halleri `Asssets/originals_with_bg` klasöründe yedek durur.
