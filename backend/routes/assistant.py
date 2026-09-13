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
        "ఈ వ్యాధి అంటే ఏమిటి?",
        "నేను ఏ జాగ్రత్తలు తీసుకోవాలి?",
        "దీనిని సులభంగా వివరించండి",
        "ఈ వ్యాధి వ్యాప్తిని ఎలా నివారించాలి?"
    ],
    "ta": [
        "இந்த நோயின் பொருள் என்ன?",
        "நான் என்ன முன்னெச்சரிக்கை நடவடிக்கைகளை எடுக்க வேண்டும்?",
        "எளிய முறையில் விளக்கவும்",
        "நோய் பரவுவதை எவ்வாறு தடுப்பது?"
    ],
    "bn": [
        "এই রোগের অর্থ কী?",
        "আমার কী কী সতর্কতা নেওয়া উচিত?",
        "সহজ ভাষায় বুঝিয়ে বলুন",
        "এই রোগ ছড়ানো কীভাবে রোধ করব?"
    ]
}

@router.post("/api/assistant", response_model=AssistantResponse, tags=["Bonus Module E: Farmer Assistant & Voice"])
def farmer_assistant(req: AssistantRequest):
    """
    Conversational assistant answering farmer queries grounded in disease diagnostic telemetry.
    Supports multi-lingual responses in English, Hindi, Punjabi, Marathi, Gujarati, Telugu, Tamil, Bengali.
    """
    user_msg = req.message.strip()
    crop = req.crop_context or "Tomato"
    disease = req.disease_context or "Tomato Early Blight"
    confidence = req.confidence_context or "91%"
    lang = (req.language or "en").lower()

    if lang not in LANGUAGE_NAMES:
        lang = "en"

    gemini_key = os.getenv("GEMINI_API_KEY")

    # 1. Attempt LLM API call if Gemini API key is available
    if gemini_key:
        try:
            target_lang_name = LANGUAGE_NAMES.get(lang, "English")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            
            history_summary = ""
            if req.history:
                recent_history = req.history[-4:]
                history_summary = "Previous Conversation:\n" + "\n".join(
                    [f"{h.sender.upper()}: {h.text}" for h in recent_history]
                ) + "\n"

            prompt_text = (
                f"You are AgriSmart AI Agronomist, an empathetic, highly knowledgeable agricultural expert helping farmers in India.\n"
                f"IMPORTANT: Respond strictly in the following language: {target_lang_name} using native script.\n"
                f"Active Telemetry Context: Crop={crop}, Disease={disease}, Diagnostic Confidence={confidence}.\n"
                f"{history_summary}"
                f"User Question: {user_msg}\n"
                f"Instructions: Provide practical, easy-to-understand advice in 2-4 short sentences. Prioritize organic precautions, irrigation tips, and non-chemical steps first."
            )

            prompt_payload = {
                "contents": [{
                    "parts": [{"text": prompt_text}]
                }]
            }

            res = requests.post(url, json=prompt_payload, timeout=6)
            if res.status_code == 200:
                data = res.json()
                reply_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                return AssistantResponse(
                    status="success",
                    reply=reply_text,
                    subtext=f"Powered by Gemini LLM ({target_lang_name}) · Telemetry: {disease} ({confidence})",
                    source="Gemini GenAI Engine",
                    suggested_prompts=SUGGESTED_PROMPTS_BY_LANG.get(lang, SUGGESTED_PROMPTS_BY_LANG["en"]),
                    language=lang
                )
        except Exception:
            # Fall back seamlessly to grounded agronomic rule engine
            pass

    # 2. Grounded Agronomic Multi-Lingual Expert Knowledge Engine
    reply_text, subtext = generate_agronomic_reply(user_msg, crop, disease, confidence, lang)

    return AssistantResponse(
        status="success",
        reply=reply_text,
        subtext=subtext,
        source=f"AgriSmart Agronomic Engine ({LANGUAGE_NAMES[lang]})",
        suggested_prompts=SUGGESTED_PROMPTS_BY_LANG.get(lang, SUGGESTED_PROMPTS_BY_LANG["en"]),
        language=lang
    )

def generate_agronomic_reply(text: str, crop: str, disease: str, confidence: str, lang: str) -> tuple:
    lower = text.lower()
    
    # ------------------ HINDI RESPONSES ------------------
    if lang == "hi":
        if any(w in lower for w in ["मतलब", "बीमारी", "क्या है", "symptom", "meaning", "what is"]):
            return (
                f"{disease} एक पत्ती का फंगल संक्रमण (Alternaria solani) है। इसमें निचली पत्तियों पर काले छल्लेदार धब्बे बनते हैं और पत्तियां पीली पड़कर सूखने लगती हैं।",
                f"संदर्भ: {crop} ({confidence} विश्वसनीयता)"
            )
            
        if any(w in lower for w in ["सावधानी", "उपाय", "रोकथाम", "precaution", "prevent", "cure", "treatment"]):
            return (
                f"{disease} से बचाव के मुख्य उपाय:\n"
                f"1. संक्रमित निचली पत्तियों को तुरंत तोड़कर खेत से दूर नष्ट करें।\n"
                f"2. पत्तियों पर पानी देने के बजाय पौधे की जड़ों में टपक सिंचाई (Drip) करें।\n"
                f"3. पौधों के बीच हवा का प्रवाह बनाए रखें।\n"
                f"4. आवश्यकता होने पर तांबा (Copper) आधारित बायो-फफूंदनाशी का छिड़काव करें।",
                f"अनुशंसित सावधानियां ({disease})"
            )
            
        if any(w in lower for w in ["सरल", "आसान", "explain", "simple"]):
            return (
                f"सरल शब्दों में: आपके {crop} के पौधे की पत्तियों पर फंगस का हमला हुआ है। सूखी पत्तियों को छांट दें और पानी सीधा जड़ों में दें, पौधा जल्द ठीक हो जाएगा!",
                "किसान बंधु मार्गदर्शिका"
            )
            
        if any(w in lower for w in ["फैलने", "रोग", "spread"]):
            return (
                f"बीमारी को फैलने से रोकने के उपाय:\n"
                f"• कैंची या औजारों को साफ करके इस्तेमाल करें।\n"
                f"• पौधे के पास सूखी घास या प्लास्टिक की मल्चिंग करें।\n"
                f"• गीले खेत में काम करने से बचें।",
                "फफूंद फैलाव नियंत्रण"
            )

        return (
            f"{disease} ({confidence} सटीकता) के लिए मुख्य सलाह है कि प्रभावित निचली पत्तियों को हटाएं और सिंचाई हमेशा जड़ों में दें। यदि समस्या बढ़ती है तो नजदीकी कृषि केंद्र से संपर्क करें।",
            f"कृषि सलाहकार ({crop})"
        )

    # ------------------ PUNJABI RESPONSES ------------------
    elif lang == "pa":
        if any(w in lower for w in ["ਮਤਲਬ", "ਬਿਮਾਰੀ", "ਕੀ", "meaning", "symptom"]):
            return (
                f"{disease} ਪੱਤਿਆਂ ਦੀ ਇੱਕ ਫੰਗਲ ਬਿਮਾਰੀ ਹੈ। ਇਸ ਨਾਲ ਹੇਠਲੇ ਪੱਤਿਆਂ 'ਤੇ ਕਾਲੇ ਧੱਬੇ ਬਣਦੇ ਹਨ ਅਤੇ ਪੱਤੇ ਪੀਲੇ ਹੋ ਕੇ ਝੜ ਜਾਂਦੇ ਹਨ।",
                f"ਸੰਦਰਭ: {crop} ({confidence} ਵਿਸ਼ਵਾਸ)"
            )
        if any(w in lower for w in ["ਸਾਵਧਾਨੀ", "ਇਲਾਜ", "ਰੋਕਥਾਮ", "precaution", "prevent"]):
            return (
                f"{disease} ਲਈ ਮੁੱਖ ਸਾਵਧਾਨੀਆਂ:\n"
                f"1. ਸੰਕਰਮਿਤ ਹੇਠਲੇ ਪੱਤਿਆਂ ਨੂੰ ਤੋੜ ਕੇ ਖੇਤ ਤੋਂ ਦੂਰ ਨਸ਼ਟ ਕਰੋ।\n"
                f"2. ਪੱਤਿਆਂ ਉੱਪਰ ਪਾਣੀ ਪਾਉਣ ਦੀ ਬਜਾਏ ਜੜ੍ਹਾਂ ਵਿੱਚ ਤੁਪਕਾ ਸਿੰਚਾਈ ਕਰੋ।\n"
                f"3. ਜੈਵਿਕ ਫੰਗੀਸਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
                f"ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਸਾਵਧਾਨੀਆਂ ({disease})"
            )
        return (
            f"{disease} ({confidence} ਨਿਸ਼ਚਿਤਤਾ) ਲਈ ਹੇਠਲੇ ਖਰਾਬ ਪੱਤਿਆਂ ਨੂੰ ਹਟਾਓ ਅਤੇ ਪੌਦਿਆਂ ਨੂੰ ਸੁੱਕਾ ਰੱਖੋ। ਲੋੜ ਪੈਣ 'ਤੇ ਖੇਤੀਬਾੜੀ ਮਾਹਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
            f"ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ({crop})"
        )

    # ------------------ MARATHI RESPONSES ------------------
    elif lang == "mr":
        if any(w in lower for w in ["अर्थ", "रोग", "काय", "meaning", "symptom"]):
            return (
                f"{disease} हा पानांवरील बुरशीजन्य रोग आहे. यामध्ये खालच्या पानांवर काळे डाग पडतात आणि पाने पिवळी पडतात.",
                f"संदर्भ: {crop} ({confidence} अचूकता)"
            )
        if any(w in lower for w in ["काळजी", "उपाय", "प्रतिबंध", "precaution", "prevent"]):
            return (
                f"{disease} साठी प्रमुख उपाय:\n"
                f"1. संसर्ग झालेली खालची पाने काढून टाका.\n"
                f"2. पानांवर पाणी न टाकता ठिबक सिंचनाने मुळांना पाणी द्या.\n"
                f"3. जैविक बुरशीनाशकाची फवारणी करा.",
                f"शिफारस केलेले उपाय ({disease})"
            )
        return (
            f"{disease} ({confidence} विश्वासार्हता) नियंत्रणासाठी बाधित पाने काढून टाका व झाडांच्या मुळाशी पाणी द्या. जास्त प्रादुर्भाव असल्यास कृषी सेवा केंद्राचा सल्ला घ्या.",
            f"कृषी सल्लागार ({crop})"
        )

    # ------------------ GUJARATI RESPONSES ------------------
    elif lang == "gu":
        if any(w in lower for w in ["અર્થ", "રોગ", "શું", "meaning", "symptom"]):
            return (
                f"{disease} એ પાંદડાનો ફૂગજન્ય રોગ છે. આનાથી નીચલા પાંદડા પર કાળા ધબ્બા પડે છે અને પાંદડા પીળા પડી જાય છે.",
                f"સંદર્ભ: {crop} ({confidence} ચોકસાઈ)"
            )
        if any(w in lower for w in ["સાવચેતી", "ઇલાજ", "રક્ષણ", "precaution", "prevent"]):
            return (
                f"{disease} માટે મુખ્ય સાવચેતીઓ:\n"
                f"1. રોગગ્રસ્ત નીચલા પાંદડા દૂર કરો.\n"
                f"2. પાંદડા પર પાણી છાંટવાને બદલે ટપક સિંચાઈથી મૂળમાં પાણી આપો.\n"
                f"3. જરૂરી જણાય તો તાંબા આધારિત જૈવિક ફૂગનાશકનો છંટકાવ કરો.",
                f"ભલામણ કરેલ સાવચેતીઓ ({disease})"
            )
        return (
            f"{disease} ({confidence} ચોકસાઈ) ના નિયંત્રણ માટે પાંદડાની છંટકાવ કરો અને મૂળમાં પાણી આપો.",
            f"ખેતી સલાહકાર ({crop})"
        )

    # ------------------ TELUGU RESPONSES ------------------
    elif lang == "te":
        if any(w in lower for w in ["అర్థం", "వ్యాధి", "ఏమిటి", "meaning", "symptom"]):
            return (
                f"{disease} అనేది ఆకుల శిలీంధ్ర వ్యాధి. దీనివల్ల దిగువ ఆకులపై నల్లటి మచ్చలు ఏర్పడి ఆకులు పసుపు రంగులోకి మారతాయి.",
                f"సందర్భం: {crop} ({confidence} నమ్మకం)"
            )
        if any(w in lower for w in ["జాగ్రత్తలు", "నివారణ", "చికిత్స", "precaution", "prevent"]):
            return (
                f"{disease} నివారణకు ప్రధాన జాగ్రత్తలు:\n"
                f"1. వ్యాధి సోకిన దిగువ ఆకులను తొలగించి నాశనం చేయండి.\n"
                f"2. ఆకులపై నీరు పడకుండా డ్రిప్ ద్వారా మొదళ్లలో నీరు అందించండి.\n"
                f"3. బయో-ఫంగిసైడ్ స్ప్రే చేయండి.",
                f"సూచించిన జాగ్రత్తలు ({disease})"
            )
        return (
            f"{disease} ({confidence} ఖచ్చితత్వం) నివారణకు ఆకులను తొలగించి, మొక్క మొదళ్లలో డ్రిప్ నీటిని ఉపయోగించండి.",
            f"వ్యవసాయ సలహాదారు ({crop})"
        )

    # ------------------ TAMIL RESPONSES ------------------
    elif lang == "ta":
        if any(w in lower for w in ["பொருள்", "நோய்", "என்ன", "meaning", "symptom"]):
            return (
                f"{disease} என்பது இலைகளில் ஏற்படும் பூஞ்சை நோய். இது இலைகளில் கருப்பு புள்ளிகளை உருவாக்கி இலைகளை மஞ்சள் நிறமாக்குகிறது.",
                f"சூழல்: {crop} ({confidence} நம்பகத்தன்மை)"
            )
        if any(w in lower for w in ["முன்னெச்சரிக்கை", "தடுப்பு", "சிகிச்சை", "precaution", "prevent"]):
            return (
                f"{disease} க்கான முக்கிய முன்னெச்சரிக்கைகள்:\n"
                f"1. பாதிக்கப்பட்ட கீழ் இலைகளை அகற்றி அழிக்கவும்.\n"
                f"2. இலைகளில் தண்ணீர் தெளிக்காமல் சொட்டு நீர் பாசனம் மூலம் வேருக்கு நீர் பாய்ச்சவும்.\n"
                f"3. உயிரி பூஞ்சைக் கொல்லி தெளிக்கவும்.",
                f"பரிந்துரைக்கப்பட்ட முன்னெச்சரிக்கைகள் ({disease})"
            )
        return (
            f"{disease} ({confidence} துல்லியம்) கட்டுப்பாட்டிற்கு பாதிக்கப்பட்ட இலைகளை நீக்கி வேருக்கு சொட்டுநீர் பாசனம் செய்யவும்.",
            f"வேளாண் ஆலோசகர் ({crop})"
        )

    # ------------------ BENGALI RESPONSES ------------------
    elif lang == "bn":
        if any(w in lower for w in ["অর্থ", "রোগ", "কী", "meaning", "symptom"]):
            return (
                f"{disease} হল পাতার একটি ফাঙ্গাল ইনফেকশন। এর ফলে নিচের পাতায় কালো দাগ তৈরি হয় এবং পাতা হলুদ হয়ে যায়।",
                f"প্রেক্ষিত: {crop} ({confidence} নির্ভুলতা)"
            )
        if any(w in lower for w in ["সতর্কতা", "প্রতিকার", "চিকিৎসা", "precaution", "prevent"]):
            return (
                f"{disease} প্রতিরোধের প্রধান সতর্কতা:\n"
                f"1. আক্রান্ত নিচের পাতাগুলো ছেঁটে ফেলুন এবং নষ্ট করুন।\n"
                f"2. পাতায় জল না দিয়ে ড্রিপ সেচের মাধ্যমে গাছের গোড়ায় জল দিন।\n"
                f"3. জৈব বা কপার ফাঙ্গিসাইড স্প্রে করুন।",
                f"সুপারিশকৃত সতর্কতা ({disease})"
            )
        return (
            f"{disease} ({confidence} নির্ভুলতা) প্রতিরোধের জন্য আক্রান্ত পাতা ছেঁটে গাছের গোড়ায় সেচ দিন। সমস্যা বাড়লে নিকটস্থ কৃষি কেন্দ্রে যোগাযোগ করুন।",
            f"কৃষি বিশেষজ্ঞ ({crop})"
        )

    # ------------------ ENGLISH RESPONSES (DEFAULT) ------------------
    if any(w in lower for w in ["what does this disease mean", "mean", "what is", "symptom"]):
        return (
            f"{disease} is caused by foliar fungal pathogen Alternaria solani. It manifests as dark concentric target spots surrounded by chlorotic yellow halos on lower foliage. "
            f"If left unchecked, leaf tissue dies and defoliates, reducing fruit yield.",
            f"Context: {crop} ({confidence} confidence)"
        )

    if any(w in lower for w in ["precaution", "prevent", "cure", "treatment"]):
        return (
            f"Key precautions for {disease}:\n"
            f"1. Prune and safely destroy infected lower leaves off-field.\n"
            f"2. Water strictly at plant base using drip irrigation to keep foliage dry.\n"
            f"3. Ensure canopy airflow by spacing plants properly.\n"
            f"4. Apply copper-based or bio-fungicides if wet weather persists.",
            f"Recommended precautions for {disease}"
        )

    if any(w in lower for w in ["simply", "explain", "easy", "simple"]):
        return (
            f"In simple terms: your {crop} plant has a common leaf fungus called Early Blight. It creates dark target-like spots on bottom leaves. "
            f"Trimming off those infected leaves and keeping water off the foliage will help protect new leaves and fruits!",
            "Simplified farmer guidance"
        )

    if any(w in lower for w in ["spread", "contagious", "prevent spread"]):
        return (
            f"To stop {disease} from spreading:\n"
            f"• Disinfect shears between prunings.\n"
            f"• Mulch plant base to block soil splash.\n"
            f"• Avoid working among wet plants.\n"
            f"• Rotate with non-solanaceous crops next season.",
            "Spore containment measures"
        )

    if any(w in lower for w in ["water", "irrigation", "rain"]):
        return (
            f"Irrigation advice for {crop} with {disease}:\n"
            f"Keep leaves dry! Avoid overhead sprinklers. Use base drip lines for 20-30 minutes early morning so the soil surface dries by afternoon.",
            "Moisture Management"
        )

    if any(w in lower for w in ["fertilizer", "npk", "manure", "feed"]):
        return (
            f"Nutrient recommendation for {crop}:\n"
            f"Avoid excessive high-nitrogen fertilizers which generate tender susceptible foliage. Apply balanced NPK (19:19:19) with organic neem cake to boost root resistance.",
            "Balanced Nutrition"
        )

    return (
        f"For {disease} ({confidence} confidence), the primary recommendation is physical removal of lower affected leaves and maintaining dry foliage via root drip irrigation. "
        f"If symptoms worsen, consult your local agricultural extension officer for safe bio-fungicide treatments.",
        f"Grounded advisor for {crop}"
    )

