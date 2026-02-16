import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // Save to localStorage manually (since we don't use language detector)
        localStorage.setItem('language', lng);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded transition-colors ${i18n.language === 'en'
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage('id')}
                className={`px-3 py-1 rounded transition-colors ${i18n.language === 'id'
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                ID
            </button>
        </div>
    );
};

export default LanguageSwitcher;
