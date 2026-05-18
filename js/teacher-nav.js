// Shared sidebar + auth guard for all teacher pages

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  href: 'index.html',     icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'questions',  label: 'Questions',  href: 'questions.html', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'papers',     label: 'Papers',     href: 'papers.html',    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'students',   label: 'Students',   href: 'students.html',  icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { id: 'marking',    label: 'Marking',    href: 'marking.html',   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
];

function renderSidebar(activeId) {
  const el = document.getElementById('teacher-sidebar');
  if (!el) return;
  el.innerHTML = `
    <div class="flex flex-col h-full bg-slate-900">
      <div class="p-5 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.318A3.5 3.5 0 0112 19.5a3.5 3.5 0 01-2.474-1.026l-.347-.318z"/>
            </svg>
          </div>
          <div>
            <p class="text-white font-bold leading-none">ChemExam</p>
            <p class="text-slate-400 text-xs mt-0.5">Teacher Portal</p>
          </div>
        </div>
      </div>
      <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
        ${NAV_ITEMS.map(item => `
          <a href="${item.href}" class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium
            ${activeId === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"/>
            </svg>
            ${item.label}
          </a>
        `).join('')}
      </nav>
      <div class="p-3 border-t border-slate-700">
        <div class="px-4 mb-2">
          <p class="text-slate-500 text-xs">Signed in as</p>
          <p id="nav-teacher-email" class="text-slate-300 text-sm truncate"></p>
        </div>
        <button onclick="doSignOut()"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>`;
}

function doSignOut() {
  auth.signOut().then(() => { window.location.href = '../index.html'; });
}

// Call this at top of every teacher page. Returns {user, userData} on success.
function initTeacherPage(activeId) {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) { window.location.href = '../index.html'; return; }
      try {
        const snap = await db.collection('exam_users').doc(user.uid).get();
        if (!snap.exists || snap.data().role !== 'teacher') {
          window.location.href = '../index.html'; return;
        }
        renderSidebar(activeId);
        const emailEl = document.getElementById('nav-teacher-email');
        if (emailEl) emailEl.textContent = user.email;
        resolve({ user, userData: snap.data() });
      } catch (err) { reject(err); }
    });
  });
}

// Pending marks badge
async function loadMarkingBadge() {
  try {
    const snap = await db.collection('exam_submissions')
      .where('status', '==', 'submitted').get();
    const count = snap.size;
    if (count > 0) {
      const link = document.querySelector('a[href="marking.html"]');
      if (link) {
        link.insertAdjacentHTML('beforeend',
          `<span class="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">${count}</span>`);
      }
    }
  } catch (_) {}
}
