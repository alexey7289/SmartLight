//app.js
let currentSettings = null;
const settingsPath = './config/settings.json'










/**
 * Отправка логов в окно логирования
 */
function addLog(message, isError = false) {
    const logField = document.getElementById('logField');
    if (!logField) return;
    const timestamp = new Date().toLocaleTimeString();
    const prefix = isError ? '[ERROR]' : '[INFO]';
    // Добавляем новую строку к существующему логу
    const currentLog = logField.value || '';
    logField.value = `${currentLog}\n${timestamp} ${prefix} ${message}`.trim();
}













/**
 * Функция проверки кратности размеров в полях ввода к размеру кластера
 */
function checkDimensionsDivisibility() {
    let pixelCount = currentSettings.dimsX / currentSettings.pixelSize;
    if (!currentSettings) {
        console.error(`[checkDimensionsDivisibility] Данные из ${settingsPath} не загрузились.`);
        return;
    }
    // --->   Поле fieldDimsX   <---
    if (currentSettings.dimsX % currentSettings.pixelSize === 0){
       console.log (`[checkDimensionsDivisibility] fieldDimsX=${currentSettings.dimsX} делится без остатка на pixelSize=${currentSettings.pixelSize}`);
       fieldDimsX.supportingText = `ОК. ${pixelCount} пикселей`;
       addLog('Делится без остатка');
       return true;
    } else {
        console.error (`[checkDimensionsDivisibility] Ошибка деления без остатка fieldDimsX=${currentSettings.dimsX} на pixelSize=${currentSettings.pixelSize}`);
        fieldDimsX.error = true;
        fieldDimsX.errorText = 'Не делится';
        return false;
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
 * Функция импорта данных из файла который описан в переменной settingsPath
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
        //renderAll();

        // Проверяем, есть ли настройка isDark и выводим ее значение
        //if (currentSettings.isDark !== undefined) {
        //    console.log('[app-v2.js] Значение настройки isDark:', currentSettings.isDark);
        //} else {
        //    console.warn('[app-v2.js] Настройка isDark не найдена');
        //}


    } catch (error) {
        console.error('[initApp] Сетевая ошибка');
    }
}













document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
    
    if (currentSettings) {
        renderAll();                        // 1. Отрисовать все поля
        checkDimensionsDivisibility();      // 2. Проверить и показать ошибки
    }
});

