let screen = document.getElementById('screen');
let result_screen = document.getElementById('result');
let btns = document.querySelectorAll('.calculator_btn-num');

for(let btn of btns){
    btn.addEventListener('click',show);
}

window.addEventListener('keydown',show_Keyboard);

function show(e){
    let value = e.target.textContent;
    let current_text = screen.textContent;
    
    if(value === 'DEL'){
        screen.textContent = screen.textContent.slice(0, -1);
        result_screen.textContent = '';
    }else if(value === 'AC'){
        screen.textContent = ''; 
        result_screen.textContent = '';
    }else if(current_text.length<40){
        if (value === '÷') {
            screen.textContent += '/';
        } else if (value === '=') {
            execute_calculation();
        } else {
            screen.textContent += value;
        }
    }
}

function show_Keyboard(e){
    let current_text = screen.textContent;

    if (e.key === 'Backspace') {
        screen.textContent = current_text.slice(0, -1);
        result_screen.textContent = '';
    }else if (e.key === 'Enter' || e.key === '=') {
        execute_calculation();
    }else if((current_text.length<40)){
        if(e.key === '*'){
            screen.textContent += '×';
        }else if (/^[0-9+\-/.()]$/.test(e.key)) {
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
            result_screen.textContent = result;
        }
    }catch(error){
        result_screen.textContent = 'Syntax Error';
        console.error(error);
    }

}