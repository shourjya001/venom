// Function to initialize after the DOM is ready, compatible with IE5/6
function init() {
    var saveCurrencyButton = document.getElementById("savecurrency");
    if (saveCurrencyButton) {
        // Save form/currency changes
        saveCurrencyButton.onmousedown = function() {
            var loadingWrap = document.getElementById("loading_wrap");
            if (loadingWrap) {
                loadingWrap.style.display = "block";
            }

            saveCurrencyButton.onkeydown = function(e) {
                var key = e.which || e.keyCode;
                if (key == 13) e.returnValue = false; // Prevent Enter key default action
            };

            var oldCurrency = document.getElementById("oldcurrency") ? document.getElementById("oldcurrency").innerHTML : '';
            var newCurrency = document.getElementById("newcurrency") ? document.getElementById("newcurrency").value : '';
            var closeComment = document.getElementById("closeComment") ? document.getElementById("closeComment").value : '';

            if (oldCurrency !== '' && oldCurrency === newCurrency) {
                alert("Warning! Old and new currencies are the SAME. Please choose a different currency.");
                updateHtmlDiv("Warning! Old and new currencies are SAME. Please choose different currency.", "reddiv");
                return;
            } else if (closeComment === '') {
                alert("Please provide your comments.");
                updateHtmlDiv("Please provide your comments.", "reddiv");
                return;
            }

            // Create the request object
            var xhr = createRequest();
            xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = eval('(' + xhr.responseText + ')');
                    if (response.id === 'success') {
                        updateHtmlDiv("Successfully updated.", "greendiv");
                        setTimeout(function() {
                            location.reload(true);
                        }, 1000);
                    } else {
                        updateHtmlDiv("Failed to update Currency conversion. Please check with Admin Team.", "reddiv");
                        alert("Failed to update Currency conversion. Please check with Admin Team.");
                    }
                }
            };

            var data = "searchType=saveCurrency" +
                       "&sub_group_code=" + (document.getElementById("selectsg_code") ? document.getElementById("selectsg_code").value : '') +
                       "&le_code=" + (document.getElementById("selectle_code") ? document.getElementById("selectle_code").value : '') +
                       "&CF_Level=" + (document.getElementsByName("codTypeCdt")[0] ? document.getElementsByName("codTypeCdt")[0].value : '') +
                       "&codUsr=" + (document.getElementById("codUsr") ? document.getElementById("codUsr").value : '') +
                       "&codtype_cdt=" + (document.getElementsByName("codtype_cdt")[0] ? document.getElementsByName("codtype_cdt")[0].value : '') +
                       "&oldcurrency=" + oldCurrency +
                       "&newcurrency=" + newCurrency +
                       "&closeComment=" + closeComment;

            xhr.send(data);
        };
    }
}

// Function to create the request object, for compatibility with both modern and older IE versions
function createRequest() {
    var xhr = null;
    if (window.XMLHttpRequest) { // For modern browsers
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // For IE5/IE6
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
}

// Function to update HTML content and class
function updateHtmlDiv(message, className) {
    var htmlDiv = document.getElementById("htmldiv");
    if (htmlDiv) {
        htmlDiv.innerHTML = message;
        htmlDiv.className = className;
    }
}

// Use XMLHttpRequest to fetch all currencies on page load
function fetchCurrencies() {
    var xhr = createRequest();
    xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = eval('(' + xhr.responseText + ')');
            var newCurrencyDropdown = document.getElement By Id("newcurrency");

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

// Attach event handlers after DOM is loaded, compatible with IE5/6 and modern browsers
if (document.attachEvent) { // For IE5/6
    document.attachEvent("onreadystatechange", function() {
        if (document.readyState === "complete") {
            init();
            fetchCurrencies();
        }
    });
} else { // For modern browsers
    document.addEventListener("DOMContentLoaded", function() {
        init();
        fetchCurrencies();
    });
}
