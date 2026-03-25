// Функция разблокировки
function unlockSystem() {
    const lock = document.getElementById('lock-screen');
    lock.classList.add('unlocked');
    
    // Играем приветственный звук Windows 12
    playSound('open');
    
    // Через секунду после анимации можно убрать элемент из DOM (опционально)
    setTimeout(() => {
        lock.style.display = 'none';
    }, 800);
}

// Обновление времени на экране блокировки
function updateLockTime() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    
    document.getElementById('lock-time').textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('lock-date').textContent = now.toLocaleDateString('ru-RU', options);
}

// Запускаем обновление времени для локскрина
setInterval(updateLockTime, 1000);
updateLockTime();
// === ИНИЦИАЛИЗАЦИЯ И ЧАСЫ ===
const updateDateTime = () => {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('date').textContent = now.toLocaleTimeString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).split(',')[0];
};
setInterval(updateDateTime, 1000);
updateDateTime();

// === ПЕРЕМЕННЫЕ ЭЛЕМЕНТОВ ===
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
const trayBtn = document.getElementById('tray-btn');
const actionCenter = document.getElementById('action-center');
const appWindow = document.getElementById('app-window');
const desktop = document.querySelector('.desktop');

// === ЛОГИКА МЕНЮ ПУСК И ЦЕНТРА УВЕДОМЛЕНИЙ ===
const toggleMenu = (menu, btn) => {
    menu.classList.toggle('active');
    // Эффект глубокого размытия рабочего стола при открытом меню
    if (menu.classList.contains('active')) {
        desktop.style.backdropFilter = 'blur(10px)';
    } else {
        desktop.style.backdropFilter = 'none';
    }
};

startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    actionCenter.classList.remove('active');
    toggleMenu(startMenu, startBtn);
});

trayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.remove('active');
    actionCenter.classList.toggle('active');
});

// Закрытие всего при клике по рабочему столу
document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && !actionCenter.contains(e.target)) {
        startMenu.classList.remove('active');
        actionCenter.classList.remove('active');
        desktop.style.backdropFilter = 'none';
    }
});

// === ФЕЙКОВЫЙ ИИ-ПОИСК ===
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const val = searchInput.value.toLowerCase();
        const aiResponse = document.querySelector('.section-recents h4');
        
        aiResponse.textContent = "AI анализирует...";
        setTimeout(() => {
            if (val.includes('погода')) aiResponse.textContent = "ИИ: Сегодня +24°C, идеально для прогулки.";
            else if (val.includes('файл')) aiResponse.textContent = "ИИ: Нашел 3 версии 'Отчет_Q3' в ProtoFS.";
            else aiResponse.textContent = "ИИ: Я готов помочь с '" + val + "'.";
        }, 1000);
    }
});

// === ПЕРЕТАСКИВАНИЕ ОКНА (DRAG & DROP) ===
let isDragging = false;
let offset = { x: 0, y: 0 };

const header = document.querySelector('.window-header');

header.addEventListener('mousedown', (e) => {
    if (e.target.closest('.win-btn')) return;
    isDragging = true;
    offset.x = e.clientX - appWindow.offsetLeft;
    offset.y = e.clientY - appWindow.offsetTop;
    appWindow.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    appWindow.style.left = `${e.clientX - offset.x}px`;
    appWindow.style.top = `${e.clientY - offset.y}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    appWindow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
});

// === СИСТЕМНЫЕ ЗВУКИ (Синтезированные) ===
const playSound = (type) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'open') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    } else if (type === 'click') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    }
    
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
};

// === УПРАВЛЕНИЕ ОКНАМИ (Скрытие/Открытие) ===
const toggleApp = (id) => {
    const win = document.getElementById(id);
    if (win.classList.contains('hidden') || win.classList.contains('minimized')) {
        win.classList.remove('hidden', 'minimized');
        playSound('open');
    } else {
        win.classList.add('minimized');
        playSound('click');
    }
};

const closeApp = (id) => {
    document.getElementById(id).classList.add('hidden');
    playSound('click');
};

// При клике на иконку в таскбаре — переключаем видимость
document.querySelector('.taskbar-center .task-icon:first-child').onclick = () => {
    if (appWindow.classList.contains('hidden')) openApp();
    else closeApp();
};
