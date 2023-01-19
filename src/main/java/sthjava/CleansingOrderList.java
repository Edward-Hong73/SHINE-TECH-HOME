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

@WebServlet("/cleansingorderlist")
public class CleansingOrderList extends HttpServlet {
    public CleansingOrderList() {
    }

	public void init(ServletConfig config) throws ServletException {
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		
		PrintWriter out = response.getWriter();
		htmlHeader(out);
		htmlMembers(out);
		htmlFooter(out);
	}
	
	static void htmlHeader(PrintWriter out) {
		out.print("<html><body>");

		out.print("<table border=1");
		out.print("<caption>"
				+ "[주문 접수 목록]"
				+ "<form method='post' action='cleansingorderinsert'>"
				+ " 주문 번호로 검색"
				+ "<input type='text' name='order_number' placeholder='주문 번호를 입력하세요.' size='14'>"
				+ "<input type=submit value='검색'>"
				+ "<input type=\"hidden\" name=\"command\" value=\"getCleansingOrder\"/>"
				+ "</form>"
				+ "</caption>");
		out.print("<tr align='center' bgcolor='lightgreen'>");
		out.print("<td>아이디</td>");
		out.print("<td>이름</td>");
		out.print("<td>주문번호</td>");
		out.print("<td>모양</td>");
		out.print("<td>색상</td>");
		out.print("<td>두께</td>");
		out.print("<td>수량</td>");
		out.print("<td>포장지선택</td>");
		out.print("<td>배송료산정</td>");
		out.print("<td>삭제</td>");
		out.print("<td>수정</td>");
		out.print("</tr>");
	}
	
	static void htmlMembers(PrintWriter out) {
		CleansingOrderDAO cleansingOrderDAO = new CleansingOrderDAO();
		List<CleansingOrderVO> cleansingOrderList = cleansingOrderDAO.getCleansingOrders();
		
		for(int cnt=0; cnt < cleansingOrderList.size(); cnt++) {
			CleansingOrderVO cleansingOrderVO = cleansingOrderList.get(cnt);
			out.print("<tr>");
			out.printf("<td>%s</td>", cleansingOrderVO.getCid());
			out.printf("<td>%s</td>", cleansingOrderVO.getShape());
			out.printf("<td>%s</td>", cleansingOrderVO.getColor());
			out.printf("<td>%s</td>", cleansingOrderVO.getThickness());
			out.printf("<td>%s</td>", cleansingOrderVO.getQuantity());
			out.printf("<td>%s</td>", cleansingOrderVO.getPacking());
			out.printf("<td>%s</td>", cleansingOrderVO.getDelivery());
			out.printf("<td><a href='/ShineTechHome/cleansingorderinsert?command=deleteCleansingOrder&order_number=%s'>삭제</a></td>");
			out.printf("<td><a href='/ShineTechHome/cleansingorderedit.jsp?order_no=%s'>수정</a></td>");
			out.print("</tr>");
		}
	}
	
	static void htmlFooter(PrintWriter out) {
		out.print("<tr><td colspan=11><a href='/ShineTechHome/shine-tech-home.html'>홈으로 가기</a></td></tr>");
		out.print("</table>");
		out.print("</body></html>");
	}
}
