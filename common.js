function commonsearch(searchType, searchString, searchParam, stype, check) {
    var xmlhttp;
    
    // Create an XMLHTTP request for IE5/IE6 or use standard for modern browsers
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest(); // For modern browsers
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // For IE5/IE6
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var resultData = eval('(' + xmlhttp.responseText + ')'); // Parsing JSON for IE5

            if (!resultData) {
                if (check == 0) populateSearchOptions(stype, resultData);

                if (stype == 'sgr') {
                    commonsearch('fetchLEBasedonSGR', resultData[0]['id'], searchParam, 'le', 0);
                } else if (stype == 'le') {
                    if (document.getElementById("selectsgr_code").value != '' && document.getElementById("selectle_code").value != '') {
                        checkForCreditFiles(document.getElementById("selectsgr_code").value, document.getElementById("selectle_code").value);
                    } else if (document.getElementById("txtle_code").value != '' || document.getElementById("txtle_name").value != '') {
                        var sgrdata = {};
                        sgrdata['sgr'] = {
                            'id': resultData[0].sgr_code,
                            'name': resultData[0].sgr_name
                        };
                        populateSearchOptions('sgr', sgrdata);

                        var ledata = {};
                        ledata['le'] = {
                            'id': resultData[0].le_code,
                            'name': resultData[0].le_name
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
                        alert("No references are available for this LE..!");
                    } else {
                        emptydropdown(stype);
                    }
                } else if (stype == 'sgr') {
                    emptydropdown(stype);
                    emptydropdown('le');
                }
            }
        }
    };

    xmlhttp.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("searchType=" + encodeURIComponent(searchType) + "&searchString=" + encodeURIComponent(searchString));
}