<?php
// Uncomment the following line for debugging
// ini_set("display_errors", 1);

include "dbe_gbl_Common.inc";
include_once "common/dbe_gbl_Functions.php";

$LocationVar = "dbe_tdo_BankingAdministrator.php";

$link_id = DbConnect($default_dbname);
if(!$link_id) {
    die("Connection could not be established");
}

$cFun = new CommonFunctions($link_id);

$userid = $_COOKIE["userid"] ?? '';
$CF_Level = 'SGR'; // Default CF Level

if (isset($_POST['firstVisit'])) {
    $firstVisit = $_POST['firstVisit'];
    $codUsr = $_POST['codUsr'];
    $todo_type = $_POST['todo_type'];
    $codgrp = $_POST['codgrp'];
    $CF_Level = $_POST['CF_Level'];
} else {
    $firstVisit = '';
    $codUsr = $_GET['codUsr'] ?? '';
    $todo_type = $_GET['todo_type'] ?? '';
    $codgrp = $_GET['codgrp'] ?? '';
}

$Codof = $cFun->getAllRights($codUsr, $codgrp, 'F');
$codeArray = array_map(function($ele) {
    return '"' . strtok($ele, "*") . '"';
}, $Codof);

$user_and_group = NameGroup($userid);
list($namuser, $fname, $profile_description) = explode('#', $user_and_group);

// HTML output starts here
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modify Currency</title>
    <script src="./common/dbe_gbl_tools.js"></script>
    <script src="./common/dbe_jquery-3.5.0.js"></script>
    <script src="dbe_cfl_ModifyCurrency.js"></script>
    <style>
        #loading_wrap {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background: url('../images/widget-loader-lg-en.gif') 50% 50% no-repeat rgb(249,249,249);
            background-size: 100px;
            opacity: .8;
        }
        input[type=submit] {
            background: url(../images/Button_Ok.gif) no-repeat;
            cursor: pointer;
            border: none;
            width: 100%;
            height: 100%;
            position: relative;
            float: right;
        }
        .greendiv { color: green; }
        .tddiv {
            text-align: center;
            font-weight: bold;
        }
        .reddiv { color: red; }
    </style>
</head>
<body>
    <?php HtmlHeader($userid, $codUsr, $todo_type, $codgrp); ?>

    <form name="CF10" id="CF10" align='center' style="width: 100%;">
        <input type="hidden" name="firstVisit" id="firstVisit" value="<?php echo htmlspecialchars($firstVisit); ?>">
        <input type="hidden" name="codUsr" id="codUsr" value="<?php echo htmlspecialchars($codUsr); ?>">
        <input type="hidden" name="todo_type" id="todo_type" value="<?php echo htmlspecialchars($todo_type); ?>">
        <input type="hidden" name="codgrp" id="codgrp" value="<?php echo htmlspecialchars($codgrp); ?>">
        <input type="hidden" name="CF_Level" id="CF_Level" value="<?php echo htmlspecialchars($CF_Level); ?>">

        <table width="65%" align='center' border="0" cellspacing="0" cellpadding="0">
            <tr bgcolor="#FFFFFF" class="BgWhite"><td colspan="5">&nbsp;</td></tr>
            <tr bgcolor="#FFFFFF" class="BgWhite"><td colspan="5">&nbsp;</td></tr>
            <tr bgcolor="#FFFFFF" valign="top" align="center">
                <td colspan="4">
                    <br>
                    <table>
                        <tr>
                            <?php echo DisplayApplicationTitle("../images/Title_CF_ModifyCurrency.gif")?>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF" class="BgWhite"><td colspan="5">&nbsp;</td></tr>
            <tr bgcolor="#FFFFFF" class="BgWhite"><td colspan="5">&nbsp;</td></tr>
            <tr><td colspan="5" class='tddiv'><span id='htmldiv'></span></td></tr>
            <tr class="BgPaleOrange"><td height="13" colspan="5" class="SubHeading">Counterparty</td></tr>
            <tr bgcolor="#FFCC99" id="SGR_SEC">
                <td height="28" class="BodyText" width="25%" align="left" nowrap>Sub-group Code:&nbsp;&nbsp;</td>
                <td height="28" class="BodyText" width="45%">
                    <input type="text" name="txtsgr_code" id="txtsgr_code" size="12" maxlength="8" class="BodyText" onchange="inputfieldsearch(this.id);">
                </td>
                <td width="15%" height="31" class="BodyText" align="right" nowrap>Sub-group Name:</td>
                <td width="45%" height="31" class="BodyText" id="subgroupname_id">
                    <input type="text" name="txtsgr_name" id="txtsgr_name" size="40" maxlength="40" class="BodyText" onchange="inputfieldsearch(this.id);">
                </td>
                <td>
                    <div id="sgr_reset" style="display:none;">
                        <a href="javascript:sgrLeReset('sgr');">
                            <img src="../images/Button_Reset.gif" border="0" alt="Reset">
                        </a>
                    </div>
                </td>
            </tr>
            <tr class="BgPaleYellow">
                <td colspan="5">
                    <table border="0" cellspacing="0" cellpadding="0" align="center" height="100">
                        <tr>
                            <td class="BodyText">
                                <fieldset>
                                    <legend><strong>Select Option</strong></legend>
                                    <input type="radio" name="codType" value="SGR" id="ONLYSGR" onclick="javascript:setCF_GroupLevel('sgr');" checked> <label for="ONLYSGR">Sub-group</label>
                                    <input type="radio" name="codType" value="LE" id="ONLYLE" onclick="javascript:setCF_GroupLevel('le')"> <label for="ONLYLE">LE</label>
                                </fieldset>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr valign="top" bgcolor="#FFFFFF">
                <td height="50" class="BodyText" colspan="5">
                    <table width="27%" border="0" cellspacing="0" cellpadding="0" align="center" height="108">
                        <tr>
                            <td class="BodyText" height="88">
                                <br>
                                <fieldset>
                                    <legend><strong>Credit File</strong></legend>
                                    <input type="radio" id="codtype_cdt_26" name="codtype_cdt" value="26" disabled onclick="javascript:getCFdetails(26)">
                                    <label for="codtype_cdt_26">Active Credit File</label><br>
                                    <input type="radio" id="codtype_cdt_25" name="codtype_cdt" value="25" disabled onclick="javascript:getCFdetails(25)">
                                    <label for="codtype_cdt_25">Credit File on Creation</label><br>
                                </fieldset>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF"><td colspan="5">&nbsp;</td></tr>
            <tr valign="top" bgcolor="#FFFFFF" style='text-align:center;'>
                <td height="50" class="BodyText">&nbsp;</td>
                <td class="BodyText" colspan="5">
                    <table border="0" cellpadding="2" cellspacing="2">
                        <tr valign="middle" align="center" bgcolor="#FFFFFF">
                            <td class="BodyText" width="21%" style="background-color:#99CCFF; height: 21px;">Old Currency</td>
                            <td align="left" class="BodyText" nowrap>
                                <span name="oldcurrency" id="oldcurrency" style="font-weight:bold;"></span>
                            </td>
                        </tr>
                        <tr bgcolor="#FFFFFF"><td colspan="2" class="BodyText">&nbsp;</td></tr>
                        <tr valign="middle" align="center" bgcolor="#FFFFFF">
                            <td class="BodyText" width="21%" style="background-color:#99CCFF;">New Currency</td>
                            <td align="left" class="BodyText" nowrap>
                                <select name="newcurrency" id="newcurrency" style="font-size: 10px; color: #000000; text-align: left;"></select>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF"><td colspan="4" class="BodyText">&nbsp;</td></tr>
            <tr bgcolor="#FFFFFF">
                <td align="center" colspan="4" class="BodyText">
                    <textarea name="closeComment" id="closeComment" cols="85" rows="5" maxlength="150" placeholder='Please provide your comments here..!'></textarea>
                </td>
            </tr>
            <tr bgcolor="#FFFFFF"><td colspan="4" class="BodyText" height="13">&nbsp;</td></tr>
            <tr align="center" valign="middle">
                <td colspan="5">
                    <input type="image" id="savecurrency" src="../images/Button_Ok.gif" alt="Save">&nbsp;&nbsp;
                    <a href="<?php echo $LocationVar ?>?codUsr=<?php echo urlencode($codUsr) ?>&todo_type=<?php echo urlencode($todo_type)?>&codgrp=<?php echo urlencode($codgrp)?>">
                        <img src="../images/Button_Cancel.gif" style='position:relative' border="0" alt="Cancel">
                    </a>
                </td>
            </tr>
            <tr><td colspan="5">&nbsp;</td></tr>
        </table>
    </form>
    <div id='loading_wrap'></div>
    <script>
        // Initialize your JavaScript here
        document.addEventListener('DOMContentLoaded', function() {
            // Your initialization code goes here
        });
    </script>
</body>
</html>
