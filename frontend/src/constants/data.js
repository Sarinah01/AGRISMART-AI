export const DEFAULT_LEAF_IMAGE = "https://lh3.googleusercontent.com/aida/AEtjO1WTQsL9bmAdEXWvnOSo_9Jsd-VYh_PlVfXkT6vC2quEd7L7XO6-FZAvN3EIxy17XPrnP3Vnvm-UUXhw6D6sxbbonFdH1E7_UPI52dJ97gr9hJkeFsUIIupg_AwslIWeuBChsClCGPkmR1eYpo3XwYSPa8hdBoZNCO8Wzf1BtuP8cp2QrFFvqLCVkq9jo_kZ6qcLmc8UdqbLYtHnSRfNd3mqIX5dT6QUQITF8KeNDkV66aaQLiKtMNODw3k2";

export const HERO_BG_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAlvzEJsNJGi9LOrSVUBMIL4CXpJhgzbSe2kcqfH8x6oj2wVsuwvpbGgQV77hHunlDcJie3Lul6eMCcUiLGCWdPDpM355_zPc5l0COmws8R7kYlbExi05XgrXDjxLMwrADeNYqjq_Ltn498J6H-s9_uIcHDISjPJOw_eqiCsHy-7pwYGhAayXYkZ-q30UOF34cKHetAe_81u01IMq4662IfNFo-xsmKkScfhN31I_NiLrLJfLSC4Uos2Q";

export const SAMPLE_SCANS = [
  {
    id: "01",
    crop: "Tomato",
    condition: "Tomato Early Blight",
    pathogen: "Alternaria solani",
    subtext: "Solanaceae · Target Spots",
    badge: "Action Recommended",
    badgeType: "warning",
    confidence: "91%",
    image: DEFAULT_LEAF_IMAGE,
    isLeafIcon: false,
    severity: "Moderate",
    model: "ResNet-50",
  },
  {
    id: "02",
    crop: "Sweet Corn",
    condition: "Sweet Corn Canopy",
    pathogen: "Zea mays · Vigorous Foliage",
    subtext: "Healthy Foliage",
    badge: "Healthy",
    badgeType: "success",
    confidence: "99%",
    image: null,
    isLeafIcon: true,
    severity: "Normal",
    model: "ResNet-50",
  },
  {
    id: "03",
    crop: "Potato",
    condition: "Potato Late Blight",
    pathogen: "Phytophthora infestans",
    subtext: "Solanaceae · Dark Water-soaked lesions",
    badge: "High Alert",
    badgeType: "error",
    confidence: "89%",
    image: null,
    isPestIcon: true,
    severity: "High",
    model: "ResNet-50",
  }
];
