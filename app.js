// Variables globales
let currentValue = '0';
let previousValue = '';
let operator = null;
let waitingForOperand = false;
let isScientific = false;

// Referencias a elementos DOM
let display, operationDisplay, modeToggle, modeIndicator, simpleMode, scientificMode;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
});

function initCalculator() {
    // Obtener referencias a elementos DOM
    display = document.getElementById('display');
    operationDisplay = document.getElementById('operationDisplay');
    modeToggle = document.getElementById('modeToggle');
    modeIndicator = document.getElementById('modeIndicator');
    simpleMode = document.getElementById('simpleMode');
    scientificMode = document.getElementById('scientificMode');
    
    // Configurar eventos
    setupEvents();
    updateDisplay();
}

function setupEvents() {
    // Toggle de modo
    modeToggle.addEventListener('change', function() {
        toggleMode();
    });

    // Event delegation para todos los botones de calculadora
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-calc') || e.target.closest('.btn-calc')) {
            const button = e.target.classList.contains('btn-calc') ? e.target : e.target.closest('.btn-calc');
            e.preventDefault();
            e.stopPropagation();
            handleButtonClick(button);
        }
    });

    // Soporte de teclado
    document.addEventListener('keydown', function(e) {
        handleKeyPress(e);
    });
}

function handleButtonClick(button) {
    const action = button.dataset.action;
    const value = button.dataset.value;
    
    // Animación visual
    animateButton(button);
    
    switch (action) {
        case 'number':
            inputNumber(value);
            break;
        case 'operator':
            inputOperator(value);
            break;
        case 'equals':
            calculate();
            break;
        case 'clear':
            clear();
            break;
        case 'clear-entry':
            clearEntry();
            break;
        case 'backspace':
            backspace();
            break;
        case 'function':
            inputFunction(value);
            break;
        case 'constant':
            inputConstant(value);
            break;
        case 'parenthesis':
            inputParenthesis(value);
            break;
    }
    
    updateDisplay();
}

function handleKeyPress(e) {
    const key = e.key;
    let action = null;
    let value = null;
    
    // Prevenir comportamiento por defecto
    if (/[\d\.\+\-\*\/\=\(\)]/i.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        e.preventDefault();
    }
    
    // Mapear teclas a acciones
    if (/\d/.test(key)) {
        action = 'number';
        value = key;
    } else if (key === '.') {
        action = 'number';
        value = '.';
    } else if (key === '+') {
        action = 'operator';
        value = '+';
    } else if (key === '-') {
        action = 'operator';
        value = '-';
    } else if (key === '*') {
        action = 'operator';
        value = '*';
    } else if (key === '/') {
        action = 'operator';
        value = '/';
    } else if (key === 'Enter' || key === '=') {
        action = 'equals';
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        action = 'clear';
    } else if (key === 'Backspace') {
        action = 'backspace';
    } else if (key === '(') {
        action = 'parenthesis';
        value = '(';
    } else if (key === ')') {
        action = 'parenthesis';
        value = ')';
    }
    
    if (action) {
        // Simular clic de botón
        const mockButton = { dataset: { action: action, value: value } };
        handleButtonAction(mockButton);
    }
}

function handleButtonAction(button) {
    const action = button.dataset.action;
    const value = button.dataset.value;
    
    switch (action) {
        case 'number':
            inputNumber(value);
            break;
        case 'operator':
            inputOperator(value);
            break;
        case 'equals':
            calculate();
            break;
        case 'clear':
            clear();
            break;
        case 'clear-entry':
            clearEntry();
            break;
        case 'backspace':
            backspace();
            break;
        case 'function':
            inputFunction(value);
            break;
        case 'constant':
            inputConstant(value);
            break;
        case 'parenthesis':
            inputParenthesis(value);
            break;
    }
    
    updateDisplay();
}

function animateButton(button) {
    button.classList.add('key-pressed');
    setTimeout(() => {
        button.classList.remove('key-pressed');
    }, 150);
}

function inputNumber(num) {
    if (currentValue === 'Error') {
        clear();
    }
    
    if (waitingForOperand) {
        currentValue = num;
        waitingForOperand = false;
    } else {
        if (num === '.' && currentValue.includes('.')) return;
        currentValue = currentValue === '0' ? num : currentValue + num;
    }
}

function inputOperator(nextOperator) {
    if (currentValue === 'Error') {
        return;
    }
    
    const inputValue = parseFloat(currentValue);
    
    if (previousValue === '') {
        previousValue = inputValue;
    } else if (operator && !waitingForOperand) {
        const result = performCalculation(previousValue, inputValue, operator);
        if (result === null) return;
        
        currentValue = formatResult(result);
        previousValue = result;
    }
    
    waitingForOperand = true;
    operator = nextOperator;
    updateOperationDisplay();
}

function inputFunction(func) {
    if (currentValue === 'Error') {
        clear();
    }
    
    const value = parseFloat(currentValue);
    let result;
    
    try {
        switch (func) {
            case 'sin':
                result = Math.sin(toRadians(value));
                break;
            case 'cos':
                result = Math.cos(toRadians(value));
                break;
            case 'tan':
                result = Math.tan(toRadians(value));
                break;
            case 'sinh':
                result = Math.sinh(value);
                break;
            case 'cosh':
                result = Math.cosh(value);
                break;
            case 'tanh':
                result = Math.tanh(value);
                break;
            case 'log':
                if (value <= 0) throw new Error('Invalid input');
                result = Math.log10(value);
                break;
            case 'ln':
                if (value <= 0) throw new Error('Invalid input');
                result = Math.log(value);
                break;
            case 'x²':
                result = Math.pow(value, 2);
                break;
            case 'x³':
                result = Math.pow(value, 3);
                break;
            case '√':
                if (value < 0) throw new Error('Invalid input');
                result = Math.sqrt(value);
                break;
            case 'x!':
                if (value < 0 || !Number.isInteger(value) || value > 170) throw new Error('Invalid input');
                result = factorial(value);
                break;
            case 'xʸ':
                inputOperator('**');
                return;
        }
        
        currentValue = formatResult(result);
        waitingForOperand = true;
        clearOperationDisplay();
    } catch (error) {
        showError();
    }
}

function inputConstant(constant) {
    if (currentValue === 'Error') {
        clear();
    }
    
    let value;
    switch (constant) {
        case 'π':
            value = Math.PI;
            break;
        case 'e':
            value = Math.E;
            break;
    }
    currentValue = formatResult(value);
    waitingForOperand = true;
}

function inputParenthesis(paren) {
    if (currentValue === 'Error') {
        clear();
    }
    
    if (waitingForOperand) {
        currentValue = paren;
        waitingForOperand = false;
    } else {
        currentValue += paren;
    }
}

function calculate() {
    if (currentValue === 'Error') {
        return;
    }
    
    const inputValue = parseFloat(currentValue);
    
    if (previousValue !== '' && operator) {
        const result = performCalculation(previousValue, inputValue, operator);
        if (result !== null) {
            currentValue = formatResult(result);
            previousValue = '';
            operator = null;
            waitingForOperand = true;
            clearOperationDisplay();
        }
    }
}

function performCalculation(firstValue, secondValue, operator) {
    try {
        let result;
        switch (operator) {
            case '+':
                result = firstValue + secondValue;
                break;
            case '-':
                result = firstValue - secondValue;
                break;
            case '*':
                result = firstValue * secondValue;
                break;
            case '/':
                if (secondValue === 0) throw new Error('Division by zero');
                result = firstValue / secondValue;
                break;
            case '**':
                result = Math.pow(firstValue, secondValue);
                break;
            default:
                result = secondValue;
        }
        return result;
    } catch (error) {
        showError();
        return null;
    }
}

function clear() {
    currentValue = '0';
    previousValue = '';
    operator = null;
    waitingForOperand = false;
    clearOperationDisplay();
}

function clearEntry() {
    currentValue = '0';
    waitingForOperand = false;
}

function backspace() {
    if (currentValue === 'Error') {
        clear();
        return;
    }
    
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
}

function toggleMode() {
    isScientific = modeToggle.checked;
    
    if (isScientific) {
        simpleMode.classList.add('d-none');
        scientificMode.classList.remove('d-none');
        modeIndicator.textContent = 'Modo Científico';
        modeIndicator.classList.remove('bg-primary');
        modeIndicator.classList.add('bg-danger');
    } else {
        scientificMode.classList.add('d-none');
        simpleMode.classList.remove('d-none');
        modeIndicator.textContent = 'Modo Simple';
        modeIndicator.classList.remove('bg-danger');
        modeIndicator.classList.add('bg-primary');
    }
}

function updateDisplay() {
    if (display) {
        display.value = currentValue;
    }
}

function updateOperationDisplay() {
    if (operationDisplay && previousValue !== '' && operator) {
        let operatorSymbol = operator;
        switch (operator) {
            case '*':
                operatorSymbol = '×';
                break;
            case '/':
                operatorSymbol = '÷';
                break;
            case '**':
                operatorSymbol = '^';
                break;
        }
        operationDisplay.textContent = `${previousValue} ${operatorSymbol}`;
    }
}

function clearOperationDisplay() {
    if (operationDisplay) {
        operationDisplay.textContent = '';
    }
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    if (n > 170) throw new Error('Number too large');
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function formatResult(result) {
    if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
    }
    
    // Limitar decimales
    if (result % 1 !== 0) {
        result = parseFloat(result.toFixed(10));
    }
    
    // Notación científica para números muy grandes/pequeños
    if (Math.abs(result) > 1e12 || (Math.abs(result) < 1e-6 && result !== 0)) {
        return result.toExponential(6);
    }
    
    return result.toString();
}

function showError() {
    currentValue = 'Error';
    previousValue = '';
    operator = null;
    waitingForOperand = true;
    clearOperationDisplay();
    
    if (display) {
        display.classList.add('error-animation');
        setTimeout(() => {
            display.classList.remove('error-animation');
        }, 1500);
    }
}

// Prevenir zoom en dispositivos móviles
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);