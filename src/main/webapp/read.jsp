<%@ page contentType="text/html; charset=UTF-8" %>
<%@page import="ez.lsp.boards.BoardBean"%>
<jsp:useBean id="bMgr" class="ez.lsp.boards.BoardMO" />
<%
	  request.setCharacterEncoding("UTF-8");
	  int num = Integer.parseInt(request.getParameter("num"));
	  String nowPage = request.getParameter("nowPage");
	  String keyField = request.getParameter("keyField");
	  String keyWord = request.getParameter("keyWord");
	  bMgr.upCount(num);//조회수 증가
	  BoardBean bean = bMgr.getBoard(num);//게시물 가져오기
	  String name = bean.getName();
	  String subject = bean.getSubject();
      String regdate = bean.getRegdate();
	  String content = bean.getContent();
	  String filename = bean.getFilename();
	  int filesize = bean.getFilesize();
	  String ip = bean.getIp();
	  int count = bean.getCount();
	  session.setAttribute("bean", bean);//게시물을 세션에 저장
%>
<html>
<head>
<title>JSP Board</title>
<link href="style.css" rel="stylesheet" type="text/css">
<script type="text/javascript">
	function list(){
	    document.listFrm.submit();
	 } 
	
	function down(filename){
		 document.downFrm.filename.value=filename;
		 document.downFrm.submit();
	}
</script>
</head>
<body bgcolor="#c2ffbd">
<br/><br/>
<table align="center" width="800" cellspacing="3">
 <tr>
  <td bgcolor="#ecf576" height="55" align="center" ><font size="5"><b>게시글 읽기</b></font></td>
 </tr>
 <tr>
  <td colspan="2" >
   <table cellpadding="3" cellspacing="0" width="100%" > 
    <tr height="45"> 
	  <td align="center" bgcolor="#DDDDDD" width="10%"> 작성자 </td>
	  <td bgcolor="#FFFFE8"><%=name%></td>
	  <td align="center" bgcolor="#DDDDDD" width="10%"> 작성일 </td>
	  <td bgcolor="#FFFFE8"><%=regdate%></td>
	</tr>
 	<tr height="45"> 
	  <td align="center" bgcolor="#DDDDDD"> 제 목</td>
	  <td bgcolor="#FFFFE8" colspan="3"><%=subject%></td>
	 </tr>
   	<tr height="45"> 
	     <td align="center" bgcolor="#DDDDDD">첨부파일</td>
	     <td bgcolor="#FFFFE8" colspan="3">
	     <% if( filename !=null && !filename.equals("")) {%>
	  		<a href="javascript:down('<%=filename%>')"><%=filename%></a>
	  		 &nbsp;&nbsp;<font color="blue">(<%=filesize%>KBytes)</font>  
	  		 <%} else{%> 등록된 파일이 없습니다.<%}%>
    	</td>
   	</tr>
   <tr> 
    <td colspan="4"><br/><pre><%=content%></pre><br/></td>
   </tr>
   <tr>
    <td colspan="4" align="right">
     <!-- <%=ip%>로 부터 글을 남기셨습니다./   -->
     조회수  <%=count%>
    </td>
   </tr>
   </table>
  </td>
 </tr>
 <tr>
  <td align="center" colspan="2"> 
 <hr/>
 [ <a href="javascript:list()" >목 록</a> | 
 <a href="update.jsp?nowPage=<%=nowPage%>&num=<%=num%>" >수 정</a> |
 <a href="reply.jsp?nowPage=<%=nowPage%>" >답 변</a> |
 <a href="delete.jsp?nowPage=<%=nowPage%>&num=<%=num%>">삭 제</a> ]<br/>
  </td>
 </tr>
</table>

<form name="downFrm" action="download.jsp" method="post">
	<input type="hidden" name="filename">
</form>

<form name="listFrm" method="post" action="list.jsp">
	<input type="hidden" name="nowPage" value="<%=nowPage%>">
	<%if(!(keyWord==null || keyWord.equals(""))){ %>
	<input type="hidden" name="keyField" value="<%=keyField%>">
	<input type="hidden" name="keyWord" value="<%=keyWord%>">
	<%}%>
</form>
</body>
</html>