export const ROUTES = {
  DASHBOARD: '/',
  DETECTION: '/detection',
  RESULT: '/result',
  HISTORY: '/history',
  ASSISTANT: '/assistant',
  PROFILE: '/profile',
  CROP_RECOMMENDATION: '/crop-recommendation',
  SMART_IRRIGATION: '/smart-irrigation',
  WEATHER: '/weather-intelligence',
  SUSTAINABILITY: '/sustainability',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
};

// Map tab names -> URL paths (for backward compat with existing onNavigate calls)
export const TAB_TO_PATH = {
  'Dashboard': ROUTES.DASHBOARD,
  'Disease Detection': ROUTES.DETECTION,
  'Disease-Result': ROUTES.RESULT,
  'Scan History': ROUTES.HISTORY,
  'AI Farmer Assistant': ROUTES.ASSISTANT,
  'Profile': ROUTES.PROFILE,
  'Crop Recommendation': ROUTES.CROP_RECOMMENDATION,
  'Smart Irrigation': ROUTES.SMART_IRRIGATION,
  'Weather Intelligence': ROUTES.WEATHER,
  'Sustainability': ROUTES.SUSTAINABILITY,
  'Farm Settings': ROUTES.SETTINGS,
  'Login': ROUTES.LOGIN,
  'Register': ROUTES.REGISTER,
};


export const PATH_TO_TAB = Object.fromEntries(
  Object.entries(TAB_TO_PATH).map(([tab, path]) => [path, tab])
);