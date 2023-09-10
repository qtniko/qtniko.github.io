function createConverter (txt, base, customBase, removable, lineBreak) {
    let master = document.createElement('div');
    master.id = 'converter';
    
    let text = document.createElement('span');
    text.innerHTML = txt;

    let baseEl = document.createElement('input');
    baseEl.defaultValue = String(base);
    baseEl.value = baseEl.defaultValue;
    baseEl.type = 'number';
    baseEl.id = 'base';
    baseEl.style = 'width: 3em;';
    if (!customBase) baseEl.hidden = 'true';

    let input = document.createElement('input');
    input.id = 'input';
    input.type = 'text';

    let destroyButton = document.createElement('button');
    destroyButton.innerHTML = ' - ';
    if (!removable) destroyButton.hidden = 'true';
    destroyButton.onclick = () => {master.remove()};

    let br = document.createElement('br');
    if (!lineBreak) {
        br.hidden = 'true';
    }

    master.appendChild(br);
    master.appendChild(text);
    master.appendChild(baseEl);
    master.innerHTML += ': ';
    master.appendChild(input);
    master.innerHTML += ' ';
    master.appendChild(destroyButton);

    let converters = document.getElementById('converters');
    converters.appendChild(master);
    
    let inputField = master.children[3];
    inputField.addEventListener('input', (event) => {
        const base = Number(master.children[2].value);
        event.target.value = strip(base, event.target.value);
        updateConverters(Number(master.children[2].value), event.target.value);
    });

    let baseField = master.children[2];
    baseField.addEventListener('input', (event) => {
        event.target.value = strip(10, event.target.value);
        const base = Number(event.target.value);
        if (base > 36) event.target.value = 36;
        else if (base < 2 || base in [undefined, NaN]) event.target.value = 2;
        const dec = document.querySelectorAll('[id=converter]')[0].children[3].value;
        master.children[3].value = decX(event.target.value, dec);
    });

    updateConverters(10, document.querySelectorAll('[id=converter]')[0].children[3].value);
}

function updateConverters (b, x) {
    const dec = Xdec(b, x);
    let converters = document.querySelectorAll('[id=converter]');
    for (var i = 0; i < converters.length; i++) {
        converters[i].children[3].value = decX(Number(converters[i].children[2].value), dec);
    }
}

window.onload = () => {
    
    createConverter('Decimal', 10, false, false, false);
    createConverter('Binary', 2, false, false, true);
    createConverter('Octal', 8, false, false, true);
    createConverter('Hexadecimal', 16, false, false, true);

};

function decX (b, dec) {

    dec = Number(dec);
    const values = '0123456789abcdefghijklmnopqrstuvwxyz';

    let x = '';
    while (dec > 0) {
        x = values[dec%b] + x;
        dec = Math.floor(dec/b);
    }
    return x;
}

function Xdec (b, x) {

    const values = '0123456789abcdefghijklmnopqrstuvwxyz';

    let dec = 0;
    for (var i = 0; i < x.length; i++) {
        dec += values.indexOf(x[i]) * b**(x.length-1-i);
    }
    return String(dec);
}

function strip (b, str) {
    let regex = '';
    for (var i = 0; i < b; i++) {
        regex += '0123456789abcdefghijklmnopqrstuvwxyz'[i];
    }
    const re = new RegExp(`[^${regex}]*`, 'gi');
    return str.replace(re, '');
}