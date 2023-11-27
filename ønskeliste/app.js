// rainbowify text
els = document.getElementsByClassName('rainbow');
colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
var whitespace = 0;
for (var i = 0; i < els.length; i++) {
    newtext = document.createElement('span');
    for (var j = 0; j < els[i].innerHTML.length; j++) {
        letter = document.createElement('span');
        letter.innerHTML = els[i].innerHTML[j];
        if (els[i].innerHTML[j] === " " || els[i].innerHTML[j] === "\n") {whitespace++}
        letter.style.color = colors[(j - whitespace)%7];
        newtext.appendChild(letter);
    }

    els[i].innerHTML = "";
    els[i].appendChild(newtext);
}

// add number counters
els = document.getElementsByClassName('num');
for (var i = 0; i < els.length; i++) {
    els[i].innerHTML = `${i+1}` + els[i].innerHTML;
}

// change link dest targets
els = document.getElementsByTagName('a');
for (var i = 0; i < els.length; i++) {
    els[i].setAttribute('target', '_blank');
}