# Play Store Paketleme

Bu proje Capacitor ile Android uygulamasına sarılır. Play Store'a yüklemek için `.aab` üretmek gerekir.

## Gerekenler

- Android Studio veya JDK 17
- Android SDK
- Node.js

Bu makinede Java bulunuyor ve debug Android derlemesi çalışıyor. Release AAB üretimi için ayrıca imzalama dosyaları gerekir.

## Geliştirme APK

```powershell
npm install
npm run android:debug
```

Çıktı:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Play Store AAB

Önce release keystore oluştur:

```powershell
keytool -genkeypair -v -keystore android/kacak-kurye-release.jks -alias kacak-kurye -keyalg RSA -keysize 2048 -validity 10000
```

Sonra `android/keystore.properties` dosyasını oluştur:

```properties
storeFile=kacak-kurye-release.jks
storePassword=BURAYA_SIFRE
keyAlias=kacak-kurye
keyPassword=BURAYA_SIFRE
```

Release AAB üret:

```powershell
npm run android:bundle
```

Çıktı:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Release imzalama eksikse build bilerek durur ve `android/keystore.properties` dosyasını tamamlamanı ister.

`keystore.properties` ve `.jks` dosyaları `.gitignore` içindedir; repoya eklenmemelidir.

## Yayın Notları

- Paket adı: `com.kacakkurye.sonpaket`
- Uygulama adı: `Kaçak Kurye`
- Target SDK: 35
- Android yedekleme kapalıdır; oyun kayıtları ve ayarlar cihaz dışına otomatik taşınmaz.
- Cleartext network trafiği kapalıdır.
