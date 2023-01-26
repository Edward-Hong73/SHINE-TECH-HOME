<%@ page contentType="text/html; charset=UTF-8" %>
<%
      request.setCharacterEncoding("UTF-8");
	  int totalRecord = Integer.parseInt(request.getParameter("totalRecord"));
	  int numPerPage = 10; // 페이지당 레코드 수 
	  int pagePerBlock = 15;  //블럭당 페이지수 
	  int totalPage = 0; //전체 페이지 수
      int totalBlock = 0;  //전체 블럭수 
      int nowPage = 1; // 현재페이지
      int nowBlock = 1;  //현재블럭

      int start=0; //디비의 select 시작번호
      int end=10; //시작번호로 부터 가져올 select 갯수

      int listSize=0; //현재 읽어온 게시물의 수
	  
  	  if (request.getParameter("nowPage") != null) {
		nowPage = Integer.parseInt(request.getParameter("nowPage"));
	  }
	  start = (nowPage * numPerPage) - numPerPage;
	  end = numPerPage;

	  totalPage =(int)Math.ceil((double)totalRecord / numPerPage);//전체페이지수
	  nowBlock= (int)Math.ceil((double)nowPage/pagePerBlock);//현재블럭 계산
	  
	  totalBlock =(int)Math.ceil((double)totalPage / pagePerBlock);//전체블럭계산
%>
<html>
<head>
<title>게시물 갯수 & 블럭 갯수 계산 결과</title>
<link href="style.css" rel="stylesheet" type="text/css">
<script type="text/javascript">
	function pageing(page) {
		document.readFrm.nowPage.value = page;
		document.readFrm.submit();
	}

	function block(value){
	 	document.readFrm.nowPage.value=<%=pagePerBlock%>*(value-1)+1;
	 	document.readFrm.submit();
	} 
</script>
</head>
<body bgcolor="#c2ffbd">
<div align="center">
<br/>
<h2>게시물 갯수 & 블럭 갯수 계산 결과</h2>
<br/>
	<table width="600">
			<tr align="center">
				<td><b>전체 게시물 갯수 : <%=totalRecord%>개(<font color="red">
				<%=totalPage%>페이지 중 <%=nowPage%>페이지</font>)</b></td>
			</tr>
	</table>
	<table>
	<tr>
		<td>게시물 번호(10개 단위) : &nbsp;</td>
		<%
			listSize = totalRecord-start;
			for(int i = 0;i<numPerPage; i++){
				if (i == listSize) break;
		%>
		<td align="center">
			<%=totalRecord-((nowPage-1)*numPerPage)-i%>&nbsp;
		</td>
		<%}//for%><br>
		<td align="center">&nbsp;</td>
	</tr>
</table>
<!-- 페이징 및 블럭 -->
<table>
	<tr height="35">
		<td>페이지 블록(15개 단위) : </td>
		<td>
			<!-- 페이징 및 블럭 처리 Start--> 
			<%
   				  int pageStart = (nowBlock -1)*pagePerBlock + 1 ; //하단 페이지 시작번호
   				  int pageEnd = ((pageStart + pagePerBlock ) <= totalPage) ?  (pageStart + pagePerBlock): totalPage+1; 
   				  //하단 페이지 끝번호
   				  if(totalPage !=0){
    			  	if (nowBlock > 1) {%>
    			  		<a href="javascript:block('<%=nowBlock-1%>')">prev...</a><%}%>&nbsp; 
							
							<%for ( ; pageStart < pageEnd; pageStart++){%>
     			     			<a href="javascript:pageing('<%=pageStart %>')"> 
     						<%if(pageStart==nowPage) {%><font color="blue"><%}%>
     						[<%=pageStart %>] 
     						<%if(pageStart==nowPage) {%></font> <%}%></a> 
    						<%}//for%>&nbsp; 
    						
    					<%if (totalBlock > nowBlock ) {%>
    					<a href="javascript:block('<%=nowBlock+1%>')">.....next</a>
    				<%}%>&nbsp;  
   				<%}%>
 			<!-- 페이징 및 블럭 처리 End-->
		</td>
	</tr>
</table>
<hr width="600"/>
<form name="readFrm">
	<input type="hidden" name="totalRecord" value="<%=totalRecord%>">
	<input type="hidden" name="nowPage" value="<%=nowPage%>"> 
</form>
<b>
<table>
	<tr height="35">
		<td>전체 게시물 수 : </td><td><%=totalRecord%>개&nbsp;</td>
	</tr>
	<tr height="35">
		<td>한 페이지 당 게시물 수 : </td><td><%=numPerPage%>개&nbsp;</td>
	</tr>
	<tr height="35">
		<td>전체 페이지 수 : </td><td><%=totalPage%>장&nbsp;</td>
	</tr>
	<tr height="35">
		<td>전체 블록 수 : </td><td><%=totalBlock%>블록&nbsp;</td>
	</tr>
	<tr height="35">
		<td>한 블록 당 페이지 수 : </td><td><%=pagePerBlock%>개&nbsp;</td>
	</tr>
	<tr height="35">
		<td>현재 페이지 : </td><td><%=nowPage%>페이지&nbsp;</td>
	</tr>
	<tr height="35">
		<td>현재 블록 : </td><td><%=nowBlock%>블록&nbsp;</td>
	</tr>
</table>
<p/>
<input type="button" value="입력창으로 돌아가기" onClick="javascript:location.href='pageView.html'">
</div>
</body>
</html>