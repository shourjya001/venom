document.getElementById('selectc2').onchange = function () {
    var obj_select3 = document.forms['CF10'].elements['selectc3'];
    var mapstr = document.getElementById('selectc2').value;
    var selectmapstr = document.getElementById('selectc3').value;

    if (mapstr !== '') {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = eval('(' + xhr.responseText + ')');
                obj_select3.innerHTML = '';

                if (mapstr === 'None') {
                    var option = document.createElement('option');
                    option.text = 'None';
                    obj_select3.add(option);
                }

                if (document.querySelectorAll('#selectc2 option[value="None"]').length === 0) {
                    var noneOption = document.createElement('option');
                    noneOption.value = 'None';
                    noneOption.text = 'None';
                    document.getElementById('selectc2').add(noneOption);
                    document.querySelector('#selectc2 option[value=""]').remove();
                }

                for (var i = 0; i < res.usersdata.length; i++) {
                    var usr = res.usersdata[i];
                    var sup = document.createElement('option');
                    sup.value = usr.USERGRP;
                    sup.setAttribute('data-mapping', usr.USERGRP);
                    sup.text = usr.GRPNAME;
                    obj_select3.add(sup);
                }
            }
        };
        xhr.send("searchType=fetchUsersdetails&name=" + mapstr + "&codria=" + document.querySelector('input[name="codria"]:checked').value + "&sub_group_code=" + document.getElementById('selectsgr_code').value);
    }
};

document.getElementById('codria_code').onchange = function () {
    var codriaSpan = document.getElementById('codria_span');
    codriaSpan.innerHTML = '';

    var cval = document.getElementById('codria_code').value;
    if (cval !== '' && cval !== undefined && cval !== 0) {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = eval('(' + xhr.responseText + ')');

                if (res.id === 'None') {
                    alert("Invalid reference number..!");
                    document.querySelector('.codria_class').style.display = 'none';
                } else if (res.id !== 'None') {
                    document.querySelector('.codria_class').style.display = 'block';
                    document.getElementById('codria_span').innerHTML += '<input type="radio" name="codria" id="codria' + res[0].CODRIA + '" value="' + res[0].CODRIA + '" checked="checked">' + res[0].CODRIA;

                    var sgrdata = { sgr: { id: res[0].sgr_code, name: res[0].sgr_name } };
                    populateSearchOptions('sgr', sgrdata);

                    var ledata = { le: { id: res[0].le_code, name: res[0].le_name } };
                    populateSearchOptions('le', ledata);
                }
            }
        };
        xhr.send("searchType=fetchCodriaBasedDetails&codria=" + cval);
    } else {
        alert("Please enter valid reference number..!");
    }
};

function populateSearchOptions(type, data) {
    var selectElemCode = document.getElementById('select' + type + '_code');
    var selectElemName = document.getElementById('select' + type + '_name');

    selectElemCode.innerHTML = '';
    selectElemName.innerHTML = '';

    for (var i = 0; i < data[type].length; i++) {
        var optionCode = document.createElement('option');
        var optionName = document.createElement('option');
        
        optionCode.value = data[type][i].id;
        optionCode.text = data[type][i].id;
        selectElemCode.add(optionCode);

        optionName.value = data[type][i].name;
        optionName.text = data[type][i].name;
        selectElemName.add(optionName);
    }
}

document.getElementById('fetchCFDetails').onmousedown = function () {
    if (document.querySelector('input[name="codria"]:checked').value !== '') {
        document.getElementById('loading_wrap').style.display = 'block';

        if (document.getElementById('codria').value !== '') {
            var codval = document.querySelector('input[name="codria"]:checked').value;
            var codriaElems = document.getElementsByName('codria');
            
            for (var i = 0; i < codriaElems.length; i++) {
                if (!codriaElems[i].checked) {
                    var label = document.querySelector('label[for="' + codriaElems[i].value + '"]');
                    if (label) label.remove();
                    codriaElems[i].remove();
                }
            }

            fetchUserDropdownDetails('codria', 'le');
            document.getElementById('loading_wrap').style.display = 'none';
        }
    } else {
        alert("Please select Reference Number/Codria");
    }
};

function fetchUserDropdownDetails(ctype, dtype) {
    var dtajson = {
        searchType: 'fetchLegalEntityBasedonID',
        sub_group_code: document.getElementById('selectsgr_code').value,
        codria: document.querySelector('input[name="codria"]:checked').value
    };

    if (dtype === 'le') {
        dtajson = {
            searchType: 'fetchLimitsBasedonCodria',
            sub_group_code: document.getElementById('selectsgr_code').value,
            le_code: document.getElementById('selectle_code').value,
            codria: document.querySelector('input[name="codria"]:checked').value
        };
    }

    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var res = eval('(' + xhr.responseText + ')');
            if (res) {
                getUserDropdownDetails(res);
            }
            document.getElementById('loading_wrap').style.display = 'none';
        }
    };
    xhr.send("searchType=" + dtajson.searchType + "&sub_group_code=" + dtajson.sub_group_code + "&codria=" + dtajson.codria);
}

function getUserDropdownDetails(res) {
    document.getElementById('sgrtable').style.display = 'block';
    document.getElementById('sgrspan').style.display = 'block';

    var strdata = '';
    for (var i = 0; i < res.length; i++) {
        strdata += '<tr><td>' + res[i].codria + '</td><td>' + res[i].codspm + '</td><td>' + res[i].spmname + '</td><td>' + res[i].lespm + '</td><td>' + res[i].cfstatus + '</td><td>' + res[i].octis + '</td><td>' + res[i].risk + '</td><td>' + res[i].sub + '</td><td>' + res[i].expdate + '</td></tr>';
    }
    document.getElementById('sgrtabledata').innerHTML = strdata;
}

document.getElementById('SubmitCFDetailsTD').onmousedown = function () {
    if (document.getElementById('closeComment').value === '') {
        alert("Please enter comments..!");
    } else if (document.getElementById('closeComment').value !== '' && document.getElementById('selectc3').value === 'None') {
        alert("Please select user/usergroup to transfer the CAA/PAA..!");
    } else {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = eval('(' + xhr.responseText + ')');
                if (res.id === 'success') {
                    document.getElementById('htmldiv').innerHTML = "Successfully Updated..!";
                    document.getElementById('CF10').reset();
                    setTimeout(function () {
                        location.reload(true);
                    },