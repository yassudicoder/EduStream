# 🌍 Multilingual Support Guide

EduStream now supports **16 international languages** allowing users from around the world to connect and learn together!

## 📚 Supported Languages

| Flag | Language | Native Name | Code |
|------|----------|------------|------|
| 🇬🇧 | English | English | `en` |
| 🇪🇸 | Spanish | Español | `es` |
| 🇫🇷 | French | Français | `fr` |
| 🇩🇪 | German | Deutsch | `de` |
| 🇮🇹 | Italian | Italiano | `it` |
| 🇵🇹 | Portuguese | Português | `pt` |
| 🇷🇺 | Russian | Русский | `ru` |
| 🇯🇵 | Japanese | 日本語 | `ja` |
| 🇨🇳 | Chinese | 中文 | `zh` |
| 🇰🇷 | Korean | 한국어 | `ko` |
| 🇳🇱 | Dutch | Nederlands | `nl` |
| 🇵🇱 | Polish | Polski | `pl` |
| 🇹🇷 | Turkish | Türkçe | `tr` |
| 🇸🇦 | Arabic | العربية | `ar` |
| 🇹🇭 | Thai | ไทย | `th` |
| 🇻🇳 | Vietnamese | Tiếng Việt | `vi` |

## 🎯 How to Use

### For End Users
1. Click the **⚙️ Settings** icon in the top-right corner of the navbar
2. Find the **Language** button showing the current language
3. Click to open the language selector dropdown
4. Select your preferred language from the 16 available options
5. The entire interface will update instantly with your language selection

### For Developers

#### Using Translations in Components

**Using the hook:**
```tsx
"use client";
import { useLanguage } from "@/lib/useLanguage";

export function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t("nav.home")}</h1>
      <p>Current language: {language}</p>
    </div>
  );
}
```

#### Adding New Translation Keys

1. Open `app/lib/languages.ts`
2. Add your key to the `TRANSLATIONS` object:

```typescript
export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    "common.loading": "Loading...",
    "my.new.key": "English text here",
  },
  es: {
    "common.loading": "Cargando...",
    "my.new.key": "Texto en español aquí",
  },
  // ... add to all 16 languages
};
```

3. Use in your component:
```tsx
const { t } = useLanguage();
<span>{t("my.new.key")}</span>
```

## 🏗️ Architecture

### Files Created

1. **`app/lib/languages.ts`**
   - Defines language codes and info
   - Contains all 16 language translations
   - Provides the `t()` translation function

2. **`app/lib/useLanguage.tsx`**
   - React Context for language state
   - `LanguageProvider` component
   - `useLanguage()` hook for components

3. **Updated `app/layout.tsx`**
   - Wraps app with `LanguageProvider`
   - Settings panel includes language selector
   - Navigation labels use translations

### Translation Structure

Each language has keys organized by domain:
- `nav.*` - Navigation labels
- `settings.*` - Settings panel labels
- `common.*` - Common words/phrases

## 💾 Persistence

Language preference is automatically saved to localStorage:
- Key: `edu-language`
- Updates on every language change
- Persists across browser sessions

## 🌐 RTL Support

Arabic language includes right-to-left (RTL) support:
- Automatically sets `dir="rtl"` on HTML element
- CSS can use `[dir="rtl"]` selectors for RTL styling

## 📝 Current Translations

All 16 languages include translations for:
- Navigation menu items (Home, Leaderboard, Arena, etc.)
- Settings panel controls
- Common UI elements (Loading, Error, Success, etc.)

## 🚀 Future Enhancements

Ideas for expanding multilingual support:
1. Add more languages (German variants, Portuguese-BR vs PT-PT, etc.)
2. Implement date/time localization
3. Add language-specific number formatting
4. Create translation management dashboard
5. Add community translation contributions
6. Implement automatic language detection (geolocation)

## 🐛 Testing

To test a specific language:
1. Open browser DevTools
2. Go to Settings panel
3. Select any language
4. Verify the interface updates
5. Check localStorage shows `edu-language: [code]`
6. Refresh the page - language persists

## ⚙️ Adding More Translations

When adding new UI elements:
1. Add the key to the English translations first
2. Translate to all 15 other languages
3. Add to the `TRANSLATIONS` object in `languages.ts`
4. Use `t("key")` in your component

Example of translation workflow:
```
Feature: "New Achievement Badge"
English: "You achieved: {name}"
Spanish: "Lograste: {name}"
French: "Vous avez obtenu: {name}"
... (14 more languages)
```

---

**Enjoy building a truly global platform! 🌍✨**
