/** * JAN-SURAKSHA: CITIZEN GRIEVANCE MANAGEMENT SYSTEM * Real-time Transparent Submission, Smart Prioritization, AI Merging & Java OOP Integration */// ==========================================// ==========================================
// 0. CITIZEN USER AUTHENTICATION (Delegates to Firebase Auth)
// ==========================================

function getLoggedInCitizen() {
  if (window._loggedInCitizen) return window._loggedInCitizen;
  if (typeof auth !== "undefined" && auth && auth.currentUser) {
    var u = auth.currentUser;
    var name = u.displayName || u.email;
    var initials = name.split(" ").map(function(w){ return w.charAt(0); }).join("").toUpperCase().substring(0, 2);
    return { id: u.uid, username: name, email: u.email, initials: initials };
  }
  return null;
}

function openUserLoginModal(mode) {
  if (typeof openAuthModal === "function") {
    openAuthModal(mode || "login");
  }
}

function closeUserLoginModal() {
  if (typeof closeAuthModal === "function") {
    closeAuthModal();
  }
}

function updateCitizenHeader() {
  // Realtime updates handled by Firebase onAuthStateChanged in index.html
}

function logoutCitizen() {
  if (typeof window !== "undefined" && window._logoutCitizenBridge) {
    window._logoutCitizenBridge();
    return;
  }
  if (typeof auth !== "undefined" && auth) {
    auth.signOut();
  }
}
// ==========================================
// ADMIN SECURITY CONFIGURATION
// ==========================================
const ADMIN_PASSWORD = "admin@cgms2024"; // Change this to your desired password
const ADMIN_MAX_ATTEMPTS = 3;

// ==========================================
// 1. INITIAL SEED DATA & STATE ENGINE
// ==========================================
const INITIAL_USERS = {  CITIZEN: { id: "U101", name: "Rajesh Kumar", role: "Citizen", wardId: "W1", wardName: "Ward 1 - Green Valley", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" },  WARD_MEMBER: { id: "U201", name: "Suresh Menon", role: "Ward Member", wardId: "W1", wardName: "Ward 1 - Green Valley", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },  PRESIDENT: { id: "U301", name: "K. V. Ramanathan", role: "Panchayath President", panchayath: "Anandapuram Panchayath", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },  ADMIN: { id: "U401", name: "Super Admin", role: "Administrator", system: "Master Admin Console", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" }};

const INITIAL_COMPLAINTS = [  {    id: "CMP-1001",    title: "Severe Main Road Pothole near Central Market",    category: "Road Damage",    description: "A deep 4ft pothole has formed right in front of Central Market entrance causing vehicle damage and traffic jams.",    location: "Central Market Road",    lat: 10.5234,    lng: 76.2145,    wardId: "W1",    wardName: "Ward 1 - Green Valley",    citizenId: "U101",    citizenName: "Rajesh Kumar",    urgency: "HIGH",    status: "UNDER_WARD_REVIEW",    upvotes: 18,    assignedDepartment: "Unassigned",    wardRemarks: "Initial assessment by Ward Member: Confirmed deep pothole requiring PWD asphalt patching.",    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600",    createdAt: "2026-08-01 08:30",    isMerged: false,    childIds: []  },  {    id: "CMP-1002",    title: "Streetlights Outage on Temple Road",    category: "Streetlight",    description: "Five consecutive LED streetlights have been out for 3 days, making night walking hazardous for women and senior citizens.",    location: "Temple Road Junction",    lat: 10.5280,    lng: 76.2190,    wardId: "W1",    wardName: "Ward 1 - Green Valley",    citizenId: "U102",    citizenName: "Anita Sharma",    urgency: "MEDIUM",    status: "APPROVED",    upvotes: 12,    assignedDepartment: "Electrical Department",    wardRemarks: "Approved. Forwarded to Electrical Department for fuse/LED bulb replacement.",    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600",    createdAt: "2026-07-31 18:15",    isMerged: false,    childIds: []  },  {    id: "CMP-1003",    title: "Contaminated Drinking Water Supply",    category: "Water Supply",    description: "Tap water supplied in Morning pipe schedule has yellowish color and muddy odor. Suspecting pipe leak.",    location: "Lakeview Colony Block B",    lat: 10.5310,    lng: 76.2250,    wardId: "W2",    wardName: "Ward 2 - Lakeview",    citizenId: "U103",    citizenName: "Vikram Das",    urgency: "CRITICAL",    status: "IN_PROGRESS",    upvotes: 34,    assignedDepartment: "Water & Sanitation Dept (KWA)",    wardRemarks: "High urgency. PWD team dispatched for sample testing.",    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600",    createdAt: "2026-07-30 09:10",    isMerged: false,    childIds: []  },  {    id: "CMP-1004",    title: "Overflowing Garbage Bin near High School",    category: "Garbage",    description: "Public waste dump bin hasn't been emptied in 4 days. Waste spreading on road, attracting stray animals.",    location: "Government High School Gate",    lat: 10.5210,    lng: 76.2110,    wardId: "W3",    wardName: "Ward 3 - Market Square",    citizenId: "U104",    citizenName: "Meera Nair",    urgency: "HIGH",    status: "RESOLVED",    upvotes: 22,    assignedDepartment: "Sanitation & Waste Mgmt",    wardRemarks: "Sanitation vehicle cleared garbage bin and disinfected area.",    photoUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600",    createdAt: "2026-07-29 11:40",    isMerged: false,    childIds: []  },  {    id: "CMP-1005",    title: "Blocked Stormwater Drainage",    category: "Drainage",    description: "Drainage channel blocked by plastic bottles and mud. Water logging on road during rain.",    location: "Station Road Corner",    lat: 10.5240,    lng: 76.2150,    wardId: "W1",    wardName: "Ward 1 - Green Valley",    citizenId: "U105",    citizenName: "Karthik Raja",    urgency: "MEDIUM",    status: "SUBMITTED",    upvotes: 5,    assignedDepartment: "Unassigned",    wardRemarks: "",    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600",    createdAt: "2026-08-01 09:45",    isMerged: false,    childIds: []  }];

const INITIAL_NOTIFICATIONS = [  { id: "N1", userId: "U101", complaintId: "CMP-1001", message: "Ward Member Suresh Menon added field evaluation remarks on your complaint #CMP-1001.", type: "WARD_APPROVAL", time: "10 mins ago" },  { id: "N2", userId: "U101", complaintId: "CMP-1002", message: "Complaint #CMP-1002 assigned to Electrical Department.", type: "DEPT_ASSIGNMENT", time: "1 hour ago" },  { id: "N3", userId: "U101", complaintId: "CMP-1004", message: "Complaint #CMP-1004 has been marked as RESOLVED.", type: "STATUS_CHANGE", time: "1 day ago" }];

// App State
let appState = {  currentRole: "CITIZEN",  currentUser: INITIAL_USERS.CITIZEN,  complaints: JSON.parse(localStorage.getItem("jansuraksha_complaints")) || INITIAL_COMPLAINTS,  notifications: JSON.parse(localStorage.getItem("jansuraksha_notifs")) || INITIAL_NOTIFICATIONS,  upvotedIds: JSON.parse(localStorage.getItem("jansuraksha_upvotes")) || ["CMP-1001"],  aiThresholds: { text: 0.40, distanceMeters: 500 },  citizenFilterCategory: "ALL",  citizenFilterTab: "PUBLIC",  searchQuery: "",  selectedPhotoUrl: null,  adminAuthenticated: false /* Admin must login each session */
};

// Save to LocalStorage
function persistState() {  localStorage.setItem("jansuraksha_complaints", JSON.stringify(appState.complaints));  localStorage.setItem("jansuraksha_notifs", JSON.stringify(appState.notifications));  localStorage.setItem("jansuraksha_upvotes", JSON.stringify(appState.upvotedIds));}

// Priority Calculation Formula (Matching Java Strategy Pattern)
function calculatePriorityScore(c) {  const categoryWeights = {    "Electricity": 1.5, "Sewage": 1.5, "Water Supply": 1.5,    "Road Damage": 1.3, "Drainage": 1.3,    "Tree Removal": 1.2, "Garbage": 1.2,    "Streetlight": 1.1, "Public Toilet": 1.1, "Others": 1.0  };  const urgencyMultipliers = { "CRITICAL": 2.0, "HIGH": 1.5, "MEDIUM": 1.2, "LOW": 1.0 };    const baseWeight = categoryWeights[c.category] || 1.0;  const mult = urgencyMultipliers[c.urgency] || 1.0;    return ((baseWeight * mult * 10) + (c.upvotes * 2.5)).toFixed(1);}

// ==========================================
// 2. DOM INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Always require fresh login on every page visit
  localStorage.removeItem("cgms_logged_in");
  sessionStorage.removeItem("cgms_logged_in");

  setupEventListeners();
  renderRoleView();
  renderNotifications();
  updateCitizenHeader();
});function setupEventListeners() {
  // Helper to safely bind click
  const on = (id, event, handler) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  };

  // Role Switcher Buttons - Admin requires password authentication
  document.querySelectorAll(".role-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const role = e.currentTarget.dataset.role;
      if (role === "ADMIN") {
        openAdminLoginModal();
      } else {
        // If switching away from admin, lock it back
        appState.adminAuthenticated = false;
        switchRole(role);
      }
    });
  });

  // Admin Login Form
  on("form-admin-login", "submit", verifyAdminLogin);
  on("btn-admin-login-close", "click", closeAdminLoginModal);
  on("toggle-admin-password", "click", () => {
    const input = document.getElementById("admin-password-input");
    const icon = document.getElementById("toggle-admin-password")?.querySelector("i");
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      if (icon) icon.className = "fa-solid fa-eye-slash";
    } else {
      input.type = "password";
      if (icon) icon.className = "fa-solid fa-eye";
    }
  });

  // Java Code Inspector Modal
  on("btn-view-java", "click", openJavaModal);

  // Notifications Drawer
  on("btn-notifications", "click", toggleNotificationDrawer);
  on("btn-clear-notifications", "click", () => {
    appState.notifications = [];
    persistState();
    renderNotifications();
  });

  // Submit Modal Triggers
  on("btn-open-submit-modal", "click", openSubmitModal);
  document.querySelectorAll(".close-modal-btn").forEach(btn => {
    btn.addEventListener("click", closeAllModals);
  });

  // Complaint Submit Form
  on("form-submit-complaint", "submit", handleComplaintSubmit);

  // Photo Dropzone / Selector
  const dropZone = document.getElementById("photo-drop-zone");
  const fileInput = document.getElementById("input-photo");
  if (dropZone && fileInput) {
    dropZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", handlePhotoSelection);
  }
  on("btn-remove-photo", "click", removePhotoSelection);

  // Citizen Filters
  on("citizen-search", "input", (e) => {
    appState.searchQuery = e.target.value.toLowerCase();
    renderCitizenFeed();
  });
  on("citizen-category-filter", "change", (e) => {
    appState.citizenFilterCategory = e.target.value;
    renderCitizenFeed();
  });
  on("citizen-tab-filter", "change", (e) => {
    appState.citizenFilterTab = e.target.value;
    renderCitizenFeed();
  });

  // President Actions
  on("btn-run-ai-merger", "click", runAISimilarityScanner);
  on("btn-generate-report", "click", generatePanchayathReport);

  // Java Modal Tabs
  document.querySelectorAll(".java-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".java-tab").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      loadJavaSource(e.target.dataset.file);
    });
  });
}

// ==========================================
// 3. ADMIN AUTHENTICATION
// ==========================================
let adminLoginAttempts = 0;function openAdminLoginModal() {  /* If already authenticated this session, go straight in */  if (appState.adminAuthenticated) {    switchRole("ADMIN");    return;  }  const modal = document.getElementById("modal-admin-login");  modal.classList.remove("hidden");  document.getElementById("admin-password-input").value = "";  document.getElementById("admin-login-error").classList.add("hidden");  document.getElementById("admin-password-input").focus();}function closeAdminLoginModal() {  document.getElementById("modal-admin-login").classList.add("hidden");  document.getElementById("admin-password-input").value = "";  document.getElementById("admin-login-error").classList.add("hidden");}function verifyAdminLogin(e) {  e.preventDefault();  const entered = document.getElementById("admin-password-input").value;  const errorEl = document.getElementById("admin-login-error");  const loginBtn = document.getElementById("btn-admin-login-submit");  if (entered === ADMIN_PASSWORD) {    adminLoginAttempts = 0;    appState.adminAuthenticated = true;    closeAdminLoginModal();    switchRole("ADMIN");    showToast("Admin access granted. Welcome, Super Admin!", "success");  } else {    adminLoginAttempts++;    const remaining = ADMIN_MAX_ATTEMPTS - adminLoginAttempts;    if (remaining <= 0) {      errorEl.innerHTML = `<i class="fa-solid fa-ban"></i> Too many failed attempts. Access locked. Refresh the page to try again.`;      errorEl.classList.remove("hidden");      loginBtn.disabled = true;      loginBtn.style.opacity = "0.5";      document.getElementById("admin-password-input").disabled = true;    } else {      errorEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Incorrect password. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`;      errorEl.classList.remove("hidden");    }    /* Shake the input */    const input = document.getElementById("admin-password-input");    input.classList.add("shake-error");    setTimeout(() => input.classList.remove("shake-error"), 500);  }}

// ==========================================
// 4. ROLE SWITCHING & VIEW ROUTING
// ==========================================
function switchRole(roleKey) {  appState.currentRole = roleKey;  appState.currentUser = INITIAL_USERS[roleKey];  /* Update Buttons */  document.querySelectorAll(".role-btn").forEach(btn => {    btn.classList.toggle("active", btn.dataset.role === roleKey);  });  /* Update Profile Card */  document.getElementById("user-display-name").innerText = appState.currentUser.name;  document.getElementById("user-display-role").innerText = `${appState.currentUser.role} • ${appState.currentUser.wardName || appState.currentUser.panchayath || appState.currentUser.system}`;  document.getElementById("user-avatar").src = appState.currentUser.avatar;  renderRoleView();  showToast(`Switched view to ${appState.currentUser.role}`, "info");}function renderRoleView() {  /* Hide all modules */  document.querySelectorAll(".portal-module").forEach(mod => mod.classList.add("hidden"));  if (appState.currentRole === "CITIZEN") {    document.getElementById("module-citizen").classList.remove("hidden");    renderCitizenFeed();  } else if (appState.currentRole === "WARD_MEMBER") {    document.getElementById("module-ward-member").classList.remove("hidden");    renderWardMemberPortal();  } else if (appState.currentRole === "PRESIDENT") {    document.getElementById("module-president").classList.remove("hidden");    renderPresidentPortal();  } else if (appState.currentRole === "ADMIN") {    document.getElementById("module-admin").classList.remove("hidden");    renderAdminPortal();  }}

// ==========================================
// 4. CITIZEN MODULE LOGIC & UPVOTING
// ==========================================
function renderCitizenFeed() {  const grid = document.getElementById("citizen-complaints-grid");  grid.innerHTML = "";  let list = appState.complaints.filter(c => !c.isMerged);  /* Filter by Tab */  if (appState.citizenFilterTab === "MY_COMPLAINTS") {    list = list.filter(c => c.citizenId === appState.currentUser.id);  }  /* Filter by Category */  if (appState.citizenFilterCategory !== "ALL") {    list = list.filter(c => c.category === appState.citizenFilterCategory);  }  /* Search Query */  if (appState.searchQuery) {    list = list.filter(c =>       c.title.toLowerCase().includes(appState.searchQuery) ||      c.description.toLowerCase().includes(appState.searchQuery) ||      c.location.toLowerCase().includes(appState.searchQuery)    );  }  if (list.length === 0) {    grid.innerHTML = `      <div class="glass-panel text-center py-8 full-width" style="grid-column: 1 / -1; padding: 40px;">        <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: #64748b; margin-bottom: 12px;"></i>        <h4 style="color: #94a3b8;">No Grievances Found</h4>        <p style="color: #64748b; font-size: 0.85rem;">Try adjusting search filters or file a new grievance.</p>      </div>    `;    return;  }  list.forEach(c => {    const isUpvoted = appState.upvotedIds.includes(c.id);    const score = calculatePriorityScore(c);    const card = document.createElement("div");    card.className = "complaint-card";    card.innerHTML = `      <div class="card-image-wrap">        <img src="${c.photoUrl}" alt="${c.title}" />        <span class="category-tag"><i class="fa-solid fa-tag"></i> ${c.category}</span>        <span class="urgency-tag ${c.urgency}">${c.urgency}</span>      </div>      <div class="card-body">        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">          <span style="font-size: 0.72rem; color: #64748b; font-weight: 700;">#${c.id}</span>          <span class="status-pill status-${c.status}">${formatStatus(c.status)}</span>        </div>        <h3 class="card-title">${c.title}</h3>        <div class="card-meta">          <span><i class="fa-solid fa-location-dot"></i> ${c.location}</span>          <span><i class="fa-solid fa-layer-group"></i> ${c.wardName}</span>        </div>        <p class="card-desc">${c.description}</p>                <div class="card-footer">          <button class="btn-upvote ${isUpvoted ? 'upvoted' : ''}" onclick="toggleUpvote('${c.id}')">            <i class="fa-solid fa-circle-up"></i> ${c.upvotes} Upvotes          </button>                    <button class="btn-track" onclick="openTrackingModal('${c.id}')">            <i class="fa-solid fa-timeline"></i> Track Status          </button>        </div>      </div>    `;    grid.appendChild(card);  });}function toggleUpvote(complaintId) {
  const complaint = appState.complaints.find(c => c.id === complaintId);
  if (!complaint) return;
  const idx = appState.upvotedIds.indexOf(complaintId);
  if (idx > -1) {
    appState.upvotedIds.splice(idx, 1);
    complaint.upvotes = Math.max(1, complaint.upvotes - 1);
    showToast(`Removed upvote from #${complaintId}`, "info");
  } else {
    appState.upvotedIds.push(complaintId);
    complaint.upvotes += 1;
    showToast(`Upvoted #${complaintId}! Priority Score: ${calculatePriorityScore(complaint)}`, "success");
    addNotification(appState.currentUser.id, complaintId, `You upvoted complaint #${complaintId} (${complaint.title}). Priority score increased.`, "UPVOTE");
    addNotification("U401", complaintId, `Complaint #${complaintId} "${complaint.title}" now has ${complaint.upvotes} community upvotes. Priority score: ${calculatePriorityScore(complaint)} pts.`, "UPVOTE");
  }
  persistState();
  renderRoleView();
  if (appState.currentRole === "ADMIN") renderAdminComplaintList();
}

// ==========================================
// 5. SUBMIT GRIEVANCE FORM & PHOTO HANDLING
// ==========================================
function openSubmitModal() {
  const modal = document.getElementById("modal-submit");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.style.display = "flex";

  // Dynamic user status inside the modal
  const citizen = getLoggedInCitizen();
  const badgeText = document.getElementById("submit-citizen-text");
  const badgeBtn  = document.getElementById("submit-citizen-btn");
  if (badgeText && badgeBtn) {
    if (citizen) {
      badgeText.innerHTML = `Posting as: <strong style="color:#818cf8;">${citizen.username}</strong> <span style="color:#94a3b8;font-size:0.78rem;">(${citizen.email})</span>`;
      badgeBtn.style.display = "none";
    } else {
      badgeText.innerHTML = `Not logged in: <span style="color:#f87171;">Login to link complaint to your name</span>`;
      badgeBtn.style.display = "inline-flex";
    }
  }
}function handlePhotoSelection(e) {  const file = e.target.files[0];  if (file) {    const reader = new FileReader();    reader.onload = (event) => {      appState.selectedPhotoUrl = event.target.result;      document.getElementById("photo-preview-img").src = appState.selectedPhotoUrl;      document.getElementById("photo-preview-container").classList.remove("hidden");    };    reader.readAsDataURL(file);  }}function removePhotoSelection() {  appState.selectedPhotoUrl = null;  document.getElementById("input-photo").value = "";  document.getElementById("photo-preview-container").classList.add("hidden");}function handleComplaintSubmit(e) {
  e.preventDefault();
  const loggedIn = getLoggedInCitizen();
  if (!loggedIn) {
    if (typeof openAuthModal === "function") openAuthModal("login");
    if (typeof showToast === "function") showToast("Please login or register to file a complaint.", "error");
    return;
  }
  const title = document.getElementById("input-title").value.trim();  const category = document.getElementById("input-category").value;  const wardId = document.getElementById("input-ward").value;  const location = document.getElementById("input-location").value.trim();  const urgency = document.getElementById("input-urgency").value;  const description = document.getElementById("input-description").value.trim();  const wardNames = { "W1": "Ward 1 - Green Valley", "W2": "Ward 2 - Lakeview", "W3": "Ward 3 - Market Square", "W4": "Ward 4 - Hill Top" };    /* Sample Fallback photos based on category */  const fallbackPhotos = {    "Road Damage": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600",    "Streetlight": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600",    "Water Supply": "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600",    "Garbage": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600"  };  const newId = `CMP-${1000 + appState.complaints.length + 1}`;  const newComplaint = {    id: newId,    title,    category,    description,    location,    lat: 10.5230 + (Math.random() * 0.01),    lng: 76.2140 + (Math.random() * 0.01),    wardId,    wardName: wardNames[wardId] || "Ward 1",    citizenId: loggedIn.id,    citizenName: loggedIn.username,    citizenEmail: loggedIn.email,    urgency,    status: "SUBMITTED",    upvotes: 1,    assignedDepartment: "Unassigned",    wardRemarks: "Received transparently via Citizen Portal. Pending Ward Member review.",    photoUrl: appState.selectedPhotoUrl || fallbackPhotos[category] || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600",    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),    isMerged: false,    childIds: []  };  appState.complaints.unshift(newComplaint);  appState.upvotedIds.push(newId);  /* Notify the citizen */  addNotification(appState.currentUser.id, newId, `Grievance #${newId} filed successfully! Live tracking is active.`, "STATUS_CHANGE");  /* Notify admin (U401) directly so it appears in Admin panel immediately */  addNotification("U401", newId, `\ud83d\udea8 New complaint #${newId} from ${loggedIn.username} (${loggedIn.email}): "${title}" (${category} \u2022 ${urgency})`, "NEW_COMPLAINT");  persistState();  closeAllModals();  renderRoleView();  showToast(`Grievance #${newId} submitted! Admin has been notified.`, "success");    /* Reset Form */  document.getElementById("form-submit-complaint").reset();  removePhotoSelection();}

// ==========================================
// 6. WARD MEMBER PORTAL LOGIC
// ==========================================
function renderWardMemberPortal() {  const pending = appState.complaints.filter(c => c.wardId === "W1" && c.status === "SUBMITTED");  const approved = appState.complaints.filter(c => c.wardId === "W1" && (c.status === "APPROVED" || c.status === "IN_PROGRESS" || c.status === "RESOLVED"));  const rejected = appState.complaints.filter(c => c.wardId === "W1" && c.status === "REJECTED");  document.getElementById("ward-pending-count").innerText = pending.length;  document.getElementById("ward-approved-count").innerText = approved.length;  document.getElementById("ward-rejected-count").innerText = rejected.length;  const container = document.getElementById("ward-complaints-list");  container.innerHTML = "";  const wardComplaints = appState.complaints.filter(c => c.wardId === "W1" && !c.isMerged);  if (wardComplaints.length === 0) {    container.innerHTML = `<div class="p-6 text-center text-muted">No grievances assigned to Ward 1 yet.</div>`;    return;  }  wardComplaints.forEach(c => {    const item = document.createElement("div");    item.className = "ward-item";    item.innerHTML = `      <div class="ward-item-details">        <div style="display:flex; gap:10px; align-items:center; margin-bottom:4px;">          <span style="font-weight:800; color:#3b82f6;">#${c.id}</span>          <span class="status-pill status-${c.status}">${formatStatus(c.status)}</span>          <span class="urgency-tag ${c.urgency}">${c.urgency}</span>        </div>        <h4 class="ward-item-title">${c.title}</h4>        <div class="ward-item-sub">          <span><i class="fa-solid fa-user-circle"></i> <strong>${c.citizenName}</strong>${c.citizenEmail ? ` <em class="acr-email">${c.citizenEmail}</em>` : ""}</span>          <span><i class="fa-solid fa-location-dot"></i> ${c.location}</span>          <span><i class="fa-solid fa-circle-up"></i> ${c.upvotes} Upvotes</span>        </div>        ${c.wardRemarks ? `<p style="font-size:0.8rem; color:#a78bfa; margin-top:6px;"><i class="fa-solid fa-comment-dots"></i> Remark: ${c.wardRemarks}</p>` : ''}      </div>      <div class="ward-actions">        ${c.status === "SUBMITTED" ? `          <button class="btn-sm-approve" onclick="wardApprove('${c.id}')"><i class="fa-solid fa-check"></i> Approve</button>          <button class="btn-sm-reject" onclick="wardReject('${c.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>        ` : `<span style="font-size:0.8rem; color:#94a3b8; font-weight:600;">Assessment Recorded</span>`}      </div>    `;    container.appendChild(item);  });}function wardApprove(id) {  const remarks = prompt("Enter Field Assessment Remarks for Approval:", "Field verified by Ward Member. Genuine grievance.");  if (remarks === null) return;  const complaint = appState.complaints.find(c => c.id === id);  if (complaint) {    complaint.status = "APPROVED";    complaint.wardRemarks = remarks;    addNotification(complaint.citizenId, id, `Ward Member approved grievance #${id}. Remarks: "${remarks}"`, "WARD_APPROVAL");    persistState();    renderWardMemberPortal();    showToast(`Approved #${id} and forwarded to President Dashboard`, "success");  }}function wardReject(id) {  const remarks = prompt("Enter Reason for Rejection:", "Invalid or duplicate claim upon physical inspection.");  if (remarks === null) return;  const complaint = appState.complaints.find(c => c.id === id);  if (complaint) {    complaint.status = "REJECTED";    complaint.wardRemarks = remarks;    addNotification(complaint.citizenId, id, `Grievance #${id} was rejected by Ward Member. Reason: "${remarks}"`, "STATUS_CHANGE");    persistState();    renderWardMemberPortal();    showToast(`Rejected #${id}`, "info");  }}

// ==========================================
// 7. PANCHAYATH PRESIDENT PORTAL & DEPT ASSIGNMENT
// ==========================================
function renderPresidentPortal() {  const total = appState.complaints.length;  const critical = appState.complaints.filter(c => c.urgency === "CRITICAL" || c.upvotes >= 15).length;  const inProgress = appState.complaints.filter(c => c.status === "IN_PROGRESS").length;  const merged = appState.complaints.filter(c => c.isMerged).length;  document.getElementById("pres-total-count").innerText = total;  document.getElementById("pres-critical-count").innerText = critical;  document.getElementById("pres-inprogress-count").innerText = inProgress;  document.getElementById("pres-merged-count").innerText = merged;  const tbody = document.getElementById("president-table-body");  tbody.innerHTML = "";  /* Sort complaints by Smart Priority Score descending */  const sorted = [...appState.complaints].sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));  sorted.forEach(c => {    const score = calculatePriorityScore(c);    const tr = document.createElement("tr");    tr.innerHTML = `      <td style="font-weight:800; color:#60a5fa;">#${c.id}</td>      <td>        <div style="font-weight:700;">${c.title}</div>        <div style="font-size:0.75rem; color:#94a3b8;">${c.category}</div>      </td>      <td>${c.wardName}</td>      <td><span class="priority-score-badge">${score} pts</span></td>      <td><i class="fa-solid fa-circle-up" style="color:#60a5fa;"></i> <strong>${c.upvotes}</strong></td>      <td><span class="status-pill status-${c.status}">${formatStatus(c.status)}</span></td>      <td><strong>${c.assignedDepartment}</strong></td>      <td>        <select class="form-select" onchange="assignDepartment('${c.id}', this.value)" style="padding:4px 8px; font-size:0.78rem;">          <option value="">-- Assign Dept --</option>          <option value="Public Works Dept (PWD)" ${c.assignedDepartment.includes("PWD") ? "selected" : ""}>PWD Roads</option>          <option value="Electrical Department" ${c.assignedDepartment.includes("Electrical") ? "selected" : ""}>Electrical Dept</option>          <option value="Water & Sanitation Dept" ${c.assignedDepartment.includes("Water") ? "selected" : ""}>Water & Sanitation</option>          <option value="Health & Environment" ${c.assignedDepartment.includes("Health") ? "selected" : ""}>Health & Sanitation</option>        </select>      </td>    `;    tbody.appendChild(tr);  });}function assignDepartment(complaintId, deptName) {  if (!deptName) return;  const complaint = appState.complaints.find(c => c.id === complaintId);  if (complaint) {    complaint.assignedDepartment = deptName;    complaint.status = "IN_PROGRESS";    addNotification(complaint.citizenId, complaintId, `Panchayath President assigned #${complaintId} to ${deptName}. Action in progress.`, "DEPT_ASSIGNMENT");    persistState();    renderPresidentPortal();    showToast(`Assigned #${complaintId} to ${deptName}`, "success");  }}

// ==========================================
// 8. AI COMPLAINT MERGING ENGINE
// ==========================================
function runAISimilarityScanner() {  const modal = document.getElementById("modal-ai-merge");  const container = document.getElementById("ai-merge-modal-body");  modal.classList.remove("hidden");  /* Jaccard similarity & distance calculation */  const openComplaints = appState.complaints.filter(c => !c.isMerged);  let matches = [];  for (let i = 0; i < openComplaints.length; i++) {    for (let j = i + 1; j < openComplaints.length; j++) {      const c1 = openComplaints[i];      const c2 = openComplaints[j];      if (c1.category === c2.category && c1.wardId === c2.wardId) {        const textSim = calculateJaccardSimilarity(c1.title + " " + c1.description, c2.title + " " + c2.description);        const distMeters = calculateHaversineDistance(c1.lat, c1.lng, c2.lat, c2.lng);        if (textSim >= appState.aiThresholds.text || distMeters <= appState.aiThresholds.distanceMeters) {          matches.push({ master: c1, duplicate: c2, textSim: (textSim * 100).toFixed(1), distMeters: distMeters.toFixed(0) });        }      }    }  }  if (matches.length === 0) {    container.innerHTML = `      <div class="text-center py-6">        <i class="fa-solid fa-circle-check" style="font-size:3rem; color:#34d399; margin-bottom:12px;"></i>        <h3>No Duplicate Complaints Detected</h3>        <p style="color:#94a3b8; font-size:0.9rem;">The AI scanner verified all active complaints. The database is clean and unique.</p>      </div>    `;    return;  }  container.innerHTML = `    <div style="background:rgba(236,72,153,0.1); border:1px solid rgba(236,72,153,0.3); padding:12px 16px; border-radius:12px; margin-bottom:16px;">      <h4 style="color:#f472b6;"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Engine Detected ${matches.length} Duplicate Match Pairs</h4>      <p style="font-size:0.8rem; color:#94a3b8;">Review suggestions below. Merging will aggregate upvotes into the Master ticket and clean authority queues.</p>    </div>  `;  matches.forEach(m => {    const card = document.createElement("div");    card.style.cssText = "background:rgba(15,23,42,0.8); border:1px solid var(--border-glass); border-radius:14px; padding:16px; margin-bottom:14px;";    card.innerHTML = `      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">        <span style="font-size:0.8rem; font-weight:700; color:#ec4899;">          <i class="fa-solid fa-bullseye"></i> Similarity: ${m.textSim}% Match • ${m.distMeters}m Distance        </span>        <button class="btn-ai" style="padding:6px 12px; font-size:0.78rem;" onclick="executeAIMerge('${m.duplicate.id}', '${m.master.id}')">          <i class="fa-solid fa-compress"></i> Auto-Merge into #${m.master.id}        </button>      </div>      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.82rem;">        <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px;">          <span style="color:#60a5fa; font-weight:800;">MASTER: #${m.master.id}</span>          <div style="font-weight:700; margin-top:2px;">${m.master.title}</div>          <div style="color:#94a3b8; font-size:0.75rem;">Upvotes: ${m.master.upvotes}</div>        </div>        <div style="background:rgba(239,68,68,0.1); padding:10px; border-radius:8px;">          <span style="color:#f87171; font-weight:800;">DUPLICATE: #${m.duplicate.id}</span>          <div style="font-weight:700; margin-top:2px;">${m.duplicate.title}</div>          <div style="color:#94a3b8; font-size:0.75rem;">Upvotes: ${m.duplicate.upvotes}</div>        </div>      </div>    `;    container.appendChild(card);  });}function executeAIMerge(duplicateId, masterId) {  const master = appState.complaints.find(c => c.id === masterId);  const duplicate = appState.complaints.find(c => c.id === duplicateId);  if (master && duplicate) {    duplicate.isMerged = true;    duplicate.masterComplaintId = masterId;    duplicate.status = "RESOLVED";    duplicate.wardRemarks = `Merged by AI Engine into Master Grievance #${masterId}`;    master.upvotes += duplicate.upvotes;    master.childIds.push(duplicateId);    addNotification(duplicate.citizenId, duplicateId, `Your grievance #${duplicateId} was AI-merged into master ticket #${masterId}. Votes consolidated!`, "AI_MERGE");    persistState();    closeAllModals();    renderRoleView();    showToast(`Successfully merged #${duplicateId} into Master #${masterId}!`, "success");  }}// Jaccard similarity helperfunction calculateJaccardSimilarity(str1, str2) {  const set1 = new Set(str1.toLowerCase().split(/\W+/).filter(Boolean));  const set2 = new Set(str2.toLowerCase().split(/\W+/).filter(Boolean));  if (set1.size === 0 || set2.size === 0) return 0;    const intersection = new Set([...set1].filter(x => set2.has(x)));  const union = new Set([...set1, ...set2]);  return intersection.size / union.size;}// Haversine distance in metersfunction calculateHaversineDistance(lat1, lon1, lat2, lon2) {  const R = 6371000;  const dLat = (lat2 - lat1) * Math.PI / 180;  const dLon = (lon2 - lon1) * Math.PI / 180;  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *            Math.sin(dLon / 2) * Math.sin(dLon / 2);  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));  return R * c;}

// ==========================================
// 9. REAL-TIME TRACKING TIMELINE
// ==========================================
function openTrackingModal(complaintId) {  const c = appState.complaints.find(item => item.id === complaintId);  if (!c) return;  const modal = document.getElementById("modal-tracking");  const body = document.getElementById("tracking-modal-body");  modal.classList.remove("hidden");  const stages = [    { key: "SUBMITTED", label: "Transparent Submission", desc: `Grievance submitted by ${c.citizenName} on ${c.createdAt}` },    { key: "UNDER_WARD_REVIEW", label: "Ward Member Review", desc: c.wardRemarks || "Field evaluation by Ward Member" },    { key: "APPROVED", label: "Ward Approval", desc: "Approved by Ward Member & Priority Calculated" },    { key: "IN_PROGRESS", label: "Department Dispatch", desc: c.assignedDepartment !== "Unassigned" ? `Assigned to ${c.assignedDepartment}` : "Awaiting Department Allocation" },    { key: "RESOLVED", label: "Full Resolution", desc: c.status === "RESOLVED" ? "Resolved by Municipal Action Team" : "Final Inspection" }  ];  const currentIdx = stages.findIndex(s => s.key === c.status) > -1 ? stages.findIndex(s => s.key === c.status) : 1;  body.innerHTML = `    <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:12px; margin-bottom:16px;">      <div style="display:flex; justify-content:space-between; align-items:center;">        <h4 style="font-weight:800; font-size:1.1rem; color:#60a5fa;">#${c.id} - ${c.title}</h4>        <span class="status-pill status-${c.status}">${formatStatus(c.status)}</span>      </div>      <div style="font-size:0.82rem; color:#94a3b8; margin-top:6px;">        Location: ${c.location} • Ward: ${c.wardName} • Priority Score: ${calculatePriorityScore(c)} pts      </div>    </div>    <div class="timeline">      ${stages.map((st, i) => `        <div class="timeline-step ${i <= currentIdx ? 'completed' : ''} ${i === currentIdx ? 'active' : ''}">          <div class="timeline-icon"><i class="fa-solid ${i <= currentIdx ? 'fa-check' : 'fa-circle'}"></i></div>          <div class="timeline-content">            <h4>${st.label}</h4>            <p>${st.desc}</p>          </div>        </div>      `).join('')}    </div>  `;}

// ==========================================
// 10. JAVA CODE INSPECTOR & REPORT GENERATOR
// ==========================================
const JAVA_SOURCES = {  "User.java": `package com.jansuraksha.model;import java.time.LocalDateTime;/** * Abstract Base Class representing a System User in Jan-Suraksha. * Implements Encapsulation and Polymorphism principles. */public abstract class User {    private String id;    private String name;    private String email;    private String role; /* CITIZEN, WARD_MEMBER, PRESIDENT, ADMIN */    public User(String id, String name, String email, String role) {        this.id = id;        this.name = name;        this.email = email;        this.role = role;    }    public abstract String getDashboardAccessLevel();    public String getId() { return id; }    public String getName() { return name; }    public String getRole() { return role; }}`,  "Complaint.java": `package com.jansuraksha.model;public class Complaint {    public enum Status { SUBMITTED, UNDER_WARD_REVIEW, APPROVED, REJECTED, IN_PROGRESS, RESOLVED }        private String id;    private String title;    private String category;    private int upvotesCount;    private Status status;    public double calculatePriorityScore() {        return (categoryWeight * urgencyMultiplier * 10) + (upvotesCount * 2.5);    }}`,  "AIMergingEngine.java": `package com.jansuraksha.service;public class AIMergingEngine {    public List<MergeRecommendation> findPotentialDuplicates(Complaint newComplaint, List<Complaint> existing) {        // Intelligently matches Jaccard text similarity & Haversine geo distance    }}`,  "PriorityCalculationStrategy.java": `package com.jansuraksha.strategy;public interface PriorityCalculationStrategy {    double calculateScore(Complaint complaint);}`,  "Main.java": `package com.jansuraksha;public class Main {    public static void main(String[] args) {        System.out.println("Jan-Suraksha Java OOP Engine initialized.");    }}`};function openJavaModal() {  document.getElementById("modal-java-code").classList.remove("hidden");  loadJavaSource("User.java");}function loadJavaSource(filename) {  document.getElementById("java-code-content").innerText = JAVA_SOURCES[filename] || "// Source file loading...";}function generatePanchayathReport() {  const reportText = `JAN-SURAKSHA PANCHAYATH GRIEVANCE COMPLIANCE REPORTGenerated Date: ${new Date().toLocaleString()}===================================================Total Grievances Filed: ${appState.complaints.length}Resolved Grievances: ${appState.complaints.filter(c => c.status === "RESOLVED").length}In Progress (Dept Action): ${appState.complaints.filter(c => c.status === "IN_PROGRESS").length}AI Merged Duplicates: ${appState.complaints.filter(c => c.isMerged).length}Community Upvotes Cast: ${appState.complaints.reduce((acc, c) => acc + c.upvotes, 0)}Category Breakdown:- Road Damage: ${appState.complaints.filter(c => c.category === "Road Damage").length}- Water Supply: ${appState.complaints.filter(c => c.category === "Water Supply").length}- Streetlight: ${appState.complaints.filter(c => c.category === "Streetlight").length}- Drainage & Sewage: ${appState.complaints.filter(c => c.category === "Drainage" || c.category === "Sewage").length}  `;  const blob = new Blob([reportText], { type: "text/plain" });  const url = URL.createObjectURL(blob);  const a = document.createElement("a");  a.href = url;  a.download = "Panchayath_Grievance_Report.txt";  a.click();  showToast("Downloaded Official Panchayath Compliance Report", "success");}

// ==========================================
// 11. ADMIN PORTAL LOGIC
// ==========================================
let adminComplaintFilter = "ALL";function setAdminFilter(filter, btn) {  adminComplaintFilter = filter;  document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));  if (btn) btn.classList.add("active");  renderAdminComplaintList();}function renderAdminPortal() {  const userBox = document.getElementById("admin-user-list");  userBox.innerHTML = Object.values(INITIAL_USERS).map(u => `    <div class="admin-user-row">      <div>        <strong>${u.name}</strong> (${u.role})        <div style="font-size:0.75rem; color:#94a3b8;">ID: ${u.id}</div>      </div>      <span class="status-pill status-RESOLVED">Active</span>    </div>  `).join('');  const deptBox = document.getElementById("admin-dept-list");  deptBox.innerHTML = `    <div class="admin-dept-row"><span>Public Works Dept (PWD Roads)</span><span class="status-pill status-IN_PROGRESS">4 Tasks</span></div>    <div class="admin-dept-row"><span>Electrical Department</span><span class="status-pill status-IN_PROGRESS">2 Tasks</span></div>    <div class="admin-dept-row"><span>Water &amp; Sanitation Dept</span><span class="status-pill status-IN_PROGRESS">5 Tasks</span></div>    <div class="admin-dept-row"><span>Health &amp; Environment</span><span class="status-pill status-RESOLVED">1 Task</span></div>  `;  renderAdminStats();  renderAdminComplaintList();}function renderAdminStats() {  const all      = appState.complaints.length;  const pending  = appState.complaints.filter(c => c.status === "SUBMITTED").length;  const approved = appState.complaints.filter(c => c.status === "APPROVED" || c.status === "IN_PROGRESS").length;  const rejected = appState.complaints.filter(c => c.status === "REJECTED").length;  const resolved = appState.complaints.filter(c => c.status === "RESOLVED").length;  const statsBox = document.getElementById("admin-complaint-stats");  if (!statsBox) return;  statsBox.innerHTML = `    <div class="acstat-card acstat-blue"><i class="fa-solid fa-folder-open"></i><div><span class="acstat-num">${all}</span><span class="acstat-label">Total</span></div></div>    <div class="acstat-card acstat-yellow"><i class="fa-solid fa-hourglass-half"></i><div><span class="acstat-num">${pending}</span><span class="acstat-label">Pending</span></div></div>    <div class="acstat-card acstat-green"><i class="fa-solid fa-circle-check"></i><div><span class="acstat-num">${approved}</span><span class="acstat-label">Approved</span></div></div>    <div class="acstat-card acstat-red"><i class="fa-solid fa-circle-xmark"></i><div><span class="acstat-num">${rejected}</span><span class="acstat-label">Rejected</span></div></div>    <div class="acstat-card acstat-teal"><i class="fa-solid fa-trophy"></i><div><span class="acstat-num">${resolved}</span><span class="acstat-label">Resolved</span></div></div>  `;}function renderAdminComplaintList() {  const container = document.getElementById("admin-complaints-list");  if (!container) return;  const sortSel = document.getElementById("admin-sort-select");  const sortBy = sortSel ? sortSel.value : "newest";  let list = appState.complaints.filter(c => !c.isMerged);  if (adminComplaintFilter !== "ALL") {    list = list.filter(c => c.status === adminComplaintFilter);  }  /* Sort */ if (sortBy === "newest") {    list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));  } else if (sortBy === "votes") {    list = [...list].sort((a, b) => b.upvotes - a.upvotes);  } else if (sortBy === "priority") {    list = [...list].sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));  }  if (list.length === 0) {    container.innerHTML = `<div style="padding:40px; text-align:center; color:#64748b;"><i class="fa-solid fa-inbox" style="font-size:2rem;margin-bottom:12px;display:block;"></i>No complaints found for the selected filter.</div>`;    return;  }  container.innerHTML = "";  list.forEach(c => {    const div = document.createElement("div");    div.className = "admin-complaint-row";    let actionBtns = "";    if (c.status === "SUBMITTED" || c.status === "UNDER_WARD_REVIEW") {      actionBtns = `        <button class="acr-btn acr-approve" onclick="adminApprove('${c.id}')"><i class="fa-solid fa-check"></i> Approve</button>        <button class="acr-btn acr-reject"  onclick="adminReject('${c.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>`;    } else if (c.status === "APPROVED" || c.status === "IN_PROGRESS") {      actionBtns = `        <button class="acr-btn acr-resolve" onclick="adminResolve('${c.id}')"><i class="fa-solid fa-trophy"></i> Mark Resolved</button>        <button class="acr-btn acr-reject"  onclick="adminReject('${c.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>`;    } else if (c.status === "REJECTED") {      actionBtns = `<button class="acr-btn acr-approve" onclick="adminApprove('${c.id}')"><i class="fa-solid fa-rotate-left"></i> Reopen & Approve</button>`;    } else if (c.status === "RESOLVED") {      actionBtns = `<span style="font-size:0.78rem;color:#10b981;font-weight:700;"><i class="fa-solid fa-circle-check"></i> Fully Resolved</span>`;    }    const isNew = !c.wardRemarks || c.wardRemarks === "Received transparently via Citizen Portal. Pending Ward Member review.";    const priorityScore = calculatePriorityScore(c);    div.innerHTML = `      <div class="acr-left">        <div class="acr-id-row">          ${isNew && c.status === "SUBMITTED" ? `<span class="acr-new-badge"><i class="fa-solid fa-bolt"></i> NEW</span>` : ""}          <span class="acr-id">#${c.id}</span>          <span class="status-pill status-${c.status}">${formatStatus(c.status)}</span>          <span class="urgency-tag ${c.urgency}">${c.urgency}</span>        </div>        <h4 class="acr-title">${c.title}</h4>        <div class="acr-meta">          <span><i class="fa-solid fa-user-circle"></i> <strong>${c.citizenName}</strong>${c.citizenEmail ? ` <em class="acr-email">${c.citizenEmail}</em>` : ""}</span>          <span><i class="fa-solid fa-location-dot"></i> ${c.location}</span>          <span><i class="fa-solid fa-tag"></i> ${c.category}</span>          <span><i class="fa-solid fa-map-pin"></i> ${c.wardName}</span>          <span><i class="fa-solid fa-clock"></i> ${c.createdAt}</span>        </div>        ${c.wardRemarks && c.wardRemarks !== "Received transparently via Citizen Portal. Pending Ward Member review." ? `<div class="acr-remark"><i class="fa-solid fa-comment-dots"></i> <em>${c.wardRemarks}</em></div>` : ""}      </div>      <div class="acr-right-col">        <div class="acr-vote-badge">          <i class="fa-solid fa-circle-up"></i>          <span class="acr-vote-num">${c.upvotes}</span>          <span class="acr-vote-label">votes</span>        </div>        <div class="acr-priority-score">          <span>${priorityScore}</span>          <small>priority pts</small>        </div>        <div class="acr-actions">${actionBtns}</div>      </div>    `;    container.appendChild(div);  });}function adminApprove(id) {  const complaint = appState.complaints.find(c => c.id === id);  if (!complaint) return;  const remarks = prompt("Approve complaint #" + id + "?\nEnter admin approval remarks:", "Verified and approved by System Administrator.");  if (remarks === null) return;  complaint.status = "APPROVED";  complaint.wardRemarks = "[Admin Override] " + remarks;  addNotification(complaint.citizenId, id, "Admin approved your grievance #" + id + ". Remarks: " + remarks, "WARD_APPROVAL");  persistState();  renderAdminPortal();  showToast("Grievance #" + id + " approved by Admin!", "success");}function adminReject(id) {  const complaint = appState.complaints.find(c => c.id === id);  if (!complaint) return;  const reason = prompt("Reject complaint #" + id + "?\nEnter rejection reason:", "Rejected by System Administrator after review.");  if (reason === null) return;  complaint.status = "REJECTED";  complaint.wardRemarks = "[Admin Override] " + reason;  addNotification(complaint.citizenId, id, "Admin rejected your grievance #" + id + ". Reason: " + reason, "STATUS_CHANGE");  persistState();  renderAdminPortal();  showToast("Grievance #" + id + " rejected by Admin.", "info");}function adminResolve(id) {  const complaint = appState.complaints.find(c => c.id === id);  if (!complaint) return;  const remarks = prompt("Mark complaint #" + id + " as RESOLVED?\nEnter resolution details:", "Issue resolved by municipal action team. Verified by Admin.");  if (remarks === null) return;  complaint.status = "RESOLVED";  complaint.wardRemarks = "[Admin Resolved] " + remarks;  addNotification(complaint.citizenId, id, "Your grievance #" + id + " has been marked RESOLVED. " + remarks, "STATUS_CHANGE");  persistState();  renderAdminPortal();  showToast("Grievance #" + id + " marked as Resolved!", "success");}

// ==========================================
// 12. UTILITY FUNCTIONS
// ==========================================
function addNotification(userId, complaintId, message, type) {  const newNotif = { id: `N${Date.now()}`, userId, complaintId, message, type, time: "Just now" };  appState.notifications.unshift(newNotif);  persistState();  renderNotifications();}function renderNotifications() {  const list = document.getElementById("notification-list");  document.getElementById("notification-count").innerText = appState.notifications.length;  if (appState.notifications.length === 0) {    list.innerHTML = `<div style="padding:20px; text-align:center; color:#64748b; font-size:0.82rem;">No new notifications</div>`;    return;  }  list.innerHTML = appState.notifications.map(n => `    <div class="notif-item">      <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>      <div class="notif-content">        <p>${n.message}</p>        <span class="notif-time">${n.time}</span>      </div>    </div>  `).join('');}function toggleNotificationDrawer() {  document.getElementById("notification-drawer").classList.toggle("hidden");}function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => {
    m.classList.add("hidden");
    if (m.id !== "auth-overlay") m.style.display = "none";
  });
}function formatStatus(status) {  return status.replace(/_/g, ' ');}function showToast(message, type = "info") {  const container = document.getElementById("toast-container");  const toast = document.createElement("div");  toast.className = `toast toast-${type}`;  toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;  container.appendChild(toast);  setTimeout(() => {    toast.remove();  }, 4000);}