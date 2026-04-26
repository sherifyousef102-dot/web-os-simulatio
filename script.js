// نظام السحب (Drag & Drop)
interact('.draggable').draggable({
    allowFrom: '.handle',
    listeners: {
        move (event) {
            var target = event.target
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
        }
    }
});

// الدخول
function login() {
    if(document.getElementById('pass').value === "123") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('os-root').style.display = 'block';
    }
}

// كليك يمين
function openMenu(e) {
    e.preventDefault();
    const m = document.getElementById('ctx-menu');
    m.style.display = 'block'; m.style.left = e.pageX + 'px'; m.style.top = e.pageY + 'px';
}
function closeMenu() { document.getElementById('ctx-menu').style.display = 'none'; }

// تشغيل الـ Start
function toggleStart(e) {
    e.stopPropagation();
    const menu = document.getElementById('start-menu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

// قفل الـ Start عند الضغط في أي مكان آخر
document.addEventListener('click', () => {
    document.getElementById('start-menu').style.display = 'none';
});

// تغيير الخلفية بصورة من الجهاز
function changeBg() { document.getElementById('bg-input').click(); closeMenu(); }
function loadCustomBg(input) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const root = document.getElementById('os-root');
        root.style.backgroundImage = `url(${e.target.result})`;
        root.style.backgroundSize = 'cover';
        root.style.backgroundPosition = 'center';
    };
    reader.readAsDataURL(input.files[0]);
}

// فايل سيستم (إضافة مجلد)
function addFolder() {
    const name = prompt("Enter folder name:");
    if(name) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `<i class="fa-solid fa-folder"></i><span>${name}</span>`;
        document.getElementById('file-system').appendChild(item);
    }
}

// تيرمينال
document.getElementById('term-in').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        const cmd = e.target.value.toLowerCase().trim();
        const out = document.getElementById('term-out');
        let res = "";
        if(cmd === 'help') res = "Commands: cls, date, status, whoami";
        else if(cmd === 'cls') { out.innerHTML = ""; e.target.value = ""; return; }
        else if(cmd === 'date') res = new Date().toLocaleString();
        else if(cmd === 'status') res = "Quantum OS 1.0.5: All systems active.";
        else if(cmd === 'whoami') res = "Admin_User";
        else if(cmd !== "") res = `'${cmd}' is not recognized.`;
        
        out.innerHTML += `<div>C:\\> ${cmd}</div><div>${res}</div><br>`;
        e.target.value = "";
    }
});

// آلة حاسبة
let calcExp = "";
function press(v) {
    const d = document.getElementById('calc-display');
    if(v === '=') { try { d.value = eval(calcExp); calcExp = d.value; } catch { d.value = "Error"; } }
    else if(v === 'C') { calcExp = ""; d.value = "0"; }
    else { calcExp += v; d.value = calcExp; }
}

// تحديثات شريط المهام (ساعة، بطارية، واي فاي)
setInterval(() => {
    const now = new Date();
    document.getElementById('clock-val').innerText = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    document.getElementById('date-val').innerText = now.toLocaleDateString();
    
    navigator.getBattery?.().then(b => {
        document.getElementById('batt-info').innerText = Math.round(b.level * 100) + "%";
    });

    document.getElementById('wifi-ico').className = navigator.onLine ? "fa-solid fa-wifi" : "fa-solid fa-wifi-slash";
    document.getElementById('temp').innerText = (28 + Math.floor(Math.random()*5)) + "°C";
}, 1000);

// وظائف عامة
function openApp(id) { document.getElementById(id).style.display = 'flex'; }
function closeApp(id) { document.getElementById(id).style.display = 'none'; }

function takeScreenshot() {
    html2canvas(document.body).then(canvas => {
        const link = document.createElement('a');
        link.download = 'quantum_os_shot.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function searchApps(q) {
    const apps = document.querySelectorAll('.app-icon');
    apps.forEach(app => {
        app.style.opacity = app.innerText.toLowerCase().includes(q.toLowerCase()) ? "1" : "0.2";
    });
}
// دالة إضافة فولدر جديد مع زر الحذف
function addNewFolder() {
    const folderName = prompt("اسم المجلد الجديد:", "New Folder");
    if (folderName) {
        const grid = document.getElementById('file-grid');
        const id = 'f-' + Date.now();
        const div = document.createElement('div');
        div.className = 'file-item';
        div.id = id;
        div.style.position = 'relative';
        div.innerHTML = `
            <button onclick="document.getElementById('${id}').remove()" style="position: absolute; top: -5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 18px; height: 18px; cursor: pointer; font-size: 10px; z-index: 10;">x</button>
            <i class="fa-solid fa-folder" style="font-size: 24px; color: #f1c40f; display: block;"></i>
            <span style="font-size: 10px;">${folderName}</span>
        `;
        grid.appendChild(div);
    }
}

// دالة فتح ملفات جهازك (Desktop) وعرضها
function loadFromLocalDevice(input) {
    const grid = document.getElementById('file-grid');
    const files = input.files;
    
    for (let i = 0; i < Math.min(files.length, 15); i++) {
        const id = 'file-' + i + Date.now();
        const div = document.createElement('div');
        div.className = 'file-item';
        div.id = id;
        div.style.position = 'relative';
        
        const icon = files[i].type.startsWith('image/') ? 'fa-file-image' : 'fa-file';
        
        div.innerHTML = `
            <button onclick="document.getElementById('${id}').remove()" style="position: absolute; top: -5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 18px; height: 18px; cursor: pointer; font-size: 10px; z-index: 10;">x</button>
            <i class="fa-solid ${icon}" style="font-size: 24px; color: #555; display: block;"></i>
            <span style="font-size: 10px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${files[i].name}</span>
        `;
        grid.appendChild(div);
    }
}
function toggleDarkMode() {
    // بتبدل كلاس dark-mode في جسم الصفحة كله
    document.body.classList.toggle('dark-mode');
    
    // اختياري: حفظ الإعداد عشان لما تعمل ريفريش ميرجعش فاتح
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// كود إضافي عشان أول ما تفتح الصفحة يشوف إنت كنت مختار إيه
window.onload = function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    // لو عندك دوال تانية في الـ onload ضيفها هنا
};
// دالة تنفيذ البحث في جوجل
function execGoogleSearch() {
    const input = document.getElementById('g-input');
    const query = input.value.trim();

    if (query !== "") {
        // فتح البحث في صفحة جديدة
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        
        // مسح الخانة بعد البحث عشان متسيفش قدامك
        input.value = ""; 
    } else {
        alert("Please enter something to search!");
    }
}

// تعديل دالة الإغلاق عشان تمسح البحث لو قفلت النافذة
// تأكد أن هذه الدالة تستبدل الدالة القديمة أو تدمج معها
function closeApp(id) {
    const app = document.getElementById(id);
    if (app) {
        app.style.display = 'none';
        
        // لو بنقفل جوجل، نصفر الخانة
        if (id === 'win-google') {
            document.getElementById('g-input').value = "";
        }
    }
}