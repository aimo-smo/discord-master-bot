# 🤖 Discord Master Bot — بوت Discord متكامل

بوت Discord احترافي باللغة العربية مبني على **Discord.js v14**، يتضمن ألعاباً، اقتصاداً، تذاكر، إدارة، أذكار نصية وصوتية، وأكثر.

---

## 📋 المتطلبات

- **Node.js** 18 أو أحدث
- **npm** أو **yarn**
- حساب [Discord Developer Portal](https://discord.com/developers/applications)
- (اختياري) **FFmpeg** للأذكار الصوتية — يُثبّت تلقائياً عبر `ffmpeg-static`

---

## 🚀 التثبيت السريع

### 1. تثبيت الحزم

```bash
cd discord-master-bot
npm install
```

### 2. إعداد البوت في Discord Developer Portal

1. أنشئ تطبيقاً جديداً → **Bot** → انسخ **Token**
2. فعّل **Privileged Gateway Intents**:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
3. من **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Permissions: Administrator (للتطوير) أو الصلاحيات المطلوبة
4. انسخ **Application ID** (Client ID)

### 3. تعديل ملف `.env`

```env
DISCORD_TOKEN=توكن_البوت
CLIENT_ID=معرف_التطبيق
GUILD_ID=معرف_السيرفر
```

### 4. تسجيل الأوامر

```bash
npm run deploy
```

### 5. تشغيل البوت

```bash
npm start
```

للتطوير مع إعادة التشغيل التلقائي:

```bash
npm run dev
```

---

## 📁 هيكلة المشروع

```
discord-master-bot/
├── index.js              # نقطة الدخول + معالجة التفاعلات
├── config.js             # جميع الإعدادات (عدّل هنا)
├── deploy-commands.js    # تسجيل أوامر Slash
├── package.json
├── commands/             # أوامر Slash حسب الفئة
│   ├── games/            # ألعاب (تخمين، روليت، بلاك جاك...)
│   ├── economy/          # اقتصاد (رصيد، تحويل، بنك...)
│   ├── moderation/       # إدارة (حظر، كتم، قفل...)
│   ├── tickets/          # نظام التذاكر
│   ├── azkar/            # الأذكار النصية
│   ├── voice-azkar/      # الأذكار الصوتية
│   ├── shop/             # المتجر
│   ├── admin/            # إعدادات الإدارة
│   └── utility/          # مساعدة، ping، اقتراحات
├── events/               # أحداث Discord
├── buttons/              # معالجات الأزرار
├── selectMenus/          # القوائم المنسدلة
├── utils/                # أدوات مساعدة
│   ├── database.js       # قاعدة بيانات JSON + حفظ تلقائي
│   ├── azkarScheduler.js # جدولة الأذكار
│   ├── voiceAzkar.js     # مشغل الأذكار الصوتية
│   └── ...
└── database/
    ├── data.json         # البيانات (يُنشأ تلقائياً)
    ├── azkar-default.json # 100+ ذكر افتراضي
    └── voice-azkar.json  # مسارات MP3 الصوتية
```

---

## ⚙️ الإعداد من داخل Discord (بدون تعديل ملفات)

| الأمر | الوظيفة |
|-------|---------|
| `/setup` | عرض ما تم إعداده وما ينقص |
| `/setup-welcome` | قناة ترحيب + مغادرة + رتبة تلقائية |
| `/setup-logs` | قناة سجلات واحدة لكل الأحداث |
| `/ticket-setup` | لوحة التذاكر + رتبة دعم + سجل |
| `/set-azkar-channel` | قناة الأذكار النصية |

**كل الإعدادات تُحفظ تلقائياً** في `database/data.json`.

---

| الأمر | الوصف |
|-------|-------|
| `/daily` | الراتب اليومي |
| `/work` | العمل وكسب المال |
| `/rob` | محاولة السرقة |
| `/guess` + `/guess-number` | تخمين الرقم |
| `/trivia` + `/trivia-answer` | أسئلة وأجوبة |
| `/coinflip` | رمي العملة |
| `/roulette` | الروليت |
| `/slots` | ماكينة السلوت |
| `/blackjack` | بلاك جاك (أزرار) |
| `/balance` `/pay` `/deposit` `/withdraw` | الاقتصاد |
| `/level` `/leaderboard` `/points` | XP والمتصدرين |

---

## 🎫 نظام التذاكر

```
/ticket-setup channel:#لوحة category:#كاتيجوري-التذاكر
```

- أزرار: دعم فني | شراء | تعامل
- إغلاق + Transcript HTML
- إضافة/إزالة أعضاء
- حذف التذكرة

---

## 📿 نظام الأذكار النصية

| الأمر | الوصف |
|-------|-------|
| `/set-azkar-channel` | تحديد القناة |
| `/set-azkar-role` | رتبة المنشن |
| `/azkar-start` | تشغيل (كل ساعة / 3 ساعات / يومياً) |
| `/azkar-stop` | إيقاف |
| `/add-zikr` | إضافة ذكر مخصص |
| `/remove-zikr` | حذف ذكر |
| `/azkar-list` | عرض القائمة |

---

## 🎙️ نظام الأذكار الصوتية

1. ضع ملفات MP3 في `assets/voice-azkar/`
2. عدّل `database/voice-azkar.json`:

```json
{
  "default": ["assets/voice-azkar/zikr1.mp3"],
  "reciters": { "default": "القارئ الافتراضي" }
}
```

| الأمر | الوصف |
|-------|-------|
| `/set-azkar-voice-channel` | الروم الصوتي |
| `/join-azkar` | انضمام البوت |
| `/play-azkar` | تشغيل |
| `/stop-azkar` | إيقاف |
| `/leave-azkar` | مغادرة |
| `/volume` | مستوى الصوت (0-1) |
| `/set-reciter` | اختيار القارئ |

---

## 🛡️ الإدارة والسجلات

عدّل قنوات السجلات في `config.js` → `logs`:

```javascript
logs: {
  messageDelete: 'CHANNEL_ID',
  messageEdit: 'CHANNEL_ID',
  memberJoin: 'CHANNEL_ID',
  // ...
}
```

أوامر الإدارة: `/ban` `/kick` `/mute` `/timeout` `/warn` `/clear` `/lock` `/unlock` `/slowmode`

---

## 🛒 المتجر والرتب

```
/shop-add name:VIP role:@VIP price:5000
/shop
/buy item:1
/set-autorole role:@Member
/set-level-role level:5 role:@Active
```

---

## ⚡ التشغيل 24/7

للإنتاج، استخدم **PM2**:

```bash
npm install -g pm2
pm2 start index.js --name discord-bot
pm2 save
pm2 startup
```

---

## 🔧 التطوير

- أضف أمراً جديداً: أنشئ ملف `.js` في `commands/<category>/`
- صيغة الأمر:

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('وصف'),
  cooldown: 3, // اختياري
  async execute(interaction, client) {
    // client.db للبيانات
  },
};
```

- ثم: `npm run deploy` و `npm start`

---

## 📄 الترخيص

MIT — حر الاستخدام والتعديل.

---

**صنع بـ ❤️ — Discord Master Bot v1.0**
