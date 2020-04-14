const inputName = document.getElementById("name");
const inputOtherTitle = document.getElementById("other-title");
const selectTitle = document.getElementById("title");
const selectTheme = document.getElementById("design");
const divColor = document.getElementById("colors-js-puns");
const selectColor = document.getElementById("color");
const listCheckboxActivities = document.querySelectorAll("fieldset.activities input[type=checkbox]");
const fieldsetActivities = document.querySelector("fieldset.activities");
const pTotalCost = document.createElement("p");

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
    // set event listener
    selectTheme.addEventListener("change", updateColor);
    selectTitle.addEventListener("change", showOtherInput);
    for (let i = 0; i < listCheckboxActivities.length; i += 1) {
        listCheckboxActivities[i].addEventListener("change", checkActivity);
    };
};

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
    } else {
        updateTotalCost(-parseInt(activity.dataset.cost, 10));
        enableCompetingActivities(activity);
    };
};
