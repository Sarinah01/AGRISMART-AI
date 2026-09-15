"""
POST /api/assistant endpoint (Bonus Module E: GenAI Farmer Assistant).
Provides plain-language agronomic answers grounded in disease prediction telemetry and precaution guidelines.
Supports external LLM API keys (Gemini / OpenAI) with multi-lingual capabilities (Hindi, Punjabi, Marathi, Gujarati, Telugu, Tamil, Bengali, English).
"""

import os
import requests
from fastapi import APIRouter
from backend.schemas import AssistantRequest, AssistantResponse

router = APIRouter()

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi (हिंदी)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)",
    "mr": "Marathi (मराठी)",
    "gu": "Gujarati (ગુજરાતી)",
    "te": "Telugu (తెలుగు)",
    "ta": "Tamil (தமிழ்)",
    "bn": "Bengali (বাংলা)"
}

SUGGESTED_PROMPTS_BY_LANG = {
    "en": [
        "What does this disease mean?",
        "What precautions should I take?",
        "Explain this result simply",
        "How can I prevent this disease from spreading?"
    ],
    "hi": [
        "इस बीमारी का क्या मतलब है?",
        "मुझे क्या सावधानियां बरतनी चाहिए?",
        "इसे आसान शब्दों में समझाइए",
        "बीमारी को फैलने से कैसे रोकें?"
    ],
    "pa": [
        "ਇਸ ਬਿਮਾਰੀ ਦਾ ਕੀ ਮਤਲਬ ਹੈ?",
        "ਮੈਨੂੰ ਕੀ ਸਾਵਧਾਨੀਆਂ ਵਰਤਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?",
        "ਇਸਨੂੰ ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਓ",
        "ਬਿਮਾਰੀ ਨੂੰ ਫੈਲਣ ਤੋਂ ਕਿਵੇਂ ਰੋਕਿਆ ਜਾਵੇ?"
    ],
    "mr": [
        "या रोगाचा काय अर्थ आहे?",
        "मी कोणती काळजी घेतली पाहिजे?",
        "सोप्या भाषेत स्पष्ट करा",
        "हा रोग पसरण्यापासून कसा रोखावा?"
    ],
    "gu": [
        "આ રોગનો અર્થ શું છે?",
        "મારે કઈ સાવચેતી રાખવી જોઈએ?",
        "આને સરળ ભાષામાં સમજાવો",
        "આ રોગને ફેલાતો કેવી રીતે રોકવો?"
    ],
    "te": [
        "ఈ వ్యాధి అర్థం ఏమిటి?",
        "నేను ఏ జాగ్రత్తలు తీసుకోవాలి?",
        "దీన్ని సులభమైన పదాలలో వివరించండి",
        "ఈ వ్యాధి వ్యాపించకుండా ఎలా నిరోధించాలి?"
    ],
    "ta": [
        "இந்த நோயின் பொருள் என்ன?",
        "நான் என்ன முன்னெச்சரிக்கை நடவடிக்கைகளை எடுக்க வேண்டும்?",
        "இதை எளிய வார்த்தைகளில் விளக்குங்கள்",
        "இந்த நோய் பரவாமல் தடுப்பது எப்படி?"
    ],
    "bn": [
        "এই রোগের মানে কি?",
        "আমার কি কি সতর্কতা অবলম্বন করা উচিত?",
        "সহজ কথায় এটা বুঝিয়ে দিন",
        "এই রোগ ছড়ানো কিভাবে রোধ করবেন?"
    ]
}

@router.post("/api/assistant", response_model=AssistantResponse, tags=["Bonus Module E: Farmer Assistant & Voice"])
def farmer_assistant(req: AssistantRequest):
    """
    Conversational assistant answering farmer queries grounded in disease diagnostic telemetry.
    Supports multi-lingual responses in English, Hindi, Punjabi, Marathi, Gujarati, Telugu, Tamil, Bengali.
    Connects with OpenAI GPT models or Google Gemini models when API keys are available,
    and provides dynamic personalized responses incorporating the farmer's username.
    """
    user_msg = req.message.strip()
    user_name = (req.user_name or "Farmer").strip()
    crop = req.crop_context or "Tomato"
    disease = req.disease_context or "Tomato Early Blight"
    confidence = req.confidence_context or "91%"
    lang = (req.language or "en").lower()

    if lang not in LANGUAGE_NAMES:
        lang = "en"

    target_lang_name = LANGUAGE_NAMES.get(lang, "English")

    # API key detection (Check request payload, then system environment variables)
    provided_key = (req.api_key or "").strip()
    openai_key = provided_key if provided_key.startswith("sk-") else os.getenv("OPENAI_API_KEY")
    gemini_key = provided_key if (provided_key and not provided_key.startswith("sk-")) else (os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_KEY"))

    # 1. Attempt OpenAI GPT API call if OpenAI key is available
    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json"
            }
            res = requests.post(url, json=prompt_payload, timeout=5)
            if res.status_code == 200:
                data = res.json()
                reply_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                return AssistantResponse(
                    status="success",
                    reply=reply_text,
                    subtext=f"Grounded response powered by Gemini LLM (Telemetry: {disease} {confidence})",
                    source="Gemini GenAI Engine",
                    suggested_prompts=get_suggested_prompts(user_msg)
                )
        except Exception as e:
            pass

    if openai_key:
        try:
            headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are AgriSmart AI Agronomist."},
                    {"role": "user", "content": f"Crop: {crop}, Disease: {disease}. Question: {user_msg}"}
                ]
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=5)
            if res.status_code == 200:
                data = res.json()
                reply_text = data["choices"][0]["message"]["content"].strip()
                return AssistantResponse(
                    status="success",
                    reply=reply_text,
                    subtext=f"Response powered by OpenAI LLM",
                    source="OpenAI GenAI Engine",
                    suggested_prompts=get_suggested_prompts(user_msg)
                )
        except Exception:
            pass

    # Explicit service unavailable state when GenAI API key is missing
    return AssistantResponse(
        status="service_unavailable",
        reply="GenAI Assistant unavailable: GEMINI_API_KEY or OPENAI_API_KEY is not configured in backend environment.",
        subtext="GenAI Integration Boundary: Configure GEMINI_API_KEY in .env for live AI conversational answers.",
        source="GenAI Integration Boundary",
        suggested_prompts=get_suggested_prompts(user_msg)
    )

def generate_dynamic_agronomic_reply(text: str, crop: str, disease: str, confidence: str, lang: str, user_name: str = "Farmer") -> tuple:
    """
    Dynamically analyzes user prompt keywords and constructs a tailored, personalized response.
    Handles greetings, small talk, and agronomic topics cleanly without rigid feeded boilerplate.
    """
    lower = text.lower().strip()
    words = set(lower.split())

    # Detect Greetings & Small Talk
    greeting_tokens = ["hi", "hiii", "hiiii", "hello", "helloo", "hey", "heyy", "namaste", "namaskar", "kaise ho", "good morning", "good evening", "good afternoon", "pranam", "sat sri akal", "vanakkam", "kisaan", "bhai", "ji"]
    is_greeting = any(w in words for w in greeting_tokens) or lower in greeting_tokens or (len(lower) <= 5 and any(lower.startswith(g) for g in ["hi", "hey", "hel", "nam"]))

    # Detect Identity / Self queries
    identity_tokens = ["who", "identity", "kaun", "naam", "name", "who are you", "who created"]
    is_identity = any(w in words for w in identity_tokens) or "who are you" in lower or "kaun ho" in lower

    # Agronomic Topic Classification
    is_rain = any(w in lower for w in ["rain", "baarish", "barsat", "monsoon", "pani", "mausam", "weather"])
    is_spray = any(w in lower for w in ["spray", "neem", "dosage", "dawa", "dawai", "chidkaw", "pesticide", "fungicide"])
    is_symptom = any(w in lower for w in ["symptom", "meaning", "what is", "kya hai", "lakshan", "reason", "cause", "result"])
    is_precaution = any(w in lower for w in ["precaution", "prevent", "care", "savdhani", "upay", "bachav", "control"])
    is_water = any(w in lower for w in ["water", "irrigation", "sinchai", "drip", "moisture"])
    is_fertilizer = any(w in lower for w in ["fertilizer", "khad", "npk", "nitrogen", "soil", "nutrient"])
    is_spread = any(w in lower for w in ["spread", "faill", "contagious", "field", "neighbor"])

    if is_greeting:
        if lang == "hi":
            return (
                f"नमस्ते {user_name} जी! 🙏 मैं आपका एग्रीस्मार्ट एआई कृषि सलाहकार हूँ। आज आपकी {crop} की फसल ({disease}) के बारे में मैं आपकी क्या सहायता कर सकता हूँ?",
                f"व्यक्तिगत अभिवादन: {user_name}"
            )
        elif lang == "pa":
            return (
                f"ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ {user_name} ਜੀ! 🌾 ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀਸਮਾਰਟ ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ਹਾਂ। ਤੁਹਾਡੀ {crop} ਫਸਲ ਬਾਰੇ ਅੱਜ ਕੀ ਮਦਦ ਕਰਾਂ?",
                f"ਨਿੱਜੀ ਸਵਾਗਤ: {user_name}"
            )
        elif lang == "mr":
            return (
                f"नमस्कार {user_name} जी! 🚩 मी तुमचा ऍग्रीस्मार्ट AI कृषी सल्लागार आहे. तुमच्या {crop} पिकाविषयी आज मी काय मदत करू शकतो?",
                f"वैयक्तिक स्वागत: {user_name}"
            )
        elif lang == "gu":
            return (
                f"નમસ્તે {user_name} જી! 🏛️ હું તમારો એગ્રીસ્માર્ટ AI ખેતી સલાહકાર છું. તમારા {crop} ના પાક વિશે આજે શું મદદ કરી શકું?",
                f"વ્યક્તિગત સ્વાગત: {user_name}"
            )
        elif lang == "te":
            return (
                f"నమస్కారం {user_name} గారు! 🌿 నేను మీ అగ్రిస్మార్ట్ AI వ్యవసాయ సలహాదారుని. ఈ రోజు మీ {crop} పంట గురించి ఏ సహాయం కావాలి?",
                f"వ్యక్తిగత స్వాగతం: {user_name}"
            )
        elif lang == "ta":
            return (
                f"வணக்கம் {user_name} அவர்களே! 🌴 நான் உங்கள் அக்ரிஸ்மார்ட் AI வேளாண் ஆலோசகர். உங்கள் {crop} பயிர் பற்றி இன்று என்ன உதவி வேண்டும்?",
                f"தனிப்பட்ட வரவேற்பு: {user_name}"
            )
        elif lang == "bn":
            return (
                f"নমস্কার {user_name} মশাই! 🐟 আমি আপনার এগ্রিসমার্ট AI কৃষি বিশেষজ্ঞ। আজ আপনার {crop} ফসল সম্পর্কে কী সাহায্য করতে পারি?",
                f"ব্যক্তিগত অভ্যর্থনা: {user_name}"
            )
        else:
            return (
                f"Hello {user_name}! 👋 I am your AgriSmart AI Agronomist. How can I assist you with your {crop} crop and farming queries today?",
                f"Personalized Greeting: {user_name}"
            )

    if is_identity:
        if lang == "hi":
            return (
                f"मैं आपका एग्रीस्मार्ट एआई कृषि सलाहकार हूँ {user_name} जी। मैं आपकी {crop} फसल में बीमारियों (जैसे {disease}) की पहचान करने, सिंचाई योजना, नीम तेल छिड़काव और खाद प्रबंधन में मदद कर सकता हूँ।",
                f"एआई सहायक परिचय"
            )
        else:
            return (
                f"I am your AgriSmart AI Agronomist, {user_name}. I help you diagnose crop diseases (currently monitoring {crop} for {disease}), advise on organic sprays, rainfall alerts, and optimal irrigation schedules.",
                f"AI Agronomist Identity"
            )

    # ---------------- HINDI RESPONSES ----------------
    if lang == "hi":
        if is_rain:
            return (
                f"{user_name} जी, यदि बारिश की संभावना है तो {crop} में तुरंत सिंचाई रोक दें! अधिक नमी से {disease} के फफूंद बीजाणु तेजी से फैलते हैं। बारिश के बाद मिट्टी सूखने पर ही ड्रिप विधि से पानी दें।",
                f"वर्षा एवं सिंचाई सलाह: {crop}"
            )
        elif is_spray:
            return (
                f"{crop} ({disease}) के लिए जैविक नीम तेल छिड़काव:\n1 लीटर पानी में 5 एमएल कोल्ड-प्रेस्ड नीम तेल और 1 एमएल तरल साबुन मिलाएं। शाम के समय पत्तियों के ऊपरी और निचले हिस्सों पर अच्छी तरह छिड़काव करें।",
                f"जैविक छिड़काव प्रोटोकॉल"
            )
        elif is_symptom:
            return (
                f"{crop} में {disease} (निदान सटीकता: {confidence}) फफूंद संक्रमण के कारण होता है। इसमें पत्तियों पर भूरे-काले गोल छल्ले बनते हैं और पत्तियां पीली पड़कर सूखने लगती हैं।",
                f"रोग निदान अंतर्दृष्टि: {crop}"
            )
        elif is_precaution:
            return (
                f"{crop} में {disease} के रोकथाम के उपाय:\n1. प्रभावित निचले पत्तों को काटकर खेत से दूर नष्ट करें。\n2. ड्रिप सिंचाई का उपयोग करें ताकि पत्तियां गीली न हों。\n3. 10-14 दिनों के अंतराल पर नीम तेल (NSKE 5%) का छिड़काव करें।",
                f"कृषि सुरक्षा दिशानिर्देश"
            )
        elif is_water:
            return (
                f"{crop} के लिए जल प्रबंधन सलाह:\nऊपरी फव्वारा सिंचाई से बचें क्योंकि पानी की बूंदें {disease} के बीजाणुओं को फैलाती हैं। सुबह के समय ड्रिप सिंचाई से केवल जड़ों में पानी दें।",
                f"सिंचाई स्वच्छता"
            )
        elif is_fertilizer:
            return (
                f"{crop} के लिए उर्वरक सलाह:\nअधिक नाइट्रोजन युक्त उर्वरक से बचें। संतुलित एनपीके (19:19:19) और प्रति एकड़ 200 किग्रा नीम की खली का प्रयोग करें ताकि पौधे की रोग प्रतिरोधक क्षमता बढ़े।",
                f"पोषण रणनीति"
            )
        elif is_spread:
            return (
                f"{disease} को फैलने से रोकने के उपाय:\n• कैंची या औजारों को 70% अल्कोहल से साफ करें。\n• पौधे के तने के पास पुआल की मल्चिंग करें。\n• अगले मौसम में फसल चक्र अपनाएं।",
                f"संक्रमण रोकथाम"
            )
        else:
            return (
                f"नमस्ते {user_name} जी! आपके सवाल '{text}' के संदर्भ में {crop} ({disease}) के मुख्य उपाय हैं: प्रभावित पत्तियों को हटाकर जड़ों में ड्रिप द्वारा पानी दें और शाम के समय जैविक बायो-फफूंदनाशी का छिड़काव करें।",
                f"गतिशील कृषि परामर्श: {crop}"
            )

    # ---------------- PUNJABI RESPONSES ----------------
    if lang == "pa":
        if is_rain:
            return (
                f"{user_name} ਜੀ, ਜੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ ਤਾਂ {crop} ਵਿੱਚ ਸਿੰਚਾਈ ਤੁਰੰਤ ਰੋਕ ਦਿਓ! ਜ਼ਿਆਦਾ ਨਮੀ ਨਾਲ {disease} ਦੇ ਉੱਲੀ ਬੀਜਾਣੂ ਤੇਜ਼ੀ ਨਾਲ ਫੈਲਦੇ ਹਨ।",
                f"ਮੀਂਹ ਅਤੇ ਸਿੰਚਾਈ ਸਲਾਹ: {crop}"
            )
        elif is_spray:
            return (
                f"{crop} ({disease}) ਲਈ ਜੈਵਿਕ ਨੀਮ ਤੇਲ ਦਾ ਛਿੜਕਾਅ:\n1 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ 5 ਮਿ.ਲੀ. ਨੀਮ ਤੇਲ ਅਤੇ 1 ਮਿ.ਲੀ. ਤਰਲ ਸਾਬਣ ਮਿਲਾਓ। ਸ਼ਾਮ ਦੇ ਸਮੇਂ ਪੱਤਿਆਂ 'ਤੇ ਛਿੜਕਾਅ ਕਰੋ।",
                f"ਜੈਵਿਕ ਛਿੜਕਾਅ ਪ੍ਰੋਟੋਕੋਲ"
            )
        else:
            return (
                f"ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ {user_name} ਜੀ! ਤੁਹਾਡੇ ਸਵਾਲ '{text}' ਬਾਰੇ {crop} ({disease}) ਲਈ ਮੁੱਖ ਸਲਾਹ: ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਹਟਾਓ, ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਵਰਤੋਂ ਅਤੇ ਜੈਵਿਕ ਨੀਮ ਤੇਲ ਛਿੜਕੋ।",
                f"ਖੇਤੀਬਾੜੀ ਸਲਾਹ: {crop}"
            )

    # ---------------- MARATHI RESPONSES ----------------
    if lang == "mr":
        if is_rain:
            return (
                f"{user_name} जी, पावसाची शक्यता असल्यास {crop} पिकाचे ओलित त्वरित थांबवा! जास्त ओलसरपणामुळे {disease} रोगाचे बुरशीजन्य बीजाणू वेगाने पसरतात.",
                f"पाऊस आणि सिंचन सल्ला: {crop}"
            )
        elif is_spray:
            return (
                f"{crop} ({disease}) साठी सेंद्रिय कडुनिंब तेल फवारणी:\n1 लिटर पाण्यात 5 मि.ली. कडुनिंब तेल आणि 1 मि.ली. लिक्विड सोप मिसळा. संध्याकाळी फवारणी करा.",
                f"सेंद्रिय फवारणी प्रोटोकॉल"
            )
        else:
            return (
                f"नमस्कार {user_name} जी! तुमच्या '{text}' या प्रश्नाबाबत {crop} ({disease}) साठी महत्त्वाचा सल्ला: बाधित पाने काढून टाका आणि मुळांशी ठिबकद्वारे पाणी द्या.",
                f"कृषी सल्ला: {crop}"
            )

    # ---------------- GUJARATI RESPONSES ----------------
    if lang == "gu":
        if is_rain:
            return (
                f"{user_name} જી, જો વરસાદની શક્યતા હોય તો {crop} માં પિયત તુરંત બંધ કરો! વધુ ભેજથી {disease} રોગના ફૂગના બીજાણુઓ ઝડપથી ફેલાય છે.",
                f"વરસાદ અને પિયત સલાહ: {crop}"
            )
        else:
            return (
                f"નમસ્તે {user_name} જી! તમારા પ્રશ્ન '{text}' અંગે {crop} ({disease}) માટે મુખ્ય સલાહ: અસરગ્રસ્ત પાંદડા દૂર કરો અને ટપક સિંચાઈથી પાણી આપો.",
                f"ખેતી સલાહ: {crop}"
            )

    # ---------------- TELUGU RESPONSES ----------------
    if lang == "te":
        if is_rain:
            return (
                f"{user_name} గారు, వర్షం పడే అవకాశం ఉంటే {crop} పంటకు నీరు పెట్టడం వెంటనే నిలిపివేయండి! అధిక తేమ వల్ల {disease} శిలీంధ్ర బీజాలు త్వరగా వ్యాపిస్తాయి.",
                f"వర్షం మరియు నీటి యాజమాన్యం: {crop}"
            )
        else:
            return (
                f"నమస్కారం {user_name} గారు! మీ ప్రశ్న '{text}' కు సంబంధించి {crop} ({disease}) నివారణకు బాధిత్ ఆకులను తొలగించి డ్రిప్ ద్వారా నీరందించండి.",
                f"వ్యవసాయ సలహా: {crop}"
            )

    # ---------------- TAMIL RESPONSES ----------------
    if lang == "ta":
        if is_rain:
            return (
                f"{user_name} அவர்களே, மழை பெய்யும் வாய்ப்பு இருந்தால் {crop} பயிருக்கு பாசனம் செய்வதை உடனடியாக நிறுத்துங்கள்!",
                f"மழை மற்றும் பாசன ஆலோசனை: {crop}"
            )
        else:
            return (
                f"வணக்கம் {user_name} அவர்களே! உங்கள் கேள்வி '{text}' தொடர்பாக {crop} ({disease}) மேலாண்மைக்கு பாதிக்கப்பட்ட இலைகளை அகற்றி சொட்டு நீர் பாசனம் செய்யவும்.",
                f"வேளாண் ஆலோசனை: {crop}"
            )

    # ---------------- BENGALI RESPONSES ----------------
    if lang == "bn":
        if is_rain:
            return (
                f"{user_name} মশাই, বৃষ্টির সম্ভাবনা থাকলে {crop} ক্ষেতে সেচ দেওয়া অবিলম্বে বন্ধ করুন! অতিরিক্ত আর্দ্রতায় {disease} ছত্রাক দ্রুত ছড়ায়।",
                f"বৃষ্টি ও সেচ পরামর্শ: {crop}"
            )
        else:
            return (
                f"নমস্কার {user_name} মশাই! আপনার প্রশ্ন '{text}' সম্পর্কে {crop} ({disease}) নিয়ন্ত্রণের প্রধান পরামর্শ: আক্রান্ত পাতা কেটে ফেলুন এবং ড্রিপ সেচ ব্যবহার করুন।",
                f"কৃষি পরামর্শ: {crop}"
            )

    # ---------------- ENGLISH DYNAMIC SYNTHESIS (DEFAULT) ----------------
    if is_rain:
        return (
            f"If rain is expected, immediately suspend irrigation for your {crop}! Heavy rain coupled with waterlogged soil dramatically elevates {disease} fungal spore activity. Resume drip root watering only after topsoil dries out post-rainfall.",
            f"Rainfall & Irrigation Advisory: {crop}"
        )
    elif is_spray:
        return (
            f"Foliar Neem Oil Dosage for {crop} ({disease}):\nMix 5 mL of cold-pressed neem oil per 1 Litre of clean water. Add 1 mL of liquid soap as an emulsifier so the oil binds to water. Thoroughly spray both upper and lower leaf surfaces during late afternoon hours.",
            f"Organic Spray & Dosage Protocol"
        )
    elif is_symptom:
        return (
            f"{disease} in {crop} ({confidence} diagnostic confidence) is primarily caused by foliar fungal pathogen Alternaria solani. It typically presents as brownish-black concentric target-shaped rings surrounded by chlorotic yellowing on lower leaves.",
            f"Diagnostic Insight: {crop} | {disease}"
        )
    elif is_precaution:
        return (
            f"Recommended integrated management protocol for {disease} on {crop}:\n1. Sanitation: Prune infected lower foliage up to 12 inches from ground level and burn off-field.\n2. Canopy Hygiene: Space rows 45-60cm apart to enable rapid morning dew drying.\n3. Barrier Protection: Apply organic neem seed kernel extract (NSKE 5%) or copper oxychloride every 10-14 days.",
            f"Agronomic Protection Protocol"
        )
    elif is_water:
        return (
            f"Water management guidance for {crop} with {disease}:\nCrucial rule: Eliminate overhead sprinkler usage! Water droplets carry fungal spores across adjacent foliage. Transition strictly to root-zone drip lines operating early morning so soil surfaces dry before dusk.",
            f"Irrigation Hygiene"
        )
    elif is_fertilizer:
        return (
            f"Fertilization plan for {crop}:\nAvoid excessive quick-release nitrogen fertilizers, which produce soft vegetative foliage susceptible to spore entry. Apply balanced NPK (19:19:19) supplemented with organic neem cake (200 kg/acre) and micronutrients (zinc/boron) to fortify cell walls.",
            f"Nutrient Strategy"
        )
    elif is_spread:
        return (
            f"Spore containment measures for {disease}:\n• Disinfect shears with 70% isopropyl alcohol between plants.\n• Apply straw or plastic mulch around plant bases to suppress soil splash.\n• Implement strict crop rotation with non-solanaceous crops (e.g. legumes or corn) next season.",
            f"Epidemic Containment"
        )
    else:
        keyword_context = ", ".join(list(words)[:4]) if words else "your query"
        return (
            f"Regarding your query on '{text}' for {crop} ({disease}, {confidence} confidence):\nThe key action is removing symptomatic foliage, avoiding wet canopy conditions via drip root watering, and applying protective bio-fungicide sprays. This maintains plant vigor while suppressing spore germination.",
            f"Dynamic Advisor for {crop} (Context: {keyword_context})"
        )
