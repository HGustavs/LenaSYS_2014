		<!-- Overlay -->

  <div id="overlay" style="display:none"></div>
  
	<!-- Login Box Start! -->
  <div id='loginBox' class="loginBox" style="display:none; width: 295px;">
		<div id='login'>
			<div class='loginBoxheader'>
				<h3>Login</h3>
				<div class="cursorPointer" onclick="closeWindows()">x</div>
			</div>
			<form action="" id="loginForm" method="post">
				<table class="loginBoxTable">			
					<tr>	
						<td>
							<label id="loginBoxTitle">Sign in</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="username" placeholder="Username" class='form-control textinput' type='text' autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</td>
					</tr>
					<tr>
						<td>
							<input id="password" placeholder="Password" class='form-control textinput' type='password' style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</td>
					</tr>
					<tr>
						<td class="nowrap">
							<label class='text forgotPw' onclick='toggleloginnewpass();'>Forgot Password?</label>
						</td>
					</tr>
					<tr>
						<td>
							<input type='button' class='buttonLoginBox' onclick="processLogin();" value='Login'>
						</td>
					</tr>
					<tr>
						<!-- Message displayed when using wrong password or username -->
						<td id="message";></td>
					</tr>
				</table>
			</form>		
		</div>
		<div id='newpassword' style="display:none">
			<div class='loginBoxheader'>
				<h3> Reset Password</h3>
				<div class="cursorPointer" onclick="closeWindows()">x</div>
			</div>
			<div style='padding: 20px;'>
				<table class="loginBoxTable">			
					<tr>	
						<td>
							<label id="loginBoxTitle">Enter your username to reset the password</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="username" placeholder="Username" class='form-control textinput' type='text' autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</td>
					</tr>
					<tr>
						<td>
							<input type='button' class='buttonLoginBox' onclick="processResetPasswordCheckUsername();" value='Continue' style='margin-top: 10px;'>
						</td>
					</tr>
					<tr>
						<!-- Message displayed when using wrong password or username -->
						<td id="message2";></td>
					</tr>
				</table>
			</div>
			<tr>	
				<td>
					<label class='forgotPw' onclick='toggleloginnewpass();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
				</td>	
			</tr>
		</div>
		<div id='showsecurityquestion' style="display:none">
			<div class='loginBoxheader'>
				<h3> Reset Password</h3>
				<div class="cursorPointer" onclick="closeWindows()">x</div>
			</div>
			<div style='padding: 20px;'>
				<table class="loginBoxTable">			
					<tr>	
						<td>
							<label id="loginBoxTitle">Please answer your security question</label>
						</td>
					</tr>
					<tr>
						<td style='padding-top: 14px;'>
							<label style='font-size: 14px;'> Question: </label>
							<label id="displaysecurityquestion" class="text">Placeholder question</label>
						</td>
					</tr>
					<tr>
						<td>							
							<input id="answer" class='form-control textinput' type='password' placeholder="Answer" autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</td>
					</tr>
					<tr>
						<td>
							<input type='button' class='buttonLoginBox' onclick="processResetPasswordCheckSecurityAnswer();" value='Check answer' style='margin-top: 10px;'>
						</td>
					</tr>
					
					<tr>
						<!-- Message displayed when using wrong password or username -->
						<td id="message3";></td>
					</tr>
				</table>
			</div>			
			<tr>	
				<td>
					<label class='forgotPw' onclick='toggleloginnewpass();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
				</td>	
			</tr>
			
		</div>
		<div id='resetcomplete' style="display:none">
			<div class='loginBoxheader' id="completeid">
				<h3>Request complete</h3>
				<div class='cursorPointer' onclick="closeWindows()">x</div>
			</div>
			<div style='padding: 20px;'>
				<table class="loginBoxTable">	
					<tr>
						<td>
							<p style='font-size: 0.8em;'>Your teachers have been notified, a new password will be sent to your school email as soon as possible.</p>
							<p style='font-size: 0.8em;'>You can change your password later in the profile page.</p>
						</td>
					</tr>
					<tr>
						<td>
							<input type='button' class='buttonLoginBox' onclick="closeWindows();" value='Ok!' style='margin-top: 10px;'>
						</td>
					</tr>
				</table>
			</div>	
		</div>
	</div>
	<!-- Login Box End! -->
    
  <!-- Security question notifaction -->
    <div class="loginBox" id="securitynotification" style="display:none;">
         <div class='loginBoxheader'>
          <h3>Choose a challenge question</h3>
          <div class='cursorPointer' onclick="closeWindows(); setSecurityNotifaction('off');">x</div>
        </div>  
        <p id="securitynotificationmessage">You need to choose a challenge question. You can do this by visiting your profile page (clicking your username) or by clicking <a onclick="closeWindows(); setSecurityNotifaction('off');" href='profile.php'>here</a> </p>
    </div>
  <!-- Security question notification END -->
  
  <!-- Session expire message -->
  <div class="expiremessagebox" style="display:none">
    <div class='loginBoxheader'>
      <h3>Alert</h3>
      <div class='cursorPointer' onclick="closeWindows()">x</div>
    </div>
    <p id="expiremessage">Your session will expire in about 30 minutes. Refresh session ?</p>
    <input type="button" id="expiremessagebutton" class="submit-button" onclick="closeWindows(); refreshUserSession()" value="Refresh">
  </div>

  <div class="endsessionmessagebox" style="display:none">
    <div class='loginBoxheader'>
      <h3>Alert</h3>
      <div onclick="closeWindows(); reloadPage()">x</div>
    </div>
    <p id="endsessionmessage">Your session has timed out.</p>
    <input type="button" id="endsessionboxbutton" onclick="closeWindows(); processLogout();" value="OK">
  </div>
  <!-- Session expire message END -->