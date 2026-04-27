// =============================
// DRAG & DROP
// =============================
interact('.draggable').draggable({
    allowFrom: '.handle',
    listeners: {
        move(event) {
            var target = event.target;
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
});


// =============================
// LOGIN (UNCHANGED)
// =============================
function login() {
    if (document.getElementById('pass').value === "123") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('os-root').style.display = 'block';
    }
}


// =============================
// RIGHT CLICK MENU
// =============================
function openMenu(e) {
    e.preventDefault();
    const m = document.getElementById('ctx-menu');
    m.style.display = 'block';
    m.style.left = e.pageX + 'px';
    m.style.top = e.pageY + 'px';
}

function closeMenu() {
    document.getElementById('ctx-menu').style.display = 'none';
}


// =============================
// START MENU
// =============================
function toggleStart(e) {
    e.stopPropagation();
    const menu = document.getElementById('start-menu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

document.addEventListener('click', () => {
    document.getElementById('start-menu').style.display = 'none';
});


// =============================
// BACKGROUND
// =============================
function changeBg() {
    document.getElementById('bg-input').click();
    closeMenu();
}

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


// =============================
// FILE SYSTEM (SIMPLE UI)
// =============================
function addFolder() {
    const name = prompt("Enter folder name:");
    if (!name) return;

    const id = Date.now();

    const item = document.createElement('div');
    item.className = 'file-item';
    item.setAttribute('data-id', id);

    item.innerHTML = `
        <i class="fa-solid fa-folder"></i>
        <span>${name}</span>
        <small style="cursor:pointer; margin-left:10px;" onclick="deleteItem(${id})">🗑</small>
    `;

    document.getElementById('file-grid').appendChild(item);
}
function deleteItem(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.remove();
    }
}


// =============================
// TERMINAL (FULL UPGRADE ONLY)
// =============================
document.getElementById('term-in').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {

        const cmdLine = e.target.value.trim();
        const args = cmdLine.split(' ');
        const cmd = args[0].toLowerCase();
        const out = document.getElementById('term-out');

        let res = "";

        // ================= HELP =================
        if (cmd === 'help') {
            res = `
pwd - show path<br>
ls / ls -a / ls -l<br>
cd / cd home / cd ..<br>
mkdir<br>
touch<br>
rm / rm -i / rm -r / rm -v / rm -d<br>
stat<br>
cat / cat -n<br>
echo<br>
nano<br>
bash<br>
cls / date / status / whoami
`;
        }

        // ================= FILE SYSTEM =================
        else if (cmd === 'pwd') {
            res = "/home/quantum/desktop";
        }

        else if (cmd === 'ls') {
            if (args[1] === '-a') res = ". .. .config Documents hidden.txt";
            else if (args[1] === '-l') res = "-rw-r--r-- file1.txt<br>-rw-r--r-- file2.txt";
            else res = "Documents Photos note.txt";
        }

        // ================= NAVIGATION =================
        else if (cmd === 'cd') {
            if (args[1] === 'home') res = "Entered home";
            else if (args[1] === '/') res = "Root directory";
            else if (args[1] === '..') res = "Back one step";
            else res = `Entered ${args[1] || ''}`;
        }

        // ================= DIRECTORIES =================
        else if (cmd === 'mkdir') {
            if (!args[1]) res = "missing operand";
            else res = `Created folder(s): ${args.slice(1).join(', ')}`;
        }

        // ================= FILES =================
        else if (cmd === 'touch') {
            res = args[1] ? `File created: ${args[1]}` : "missing file";
        }

        // ================= DELETE =================
        else if (cmd === 'rm') {
            if (args.includes('-i')) res = `Confirm delete ${args[args.length - 1]}`;
            else if (args.includes('-r')) res = `Removed folder ${args[args.length - 1]}`;
            else if (args.includes('-v')) res = `Deleted ${args[args.length - 1]}`;
            else if (args.includes('-d')) res = `Deleted empty folder ${args[args.length - 1]}`;
            else res = `Deleted ${args[1]}`;
        }

        // ================= INFO =================
        else if (cmd === 'stat') {
            res = `File: ${args[1] || 'unknown'} | size: 1KB | created: today`;
        }

        // ================= EDITOR =================
        else if (cmd === 'nano') {
            res = `Opening nano for ${args[1]}`;
        }

        else if (cmd === 'bash') {
            res = `Running script ${args[1]}`;
        }

        // ================= CAT =================
        else if (cmd === 'cat') {
            if (args.includes('-n')) res = "1 line one<br>2 line two";
            else if (args[1]) res = `Content of ${args[1]}`;
            else res = "missing file";
        }

        // ================= ECHO =================
        else if (cmd === 'echo') {
            if (cmdLine.includes('>')) res = "written to file";
            else res = args.slice(1).join(' ');
        }

        // ================= SYSTEM =================
        else if (cmd === 'cls') {
            out.innerHTML = "";
            e.target.value = "";
            return;
        }

        else if (cmd === 'date') {
            res = new Date().toLocaleString();
        }

        else if (cmd === 'status') {
            res = "Quantum OS 1.0.5: All systems active.";
        }

        else if (cmd === 'whoami') {
            res = "Admin_User";
        }

        else if (cmd !== "") {
            res = `'${cmd}' is not recognized`;
        }

        // ================= OUTPUT =================
        out.innerHTML += `<div>C:\\> ${cmdLine}</div><div>${res}</div>`;
        e.target.value = "";

        const winBody = out.parentElement;
        winBody.scrollTop = winBody.scrollHeight;
    }
});


// =============================
// CALCULATOR
// =============================
let calcExp = "";

function press(v) {
    const d = document.getElementById('calc-display');

    if (v === '=') {
        try {
            d.value = eval(calcExp);
            calcExp = d.value;
        } catch {
            d.value = "Error";
        }
    } else if (v === 'C') {
        calcExp = "";
        d.value = "0";
    } else {
        calcExp += v;
        d.value = calcExp;
    }
}


// =============================
// TASKBAR
// =============================
setInterval(() => {

    const now = new Date();

    document.getElementById('clock-val').innerText =
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById('date-val').innerText =
        now.toLocaleDateString();

    navigator.getBattery?.().then(b => {
        document.getElementById('batt-info').innerText =
            Math.round(b.level * 100) + "%";
    });

    document.getElementById('wifi-ico').className =
        navigator.onLine ? "fa-solid fa-wifi" : "fa-solid fa-wifi-slash";

    document.getElementById('temp').innerText =
        (28 + Math.floor(Math.random() * 5)) + "°C";

}, 1000);


// =============================
// GLOBAL APPS
// =============================
function openApp(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeApp(id) {
    document.getElementById(id).style.display = 'none';
}


// =============================
// SCREENSHOT
// =============================
function takeScreenshot() {
    html2canvas(document.body).then(canvas => {
        const link = document.createElement('a');
        link.download = 'os.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}


// =============================
// SEARCH APPS
// =============================
function searchApps(q) {
    document.querySelectorAll('.app-icon').forEach(app => {
        app.style.opacity =
            app.innerText.toLowerCase().includes(q.toLowerCase())
                ? "1"
                : "0.2";
    });
}


// =============================
// DARK MODE
// =============================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme',
        document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
}

window.onload = function () {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
};


// =============================
// GOOGLE SEARCH
// =============================
function execGoogleSearch() {
    const input = document.getElementById('g-input');
    const q = input.value.trim();

    if (q) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
        input.value = "";
    } else {
        alert("Enter search text");
    }
}
// 1. وظيفة بتفتح نافذة اختيار الملفات من جهازك
function triggerUpload() {
    document.getElementById('desktop-upload').click();
}

// 2. وظيفة بتاخد الملفات اللي اخترتها وترسمها جوه الـ OS بتاعك
function loadFromLocalDevice(input) {
    const grid = document.getElementById('file-grid'); // المكان اللي الملفات هتنزل فيه
    const files = input.files; // قايمة الملفات اللي اخترتها

    for (let file of files) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.style.textAlign = "center";
        
        // بنختار شكل الأيقونة (لو صورة تظهر أيقونة صورة، ولو ملف عادي تظهر أيقونة ملف)
        let icon = file.type.startsWith('image/') ? 'fa-file-image' : 'fa-file';

        item.innerHTML = `
            <i class="fa-solid ${icon}" style="font-size: 40px; color: #555; display: block;"></i>
            <span style="font-size: 12px;">${file.name}</span>
        `;
        
        grid.appendChild(item); // ضيف الملف في الشاشة
    }
}
