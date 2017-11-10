export const googleUsernameStep = `
<form>
    <input class="whsOnd zHQkBf" jsname="YPqjbf" autocomplete="username" spellcheck="false" tabindex="0"
    aria-label="E-Mail oder Telefonnummer" name="identifier" id="identifierId" dir="ltr" data-initial-dir="ltr"
    data-initial-value="" type="email">
    <input name="hiddenPassword" jsname="RHeR4d" class="yb9KU" tabindex="-1" aria-hidden="true" type="password">
    <input class="whsOnd zHQkBf" jsname="YPqjbf" autocomplete="off" spellcheck="false" tabindex="0"
    aria-label="Geben Sie den Text ein, den Sie hören oder sehen" name="ca" id="ca" dir="ltr" data-initial-dir="ltr"
    data-initial-value="" type="text">
    <input jsname="SBlSod" name="ct" id="ct" type="hidden">
</form>
`;

export const googlePasswordStep = `
<form>
    <input id="hiddenEmail" class="cNPTrc" name="identifier" spellcheck="false" aria-hidden="true"
    value="" readonly="" autocomplete="off" type="email">
    <input class="whsOnd zHQkBf" jsname="YPqjbf" autocomplete="current-password" spellcheck="false"
    tabindex="0" aria-label="Passwort eingeben" name="password" autocapitalize="off" autocorrect="off" dir="ltr"
    data-initial-dir="ltr" data-initial-value="" type="password">
    <input class="whsOnd zHQkBf" jsname="YPqjbf" autocomplete="off" spellcheck="false" tabindex="0"
     aria-label="Geben Sie den Text ein, den Sie hören oder sehen" name="ca" id="ca" dir="ltr" data-initial-dir="ltr"
     data-initial-value="" type="text">
    <input jsname="SBlSod" name="ct" id="ct" type="hidden">
</form>
`;

export const facebookLogin = `
<form id="login_form">
					<input class="inputtext" name="email" id="email" tabindex="1" data-testid="royal_email" type="email">
					<input class="inputtext" name="pass" id="pass" tabindex="2" data-testid="royal_pass" type="password">
  				<input value="Log In" tabindex="4" data-testid="royal_login_button" id="u_0_2" type="submit">
</form>`;

export const amazonLogin = `
<form name="signIn">
    <input name="appActionToken" value="sdfg" type="hidden">
    <input name="appAction" value="SIGNIN" type="hidden">
    <input name="openid.pape.max_auth_age" value="ape:sdfg==" type="hidden">
    <input name="openid.return_to" value="ape:5j5fsdth=" type="hidden">
    <input name="prevRID" value="ape:h5sfgthfg=" type="hidden">
    <input name="openid.identity" value="ape:serf=" type="hidden">
    <input name="openid.assoc_handle" value="ape:waer" type="hidden">
    <input name="openid.mode" value="ape:gaw==" type="hidden">
    <input name="openid.ns.pape" value="ape:guligui==" type="hidden">
    <input name="prepopulatedLoginId" type="hidden">
    <input name="failedSignInCount" value="ape:MA==" type="hidden">
    <input name="openid.claimed_id" value="ape:hsergfdg=" type="hidden">
    <input name="pageId" value="ape:dXNmbGV4" type="hidden">
    <input name="openid.ns" value="ape:ztdnsfg=" type="hidden">
    <input maxlength="128" id="ap_email" name="email" tabindex="1"
     class="a-input-text a-span12 auth-autofocus auth-required-field" type="email">
    <input name="create" value="0" type="hidden">
    <input id="ap_password" name="password" tabindex="2"
    class="a-input-text a-span12 auth-required-field" type="password">
    <input id="signInSubmit" tabindex="5" class="a-button-input"
    aria-labelledby="a-autoid-0-announce" type="submit">
    <input name="rememberMe" value="true" tabindex="4" type="checkbox">
    <i class="a-icon a-icon-checkbox">
</form>
`;

export const wikipediaLogin = `
<form class="mw-htmlform mw-ui-vform mw-ui-container"
action="/w/index.php?title=Special:UserLogin&amp;returnto=Main+Page" method="post" name="userlogin">
    <input id="wpName1" name="wpName" size="20" class="loginText mw-ui-input"
    placeholder="Enter your username" tabindex="1" required="" autofocus="">
    <input id="wpPassword1" name="wpPassword" size="20" class="loginPassword mw-ui-input"
     placeholder="Enter your password" tabindex="2" required="" type="password">
    <input name="wpRemember" value="1" id="wpRemember" tabindex="3" type="checkbox">
    <input id="wpEditToken" value="+\\" name="wpEditToken" type="hidden">
    <input value="Special:UserLogin" name="title" type="hidden">
    <input name="authAction" value="login" type="hidden">
    <input name="force" type="hidden">
    <input name="wpLoginToken" value="erhae4zerz+\\" type="hidden">
    <input name="wpForceHttps" value="1" type="hidden">
    <input name="wpFromhttp" value="1" type="hidden">
</form>
`;

export const twitterLogin = `
<form action="https://twitter.com/sessions" class="t1-form clearfix signin js-signin" method="post">
    <input class="js-username-field email-input js-initial-focus" name="session[username_or_email]"
    autocomplete="on" value="" placeholder="Telefon, E-Mail oder Nutzername" type="text">
    <input class="js-password-field" name="session[password]" placeholder="Passwort" type="password">
    <input value="21f1681439ec1e45edee1c0ab2a106726b83cd24" name="authenticity_token" type="hidden">
    <input name="ui_metrics" autocomplete="off" value="qw3poeijqlwiked" type="hidden">
    <input name="scribe_log" type="hidden">
    <input name="redirect_after_login" value="" type="hidden">
    <input value="21f1681439ec1e45edee1c0ab2a106726b83cd24" name="authenticity_token" type="hidden">
    <input value="1" name="remember_me" checked="checked" type="checkbox">
</form>
`;

export const instagramLogin = `
<form class="_3jvtb">
    <input class="_ph6vk _o716c" aria-describedby="" aria-label="Telefonnummer, Benutzername oder E-Mail-Adresse"
    aria-required="true" autocapitalize="off" autocorrect="off" maxlength="30" name="username"
    placeholder="Telefonnummer, Benutzername oder E-Mail-Adresse" value="" type="text">
    <input class="_ph6vk _o716c" aria-describedby="" aria-label="Passwort" aria-required="true"
    autocapitalize="off" autocorrect="off" name="password" placeholder="Passwort" value="" type="password">
</form>
`;

export const ebayLogin = `
<form name="SignInForm" id="SignInForm" method="post" class="mgn20">
	<input name="bcv" id="awer" value="dfgh" type="hidden">
	<input name="refId" id="refId" value="" type="hidden">
	<input name="regUrl" id="regUrl" value="https://reg.ebay.com/reg/P...;rv4=1" type="hidden">
	<input name="MfcISAPICommand" id="MfcISAPICommand" value="SignInWelcome" type="hidden">
	<input name="bhid" id="bhid" value="sfdaf~" type="hidden">
	<input name="UsingSSL" value="1" type="hidden">
	<input name="inputversion" id="inputversion" value="2" type="hidden">
	<input name="lse" id="lse" value="false" type="hidden">
	<input name="lsv" id="lsv" value="" type="hidden">
	<input name="mid" id="mid" value="AQAAAV+ujianwfkeuj+uHiuSGTb+k*" type="hidden">
	<input name="kgver" id="kgver" value="1" type="hidden">
	<input name="kgupg" id="kgupg" value="1" type="hidden">
	<input name="kgstate" id="kgstate" value="" type="hidden">
	<input name="omid" id="omid" value="" type="hidden">
	<input name="hmid" id="hmid" value="" type="hidden">
	<input name="rhr" id="rhr" value="f" type="hidden">
	<input name="srt" id="srt" value="jiklarewt" type="hidden">
	<input name="siteid" value="0" type="hidden">
	<input name="co_partnerId" value="2" type="hidden">
	<input name="ru" id="ru" value="http://my.ebay.com/ws/eBayISAPI.dll?MyEbayBeta&amp;MyEbay=&amp;gbh=1&amp;guest=1" type="hidden">
	<input name="pp" id="pp" value="" type="hidden">
	<input name="pa1" value="" type="hidden">
	<input name="pa2" value="" type="hidden">
	<input name="pa3" value="" type="hidden">
	<input name="i1" value="-1" type="hidden">
	<input name="pageType" value="3984" type="hidden">
	<input name="rtmData" value="PS=T.0" type="hidden">
	<input name="usid" id="usid" value="wfe" type="hidden">
	<input name="rqid" id="rqid" value="wöiko3rwer" type="hidden">
	<input name="afbpmName" value="sess1" id="afbpmId" type="hidden">
	<input name="kgct" id="kgct" value="" type="hidden">
	<input size="40" maxlength="64" name="userid_otp" id="userid_otp" autocapitalize="off" autocorrect="off"
	placeholder="Enter username or email"
	aria-describedby="We'll text you a code to confirm it's your number. Your mobile provider may charge you." class="fld" type="text">
	<input name="sgnBt" value="Continue" id="sgnBtn" class="btn ipb btn-prim sgnBtn" type="button">
	<input value="Text me a code" id="sgn-otp-conf" class="btn ipb btn-prim sgnBtn" type="button">
	<input size="40" maxlength="6" name="otp" id="otp" autocapitalize="off" autocorrect="off"
	placeholder="Enter code" autocomplete="off" class="fld" type="text">
	<input value="Sign In" id="sgn-btn-otp" class="btn ipb btn-prim sgnBtn" type="button">
	<input name="keepMeSignInOption3" value="1" id="signed_in3" class="hdn" checked="checked" type="checkbox">
	<input size="40" maxlength="64" name="userid" id="userid" autocapitalize="off" autocorrect="off"
	placeholder="Email or username" spellcheck="false" class="fld" type="text">
	<input size="40" maxlength="64" name="pass" id="pass" autocapitalize="off" autocorrect="off"
	placeholder="Password" class="fld" spellcheck="false" type="password">
	<input name="sgnBt" value="Sign in" id="sgnBt" class="btn ipb btn-prim sgnBtn" type="submit">
	<input name="keepMeSignInOption2" value="1" id="signed_in2" class="hdn" checked="checked" type="checkbox">
	<input value="1" name="keepMeSignInOption" id="signInKMSITextbox" type="hidden">
	<input id="htmid" name="htmid" value="slwaegrue" type="hidden">
</form>
`;
