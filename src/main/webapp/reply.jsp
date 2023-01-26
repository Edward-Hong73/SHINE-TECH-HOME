<%@ page contentType="text/html; charset=UTF-8" %>
<jsp:useBean id="bean" class="ez.lsp.boards.BoardBean" scope="session"/>
<%
		  String nowPage = request.getParameter("nowPage");
		  String subject = bean.getSubject();
		  String content = bean.getContent(); 
%>
<html>
<head>
<title>JSPBoard</title>
<link href="style.css" rel="stylesheet" type="text/css">
</head>
<body bgcolor="#c2ffbd">
<div align="center">
<br><br>
 <table width="600" cellpadding="3">
  <tr height="45">
   <td bgcolor="#CCCC00" height="21" align="center"><font size="5"><b>답변하기</b></font></td>
  </tr>
</table>
<form method="post" action="boardReply" >
<table width="600" cellpadding="7">
 <tr>
  <td>
   <table>
    <tr height="35">
     <td width="20%">성 명</td>
     <td width="80%">
	  <input name="name" size="30" maxlength="20"></td>
    </tr>
    <tr height="35">
     <td>제 목</td>
     <td>
	  <input name="subject" size="50" value="&#8627; 답변 : <%=subject%>" maxlength="50"></td> 
    </tr>
	<tr height="35">
     <td>내 용</td>
     <td>
	  <textarea name="content" rows="12" cols="50">
 <%=content %>
 ===============================================
 RE:
      	</textarea>
      </td>
    </tr>
    <tr height="35">
     <td>비밀 번호</td> 
     <td>
	  <input type="password" name="pass" size="15" maxlength="15"></td> 
    </tr>
    <tr>
     <td colspan="2" height="5"><hr/></td>
    </tr>
	<tr> 
     <td align="center" colspan="2">
	  <input type="submit" value="답변등록" >
      <input type="reset" value="다시쓰기">
      <input type="button" value="뒤로" onClick="history.back()"></td>
    </tr> 
   </table>
  </td>
 </tr>
</table>
 <input type="hidden" name="ip" value="<%=request.getRemoteAddr()%>" >
 <input type="hidden" name="nowPage" value="<%=nowPage%>">
 <input type="hidden" name="ref" value="<%=bean.getRef()%>">
 <input type="hidden" name="pos" value="<%=bean.getPos()%>">
 <input type="hidden" name="depth" value="<%=bean.getDepth()%>">
</form> 
</div>
</body>
</html>