// Function to initialize after the DOM is ready
function init() {
    var loadingWrap = document.getElementById("loading_wrap");
    if (loadingWrap) {
        loadingWrap.style.display = "none"; // Hide loading wrap initially
    }

    // Fetch all currencies
    fetchCurrencies();

    // Add event listener for save currency button
    var saveCurrencyButton = document.getElementById("savecurrency");
    if (saveCurrencyButton) {
        saveCurrencyButton.onmousedown = function(e) {
            e.preventDefault(); // Prevent default action
            handleSaveCurrency();
        };
    }
}

// Function to fetch all currencies
function fetchCurrencies() {
    var xhr = createRequest();
    xhr.open("POST", "dbe_cf1_ModifyCurrency_Save.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var newCurrencyDropdown = document.getElementById("newcurrency");

            if (newCurrencyDropdown && data) {
                for (var i = 0; i < data.length; i++) {
                    var option = document.createElement("option");
                    option.value = data[i].CODCUR;
                    option.text = data[i].CODCUR + " - " + data[i].SHNCUR;
                    newCurrencyDropdown.appendChild(option);
                }
            }
        }
    };
    xhr.send("searchType=fetchAllCurrency");
}

// Function to handle saving currency
function handleSaveCurrency() {
    var loadingWrap = document.getElementById("loading_wrap");
    if (loadingWrap) {
        loadingWrap.style.display = "block"; // Show loading wrap
    }

    var oldCurrency = document.getElementById("oldcurrency").innerHTML;
    var newCurrency = document.getElementById("newcurrency").value;
    var closeComment = document.getElementById("closeComment").value;

    // Validation checks
    if (oldCurrency === newCurrency && (newCurrency === '' || newCurrency === '')) {
        alert("Warning! Old and new currencies are SAME... Please choose different currency");
        updateHtmlDiv("Warning! Old and new currencies are SAME... Please choose different currency", "reddiv");
        return;
    } else if (closeComment === '') {
        alert("Please provide your comments.");
        updateHtmlDiv("Please provide your comments.", "reddiv");
        return;
    } else if (closeComment.length > 150) {
        alert("Please reduce your comments within 150 characters only.");
        updateHtmlDiv("Please reduce your comments within 150 characters only.", "reddiv");
        return;
    }

    // Create the request object
    var xhr = createRequest();
    xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.id === 'success') {
                updateHtmlDiv("Successfully Updated.", "greendiv");
                setTimeout(function() {
                    location.reload(true);
                }, 1000);
            } else {
                updateHtmlDiv("Failed to update Currency conversion. Please check with Admin Team.", "reddiv");
                alert("Failed to update Currency conversion. Please check with Admin Team.");
            }
        }
    };

    // Prepare data for submission
    var data = "searchType=saveCurrency" +
               "&sub_group_code=" + document.getElementById("selectsgr_code").value +
               "&le_code=" + document.getElementById("selectle_code").value +
               "&CF_Level=" + document.querySelector('input[name="codType"]:checked').value +
               "&codUsr=" + document.getElementById("codUsr").value +
               "&codtype_cdt=" + document.querySelector('input[name="codtype_cdt"]:checked').value +
               "&oldcurrency=" + oldCurrency +
               "&newcurrency=" + newCurrency +
               "&closeComment=" + closeComment;

    xhr.send(data);
}

// Function to update HTML content and class
function updateHtmlDiv(message, className) {
    var htmlDiv = document.getElementById("htmldiv");
    if (htmlDiv) {
        htmlDiv.innerHTML = message;
        htmlDiv.className = class Nam e;
    }
}

// Function to create the request object
function createRequest() {
    var xhr = null;
    if (window.XMLHttpRequest) { // For modern browsers
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // For IE5/IE6
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
}

// Function to handle select dropdown changes
function selectDropdown(s1, s2) {
    var s3 = '';
    if (s2 === 'code') {
        s3 = 'name';
    } else if (s2 === 'name') {
        s3 = 'code';
    }

    var selectDropdown = document.getElementById("select" + s1 + "_" + s2);
    var selectDropdown2 = document.getElementById("select" + s1 + "_" + s3);

    var grpid = selectDropdown.value;
    selectDropdown2.value = grpid;

    // Pull currency & CF details
    getBasicDetails(s1, grpid, '');
}

// Function to reset parameters
function resetParams(val) {
    var inputField = document.createElement("input");
    inputField.id = "txt" + val + "_code";
    inputField.name = "txt" + val + "_code";
    inputField.onchange = function() {
        inputFieldSearch(this.id);
    };

    var inputField2 = document.createElement("input");
    inputField2.id = "txt" + val + "_name";
    inputField2.name = "txt" + val + "_name";
    inputField2.onchange = function() {
        inputFieldSearch(this.id);
    };

    var selectDropdown = document.getElementById("select" + val + "_code");
    var selectDropdown2 = document.getElementById("select" + val + "_name");

    selectDropdown.parentNode.replaceChild(inputField, selectDropdown);
    selectDropdown2.parentNode.replaceChild(inputField2, selectDropdown2);

    // Reset Credit file & Old Currency fields
    document.getElementById("oldcurrency").innerHTML = '';
    document.getElementById("closeComment").value = '';

    // Disable codtype_cdt checkboxes
    var checkboxes = document.getElementsByName("codtype_cdt");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].disabled = true;
    }
}

// Function to set CF Group Level
function setCFGroupLevel(grouptype) {
    if (grouptype === 'sgr') {
        document.getElementById("LE_SEC").style.display = "none";
        document.getElementById("SGR_SEC").style.display = "block";
        resetParams('le');
    } else if (grouptype === 'le') {
        document.getElementById("LE_SEC").style.display = "block";
        document.getElementById("SGR_SEC").style.display = "none";
        resetParams('sgr');
    }
}

// Function to handle input field search
function inputFieldSearch(param) {
    var searchString = '';
    var searchType = '';
    var searchParam = '';
    var stype = '';

    if (param === 'txtsgr_code' || param === 'txtsgr_name') {
        if (param === 'txtsgr_code') {
            searchType = 'fetchSubGroupBasedonID';
            searchString = document.getElementById("txtsgr_code").value;
        } else if (param === 'txtsgr_name') {
            searchType = 'fetchSubGroupBasedonName';
            searchString = document.getElementById("txtsgr_name").value;
        }
        stype = 'sgr';
    } else if (param === 'txtle_code' || param === 'txtle_name') {
        if (param === 'txtle_code') {
            searchType = 'fetchLegalEntityBasedonID';
            searchString = document.getElementById("txtle_code").value;
        } else if (param === 'txtle_name') {
            searchType = 'fetchLegalEntityBasedonName';
            searchString = document.getElementById("txtle_name").value;
        }
        stype = 'le';
    }

    if (searchType !== '') {
        commonSearch(searchType, searchString, searchParam, stype);
    }
}

// Function to perform common search
function commonSearch(searchType, searchString, searchParam, stype) {
    var xhr = createRequest();
    xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resultData = JSON.parse(xhr.responseText);

            if (resultData !== false) {
                var selectDropdown = document.createElement("select");
                selectDropdown.id = "select" + stype + "_code";
                selectDropdown.onchange = function() {
                    selectDropdown(stype, 'code');
                };

                var selectDropdown 2 = document.createElement("select");
                selectDropdown2.id = "select" + stype + "_name";
                selectDropdown2.onchange = function() {
                    selectDropdown(stype, 'name');
                };

                var inputField = document.getElementById("txt" + stype + "_code");
                var inputField2 = document.getElementById("txt" + stype + "_name");

                inputField.parentNode.replaceChild(selectDropdown, inputField);
                inputField2.parentNode.replaceChild(selectDropdown2, inputField2);

                for (var i = 0; i < resultData.length; i++) {
                    var option = document.createElement("option");
                    option.value = resultData[i].id;
                    option.text = resultData[i].id;
                    selectDropdown.appendChild(option);

                    var option2 = document.createElement("option");
                    option2.value = resultData[i].id;
                    option2.text = resultData[i].name;
                    selectDropdown2.appendChild(option2);
                }

                document.getElementById(stype + "_reset").style.display = "block";
            } else {
                alert("No Matching Results Found... or You are not authorized to see this SGR/LE, please contact the Banking Administrator");
            }
        }
    };

    xhr.send("searchType=" + searchType + "&searchString=" + searchString);
}

// Function to get basic details
function getBasicDetails(type, codspm, codstatus) {
    var xhr = createRequest();
    xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.id === 'None') {
                alert("No credit files available..!");
                document.getElementsByName("codtype_cdt")[0].disabled = true;
                document.getElementById("oldcurrency").innerHTML = '';
            } else if (response.id !== 'None') {
                var first = 1;
                var newarr = [25, 26];

                for (var i = 0; i < response.length; i++) {
                    newarr = $.grep(newarr, function(value) {
                        return value !== response[i].CODSTATUS;
                    });

                    if (first === 1) {
                        document.getElementById("oldcurrency").innerHTML = response[i].CODCUR;
                        document.querySelector('input[name="codtype_cdt"][value="' + response[i].CODSTATUS + '"]').checked = true;
                        first++;
                    }

                    document.querySelector('input[name="codtype_cdt"][value="' + response[i].CODSTATUS + '"]').disabled = false;
                }

                console.log(newarr);

                if (newarr.length > 0 && codstatus === '') {
                    document.querySelector('input[name="codtype_cdt"][value="' + newarr[0] + '"]').disabled = true;
                }
            }
        }
    };

    xhr.send("searchType=FetchCFdetails&searchString=" + codspm + "&codstatus=" + codstatus);
}

// Attach event handler after DOM is loaded
document.addEventListener("DOMContentLoaded", init);
