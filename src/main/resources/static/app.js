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
  if (typeof window !== "undefined" && typeof window._logoutCitizenBridge === "function") {
    window._logoutCitizenBridge();
    return;
  }
  if (typeof auth !== "undefined" && auth && typeof auth.signOut === "function") {
    auth.signOut().catch(function(e) { console.error("Firebase logout error:", e); });
  }
  window._loggedInCitizen = null;
  try {
    localStorage.removeItem("cgms_logged_in");
    sessionStorage.removeItem("cgms_logged_in");
  } catch(e){}
  var loginBtn = document.getElementById("btn-citizen-login");
  var card     = document.getElementById("citizen-profile-card");
  if (loginBtn) {
    loginBtn.classList.remove("hidden");
    loginBtn.style.display = "flex";
  }
  if (card) {
    card.classList.add("hidden");
    card.style.display = "none";
  }
  if (typeof showToast === "function") {
    showToast("You have been logged out.", "info");
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
let appState = {  currentRole: "CITIZEN",  currentUser: INITIAL_USERS.CITIZEN,  complaints: JSON.parse(localStorage.getItem("jansuraksha_complaints")) || INITIAL_COMPLAINTS,  notifications: JSON.parse(localStorage.getItem("jansuraksha_notifs")) || INITIAL_NOTIFICATIONS,  upvotedIds: JSON.parse(localStorage.getItem("jansuraksha_upvotes")) || ["CMP-1001"],  aiThresholds: { text: 0.40, distanceMeters: 500 },  citizenFilterCategory: "ALL",  citizenFilterTab: "PUBLIC",  groupMode: "GROUPED",  searchQuery: "",  selectedPhotoUrl: null,  adminAuthenticated: false, /* Admin must login each session */
  wardMemberFilterWard: "ALL",
  presidentSortMode: "NEWEST",
  presidentWardFilter: "ALL"
};

// Save to LocalStorage
function persistState() {
  try {
    localStorage.setItem("jansuraksha_complaints", JSON.stringify(appState.complaints));
    localStorage.setItem("jansuraksha_notifs", JSON.stringify(appState.notifications));
    localStorage.setItem("jansuraksha_upvotes", JSON.stringify(appState.upvotedIds));
  } catch (e) {
    console.warn("Storage quota exceeded or private mode, state retained in memory:", e);
  }
}

// Priority Calculation Formula (Matching Java Strategy Pattern)
// Clean object helper so Firestore doesn't fail on undefined
function cleanObjectForFirestore(obj) {
  return JSON.parse(JSON.stringify(obj, function(key, value) { return value === undefined ? null : value; }));
}

// Synchronize individual complaint document to Cloud Firestore
function syncComplaintToFirestore(complaint) {
  if (typeof firebase !== "undefined" && firebase.firestore && complaint && complaint.id) {
    try {
      var db = firebase.firestore();
      var cleanData = cleanObjectForFirestore(complaint);
      db.collection("complaints").doc(complaint.id).set(cleanData, { merge: true })
        .then(function() { console.log("Synced #" + complaint.id + " to Cloud Firestore"); })
        .catch(function(err) { console.error("Firestore sync error for #" + complaint.id + ":", err); });
    } catch (e) {
      console.error("Firestore sync exception:", e);
    }
  }
}

// Real-time synchronization with Cloud Firestore
function initFirestoreSync() {
  if (typeof firebase === "undefined" || !firebase.firestore) {
    console.warn("Firestore SDK not loaded yet");
    return;
  }
  try {
    var db = firebase.firestore();
    console.log("Subscribing to real-time Cloud Firestore updates...");
    db.collection("complaints").onSnapshot(function(snapshot) {
      if (snapshot.empty) {
        console.log("Firestore complaints collection is empty. Seeding initial complaints...");
        var batch = db.batch();
        INITIAL_COMPLAINTS.forEach(function(c) {
          var docRef = db.collection("complaints").doc(c.id);
          batch.set(docRef, cleanObjectForFirestore(c));
        });
        batch.commit().catch(function(err) { console.error("Error seeding initial complaints:", err); });
        return;
      }

      var remoteComplaints = [];
      snapshot.forEach(function(doc) {
        var data = doc.data();
        if (data && data.id) {
          remoteComplaints.push(data);
        }
      });

      // Sort newest first safely across all browsers
      remoteComplaints.sort(function(a, b) {
        var timeA = parseComplaintDate(a.createdAt);
        var timeB = parseComplaintDate(b.createdAt);
        return (timeB || 0) - (timeA || 0);
      });

      // Merge any pending local un-synced complaints so they are never lost
      var remoteIds = new Set(remoteComplaints.map(function(c) { return c.id; }));
      var localPending = (appState.complaints || []).filter(function(c) { return c && c.id && !remoteIds.has(c.id); });
      appState.complaints = localPending.concat(remoteComplaints);
      persistState();
      renderRoleView();
      if (appState.currentRole === "ADMIN") {
        renderAdminPortal();
      }
      console.log("Synced " + remoteComplaints.length + " complaints live from Cloud Firestore.");
    }, function(error) {
      console.warn("Firestore real-time sync warning:", error);
    });
  } catch (err) {
    console.warn("initFirestoreSync failed:", err);
  }
}

function calculatePriorityScore(c) {
  if (!c) return "0.0";
  const categoryWeights = {
    "Electricity": 1.5, "Sewage": 1.5, "Water Supply": 1.5,
    "Road Damage": 1.3, "Drainage": 1.3,
    "Tree Removal": 1.2, "Garbage": 1.2,
    "Streetlight": 1.1, "Public Toilet": 1.1, "Others": 1.0
  };
  const urgencyMultipliers = { "CRITICAL": 2.0, "HIGH": 1.5, "MEDIUM": 1.2, "LOW": 1.0 };
  const baseWeight = categoryWeights[c.category] || 1.0;
  const mult = urgencyMultipliers[c.urgency] || 1.0;
  const upvotes = typeof c.upvotes === "number" ? c.upvotes : (parseInt(c.upvotes, 10) || 0);
  return ((baseWeight * mult * 10) + (upvotes * 2.5)).toFixed(1);
}

function changeWardFilter(wardId) {
  appState.wardMemberFilterWard = wardId;
  renderWardMemberPortal();
}

function changePresSort(sortMode) {
  appState.presidentSortMode = sortMode;
  renderPresidentPortal();
}

function changePresWard(wardId) {
  appState.presidentWardFilter = wardId;
  renderPresidentPortal();
}

// ==========================================
// 2. DOM INITIALIZATION & EVENT LISTENERS
// ==========================================
function initApp() {
  try {
    localStorage.removeItem("cgms_logged_in");
    sessionStorage.removeItem("cgms_logged_in");
  } catch(e) {}

  setupEventListeners();
  renderRoleView();
  renderNotifications();
  updateCitizenHeader();
  initFirestoreSync();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}function setupEventListeners() {
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
  on("btn-citizen-logout", "click", (e) => { e.preventDefault(); logoutCitizen(); });

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
  on("citizen-group-mode", "change", (e) => {
    appState.groupMode = e.target.value;
    renderCitizenFeed();
  });
  on("input-title", "input", checkForSimilarSubmissions);
  on("input-category", "change", checkForSimilarSubmissions);

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

// ==========================================
// CATEGORY METADATA & SIMILARITY GROUPING
// ==========================================
const CATEGORY_META = {
  "Road Damage":   { icon: "fa-road", color: "#f59e0b", label: "Road & Pavement Damage" },
  "Streetlight":   { icon: "fa-lightbulb", color: "#eab308", label: "Streetlights & Lighting" },
  "Water Supply":  { icon: "fa-faucet-drip", color: "#06b6d4", label: "Drinking Water Supply" },
  "Drainage":      { icon: "fa-water", color: "#3b82f6", label: "Stormwater Drainage" },
  "Garbage":       { icon: "fa-trash-can", color: "#10b981", label: "Waste & Garbage Management" },
  "Electricity":   { icon: "fa-bolt", color: "#8b5cf6", label: "Electrical & Grid Issues" },
  "Sewage":        { icon: "fa-biohazard", color: "#ec4899", label: "Sewage & Sanitation" },
  "Public Toilet": { icon: "fa-restroom", color: "#14b8a6", label: "Public Restrooms" },
  "Tree Removal":  { icon: "fa-tree", color: "#84cc16", label: "Fallen Trees & Overgrowth" },
  "Others":        { icon: "fa-circle-exclamation", color: "#94a3b8", label: "General & Miscellaneous" }
};

// Finds similar complaints within the same category
function findSimilarComplaints(c, pool) {
  if (!pool) pool = appState.complaints;
  var targetWords = (c.title + " " + (c.description || "")).toLowerCase().split(/\W+/).filter(function(w) { return w.length > 3; });
  return pool.filter(function(other) {
    if (other.id === c.id || other.isMerged) return false;
    if (other.category !== c.category) return false;

    // Check textual Jaccard similarity
    var textSim = calculateJaccardSimilarity(c.title + " " + (c.description || ""), other.title + " " + (other.description || ""));
    if (textSim >= 0.20) return true;

    // Check matching keywords in same ward
    if (other.wardId === c.wardId) {
      var otherText = (other.title + " " + (other.description || "")).toLowerCase();
      var common = targetWords.filter(function(w) { return otherText.includes(w); });
      if (common.length >= 2) return true;
    }

    // Check geographic proximity (< 1km)
    if (c.lat && c.lng && other.lat && other.lng) {
      var dist = calculateHaversineDistance(c.lat, c.lng, other.lat, other.lng);
      if (dist <= 1000 && textSim >= 0.12) return true;
    }
    return false;
  });
}

// Toggle similar complaints dropdown in a card
function toggleSimilarExpand(complaintId) {
  var el = document.getElementById("cluster-items-" + complaintId);
  var ch = document.getElementById("cluster-chevron-" + complaintId);
  if (el) {
    var isHidden = el.classList.toggle("hidden");
    if (ch) {
      ch.style.transform = isHidden ? "rotate(0deg)" : "rotate(180deg)";
    }
  }
}

// Real-time check in Submit Grievance modal for existing similar complaints
function checkForSimilarSubmissions() {
  var titleEl = document.getElementById("input-title");
  var catEl = document.getElementById("input-category");
  var box = document.getElementById("submit-similar-box");
  if (!titleEl || !catEl || !box) return;

  var title = titleEl.value.trim();
  var category = catEl.value;
  if (!title || title.length < 4) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }

  var temp = { id: "TEMP", title: title, description: title, category: category, wardId: "" };
  var matches = findSimilarComplaints(temp, appState.complaints);
  if (matches.length === 0) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }

  box.classList.remove("hidden");
  box.innerHTML = '<div class="ssb-header"><i class="fa-solid fa-lightbulb"></i> ' + matches.length + ' Similar Grievance' + (matches.length > 1 ? 's' : '') + ' found under "' + category + '":</div>' +
    matches.slice(0, 3).map(function(m) {
      return '<div class="ssb-item">' +
        '<div>' +
          '<span style="font-weight:800;color:#60a5fa;margin-right:6px;">#' + m.id + '</span>' +
          '<span class="ssb-title">' + m.title + '</span>' +
          '<div style="font-size:0.72rem;color:#94a3b8;margin-top:2px;"><i class="fa-solid fa-circle-up"></i> ' + m.upvotes + ' community upvotes • ' + m.location + '</div>' +
        '</div>' +
        '<button type="button" class="ssb-btn" onclick="upvoteExistingFromModal(\'' + m.id + '\')"><i class="fa-solid fa-circle-up"></i> Upvote Existing</button>' +
      '</div>';
    }).join('');
}

function upvoteExistingFromModal(id) {
  toggleUpvote(id);
  closeAllModals();
  showToast("Upvoted existing grievance #" + id + "! No duplicate created.", "success");
}

// Helper to render an individual complaint card
function createComplaintCardHtml(c, pool) {
  var isUpvoted = Array.isArray(appState.upvotedIds) && appState.upvotedIds.includes(c.id);
  var similarList = findSimilarComplaints(c, pool);

  var similarClusterHtml = "";
  if (similarList.length > 0) {
    similarClusterHtml = '<div class="card-similar-cluster">' +
      '<div class="cluster-summary-bar" onclick="toggleSimilarExpand(\'' + c.id + '\')">' +
        '<span><i class="fa-solid fa-layer-group"></i> <strong>' + similarList.length + ' Similar Grievance' + (similarList.length > 1 ? 's' : '') + ' in this Category</strong></span>' +
        '<span class="cluster-toggle-btn"><i class="fa-solid fa-chevron-down" id="cluster-chevron-' + c.id + '"></i></span>' +
      '</div>' +
      '<div id="cluster-items-' + c.id + '" class="cluster-items hidden">' +
        similarList.map(function(s) {
          return '<div class="cluster-item-row">' +
            '<div class="cir-info">' +
              '<div><span class="cir-id">#' + s.id + '</span><span class="cir-title">' + (s.title || '') + '</span></div>' +
              '<span class="cir-author"><i class="fa-solid fa-user-circle"></i> ' + (s.citizenName || 'Citizen') + ' • <i class="fa-solid fa-location-dot"></i> ' + (s.location || '') + '</span>' +
            '</div>' +
            '<button class="cir-upvote-btn" onclick="toggleUpvote(\'' + s.id + '\')">' +
              '<i class="fa-solid fa-circle-up"></i> ' + (s.upvotes || 0) +
            '</button>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  var fallbackImg = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600";
  var photo = c.photoUrl || fallbackImg;
  var statusStr = c.status || "SUBMITTED";

  return '<div class="complaint-card">' +
    '<div class="card-image-wrap">' +
      '<img src="' + photo + '" alt="' + (c.title || 'Grievance') + '" onerror="this.onerror=null; this.src=\'' + fallbackImg + '\';" />' +
      '<span class="category-tag"><i class="fa-solid fa-tag"></i> ' + (c.category || 'General') + '</span>' +
      '<span class="urgency-tag ' + (c.urgency || 'MEDIUM') + '">' + (c.urgency || 'MEDIUM') + '</span>' +
    '</div>' +
    '<div class="card-body">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
        '<span style="font-size:0.72rem; color:#64748b; font-weight:700;">#' + c.id + '</span>' +
        '<span class="status-pill status-' + statusStr + '">' + formatStatus(statusStr) + '</span>' +
      '</div>' +
      '<h3 class="card-title">' + (c.title || 'Untitled Grievance') + '</h3>' +
      '<div class="card-meta">' +
        '<span><i class="fa-solid fa-user-circle"></i> <strong>' + (c.citizenName || 'Citizen') + '</strong></span>' +
        '<span><i class="fa-solid fa-location-dot"></i> ' + (c.location || '') + '</span>' +
        '<span><i class="fa-solid fa-layer-group"></i> ' + (c.wardName || c.wardId || 'Ward') + '</span>' +
      '</div>' +
      '<p class="card-desc">' + (c.description || '') + '</p>' +
      similarClusterHtml +
      '<div class="card-footer">' +
        '<button class="btn-upvote ' + (isUpvoted ? 'upvoted' : '') + '" onclick="toggleUpvote(\'' + c.id + '\')">' +
          '<i class="fa-solid fa-circle-up"></i> ' + (c.upvotes || 0) + ' Upvotes' +
        '</button>' +
        '<button class="btn-track" onclick="openTrackingModal(\'' + c.id + '\')">' +
          '<i class="fa-solid fa-timeline"></i> Track Status' +
        '</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderCitizenFeed() {
  const container = document.getElementById("citizen-complaints-grid");
  if (!container) return;
  container.innerHTML = "";
  let list = appState.complaints.filter(c => !c.isMerged);

  /* Always sort newest first */
  list.sort(function(a, b) {
    var timeA = parseComplaintDate(a.createdAt);
    var timeB = parseComplaintDate(b.createdAt);
    return (timeB || 0) - (timeA || 0);
  });

  /* Filter by Tab */
  if (appState.citizenFilterTab === "MY_COMPLAINTS") {
    var loggedIn = getLoggedInCitizen();
    var currentUid = loggedIn ? loggedIn.id : (appState.currentUser ? appState.currentUser.id : null);
    var currentEmail = loggedIn ? loggedIn.email : null;
    list = list.filter(function(c) {
      return (currentUid && c.citizenId === currentUid) ||
             (currentEmail && c.citizenEmail && c.citizenEmail.toLowerCase() === currentEmail.toLowerCase());
    });
  }

  /* Filter by Category */
  if (appState.citizenFilterCategory !== "ALL") {
    list = list.filter(c => c.category === appState.citizenFilterCategory);
  }

  /* Search Query */
  if (appState.searchQuery) {
    list = list.filter(c => 
      c.title.toLowerCase().includes(appState.searchQuery) ||
      c.description.toLowerCase().includes(appState.searchQuery) ||
      c.location.toLowerCase().includes(appState.searchQuery)
    );
  }

  if (list.length === 0) {
    container.innerHTML = '<div class="glass-panel text-center py-8 full-width" style="grid-column: 1 / -1; padding: 40px; width: 100%;">' +
      '<i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: #64748b; margin-bottom: 12px; display:block;"></i>' +
      '<h4 style="color: #94a3b8;">No Grievances Found</h4>' +
      '<p style="color: #64748b; font-size: 0.85rem; margin-top:4px;">Try adjusting search filters or file a new grievance.</p>' +
    '</div>';
    return;
  }

  // 1. FLAT VIEW MODE
  if (appState.groupMode === "FLAT") {
    var gridDiv = document.createElement("div");
    gridDiv.className = "complaints-grid";
    gridDiv.innerHTML = list.map(c => createComplaintCardHtml(c, list)).join('');
    container.appendChild(gridDiv);
    return;
  }

  // 2. CATEGORY GROUPED VIEW MODE (Default)
  // Group complaints by their category
  var categories = {};
  list.forEach(function(c) {
    var catName = c.category || "Others";
    if (!categories[catName]) categories[catName] = [];
    categories[catName].push(c);
  });

  // Render each category section
  Object.keys(categories).forEach(function(catName) {
    var catComplaints = categories[catName];
    var meta = CATEGORY_META[catName] || { icon: "fa-tag", color: "#60a5fa", label: catName };
    var totalVotes = catComplaints.reduce(function(sum, item) { return sum + (item.upvotes || 0); }, 0);

    // Calculate how many complaints in this category have similar counterparts
    var similarCount = 0;
    catComplaints.forEach(function(c) {
      if (findSimilarComplaints(c, catComplaints).length > 0) similarCount++;
    });

    var section = document.createElement("div");
    section.className = "category-feed-section";
    section.innerHTML = 
      '<div class="category-section-header">' +
        '<div class="csh-left">' +
          '<div class="csh-icon" style="background: ' + meta.color + '20; color: ' + meta.color + ';">' +
            '<i class="fa-solid ' + meta.icon + '"></i>' +
          '</div>' +
          '<div>' +
            '<h3 class="csh-title">' + meta.label + '</h3>' +
            '<span class="csh-subtitle">' + catComplaints.length + ' active grievance' + (catComplaints.length > 1 ? 's' : '') + ' under this category</span>' +
          '</div>' +
        '</div>' +
        '<div class="csh-stats">' +
          '<span class="csh-stat-pill"><i class="fa-solid fa-circle-up"></i> ' + totalVotes + ' Total Upvotes</span>' +
          (similarCount > 0 ? '<span class="csh-cluster-pill"><i class="fa-solid fa-layer-group"></i> ' + similarCount + ' Similar Reports Grouped</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="complaints-grid">' +
        catComplaints.map(function(c) { return createComplaintCardHtml(c, catComplaints); }).join('') +
      '</div>';

    container.appendChild(section);
  });
}

function toggleUpvote(complaintId) {
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
  syncComplaintToFirestore(complaint);
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
}function handlePhotoSelection(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // Compress to max 800x800 and 70% JPEG quality to prevent QuotaExceededError
      const maxDim = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      const compressedUrl = canvas.toDataURL("image/jpeg", 0.7);

      appState.selectedPhotoUrl = compressedUrl;
      const previewImg = document.getElementById("photo-preview-img");
      const previewContainer = document.getElementById("photo-preview-container");
      if (previewImg) previewImg.src = compressedUrl;
      if (previewContainer) previewContainer.classList.remove("hidden");
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}function removePhotoSelection() {  appState.selectedPhotoUrl = null;  document.getElementById("input-photo").value = "";  document.getElementById("photo-preview-container").classList.add("hidden");}function handleComplaintSubmit(e) {
  e.preventDefault();
  var loggedIn = getLoggedInCitizen();
  if (!loggedIn) {
    var guestName = prompt("You are not logged in. Enter your name to post this grievance (or click Cancel to Login with an account):", "Resident Citizen");
    if (!guestName || !guestName.trim()) {
      if (typeof openAuthModal === "function") openAuthModal("login");
      if (typeof showToast === "function") showToast("Please login or provide your name to post a grievance.", "info");
      return;
    }
    loggedIn = {
      id: "GUEST-" + Date.now(),
      username: guestName.trim(),
      email: "citizen@panchayath.gov",
      initials: guestName.trim().substring(0, 2).toUpperCase()
    };
  }

  const title = (document.getElementById("input-title")?.value || "").trim();
  const category = document.getElementById("input-category")?.value || "Others";
  const wardId = document.getElementById("input-ward")?.value || "W1";
  const location = (document.getElementById("input-location")?.value || "").trim();
  const urgency = document.getElementById("input-urgency")?.value || "MEDIUM";
  const description = (document.getElementById("input-description")?.value || "").trim();
  const wardNames = { "W1": "Ward 1 - Green Valley", "W2": "Ward 2 - Lakeview", "W3": "Ward 3 - Market Square", "W4": "Ward 4 - Hill Top" };
  
  const fallbackPhotos = {
    "Road Damage": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600",
    "Streetlight": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600",
    "Water Supply": "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600",
    "Garbage": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600"
  };

  const maxNum = (appState.complaints || []).reduce(function(max, c) {
    var m = c.id && c.id.match(/^CMP-(\d+)$/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 1000);
  
  const newId = `CMP-${maxNum + 1}`;
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd} ${hh}:${min}`;

  const newComplaint = {
    id: newId,
    title: title || "Grievance Report",
    category: category,
    description: description || "No detailed description provided.",
    location: location || "Local Panchayath Area",
    lat: 10.5230 + (Math.random() * 0.01),
    lng: 76.2140 + (Math.random() * 0.01),
    wardId: wardId,
    wardName: wardNames[wardId] || "Ward 1 - Green Valley",
    citizenId: loggedIn.id,
    citizenName: loggedIn.username,
    citizenEmail: loggedIn.email,
    urgency: urgency,
    status: "SUBMITTED",
    upvotes: 1,
    assignedDepartment: "Unassigned",
    wardRemarks: "Pending Ward Member field assessment. Published live on Public Feed.",
    photoUrl: appState.selectedPhotoUrl || fallbackPhotos[category] || fallbackPhotos["Road Damage"],
    createdAt: dateStr,
    isMerged: false,
    childIds: []
  };

  appState.complaints.unshift(newComplaint);
  if (!appState.upvotedIds.includes(newId)) {
    appState.upvotedIds.push(newId);
  }

  // Push to Cloud Firestore
  syncComplaintToFirestore(newComplaint);

  /* Ensure user is viewing Public Feed so grievance shows up immediately */
  appState.currentRole = "CITIZEN";
  appState.citizenFilterTab = "PUBLIC";
  appState.citizenFilterCategory = "ALL";
  appState.searchQuery = "";

  var tabSel = document.getElementById("citizen-tab-filter");
  if (tabSel) tabSel.value = "PUBLIC";
  var catSel = document.getElementById("citizen-category-filter");
  if (catSel) catSel.value = "ALL";
  var sInp = document.getElementById("citizen-search");
  if (sInp) sInp.value = "";

  addNotification(loggedIn.id, newId, `Grievance #${newId} is live on the home page! Public community upvoting active.`, "STATUS_CHANGE");
  addNotification("U401", newId, `📢 Grievance #${newId} posted by ${loggedIn.username}: "${newComplaint.title}" (${category} • ${urgency})`, "NEW_COMPLAINT");

  persistState();
  closeAllModals();
  renderRoleView();
  showToast(`Grievance #${newId} posted! Live on homepage feed.`, "success");

  const formEl = document.getElementById("form-submit-complaint");
  if (formEl) formEl.reset();
  removePhotoSelection();
}

// ==========================================
// 6. WARD MEMBER PORTAL LOGIC
// ==========================================
function renderWardMemberPortal() {
  const selectedWard = appState.wardMemberFilterWard || "ALL";
  const wardSelect = document.getElementById("ward-filter-select");
  if (wardSelect) wardSelect.value = selectedWard;

  let wardComplaints = appState.complaints.filter(c => !c.isMerged);
  if (selectedWard !== "ALL") {
    wardComplaints = wardComplaints.filter(c => c.wardId === selectedWard);
  }

  // Pending review includes SUBMITTED, UNDER_WARD_REVIEW, or complaints awaiting ward member remarks
  const pending = wardComplaints.filter(c => 
    c.status === "SUBMITTED" || 
    c.status === "UNDER_WARD_REVIEW" || 
    !c.wardRemarks || 
    c.wardRemarks.includes("Pending Ward Member") ||
    c.wardRemarks.includes("Verified and published directly")
  );
  const approved = wardComplaints.filter(c => 
    (c.status === "APPROVED" || c.status === "IN_PROGRESS" || c.status === "RESOLVED") &&
    c.wardRemarks && !c.wardRemarks.includes("Pending Ward Member") && !c.wardRemarks.includes("Verified and published directly")
  );
  const rejected = wardComplaints.filter(c => c.status === "REJECTED");

  const pendingEl = document.getElementById("ward-pending-count");
  const approvedEl = document.getElementById("ward-approved-count");
  const rejectedEl = document.getElementById("ward-rejected-count");
  if (pendingEl) pendingEl.innerText = pending.length;
  if (approvedEl) approvedEl.innerText = approved.length;
  if (rejectedEl) rejectedEl.innerText = rejected.length;

  const container = document.getElementById("ward-complaints-list");
  if (!container) return;
  container.innerHTML = "";

  if (wardComplaints.length === 0) {
    const wardNameStr = selectedWard === "ALL" ? "any ward" : selectedWard;
    container.innerHTML = `<div class="p-6 text-center text-muted" style="padding: 30px; color: #94a3b8;"><i class="fa-solid fa-folder-open" style="font-size:2rem; margin-bottom:8px; display:block;"></i>No grievances found for ${wardNameStr}.</div>`;
    return;
  }

  // Always sort newest first
  wardComplaints.sort(function(a, b) {
    var timeA = a.createdAt ? new Date(a.createdAt.replace(" ", "T")).getTime() : 0;
    var timeB = b.createdAt ? new Date(b.createdAt.replace(" ", "T")).getTime() : 0;
    return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
  });

  wardComplaints.forEach(c => {
    const item = document.createElement("div");
    item.className = "ward-item";
    const isNew = c.status === "SUBMITTED" || !c.wardRemarks || c.wardRemarks.includes("Pending");
    const canAssess = c.status === "SUBMITTED" || c.status === "UNDER_WARD_REVIEW" || !c.wardRemarks || c.wardRemarks.includes("Pending") || c.wardRemarks.includes("Verified and published directly");

    item.innerHTML = `
      <div class="ward-item-details">
        <div style="display:flex; gap:10px; align-items:center; margin-bottom:4px; flex-wrap:wrap;">
          ${isNew ? `<span class="acr-new-badge"><i class="fa-solid fa-bolt"></i> NEW</span>` : ""}
          <span style="font-weight:800; color:#3b82f6;">#${c.id}</span>
          <span class="status-pill status-${c.status || 'SUBMITTED'}">${formatStatus(c.status || 'SUBMITTED')}</span>
          <span class="urgency-tag ${c.urgency || 'MEDIUM'}">${c.urgency || 'MEDIUM'}</span>
          <span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:6px; color:#94a3b8;">
            <i class="fa-solid fa-map-pin"></i> ${c.wardName || c.wardId || 'Ward'}
          </span>
        </div>
        <h4 class="ward-item-title">${c.title}</h4>
        <div class="ward-item-sub">
          <span><i class="fa-solid fa-user-circle"></i> <strong>${c.citizenName || 'Citizen'}</strong>${c.citizenEmail ? ` <em class="acr-email">${c.citizenEmail}</em>` : ""}</span>
          <span><i class="fa-solid fa-location-dot"></i> ${c.location || 'Location'}</span>
          <span><i class="fa-solid fa-tag"></i> ${c.category || 'General'}</span>
          <span><i class="fa-solid fa-circle-up"></i> ${c.upvotes || 0} Upvotes</span>
          <span><i class="fa-solid fa-clock"></i> ${c.createdAt || ''}</span>
        </div>
        ${c.wardRemarks ? `<p style="font-size:0.8rem; color:#a78bfa; margin-top:6px;"><i class="fa-solid fa-comment-dots"></i> Remark: ${c.wardRemarks}</p>` : ''}
      </div>
      <div class="ward-actions">
        ${canAssess ? `
          <button class="btn-sm-approve" onclick="wardApprove('${c.id}')"><i class="fa-solid fa-check"></i> Field Assessment / Approve</button>
          <button class="btn-sm-reject" onclick="wardReject('${c.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
        ` : `<span style="font-size:0.8rem; color:#94a3b8; font-weight:600;"><i class="fa-solid fa-clipboard-check"></i> Assessment Recorded</span>`}
      </div>
    `;
    container.appendChild(item);
  });
}

function wardApprove(id) {
  const remarks = prompt("Enter Field Assessment Remarks for Approval:", "Field verified by Ward Member. Genuine grievance.");
  if (remarks === null) return;
  const complaint = appState.complaints.find(c => c.id === id);
  if (complaint) {
    complaint.status = "APPROVED";
    complaint.wardRemarks = remarks;
    syncComplaintToFirestore(complaint);
    addNotification(complaint.citizenId, id, `Ward Member approved grievance #${id}. Remarks: "${remarks}"`, "WARD_APPROVAL");
    persistState();
    renderWardMemberPortal();
    showToast(`Approved #${id} and forwarded to President Dashboard`, "success");
  }
}

function wardReject(id) {
  const remarks = prompt("Enter Reason for Rejection:", "Invalid or duplicate claim upon physical inspection.");
  if (remarks === null) return;
  const complaint = appState.complaints.find(c => c.id === id);
  if (complaint) {
    complaint.status = "REJECTED";
    complaint.wardRemarks = remarks;
    syncComplaintToFirestore(complaint);
    addNotification(complaint.citizenId, id, `Grievance #${id} was rejected by Ward Member. Reason: "${remarks}"`, "STATUS_CHANGE");
    persistState();
    renderWardMemberPortal();
    showToast(`Rejected #${id}`, "info");
  }
}

// ==========================================
// 7. PANCHAYATH PRESIDENT PORTAL & DEPT ASSIGNMENT
// ==========================================
function renderPresidentPortal() {
  const selectedWard = appState.presidentWardFilter || "ALL";
  const sortMode = appState.presidentSortMode || "NEWEST";

  const sortSelect = document.getElementById("pres-sort-mode");
  if (sortSelect) sortSelect.value = sortMode;
  const wardSelect = document.getElementById("pres-ward-filter");
  if (wardSelect) wardSelect.value = selectedWard;

  let complaints = appState.complaints.filter(c => !c.isMerged);
  if (selectedWard !== "ALL") {
    complaints = complaints.filter(c => c.wardId === selectedWard);
  }

  const total = complaints.length;
  const critical = complaints.filter(c => c.urgency === "CRITICAL" || (c.upvotes || 0) >= 15).length;
  const inProgress = complaints.filter(c => c.status === "IN_PROGRESS").length;
  const merged = appState.complaints.filter(c => c.isMerged).length;

  const totalEl = document.getElementById("pres-total-count");
  const critEl = document.getElementById("pres-critical-count");
  const inProgEl = document.getElementById("pres-inprogress-count");
  const mergedEl = document.getElementById("pres-merged-count");
  if (totalEl) totalEl.innerText = total;
  if (critEl) critEl.innerText = critical;
  if (inProgEl) inProgEl.innerText = inProgress;
  if (mergedEl) mergedEl.innerText = merged;

  const tbody = document.getElementById("president-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  let sorted = [...complaints];
  if (sortMode === "NEWEST") {
    sorted.sort(function(a, b) {
      var timeA = a.createdAt ? new Date(a.createdAt.replace(" ", "T")).getTime() : 0;
      var timeB = b.createdAt ? new Date(b.createdAt.replace(" ", "T")).getTime() : 0;
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });
  } else if (sortMode === "PRIORITY") {
    sorted.sort((a, b) => parseFloat(calculatePriorityScore(b)) - parseFloat(calculatePriorityScore(a)));
  } else if (sortMode === "UNASSIGNED") {
    sorted.sort((a, b) => {
      const aUn = (!a.assignedDepartment || a.assignedDepartment === "Unassigned") ? 0 : 1;
      const bUn = (!b.assignedDepartment || b.assignedDepartment === "Unassigned") ? 0 : 1;
      return aUn - bUn;
    });
  }

  if (sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#94a3b8;"><i class="fa-solid fa-folder-open" style="font-size:1.8rem; margin-bottom:8px; display:block;"></i>No complaints found for the selected filter.</td></tr>`;
    return;
  }

  sorted.forEach(c => {
    const score = calculatePriorityScore(c);
    const tr = document.createElement("tr");
    const dept = c.assignedDepartment || "Unassigned";
    const isNew = c.status === "SUBMITTED" || !c.assignedDepartment || c.assignedDepartment === "Unassigned";

    tr.innerHTML = `
      <td style="font-weight:800; color:#60a5fa;">
        ${isNew ? `<span class="acr-new-badge" style="font-size:0.65rem; padding:2px 6px; margin-right:4px;"><i class="fa-solid fa-bolt"></i> NEW</span>` : ""}#${c.id}
      </td>
      <td>
        <div style="font-weight:700;">${c.title}</div>
        <div style="font-size:0.75rem; color:#94a3b8;">${c.category} • <i class="fa-solid fa-location-dot"></i> ${c.location || ''}</div>
      </td>
      <td><strong>${c.wardName || c.wardId || 'Ward'}</strong></td>
      <td><span class="priority-score-badge">${score} pts</span></td>
      <td><i class="fa-solid fa-circle-up" style="color:#60a5fa;"></i> <strong>${c.upvotes || 0}</strong></td>
      <td><span class="status-pill status-${c.status || 'SUBMITTED'}">${formatStatus(c.status || 'SUBMITTED')}</span></td>
      <td><strong style="color: ${dept !== 'Unassigned' ? '#34d399' : '#f59e0b'};">${dept}</strong></td>
      <td>
        <select class="form-select" onchange="assignDepartment('${c.id}', this.value)" style="padding:4px 8px; font-size:0.78rem;">
          <option value="">-- Assign Dept --</option>
          <option value="Public Works Dept (PWD)" ${(dept && typeof dept === 'string' && dept.includes("PWD")) ? "selected" : ""}>PWD Roads</option>
          <option value="Electrical Department" ${(dept && typeof dept === 'string' && dept.includes("Electrical")) ? "selected" : ""}>Electrical Dept</option>
          <option value="Water & Sanitation Dept" ${(dept && typeof dept === 'string' && dept.includes("Water")) ? "selected" : ""}>Water & Sanitation</option>
          <option value="Health & Environment" ${(dept && typeof dept === 'string' && dept.includes("Health")) ? "selected" : ""}>Health & Sanitation</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function assignDepartment(complaintId, deptName) {
  if (!deptName) return;
  const complaint = appState.complaints.find(c => c.id === complaintId);
  if (complaint) {
    complaint.assignedDepartment = deptName;
    complaint.status = "IN_PROGRESS";
    syncComplaintToFirestore(complaint);
    addNotification(complaint.citizenId, complaintId, `Panchayath President assigned #${complaintId} to ${deptName}. Action in progress.`, "DEPT_ASSIGNMENT");
    persistState();
    renderPresidentPortal();
    showToast(`Assigned #${complaintId} to ${deptName}`, "success");
  }
}

// ==========================================
// 8. AI COMPLAINT MERGING ENGINE
// ==========================================
function runAISimilarityScanner() {  const modal = document.getElementById("modal-ai-merge");  const container = document.getElementById("ai-merge-modal-body");  modal.classList.remove("hidden");  /* Jaccard similarity & distance calculation */  const openComplaints = appState.complaints.filter(c => !c.isMerged);  let matches = [];  for (let i = 0; i < openComplaints.length; i++) {    for (let j = i + 1; j < openComplaints.length; j++) {      const c1 = openComplaints[i];      const c2 = openComplaints[j];      if (c1.category === c2.category && c1.wardId === c2.wardId) {        const textSim = calculateJaccardSimilarity(c1.title + " " + c1.description, c2.title + " " + c2.description);        const distMeters = calculateHaversineDistance(c1.lat, c1.lng, c2.lat, c2.lng);        if (textSim >= appState.aiThresholds.text || distMeters <= appState.aiThresholds.distanceMeters) {          matches.push({ master: c1, duplicate: c2, textSim: (textSim * 100).toFixed(1), distMeters: distMeters.toFixed(0) });        }      }    }  }  if (matches.length === 0) {    container.innerHTML = `      <div class="text-center py-6">        <i class="fa-solid fa-circle-check" style="font-size:3rem; color:#34d399; margin-bottom:12px;"></i>        <h3>No Duplicate Complaints Detected</h3>        <p style="color:#94a3b8; font-size:0.9rem;">The AI scanner verified all active complaints. The database is clean and unique.</p>      </div>    `;    return;  }  container.innerHTML = `    <div style="background:rgba(236,72,153,0.1); border:1px solid rgba(236,72,153,0.3); padding:12px 16px; border-radius:12px; margin-bottom:16px;">      <h4 style="color:#f472b6;"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Engine Detected ${matches.length} Duplicate Match Pairs</h4>      <p style="font-size:0.8rem; color:#94a3b8;">Review suggestions below. Merging will aggregate upvotes into the Master ticket and clean authority queues.</p>    </div>  `;  matches.forEach(m => {    const card = document.createElement("div");    card.style.cssText = "background:rgba(15,23,42,0.8); border:1px solid var(--border-glass); border-radius:14px; padding:16px; margin-bottom:14px;";    card.innerHTML = `      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">        <span style="font-size:0.8rem; font-weight:700; color:#ec4899;">          <i class="fa-solid fa-bullseye"></i> Similarity: ${m.textSim}% Match • ${m.distMeters}m Distance        </span>        <button class="btn-ai" style="padding:6px 12px; font-size:0.78rem;" onclick="executeAIMerge('${m.duplicate.id}', '${m.master.id}')">          <i class="fa-solid fa-compress"></i> Auto-Merge into #${m.master.id}        </button>      </div>      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.82rem;">        <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px;">          <span style="color:#60a5fa; font-weight:800;">MASTER: #${m.master.id}</span>          <div style="font-weight:700; margin-top:2px;">${m.master.title}</div>          <div style="color:#94a3b8; font-size:0.75rem;">Upvotes: ${m.master.upvotes}</div>        </div>        <div style="background:rgba(239,68,68,0.1); padding:10px; border-radius:8px;">          <span style="color:#f87171; font-weight:800;">DUPLICATE: #${m.duplicate.id}</span>          <div style="font-weight:700; margin-top:2px;">${m.duplicate.title}</div>          <div style="color:#94a3b8; font-size:0.75rem;">Upvotes: ${m.duplicate.upvotes}</div>        </div>      </div>    `;    container.appendChild(card);  });}function executeAIMerge(duplicateId, masterId) {  const master = appState.complaints.find(c => c.id === masterId);  const duplicate = appState.complaints.find(c => c.id === duplicateId);  if (master && duplicate) {    duplicate.isMerged = true;    duplicate.masterComplaintId = masterId;    duplicate.status = "RESOLVED";    duplicate.wardRemarks = `Merged by AI Engine into Master Grievance #${masterId}`;    master.upvotes += duplicate.upvotes;    master.childIds.push(duplicateId);    syncComplaintToFirestore(master);    syncComplaintToFirestore(duplicate);    addNotification(duplicate.citizenId, duplicateId, `Your grievance #${duplicateId} was AI-merged into master ticket #${masterId}. Votes consolidated!`, "AI_MERGE");    persistState();    closeAllModals();    renderRoleView();    showToast(`Successfully merged #${duplicateId} into Master #${masterId}!`, "success");  }}// Jaccard similarity helperfunction calculateJaccardSimilarity(str1, str2) {  const set1 = new Set(str1.toLowerCase().split(/\W+/).filter(Boolean));  const set2 = new Set(str2.toLowerCase().split(/\W+/).filter(Boolean));  if (set1.size === 0 || set2.size === 0) return 0;    const intersection = new Set([...set1].filter(x => set2.has(x)));  const union = new Set([...set1, ...set2]);  return intersection.size / union.size;}// Haversine distance in metersfunction calculateHaversineDistance(lat1, lon1, lat2, lon2) {  const R = 6371000;  const dLat = (lat2 - lat1) * Math.PI / 180;  const dLon = (lon2 - lon1) * Math.PI / 180;  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *            Math.sin(dLon / 2) * Math.sin(dLon / 2);  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));  return R * c;}

// ==========================================
// 9. REAL-TIME TRACKING TIMELINE
// ==========================================
function openTrackingModal(complaintId) {  const c = appState.complaints.find(item => item.id === complaintId);  if (!c) return;  const modal = document.getElementById("modal-tracking");  const body = document.getElementById("tracking-modal-body");  modal.classList.remove("hidden");  const stages = [    { key: "SUBMITTED", label: "Transparent Submission", desc: `Grievance submitted by ${c.citizenName} on ${c.createdAt}` },    { key: "UNDER_WARD_REVIEW", label: "Ward Member Review", desc: c.wardRemarks || "Field evaluation by Ward Member" },    { key: "APPROVED", label: "Ward Approval", desc: "Approved by Ward Member & Priority Calculated" },    { key: "IN_PROGRESS", label: "Department Dispatch", desc: c.assignedDepartment !== "Unassigned" ? `Assigned to ${c.assignedDepartment}` : "Awaiting Department Allocation" },    { key: "RESOLVED", label: "Full Resolution", desc: c.status === "RESOLVED" ? "Resolved by Municipal Action Team" : "Final Inspection" }  ];  const currentIdx = stages.findIndex(s => s.key === c.status) > -1 ? stages.findIndex(s => s.key === c.status) : 1;  body.innerHTML = `    <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:12px; margin-bottom:16px;">      <div style="display:flex; justify-content:space-between; align-items:center;">        <h4 style="font-weight:800; font-size:1.1rem; color:#60a5fa;">#${c.id} - ${c.title}</h4>        <span class="status-pill status-${c.status}">${formatStatus(c.status)}</span>      </div>      <div style="font-size:0.82rem; color:#94a3b8; margin-top:6px;">        Location: ${c.location} • Ward: ${c.wardName} • Priority Score: ${calculatePriorityScore(c)} pts      </div>    </div>    <div class="timeline">      ${stages.map((st, i) => `        <div class="timeline-step ${i <= currentIdx ? 'completed' : ''} ${i === currentIdx ? 'active' : ''}">          <div class="timeline-icon"><i class="fa-solid ${i <= currentIdx ? 'fa-check' : 'fa-circle'}"></i></div>          <div class="timeline-content">            <h4>${st.label}</h4>            <p>${st.desc}</p>          </div>        </div>      `).join('')}    </div>  `;}

// ==========================================
// 10. JAVA CODE INSPECTOR & REPORT GENERATOR
// ==========================================
const JAVA_SOURCES = {
  "User.java": `package com.jansuraksha.model;

/**
 * Abstract Base Class representing a System User in Jan-Suraksha.
 * Demonstrates OOP Encapsulation and Polymorphism.
 */
public abstract class User {
    private String id;
    private String name;
    private String email;
    private String role; // Citizen, Ward Member, Panchayath President, Administrator
    private String avatar;

    public User(String id, String name, String email, String role, String avatar) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.avatar = avatar;
    }

    // Polymorphic method overridden by each subclass
    public abstract String getDashboardAccessLevel();

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getAvatar() { return avatar; }
}`,

  "Complaint.java": `package com.jansuraksha.model;

import java.util.ArrayList;
import java.util.List;

public class Complaint {
    private String id;
    private String title;
    private String category;
    private String description;
    private String location;
    private String wardName;
    private String citizenName;
    private String citizenEmail;
    private Urgency urgency;
    private ComplaintStatus status;
    private int upvotes;
    private String assignedDepartment;
    private String wardRemarks;
    private String photoUrl;
    private String createdAt;
    private boolean isMerged;
    private double priorityScore;
    private List<String> childIds = new ArrayList<>();

    // Domain entity encapsulating status transitions
    public void markAutoApproved() {
        this.status = ComplaintStatus.APPROVED;
        this.wardRemarks = "Verified and published directly on Public Feed.";
    }

    public void addUpvote() {
        this.upvotes += 1;
    }
}`,

  "ComplaintService.java": `package com.jansuraksha.service;

import com.jansuraksha.model.Complaint;
import com.jansuraksha.model.ComplaintStatus;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ComplaintService {
    private final Map<String, Complaint> store = new HashMap<>();

    public List<Complaint> getAllComplaints() {
        return store.values().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public Map<String, List<Complaint>> getComplaintsGroupedByCategory() {
        return getAllComplaints().stream()
            .filter(c -> !c.isMerged())
            .collect(Collectors.groupingBy(Complaint::getCategory));
    }

    public Complaint createComplaint(Complaint c) {
        c.markAutoApproved(); // Auto-publish without admin verification bottleneck
        store.put(c.getId(), c);
        return c;
    }
}`,

  "ComplaintController.java": `package com.jansuraksha.controller;

import com.jansuraksha.model.Complaint;
import com.jansuraksha.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAll() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<Complaint>>> getGrouped() {
        return ResponseEntity.ok(complaintService.getComplaintsGroupedByCategory());
    }

    @PostMapping
    public ResponseEntity<Complaint> create(@RequestBody Complaint complaint) {
        return ResponseEntity.ok(complaintService.createComplaint(complaint));
    }
}`,

  "AIMergingEngine.java": `package com.jansuraksha.service;

import java.util.Set;
import java.util.HashSet;

public class AIMergingEngine {

    // Jaccard similarity between two complaints
    public double calculateJaccardSimilarity(String s1, String s2) {
        Set<String> set1 = tokenize(s1);
        Set<String> set2 = tokenize(s2);
        if (set1.isEmpty() || set2.isEmpty()) return 0.0;
        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);
        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);
        return (double) intersection.size() / union.size();
    }

    // Haversine formula for spherical distance in meters
    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}`,

  "Main.java": `package com.jansuraksha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JanSurakshaApplication {
    public static void main(String[] args) {
        SpringApplication.run(JanSurakshaApplication.class, args);
        System.out.println("Jan-Suraksha Spring Boot Java Server running at http://localhost:8080/");
    }
}`
};function openJavaModal() {  document.getElementById("modal-java-code").classList.remove("hidden");  loadJavaSource("User.java");}function loadJavaSource(filename) {  document.getElementById("java-code-content").innerText = JAVA_SOURCES[filename] || "// Source file loading...";}function generatePanchayathReport() {  const reportText = `JAN-SURAKSHA PANCHAYATH GRIEVANCE COMPLIANCE REPORTGenerated Date: ${new Date().toLocaleString()}===================================================Total Grievances Filed: ${appState.complaints.length}Resolved Grievances: ${appState.complaints.filter(c => c.status === "RESOLVED").length}In Progress (Dept Action): ${appState.complaints.filter(c => c.status === "IN_PROGRESS").length}AI Merged Duplicates: ${appState.complaints.filter(c => c.isMerged).length}Community Upvotes Cast: ${appState.complaints.reduce((acc, c) => acc + c.upvotes, 0)}Category Breakdown:- Road Damage: ${appState.complaints.filter(c => c.category === "Road Damage").length}- Water Supply: ${appState.complaints.filter(c => c.category === "Water Supply").length}- Streetlight: ${appState.complaints.filter(c => c.category === "Streetlight").length}- Drainage & Sewage: ${appState.complaints.filter(c => c.category === "Drainage" || c.category === "Sewage").length}  `;  const blob = new Blob([reportText], { type: "text/plain" });  const url = URL.createObjectURL(blob);  const a = document.createElement("a");  a.href = url;  a.download = "Panchayath_Grievance_Report.txt";  a.click();  showToast("Downloaded Official Panchayath Compliance Report", "success");}

// ==========================================
// 11. ADMIN PORTAL LOGIC
// ==========================================
let adminComplaintFilter = "ALL";function setAdminFilter(filter, btn) {  adminComplaintFilter = filter;  document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));  if (btn) btn.classList.add("active");  renderAdminComplaintList();}function renderAdminPortal() {  const userBox = document.getElementById("admin-user-list");  userBox.innerHTML = Object.values(INITIAL_USERS).map(u => `    <div class="admin-user-row">      <div>        <strong>${u.name}</strong> (${u.role})        <div style="font-size:0.75rem; color:#94a3b8;">ID: ${u.id}</div>      </div>      <span class="status-pill status-RESOLVED">Active</span>    </div>  `).join('');  const deptBox = document.getElementById("admin-dept-list");  deptBox.innerHTML = `    <div class="admin-dept-row"><span>Public Works Dept (PWD Roads)</span><span class="status-pill status-IN_PROGRESS">4 Tasks</span></div>    <div class="admin-dept-row"><span>Electrical Department</span><span class="status-pill status-IN_PROGRESS">2 Tasks</span></div>    <div class="admin-dept-row"><span>Water &amp; Sanitation Dept</span><span class="status-pill status-IN_PROGRESS">5 Tasks</span></div>    <div class="admin-dept-row"><span>Health &amp; Environment</span><span class="status-pill status-RESOLVED">1 Task</span></div>  `;  renderAdminStats();  renderAdminComplaintList();}function renderAdminStats() {  const all      = appState.complaints.length;  const pending  = appState.complaints.filter(c => c.status === "SUBMITTED").length;  const approved = appState.complaints.filter(c => c.status === "APPROVED" || c.status === "IN_PROGRESS").length;  const rejected = appState.complaints.filter(c => c.status === "REJECTED").length;  const resolved = appState.complaints.filter(c => c.status === "RESOLVED").length;  const statsBox = document.getElementById("admin-complaint-stats");  if (!statsBox) return;  statsBox.innerHTML = `    <div class="acstat-card acstat-blue"><i class="fa-solid fa-folder-open"></i><div><span class="acstat-num">${all}</span><span class="acstat-label">Total</span></div></div>    <div class="acstat-card acstat-yellow"><i class="fa-solid fa-hourglass-half"></i><div><span class="acstat-num">${pending}</span><span class="acstat-label">Pending</span></div></div>    <div class="acstat-card acstat-green"><i class="fa-solid fa-circle-check"></i><div><span class="acstat-num">${approved}</span><span class="acstat-label">Approved</span></div></div>    <div class="acstat-card acstat-red"><i class="fa-solid fa-circle-xmark"></i><div><span class="acstat-num">${rejected}</span><span class="acstat-label">Rejected</span></div></div>    <div class="acstat-card acstat-teal"><i class="fa-solid fa-trophy"></i><div><span class="acstat-num">${resolved}</span><span class="acstat-label">Resolved</span></div></div>  `;}function renderAdminComplaintList() {  const container = document.getElementById("admin-complaints-list");  if (!container) return;  const sortSel = document.getElementById("admin-sort-select");  const sortBy = sortSel ? sortSel.value : "newest";  let list = appState.complaints.filter(c => !c.isMerged);  if (adminComplaintFilter !== "ALL") {    list = list.filter(c => c.status === adminComplaintFilter);  }  /* Sort */ if (sortBy === "newest") {    list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));  } else if (sortBy === "votes") {    list = [...list].sort((a, b) => b.upvotes - a.upvotes);  } else if (sortBy === "priority") {    list = [...list].sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));  }  if (list.length === 0) {    container.innerHTML = `<div style="padding:40px; text-align:center; color:#64748b;"><i class="fa-solid fa-inbox" style="font-size:2rem;margin-bottom:12px;display:block;"></i>No complaints found for the selected filter.</div>`;    return;  }  container.innerHTML = "";  list.forEach(c => {    const div = document.createElement("div");    div.className = "admin-complaint-row";    let actionBtns = "";    if (c.status === "SUBMITTED" || c.status === "UNDER_WARD_REVIEW") {      actionBtns = `        <button class="acr-btn acr-approve" onclick="adminApprove('${c.id}')"><i class="fa-solid fa-check"></i> Approve</button>        <button class="acr-btn acr-reject"  onclick="adminReject('${c.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>`;    } else if (c.status === "APPROVED" || c.status === "IN_PROGRESS") {      actionBtns = `        <button class="acr-btn acr-resolve" onclick="adminResolve('${c.id}')"><i class="fa-solid fa-trophy"></i> Mark Resolved</button>        <button class="acr-btn acr-reject"  onclick="adminReject('${c.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>`;    } else if (c.status === "REJECTED") {      actionBtns = `<button class="acr-btn acr-approve" onclick="adminApprove('${c.id}')"><i class="fa-solid fa-rotate-left"></i> Reopen & Approve</button>`;    } else if (c.status === "RESOLVED") {      actionBtns = `<span style="font-size:0.78rem;color:#10b981;font-weight:700;"><i class="fa-solid fa-circle-check"></i> Fully Resolved</span>`;    }    const isNew = !c.wardRemarks || c.wardRemarks === "Received transparently via Citizen Portal. Pending Ward Member review.";    const priorityScore = calculatePriorityScore(c);    div.innerHTML = `      <div class="acr-left">        <div class="acr-id-row">          ${isNew && c.status === "SUBMITTED" ? `<span class="acr-new-badge"><i class="fa-solid fa-bolt"></i> NEW</span>` : ""}          <span class="acr-id">#${c.id}</span>          <span class="status-pill status-${c.status}">${formatStatus(c.status)}</span>          <span class="urgency-tag ${c.urgency}">${c.urgency}</span>        </div>        <h4 class="acr-title">${c.title}</h4>        <div class="acr-meta">          <span><i class="fa-solid fa-user-circle"></i> <strong>${c.citizenName}</strong>${c.citizenEmail ? ` <em class="acr-email">${c.citizenEmail}</em>` : ""}</span>          <span><i class="fa-solid fa-location-dot"></i> ${c.location}</span>          <span><i class="fa-solid fa-tag"></i> ${c.category}</span>          <span><i class="fa-solid fa-map-pin"></i> ${c.wardName}</span>          <span><i class="fa-solid fa-clock"></i> ${c.createdAt}</span>        </div>        ${c.wardRemarks && c.wardRemarks !== "Received transparently via Citizen Portal. Pending Ward Member review." ? `<div class="acr-remark"><i class="fa-solid fa-comment-dots"></i> <em>${c.wardRemarks}</em></div>` : ""}      </div>      <div class="acr-right-col">        <div class="acr-vote-badge">          <i class="fa-solid fa-circle-up"></i>          <span class="acr-vote-num">${c.upvotes}</span>          <span class="acr-vote-label">votes</span>        </div>        <div class="acr-priority-score">          <span>${priorityScore}</span>          <small>priority pts</small>        </div>        <div class="acr-actions">${actionBtns}</div>      </div>    `;    container.appendChild(div);  });}function adminApprove(id) {  const complaint = appState.complaints.find(c => c.id === id);  if (!complaint) return;  const remarks = prompt("Approve complaint #" + id + "?\nEnter admin approval remarks:", "Verified and approved by System Administrator.");  if (remarks === null) return;  complaint.status = "APPROVED";  complaint.wardRemarks = "[Admin Override] " + remarks;  syncComplaintToFirestore(complaint);  addNotification(complaint.citizenId, id, "Admin approved your grievance #" + id + ". Remarks: " + remarks, "WARD_APPROVAL");  persistState();  renderAdminPortal();  showToast("Grievance #" + id + " approved by Admin!", "success");}function adminReject(id) {  const complaint = appState.complaints.find(c => c.id === id);  if (!complaint) return;  const reason = prompt("Reject complaint #" + id + "?\nEnter rejection reason:", "Rejected by System Administrator after review.");  if (reason === null) return;  complaint.status = "REJECTED";  complaint.wardRemarks = "[Admin Override] " + reason;  syncComplaintToFirestore(complaint);  addNotification(complaint.citizenId, id, "Admin rejected your grievance #" + id + ". Reason: " + reason, "STATUS_CHANGE");  persistState();  renderAdminPortal();  showToast("Grievance #" + id + " rejected by Admin.", "info");}function adminResolve(id) {  const complaint = appState.complaints.find(c => c.id === id);  if (!complaint) return;  const remarks = prompt("Mark complaint #" + id + " as RESOLVED?\nEnter resolution details:", "Issue resolved by municipal action team. Verified by Admin.");  if (remarks === null) return;  complaint.status = "RESOLVED";  complaint.wardRemarks = "[Admin Resolved] " + remarks;  syncComplaintToFirestore(complaint);  addNotification(complaint.citizenId, id, "Your grievance #" + id + " has been marked RESOLVED. " + remarks, "STATUS_CHANGE");  persistState();  renderAdminPortal();  showToast("Grievance #" + id + " marked as Resolved!", "success");}

// ==========================================
// 12. UTILITY FUNCTIONS
// ==========================================
function addNotification(userId, complaintId, message, type) {  const newNotif = { id: `N${Date.now()}`, userId, complaintId, message, type, time: "Just now" };  appState.notifications.unshift(newNotif);  persistState();  renderNotifications();}function renderNotifications() {  const list = document.getElementById("notification-list");  document.getElementById("notification-count").innerText = appState.notifications.length;  if (appState.notifications.length === 0) {    list.innerHTML = `<div style="padding:20px; text-align:center; color:#64748b; font-size:0.82rem;">No new notifications</div>`;    return;  }  list.innerHTML = appState.notifications.map(n => `    <div class="notif-item">      <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>      <div class="notif-content">        <p>${n.message}</p>        <span class="notif-time">${n.time}</span>      </div>    </div>  `).join('');}function toggleNotificationDrawer() {  document.getElementById("notification-drawer").classList.toggle("hidden");}function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => {
    m.classList.add("hidden");
    if (m.id !== "auth-overlay") m.style.display = "none";
  });
}function parseComplaintDate(str) {
  if (!str) return 0;
  if (typeof str === "number") return str;
  var m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (m) {
    return new Date(parseInt(m[1],10), parseInt(m[2],10)-1, parseInt(m[3],10), parseInt(m[4],10), parseInt(m[5],10)).getTime();
  }
  var d = new Date(str).getTime();
  return isNaN(d) ? 0 : d;
}

function formatStatus(status) {
  if (!status) return "SUBMITTED";
  return String(status).replace(/_/g, ' ');
}function showToast(message, type = "info") {  const container = document.getElementById("toast-container");  const toast = document.createElement("div");  toast.className = `toast toast-${type}`;  toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;  container.appendChild(toast);  setTimeout(() => {    toast.remove();  }, 4000);}