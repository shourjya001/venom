function init() {
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            document.getElementById("loading_wrap").style.display = "none"; // Hides the loading wrap

            // Form submit handling
            var form = document.getElementsByTagName('form')[0];
            form.onsubmit = function (e) {
                e.returnValue = false; // Prevent form from submitting normally

                var selectC3 = document.getElementById('selectc3');
                // Use the onchange property for IE5 compatibility
                selectC3.onchange = function () {
                    var mapstr2 = selectC3.options[selectC3.selectedIndex].value;
                    var subgroupmapstr2 = document.getElementById('selectc2').options[document.getElementById('selectc2').selectedIndex].value;

                    if (mapstr2 !== '' && subgroupmapstr2 !== 'None') {
                        // Use iframe to submit form for IE5 compatibility
                        var hiddenFrame = document.getElementById('hiddenFrame');
                        hiddenFrame.contentWindow.document.open();
                        hiddenFrame.contentWindow.document.write('<form id="hiddenForm" method="POST" action="dbe_cfl_user_accessTransferSave.php">' +
                            '<input type="hidden" name="searchType" value="' + mapstr2 + '">' +
                            '<input type="hidden" name="usergroup" value="' + subgroupmapstr2 + '">' +
                            '<input type="hidden" name="codria" value="' + document.querySelector("input[name='codria']:checked").value + '">' +
                            '<input type="hidden" name="sub_group_code" value="' + document.getElementById("selectsgr_code").value + '">' +
                            '</form>');
                        hiddenFrame.contentWindow.document.getElementById('hiddenForm').submit();
                        hiddenFrame.contentWindow.document.close();

                        // Handling success after form submission
                        hiddenFrame.onreadystatechange = function () {
                            if (hiddenFrame.readyState === "complete") {
                                var response = hiddenFrame.contentWindow.document.body.innerHTML;
                                var parsedResponse;
                                try {
                                    parsedResponse = JSON.parse(response);
                                } catch (e) {
                                    alert("Error parsing JSON response: " + e.message);
                                    return;
                                }

                                // Clear the selectc2 options and populate with new data
                                var selectC2 = document.getElementById('selectc2');
                                selectC2.innerHTML = '';

                                // Check if empty option exists
                                if (selectC2.options.length === 0) {
                                    var emptyOption = document.createElement("option");
                                    emptyOption.value = "";
                                    selectC2.appendChild(emptyOption);
                                }

                                var usergroupsdata = parsedResponse.usergroupsdata;
                                for (var i = 0; i < usergroupsdata.length; i++) {
                                    var usr = usergroupsdata[i];
                                    var option = document.createElement("option");
                                    option.value = usr.USERNAME;
                                    option.innerHTML = usr.NAME;
                                    option.setAttribute("data-username", usr.USERNAME);
                                    selectC2.appendChild(option);
                                }

                                // Sorting options alphabetically (for IE5)
                                var options = Array.prototype.slice.call(selectC2.options);
                                options.sort(function (a, b) {
                                    return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
                                });

                                // Emptying and re-adding sorted options
                                selectC2.innerHTML = '';
                                for (var i = 0; i < options.length; i++) {
                                    selectC2.appendChild(options[i]);
                                }
                            }
                        };
                    }
                };
            };
        }
    };
}

// Ensure this script runs once the DOM is ready, compatible with IE5
init();
