// Polyfill for Object.assign (already included)
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource !== undefined && nextSource !== null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var loadingWrap = document.getElementById('loading_wrap');
  if (loadingWrap) {
    loadingWrap.style.display = 'none';
  }

  var form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
    });
  }

  // Function to fetch all currencies (replace with your data source)
  function fetchAllCurrencies() {
    // Simulated data - replace with your actual data source
    var currencies = [
      { CODCUR: 'USD', SHNCUR: 'US Dollar' },
      { CODCUR: 'EUR', SHNCUR: 'Euro' },
      { CODCUR: 'GBP', SHNCUR: 'British Pound' }
    ];
    
    var newCurrencySelect = document.getElementById('newcurrency');
    currencies.forEach(function(item) {
      var option = document.createElement('option');
      option.value = item.CODCUR;
      option.textContent = item.CODCUR + ' - ' + item.SHNCUR;
      newCurrencySelect.appendChild(option);
    });
  }

  fetchAllCurrencies();

  var saveCurrencyBtn = document.getElementById('savecurrency');
  if (saveCurrencyBtn) {
    saveCurrencyBtn.addEventListener('mousedown', function(e) {
      if (loadingWrap) loadingWrap.style.display = 'block';

      var oldCurrency = document.getElementById('oldcurrency');
      var newCurrencySelect = document.getElementById('newcurrency');
      var closeComment = document.getElementById('closeComment');
      var htmlDiv = document.getElementById('htmldiv');

      if (oldCurrency && oldCurrency.textContent !== '') {
        var newCurVal = newCurrencySelect.value;

        if (oldCurrency.textContent === newCurVal && (newCurVal === '' || newCurVal === '')) {
          alert("Warning! Old and new currencies are SAME... Please choose different currency");
          if (htmlDiv) {
            htmlDiv.textContent = "Warning! Old and new currencies are SAME...Please choose different currency..1";
            htmlDiv.className = 'reddiv';
          }
        } else if (closeComment.value === '') {
          alert("Please provide your comments..1");
          if (htmlDiv) {
            htmlDiv.textContent = "Please provide your comments..1";
            htmlDiv.className = 'reddiv';
          }
        } else if (closeComment.value.length > 150) {
          alert("Please reduce your comments within 150 characters only..1");
          if (htmlDiv) {
            htmlDiv.textContent = "Please reduce your comments within 150 characters only..1";
            htmlDiv.className = 'reddiv';
          }
        } else {
          // Simulated save function (replace with your actual save logic)
          function simulateSave(data) {
            // Simulated successful save
            if (htmlDiv) {
              htmlDiv.textContent = "Successfully Updated..1";
              htmlDiv.className = 'tddiv greendiv';
            }
            alert("Successfully updated..1");
            setTimeout(function() {
              location.reload(true);
            }, 1000);
          }

          var saveData = {
            searchType: 'saveCurrency',
            sub_group_code: document.querySelector("#selectsgr_code").value,
            le_code: document.querySelector("#selectle_code").value,
            CF_Level: document.querySelector("input[name=codType]:checked").value,
            codUsr: document.getElementById("codUsr").value,
            codtype_cdt: document.querySelector("input[name=codtype_cdt]:checked").value,
            oldcurrency: oldCurrency.textContent,
            newcurrency: newCurrencySelect.value,
            closeComment: closeComment.value
          };

          simulateSave(saveData);
        }
      }

      if (loadingWrap) loadingWrap.style.display = 'none';
    });
  }
  function selectdropdown(s1, s2) {
    var s3 = s2 === 'code' ? 'name' : 'code';
    if (loadingWrap) loadingWrap.style.display = 'block';

    var select1 = document.getElementById('select' + s1 + '_' + s2);
    var select2 = document.getElementById('select' + s1 + '_' + s3);
    var grpid = select1.value;
    select2.value = grpid;

    getBasicDetails(s1, document.getElementById('select' + s1 + '_code').value, '');
    
    if (loadingWrap) loadingWrap.style.display = 'none';
  }

  function sgrLeReset(val) {
    if (loadingWrap) loadingWrap.style.display = 'block';
    if (val !== '') {
      restparams(val);
    }
    if (loadingWrap) loadingWrap.style.display = 'none';
  }

  function restparams(val) {
    var codeInput = document.createElement('input');
    codeInput.id = 'txt' + val + '_code';
    codeInput.name = 'txt' + val + '_code';
    codeInput.onchange = function() { inputfieldsearch(this.id); };

    var nameInput = document.createElement('input');
    nameInput.id = 'txt' + val + '_name';
    nameInput.name = 'txt' + val + '_name';
    nameInput.onchange = function() { inputfieldsearch(this.id); };

    var selectCode = document.getElementById('select' + val + '_code');
    var selectName = document.getElementById('select' + val + '_name');
    
    if (selectCode) selectCode.parentNode.replaceChild(codeInput, selectCode);
    if (selectName) selectName.parentNode.replaceChild(nameInput, selectName);

    var oldCurrency = document.getElementById('oldcurrency');
    if (oldCurrency) oldCurrency.textContent = '';

    var closeComment = document.getElementById('closeComment');
    if (closeComment) closeComment.value = '';

    var codtypeCdtInputs = document.querySelectorAll("input[name=codtype_cdt]");
    codtypeCdtInputs.forEach(function(input) {
      input.checked = false;
      input.disabled = true;
    });
  }

  function setCF_GroupLevel(grouptype) {
    if (loadingWrap) loadingWrap.style.display = 'block';

    var leSec = document.getElementById('LE_SEC');
    var sgrSec = document.getElementById('SGR_SEC');

    if (grouptype === 'sgr') {
      if (leSec) leSec.style.display = 'none';
      if (sgrSec) sgrSec.style.display = 'block';
      restparams('le');
    } else if (grouptype === 'le') {
      if (leSec) leSec.style.display = 'block';
      if (sgrSec) sgrSec.style.display = 'none';
      restparams('sgr');
    }

    if (loadingWrap) loadingWrap.style.display = 'none';
  }

  function inputfieldsearch(param) {
    if (loadingWrap) loadingWrap.style.display = 'block';

    var searchString, searchType, searchParam, stype;

    if (param === 'txtsgr_code' || param === 'txtsgr_name') {
      stype = 'sgr';
      if (param === 'txtsgr_code') {
        searchType = 'fetchSubGroupBasedonID';
        searchString = document.getElementById('txtsgr_code').value;
      } else {
        searchType = 'fetchSubGroupBasedonName';
        searchString = document.getElementById('txtsgr_name').value;
      }
    } else if (param === 'txtle_code' || param === 'txtle_name') {
      stype = 'le';
      if (param === 'txtle_code') {
        searchType = 'fetchLegalEntityBasedonID';
        searchString = document.getElementById('txtle_code').value;
      } else {
        searchType = 'fetchLegalEntityBasedonName';
        searchString = document.getElementById('txtle_name').value;
      }
    }

    if (searchType) {
      commonsearch(searchType, searchString, searchParam, stype);
    }

    if (loadingWrap) loadingWrap.style.display = 'none';
  }

  function commonsearch(searchType, searchString, searchParam, stype) {
    // Simulated data - replace with your actual data fetching logic
    var resultData = [
      { id: '001', name: 'Group 1' },
      { id: '002', name: 'Group 2' }
    ];

    if (resultData.length > 0) {
      var selectCode = document.createElement('select');
      selectCode.id = 'select' + stype + '_code';
      selectCode.onchange = function() { selectdropdown(stype, 'code'); };

      var selectName = document.createElement('select');
      selectName.id = 'select' + stype + '_name';
      selectName.onchange = function() { selectdropdown(stype, 'name'); };

      resultData.forEach(function(item) {
        var optionCode = document.createElement('option');
        optionCode.value = item.id;
        optionCode.textContent = item.id;
        selectCode.appendChild(optionCode);

        var optionName = document.createElement('option');
        optionName.value = item.id;
        optionName.textContent = item.name;
        selectName.appendChild(optionName);
      });

      var txtCode = document.getElementById('txt' + stype + '_code');
      var txtName = document.getElementById('txt' + stype + '_name');
      
      if (txtCode) txtCode.parentNode.replaceChild(selectCode, txtCode);
      if (txtName) txtName.parentNode.replaceChild(selectName, txtName);

      var resetBtn = document.getElementById(stype + '_reset');
      if (resetBtn) resetBtn.style.display = 'block';

      getBasicDetails(stype, resultData[0].id, '');
    } else {
      alert("No Matching Results Found... or You are not authorized to see this SGR/LE, please contact the Banking Administrator");
    }
  }

  function getBasicDetails(type, codspm, codstatus) {
    // Simulated data - replace with your actual data source
    var response = {
      id: 'Some ID',
      CODCUR: 'USD',
      CODSTATUS: '25'
    };

    if (response.id === 'None') {
      var codtypeCdtInputs = document.querySelectorAll("input[name=codtype_cdt]");
      codtypeCdtInputs.forEach(function(input) {
        input.checked = false;
        input.disabled = true;
      });

      var oldCurrency = document.getElementById('oldcurrency');
      if (oldCurrency) oldCurrency.textContent = '';

      alert("No credit files available..!");
    } else if (response.id !== 'None') {
      var oldCurrency = document.getElementById('oldcurrency');
      if (oldCurrency) oldCurrency.textContent = response.CODCUR;

      var statusInput = document.querySelector("input[name=codtype_cdt][value='" + response.CODSTATUS + "']");
      if (statusInput) {
        statusInput.checked = true;
        statusInput.disabled = false;
      }

      // Additional logic as needed
    }
  }

  // Initial setup
  getBasicDetails('initial', 'someDefaultValue', '');
});
