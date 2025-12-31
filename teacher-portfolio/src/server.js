const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// إعداد CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// جميع المسارات ترجع index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// بدء السيرفر
app.listen(PORT, () => {
    console.log(`
    🎓 ملف إنجاز المعلمة فريال الغماري
    🚀 السيرفر يعمل على البورت: ${PORT}
    🌐 الرابط: http://localhost:${PORT}
    ⏰ الوقت: ${new Date().toLocaleString('ar-SA')}
    `);
});
