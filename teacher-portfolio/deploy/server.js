const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد static files من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// جميع المسارات ترجع index.html (للتطبيق ذو الصفحة الواحدة)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// بدء السيرفر
app.listen(PORT, () => {
    console.log(`
    ===========================================
    🚀 ملف إنجاز المعلمة فريال الغماري
    🌐 الموقع يعمل على: http://localhost:${PORT}
    ⏰ الوقت: ${new Date().toLocaleString('ar-SA')}
    ===========================================
    `);
});
