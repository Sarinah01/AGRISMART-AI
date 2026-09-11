// LocalStorage User Store helper for AgriSmart AI

export const DEFAULT_USER = {
  name: "Hackathon Evaluator",
  email: "evaluator@agrismart.ai",
  role: "Demo Sandbox Mode",
  initials: "HP",
  farmName: "AgriSmart Experimental Farm",
  location: "Greenhouse 4B, Sector 7",
  phone: "+91 98765 43210",
  bio: "Agricultural AI evaluator testing computer vision foliar diagnostics.",
  isLoggedIn: true
};

export const getStoredUser = () => {
  try {
    const data = localStorage.getItem('agrismart_user');
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load user from localStorage:", err);
  }
  return DEFAULT_USER;
};

export const saveStoredUser = (user) => {
  try {
    localStorage.setItem('agrismart_user', JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save user to localStorage:", err);
  }
};

export const getRegisteredUsers = () => {
  try {
    const data = localStorage.getItem('agrismart_registered_users');
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read registered users:", err);
  }
  return [];
};

export const registerUser = (newUser) => {
  const users = getRegisteredUsers();
  const exists = users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase());
  if (exists) {
    return { success: false, message: "An account with this email already exists." };
  }
  users.push(newUser);
  localStorage.setItem('agrismart_registered_users', JSON.stringify(users));
  return { success: true, user: newUser };
};

export const loginUser = (email, password) => {
  // Demo Evaluator bypass
  if (email.toLowerCase() === "evaluator@agrismart.ai" || email.toLowerCase() === "demo@agrismart.ai") {
    return { success: true, user: DEFAULT_USER };
  }
  const users = getRegisteredUsers();
  const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (matched) {
    const { password, ...safeUser } = matched;
    return { success: true, user: { ...safeUser, isLoggedIn: true } };
  }
  return { success: false, message: "Invalid email or password. You can also use the demo evaluator credentials." };
};

export const computeInitials = (name) => {
  if (!name) return "U";
  // Filter out punctuation and parentheses, keeping words
  const cleanWords = name
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  if (cleanWords.length === 0) return "U";
  if (cleanWords.length === 1) return cleanWords[0].slice(0, 2).toUpperCase();
  // If first word is a title like Dr or Mr, pick the actual names if available
  if (cleanWords.length > 2 && (cleanWords[0].toLowerCase() === 'dr' || cleanWords[0].toLowerCase() === 'mr' || cleanWords[0].toLowerCase() === 'ms' || cleanWords[0].toLowerCase() === 'mrs')) {
    return (cleanWords[1][0] + cleanWords[2][0]).toUpperCase();
  }
  return (cleanWords[0][0] + cleanWords[cleanWords.length - 1][0]).toUpperCase();
};
