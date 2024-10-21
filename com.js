function commonsearch(searchType, searchString, searchParam, stype, check) {
    var xmlhttp;

    // Check for IE5/IE6 browser support and use ActiveXObject for XMLHTTP request
    if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Your browser is too modern for this function."); // IE5 compatibility requires older tech.
        return;
    }

    // Handle state changes of the HTTP request
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) { // Request complete
            if (xmlhttp.status == 200) { // Successful response
                var resultData = eval('(' + xmlhttp.responseText + ')'); // Parse JSON using eval for IE5
                
                // Check if resultData is false or empty
                if (!resultData || resultData.length == 0) {
                    if (check == 0) {
                        populateSearchOptions(stype, resultData);
                    }

                    if (stype == 'sgr') {
                        commonsearch('fetchLEBasedonSGR', resultData[0]['id'], searchParam, 'le', 0);
                    } else if (stype == 'le') {
                        if (document.getElementById("selectsgr_code").value != '' && document.getElementById("selectle_code").value != '') {
                            checkForCreditFiles(document.getElementById("selectsgr_code").value, document.getElementById("selectle_code").value);
                        } else if (document.getElementById("txtle_code").value != '' || document.getElementById("txtle_name").value != '') {
                            var sgrdata = {
                                sgr: {
                                    id: resultData[0].sgr_code,
                                    name: resultData[0].sgr_name
                                }
                            };
                            populateSearchOptions('sgr', sgrdata);

                            var ledata = {
                                le: {
                                    id: resultData[0].le_code,
                                    name: resultData[0].le_name
                                }
                            };
                            populateSearchOptions('le', ledata);

                            checkForCreditFiles(document.getElementById("selectsgr_code").value, document.getElementById("selectle_code").value);
                        } else {
                            if (check == 0) {
                                populateSearchOptions('sgr', resultData);
                                commonsearch('fetchLegalEntityBasedonID', resultData[0]['id'], searchParam, 'le', 1);
                            }
                        }
                    }

                    document.getElementById('loading_wrap').style.display = 'none';
                } else {
                    if (check == 0) {
                        alert("No Matching Results Found...! or You are not authorized to see this SGR/LE, please contact the Banking Administrator.");
                    }
                    document.getElementById('loading_wrap').style.display = 'none';
                    
                    if (stype == 'le') {
                        if (check == 1) {
                            document.getElementById("codria_span").innerHTML = '';
                            alert("No references are available for this LE.");
                        } else {
                            emptydropdown(stype);
                        }
                    } else if (stype == 'sgr') {
                        emptydropdown(stype);
                        emptydropdown('le');
                    }
                }
            } else {
                alert("An error occurred while processing the request.");
            }
        }
    };

    // Open and send the POST request
    xmlhttp.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Encode parameters and send the request
    xmlhttp.send("searchType=" + escape(searchType) + "&searchString=" + escape(searchString));
}