function commonsearch(searchType, searchString, searchParam, stype) {
    var xmlhttp;

    // Check for ActiveXObject (IE5) for XMLHttpRequest
    if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        alert("Your browser does not support XMLHTTP.");
        return;
    }

    // Set up callback for handling response
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log("Response Text: ", xmlhttp.responseText);  // Debugging line

            try {
                var resultData = JSON.parse(xmlhttp.responseText);  // Try to parse JSON

                if (resultData !== false) {
                    getBasicDetails(stype, resultData[0]['id'], '');

                    // Create select dropdown elements
                    var selectdropdown = document.createElement("select");
                    selectdropdown.id = "select" + stype + "_code";
                    if (selectdropdown.attachEvent) {
                        selectdropdown.attachEvent("onchange", function() { selectdropdownHandler(stype, 'code'); });
                    } else {
                        selectdropdown.addEventListener("change", function() { selectdropdownHandler(stype, 'code'); });
                    }

                    var selectdropdown2 = document.createElement("select");
                    selectdropdown2.id = "select" + stype + "_name";
                    if (selectdropdown2.attachEvent) {
                        selectdropdown2.attachEvent("onchange", function() { selectdropdownHandler(stype, 'name'); });
                    } else {
                        selectdropdown2.addEventListener("change", function() { selectdropdownHandler(stype, 'name'); });
                    }

                    // Replace existing text fields with dropdowns
                    var txtCode = document.getElementById("txt" + stype + "_code");
                    var txtName = document.getElementById("txt" + stype + "_name");
                    if (txtCode && txtName) {
                        txtCode.parentNode.replaceChild(selectdropdown, txtCode);
                        txtName.parentNode.replaceChild(selectdropdown2, txtName);
                    }

                    // Show reset button
                    var resetButton = document.getElementById(stype + "_reset");
                    if (resetButton) {
                        resetButton.style.display = "block";
                    }

                    // Populate the dropdowns
                    for (var i = 0; i < resultData.length; i++) {
                        var option1 = document.createElement("option");
                        option1.value = resultData[i].id;
                        option1.text = resultData[i].id;
                        selectdropdown.appendChild(option1);

                        var option2 = document.createElement("option");
                        option2.value = resultData[i].id;
                        option2.text = resultData[i].name;
                        selectdropdown2.appendChild(option2);
                    }

                    // Append dropdowns to the DOM
                    var subgroup = document.getElementById('subgroupname_id');
                    if (subgroup) {
                        subgroup.appendChild(selectdropdown);
                        subgroup.appendChild(selectdropdown2);
                    }

                    // Hide loading spinner
                    var loadingWrap = document.getElementById('loading_wrap');
                    if (loadingWrap) {
                        loadingWrap.style.display = 'none';
                    }
                } else {
                    alert("No match found.");
                }
            } catch (e) {
                console.error("JSON parsing error: ", e);  // Log the error
                alert("Error in response format.");
            }
        }
    };

    // Send the request
    xmlhttp.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("searchType=" + encodeURIComponent(searchType) + "&searchString=" + encodeURIComponent(searchString));
}