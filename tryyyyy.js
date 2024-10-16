document.attachEvent("onreadystatechange", function() {
    if (document.readyState === "complete") {
        // Fetch all currencies using XMLHttpRequest (replace jQuery $.ajax)
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                var newCurrencyDropdown = document.getElementById("newcurrency");
                
                for (var i = 0; i < data.length; i++) {
                    var option = document.createElement("option");
                    option.value = data[i].CODCUR;
                    option.text = data[i].CODCUR + " - " + data[i].SHNCUR;
                    newCurrencyDropdown.appendChild(option);
                }
            }
        };
        xhr.send("searchType=fetchAllCurrency");
    }
});

// Save form/currency changes
document.getElementById("savecurrency").attachEvent("onmousedown", function() {
    document.getElementById("loading_wrap").style.display = "block";

    // Prevent enter key default action
    document.getElementById("savecurrency").attachEvent("onkeydown", function(e) {
        var key = e.which || e.keyCode;
        if (key == 13) e.returnValue = false;
    });

    var oldCurrency = document.getElementById("oldcurrency").innerHTML;
    var newCurrency = document.getElementById("newcurrency").value;
    var closeComment = document.getElementById("closeComment").value;
    
    if (oldCurrency !== '' && oldCurrency === newCurrency) {
        alert("Warning! Old and new currencies are the SAME. Please choose a different currency.");
        document.getElementById("htmldiv").innerHTML = "Warning! Old and new currencies are SAME. Please choose different currency.";
        document.getElementById("htmldiv").className = "reddiv";
        return;
    } else if (closeComment === '') {
        alert("Please provide your comments.");
        document.getElementById("htmldiv").innerHTML = "Please provide your comments.";
        document.getElementById("htmldiv").className = "reddiv";
        return;
    }

    // Perform the save using XMLHttpRequest
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.id == 'success') {
                document.getElementById("htmldiv").innerHTML = "Successfully updated.";
                document.getElementById("htmldiv").className = "greendiv";
                setTimeout(function() {
                    location.reload(true);
                }, 1000);
            } else {
                document.getElementById("htmldiv").innerHTML = "Failed to update Currency conversion. Please check with Admin Team.";
                document.getElementById("htmldiv").className = "reddiv";
                alert("Failed to update Currency conversion. Please check with Admin Team.");
            }
        }
    };

    var data = "searchType=saveCurrency" +
               "&sub_group_code=" + document.getElementById("selectsg_code").value +
               "&le_code=" + document.getElementById("selectle_code").value +
               "&CF_Level=" + document.getElementsByName("codTypeCdt")[0].value +
               "&codUsr=" + document.getElementById("codUsr").value +
               "&codtype_cdt=" + document.getElementsByName("codtype_cdt")[0].value +
               "&oldcurrency=" + oldCurrency +
               "&newcurrency=" + newCurrency +
               "&closeComment=" + closeComment;

    xhr.send(data);
});