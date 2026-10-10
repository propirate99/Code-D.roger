/**
 * TRIP GENIE - MULTI-LANGUAGE SYSTEM & TRANSLATOR
 * Supports 10 Languages with dynamic UI translation and Speech API Phrasebook
 */

const TRIP_GENIE_LANGUAGES = {
  en: {
    name: 'English',
    native: 'English',
    hero_title: 'Your Journey. One Genie.',
    hero_sub: 'Plan your trip, book everything you need, navigate safely and get instant travel assistance — all in one place.',
    search_where: 'Where do you want to go?',
    dest_label: 'Destination',
    dep_label: 'Departure Date',
    ret_label: 'Return Date',
    trav_label: 'Travelers',
    search_btn: 'Search',
    genie_ai_btn: 'Plan with Genie AI',
    quick_services: 'Quick Services',
    quick_sub: 'Everything you need in one unified travel hub',
    digital_pay: 'Digital Pay',
    digital_pay_sub: 'UPI • Recharge • Bills',
    travel_booking: 'Travel Booking',
    travel_sub: 'Flights • Trains • Bus',
    hotels_stays: 'Hotels & Stays',
    hotels_sub: 'Hotels • Villas • Homestays',
    rides: 'Rides',
    rides_sub: 'Bike • Auto • Cab',
    food: 'Food Discovery',
    food_sub: 'Restaurants • Delivery',
    entertainment: 'Entertainment',
    entertainment_sub: 'Movies • Events • Concerts',
    maps: 'Offline Maps & GPS',
    maps_sub: 'GPS • Navigation • Offline',
    emergency_sos: 'Emergency SOS',
    emergency_sub: '24/7 SOS • Contacts • Alerts',
    wallet_balance: 'Wallet Balance',
    pay_now: 'Pay Now',
    send_money: 'Send Money',
    scan_qr: 'Scan & Pay',
    view_stay: 'View Stay',
    book_ride: 'Book Ride',
    view_menu: 'View Menu',
    book_tickets: 'Book Tickets',
    my_trip: 'My Trip',
    my_bookings: 'My Bookings',
    explore: 'Explore',
    profile: 'Profile',
    sos_alert: 'Emergency Mode Active'
  },
  hi: {
    name: 'Hindi',
    native: 'हिंदी',
    hero_title: 'आपकी यात्रा। एक जिनी।',
    hero_sub: 'अपनी यात्रा की योजना बनाएं, उड़ानें और होटल बुक करें, सुरक्षित रूप से घूमें और तुरंत सहायता पाएं - सब एक ही स्थान पर।',
    search_where: 'आप कहाँ जाना चाहते हैं?',
    dest_label: 'गंतव्य स्थान',
    dep_label: 'प्रस्थान तिथि',
    ret_label: 'वापसी तिथि',
    trav_label: 'यात्री',
    search_btn: 'खोजें',
    genie_ai_btn: 'जिनी AI के साथ प्लान करें',
    quick_services: 'त्वरित सेवाएं',
    quick_sub: 'आपकी यात्रा की हर जरूरत एक ही जगह पर',
    digital_pay: 'डिजिटल भुगतान',
    digital_pay_sub: 'UPI • रिचार्ज • बिल',
    travel_booking: 'यात्रा बुकिंग',
    travel_sub: 'उड़ान • ट्रेन • बस',
    hotels_stays: 'होटल और स्टे',
    hotels_sub: 'होटल • विला • होमस्टे',
    rides: 'राइड्स और कैब',
    rides_sub: 'बाइक • ऑटो • कैब',
    food: 'स्वादिष्ट भोजन',
    food_sub: 'रेस्तरां • डिलीवरी',
    entertainment: 'मनोरंजन',
    entertainment_sub: 'फिल्में • कार्यक्रम • संगीत',
    maps: 'ऑफ़लाइन मैप्स व GPS',
    maps_sub: 'GPS • नेविगेशन • ऑफ़लाइन',
    emergency_sos: 'आपातकालीन SOS',
    emergency_sub: '24/7 सहायता • संपर्क • अलर्ट',
    wallet_balance: 'वॉलेट शेष राशि',
    pay_now: 'अभी भुगतान करें',
    send_money: 'पैसे भेजें',
    scan_qr: 'स्कैन करें और भुगतान करें',
    view_stay: 'होटल देखें',
    book_ride: 'राइड बुक करें',
    view_menu: 'मेनू देखें',
    book_tickets: 'टिकट बुक करें',
    my_trip: 'मेरी यात्रा',
    my_bookings: 'मेरी बुकिंग्स',
    explore: 'एक्सप्लोर करें',
    profile: 'प्रोफाइल',
    sos_alert: 'आपातकालीन मोड सक्रिय'
  },
  ta: {
    name: 'Tamil',
    native: 'தமிழ்',
    hero_title: 'உங்கள் பயணம். ஒரே ஜீனி.',
    hero_sub: 'பயணத்தை திட்டமிடுங்கள், அனைத்தும் முன்பதிவு செய்யுங்கள், பாதுகாப்பாக செல்லுங்கள் மற்றும் உடனடி உதவி பெறுங்கள்.',
    search_where: 'நீங்கள் எங்கு செல்ல விரும்புகிறீர்கள்?',
    dest_label: 'சேருமிடம்',
    dep_label: 'புறப்படும் தேதி',
    ret_label: 'திரும்பும் தேதி',
    trav_label: 'பயணிகள்',
    search_btn: 'தேடுங்கள்',
    genie_ai_btn: 'ஜீனி AI உடன் திட்டமிடுங்கள்',
    quick_services: 'விரைவு சேவைகள்',
    quick_sub: 'அனைத்து பயண சேவைகளும் ஒரே இடத்தில்',
    digital_pay: 'டிஜிட்டல் பணம்',
    digital_pay_sub: 'UPI • ரீசார்ஜ் • கட்டணங்கள்',
    travel_booking: 'பயண முன்பதிவு',
    travel_sub: 'விமானம் • ரயில் • பஸ்',
    hotels_stays: 'ஹோட்டல்கள் & தங்குமிடம்',
    hotels_sub: 'ஹோட்டல்கள் • வில்லா • ஹோம்ஸ்டே',
    rides: 'பயண சவாரிகள்',
    rides_sub: 'பைக் • ஆட்டோ • கேப்',
    food: 'உணவு தேடல்',
    food_sub: 'உணவகங்கள் • டெலிவரி',
    entertainment: 'பொழுதுபோக்கு',
    entertainment_sub: 'திரைப்படங்கள் • நிகழ்வுகள்',
    maps: 'வரைபடங்கள் & ஜிபிஎஸ்',
    maps_sub: 'ஜிபிஎஸ் • வழிகாட்டுதல்',
    emergency_sos: 'அவசர SOS',
    emergency_sub: '24/7 உதவி • தொடர்புகள்',
    wallet_balance: 'பணப்பை இருப்பு',
    pay_now: 'பணம் செலுத்துங்கள்',
    send_money: 'பணம் அனுப்புங்கள்',
    scan_qr: 'ஸ்கேன் செய்து செலுத்துங்கள்',
    view_stay: 'தங்குமிடத்தை பாருங்கள்',
    book_ride: 'சவாரி முன்பதிவு',
    view_menu: 'மெனு பார்க்கவும்',
    book_tickets: 'டிக்கெட் பதிவு',
    my_trip: 'என் பயணம்',
    my_bookings: 'என் முன்பதிவுகள்',
    explore: 'ஆராயுங்கள்',
    profile: 'சுயவிவரம்',
    sos_alert: 'அவசர நிலை இயக்கப்பட்டது'
  },
  te: {
    name: 'Telugu',
    native: 'తెలుగు',
    hero_title: 'మీ ప్రయాణం. ఒకే జీనీ.',
    hero_sub: 'ట్రిప్ ప్లాన్ చేయండి, టిక్కెట్లు బుక్ చేయండి, సురక్షితంగా ప్రయాణించండి మరియు తక్షణ సహాయం పొందండి.',
    search_where: 'మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారు?',
    dest_label: 'గమ్యస్థానం',
    dep_label: 'బయలుదేరే తేదీ',
    ret_label: 'తిరిగి వచ్చే తేదీ',
    trav_label: 'ప్రయాణికులు',
    search_btn: 'శోధించండి',
    genie_ai_btn: 'జీనీ AI తో ప్లాన్ చేయండి',
    quick_services: 'శీఘ్ర సేవలు',
    quick_sub: 'మీ ప్రయాణ అవసరాలన్నీ ఒకే చోట',
    digital_pay: 'డిజిటల్ పేమెంట్స్',
    digital_pay_sub: 'UPI • రీఛార్జ్ • బిల్లులు',
    travel_booking: 'ప్రయాణ బుకింగ్స్',
    travel_sub: 'విమానాలు • రైళ్లు • బస్సులు',
    hotels_stays: 'హోటళ్ళు & స్టేలు',
    hotels_sub: 'హోటళ్ళు • విల్లాలు • హోమ్‌స్టేలు',
    rides: 'రైడ్‌లు',
    rides_sub: 'బైక్ • ఆటో • క్యాబ్',
    food: 'ఆహారం & రెస్టారెంట్లు',
    food_sub: 'రెస్టారెంట్లు • డెలివరీ',
    entertainment: 'వినోదం',
    entertainment_sub: 'సినిమాలు • ఈవెంట్స్',
    maps: 'మ్యాప్‌లు & GPS',
    maps_sub: 'GPS • నావిగేషన్',
    emergency_sos: 'అత్యవసర SOS',
    emergency_sub: '24/7 సహాయం • హెల్ప్‌లైన్',
    wallet_balance: 'వాలెట్ బ్యాలెన్స్',
    pay_now: 'ఇప్పుడే చెల్లించండి',
    send_money: 'డబ్బు పంపండి',
    scan_qr: 'స్కాన్ చేసి చెల్లించండి',
    view_stay: 'స్టే చూడండి',
    book_ride: 'రైడ్ బుక్ చేయండి',
    view_menu: 'మెనూ చూడండి',
    book_tickets: 'టికెట్లు బుక్ చేయండి',
    my_trip: 'నా ట్రిప్',
    my_bookings: 'నా బుకింగ్స్',
    explore: 'అన్వేషించండి',
    profile: 'ప్రొఫైల్',
    sos_alert: 'అత్యవసర మోడ్ ఆన్‌లో ఉంది'
  },
  ml: {
    name: 'Malayalam',
    native: 'മലയാളം',
    hero_title: 'നിങ്ങളുടെ യാത്ര. ഒരൊറ്റ ജീനി.',
    hero_sub: 'യാത്ര പ്ലാൻ ചെയ്യൂ, എല്ലാം എളുപ്പത്തിൽ ബുക്ക് ചെയ്യൂ, സുരക്ഷിതമായി യാത്ര ചെയ്യൂ.',
    search_where: 'നിങ്ങൾക്ക് എവിടെ പോകണം?',
    dest_label: 'സ്ഥലം',
    dep_label: 'യാത്രാ തീയതി',
    ret_label: 'മടക്ക തീയതി',
    trav_label: 'യാത്രക്കാർ',
    search_btn: 'തിരയുക',
    genie_ai_btn: 'ജീനി AI വഴി പ്ലാൻ ചെയ്യുക',
    quick_services: 'ദ്രുത സേവനങ്ങൾ',
    quick_sub: 'യാത്രയ്ക്ക് വേണ്ടതെല്ലാം ഒരിടത്ത്',
    digital_pay: 'ഡിജിറ്റൽ പേ',
    digital_pay_sub: 'UPI • റീചാർജ് • ബില്ലുകൾ',
    travel_booking: 'ടിക്കറ്റ് ബുക്കിംഗ്',
    travel_sub: 'ഫ്ലൈറ്റ് • ട്രെയിൻ • ബസ്',
    hotels_stays: 'ഹോട്ടലുകൾ',
    hotels_sub: 'ഹോട്ടലുകൾ • വില്ലകൾ',
    rides: 'റൈഡുകൾ',
    rides_sub: 'ബൈക്ക് • ഓട്ടോ • ടാക്സി',
    food: 'ഭക്ഷണശാലകൾ',
    food_sub: 'റെസ്റ്റോറന്റുകൾ • ഡെലിവറി',
    entertainment: 'വിനോദം',
    entertainment_sub: 'സിനിമകൾ • ഇവന്റുകൾ',
    maps: 'മാപ്പുകൾ & ജിപിഎസ്',
    maps_sub: 'ജിപിഎസ് • നാവിഗേഷൻ',
    emergency_sos: 'അടിയന്തര SOS',
    emergency_sub: '24/7 സഹായം • കോൺടാക്റ്റുകൾ',
    wallet_balance: 'വാലറ്റ് ബാലൻസ്',
    pay_now: 'പണമടയ്ക്കുക',
    send_money: 'പണം അയക്കുക',
    scan_qr: 'സ്കാൻ ചെയ്തു നൽകുക',
    view_stay: 'ഹോട്ടൽ കാണുക',
    book_ride: 'ടാക്സി വിളിക്കുക',
    view_menu: 'മെനു കാണുക',
    book_tickets: 'ടിക്കറ്റ് എടുക്കുക',
    my_trip: 'എന്റെ യാത്ര',
    my_bookings: 'എന്റെ ബുക്കിംഗുകൾ',
    explore: 'കാണുക',
    profile: 'പ്രൊഫൈൽ',
    sos_alert: 'എമർജൻസി മോഡ് സജീവം'
  },
  kn: {
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    hero_title: 'ನಿಮ್ಮ ಪ್ರಯಾಣ. ಒಂದೇ ಜೀನಿ.',
    hero_sub: 'ಪ್ರವಾಸ ಯೋಜಿಸಿ, ಎಲ್ಲವನ್ನೂ ಬುಕ್ ಮಾಡಿ, ಸುರಕ್ಷಿತವಾಗಿ ಸಂಚರಿಸಿ ಮತ್ತು ತ್ವರಿತ ನೆರವು ಪಡೆಯಿರಿ.',
    search_where: 'ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ?',
    dest_label: 'ಗಮ್ಯಸ್ಥಾನ',
    dep_label: 'ಹೊರಡುವ ದಿನಾಂಕ',
    ret_label: 'ಮರಳುವ ದಿನಾಂಕ',
    trav_label: 'ಪ್ರಯಾಣಿಕರು',
    search_btn: 'ಹುಡುಕಿ',
    genie_ai_btn: 'ಜೀನಿ AI ನೊಂದಿಗೆ ಯೋಜಿಸಿ',
    quick_services: 'ತ್ವರಿತ ಸೇವೆಗಳು',
    quick_sub: 'ನಿಮ್ಮ ಪ್ರಯಾಣದ ಎಲ್ಲಾ ಅಗತ್ಯಗಳು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ',
    digital_pay: 'ಡಿಜಿಟಲ್ ಪಾವತಿ',
    digital_pay_sub: 'UPI • ರೀಚಾರ್ಜ್ • ಬಿಲ್ಗಳು',
    travel_booking: 'ಪ್ರಯಾಣ ಬುಕಿಂಗ್',
    travel_sub: 'ವಿಮಾನ • ರೈಲು • ಬಸ್',
    hotels_stays: 'ಹೋಟೆಲ್‌ಗಳು & ತಂಗುದಾಣ',
    hotels_sub: 'ಹೋಟೆಲ್‌ಗಳು • ವಿಲ್ಲಾಗಳು',
    rides: 'ರೈಡ್‌ಗಳು',
    rides_sub: 'ಬೈಕ್ • ಆಟೋ • ಕ್ಯಾಬ್',
    food: 'ಆಹಾರ & ತಿಂಡಿ',
    food_sub: 'ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು • ಡೆಲಿವರಿ',
    entertainment: 'ಮನರಂಜನೆ',
    entertainment_sub: 'ಸಿನಿಮಾಗಳು • ಈವೆಂಟ್‌ಗಳು',
    maps: 'ನಕ್ಷೆಗಳು & GPS',
    maps_sub: 'GPS • ನ್ಯಾವಿಗೇಷನ್',
    emergency_sos: 'ತುರ್ತು SOS',
    emergency_sub: '24/7 ತುರ್ತು ನೆರವು',
    wallet_balance: 'ವ್ಯಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್',
    pay_now: 'ಈಗ ಪಾವತಿಸಿ',
    send_money: 'ಹಣ ಕಳುಹಿಸಿ',
    scan_qr: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಪಾವತಿಸಿ',
    view_stay: 'ಹೋಟೆಲ್ ವೀಕ್ಷಿಸಿ',
    book_ride: 'ರೈಡ್ ಬುಕ್ ಮಾಡಿ',
    view_menu: 'ಮೆನು ನೋಡಿ',
    book_tickets: 'ಟಿಕೆಟ್ ಕಾಯ್ದಿರಿಸಿ',
    my_trip: 'ನನ್ನ ಪ್ರವಾಸ',
    my_bookings: 'ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು',
    explore: 'ಅನ್ವೇಷಿಸಿ',
    profile: 'ಪ್ರೊಫೈಲ್',
    sos_alert: 'ತುರ್ತು ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ'
  },
  bn: {
    name: 'Bengali',
    native: 'বাংলা',
    hero_title: 'আপনার যাত্রা। এক জিনি।',
    hero_sub: 'ভ্রমণের পরিকল্পনা করুন, সবকিছু বুক করুন, নিরাপদে ঘুরুন এবং তাৎক্ষণিক সহায়তা পান।',
    search_where: 'আপনি কোথায় যেতে চান?',
    dest_label: 'গন্তব্য',
    dep_label: 'যাত্রার তারিখ',
    ret_label: 'ফেরার তারিখ',
    trav_label: 'যাত্রী সংখ্যা',
    search_btn: 'অনুসন্ধান',
    genie_ai_btn: 'জিনি AI দিয়ে প্ল্যান করুন',
    quick_services: 'জরুরি সেবা সমূহ',
    quick_sub: 'ভ্রমণের যাবতীয় প্রয়োজন এক ঠিকানায়',
    digital_pay: 'ডিজিটাল পেমেন্ট',
    digital_pay_sub: 'UPI • রিচার্জ • বিল পে',
    travel_booking: 'টিকেট বুকিং',
    travel_sub: 'ফ্লাইট • ট্রেন • বাস',
    hotels_stays: 'হোটেল ও রিসোর্ট',
    hotels_sub: 'হোটেল • ভিলা • হোমস্টে',
    rides: 'গাড়ি ও ক্যাব',
    rides_sub: 'বাইক • অটো • ক্যাব',
    food: 'খাবারের সন্ধান',
    food_sub: 'রেস্তোরাঁ • ডেলিভারি',
    entertainment: 'বিনোদন',
    entertainment_sub: 'সিনেমা • কনসার্ট',
    maps: 'অফলাইন ম্যাপ ও জিপিএস',
    maps_sub: 'জিপিএস • নেভিগেশন',
    emergency_sos: 'জরুরি SOS',
    emergency_sub: '২৪/৭ সহায়তা • নম্বর',
    wallet_balance: 'ওয়ালেট ব্যালেন্স',
    pay_now: 'এখনই পেমেন্ট করুন',
    send_money: 'টাকা পাঠান',
    scan_qr: 'স্ক্যান করে পে করুন',
    view_stay: 'হোটেল দেখুন',
    book_ride: 'রাইড বুক করুন',
    view_menu: 'মেনু দেখুন',
    book_tickets: 'টিকেট বুক করুন',
    my_trip: 'আমার ট্রিপ',
    my_bookings: 'আমার বুকিং',
    explore: 'ঘুরে দেখুন',
    profile: 'প্রোফাইল',
    sos_alert: 'জরুরি অবস্থা সক্রিয়'
  },
  mr: {
    name: 'Marathi',
    native: 'मराठी',
    hero_title: 'तुमचा प्रवास. एक जिनी.',
    hero_sub: 'सहलीचे नियोजन करा, सर्वकाही बुक करा, सुरक्षितपणे प्रवास करा आणि त्वरित मदत मिळवा.',
    search_where: 'तुम्हाला कुठे जायचे आहे?',
    dest_label: 'गंतव्य स्थान',
    dep_label: 'प्रस्थान तारीख',
    ret_label: 'परतीची तारीख',
    trav_label: 'प्रवासी',
    search_btn: 'शोधा',
    genie_ai_btn: 'जिनी AI सह नियोजन करा',
    quick_services: 'जलद सेवा',
    quick_sub: 'प्रवासाच्या सर्व गरजा एकाच ठिकाणी',
    digital_pay: 'डिजिटल पेमेंट',
    digital_pay_sub: 'UPI • रिचार्ज • बिल',
    travel_booking: 'प्रवास बुकिंग',
    travel_sub: 'विमान • रेल्वे • बस',
    hotels_stays: 'हॉटेल्स आणि स्टे',
    hotels_sub: 'हॉटेल्स • व्हिला • होमस्टे',
    rides: 'राईड्स',
    rides_sub: 'बाईक • रिक्षा • कॅब',
    food: 'खाद्यपदार्थ',
    food_sub: 'रेस्टॉरंट्स • डिलिव्हरी',
    entertainment: 'मनोरंजन',
    entertainment_sub: 'चित्रपट • कार्यक्रम',
    maps: 'ऑफलाईन नकाशे व GPS',
    maps_sub: 'GPS • नेव्हिगेशन',
    emergency_sos: 'तातडीची मदत SOS',
    emergency_sub: '२४/७ मदत • संपर्क',
    wallet_balance: 'वॉलेट शिल्लक',
    pay_now: 'आता भरा',
    send_money: 'पैसे पाठवा',
    scan_qr: 'स्कॅन करून भरा',
    view_stay: 'हॉटेल पहा',
    book_ride: 'कॅब बुक करा',
    view_menu: 'मेनू पहा',
    book_tickets: 'तिकीट बुक करा',
    my_trip: 'माझी सहल',
    my_bookings: 'माझे बुकिंग',
    explore: 'एक्सप्लोर करा',
    profile: 'प्रोफाइल',
    sos_alert: 'आणीबाणी मोड सक्रिय'
  },
  gu: {
    name: 'Gujarati',
    native: 'ગુજરાતી',
    hero_title: 'તમારી યાત્રા. એક જીની.',
    hero_sub: 'તમારા પ્રવાસનું આયોજન કરો, બધું બુક કરો, સુરક્ષિત મુસાફરી કરો અને તાત્કાલિક સહાય મેળવો.',
    search_where: 'તમે ક્યાં જવા માંગો છો?',
    dest_label: 'સ્થળ',
    dep_label: 'પ્રસ્થાન તારીખ',
    ret_label: 'પરત ફરવાની તારીખ',
    trav_label: 'મુસાફરો',
    search_btn: 'શોધો',
    genie_ai_btn: 'જીની AI સાથે પ્લાન કરો',
    quick_services: 'ઝડપી સેવાઓ',
    quick_sub: 'તમારી યાત્રાની તમામ જરૂરિયાતો એક જ જગ્યાએ',
    digital_pay: 'ડિજિટલ પે',
    digital_pay_sub: 'UPI • રિચાર્જ • બિલ',
    travel_booking: 'મુસાફરી બુકિંગ',
    travel_sub: 'ફ્લાઇટ • ટ્રેન • બસ',
    hotels_stays: 'હોટેલ્સ અને સ્ટે',
    hotels_sub: 'હોટેલ્સ • વિલા • હોમસ્ટે',
    rides: 'રાઇડ્સ',
    rides_sub: 'બાઇક • રિક્ષા • કેબ',
    food: 'ખોરાકની શોધ',
    food_sub: 'રેસ્ટોરન્ટ્સ • ડિલિવરી',
    entertainment: 'મનોરંજન',
    entertainment_sub: 'ફિલ્મો • ઇવેન્ટ્સ',
    maps: 'નકશા અને GPS',
    maps_sub: 'GPS • નેવિગેશન',
    emergency_sos: 'ઇમરજન્સી SOS',
    emergency_sub: '૨૪/૭ સહાય • સંપર્કો',
    wallet_balance: 'વોલેટ બેલેન્સ',
    pay_now: 'હમણાં ચૂકવો',
    send_money: 'પૈસા મોકલો',
    scan_qr: 'સ્કેન કરીને ચૂકવો',
    view_stay: 'સ્ટે જુઓ',
    book_ride: 'રાઇડ બુક કરો',
    view_menu: 'મેનુ જુઓ',
    book_tickets: 'ટિકિટ બુક કરો',
    my_trip: 'મારી યાત્રા',
    my_bookings: 'મારા બુકિંગ્સ',
    explore: 'શોધો',
    profile: 'પ્રોફાઇલ',
    sos_alert: 'ઇમરજન્સી મોડ સક્રિય'
  },
  pa: {
    name: 'Punjabi',
    native: 'ਪੰਜਾਬੀ',
    hero_title: 'ਤੁਹਾਡਾ ਸਫ਼ਰ। ਇੱਕ ਜੀਨੀ।',
    hero_sub: 'ਆਪਣੀ ਯਾਤਰਾ ਦੀ ਯੋਜਨਾ ਬਣਾਓ, ਸਭ ਕੁਝ ਬੁੱਕ ਕਰੋ, ਸੁਰੱਖਿਅਤ ਯਾਤਰਾ ਕਰੋ ਅਤੇ ਤੁਰੰਤ ਮਦਦ ਪ੍ਰਾਪਤ ਕਰੋ।',
    search_where: 'ਤੁਸੀਂ ਕਿੱਥੇ ਜਾਣਾ ਚਾਹੁੰਦੇ ਹੋ?',
    dest_label: 'ਮੰਜ਼ਿਲ',
    dep_label: 'ਰਵਾਨਗੀ ਮਿਤੀ',
    ret_label: 'ਵਾਪਸੀ ਮਿਤੀ',
    trav_label: 'ਯਾਤਰੀ',
    search_btn: 'ਖੋਜੋ',
    genie_ai_btn: 'ਜੀਨੀ AI ਨਾਲ ਯੋਜਨਾ ਬਣਾਓ',
    quick_services: 'ਤੇਜ਼ ਸੇਵਾਵਾਂ',
    quick_sub: 'ਸਫ਼ਰ ਦੀਆਂ ਸਾਰੀਆਂ ਲੋੜਾਂ ਇੱਕ ਥਾਂ',
    digital_pay: 'ਡਿਜੀਟਲ ਭੁਗਤਾਨ',
    digital_pay_sub: 'UPI • ਰੀਚਾਰਜ • ਬਿੱਲ',
    travel_booking: 'ਟਿਕਟ ਬੁਕਿੰਗ',
    travel_sub: 'ਫਲਾਈਟ • ਰੇਲਗੱਡੀ • ਬੱਸ',
    hotels_stays: 'ਹੋਟਲ ਅਤੇ ਠਹਿਰ',
    hotels_sub: 'ਹੋਟਲ • ਵਿਲਾ • ਹੋਮਸਟੇ',
    rides: 'ਰਾਈਡਸ',
    rides_sub: 'ਬਾਈਕ • ਆਟੋ • ਕੈਬ',
    food: 'ਭੋਜਨ ਅਤੇ ਰੈਸਟੋਰੈਂਟ',
    food_sub: 'ਰੈਸਟੋਰੈਂਟ • ਡਿਲਿਵਰੀ',
    entertainment: 'ਮਨੋਰੰਜਨ',
    entertainment_sub: 'ਫਿਲਮਾਂ • ਸਮਾਗਮ',
    maps: 'ਨਕਸ਼ੇ ਅਤੇ GPS',
    maps_sub: 'GPS • ਨੈਵੀਗੇਸ਼ਨ',
    emergency_sos: 'ਐਮਰਜੈਂਸੀ SOS',
    emergency_sub: '24/7 ਸਹਾਇਤਾ • ਨੰਬਰ',
    wallet_balance: 'ਵਾਲਿਟ ਬਕਾਇਆ',
    pay_now: 'ਹੁਣੇ ਭੁਗਤਾਨ ਕਰੋ',
    send_money: 'ਪੈਸੇ ਭੇਜੋ',
    scan_qr: 'ਸਕੈਨ ਕਰਕੇ ਭੁਗਤਾਨ ਕਰੋ',
    view_stay: 'ਹੋਟਲ ਵੇਖੋ',
    book_ride: 'ਕੈਬ ਬੁੱਕ ਕਰੋ',
    view_menu: 'ਮੇਨੂ ਵੇਖੋ',
    book_tickets: 'ਟਿਕਟ ਬੁੱਕ ਕਰੋ',
    my_trip: 'ਮੇਰਾ ਸਫ਼ਰ',
    my_bookings: 'ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ',
    explore: 'ਐਕਸਪਲੋਰ ਕਰੋ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    sos_alert: 'ਐਮਰਜੈਂਸੀ ਮੋਡ ਚਾਲੂ ਹੈ'
  }
};

// Travel Phrasebook for Speech Synthesis & Translation Assistant
const TRAVEL_PHRASES = [
  { en: "Where is the nearest hospital?", hi: "निकटतम अस्पताल कहाँ है?", ta: "அருகிலுள்ள மருத்துவமனை எங்கே உள்ளது?", category: "Emergency" },
  { en: "How much does this cost?", hi: "इसकी कीमत कितनी है?", ta: "இதன் விலை என்ன?", category: "Shopping" },
  { en: "Please call the police immediately.", hi: "कृपया तुरंत पुलिस को फोन करें।", ta: "தயவுசெய்து உடனடியாக காவல்துறையை அழைக்கவும்.", category: "Emergency" },
  { en: "Can you help me find a taxi?", hi: "क्या आप मुझे टैक्सी खोजने में मदद कर सकते हैं?", ta: "எனக்கு ஒரு டாக்ஸி கண்டுபிடிக்க உதவ முடியுமா?", category: "Transport" },
  { en: "Where is the train station?", hi: "रेलवे स्टेशन कहाँ है?", ta: "ரயில் நிலையம் எங்கே?", category: "Transport" },
  { en: "Is this food vegetarian?", hi: "क्या यह खाना शाकाहारी है?", ta: "இந்த உணவு சைவ உணவா?", category: "Food" },
  { en: "Thank you very much for your help!", hi: "आपकी मदद के लिए बहुत-बहुत धन्यवाद!", ta: "உங்கள் உதவிக்கு மிக்க நன்றி!", category: "General" }
];

// Translation Controller Object
const LanguageManager = {
  currentLang: localStorage.getItem('trip_genie_lang') || 'en',

  init() {
    this.applyLanguage(this.currentLang);
    this.renderLangDropdown();
  },

  setLanguage(langCode) {
    if (!TRIP_GENIE_LANGUAGES[langCode]) return;
    this.currentLang = langCode;
    localStorage.setItem('trip_genie_lang', langCode);
    this.applyLanguage(langCode);
    
    // Trigger toast notification
    if (window.showToast) {
      window.showToast(`Language changed to ${TRIP_GENIE_LANGUAGES[langCode].native}`, 'info', '🌐');
    }
  },

  applyLanguage(langCode) {
    const dict = TRIP_GENIE_LANGUAGES[langCode] || TRIP_GENIE_LANGUAGES.en;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Update input placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update active label in dropdown trigger
    const currentLangLabel = document.getElementById('currentLangLabel');
    if (currentLangLabel) {
      currentLangLabel.textContent = dict.native;
    }
  },

  renderLangDropdown() {
    const list = document.getElementById('langDropdownList');
    if (!list) return;
    list.innerHTML = '';
    
    Object.keys(TRIP_GENIE_LANGUAGES).forEach(code => {
      const lang = TRIP_GENIE_LANGUAGES[code];
      const item = document.createElement('button');
      item.className = `dropdown-item ${code === this.currentLang ? 'active' : ''}`;
      item.innerHTML = `<span>${lang.native}</span> <span style="font-size:0.75rem; color:var(--text-muted);">${lang.name}</span>`;
      item.onclick = (e) => {
        e.preventDefault();
        this.setLanguage(code);
        const dropdown = document.getElementById('langDropdownMenu');
        if (dropdown) dropdown.classList.remove('active');
      };
      list.appendChild(item);
    });
  },

  // Text-To-Speech Travel Voice Assistant
  speakText(text, langCode = 'hi-IN') {
    if (!('speechSynthesis' in window)) {
      if (window.showToast) window.showToast('Speech synthesis not supported in this browser', 'warning');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Try to match appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes(langCode) || v.lang.includes(langCode.substring(0, 2)));
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }
};

window.TRIP_GENIE_LANGUAGES = TRIP_GENIE_LANGUAGES;
window.TRAVEL_PHRASES = TRAVEL_PHRASES;
window.LanguageManager = LanguageManager;

document.addEventListener('DOMContentLoaded', () => {
  LanguageManager.init();
});
