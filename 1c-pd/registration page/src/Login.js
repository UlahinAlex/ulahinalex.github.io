/* $Id$ */

function showDomainListHelp()
{
    document.getElementById('showDomainDetails').style.display='block';// No I18N
}

function closeDomainList()
{
    document.getElementById('showDomainDetails').style.display='none';// No I18N
}

function decryptPassword(encPassword)
{
    var str_out = "";
    var num_out = encPassword;
    for(i = 0; i < num_out.length; i += 2)
    {
        num_in = parseInt(num_out.substr(i,[2])) + 23;
        num_in = unescape('%' + num_in.toString(16));// No I18N
        str_out += num_in;
    }
    var textPassword = unescape(str_out);
    return textPassword ;
}

// SD-11880 to list domain name(s) for local authentication, When user login as Local Authentication.
function checkLocalAuth(domainname)
{
    // SD-11880 checking to list domain name(s) for the user login as local authentication
    if(document.login.domain.value=="Local Authentication")
    {
        loadLocalAuthDomainNameList();  
		document.getElementById("AUTHRULE_NAME").value = "RememberMeLoginModule";//NO I18N
    } else if(document.login.domain.value==="LDAP") {////NO I18N
		document.getElementById("AUTHRULE_NAME").value = "LDAPLoginModule";//NO I18N
		document.getElementById("LocalAuthLabel").innerHTML = "";
        document.getElementById("LocalAuthdomainname").style.display="none";
	} else {
		document.getElementById("AUTHRULE_NAME").value = "SDRelationalLoginModule";//NO I18N
		document.getElementById("LocalAuthLabel").innerHTML = "";
        document.getElementById("LocalAuthdomainname").style.display="none";
    }
}
function loadEntireDomainNameList()
{
	if(document.login.dname.options.length > 1) //SD-67654 For Domain dropdown will not be shown if no domains available in the application.
    {
    var domainLabel=document.getElementById("LocalAuthLabel"); //NO I18N
    // domainLabel.innerHTML="<div class='pt10'><label class='domaininfo cursor-hand'><span> (?)</span>"+
    // "<div class='alert alert-info' role='alert'><span class='msg'>Username specified is available in more than one domain or not in any domain. Kindly select the appropriate Domain or \"Not in Domain\" from the list to login in</span></div></label></div>"; // No I18N
    document.getElementById("LocalAuthdomainname").style.display="block";
    document.forms.login.DomainCount.value = document.login.dname.options.length;
    jQuery('select[name="dname"]').select2();
 }
}
// SD-11880 Only for Local Authentication. Its listing domain name(s) from aaalogin table for the user to login as local authentication.
function loadLocalAuthDomainNameList()
{
    var reqName = document.login.j_username.value;
    //SD 59848 fix
    reqName=encodeURIComponent(reqName);
    if ((reqName!=null))
    {
        var dte = Date();
        url = "/domainServlet/AJaxDomainServlet?action=searchLocalAuthDomain&timestamp="+dte+"&search="+reqName; // No I18N
        if (window.XMLHttpRequest)
        {
            req = new XMLHttpRequest();
            if(req)
            {
                try
                {
                    // sd-11880 waiting process state to list domain name(s) for AD User to login as Local Authentication.
                    req.onreadystatechange = processStateForLocalAuthDomain;
                    req.open("GET", url, false);//NO I18N
                } catch (e)
                {
                    alert(e);
                }
                req.send(null);
            }
        }
        else if (window.ActiveXObject)
        {
            try
            {
                req = new ActiveXObject("Msxml2.XMLHTTP");//NO I18N
            }catch(e)
            {
                //alert("ee "+e);
                req = new ActiveXObject("Microsoft.XMLHTTP");//NO I18N
            }

            if (req)
            {
                // sd-11880 waiting process state to list domain name(s) for AD User to login as Local Authentication.
                req.onreadystatechange = processStateForLocalAuthDomain;
                try
                {
                    req.open("GET", url, false);//NO I18N
                }catch(e)
                {
                    alert(e);
                }
                req.send(null);
            }
        }
    }
}
// sd-11880 To list domain name(s) for local authentication.listing domain name(s) from aaalogin table based on login name. Only for local authentication.Following user can login with this 1. Not in Domain for manually added user. 2. AD imported user can login as local Authentication. 3. User can login as local authentication when user imported using Ad and domain name(s) is deleted in domaininfo.
function processStateForLocalAuthDomain()
{
    if (req.readyState == 4) // if value is 4, then it is Ready State.
    {
        if (req.status == 200) // if 200 - success , returned with a object.
        {
            var value = req.responseText;
            if(value === "showAllDomains")
            {
                loadEntireDomainNameList();
            }
            else
            {
            if ((value!='null') && (value!="Not in Domain"))//sd-11880 don't show for domain name(s) list when no domain for the user.
            {
                var domainList=value;
                var mytool_array=domainList.split("|");//NO I18N
                                //sd-11880 domain list does not show if only one domain for the user.
                if(mytool_array.length==1)
                {
                    domainLabel=document.getElementById("LocalAuthLabel");

                    domainLabel.innerHTML="<input type='hidden' name='dlabel' readonly='true' value='"+encodeHTML(mytool_array[0])+"'>"; // No I18N
                    var doname=document.getElementById("LocalAuthdomainname");
            doname.style.display="block";
                    doname.innerHTML="<input type='hidden' name='dname' readonly='true' value='"+encodeHTML(mytool_array[0])+"'>"; // No I18N
                    document.forms['login'].DomainCount.value=1;
                }
                else // sd-11880 listing domain when more than a domain for the user.
                {
                    domainLabel=document.getElementById("LocalAuthLabel"); //NO I18N
                    //sd-11880 label to identify the local authentication.
    //                 domainLabel.innerHTML="<div class='pt10'><label class='domaininfo cursor-hand'><span> (?)</span>"+
    // "<div class='alert alert-info' role='alert'><span class='msg'>Username specified is available in more than one domain or not in any domain. Kindly select the appropriate Domain or \"Not in Domain\" from the list to login in</span></div></label></div>"; // No I18N
                    var doname=document.getElementById("LocalAuthdomainname");
                    doname.style.display="block";
                    var innerHTMLContent="<div class='login-user-focus pt20'><div class='input-group'> <span class='input-group-addon email-label'><span class='login-globe1-icon'></span></span><select class='form-control' name='dname'>"; // No I18N
                    for (var pos=0;pos<mytool_array.length;pos++)
                    {

                        innerHTMLContent=innerHTMLContent+"<option value="+pos+">"+encodeHTML(mytool_array[pos])+"</option>"; // No I18N
                        document.forms['login'].DomainCount.value=pos+1;//NO I18N
                    }
                    doname.innerHTML=innerHTMLContent+"</select></div></div>"; //NO I18N
                    jQuery('select[name="dname"]').select2();
                    // +<a href='javascript:void(0);' onClick='showDomainListHelp();'><img src='images/spacer.gif' align='absmiddle' class='helptool-icon-thumb' border='0' /></a>";//NO I18N
                }
            }
            else //sd-11880 to avoid For Domain list for local authentication when no domain for the user
            {
                document.forms['login'].DomainCount.value=0;
            }
        }
        }
        else
        {
            jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = "Error while fetching domain"; //No I18n
            jQuery('#errorMsg').slideDown('slow'); //NO I18n        alert("Error while fetching domain");//No I18n
        }
    }
}

function loadDomainListForADLogin(username)
{
    // sd-11880 Only login for AD Authentication. Here checking AD enable is true And dynamic user addition is false. Listing domain name(s) based on aaalogin,sduser,domaininfo and the domain should be public.
    var reqName = username.value;
    //SD 59848 fix
    reqName=encodeURIComponent(reqName);
    if ((reqName!=null) && (document.login.AdEnable.value=='true' || (isMSP && (document.login.LDAPEnable.value=='true'))) && (document.login.dynamicUserAddition_status.value=='false'))
    {
        var dte = Date();
        var accountCookieIndex = document.cookie.indexOf("cli="); 
        if(isMSP && accountCookieIndex!=-1){
            var index1 = accountCookieIndex + 4;
            var string  = document.cookie.substring(index1);
            var index2 = string.indexOf(";");
            var accountId = string.substring(0,index2);
            url="/msp/servlet/MSPAjaxServlet?action=searchDomain&timestamp="+dte+"&search="+reqName+"&persistentAccountId="+accountId;//NO I18N
        }
        else{
        url = "/domainServlet/AJaxDomainServlet?action=searchDomain&timestamp="+dte+"&search="+reqName;//NO I18N
        }
        if (window.XMLHttpRequest)
        {
            req = new XMLHttpRequest();
            if(req)
            {
                try
                {
                    // sd-11880 waiting process state to list domain name(s) for AD User to login as AD authentication.
                    req.onreadystatechange = processStateADDomain;
                    req.open("GET", url, false);//NO I18N
                } catch (e)
                {
                    alert(e);
                }
                req.send(null);
            }
        }
        else if (window.ActiveXObject)
        {
            try
            {
                req = new ActiveXObject("Msxml2.XMLHTTP");//NO I18N
            }catch(e)
            {
                //alert("ee "+e);
                req = new ActiveXObject("Microsoft.XMLHTTP");//NO I18N
            }

            if (req)
            {
                // sd-11880 waiting process state to list domain name(s) for AD User to login as AD authentication
                req.onreadystatechange = processStateADDomain;
                try
                {
                    req.open("GET", url, false);//NO I18N
                }catch(e)
                {
                    alert(e);
                }
                req.send(null);
            }
        }
    }
    else
    {
        if ((document.login.AdEnable.value=='false') && (document.login.LDAPEnable.value=='false'))
        {
            // sd-11880 listing domain name(s) when AD enbable is false. to list domain name from aaalogin.
            loadLocalAuthDomainNameList()
        }
    }

}
//sd-11880 listing domain name(s) for AD Imported User login as AD Authentication.
//20776,20795
function processStateADDomain()
{
    if (req.readyState == 4)
    {
        if (req.status == 200)
        {
            var value = req.responseText;
            if ((value=='null'))
            {
                if (document.login.localAuthEnable.value=='true') // sd-11880 The user is not in AD. local authentication will be added to domain list to user to select Local Authentication.
                {
                    document.forms['login'].domain.options.length = 0;
                    document.forms['login'].domain.options[0] = new Option(document.getElementById("LocalAuthentication").innerHTML,"Local Authentication");//NO I18N
                    jQuery('select[name="domain"]').select2();
                    loadLocalAuthDomainNameList()
                }
                else
                {
                    // sd-11880 -Domain not Found- when the user is not imported By AD and The local authentication is false.
                    document.forms['login'].domain.options.length = 0;//NO I18N
                    document.forms['login'].domain.options[0] = new Option(document.getElementById("NoDomain").innerHTML,0);//No I18n
                    jQuery('select[name="domain"]').select2();
                }

            }
            else if(value!="showAllDomains") //SD 63193 fix
            {
                // sd-11880 listing domain name(s) for AD authentication.
                var domainList=value;
                var mytool_array=domainList.split("|");//NO I18N
                document.forms['login'].domain.options.length = 0;
                document.forms['login'].domain.options[0] = new Option(document.login.choosedomain.value,0);//NO I18N

                var bolNotInDomain=false;
                for (var pos=0;pos<mytool_array.length;pos++)
                {
                    if (mytool_array.length==1) //sd-11880 the choose domain will be overwritten by the domain name when only one domain for the user.
                    {
                        document.forms['login'].domain.options[pos] = new Option(mytool_array[pos],pos);//NO I18N
                    }
                    else
                    {
                        document.forms['login'].domain.options[pos+1] = new Option(mytool_array[pos],pos+1);//NO I18N
                    }
                    document.forms['login'].DomainCount.value=pos+1;//NO I18N
                }
                if(document.login.localAuthEnable.value=='true') //sd-11880 Local Authentication won't show when Local authentication is false.
                {
                    if (mytool_array.length==1)//sd-11880 the choose domain will be overwritten by the domain name when only one domain for the user.
                    {
                        document.forms['login'].domain.options[pos] = new Option(document.getElementById("LocalAuthentication").innerHTML,"Local Authentication");//NO I18N
                    }
                    else
                    {
                        document.forms['login'].domain.options[pos+1] = new Option(document.getElementById("LocalAuthentication").innerHTML,"Local Authentication");//NO I18N
                    }
                }
                jQuery('select[name="domain"]').select2();
            }


        }
        else
        {
            jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = "Error while fetching domain"; //No I18n
            jQuery('#errorMsg').slideDown('slow'); //NO I18n        alert("Error while fetching domain");//No I18n
        }
    }
}


function checkForNullInLogin(btn,form)
{
    if(document.login.j_username.value == "" || document.login.j_password.value == "")
    {
        jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = document.getElementById("jserror").innerHTML;
        jQuery('#errorMsg').slideDown('slow'); //NO I18N
        if(document.login.j_username.value=="")
        {
            document.login.j_username.focus();
        }
        else
        {
            document.login.j_password.focus();
        }
        return false;
    }
	else if( document.login.CAPTCHA_TEXT != undefined && document.login.CAPTCHA_TEXT.value == "" )
	{
        jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = document.getElementById('empty_captcha').innerHTML;
        jQuery('#errorMsg').slideDown('slow'); //NO I18N
		document.login.CAPTCHA_TEXT.focus();
		return false;
	}

    /*
     * Opertions to be performed for Domain List
     */
    if (document.login.AdEnable.value=='true' || (isMSP && document.login.LDAPEnable.value == 'true'))
    {
        var domainList="";
        if (document.login.domain.value=="Local Authentication" || document.login.domain.value== "-- Choose Domain --") //No internationalization
        {
            domainList =document.login.domain.value ;
        }
        else
        {
            domainList = document.login.domain.options[document.login.domain.selectedIndex].text;
        }
        if((domainList!=""))
        {

            if((domainList == "") || (domainList==document.getElementById('choosedomain').value) || (domainList=="-- Choose Domain --") || (domainList=="-Domain not Found-"))
            {
                jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = document.getElementById('choosedomain').value;
                jQuery('#errorMsg').slideDown('slow'); //NO I18N
                document.login.domain.focus();
                return false;
            }
            var count=document.forms['login'].DomainCount.value;//NO I18N
        }
        // sd-11880 To login AD user. Domain_name is created when the user choose domain name. not in domain for login as local authentication.
        var domainvalue="";
        if (document.login.domain.value=="Local Authentication")
        {
            domainvalue =document.login.domain.value ;
        }
        else
        {
            domainvalue = document.login.domain.options[document.login.domain.value].text;
        }
        document.login.logonDomainName.value=domainvalue;
        //sd-11880 The domain list will be overwritten when dynamic user addition is false.
        if (document.login.dynamicUserAddition_status.value=='false')
        {
            if ((domainvalue!="Local Authentication")) //sd-11880 The user can login as AD authentication.
            {
                createDomain_NameForLogin(domainvalue);
                document.forms['login'].LocalAuthWithDomain.value=domainvalue;//NO I18N
                document.forms['login'].LocalAuth.value="No";//NO I18N
            }
            else
            {
                // sd-11880 The user can login as local authentication.
                var count=document.forms['login'].DomainCount.value;//NO I18N
                if(count != 0)          //SD-72857
                {
                    document.forms['login'].LocalAuth.value="yes";//NO I18N
                    if(count==1)
                    {
                        domainvalue=document.login.dname.value;

                    }
                    else
                    {
                        domainvalue=document.login.dname.options[document.login.dname.value].text;

                    }

                    //if (domainvalue!="Not in Domain")//sd-11880 No need to create domain_name for manually added user. if Not in domain shows in domain list, it means the user is added by manually.
                    //{
                    createDomain_NameForLogin(domainvalue);
                    document.forms['login'].LocalAuthWithDomain.value=domainvalue;//NO I18N
                    //}
                }

            }
        }
        else
        {

            //sd-11880 Here domain name(s) added in domain list when Login.jsp is created. The user can login with AD authentication as well as local authenticaion.
            if(domainvalue!='Local Authentication') // sd-11880 When user login with AD Authentication.
            {
                createDomain_NameForLogin(domainvalue);
                document.forms['login'].LocalAuthWithDomain.value=domainvalue;//NO I18N
                document.forms['login'].LocalAuth.value='No';//NO I18N
            }
            else //sd-11880 When user login as local authentication.
            {

                var count=document.forms['login'].DomainCount.value;//NO I18N

                if (count!=0)
                {
                    if(count==1)
                    {
                        domainvalue=document.login.dname.value;
                    }
                    else
                    {
                        domainvalue=document.login.dname.options[document.login.dname.value].text;
                    }

                    createDomain_NameForLogin(domainvalue);
                    document.forms['login'].LocalAuthWithDomain.value=domainvalue;//NO I18N
                    document.forms['login'].LocalAuth.value='No';//NO I18N
                }
            }
        }
    }
    //20405 unable to login via local authentication, if LDAP is enabled and also AD is imported.
    else if(document.login.LDAPEnable.value == 'true')
    {
        var domainList = document.login.domain.value;
        if(domainList == "-- Choose Domain --" || domainList == "")
        {
            jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = document.getElementById('choosedomain').value;
            jQuery('#errorMsg').slideDown('slow'); //NO I18N
            return false;
        }
        var count=document.forms['login'].DomainCount.value;//NO I18N
        if (count!=0)
        {
            if(count==1)
            {
                domainvalue=document.login.dname.value;
            }
            else
            {
                domainvalue=document.login.dname.options[document.login.dname.value].text;
            }
            createDomain_NameForLogin(domainvalue);
            document.forms['login'].LocalAuthWithDomain.value=domainvalue;//NO I18N
            document.forms['login'].LocalAuth.value='No';//NO I18N
        }
    }
    else//sd-11880 only for local authentication.
    {
        var count=document.forms['login'].DomainCount.value;//NO I18N
        if (count!=0)
        {

            if(count==1)
            {
                domainvalue=document.login.dname.value;
            }
            else
            {
                domainvalue=document.login.dname.options[document.login.dname.value].text;
            }
            createDomain_NameForLogin(domainvalue);
            document.forms['login'].LocalAuthWithDomain.value=domainvalue;//NO I18N
            document.forms['login'].LocalAuth.value='No';//NO I18N
        }
    }

    //setting the value of AUTHRULE_NAME which is used PamImpl.Validate() method
    if(document.login.AdEnable.value==='true') {
        document.getElementById("AUTHRULE_NAME").value="SDRelationalLoginModule";//No I18N
    } else if(document.login.LDAPEnable.value === 'true') {
        document.getElementById("AUTHRULE_NAME").value="LDAPLoginModule";//No I18N
    } else {
        document.getElementById("AUTHRULE_NAME").value="RememberMeLoginModule";//No I18N
    }
    /* ## To convert username to lowercase ## */
    document.login.username.value=document.login.username.value.toLowerCase();
    setTimeout(function(){jQuery(btn).button('loading');},10);
    return true;
}

function getOldSSOCookie()
{
    document.login.j_username.value="";
    init = (document.cookie).indexOf("username");
    if(init != -1 )
    {
        userlen = "username".length;//NO I18N
        beginIndex = ((document.cookie).indexOf("username")+userlen);
        endIndex = (document.cookie).indexOf(";",beginIndex);
        if(endIndex == -1)
        {
            endIndex = (document.cookie).length;
        }
        username=(document.cookie).substring(beginIndex+1,endIndex);

        startIndex = ((document.cookie).indexOf("password")+"password".length);//NO I18N
        endInd = (document.cookie).indexOf(";",startIndex);
        var encPassword=(document.cookie).substring(startIndex+1,endInd);
        password = decryptPassword(encPassword);

        var ssoStart = ((document.cookie).indexOf("singlesignon")+"singlesignon".length);//NO I18N
        var ssoEnd = (document.cookie).indexOf(";",ssoStart);
        if(ssoEnd == -1)
        {
            ssoEnd=(document.cookie).length;
        }
        var singlesignon = (document.cookie).substring(ssoStart+1,ssoEnd);

        document.login.j_username.value=username.toLowerCase();
        document.login.j_password.value=password;
        document.login.checkbox.checked=false;

        /**********
         *  If domainList is available, cookie will be set
         ************/
        domainList = document.login.domain;
        if(domainList!=null)
        {
            domainStartIndex = ((document.cookie).indexOf("domainname")+"domainname".length);//NO I18N
            domainEndIndex = (document.cookie).indexOf(";",domainStartIndex);

            if(domainEndIndex == -1)
            {
                domainEndIndex=(document.cookie).length;
            }
            domain=(document.cookie).substring(domainStartIndex+1,domainEndIndex);
            if (domain=="Local Authentication")
            {
                localDomainStartIndex = ((document.cookie).indexOf("localAuthWithDomain")+"localAuthWithDomain".length);//NO I18N
                localDomainEndIndex = (document.cookie).indexOf(";",localDomainStartIndex); //NO I18N

                if(localDomainEndIndex == -1)
                {
                    localDomainEndIndex=(document.cookie).length;
                }
                localAuthDomain=(document.cookie).substring(localDomainStartIndex+1,localDomainEndIndex);
                if (localAuthDomain=="Not in Domain")
                {
                    document.forms['login'].LocalAuthWithDomain.value="No";//NO I18N
                    document.forms['login'].LocalAuth.value='Yes';//NO I18N
                }
                else
                {
                    document.forms['login'].LocalAuthWithDomain.value=localAuthDomain;//NO I18N
                    createDomain_NameForLogin(localAuthDomain);
                    document.forms['login'].LocalAuth.value='Yes';//NO I18N
                }

            }
            var domainCount = domainList.length;
            for(i=0; i<domainCount; i++)
            {
                var data="";
                if (document.login.domain.options[i].value=="Local Authentication")
                {
                    data="Local Authentication";//NO I18N
                }
                else
                {
                    data = document.login.domain.options[i].text;
                }
                if(data == domain)
                {

                    if (data!="Local Authentication")
                    {
                        createDomain_NameForLogin(domain);
                    }
                    document.login.logonDomainName.value=data;
                    document.login.domain.options[i].selected = true;
                    break
                }
            }
        }
        else
        {
            localDomainStartIndex = ((document.cookie).indexOf("localAuthWithDomain")+"localAuthWithDomain".length);//NO I18N
            localDomainEndIndex = (document.cookie).indexOf(";",localDomainStartIndex);

            if(localDomainEndIndex == -1)
            {
                localDomainEndIndex=(document.cookie).length;
            }

            localAuthDomain=(document.cookie).substring(localDomainStartIndex+1,localDomainEndIndex);
            //SD-13897 Checking for manually added user. After clear the cookies localauthwithDomain is cleard.
            if ((localAuthDomain=="Not in Domain") || ((document.cookie).indexOf("localAuthWithDomain")==-1))
            {
                document.forms['login'].LocalAuthWithDomain.value="No";//NO I18N
                document.forms['login'].LocalAuth.value='Yes';//NO I18N
            }
            else
            {
                document.forms['login'].LocalAuthWithDomain.value=localAuthDomain;//NO I18N
                createDomain_NameForLogin(localAuthDomain);
                document.forms['login'].LocalAuth.value='Yes';//NO I18N
            }
        }
        //************ End of DomainList Operation
        if(singlesignon=="true" && username!="" && password!="")
        {
            document.login.checkbox.checked=true;
            document.login.submit();

        }
    }
    else
    {
        //document.login.j_username.focus();
    }
}

function getSSOCookie(uName, pwd, domain)
{
    var init = (document.cookie).indexOf("username");

    if( uName != null && uName != "" )
    {
        document.login.checkbox.checked=false;
        document.login.j_username.value=uName;
        document.login.j_password.value=pwd;
        if( domain != null && domain != "-" )
        {
            createDomain_NameForLogin(domain);
        }
        document.login.checkbox.checked=true;
        document.login.submit();
    }
    else if( init != -1 )
    {
        document.getElementById("login_form").style.display="none";//NO I18N
        getOldSSOCookie();// For Migration case.
    }
    else
    {
	//SD-66008 Login page landing issue in SSO fixed.
        //document.getElementById("loginDiv").style.display="table";//NO I18N
        document.login.j_username.focus();
    }
}

// sd-11880 DOMAIN_NAME will be created for AD authentication and local authentication with domain based. No need to create the domain_name object for user added by manually.
function createDomain_NameForLogin(domainvalue)
{
    if(domainvalue != null && domainvalue == 'Not in Domain')//NO I18N
    {
        domainvalue = "-";//NO I18N
    }
    var doname=document.getElementById("domainname");
    var DOMAINNAME=document.createElement("input");
    DOMAINNAME.setAttribute("name","DOMAIN_NAME");//NO I18N
    DOMAINNAME.setAttribute("type","hidden");//NO I18N
    DOMAINNAME.setAttribute("value",domainvalue);//NO I18N
    doname.appendChild(DOMAINNAME);
}

function hideLoginInfo() {
    jQuery.ajax({
            url: "sd/HideLogin.sd",
            success: function(result) {
                jQuery('#loginInfo').slideUp('slow'); //NO I18N
            }
        });
}

function loadLogin(isSSOEnabled, username, junkVal, domainname) {
    if(!isSSOEnabled) {
        getSSOCookie(username, junkVal, domainname);
        domainList = document.login.domain;
        if(domainList!=null) {
            var domainCount = domainList.length;
            //if(domainCount <=3 && domainCount > 1) {
            if(domainCount <=3 && domainCount > 1) {
                domainList[1].selected = true;
                //SD 63711 fix - Hide domain list when only 1 domain present with Local Authentication disabled
                if(domainCount==2){
                    hideDomainList();
                }
            }
            else {
                var cookieDomain = document.login.domain.selectedIndex;
                if(cookieDomain != 0 && loginError != "true"){
                   hideDomainList();
                }
            }
        }
    }
    else {
        if( logged_user != null && logged_domain != null ) {
            logged_user = logged_user.toLowerCase();
            document.login.j_username.value = logged_user;
            document.login.logonDomainName.value = logged_domain;
        document.login.j_password.value = '********';//NO I18N
            createDomain_NameForLogin(logged_domain);
            //Method changed to get since sso was not working in IE
            //document.login.method = "get";//NO I18N
            document.login.submit();
        }
    }
}

function hideShowDomainList() {
    if(document.getElementById("domainListSelect").style.display=="block") {
        hideDomainList();
    }
    else {
        showDomainList();
    }
}

function hideDomainList() {
    var selectedDomain = document.login.domain.selectedIndex;
    document.getElementById("domainListText").style.display="none";//NO I18N
    //document.getElementById("domainListBlankText").style.display="block";//NO I18N

    document.getElementById("domainListSelect").style.display="none";//NO I18N
    document.getElementById("domainListBlankSelect").style.display="block";//NO I18N

    var optionMsg = document.getElementById("moreOptionsMsg").innerHTML + " &gt;";//NO I18N
    document.getElementById("optionMsg").innerHTML = optionMsg;//NO I18N
}

function showDomainList() {
    document.getElementById("domainListText").style.display="block";//NO I18N
    //document.getElementById("domainListBlankText").style.display="none";//NO I18N

    document.getElementById("domainListSelect").style.display="block";//NO I18N
    document.getElementById("domainListBlankSelect").style.display="none";//NO I18N

    var optionMsg ="&lt; " +  document.getElementById("moreOptionsMsg").innerHTML;//NO I18N
    document.getElementById("optionMsg").innerHTML = optionMsg;
}

function ShowHide(divId) {
    var id = document.getElementById(divId);
    if (id.style.display == "none") {
        id.style.display = '';//NO I18N
    }
    else {
        id.style.display = 'none';//NO I18N
    }
}

function getCustomHtml(login_logo,prodName,prodLink,prodVersion,cssClass){
    $.ajax({
        url: '/custom/login/Login.html',
        async: false,
        dataType: 'html',//No I18N
        type: 'GET',//No I18N
        cache:false,
        success: function(response) {
            if (cssClass == "display:none") {
                window.onload(function() {
                    jQuery('html').css('background', '');
                });
            }
            var newDiv = $('<div></div>');
            var outerResponse = $('<div id="login_form" style="'+cssClass+'"></div>');

            if(response.indexOf("{{login_image}}") !== -1){
                var loginImage = '<img src="'+login_logo+'" class="log-logo" title="ServiceDesk Plus">';
                response = response.replace("{{login_image}}",loginImage);
            }
            outerResponse.html(response);
            newDiv.html(outerResponse);

            var prodNameAndLinkElement = $(newDiv).find('[name="productDetails"]');
            prodNameAndLinkElement.attr({
                href: prodLink,
                title: prodName
            });

            if (response.indexOf("{{product_name}}") === -1 && response.indexOf("{{product_version}}") === -1) {
                prodNameAndLinkElement.html(prodName + " &nbsp; " + prodVersion);
            } else {
                if (response.indexOf("{{product_version}}") !== -1) {
                    prodNameAndLinkElement.html((prodNameAndLinkElement.html()).replace("{{product_version}}", "") + prodVersion);
                }
                if (response.indexOf("{{product_name}}") !== -1) {
                    prodNameAndLinkElement.html((prodNameAndLinkElement.html()).replace("{{product_name}}", prodName));
                }
            }

            $html = newDiv.html();
            if($html.indexOf("{{login_form}}") !== -1){
                $html = $html.replace("{{login_form}}",$("#tempLoginFormDiv").html());
                $("#tempLoginFormDiv").remove();
                $("#loginFormDiv").before($html);

            }else{
                $('#loginFormDiv').html(newDiv.html());
                newDiv.remove();
                replaceLoginFormData();
            }
        }
    });

}

function replaceLoginFormData(){

    //if the element id "loginFormDiv" is available
    if($("#loginFormDiv").length){
        $("#loginFormDiv").html($("#tempLoginFormDiv").html());
        $("#tempLoginFormDiv").remove();
    }else{      
    //if the element id "loginFormDiv" is not available then the form is loaded in the centre of the page
        var formElement = $('[name="login"]');
        formElement.attr("class","alignpagecenter");
        var htmlAndFormContent = $('#loginFormDiv').html() + $("#tempLoginFormDiv").html();
        $("#loginFormDiv").html(htmlAndFormContent);
        $("#tempLoginFormDiv").remove();
    }
}


function LoginAs(user)
{
    // var elementID = this.attr('id');
    if(user == "admin")
    {
        if($('#adminuser').length)
        {
            document.login.j_username.value = $('#adminuser').val();
            jQuery('#username').change();
            document.login.j_password.value = $('#adminuser').val();
            if(noDomain())
            {
                jQuery('#loginSDPage').trigger('click');
            }
            else
            {
                jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = "Select your Domain";
                jQuery('#errorMsg').slideDown('slow');
            }
        }
        else
        {
            document.login.j_username.value = "administrator";
            jQuery('#username').change();
            jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = "Enter your InstanceID as password";
            jQuery('#errorMsg').slideDown('slow');
            document.login.j_password.focus();
        }
    }
    else if(user == "guest")
    {
        if($('#guestuser').length)
        {
            document.login.j_username.value = $('#guestuser').val();
            jQuery('#username').change();
            document.login.j_password.value = $('#guestuser').val();
            if(noDomain())
            {
                jQuery('#loginSDPage').trigger('click');
            }
            else
            {
                jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = "Select your Domain";
                jQuery('#errorMsg').slideDown('slow');
            }
        }
        else
        {
            document.login.j_username.value = "guest";
            jQuery('#username').change();
            jQuery('#errorMsg').find('span[class="msg"]')[0].innerHTML = "Enter your InstanceID as password";
            jQuery('#errorMsg').slideDown('slow');
            document.login.j_password.focus();
        }
    }
}
function noDomain()
{
    var localDomain = "none";
   if($('#LocalAuthdomainname').length > 0)
   {
       localDomain = $('#LocalAuthdomainname').css('display');
       dname = $(document.forms.login.dname).css('display');
   }
   var Domain = "none"
   if($('#domainListSelect').length > 0)
   {
       Domain = $('#domainListSelect').css('display');
   }
   if(Domain === 'block')
   {
        return false;
   }
   if(localDomain === 'block')
   {
        if(dname === 'none')
        {
            return true;
        }
        return false;
   }

    return true;
}
