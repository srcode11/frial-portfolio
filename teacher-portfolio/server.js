const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ مهم: تحديد المسار الصحيح للملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// ✅ إضافة middleware لمعالجة JSON
app.use(express.json());

// ✅ مسار للصحة (Health Check) - مهم لـ Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Teacher Portfolio is running',
        timestamp: new Date().toISOString()
    });
});

// ✅ جميع المسارات الأخرى ترجع index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ معالجة الأخطاء
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).send('حدث خطأ في السيرفر');
});

// ✅ بدء السيرفر
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ============================================
    🚀 Teacher Portfolio Server Started!
    📡 Port: ${PORT}
    🌐 URL: http://localhost:${PORT}
    📂 Public: ${path.join(__dirname, 'public')}
    ⏰ Time: ${new Date().toLocaleString('ar-SA')}
    ============================================
    `);
    
    // ✅ التحقق من وجود الملفات الأساسية
    const fs = require('fs');
    const files = ['index.html', 'style.css', 'script.js'];
    files.forEach(file => {
        const filePath = path.join(__dirname, 'public', file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ ${file} موجود`);
        } else {
            console.log(`❌ ${file} غير موجود!`);
        }
    });
});
