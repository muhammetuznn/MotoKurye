# Play Store Paketleme

Bu proje Capacitor ile Android uygulamasına sarılır. Play Store'a yüklemek için `.aab` üretmek gerekir.

## Gerekenler

- Android Studio veya JDK 17
- Android SDK
- Node.js

Bu makinede şu an `JAVA_HOME` ayarlı olmadığı için Gradle derlemesi çalışmaz. Android Studio kuruluysa `JAVA_HOME` değerini Android Studio içindeki `jbr` klasörüne ver.

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

`keystore.properties` ve `.jks` dosyaları `.gitignore` içindedir; repoya eklenmemelidir.
