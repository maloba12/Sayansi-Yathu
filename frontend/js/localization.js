const translations = {
    'en': {
        'welcome': 'Welcome to Sayansi Yathu',
        'start_experiment': 'Start Experiment',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'biology': 'Biology',
        'dashboard': 'Dashboard',
        'profile': 'Profile',
        'settings': 'Settings',
        'logout': 'Logout',
        'score': 'Score',
        'level': 'Level',
        'badges': 'Badges',
        'achievements': 'Achievements',
        'leaderboard': 'Leaderboard',
        'export_data': 'Export Data',
        'language': 'Language',
        'bem': 'Bemba',
        'nya': 'Nyanja',
        'ton': 'Tonga',
        'help': 'Help',
        'contact': 'Contact',
        'about': 'About',
        'privacy': 'Privacy Policy',
        'terms': 'Terms of Service'
    },
    'bem': {
        'welcome': 'Mwaiseni ku Sayansi Yathu',
        'start_experiment': 'Yamba icishinka',
        'physics': 'fizikisi',
        'chemistry': 'kemestri',
        'biology': 'isambililo lyabumi',
        'dashboard': 'Icitabwa',
        'profile': 'Umulopa',
        'settings': 'Ukusunga',
        'logout': 'Kufuma',
        'score': 'Ilinga',
        'level': 'Icisuba',
        'badges': 'Insingo',
        'achievements': 'Amalilwe',
        'leaderboard': 'Umulopa wabene',
        'export_data': 'Pepa amashiwi',
        'language': 'Uulimi',
        'bem': 'Icibemba',
        'nya': 'Icinyanja',
        'ton': 'Icintonga',
        'help': 'Ubufi',
        'contact': 'Kupima',
        'about': 'Pa mulandu',
        'privacy': 'Ukusunga bwino',
        'terms': 'Amaliko'
    },
    'nya': {
        'welcome': 'Takulandirani ku Sayansi Yathu',
        'start_experiment': 'Yambani zojambula',
        'physics': 'Fiziksi',
        'chemistry': 'Kemisitri',
        'biology': 'Bioloji',
        'dashboard': 'Bwandilo',
        'profile': 'Mbiri',
        'settings': 'Zosintha',
        'logout': 'Tuluka',
        'score': 'Zolemba',
        'level': 'Dera',
        'badges': 'Mabaji',
        'achievements': 'Zachitukuko',
        'leaderboard': 'Mbiri ya apadera',
        'export_data': 'Chotsani deta',
        'language': 'Chilankhulo',
        'bem': 'Chibemba',
        'nya': 'Chinyanja',
        'ton': 'Chitonga',
        'help': 'Thandizo',
        'contact': 'Lumikizana',
        'about': 'Zambiri',
        'privacy': 'Zachinsinsi',
        'terms': 'Miyambo'
    },
    'ton': {
        'welcome': 'Twabukela ku Sayansi Yathu',
        'start_experiment': 'Tandi kweza',
        'physics': 'Ifisika',
        'chemistry': 'Chimisi',
        'biology': 'Byabumi',
        'dashboard': 'Cikulu',
        'profile': 'Mbeba',
        'settings': 'Zwinzwi',
        'logout': 'Kuya',
        'score': 'Zolemba',
        'level': 'Zuba',
        'badges': 'Mabaji',
        'achievements': 'Zwinzwi',
        'leaderboard': 'Mbeba ya apadera',
        'export_data': 'Tola deta',
        'language': 'Lulimi',
        'bem': 'Chibemba',
        'nya': 'Chinyanja',
        'ton': 'Chitonga',
        'help': 'Kambwe',
        'contact': 'Kubingana',
        'about': 'Zwinzwi',
        'privacy': 'Zwinzwi',
        'terms': 'Miyambo'
    }
};

class Localization {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.updateUI();
        this.createLanguageSelector();
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateUI();
        
        // Update language selector
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    translate(key) {
        return translations[this.currentLanguage][key] || 
               translations['en'][key] || key;
    }

    updateUI() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (element.tagName === 'INPUT' && element.type !== 'button') {
                element.placeholder = this.translate(key);
            } else {
                element.textContent = this.translate(key);
            }
        });
    }

    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <button class="language-btn ${this.currentLanguage === 'en' ? 'active' : ''}" 
                    data-lang="en">English</button>
            <button class="language-btn ${this.currentLanguage === 'bem' ? 'active' : ''}" 
                    data-lang="bem">Bemba</button>
            <button class="language-btn ${this.currentLanguage === 'nya' ? 'active' : ''}" 
                    data-lang="nya">Nyanja</button>
            <button class="language-btn ${this.currentLanguage === 'ton' ? 'active' : ''}" 
                    data-lang="ton">Tonga</button>
        `;
        
        selector.addEventListener('click', (e) => {
            if (e.target.classList.contains('language-btn')) {
                this.setLanguage(e.target.dataset.lang);
            }
        });
        
        document.body.appendChild(selector);
    }
}

// Initialize localization
window.localization = new Localization();