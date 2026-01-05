export type Language = 'en' | 'kn' | 'hi' | 'ta' | 'te'

export const languages = {
    en: 'English',
    kn: 'ಕನ್ನಡ',
    hi: 'हिंदी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
}

export const translations = {
    // Student Login
    studentLogin: {
        title: {
            en: 'Welcome Back',
            kn: 'ಮತ್ತೆ ಸ್ವಾಗತ',
            hi: 'वापसी पर स्वागत है',
            ta: 'மீண்டும் வரவேற்கிறோம்',
            te: 'తిరిగి స్వాగతం',
        },
        description: {
            en: 'Sign in to track your school bus',
            kn: 'ನಿಮ್ಮ ಶಾಲಾ ಬಸ್ ಅನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
            hi: 'अपनी स्कूल बस को ट्रैक करने के लिए साइन इन करें',
            ta: 'உங்கள் பள்ளி பேருந்தைக் கண்காணிக்க உள்நுழையவும்',
            te: 'మీ స్కూల్ బస్సును ట్రాక్ చేయడానికి సైన్ ఇన్ చేయండి',
        },
        phoneLabel: {
            en: 'Phone Number',
            kn: 'ಫೋನ್ ಸಂಖ್ಯೆ',
            hi: 'फ़ोन नंबर',
            ta: 'தொலைபேசி எண்',
            te: 'ఫోన్ నంబర్',
        },
        phonePlaceholder: {
            en: 'Enter your phone number',
            kn: 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
            hi: 'अपना फ़ोन नंबर दर्ज करें',
            ta: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
            te: 'మీ ఫోన్ నంబర్‌ను నమోదు చేయండి',
        },
        phoneHelper: {
            en: '10 digits starting with 6-9',
            kn: '6-9 ರಿಂದ ಪ್ರಾರಂಭವಾಗುವ 10 ಅಂಕೆಗಳು',
            hi: '6-9 से शुरू होने वाले 10 अंक',
            ta: '6-9 இல் தொடங்கும் 10 இலக்கங்கள்',
            te: '6-9 తో ప్రారంభమయ్యే 10 అంకెలు',
        },
        secureLogin: {
            en: 'Secure Login:',
            kn: 'ಸುರಕ್ಷಿತ ಲಾಗಿನ್:',
            hi: 'सुरक्षित लॉगिन:',
            ta: 'பாதுகாப்பான உள்நுழைவு:',
            te: 'సురక్షిత లాగిన్:',
        },
        secureLoginDesc: {
            en: "We'll send a one-time password (OTP) to your phone number for verification.",
            kn: 'ಪರಿಶೀಲನೆಗಾಗಿ ನಾವು ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಗೆ ಒಂದು ಬಾರಿ ಪಾಸ್‌ವರ್ಡ್ (OTP) ಕಳುಹಿಸುತ್ತೇವೆ.',
            hi: 'हम सत्यापन के लिए आपके फ़ोन नंबर पर एक बार का पासवर्ड (OTP) भेजेंगे।',
            ta: 'சரிபார்ப்புக்காக உங்கள் தொலைபேசி எண்ணுக்கு ஒரு முறை கடவுச்சொல் (OTP) அனுப்புவோம்.',
            te: 'ధృవీకరణ కోసం మేము మీ ఫోన్ నంబర్‌కు ఒక్కసారి పాస్‌వర్డ్ (OTP) పంపుతాము.',
        },
        sendOTP: {
            en: 'Send OTP',
            kn: 'OTP ಕಳುಹಿಸಿ',
            hi: 'OTP भेजें',
            ta: 'OTP அனுப்பு',
            te: 'OTP పంపండి',
        },
        sendingOTP: {
            en: 'Sending OTP...',
            kn: 'OTP ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
            hi: 'OTP भेजा जा रहा है...',
            ta: 'OTP அனுப்பப்படுகிறது...',
            te: 'OTP పంపబడుతోంది...',
        },
        noAccount: {
            en: "Don't have an account?",
            kn: 'ಖಾತೆ ಇಲ್ಲವೇ?',
            hi: 'खाता नहीं है?',
            ta: 'கணக்கு இல்லையா?',
            te: 'ఖాతా లేదా?',
        },
        signUp: {
            en: 'Sign up',
            kn: 'ಸೈನ್ ಅಪ್ ಮಾಡಿ',
            hi: 'साइन अप करें',
            ta: 'பதிவு செய்யவும்',
            te: 'సైన్ అప్ చేయండి',
        },
    },

    // Student Signup
    studentSignup: {
        title: {
            en: 'Create Student Account',
            kn: 'ವಿದ್ಯಾರ್ಥಿ ಖಾತೆ ರಚಿಸಿ',
            hi: 'छात्र खाता बनाएं',
            ta: 'மாணவர் கணக்கை உருவாக்கவும்',
            te: 'విద్యార్థి ఖాతాను సృష్టించండి',
        },
        description: {
            en: 'Sign up to start tracking your school bus',
            kn: 'ನಿಮ್ಮ ಶಾಲಾ ಬಸ್ ಅನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಸೈನ್ ಅಪ್ ಮಾಡಿ',
            hi: 'अपनी स्कूल बस को ट्रैक करना शुरू करने के लिए साइन अप करें',
            ta: 'உங்கள் பள்ளி பேருந்தைக் கண்காணிக்க பதிவு செய்யவும்',
            te: 'మీ స్కూల్ బస్సును ట్రాక్ చేయడం ప్రారంభించడానికి సైన్ అప్ చేయండి',
        },
        studentName: {
            en: 'Student Name',
            kn: 'ವಿದ್ಯಾರ್ಥಿ ಹೆಸರು',
            hi: 'छात्र का नाम',
            ta: 'மாணவர் பெயர்',
            te: 'విద్యార్థి పేరు',
        },
        fatherName: {
            en: "Father's / Mother's / Guardian's Name",
            kn: 'ತಂದೆ / ತಾಯಿ / ಪೋಷಕರ ಹೆಸರು',
            hi: 'पिता / माता / अभिभावक का नाम',
            ta: 'தந்தை / தாய் / பாதுகாவலர் பெயர்',
            te: 'తండ్రి / తల్లి / సంరక్షకుడి పేరు',
        },
        class: {
            en: 'Class',
            kn: 'ತರಗತಿ',
            hi: 'कक्षा',
            ta: 'வகுப்பு',
            te: 'తరగతి',
        },
        section: {
            en: 'Section',
            kn: 'ವಿಭಾಗ',
            hi: 'अनुभाग',
            ta: 'பிரிவு',
            te: 'విభాగం',
        },
        schoolName: {
            en: 'School Name',
            kn: 'ಶಾಲೆಯ ಹೆಸರು',
            hi: 'स्कूल का नाम',
            ta: 'பள்ளி பெயர்',
            te: 'పాఠశాల పేరు',
        },
        city: {
            en: 'City',
            kn: 'ನಗರ',
            hi: 'शहर',
            ta: 'நகரம்',
            te: 'నగరం',
        },
        busNumber: {
            en: 'Bus Number',
            kn: 'ಬಸ್ ಸಂಖ್ಯೆ',
            hi: 'बस नंबर',
            ta: 'பேருந்து எண்',
            te: 'బస్ నంబర్',
        },
        createAccount: {
            en: 'Create Account',
            kn: 'ಖಾತೆ ರಚಿಸಿ',
            hi: 'खाता बनाएं',
            ta: 'கணக்கை உருவாக்கவும்',
            te: 'ఖాతాను సృష్టించండి',
        },
        creating: {
            en: 'Creating...',
            kn: 'ರಚಿಸಲಾಗುತ್ತಿದೆ...',
            hi: 'बनाया जा रहा है...',
            ta: 'உருவாக்கப்படுகிறது...',
            te: 'సృష్టిస్తోంది...',
        },
        haveAccount: {
            en: 'Already have an account?',
            kn: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?',
            hi: 'पहले से खाता है?',
            ta: 'ஏற்கனவே கணக்கு உள்ளதா?',
            te: 'ఇప్పటికే ఖాతా ఉందా?',
        },
        login: {
            en: 'Login',
            kn: 'ಲಾಗಿನ್',
            hi: 'लॉगिन',
            ta: 'உள்நுழைவு',
            te: 'లాగిన్',
        },
    },

    // Driver Login
    driverLogin: {
        title: {
            en: 'Driver Login',
            kn: 'ಚಾಲಕ ಲಾಗಿನ್',
            hi: 'ड्राइवर लॉगिन',
            ta: 'ஓட்டுநர் உள்நுழைவு',
            te: 'డ్రైవర్ లాగిన్',
        },
        description: {
            en: 'Sign in to manage your bus route',
            kn: 'ನಿಮ್ಮ ಬಸ್ ಮಾರ್ಗವನ್ನು ನಿರ್ವಹಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
            hi: 'अपने बस मार्ग को प्रबंधित करने के लिए साइन इन करें',
            ta: 'உங்கள் பேருந்து வழியை நிர்வகிக்க உள்நுழையவும்',
            te: 'మీ బస్ మార్గాన్ని నిర్వహించడానికి సైన్ ఇన్ చేయండి',
        },
    },

    // Driver Signup
    driverSignup: {
        title: {
            en: 'Driver Registration',
            kn: 'ಚಾಲಕ ನೋಂದಣಿ',
            hi: 'ड्राइवर पंजीकरण',
            ta: 'ஓட்டுநர் பதிவு',
            te: 'డ్రైవర్ నమోదు',
        },
        description: {
            en: 'Register as a school bus driver',
            kn: 'ಶಾಲಾ ಬಸ್ ಚಾಲಕರಾಗಿ ನೋಂದಾಯಿಸಿ',
            hi: 'स्कूल बस ड्राइवर के रूप में पंजीकरण करें',
            ta: 'பள்ளி பேருந்து ஓட்டுநராக பதிவு செய்யவும்',
            te: 'స్కూల్ బస్ డ్రైవర్‌గా నమోదు చేసుకోండి',
        },
        driverName: {
            en: 'Driver Name',
            kn: 'ಚಾಲಕ ಹೆಸರು',
            hi: 'ड्राइवर का नाम',
            ta: 'ஓட்டுநர் பெயர்',
            te: 'డ్రైవర్ పేరు',
        },
        licenseNumber: {
            en: 'License Number',
            kn: 'ಪರವಾನಗಿ ಸಂಖ್ಯೆ',
            hi: 'लाइसेंस नंबर',
            ta: 'உரிம எண்',
            te: 'లైసెన్స్ నంబర్',
        },
        district: {
            en: 'District',
            kn: 'ಜಿಲ್ಲೆ',
            hi: 'जिला',
            ta: 'மாவட்டம்',
            te: 'జిల్లా',
        },
    },

    // Common
    common: {
        selectLanguage: {
            en: 'Select Language',
            kn: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
            hi: 'भाषा चुनें',
            ta: 'மொழியைத் தேர்ந்தெடுக்கவும்',
            te: 'భాషను ఎంచుకోండి',
        },
    },
}

export function getTranslation(key: string, lang: Language = 'en'): string {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
        value = value?.[k]
        if (!value) return key
    }

    return value[lang] || value['en'] || key
}
