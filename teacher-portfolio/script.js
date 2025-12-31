// Teacher Portfolio App - Render Version
console.log('📚 Teacher Portfolio App Loaded');

// App State
let appState = {
    isOnline: false,
    currentTab: 'dashboard',
    portfolioData: {
        arabic: [],
        english: [],
        quran: [],
        math: [],
        science: [],
        activities: []
    }
};

// Initialize App
function initApp() {
    console.log('🚀 Initializing application...');
    
    // Load data
    loadData();
    
    // Setup UI
    setupUI();
    
    // Show dashboard
    showDashboard();
    
    console.log('✅ Application ready');
}

// Load Data
async function loadData() {
    console.log('📥 Loading data...');
    
    try {
        // Try Firebase first
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            const db = firebase.firestore();
            const doc = await db.collection('portfolio').doc('data').get();
            
            if (doc.exists) {
                appState.portfolioData = doc.data();
                appState.isOnline = true;
                showToast('تم تحميل البيانات من السحابة', 'success');
            } else {
                // Create new
                await db.collection('portfolio').doc('data').set(appState.portfolioData);
                showToast('تم إنشاء ملف جديد', 'info');
            }
        } else {
            throw new Error('Firebase not available');
        }
    } catch (error) {
        console.warn('Using local storage:', error);
        
        // Try local storage
        const saved = localStorage.getItem('teacherPortfolio');
        if (saved) {
            appState.portfolioData = JSON.parse(saved);
            showToast('تم تحميل البيانات من التخزين المحلي', 'info');
        }
    }
    
    updateStats();
}

// Setup UI
function setupUI() {
    // Add event listeners for navigation
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-tab]')) {
            const tab = e.target.closest('[data-tab]').getAttribute('data-tab');
            switchTab(tab);
        }
        
        if (e.target.closest('[data-action="add"]')) {
            const subject = e.target.closest('[data-action="add"]').getAttribute('data-subject') || 'arabic';
            showAddModal(subject);
        }
    });
}

// Show Dashboard
function showDashboard() {
    const container = document.querySelector('.main-container');
    
    container.innerHTML = `
        <div class="fade-in">
            <div class="content-header">
                <h1><i class="fas fa-home"></i> ملف إنجاز المعلمة فريال الغماري</h1>
                <p class="text-muted">نظام إلكتروني متكامل لإدارة ملف الإنجاز</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="totalItems">0</h3>
                        <p>إجمالي العناصر</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-images"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="totalImages">0</h3>
                        <p>عدد الصور</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="subjectCount">6</h3>
                        <p>عدد المواد</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="completionRate">0%</h3>
                        <p>معدل الإنجاز</p>
                    </div>
                </div>
            </div>
            
            <div class="card mt-2">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-bolt"></i>
                        إجراءات سريعة
                    </h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <button class="btn btn-primary" data-tab="fullPortfolio">
                            <i class="fas fa-book-open"></i>
                            الملف الكامل
                        </button>
                        
                        <button class="btn btn-success" data-action="add" data-subject="arabic">
                            <i class="fas fa-plus"></i>
                            إضافة حرف عربي
                        </button>
                        
                        <button class="btn btn-success" data-action="add" data-subject="english">
                            <i class="fas fa-plus"></i>
                            إضافة كلمة إنجليزية
                        </button>
                        
                        <button class="btn btn-secondary" onclick="showPrintModal()">
                            <i class="fas fa-print"></i>
                            طباعة الملف
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="card mt-2">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-th-large"></i>
                        المواد الدراسية
                    </h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        ${createSubjectCards()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    updateStats();
}

// Create Subject Cards
function createSubjectCards() {
    const subjects = [
        { id: 'arabic', name: 'اللغة العربية', icon: 'fas fa-font', color: '#4A6FA5' },
        { id: 'english', name: 'الإنجليزية', icon: 'fas fa-language', color: '#8A6FA5' },
        { id: 'quran', name: 'القرآن الكريم', icon: 'fas fa-book-quran', color: '#27ae60' },
        { id: 'math', name: 'الرياضيات', icon: 'fas fa-calculator', color: '#e74c3c' },
        { id: 'science', name: 'العلوم', icon: 'fas fa-flask', color: '#3498db' },
        { id: 'activities', name: 'النشاطات', icon: 'fas fa-chalkboard', color: '#f39c12' }
    ];
    
    return subjects.map(subject => {
        const count = appState.portfolioData[subject.id]?.length || 0;
        
        return `
            <div class="subject-card" style="
                background: white;
                border-radius: var(--border-radius);
                padding: 1.5rem;
                border: 2px solid ${subject.color}20;
                cursor: pointer;
                transition: var(--transition);
            " data-tab="${subject.id}">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div style="
                        width: 50px;
                        height: 50px;
                        border-radius: var(--border-radius);
                        background: ${subject.color};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1.3rem;
                    ">
                        <i class="${subject.icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="color: var(--text-primary); margin-bottom: 0.25rem;">${subject.name}</h4>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">${count} عنصر</p>
                    </div>
                </div>
                <button class="btn w-full" data-action="add" data-subject="${subject.id}" 
                        style="background: ${subject.color}20; color: ${subject.color}; border: none;">
                    <i class="fas fa-plus"></i>
                    إضافة جديد
                </button>
            </div>
        `;
    }).join('');
}

// Update Stats
function updateStats() {
    const totalItems = Object.values(appState.portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(appState.portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    if (document.getElementById('totalItems')) {
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalImages').textContent = totalImages;
        document.getElementById('completionRate').textContent = `${Math.min(100, totalItems * 5)}%`;
    }
}

// Switch Tab
function switchTab(tabId) {
    console.log(`🔄 Switching to: ${tabId}`);
    appState.currentTab = tabId;
    
    if (tabId === 'fullPortfolio') {
        showFullPortfolio();
    } else if (['arabic', 'english', 'quran', 'math', 'science', 'activities'].includes(tabId)) {
        showSubject(tabId);
    } else {
        showDashboard();
    }
}

// Show Full Portfolio
function showFullPortfolio() {
    const container = document.querySelector('.main-container');
    
    let content = `
        <div class="fade-in">
            <div class="content-header">
                <h1><i class="fas fa-book-open"></i> الملف الكامل</h1>
                <p class="text-muted">عرض جميع المواد في صفحة واحدة</p>
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="printFullPortfolio()">
                        <i class="fas fa-print"></i>
                        طباعة الكل
                    </button>
                    <button class="btn btn-secondary" onclick="exportFullPortfolio()">
                        <i class="fas fa-download"></i>
                        تصدير البيانات
                    </button>
                    <button class="btn" onclick="showDashboard()" style="background: var(--bg-tertiary);">
                        <i class="fas fa-arrow-right"></i>
                        العودة
                    </button>
                </div>
            </div>
    `;
    
    Object.keys(appState.portfolioData).forEach(subject => {
        const items = appState.portfolioData[subject];
        if (items.length === 0) return;
        
        const subjectName = getSubjectName(subject);
        const subjectIcon = getSubjectIcon(subject);
        
        content += `
            <div class="card mt-2">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="${subjectIcon}"></i>
                        ${subjectName} (${items.length})
                    </h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; gap: 1rem;">
        `;
        
        items.forEach(item => {
            const title = item.letter || item.surah || item.concept || item.title || 'عنصر';
            const date = item.date || 'بدون تاريخ';
            
            content += `
                <div style="
                    padding: 1rem;
                    background: var(--bg-tertiary);
                    border-radius: var(--border-radius-sm);
                    border-left: 4px solid var(--primary);
                ">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <strong style="color: var(--text-primary);">${title}</strong>
                        <span style="color: var(--text-muted); font-size: 0.9rem;">${date}</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                        ${item.description || 'لا يوجد وصف'}
                    </p>
                    ${item.images && item.images.length > 0 ? `
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            ${item.images.map(img => `
                                <img src="${img}" 
                                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; cursor: pointer;"
                                     onclick="viewImage('${img}')"
                                     alt="صورة">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        content += `
                    </div>
                </div>
            </div>
        `;
    });
    
    content += `</div>`;
    container.innerHTML = content;
}

// Helper Functions
function getSubjectName(subject) {
    const names = {
        arabic: 'اللغة العربية',
        english: 'اللغة الإنجليزية',
        quran: 'القرآن الكريم',
        math: 'الرياضيات',
        science: 'العلوم',
        activities: 'النشاطات'
    };
    return names[subject] || subject;
}

function getSubjectIcon(subject) {
    const icons = {
        arabic: 'fas fa-font',
        english: 'fas fa-language',
        quran: 'fas fa-book-quran',
        math: 'fas fa-calculator',
        science: 'fas fa-flask',
        activities: 'fas fa-chalkboard'
    };
    return icons[subject] || 'fas fa-file';
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius-sm);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        ">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make functions available globally
window.initApp = initApp;
window.switchTab = switchTab;
window.showDashboard = showDashboard;
window.showFullPortfolio = showFullPortfolio;
window.showToast = showToast;
