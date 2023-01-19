
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String cid = request.getParameter("cid");
	String pwd = request.getParameter("pwd");
%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>로그인 및 회원가입</title>
		<style>
			body {line-height: 300%}
		</style>
	</head>
	<body>
		<div >
			<h1>로그인 및 회원가입</h1>
			<form name="loginform" action="loginpost" method="POST" encType="UTF-8">
				<label>아이디: <input type="text" name="cid" value="<%=cid%>" placeholder="ID를 입력하세요."></label><br>
				<label>비밀번호: <input type="password" name="pwd" value="<%=pwd%>" placeholder="비밀번호를 입력하세요."></label><br>
				<input type="submit" value="로그인">
				<input type="reset" value="다시입력">
				<a href='customerinsert.html'>회원가입</a>
			</form>
		</div>
	</body>
</html>