/*
 * MemberVO : Value Object
 * TABLE : MEMBER
 */
package sthjava;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/cleansing-order")
public class CleansingOrder extends HttpServlet {
    public CleansingOrder() {
        super();
        // TODO Auto-generated constructor stub
    }

	public void init(ServletConfig config) throws ServletException {
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doProcess(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doProcess(request, response);
	}
	
	protected void doProcess(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		
		CleansingOrderDAO cleansingOrderDAO = new CleansingOrderDAO();
		HttpSession session = request.getSession();
		System.out.println("session: " + session);
		String cid = (String)session.getAttribute("cid");
		System.out.printf("**cid: (%S)\n", cid);
		String command = request.getParameter("command");
		if(command != null) {
			if(command.equals("insertCleansingOrder")) {

				String shape = request.getParameter("shape");
				String color = request.getParameter("color");
				String thickness = request.getParameter("thickness");
				int quantity = Integer.parseInt(request.getParameter("quantity"));
				String packing = request.getParameter("packing");
				String delivery = request.getParameter("delivery");
//				java.util.Date utilDate=null;
//				try {
//					utilDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(date);
//				}
//				catch (ParseException e) {}
				
				System.out.printf("[insertCleansingOrder] (%s)(%s)(%s)(%s)(%d)(%s)(%s)%n", cid, shape, color, thickness, quantity, packing, delivery);
				
//			    java.sql.Date regdate = new java.sql.Date(utilDate.getTime());

				if(cid != null && cid.isEmpty() != true && quantity != 0) {
					CleansingOrderVO cleansingOrderVO = new CleansingOrderVO(cid, shape, color, thickness, quantity, packing, delivery);
					cleansingOrderDAO.insertCleansingOrder(cleansingOrderVO);
				}
			}
			
			else if(command.equals("deleteCleansingOrder")) {
				String order_number = request.getParameter("order_number");
				System.out.printf("[deleteCleansingOrder] order_number(%s)%n", order_number);
				if(order_number != null && order_number.isEmpty() != true) {
					cleansingOrderDAO.deleteCleansingOrder(order_number);
				}
			}
			

			else if(command.equals("getCleansingOrder")) {
				String order_number = request.getParameter("order_number");
				System.out.printf("[getCleansingOrder] order_number(%s)%n", order_number);
				if(order_number != null && order_number.isEmpty() != true) {
					cleansingOrderDAO.getCleansingOrder(order_number);
					String orderNumber = URLEncoder.encode(order_number, "UTF-8");
					response.sendRedirect("CleansingOrderview?order_number=" + orderNumber);
					return;
				}
			}
			
			else if(command.equals("editCleansingOrder")) {
				String order_number = request.getParameter("order_number");
				String shape = request.getParameter("shape");
				String color = request.getParameter("color");
				String thickness = request.getParameter("thickness");
				int quantity = Integer.parseInt(request.getParameter("quantity"));
				String packing = request.getParameter("packing");
				String delivery = request.getParameter("delivery");
				String order_date = request.getParameter("order_date");
				
//				String date = request.getParameter("regdate");java.util.Date utilDate=null;
//				try {
//					utilDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(date);
//				}
//				catch (ParseException e) {}
//				System.out.printf("[updateShinetech] cid(%s)%n", cid);
//
//			    java.sql.Date regdate = new java.sql.Date(utilDate.getTime());
				
				if(order_number != null && order_number.isEmpty() != true) {
					CleansingOrderVO cleansingOrderVO = new CleansingOrderVO(cid, shape, color, thickness, quantity, packing, delivery);
					cleansingOrderDAO.updateCleansingOrder(cleansingOrderVO);
				}
			}
		}
		
		response.sendRedirect("cleansingorderlist");
	}
	
	
}
