let screen = document.getElementById('screen');
let result_screen = document.getElementById('result');
let btns = document.querySelectorAll('.calculator_btn-num');

for(let btn of btns){
    btn.addEventListener('click',show);
}

window.addEventListener('keydown',show_Keyboard);

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
                result_screen.textContent = '';
                screen.textContent += '/';
            }
            break;

        default:
            if(current_text.length < 40){
                result_screen.textContent = '';
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
                result_screen.textContent = '';
                screen.textContent += '×';
            }
            break;

        default:
            if(
                current_text.length < 40 &&
                /^[0-9+\-/.()]$/.test(e.key)
            ){
                result_screen.textContent = '';
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
}