<%@page contentType="application; charset=UTF-8"%>
<jsp:useBean id="bMgr" class="ez.lsp.boards.BoardMO" />
<%
	  bMgr.downLoad(request, response, out, pageContext);
%>