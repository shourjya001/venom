// Handle the change event for #selectc2 dropdown
document.getElementById("selectc2").attachEvent("onchange", function() {
    var obj_select3 = document.CF10.selectc3;
    var selectc2 = document.getElementById("selectc2");
    var mapstr = selectc2.options[selectc2.selectedIndex].value;
    var selectc3 = document.getElementById("selectc3");
    var selectmapstr = selectc3.options[selectc3.selectedIndex].value;

    if (mapstr !== '') {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP"); // ActiveXObject for IE5
        xhr.open('POST', 'dbe_cfl_user_accessTransferSave.php', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Using eval instead of JSON.parse for compatibility
                var res = eval('(' + xhr.responseText + ')');
                selectc3.options.length = 0;

                if (mapstr == 'None') {
                    var noneOption = document.createElement('option');
                    noneOption.text = 'None';
                    selectc3.add(noneOption);
                }

                if (res && res.usersdata) {
                    for (var i = 0; i < res.usersdata.length; i++) {
                        var usr = res.usersdata[i];
                        var option = document.createElement('option');
                        option.value = usr.USERGRP;
                        option.text = usr.GRPNAME;
                        selectc3.add(option);
                    }
                }
            }
        };

        var codriaVal = document.querySelector('input[name="codria"]:checked').value;
        var sgrCode = document.getElementById("selectsgr_code").value;

        xhr.send('searchType=fetchUsersdetails&name=' + mapstr + '&codria=' + codriaVal + '&sub_group_code=' + sgrCode);
    }
});

// Handle the change event for codria_code
document.getElementById("codria_code").attachEvent("onchange", function() {
    var cval = document.getElementById("codria_code").value;
    if (cval !== '' && cval !== undefined && cval !== 0) {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', 'dbe_cfl_user_accessTransferSave.php', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = eval('(' + xhr.responseText + ')');
                document.getElementById('loading_wrap').style.display = 'none';

                if (res.id == 'None') {
                    document.querySelector('.codria_class').style.display = 'none';
                    alert("Invalid reference number..!");
                } else {
                    var sgrdata = { 'sgr': { 'id': res[0].sgr_code, 'name': res[0].sgr_name } };
                    populateSearchOptions('sgr', sgrdata);

                    var ledata = { 'le': { 'id': res[0].le_code, 'name': res[0].le_name } };
                    populateSearchOptions('le', ledata);

                    var codriaSpan = document.getElementById('codria_span');
                    var radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = 'codria';
                    radio.id = 'codria' + res[0].CODRIA;
                    radio.value = res[0].CODRIA;
                    radio.checked = true;
                    codriaSpan.appendChild(radio);

                    document.querySelector('.codria_class').style.display = 'block';
                }
            }
        };

        xhr.send('searchType=fetchCodriaBasedDetails&codria=' + cval);
    } else {
        document.getElementById('loading_wrap').style.display = 'none';
        alert("Please enter a valid reference number..!");
    }
});

// Function to populate SGR and LE dropdowns
function populateSearchOptions(type, data) {
    var select = document.getElementById('select' + type + '_code');
    select.options.length = 0;

    var defaultOption = document.createElement('option');
    defaultOption.text = 'None';
    select.add(defaultOption);

    for (var key in data[type]) {
        if (data[type].hasOwnProperty(key)) {
            var option = document.createElement('option');
            option.value = data[type][key].id;
            option.text = data[type][key].name;
            select.add(option);
        }
    }
}

// Function to reset the form and reload the page
function sgrLeReset() {
    document.getElementById('CF10').reset();
    setTimeout(function() {
        location.reload(true);
    }, 1000);
}

// Handle SubmitCFDetailsTD button click
document.getElementById("SubmitCFDetailsTD").attachEvent('onmousedown', function() {
    var closeComment = document.getElementById("closeComment").value;

    if (closeComment === '') {
        alert("Please enter comments..!");
    } else {
        var selectc3Value = document.getElementById('selectc3').options[document.getElementById('selectc3').selectedIndex].value;
        if (selectc3Value === 'None') {
            alert("Please select a user/usergroup to transfer the CAA/PAA..!");
        } else {
            var xhr = new ActiveXObject("Microsoft.XMLHTTP");
            xhr.open('POST', 'dbe_cfl_user_accessTransferSave.php', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var data = eval('(' + xhr.responseText + ')');

                    if (data.id == 'success') {
                        document.getElementById("htmldiv").innerHTML = "Successfully Updated..!";
                        document.getElementById("htmldiv").className = 'tddiv greendiv';
                        alert("Successfully updated..!");
                        sgrLeReset();
                    } else {
                        document.getElementById("htmldiv").innerHTML = "Failed to update file transfer. Please check with Admin Team.";
                        document.getElementById("htmldiv").className = 'tddiv reddiv';
                        alert("Failed to update file transfer. Please check with Admin Team.");
                    }
                }
            };

            var codTypeValue = document.querySelector('input[name=codType]:checked').value;
            var codriaValue = document.querySelector('input[name=codria]:checked').value;

            var data = "searchType=saveUserAccessTransferComment" +
                       "&sub_group_code=" + document.getElementById('selectsgr_code').value +
                       "&le_code=" + document.getElementById('selectle_code').value +
                       "&CF_Level=" + codTypeValue +
                       "&codUsr=" + document.getElementById('codusr').value +
                       "&codria=" + codriaValue +
                       "&usergroup=" + document.getElementById('selectc3').value +
                       "&user=" + document.getElementById('selectc2').value +
                       "&closeComment=" + closeComment;
            xhr.send(data);
        }
    }
});