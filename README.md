[![codecov](https://codecov.io/gh/wearesho-team/react-context-locale/branch/master/graph/badge.svg)](https://codecov.io/gh/wearesho-team/react-context-locale)
[![Build Status](https://travis-ci.org/wearesho-team/react-context-locale.svg?branch=master)](https://travis-ci.org/wearesho-team/react-context-locale)

# React context locale

Tool for localize application.

```tsx
<span>{t("Wrong phone format", "errors")}</span>
```

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-context-locale

## Usage

#### LocaleProvider

You must provide locale setting and controls with `LocaleProvider`:

```tsx
<LocaleProvider
    onSameTranslation={({currentLocale, category, value}) => `Translated string is same as key ${currentLocale}:${category}:${value}`}
    onMissingTranslation={({currentLocale, category, value}) => `Missing translation ${currentLocale}:${category}:${value}`}
    onLocaleChanged={(currentLocale) => console.log(`Locale changed to ${currentLocale}`)}
    availableLocales={["ru", "en", "gb"]}
    commonTranslations={Translations}
    storage={new Storage()}
    defaultLocale="en"
    baseLocale="ru"
>
    // ...
</LocaleProvider>
```

where
 - `availableLocales` - list of available locales.
 - `baseLocale` - locale, that used as key for translation.
 - `commonTranslations` - object, that contains common translations.
 - `onLocaleChanged` - will called, when locale was changed. Optional.
 - `onSameTranslation` - will called, when translated string is same as key. Optional.
 - `defaultLocale` - locale, that will be used on did mount. Optional. Default is same as `baseLocale`.
 - `storage` - object, that implements translations storage. Optional. If not passed, will be created automatically.
 - `onMissingTranslation` - will called, when translation key does not found in storage. Optional. If not passed, string with error description will be returned.

*Note: Pass `storage` prop, only if you need to access it from outside, in other cases it does not needed*

Translations object example:

```json
{
    "gb": {
        "errors": {
            "Неверный формат": "Falsches Format"
        }
    },
    "en": {
        "errors": {
            "Неверный формат": "Wrong format"
        }
    }
}
```
*Note: In this example `ru` locale is used as base locale, so it not needed for translation.*

*Note: Categories name are not translatable*

#### RegisterCategory 

To register new translation, use `RegisterCategory` component:

```tsx
<RegisterCategory categoryName="testCategory" translations={{en: "Тест": "Test"}}>
    // ...
</RegisterCategory>
```

In storage it will be:

```json
{
    "en": {
        "testCategory": {
            "Тест": "Test"
        }
    }
}
```

where
- `categoryName` - new category name
- `translations` - object, that contains new category translations

*Note: Categories must be unique. If it doesn't, last registered category will be used and other will be deleted*

#### Translator

To translate string you must wrap it into the `Translator` component:

```tsx
<RegisterCategory categoryName="testCategory" translations={Translations}>
    <span>
        <Translator category="mainPage" render={(translated: string) => <span data-name={translated}/>}>
            Тестовый перевод
        </Translator>
    </span>
</RegisterCategory>
```

where
- `category` - category name. Optional. In this case default are `testCategory`
- `render` - function, that return executing result to `Translator` render method. Optional. If not passed, string will be returned

Or you can also use `t` function:

```tsx
<span>{t("Тестовый перевод", "mainPage")}</span>
```
*Note: `t` function just return `Translator` component*

#### LanguageSwitcher

For controlling switching locale, use `SingleLanguageSwitcher` or `MultipleLanguageSwitcher` component.

`SingleLanguageSwitcher` will render single button, that will change locale in the same sequence, than locales declared in `availableLocales`:

```tsx
<SingleLanguageSwitcher 
    render={(label: string, locale: string) => <span data-locale={locale}>{label}</span>}
    localeLabels={{ru: "RUS", en: "ENG", gb: "GER"}} 
    {...HTMLButtonProps}
/>
```

where
 - `localeLabels` - label, that will be displayed in button, according to current locale. Optional. If not passed, original locale name will be displayed
 - `render` - function, that return executing result to `SingleLanguageSwitcher` render method. Optional. If not passed, string will be returned

`MultipleLanguageSwitcher` will render count of buttons according to available locales length:

```tsx
<MultipleLanguageSwitcher 
    render={(label: string, locale: string) => <span data-locale={locale}>{label}</span>}
    localeLabels={{ru: "RUS", en: "ENG", gb: "GER"}} 
    activeClassName="is-active" 
    {...HTMLButtonProps} 
/>
```

where
 - `activeClassName` -  class name that will be appending to button with according active locale. Optional. Default - `active`

#### OnLocale

If you need to display some markup only for specified locale, use `OnLocale` component:

```tsx
<OnLocale locale="en">
    <span>You see this, because you selected `en` locale</span>
<OnLocale>
```

where
- `locale` - locale on which showing markup

#### EventInterceptor

Use `EventInterceptor` component, when you need to catch events:

```tsx
<EventInterceptor event="change" onEvent={(params: { newLocale: string; oldLocale: string }) => console.log(params))}>
    // ...
</EventInterceptor>
<EventInterceptor event="register" onEvent={(categoryName: string) => console.log(categoryName))}>
    // ...
</EventInterceptor>
```

where
- `event` - event type.
- `onEvent` - will called, when event triggered.

available events:
- `change` - event, that triggers when locale was changed.
- `register` - event, that triggers when new category was registered.

#### Plural

It is only necessary to indicate the forms of the declined word in different situations:

```tsx
<span>
    <Translator category="mainPage" params={{n: 10}}>
        There _PLR(n! 0:are no cats, 1:is one cat, other:are # cats)!
    </Translator>
</span>
```

or

```tsx
<span>
    {t("There _PLR(n! 0:are no cats, 1:is one cat, other:are # cats)!", "mainPage", {n: 10})}
</span>
```

where
- `params` - contains string arguments
- `_PLR(*argument*! ...rules)` - plural string

Will render:

```tsx
<span>There are 10 cats!</span>
```

Available rules:

| Rule  | Meaning                                         |
|-------|-------------------------------------------------|
| 0     | means zero                                      |
| 1     | corresponds to exactly 1                        |
| one   | 21, 31, 41 and so on                            |
| few   | from 2 to 4, from 22 to 24 and so on            |
| many  | 0, from 5 to 20, from 25 to 30 and so on        |
| other | for all other numbers                           |
| #     | is replaced by the value of the argument        |

Substring replacement:

```tsx
<span>
    <Translator params={{where: "There", who: "are no cats"}}>
        [where] [who]
    </Translator>
</span>
```

Will render:

```tsx
<span>
    There are no cats
</span>
```

#### Context API

`LocaleProvider` component provide [next context](https://github.com/wearesho-team/react-context-locale/blob/master/src/LocaleProvider/LocaleProviderContext.ts).
You can consume it for creating your own componetns.

where
- `registerCategory` - method for registering a new category.
- `translate` - method for translating string. Return translated string.
- `setLocale` - method for setting new current locale.
- `availableLocales` - array, that contains available locales.
- `currentLocale` - string, that matches to current locale.
- `baseLocale` - string, that matches to base locale.
- `addEventListener` - method for adding locale event listeners.
- `removeEventListener` - method for removing locale event listeners.

#### Helpers

##### StorageTranslator

If you need translate string outside layout (for example in bootstrap file) or if you need raw string instead of `Translator` component, use `StorageTranslator` helper:

```tsx
// pass base locale by second argument
const t = StorageTranslator(storage, "ru");

<meta content={t("Current year: [year]", "Meta", { year: (new Date()).getFullYear() })}/>
```

You can initialize storage object by yourself, but highly recommended use instantiated object:

```tsx
const controlledStorage = new Storage({
    initialLocale: "ru",
    initialRecords: {   
        "en": {
            "errors": {
                "Неверный формат": "Wrong format"
            }
        }
    }
});
// ...
<LocaleProvider storage={controlledStorage} {...LocaleProviderProps}>
    // ...
</LocaleProvider>
// ...
const t = StorageTranslator(controlledStorage, "ru");
```

where
- `initialLocale` is the same as `defaultLocale` prop for `LocaleProvider`.
- `initialRecords` is the same as `commonTranslations` prop for `LocaleProvider`.

So if you pass initial params to `Storage`, you dont need to pass according props to `LocaleProvider`.

##### LangLink

You can also use [react-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom) to navigate on app with locale prefix in url:

```tsx
<BrowserRouter>
    <LangLink to="/index" {...NavLinkProps}>Home</LangLink>
</BrowserRouter>
```

*Note: This component use [react-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom) context*

where
- `NavLinkProps` - props of [NavLink](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/NavLink.md) component

Will render if current locale is same as base locale:

```tsx
<a href="/index">Home</a>
```

Will render if current locale is `ua`:

```tsx
<a href="/ua/index">Home</a>
```

##### UrlChanger

If you need to change url with changing locale, use `UrlChanger` component:

```tsx
<BrowserRouter>
    <UrlChanger>
        <SingleLanguageSwitcher localeLabels={{ru: "RUS", en: "ENG", gb: "GER"}} {...HTMLButtonProps}/>
    </UrlChanger>
</BrowserRouter>
```

*Note: This component use [react-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom) context*

##### LanguageSwitcherLink

If you need to change locale with link instead button, use `LanguageSwitcherLink` component:

```tsx
<BrowserRouter>
    <LanguageSwitcherLink language="ua">UA</LanguageSwitcherLink>
    <LanguageSwitcherLink language="ru">RU</LanguageSwitcherLink>
</BrowserRouter>
```

*Note: This component use [react-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom) context*

Will render (if current path `/index`, `baseLocale` is `ru`):

```tsx
<a href="/ua/index">UA</a>
<a href="/index">RU</a>
```
