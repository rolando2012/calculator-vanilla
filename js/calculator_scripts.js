document.addEventListener('DOMContentLoaded',load_history);

let screen = document.getElementById('screen');
let result_screen = document.getElementById('result');
let btns = document.querySelectorAll('.calculator_btn-num');
let btn_clean = document.getElementById('clean');

for(let btn of btns){
    btn.addEventListener('click',show);
}

window.addEventListener('keydown',show_Keyboard);
btn_clean.addEventListener('click', clean_history);

function show(e){
    e.target.blur();

    let value = e.target.textContent;
    let current_text = screen.textContent;

    switch(value){
        case 'DEL':
            screen.textContent = current_text.slice(0, -1);
            result_screen.textContent = '0';
            break;

        case 'AC':
            screen.textContent = '';
            result_screen.textContent = '0';
            break;

        case '=':
            execute_calculation();
            break;

        case '÷':
            if(current_text.length < 40){
                result_screen.textContent = '0';
                screen.textContent += '/';
            }
            break;

        default:
            if(current_text.length < 40){
                result_screen.textContent = '0';
                screen.textContent += value;
            }
    }
}

function show_Keyboard(e){
    let current_text = screen.textContent;

    switch(e.key){
        case 'Backspace':
            screen.textContent = current_text.slice(0, -1);
            result_screen.textContent = '0';
            break;

        case 'Enter':
        case '=':
            execute_calculation();
            break;

        case '*':
            if(current_text.length < 40){
                result_screen.textContent = '0';
                screen.textContent += '×';
            }
            break;

        default:
            if(current_text.length < 40 &&
                /^[0-9+\-/.()]$/.test(e.key)){
                result_screen.textContent = '0';
                screen.textContent += e.key;
            }
    }
}

function execute_calculation(){
    let current_text = screen.textContent;

    if(current_text==='') return;

    let clear_formula = current_text.replace(/×/g,'*');

    const invalidPattern = /[+\/*]{2,}/;

    if (invalidPattern.test(clear_formula)) {
        result_screen.textContent = 'Syntax Error';
        return;
    }

    try{
        let result = eval(clear_formula);
        if (!isFinite(result)){
            result_screen.textContent = 'Math Error';
        }else{
            let result_str = String(result);
            if(result_str.length > 20){
                result_str = result.toExponential(8);
            }
            result_screen.textContent = result_str;
            show_history(current_text, result_str);
        }
    }catch(error){
        result_screen.textContent = 'Syntax Error';
        console.error(error);
    }
}

function show_history(operations, result){
    let item = document.createElement('li');
    let operation_spacing = operations.replace(/([+\-/×÷])/g, ' $1 ');
    let text = document.createTextNode(operation_spacing + ' = ' + result);
    item.appendChild(text);
    document.getElementById('history').appendChild(item);
    save_history(operation_spacing + ' = ' + result);
    let history_List = document.getElementById('history');
    history_List.scrollTop = history_List.scrollHeight;
}

function save_history(text){
    let saved_operations;
    let history = localStorage.getItem('operaciones');
    if(history !== null){ 
        saved_operations = JSON.parse(history);
    }else{
        saved_operations = new Array();
    }
    saved_operations.push(text);
    localStorage.setItem('operaciones',JSON.stringify(saved_operations));
}

function load_history(){
    let history = localStorage.getItem('operaciones');
    if(history !== null){ 
        let saved_operations = JSON.parse(history);
        for(let operation of saved_operations){
            let item = document.createElement('li');
            let text = document.createTextNode(operation);
            item.appendChild(text);
            document.getElementById('history').appendChild(item);
        }
        let history_List = document.getElementById('history');
        history_List.scrollTop = history_List.scrollHeight;
    }
}

function clean_history(){
    localStorage.clear();
    document.getElementById('history').replaceChildren();
}