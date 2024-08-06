<header>

<div style="text-align: center">
<h1>Bitcoin blocks tracker</h1>

<p>Расширение для отслеживания блоков Bitcoin и комиссий с помощью Mempool Space</p>

[README in English](./README)

<a rel="noreferrer noopener" target="_blank" href="https://chromewebstore.google.com/detail/bitcoin-blocks-tracker/jhdbfjhembciojemihcimllmbibiakim">
    <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/jhdbfjhembciojemihcimllmbibiakim?color=red&label=%D0%B0%D0%BA%D1%82%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F&logo=google-chrome&logoColor=red&style=for-the-badge">
</a>
<a rel="noreferrer noopener" target="_blank" href="https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases">
    <img alt="Новейший релиз" src="https://img.shields.io/github/v/release/IvanSavoskin/bitcoin-blocks-tracker-extension?label=%D1%81%D0%B2%D0%B5%D0%B6%D0%B8%D0%B9%20%D1%80%D0%B5%D0%BB%D0%B8%D0%B7&logo=github&style=for-the-badge">
</a>
<a href="https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension">
	<img src="https://img.shields.io/github/languages/top/IvanSavoskin/bitcoin-blocks-tracker-extension?style=flat-square&logo=github" alt="GitHub основной язык" />
</a>
<a href="https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/workflows/build/badge.svg">
	<img src="https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/workflows/build/badge.svg" alt="Сборка" />
</a>
</div>

</header>

## Введение

Это расширение создано для того, чтобы легко и удобно отслеживать появление новых блоков в сети Bitcoin.
После того, как новый блок будет смайнен, расширение оповещает пользователя звуковым сигналом.
Расширение также позволяет быстро отслеживать текущие комиссии в сети.

Получение данных о блоках и комиссиях осуществляется с помощью [mempool.space](https://mempool.space/)

## Функции

- Получение звукового уведомления при появлении нового блока в основной или тестовой сети
сети Bitcoin
- Получение звукового уведомления при пересечении комиссией в сети заданного значения
- Получение информации о текущих комиссиях в сети Bitcoin
- Получение информации о времени появления последнего блока

## Установка

**Нажмите [сюда][1], а затем нажмите "Установить" на открывшейся странице**

> * Разработано и протестировано для **Google Chrome**
> * Может быть установлено в любом браузере Chromium - Opera (GX), Vivaldi и т.д.
> * В Microsoft Edge сначала нажмите «Разрешить расширения из других магазинов» (появится запрос)

### Когда версия для Firefox?

На данный момент **версия для Firefox не планируется**.

1. Firefox не поддерживает некоторые важные функции расширения *(PiP API и background service workers)*.
2. Для частичной поддержки потребуется сильно изменить рабочий процесс.
3. Нет спроса на версию для Firefox.

## Локальная установка

### Предустановки
1. Скачай [свежий релиз][2] либо весь репозиторий
2. Установите Node.js (требуемая версия в [package.json](./package.json))
3. Должен быть установлен совместимый `npm`
4. В терминале выполните команду `npm install` из папки проекта

### Линтеры
Для контроля качества кода предусмотрено подключение линтеров.

#### ESLint
Правила для ESLint указаны в файле `/.eslintrc`.

Проверка кода с использованием ESLint запускается командой `npm run eslint`.

#### Stylelint
Правила для Stylelint указаны в файле `/.stylelintrc.json`.

Проверка стилей с помощью Stylelint запускается командой

### Сборка для разработки
Запустите dev сборку с помощью команды `npm run dev`.

После сборки будет создана папка `/dist` со сборкой расширения,
которую можно использовать для добавления в браузер.

Каждое изменение кода автоматически инициирует пересборку расширения.

Во время сборки также добавляется source map, позволяющие использовать Chrome Dev Tools

### Промышленная сборка
Запустите prod сборку с помощью команды `npm run prod`.

Перед сборкой автоматически запускается проверка кода с помощью ESLint и StyleLint.

Собранный проект сохраняется в папке `/dist`.

### Загрузить расширение в Chrome

Загрузить каталог `dist` на странице расширения Chrome ([инструкция](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked))

[1]: https://chromewebstore.google.com/detail/bitcoin-blocks-tracker/jhdbfjhembciojemihcimllmbibiakim
[2]: https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases
