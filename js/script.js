const form = document.querySelector("form");
const inputName = document.getElementById("name");
const inputEmail = document.getElementById("mail");
const inputOtherTitle = document.getElementById("other-title");
const selectTitle = document.getElementById("title");
const selectTheme = document.getElementById("design");
const divColor = document.getElementById("colors-js-puns");
const selectColor = document.getElementById("color");
const listCheckboxActivities = document.querySelectorAll("fieldset.activities input[type=checkbox]");
const fieldsetActivities = document.querySelector("fieldset.activities");
const pTotalCost = document.createElement("p");
const selectPayment = document.getElementById("payment");
const divCreditCard = document.getElementById("credit-card");
const inputCardNumber = document.getElementById("cc-num");
const inputZipCode = document.getElementById("zip");
const inputCVV = document.getElementById("cvv");
const divPaypal = document.getElementById("paypal");
const divBitcoin = document.getElementById("bitcoin");
const divErrorName = document.createElement("div");
const divErrorEmail = document.createElement("div");
const divErrorActivities = document.createElement("div");
const divErrorCreditCard = document.createElement("div");

var countActivities = 0;
var totalCost = 0;

/**
 * Set initial value and appearance
 *
 */
window.onload = function() {
    // give focus to first text field
    inputName.focus();
    // set the title select to 'select job role'
    selectTitle.innerHTML = '<option value="" selected disabled hidden>Select Job Role</option>' + selectTitle.innerHTML;
    selectTitle.selectedIndex = 0;
    // hide the text input used for other title
    inputOtherTitle.style.display = 'none';
    // set the theme select to 'select theme'
    selectTheme.selectedIndex = 0;
    // prepare and hide the color select
    selectColor.innerHTML = '<option value="" selected disabled hidden>Select Color</option>' + selectColor.innerHTML;
    divColor.style.display = 'none';
    // add total cost paragraph
    pTotalCost.textContent = "total: $0"
    fieldsetActivities.appendChild(pTotalCost);
    // hide "Select Payment Method", bicoin div and paypal div
    selectPayment.firstElementChild.style.display = "none";
    divPaypal.style.display = "none";
    divBitcoin.style.display = "none";
    selectPayment.children[1].selected = true;
    // set divs for validation error's messages
    divErrorName.textContent = "Please enter your name";
    divErrorName.style.color = "red";
    divErrorName.style.textAlign = "right";
    divErrorName.style.display = "none";
    inputName.parentNode.insertBefore(divErrorName, inputName.nextSibling);
    divErrorEmail.textContent = "Please enter a valid email";
    divErrorEmail.style.color = "red";
    divErrorEmail.style.textAlign = "right";
    divErrorEmail.style.display = "none";
    inputEmail.parentNode.insertBefore(divErrorEmail, inputEmail.nextSibling);
    divErrorActivities.textContent = "Please select at least one activity";
    divErrorActivities.style.color = "red";
    divErrorActivities.style.display = "none";
    fieldsetActivities.insertBefore(divErrorActivities, fieldsetActivities.children[1]);
    divErrorCreditCard.style.color = "red";
    divErrorCreditCard.style.textAlign = "right";
    divErrorCreditCard.style.display = "none";
    divCreditCard.insertBefore(divErrorCreditCard, divCreditCard.children[3]);
    // set event listener
    selectTheme.addEventListener("change", updateColor);
    selectTitle.addEventListener("change", showOtherInput);
    for (let i = 0; i < listCheckboxActivities.length; i += 1) {
        listCheckboxActivities[i].addEventListener("change", checkActivity);
    };
    selectPayment.addEventListener("change", changePaymentMethod);
    form.addEventListener("submit", validate);
    inputEmail.addEventListener("keyup", validateEmail);
    inputEmail.addEventListener("change", validateEmail);
};

/* ================================= 
  Basic Info
==================================== */

/**
 * Show a input to describe the other title (if this option is selected)
 *
 * @param  {Event} event the event associated to the clicked link 
 *
 */
function showOtherInput(event) {
    if (event.target.value == "other") {
        inputOtherTitle.style.display = '';
        inputOtherTitle.focus()
    } else {
        inputOtherTitle.style.display = 'none';
    };
};

/* ================================= 
  T-Shirt Info
==================================== */

/**
 * Update the entry of the select menu for t-shirt colors.
 *
 * @param  {Event} event the event associated to the change 
 *
 */
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

/* ================================= 
  Register for Activities
==================================== */

/**
 * Update the total cost of selected activities
 *
 * @param  {Number} number the modifier for the total cost
 *
 */
function updateTotalCost(cost) {
    totalCost += cost;
    pTotalCost.textContent = "total: $" + totalCost;
};

/**
 * Give the name of the day of an activity
 *
 * @param  {DOM Element} activity the checkbox associated at the last (un)checked activity
 *
 * @return {string}               the name of the day of this activity
 */
function getActivityDay(activity) {
    if (activity.dataset.dayAndTime) {
        return activity.dataset.dayAndTime.replace(/(\w+) (\d+)(\w{2}).(\d+)(\w{2})/, "$1")
    } else {
        return ""
    }
};

/**
 * Give the hour of the beginning of an activity
 *
 * @param  {DOM Element} activity the checkbox associated at the last (un)checked activity
 *
 * @return {number}               the hour of the beginning of this activity
 */
function getActivityStartHour(activity) {
    var startHour = 0;
    var amOrPm = "am";
    if (activity.dataset.dayAndTime) {
         startHour = activity.dataset.dayAndTime.replace(/(\w+) (\d+)(\w{2}).(\d+)(\w{2})/, "$2")
         amOrPm = activity.dataset.dayAndTime.replace(/(\w+) (\d+)(\w{2}).(\d+)(\w{2})/, "$3")
    };
    startHour = parseInt(startHour, 10);
    if (amOrPm == "pm" && startHour != 12) {
        startHour += 12;
    };
    return startHour;
};

/**
 * Give the hour of the ending of an activity
 *
 * @param  {DOM Element} activity the checkbox associated at the last (un)checked activity
 *
 * @return {number}               the hour of the ending of this activity
 */
function getActivityEndHour(activity) {
    var endHour = 0;
    var amOrPm = "am";
    if (activity.dataset.dayAndTime) {
         endHour = activity.dataset.dayAndTime.replace(/(\w+) (\d+)(\w{2}).(\d+)(\w{2})/, "$4")
         amOrPm = activity.dataset.dayAndTime.replace(/(\w+) (\d+)(\w{2}).(\d+)(\w{2})/, "$5")
    };
    endHour = parseInt(endHour, 10);
    if (amOrPm == "pm" && endHour != 12) {
        endHour += 12;
    };
    return endHour;
};

/**
 * Set the list of competing activities
 *
 * @param  {DOM Element} activity the checkbox associated at the last (un)checked activity
 *
 * @return {array}                the list of competing activities
 */
function findCompetingActivities(activity) {
    const listCompetingActivities = [];
    for (let i = 0 ; i < listCheckboxActivities.length ; i += 1) {
        const otherActivity = listCheckboxActivities[i];
        if (getActivityDay(activity) == getActivityDay(otherActivity) &&
            getActivityStartHour(activity) <= getActivityEndHour(otherActivity) &&
            getActivityEndHour(activity) >= getActivityStartHour(otherActivity)) {
                listCompetingActivities.push(otherActivity);
        } else if (getActivityDay(activity) == getActivityDay(otherActivity) &&
            getActivityStartHour(otherActivity) <= getActivityEndHour(activity) &&
            getActivityEndHour(otherActivity) >= getActivityStartHour(activity)) {
                 listCompetingActivities.push(otherActivity)
        };
    };
    return listCompetingActivities;
};

/**
 * Re-enable the competing activities
 *
 * @param  {DOM Element} activity the checkbox associated at the last unchecked activity
 *
 */
function enableCompetingActivities(activity) {
    const listCompetingActivities = findCompetingActivities(activity);
    for (let i = 0; i < listCompetingActivities.length; i +=1 ) {
        const otherActivity = listCompetingActivities[i];
        otherActivity.disabled = false;
        otherActivity.parentNode.style.color = "";
    };
};

/**
 * disable the competing activities
 *
 * @param  {DOM Element} activity the checkbox associated at the last checked activity
 *
 */
function disableCompetingActivities(activity) {
    const listCompetingActivities = findCompetingActivities(activity);
    for (let i = 0; i < listCompetingActivities.length; i +=1 ) {
        const otherActivity = listCompetingActivities[i];
        if (!otherActivity.checked) {
            otherActivity.disabled = true;
            otherActivity.parentNode.style.color = "gray";
        };
    };
};

/**
 * After (un)check an activity, update the total cost and check all competing activities
 *
 * @param  {Event} event The event associated to the (un)checked checkbox of an activity
 *
 */
function checkActivity(event) {
    const activity = event.target;
    if (activity.checked) {
        updateTotalCost(parseInt(activity.dataset.cost, 10));
        disableCompetingActivities(activity);
        countActivities += 1;
    } else {
        updateTotalCost(-parseInt(activity.dataset.cost, 10));
        enableCompetingActivities(activity);
        countActivities -= 1;
    };
};

/* ================================= 
  Payment Info
==================================== */

/**
 * Display the div concerning the selected payment method
 *
 * @param  {Event} event The event associated to selected payment method
 *
 */
function changePaymentMethod(event) {
    const method = event.target.value;
    divCreditCard.style.display = "none";
    divPaypal.style.display = "none";
    divBitcoin.style.display = "none";
    if (method == "credit card") {
        divCreditCard.style.display = "";
    } else if (method == "paypal") {
        divPaypal.style.display = "";
    } else if (method == "bitcoin") {
        divBitcoin.style.display = "";
    };
};

/* ================================= 
  Form validation
==================================== */

/**
 * Verify if the input Name is blank
 *
 * @return {boolean}    true only if the name isn't blank
 */
function validateName() {
    if (inputName.value == "") {
        divErrorName.style.display = '';
        inputName.focus();
        return false
    } else {
        divErrorName.style.display = "none";
        return true
    };
};

/**
 * Verify if the input Email seems valid
 *
 * @param  {Event} event The event associated to typing in the Email text input.
 *
 * @return {boolean}     True only if the name isn't blank
 */
function validateEmail(event) {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(inputEmail.value)) {
        divErrorEmail.style.display = "none";
        return true
    } else {
        divErrorEmail.style.display = '';
        inputEmail.focus();
        return false
    };
};

/**
 * Verify if at least one activity is checked
 *
 * @return {boolean}    true only if at least one activity is checked
 */
function validateActivities() {
    if (countActivities == 0) {
        divErrorActivities.style.display = '';
        fieldsetActivities.scrollIntoView();
        return false
    } else {
        divErrorActivities.style.display = "none";
        return true
    };
};

/**
 * Verify if the input Name is blank
 *
 * @return {boolean}    true if credit card method isn't selected or if card number, zip code and CVV seems valid.
 */
function validateCreditCard() {
    if (selectPayment.value != "credit card") {
        return true
    } else if (!/^[0-9]{13,16}$/.test(inputCardNumber.value)) {
        if (!/^[0-9]+$/.test(inputCardNumber.value)) {
            divErrorCreditCard.textContent = "Invalid card number - please enter only numbers";
        } else if (inputCardNumber.value.length < 13) {
            divErrorCreditCard.textContent = "Your credit card number must contain at least 13 number";
        } else {
            divErrorCreditCard.textContent = "Your credit card number must contain at most 16 number";
        };
        divErrorCreditCard.style.display = "";
        inputCardNumber.focus();
        return false
    } else if (!/^[0-9]{5}$/.test(inputZipCode.value)) {
        divErrorCreditCard.textContent = "Please verify your Zip Code";
        divErrorCreditCard.style.display = "";
        inputZipCode.focus();
        return false
    } else if (!/^[0-9]{3}$/.test(inputCVV.value)) {
        divErrorCreditCard.textContent = "Please verify your CVV";
        divErrorCreditCard.style.display = "";
        inputCVV.focus();
        return false
    } else {
        divErrorCreditCard.style.display = "none";
        return true
    };
};

/**
 * Verify if the form seems valid. If the info are valid, display `info sent to server`
 *
 * @param  {Event}   event The event associated to submitting the form
 *
 */
function validate(event) {
    event.preventDefault();
    const valid = validateName() &&
                  validateEmail() && 
                  validateActivities() &&
                  validateCreditCard();
    if (valid) {
        document.querySelector("body").innerHTML = "This data seems valid <br/> send info to server";
    };
};

