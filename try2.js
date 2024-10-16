function getBasicDetails(type, codspm, codstatus) {
    if (typeof codstatus === 'undefined') {
        codstatus = '';
    }

    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    
    // Configure it: POST-request for the URL
    xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
    
    // Set the request header for form data
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Prepare the data to be sent
    var data = "searchType=fetchCFdetails&searchString=" + encodeURIComponent(codspm) + "&codstatus=" + encodeURIComponent(codstatus);

    // Set up the callback for when the request is complete
    xhr.onreadystatechange = function() {
        // Check if the request is complete
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // Check if the request was successful
            if (xhr.status === 200) {
                // Parse the JSON response
                var response = JSON.parse(xhr.responseText);

                if (response.id === 'None') {
                    $("input[name=codtype_cdt]").prop('checked', false).prop('disabled', true);
                    $('#oldcurrency').html('');
                    alert("No credit files available..1");
                } else if (response.id !== 'None') {
                    var first = 1;
                    var newarr = [25, 26]; // Assuming this array is for status codes

                    // Iterate through the response data
                    for (var i = 0; i < response.data.length; i++) {
                        var item = response.data[i];

                        // Update the array to remove the current CODSTATUS
                        newarr = newarr.filter(function(value) {
                            return value !== item.CODSTATUS;
                        });

                        if (first === 1) {
                            // Update Currency dropdown
                            $('#oldcurrency').html(item.CODCUR);
                            console.log(item.CODSTATUS + ' checked');

                            $("input[name=codtype_cdt][value='" + item.CODSTATUS + "']").prop("checked", true);
                            first++;
                        }

                        console.log(item.CODSTATUS + ' checked');
                        $("input[name=codtype_cdt][value='" + item.CODSTATUS + "']").prop('disabled', false);
                        console.log(item.CODSTATUS + ' disabled');
                    }

                    console.log(newarr);

                    if (newarr.length > 0 && codstatus === '') {
                        $("input[name=codtype_cdt][value='" + newarr[0] + "']").prop('disabled', true);
                    }
                }
            } else {
                // Handle error case
                console.error("Request failed with status: " + xhr.status);
                alert("An error occurred while processing your request. Please try again later.");
            }
        }
    };

    // Send the request with the data
    xhr.send(data);
}
