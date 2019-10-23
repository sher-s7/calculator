const mq = window.matchMedia("(min-width: 801px)");
let display = '';
const displayDiv = document.getElementById('displayText');
let stringLength = 16;
let zeroError = 'Cannot divide by zero.';
const decimalButton = document.getElementById('decimal');
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {return a / b; }
function mod(a, b) { 
    if(b==='0' || b===0){
        return 0;
    }
    return a % b; }
function operate(operator, a, b) {
    if (operator === '+') {
        return add(Number(a), Number(b));
    } else if (operator === '-') {
        return subtract(a, b);
    } else if (operator === '×') {
        return multiply(a, b);
    } else if (operator === '÷') {
        return divide(a, b);
    } else if (operator === '%') {
        return mod(a, b);
    }
}
let items = document.querySelectorAll('.grid');
if (mq.matches) {
    items.forEach((item) => {
        item.addEventListener('mousemove', function (e) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left; //x position within the element.
            let y = e.clientY - rect.top;
            let width = rect.right - rect.left;
            let x_percent = 100 * x / width;
            e.target.style.cssText = `background: rgb(31,31,32);
        background: linear-gradient(90deg, rgba(34,34,34,1) ${x_percent - 50}%, rgba(36,36,37,1) ${x_percent}%, rgba(34,34,34,1) ${50 + x_percent}%);`
        })
    })
    items.forEach((item) => {
        item.addEventListener('mouseleave', function (e) {
            e.target.style.cssText = `background: rgb(31,31,32);
        background: linear-gradient(90deg, rgba(31,31,32,1) 0%, rgba(31,31,32,1) 50%, rgba(31,31,32,1) 100%);`
        })
    })
}

function isNumeric(value) { //checks if single character is numeric
    return /\d/.test(value);
}

function computeString(str, firstValOp) {
    let strNums = str.match(/[0-9]*\.?[0-9]+/g);
    let strOps = str.match(/(\+|-|÷|×|%)/g);
    let i=1;
    if(firstValOp){
        strNums.splice(0,0,0);
    }
    console.log(strOps);
    console.log(strNums);
    while (i <= strNums.length) {
        strNums.splice(i, 0, strOps.splice(0, 1)[0]);
        i += 2;
    }
    strNums.pop();
    for (let i = 0; i < strNums.length; i++) {
        if (strNums[i] === '×' || strNums[i] === '÷' || strNums[i] === '%') {
            if(strNums[i] === '÷' && strNums[i+1]==='0'){
                return zeroError;
            }
            let result = operate(strNums[i], strNums[i - 1], strNums[i + 1]);
            strNums.splice(i - 1, 3, result);
            i -= 1;
        }
    }
    for (let i = 0; i < strNums.length; i++) {
        if (strNums[i] === '+' || strNums[i] === '-') {
            let result = operate(strNums[i], strNums[i - 1], strNums[i + 1]);
            strNums.splice(i - 1, 3, result);
            i -= 1;
        }
    }

    return strNums[0];
}
let countDecimals = function (value) {
    if(Math.floor(value) === Number(value)) return 0;
    return value.toString().split(".")[1].length || 0; 
}
let lastDisplay = 'temp';
items.forEach((item) => {
    item.addEventListener('click', function (e) {
        if (e.target.id === 'equals') {
            let firstValOp= false;
            if(!isNumeric(display[0]) && display[0]!== '.'){
                firstValOp=true;
            }
            display = String(computeString(display, firstValOp));
            
            if(countDecimals(display)>5){
                display = String(Number(display).toFixed(5));
            }
            displayDiv.textContent = display;
            lastDisplay=display;
            if(!display.includes('.')){
                decimalButton.classList.remove('disabled')
            }
            // display = '';
        }
        if (e.target.id === 'C') {
            display = '0';
            displayDiv.textContent = display;
            display='';
            decimalButton.classList.remove('disabled');

        }
        if(e.target.id==='decimal' && !e.target.classList.contains('disabled')){
            display+=e.target.textContent;
            displayDiv.textContent=display;
            e.target.classList.toggle('disabled');
        }
        if(e.target.id==='back'){
            console.log('backing')
            if(display.length===1){
                display = '0';
                displayDiv.textContent = display;
                display='';
                decimalButton.classList.remove('disabled');
            }
            if(display[display.length-1]==='.'){
                decimalButton.classList.remove('disabled');
            }
            display=display.slice(0,display.length-1);
            displayDiv.textContent=display;
        }
        if(e.target.classList[0]==='num' || e.target.classList[0]==='op'){
            if(e.target.classList[0]==='op'){
                decimalButton.classList.remove('disabled');
            }
            if((display===zeroError) || (display==='0' && !(e.target.classList[0]==='op'))){
                console.log('a')
                display='';
            }else if(!(isNaN(Number(lastDisplay))) && e.target.classList[0]==='num' && display!=='.' && !display.includes('.')){
                console.log(lastDisplay)
                display='';
                lastDisplay = 'temp';
            }else if(!(isNaN(Number(lastDisplay))) && e.target.classList[0]==='op'){
                lastDisplay = 'temp';
                
            }else if(display==='' && e.target.classList[0]==='op'){
                display='0';
            }
        
            display += e.target.textContent;
            displayDiv.textContent = display;
        }
            
        
        
    })
})