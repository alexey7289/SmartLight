//app.js
let currentSettings = {}

const settingsPath = './config/settings.json'

/**
 * Функция импорта данных из файла который описан в settingsPath
 * 
 */
async function initApp() {
    console.log('%c[initApp] Инициализация приложения...', 'background: yellow; color: #2196F3; font-weight: bold;');
    console.log('[initApp] Запрос настроек из ./config/settings.json')

    try {
        // Запрашиваем файл настроек
        const response = await fetch (settingsPath);
        // Проверяем, что сервер успешно отдал файл
        if (!response.ok) {
            console.error('[initApp] Ошибка чтения файла ./config/settings.json');
            return; // Выходим из фукции если файл не прочитался
        }

        // Разгружаем все содержимое в currentSettings
        currentSettings = await response.json();

        console.log('[initApp] Настройки успешно загружены')
        // Вывод в консоль содержимого файла в виде таблицы
        //console.table(currentSettings);

        // Вызов функции для перерисовки всего интерфейса
        renderAll();

        // Проверяем, есть ли настройка isDark и выводим ее значение
        //if (currentSettings.isDark !== undefined) {
        //    console.log('[app-v2.js] Значение настройки isDark:', currentSettings.isDark);
        //} else {
        //    console.warn('[app-v2.js] Настройка isDark не найдена');
        //}


    } catch (error) {
        console.error('[initApp] Сетевая ошибка]');
    }
}








/**
 * Функция вывода сообщения Warning в консоль браузера для render-функций
 * @param {*} funcName - имя функции вызвавшей сообщение
 * @param {*} message - текст сообщения
 */
function logWarnRender(funcname, message) {
    console.warn(`[${funcname}] ${message}`, settingsPath);
}








/**
 * Общая функция отрисовки UI. Запускает все функции отрисовки при загрузке веб-сервера.
 */
function renderAll() {
    renderVersion();
    renderIsPower();
    renderIsDark();
    renderFieldDimsX();
    renderFieldDimsY();
}











/**
 * Функция подстановки версии веб-сервера в логотип.
 */
function renderVersion() {    
    const rv = document.getElementById('appVersion');
    if (!rv) {
        console.error('[renderVersion] Элемент с id="appVersion" не существует');
        return;
    }
    if (currentSettings.version !== undefined) {
        console.log('[renderVersion] Версия веб-сервера:', currentSettings.version);
        rv.textContent = `v${currentSettings.version}`;       
    } else {
        logWarnRender('renderVersion', 'Элемент "version" не найден или отсутствует в');
    }
}










/**
 * Функция отображения <md-fab> ВКЛ/ВЫКЛ питания ленты через FAB
 */
function renderIsPower() {
    const fabButton = document.getElementById('toggleIsPower');
    if (!fabButton) {
        console.error('[renderIsPower] Элемент с id="toggleIsPower" не существует');
        return;
    }
    const iconElement = fabButton.querySelector('md-icon') || document.getElementById('toggleIsPower');
    if (currentSettings.isPower !== undefined) {
        console.log('[renderIsPower] Питание ленты:', currentSettings.isPower);
        if (currentSettings.isPower) {
            fabButton.setAttribute('variant', 'primary');
            if (iconElement) iconElement.textContent = 'lightbulb';
        } else {
            fabButton.setAttribute('variant', 'secondary');         
            if (iconElement) iconElement.textContent = 'light_off';
        }
    } else {
        logWarnRender('renderIsPower', 'Элемент "isPower" не найден или отсутствует в');
    }
}










/**
 * Функция отображения <md-switch> темной/светлой версии веб-сервера
 */
function renderIsDark() {
    const rid = document.getElementById('toggleIsDark');
    if (!rid) {
        console.error('[renderIsDark] Элемент с id="toggleIsDark" не существует');
        return;
    }
    if (currentSettings.isDark !== undefined) {
        console.log('[renderIsDark] Темная версия сайта:', currentSettings.isDark)     
        rid.selected = currentSettings.isDark;
    } else {
        logWarnRender('renderIsDark', 'Элемент "isDark" не найден или отсутствует в');
    }
}











/**
 * Функция отображения значения dimsX из файла настроек
 */
function renderFieldDimsX() {
    const rfdx = document.getElementById('fieldDimsX');
    if (!rfdx) {
        console.error('[renderFieldDimsX] Элемент с id="fieldDimsX" не существует');
        return;
    }
    if (currentSettings.dimsX !== undefined) {
        console.log('[renderFieldDimsX] Размер "X":', currentSettings.dimsX);
        rfdx.value = currentSettings.dimsX;
    } else {
        logWarnRender('renderFieldDimsX', 'Элемент "dimsX" не найден или отсутствует в');
    }
}










function renderFieldDimsY() {
    const rfdy = document.getElementById('fieldDimsY');
    if (!rfdy) {
        console.error('[renderFieldDimsY] Элемент с id="fieldDimsY" не существует');
        return;
    }
    if (currentSettings.dimsY !== undefined) {
        console.log('[renderFieldDimsY] Размер "Y":', currentSettings.dimsY);
        rfdy.value = currentSettings.dimsY;
    } else {
        logWarnRender('renderFieldDimsY', 'Элемент "dimsY" не найден или отсутствует в');
    }

}


// Запускаем функцию, когда HTML полностью загрузился
document.addEventListener('DOMContentLoaded', initApp);