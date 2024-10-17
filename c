function getBasicDetails(type, codspm, codstatus) {
    codstatus = codstatus || '';

    var xmlhttp;

    // Using ActiveXObject for IE5
    try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
        alert("Your browser does not support ActiveX or XMLHTTP.");
        return;
    }

    // Set up the callback function for handling the response
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            // Request has completed
            if (xmlhttp.status === 200) {
                var response;
                try {
                    // Check if the response is empty or invalid
                    if (xmlhttp.responseText.trim() === "") {
                        alert("Empty response received from the server.");
                        return;
                    }

                    // Attempt to parse the JSON response
                    response = JSON.parse(xmlhttp.responseText);
                } catch (e) {
                    alert("Error parsing JSON response: " + e.message + "\nResponse: " + xmlhttp.responseText);
                    return;
                }

                // Process the response if it's valid
                if (response && response.id === 'None') {
                    // Disable codtype inputs and clear the oldcurrency field
                    var codtypeInputs = document.getElementsByName('codtype_cdt');
                    for (var i = 0; i < codtypeInputs.length; i++) {
                        codtypeInputs[i].disabled = true;
                        codtypeInputs[i].checked = false;
                    }
                    document.getElementById('oldcurrency').innerText = ""; // Use innerText for IE5
                    alert("No credit files available!");

                } else {
                    // Handle valid response and update UI
                    var first = 0;
                    var newarr = [25, 26];

                    for (var i = 0; i < response.length; i++) {
                        var item = response[i];
                        for (var j = 0; j < newarr.length; j++) {
                            if (newarr[j] === item.CODSTATUS) {
                                newarr.splice(j, 1);  // Remove item from newarr
                            }
                        }

                        if (first === 0) {
                            document.getElementById('oldcurrency').innerText = item.CODCUR;  // Use innerText
                            var codtypeInputs = document.getElementsByName('codtype_cdt');
                            for (var k = 0; k < codtypeInputs.length; k++) {
                                if (codtypeInputs[k].value === item.CODSTATUS) {
                                    codtypeInputs[k].checked = true;
                                    codtypeInputs[k].disabled = false;
                                }
                            }
                            first++;
                        }

                        // Enable all codtype inputs with the correct status
                        var codtypeInputsAll = document.getElementsByName('codtype_cdt');
                        for (var l = 0; l < codtypeInputsAll.length; l++) {
                            if (codtypeInputsAll[l].value === item.CODSTATUS) {
                                codtypeInputsAll[l].disabled = false;
                            }
                        }
                    }

                    if (newarr.length > 0 && codstatus === '') {
                        // Disable the codtype input if newarr has items and codstatus is empty
                        var codtypeInputsAgain = document.getElementsByName('codtype_cdt');
                        for (var m = 0; m < codtypeInputsAgain.length; m++) {
                            if (codtypeInputsAgain[m].value === newarr[0]) {
                                codtypeInputsAgain[m].disabled = true;
                            }
                        }
                    }
                }

            } else {
                // Handle non-200 responses
                alert("Error: Received status " + xmlhttp.status + " from the server.");
            }
        }
    };

    // Prepare data for sending as a query string
    var params = "searchType=FetchCFdetails&searchString=" + escape(codspm) + "&codstatus=" + escape(codstatus);

    // Send the request using POST
    try {
        xmlhttp.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
    } catch (e) {
        alert("An error occurred while trying to send the request: " + e.message);
    }
}