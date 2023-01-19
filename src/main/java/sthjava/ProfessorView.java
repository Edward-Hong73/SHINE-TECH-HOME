package sthjava;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/professorview")
public class ProfessorView extends HttpServlet {
    public ProfessorView() {
    }

	public void init(ServletConfig config) throws ServletException {
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		String pro_name = request.getParameter("pro_name");
		System.out.println("pro_name: "+ pro_name);
		ShinetechDAO shinetechDAO = new ShinetechDAO();
		
		ShinetechVO professor = shinetechDAO.getCustomer(pro_name);
		
		PrintWriter out = response.getWriter();
		htmlHeader(out);
		htmlMembers(out, professor);
		htmlFooter(out);
	}
	
	static void htmlHeader(PrintWriter out) {
		out.print("<html><body>");

		out.print("<table border=1");
		out.print("<caption>"
				+ "[교수정보 관리]"
				+ "<form method='post' action='professorinsert'>"
				+ " 교수 이름 검색"
				+ "<input type='text' name='pro_name' placeholder='이름을 입력하세요.' size='14'>"
				+ "<input type=submit value='검색'>"
				+ "<input type=\"hidden\" name=\"command\" value=\"getProfessor\"/>"
				+ "</form>"
				+ "</caption>");
		out.print("<tr align='center' bgcolor='lightgreen'>");
		out.print("<td>아이디</td>");
		out.print("<td>이름</td>");
		out.print("<td>비밀번호</td>");
		out.print("<td>이메일</td>");
		out.print("<td>전공과목</td>");
		out.print("<td>삭제</td>");
		out.print("<td>수정</td>");
		out.print("</tr>");
	}
	
	static void htmlMembers(PrintWriter out, ShinetechVO professor) {
		
		
//		for(int cnt=0; cnt < professor.size(); cnt++) {
//			ProfessorsVO professor = professor.get(cnt);
			out.print("<tr>");
			out.printf("<td>%s</td>", professor.getCid());
			out.printf("<td>%s</td>", professor.getCname());
			out.printf("<td>%s</td>", professor.getPwd());
			out.printf("<td>%s</td>", professor.getEmail());
			out.printf("<td>%s</td>", professor.getTel());
			out.printf("<td><a href='/JspMemberExam/professorinsert?command=deleteProfessor&pro_cd=%s'>삭제</a></td>", professor.getCid());
			out.printf("<td><a href='/JspMemberExam/professoredit.jsp?pro_cd=%s'>수정</a></td>", professor.getCid());
			out.print("</tr>");
//		}
	}
	
	static void htmlFooter(PrintWriter out) {
		out.print("<tr><td colspan=3 align='left'><a href='/JspMemberExam/professorinsert.html' margin='auto'>정보등록</a></td>"
				+ "<td colspan=4 align='right'><a href='/JspMemberExam/professorlist' margin='auto'>목록으로 돌아가기</a></td></tr>");
		out.print("</table>");
		out.print("</body></html>");
	}
}
