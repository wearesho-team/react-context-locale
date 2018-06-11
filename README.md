[![codecov](https://codecov.io/gh/wearesho-team/react-context-locale/branch/master/graph/badge.svg)](https://codecov.io/gh/wearesho-team/react-context-locale)
[![Build Status](https://travis-ci.org/wearesho-team/react-context-locale.svg?branch=master)](https://travis-ci.org/wearesho-team/react-context-locale)

# React context locale

Tool for localize application.

```tsx
<span>{t("errors", "Wrong phone format")}</span>
```

## Usage

##### LocaleProvider

You must provide locale setting and controls with `LocaleProvider`.

```tsx
<LocaleProvider 
    translations={Translations}
    defaultLocale="ru"
    baseLocale="ru"
    onMissingTranslation={({currentLocale, category, value}) => `Missing translation ${currentLocale}:${category}:${value}`}
>
    // ...
</LocaleProvider>
```

where
 - `defaultLocale` - locale, that will be used on did mount
 - `baseLocale` - locale, that used as key for translation
 - `translations` - object, that contains translations
 - `throwError` - will throw error, if translation key does not found in storage. Optional. If not passed, string with error description will be returned.

Translations object example:

```json
{
    "gb": {
        "mainPage": {
            "Тестовый перевод": "Übersetzung testen"
        }
    },
    "en": {
        "mainPage": {
            "Тестовый перевод": "Test translation"
        }
    }
}
```
*Note: In this example available locales is `gb`, `en` and base locale `ru`.*

##### Translator

To translate string you must wrap it to the `Translator` component:

```tsx
<span>
    <Translator category="mainPage">
        Тестовый перевод
    </Translator>
</span>
```

where
- `category` - sub-object that contains translation strings

Or you can also use `t` function as HOC:

```tsx
<span>
    {t("mainPage", "Тестовый перевод")}
</span>
```

##### LanguageSwitcher

For controlling switching locale, use `SingleLanguageSwitcher` or `MultipleLanguageSwitcher` component.

`SingleLanguageSwitcher` will render single button, that will change locale in the same sequence, than locales declared in transaltions object:

```tsx
<SingleLanguageSwitcher localeLabels={{ru: "RUS", en: "ENG", gb: "GER"}} {...HTMLButtonProps}/>
```

where
 - `localeLabels` - label, that will be displayed in button, according to current locale. Optional. If not passed, original locale name will be displayed

`MultipleLanguageSwitcher` will render count of buttons according to available locales length:

```tsx
<SingleLanguageSwitcher localeLabels={{ru: "RUS", en: "ENG", gb: "GER"}} activeClassName="is-active" {...HTMLButtonProps} />
```

where
 - `activeClassName` -  class name that will be appending to button with according active locale. Optional. Default - `active`

##### OnLocale

If you need to display some markup only for specified locale, use `OnLocale` component:

```tsx
<OnLocale locale="en">
    <span>You see this, because you selected `en` locale</span>
<OnLocale>
```

where
- `locale` - locale on which showing markup
