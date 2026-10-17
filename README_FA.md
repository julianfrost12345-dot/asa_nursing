# ASA Nursing — دستیار ارزیابی پرستاری
**نسخه 1.1.0 | تیم سازنده ASA**

## پشتیبانی
- Android **14 و بالاتر** (`minSdk 34`)
- تنظیمات ساخت: `compileSdk 36`، `targetSdk 36` (Android 16)، Java 17، Android Gradle Plugin 8.10.1، Gradle 8.11.1
- برای گوشی‌های **Samsung Galaxy** با One UI و **Xiaomi / Redmi / POCO** با HyperOS/MIUI طراحی شده است؛ تأیید عملکرد روی مدل واقعی پس از ساخت و تست ممکن است.
- برنامه فارسی، راست‌چین و آفلاین است و دسترسی اینترنت یا اطلاعات شخصی بیمار نمی‌خواهد.
- هم‌پوشانی محتوا با نوار وضعیت و ناوبری در Android 15 و 16 از طریق WindowInsets مدیریت می‌شود.

## قابلیت‌ها
- دو گزینه در صفحه اصلی: «جستجوی تست» و «لیست تست‌ها»
- تست‌های ده‌گانه: Braden، Morse، GCS، NRS، RASS، CPOT، FLACC، Apgar، 4AT و Barthel
- نمایش سؤال‌ها به ترتیب، پاسخ‌گیری با گزینه‌های **مختص هر تست**، بازگشت به پاسخ قبلی و جلوگیری از رد سؤال بدون پاسخ
- جمع امتیاز و نمایش نتیجه همراه با پیشنهادهای مراقبتی و جزئیات امتیازها
- صفحه نتیجه و پیوند مرجع علمی هر تست

> مقیاس‌های بالینی همگی امتیاز ۱ تا ۴ ندارند و نباید امتیازدهی آن‌ها یکسان‌سازی شود. نسخه موجود یک نمونه **آموزشی** است. منابع PDF ارسالی نام و کاربرد تست‌ها را ارائه کرده‌اند، نه متن استاندارد همه پرسش‌ها و نه پروتکل جامع مراقبت. بنابراین برای استفاده بالینی یا انتشار رسمی، صحت ترجمه و امتیازدهی و آستانه‌ها را کارشناس بالینی بررسی کند. هیچ داده هویتی بیماری ذخیره نکنید.

## ۱. گرفتن APK از طریق GitHub Actions (بدون نصب Android Studio)
۱. در https://github.com یک حساب بسازید یا وارد شوید و یک مخزن جدید ایجاد کنید (ترجیحاً **Private**).
۲. فایل ZIP پروژه را **استخراج (Extract)** کنید. *خود فایل ZIP را بدون استخراج آپلود نکنید*.
۳. با GitHub Desktop یا Git پروژه را در ریشه مخزن Push کنید؛ دقت کنید پوشه پنهان `.github/workflows` هم منتقل شود.
۴. به تب **Actions** مخزن بروید؛ گردش‌کار **Build ASA Nursing APK** را انتخاب کنید و **Run workflow** را بزنید (یا بعد از Push به شاخه main به‌صورت خودکار اجرا می‌شود).
۵. پس از موفقیت اجرا، در قسمت **Artifacts** روی `ASA-Nursing-Android14Plus-installable-APK` بزنید؛ فایل ZIP خروجی را دانلود و استخراج کنید.
۶. فایل درون ZIP به نام **app-debug.apk** قابل نصب روی گوشی خواهد بود.

`app-debug.apk` به‌صورت خودکار با کلید تست Gradle امضا می‌شود و برای **آزمایش خصوصی** مناسب است، نه انتشار در Google Play. هر اجرای جداگانه CI ممکن است کلید امضای تست جدیدی بسازد و نصب آپدیت روی نسخه قبلی خطای «App not installed» بدهد؛ در این وضعیت باید قبلی را حذف کنید یا برای انتشار پایدار Release امضاشده با کلید ثابت بسازید.

## ۲. گرفتن APK با Android Studio
۱. Android Studio و Android SDK Platform 36 و Build Tools 36.0.0 را نصب کنید.
۲. پوشه `ASA_Nursing_Android14Plus` را با **Open** باز کنید. Gradle Sync انجام دهید.
۳. از منوی **Build > Generate Bundle(s) / APK(s) > Generate APK(s)** یا **Build > Build APK(s)** استفاده کنید (بسته به نسخه Android Studio).
۴. فایل خروجی در `app/build/outputs/apk/debug/app-debug.apk` قرار می‌گیرد.
۵. برای خط فرمان در ریشه پروژه: `gradle :app:assembleDebug` با Gradle 8.11.1 و SDK نصب‌شده.

**وضعیت تحویل:** این پوشه **پروژه منبع قابل ساخت** است، نه یک APK ازپیش‌ساخته؛ APK باید در محیطی دارای Android SDK و Gradle با موفقیت کامپایل شود. در محیط تولید این بسته، کامپایل اندروید و تست روی گوشی واقعی ممکن نبوده است.

## ۳. نصب روی گوشی Samsung Galaxy (Android 14+)
۱. فایل **app-debug.apk** حاصل از ساخت را از طریق USB یا دانلود روی گوشی منتقل کنید.
۲. در `Settings > Security and privacy > More security settings > Install unknown apps` برنامه‌ای را که فایل را باز می‌کند (مثل My Files یا Chrome) انتخاب کرده و **Allow from this source** را فعال کنید.
۳. اگر **Auto Blocker** نصب را مسدود می‌کند، فقط پس از اعتماد به فایل، در `Settings > Security and privacy > Auto Blocker` آن را **موقتاً** غیرفعال کنید.
۴. APK را باز کنید و **Install** بزنید؛ سپس مجوز نصب از منابع ناشناس را دوباره خاموش و Auto Blocker را فعال کنید.

## ۴. نصب روی گوشی Xiaomi / Redmi / POCO (Android 14+)
۱. فایل **app-debug.apk** را روی گوشی منتقل کنید.
۲. در تنظیمات عبارت **Install unknown apps** را جستجو کنید. بسته به نسخه HyperOS مسیر می‌تواند شبیه `Settings > Additional settings > Privacy > Special app access > Install unknown apps` باشد.
۳. برای Chrome یا File Manager که از طریق آن APK را باز می‌کنید، **Allow from this source** را روشن کنید.
۴. APK را باز کرده و Install کنید؛ پس از پایان کار، مجوز استثنا را غیرفعال کنید.

**نکته ایمنی:** هشدار امنیتی Play Protect را بدون بررسی اصالت فایل نادیده نگیرید؛ از APK ساخته‌شده از همین سورس معتبر خود استفاده کنید.

## ۵. استفاده از برنامه
صفحه اصلی → «جستجوی تست» یا «لیست تست‌ها» → انتخاب آزمون → مطالعه راهنمای آن → شروع ارزیابی → انتخاب پاسخ هر سؤال و «بعدی» → مشاهده امتیاز نهایی، تفسیر آموزشی و پیشنهادهای مراقبتی. گزینه «ارزیابی دوباره» برای شروع مجدد است.

## ۶. تست‌ها و بازبینی
در پوشه پروژه دستور `node tools/validate.js` امتیاز کمینه/بیشینه و ساختار ۱۰ تست را اعتبارسنجی می‌کند؛ این آزمون به معنای تأیید پزشکی یا آزمون عملکرد روی موبایل نیست.

## فایل‌های مهم
- `app/src/main/assets/tests.js`: ۱۰ تست، سؤال‌ها، وزن امتیازها و منابع
- `app/src/main/assets/app.js`: موتور تست، جمع نمره، تفسیر و توصیه‌های آموزشی
- `app/src/main/assets/style.css`: ظاهر فارسی
- `app/src/main/assets/index.html`: رابط کاربری
- `app/src/main/java/ir/asa/nursing/MainActivity.java`: پوسته WebView اندروید
- `app/src/main/AndroidManifest.xml`: تنظیمات بسته و دسترسی‌ها
- `.github/workflows/build-apk.yml`: فرآیند تولید APK آزمایشی در GitHub

## منابع فنی نصب و ساخت
- مستندات رسمی ساخت APK: https://developer.android.com/build/building-cmdline
- مستندات SDK اندروید ۱۶: https://developer.android.com/about/versions/16/setup-sdk
- Samsung Auto Blocker: https://www.samsung.com/us/support/answer/ANS10003636/
- Xiaomi unknown apps: https://www.mi.com/uk/support/faq/details/KA-06974/