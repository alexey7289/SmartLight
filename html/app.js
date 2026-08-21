//app.js

let currentSettings = null;
const settingsPath = './config/settings.json';

let appVersion;
let toggleIsDark;
let fieldDimsX;
let fieldDimsY;
let fieldDimsA;
let fieldDimsB;
let fieldPixelSize;
let logField;
let toggleIsPower;


/**
 * Функция проверки наличия всех необходимых DOM-элементов на странице.
 * 
 * Находит элементы по их ID и сохраняет ссылки в глобальные переменные
 * (fieldDimsX, fieldDimsY, fieldDimsA, fieldDimsB, logField).
 * 
 * @returns {boolean} 
 *   - true:  все элементы найдены, глобальные переменные заполнены, 
 *            приложение может работать дальше.
 *   - false: один или несколько элементов отсутствуют. 
 *            В консоль выведен список недостающих ID.
 *            Точка входа (DOMContentLoaded) должна прервать дальнейшее выполнение.
 */
function validateDOMElements() {
    appVersion = document.getElementById('appVersion');
    toggleIsDark = document.getElementById('toggleIsDark');
    fieldDimsX = document.getElementById('fieldDimsX');
    fieldDimsY = document.getElementById('fieldDimsY');
    fieldDimsA = document.getElementById('fieldDimsA');
    fieldDimsB = document.getElementById('fieldDimsB');
    fieldPixelSize = document.getElementById('fieldPixelSize');
    logField = document.getElementById('logField');
    toggleIsPower = document.getElementById('toggleIsPower');

    const missingElements = [];

    if (!appVersion) missingElements.push('appVersion');
    if (!toggleIsDark) missingElements.push('toggleIsDark');
    if (!fieldDimsX) missingElements.push('fieldDimsX');
    if (!fieldDimsY) missingElements.push('fieldDimsY');
    if (!fieldDimsA) missingElements.push('fieldDimsA');
    if (!fieldDimsB) missingElements.push('fieldDimsB');
    if (!fieldPixelSize) missingElements.push('fieldPixelSize');
    if (!logField) missingElements.push('logField');
    if (!toggleIsPower) missingElements.push('toggleIsPower');

    if (missingElements.length > 0) {
        console.error(`[validateDOMElements] Не найдены элементы: ${missingElements.join(', ')}`);
        return false;
    }

    console.log('[validateDOMElements] Все DOM-элементы найдены');
    return true;
}











/**
 * Функция добавления сообщения в окно логирования приложения.
 * 
 * Форматирует сообщение с временной меткой и префиксом (`[INFO]` или `[ERROR]`),
 * добавляет новую строку к существующему логу в поле `logField`.
 * Если поле лога не найдено (`logField === null`), функция завершается без действий.
 * 
 * @param {string} message - Текст сообщения для вывода в лог.
 * @param {boolean} [isError=false] - Флаг ошибки. Если true, добавляется префикс `[ERROR]`,
 *                                    иначе `[INFO]`.
 * 
 * @sideeffect
 *   - Изменяет значение `logField.value`, добавляя новую строку лога.
 *   - Не возвращает значение (void).
 * 
 * @example
 *   addLog('Настройки загружены');                    // [INFO]
 *   addLog('Файл не найден', true);                   // [ERROR]
 */
function addLog(message, isError = false) {
    if (!logField) return;
    const timestamp = new Date().toLocaleTimeString();
    const prefix = isError ? '[ERROR]' : '[INFO]';
    const currentLog = logField.value || '';
    logField.value = `${currentLog}\n${timestamp} ${prefix} ${message}`.trim();
}













/**
 * Функция проверки кратности размеров в поле ввода "X" к размеру пикселя
 * 
 * @returns {null | boolean} Результат проверки кратности:
 * - `null` — если не находит данные настроек из currentSettings;
 * - `true` — если деление выполняется без остатка;
 * - `false` — если не делится без остатка.
 */
function checkDimsXDivisibility() {
    let pixelCount = currentSettings.dimsX / currentSettings.pixelSize;
    if (!currentSettings) {
        console.error(`[checkDimsXDivisibility] Данные из ${settingsPath} не загрузились.`);
        return;
    }
    if (currentSettings.dimsX % currentSettings.pixelSize === 0){
       console.log (`[checkDimsXDivisibility] fieldDimsX=${currentSettings.dimsX} делится без остатка на pixelSize=${currentSettings.pixelSize}`);
       fieldDimsX.supportingText = `ОК. ${pixelCount} пикселей`;
       return true;
    } else {
        console.error (`[checkDimsXDivisibility] Ошибка деления без остатка fieldDimsX=${currentSettings.dimsX} на pixelSize=${currentSettings.pixelSize}`);
        fieldDimsX.error = true;
        fieldDimsX.errorText = 'Не делится';
        return false;
    }
}


/**
 * Функция проверки кратности размеров в поле ввода "Y" к размеру пикселя
 * 
 * @returns {null | boolean} Результат проверки кратности:
 * - `null` — если не находит данные настроек из currentSettings;
 * - `true` — если деление выполняется без остатка;
 * - `false` — если не делится без остатка.
 */
function checkDimsYDivisibility() {
    let pixelCount = currentSettings.dimsY / currentSettings.pixelSize;
    if (!currentSettings) {
        console.error(`[checkDimsYDivisibility] Данные из ${settingsPath} не загрузились.`);
        return;
    }
    if (currentSettings.dimsY % currentSettings.pixelSize === 0){
       console.log (`[checkDimsYDivisibility] fieldDimsY=${currentSettings.dimsX} делится без остатка на pixelSize=${currentSettings.pixelSize}`);
       fieldDimsY.supportingText = `ОК. ${pixelCount} пикселей`;
       return true;
    } else {
        console.error (`[checkDimsYDivisibility] Ошибка деления без остатка fieldDimsY=${currentSettings.dimsX} на pixelSize=${currentSettings.pixelSize}`);
        fieldDimsY.error = true;
        fieldDimsY.errorText = 'Не делится';
        return false;
    }
}











/**
 * Показывает или скрывает поля DimsA и DimsB в зависимости от patternID.
 * @returns {boolean} `true` если поля показаны, `false` если скрыты
 */
function toggleExtraDims() {
    if (!fieldDimsA || !fieldDimsB) return false;
    
    const isVisible = currentSettings?.patternID > 3;
    const display = isVisible ? '' : 'none';
    
    fieldDimsA.style.display = display;
    fieldDimsB.style.display = display;
    
    return isVisible;
}







/**
 * Функция вывода сообщения Warning в консоль браузера для render-функций
 * @param {*} funcName - имя функции вызвавшей сообщение
 * @param {string} message - текст сообщения
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
    renderFieldDimsA();
    renderFieldDimsB();
    renderFieldPixelSize()
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
            fabButton.setAttribute('variant', 'tertiary');         
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
 * Функция отображения значения размера dimsX из файла настроек
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









/**
 * Функция отображения значения размера dimsY из файла настроек
 */
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









/**
 * Функция отображения значения дополнительного размера dimsA из файла настроек
 */
function renderFieldDimsA() {
    const rfda = document.getElementById('fieldDimsA');
    if (!rfda) {
        console.error('[renderFieldDimsA] Элемент с id="fieldDimsA" не существует');
        return;
    }
    if (currentSettings.dimsA !== undefined) {
        console.log('[renderFieldDimsA] Дополнительный размер "A":', currentSettings.dimsA);
        rfda.value = currentSettings.dimsA;
    } else {
        logWarnRender('renderFieldDimsA', 'Элемент "dimsA" не найден или отсутствует в');
    }
}








/**
 * Функция отображения значения дополнительного размера dimsB из файла настроек
 */
function renderFieldDimsB() {
    const rfdb = document.getElementById('fieldDimsB');
    if (!rfdb) {
        console.error('[renderFieldDimsB] Элемент с id="fieldDimsB" не существует');
        return;
    }
    if (currentSettings.dimsB !== undefined) {
        console.log('[renderFieldDimsB] Дополнительный размер "B":', currentSettings.dimsB);
        rfdb.value = currentSettings.dimsB;
    } else {
        logWarnRender('renderFieldDimsB', 'Элемент "dimsB" не найден или отсутствует в');
    }
}








/**
 * Функция отображения значения дополнительного размера dimsB из файла настроек
 */
function renderFieldPixelSize() {
    const rfps = document.getElementById('fieldPixelSize');
    if (!rfps) {
        console.error('[renderFieldPixelSize] Элемент с id="fieldPixelSize" не существует');
        return;
    }
    if (currentSettings.pixelSize !== undefined) {
        console.log('[renderFieldPixelSize] Размер кластера ленты:', currentSettings.pixelSize);
        rfps.value = currentSettings.pixelSize;
    } else {
        logWarnRender('renderFieldPixelSize', 'Элемент "pixelSize" не найден или отсутствует в');
    }
}


















/**
 * Асинхронная функция инициализации приложения.
 * 
 * Загружает файл настроек settings.json (путь указан в `settingsPath`),
 * парсит его содержимое и сохраняет в глобальную переменную `currentSettings`.
 * 
 * @async
 * @returns {Promise<void>}
 *   - При успехе: `currentSettings` заполнен данными из JSON, интерфейс отрисован.
 *   - При ошибке HTTP: в консоль выводится код ошибки, выполнение прерывается.
 *   - При сетевой ошибке: в консоль выводится сообщение об ошибке, выполнение прерывается.
 * @sideeffect
 *   - Заполняет глобальную переменную `currentSettings`.
 */
async function initApp() {
    console.log('%c[initApp] Инициализация приложения...', 'background: yellow; color: #2196F3; font-weight: bold;');
    console.log('[initApp] Запрос настроек из ./config/settings.json');
    addLog('[initApp] Запрос настроек из ./config/settings.json', false);

    try {
        // Запрашиваем файл настроек
        const response = await fetch (settingsPath);

        // Проверяем, что сервер успешно отдал файл
        if (!response.ok) {
            console.error('[initApp] Ошибка чтения файла ./config/settings.json');
            addLog('[initApp] Ошибка чтения файла ./config/settings.json', true);
            return; // Выходим из фукции если файл не прочитался
        }

        // Разгружаем все содержимое в currentSettings
        currentSettings = await response.json();

        console.log('[initApp] Настройки успешно загружены');
        addLog('[initApp] Настройки успешно загружены', false);
        // Вывод в консоль содержимого файла в виде таблицы
        //console.table(currentSettings);

        // Вызов функции для перерисовки всего интерфейса
        //renderAll();


    } catch (error) {
        console.error('[initApp] Сетевая ошибка');
    }
}













document.addEventListener('DOMContentLoaded', async () => {
    // Сначала проверяем DOM
    if (!validateDOMElements()) {
        console.error('[Root] Критическая ошибка: отсутствуют необходимые DOM элементы. Работа приложения невозможна.');
        return;
    }
    
    // Загружаем настройки
    await initApp();
    
    if (currentSettings) {
        renderAll();
        checkDimsXDivisibility();
        checkDimsYDivisibility();
        toggleExtraDims();
    }
});

