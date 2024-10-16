function commonsearch(searchType, searchString, searchParam, stype) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'dbe_cfl_ModifyCurrency_Save.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    // Prepare the data to send
    var params = 'searchType=' + encodeURIComponent(searchType) + 
                 '&searchString=' + encodeURIComponent(searchString);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resultData = JSON.parse(xhr.responseText);
            
            if (!resultData || resultData.length === 0) {
                alert("No matching results");
                document.getElementById('loading_wrap').style.display = 'none';
                return;
            }

            // Replace elements dynamically based on the response
            var selectdropdown = document.createElement('select');
            selectdropdown.id = 'select' + stype + '_code';
            selectdropdown.setAttribute('onchange', 'selectdropdown(\'' + stype + '\', \'code\')');

            var selectdropdown2 = document.createElement('select');
            selectdropdown2.id = 'select' + stype + '_name';
            selectdropdown2.setAttribute('onchange', 'selectdropdown(\'' + stype + '\', \'name\')');

            // Replace input fields with the new select dropdowns
            var txtCode = document.getElementById('txt' + stype + '_code');
            var txtName = document.getElementById('txt' + stype + '_name');
            txtCode.parentNode.replaceChild(selectdropdown, txtCode);
            txtName.parentNode.replaceChild(selectdropdown2, txtName);

            document.getElementById(stype + '_reset').style.display = 'block';

            // Append options to the dropdowns
            for (var i = 0; i < resultData.length; i++) {
                var item = resultData[i];

                var option1 = document.createElement('option');
                option1.value = item.id;
                option1.text = item.id;
                selectdropdown.appendChild(option1);

                var option2 = document.createElement('option');
                option2.value = item.id;
                option2.text = item.name;
                selectdropdown2.appendChild(option2);
            }

            // Append the dropdowns to their respective containers (if needed)
            var subgroupNameContainer = document.getElementById('subgroupname_id');
            if (subgroupNameContainer) {
                subgroupNameContainer.appendChild(selectdropdown);
                subgroupNameContainer.appendChild(selectdropdown2);
            }

            document.getElementById('loading_wrap').style.display = 'none';
        }
    };

    xhr.send(params);
}
