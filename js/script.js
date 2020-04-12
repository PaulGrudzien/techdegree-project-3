const inputName = document.getElementById("name");
const inputOtherTitle = document.getElementById("other-title");
const selectTitle = document.getElementById("title");
const selectTheme = document.getElementById("design");
const divColor = document.getElementById("colors-js-puns");
const selectColor = document.getElementById("color");

window.onload = function() {
  // give focus to first text field
  inputName.focus();
  // set the title select to 'select jor role'
  selectTitle.innerHTML = '<option value="" selected disabled hidden>Select Job Role</option>' + selectTitle.innerHTML;
  selectTitle.selectedIndex = 0;
  // hide the text input used for other title
  inputOtherTitle.style.display = 'none';
  // set the theme select to 'select theme'
  selectTheme.selectedIndex = 0;
  // prepare and hide the color select
  selectColor.innerHTML = '<option value="" selected disabled hidden>Select Color</option>' + selectColor.innerHTML;
  divColor.style.display = 'none';
};

function showOtherInput(event) {
    if (event.target.value == "other") {
        inputOtherTitle.style.display = '';
        inputOtherTitle.focus()
    } else {
        inputOtherTitle.style.display = 'none';
    };
};

function updateColor(event) {
    var theme = event.target.value;
    divColor.style.display = '';
    selectColor.selectedIndex = 0;
    selectTheme.children[0].style.display = "none";
    if (theme == "js puns") {
      for (let i = 0; i<selectColor.children.length; i += 1) {
        const option = selectColor.children[i];
        if (/JS Puns/.test(option.textContent)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        };
      };
    } else if (theme == "heart js") {
      for (let i = 0; i<selectColor.children.length; i += 1) {
        const option = selectColor.children[i];
        if (/I . JS/.test(option.textContent)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        };
      };
      divColor.style.display = '';
    };
};

selectTheme.addEventListener("change", updateColor);
selectTitle.addEventListener("change", showOtherInput);
