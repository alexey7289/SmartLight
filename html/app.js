//app.js

let currentSettings = null;
const settingsPath = './config/settings.json';



/**
 * Функция проверки наличия всех необходимых DOM-элементов на странице.
 * Находит элементы по их ID и сохраняет ссылки в глобальные переменные.
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
    btnSaveDims = document.getElementById('btnSaveDims');
    selectPatternId = document.getElementById('selectPatternId');

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
    if (!btnSaveDims) missingElements.push('btnSaveDims');
    if (!selectPatternId) missingElements.push('selectPatternId');

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
 * Если поле логирования не найдено (`logField === null`), функция завершается без действий.
 * 
 * @param {string} message - Текст сообщения для вывода в лог.
 * @param {boolean} [isError=false] - Флаг ошибки. Если true, добавляется префикс `[ERROR]`,
 *                                    иначе `[INFO]`.
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
 * Проверяет кратность данных в поле `dimsX` к `pixelSize`
 * @returns {boolean} `true` - если делится без остатка
 */
function isDimsXValid() {
    if (!currentSettings) {
        console.error(`[isDimsXValid] Данные из ${settingsPath} не загрузились.`);
        return false;
    }
    return currentSettings.dimsX % currentSettings.pixelSize === 0;
}




/**
 * Отрисовывает статус поля ввода размера `dimsX` в зависимости от переданного флага.
 */
function uiStateDimsX(isValid) {
    if (!fieldDimsX) return;
    const pixelCount = currentSettings.dimsX / currentSettings.pixelSize;
    if (isValid) {
        fieldDimsX.supportingText = `OK. ${pixelCount} пикселей`;
        fieldDimsX.error = false;
    } else {
        fieldDimsX.error = true;
        fieldDimsX.errorText = 'Не делится';
    }
}




function checkDimsX() {
    const isValid = isDimsXValid();
    uiStateDimsX(isValid);
    return isValid;
}

















function uiStateSaveButton(isX) {
    if (btnSaveDims) {
        btnSaveDims.disabled = !isX;
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
    renderFieldPixelSize();
    renderSelectPatternId();
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
        console.log('[renderVersion] Элемент "version" не найден или отсутствует в', settingsPath);
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
        console.log('[renderIsPower] Элемент "isPower" не найден или отсутствует в', settingsPath);
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
        console.log('[renderIsDark] Элемент "isDark" не найден или отсутствует в', settingsPath);
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
        console.log('[renderFieldDimsX] Элемент "dimsX" не найден или отсутствует в', settingsPath);
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
        console.log('[renderFieldDimsY] Элемент "dimsY" не найден или отсутствует в', settingsPath);
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
        console.log('[renderFieldDimsA] Элемент "dimsA" не найден или отсутствует в', settingsPath);
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
        console.log('[renderFieldDimsB] Элемент "dimsB" не найден или отсутствует в', settingsPath);
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
        console.log('[renderFieldPixelSize] Элемент "pixelSize" не найден или отсутствует в', settingsPath);
    }
}

/**
 * Функция отображения поля выбора `patternId`
 */
function renderSelectPatternId() {
    const rspi = document.getElementById('selectPatternId');
    if (!rspi) {
        console.error('[renderSelectPatternId] Элемент с id="selectPatternId" не существует');
        return;
    }
    if (currentSettings.patternID !== undefined) {
        console.log('[renderSelectPatternId] ID рисунка:', currentSettings.patternID);
        const patternMap = {
            1: 'яблоко',
            2: 'груша',
            3: 'лимон',
            4: 'апельсин'
        };
        const targetValue = patternMap[currentSettings.patternID];
        rspi.value = targetValue;
    } else {
        console.log('[renderSelectPatternId] Элемент "patternID" не найден или отсутствует в', settingsPath);
    }
}




async function sendSettingsToController() {
    try {
        console.log('[sendSettingsToController] Отправка настроек на контроллер...');

        const response = await fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentSettings) 
        });
        if (!response.ok) {
            console.error('[sendSettingsToController] Ошибка HTTP:', response.status);
            addLog(`Ошибка отправки: HTTP ${response.status}`, true);
            return false;
        }
        console.log('[sendSettingsToController] Успешно отправлено на контроллер')
        addLog('Настройки отправлены на контроллер', false);
        return true;
    } catch (error) {
        console.error('[sendSettingsToController] Сетевая ошибка:', error);
        addLog('Ошибка связи с ESP32', true);
        return false;

    }
}




function setupListeners() {
    dimsXListener();
    patternIdListener();
}


function dimsXListener() {
    if (!fieldDimsX) return;
    fieldDimsX.addEventListener('blur', (e) => {
        currentSettings.dimsX = parseInt(e.target.value);
        syncUI();
        sendSettingsToController();
    });
}


function patternIdListener() {
    if (!selectPatternId) return;
    selectPatternId.addEventListener('change', (e) => {
        currentSettings.patternID = parseInt(e.target.value);
        console.log('Выбран pattern', currentSettings.patternID);
        syncUI();
        sendSettingsToController();
    });
}









function syncUI() {
    const isX = checkDimsX();
    //const isY = checkDimsY();
    //const isExtra = currentSettings.patternID > 3;
    
    //toggleExtraDims(isExtra);
    
    //const isA = isExtra ? checkDimsA() : true;
    //const isB = isExtra ? checkDimsB() : true;
    
    //uiStateSaveButton(isX && isY && isA && isB);
    uiStateSaveButton(isX);
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
    if (!currentSettings) {
        console.error('[Root] Настройки не загружены. Работа невозможна.');
        return;
    }
    
    if (currentSettings) {
        renderAll();
        syncUI();
        dimsXListener();
        setupListeners();
    }

    
});



