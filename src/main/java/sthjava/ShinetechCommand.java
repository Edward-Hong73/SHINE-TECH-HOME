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

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/Shinetechcommand")
public class ShinetechCommand extends HttpServlet {
    public ShinetechCommand() {
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
		
		ShinetechDAO shinetechDAO = new ShinetechDAO();
		
		String command = request.getParameter("command");
		if(command != null) {
			if(command.equals("insertCustomer")) {
				String cid = request.getParameter("cid");
				String cname = request.getParameter("cname");
				String pwd = request.getParameter("pwd");
				String email = request.getParameter("email");
				String tel = request.getParameter("tel");
				String company = request.getParameter("company");
//				String date = request.getParameter("regdate");
//				java.util.Date utilDate=null;
//				try {
//					utilDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(date);
//				}
//				catch (ParseException e) {}
				
				System.out.printf("[insertShinetech] (%s)(%s)(%s)(%s)(%s)(%s)%n", cid, cname, pwd, email, tel, company);
				
//			    java.sql.Date regdate = new java.sql.Date(utilDate.getTime());

				if(cid != null && cid.isEmpty() != true) {
					ShinetechVO shinetech = new ShinetechVO(cid, cname, pwd, email, tel, company, null);
					boolean boo = shinetechDAO.insertCustomer(shinetech);
					System.out.println("boo : " + boo);
					//response.sendRedirect("joinpost");
					ShinetechVO customers = shinetechDAO.getCustomer(cid);
					
					request.setAttribute("customers", customers);
					
					RequestDispatcher dispatch = request.getRequestDispatcher("joinpost");
					dispatch.forward(request, response);
				}

			}
			
			else if(command.equals("deleteCustomer")) {
				String cid = request.getParameter("cid");
				System.out.printf("[deleteCustomer] cid(%s)%n", cid);
				if(cid != null && cid.isEmpty() != true) {
					shinetechDAO.deleteCustomer(cid);
					response.sendRedirect("CustomerList");
				}
			}
			

			else if(command.equals("getCustomer")) {
				String cname = request.getParameter("cname");
				System.out.printf("[getCustomer] cname(%s)%n", cname);
				if(cname != null && cname.isEmpty() != true) {
					shinetechDAO.getCustomer(cname);
					String proname = URLEncoder.encode(cname, "UTF-8");
					response.sendRedirect("Shinetechview?cname="+proname);
					return;
				}
			}
			
			else if(command.equals("editCustomer")) {
				String cid = request.getParameter("cid");
				String cname = request.getParameter("cname");
				String pwd = request.getParameter("pwd");
				String email = request.getParameter("email");
				String tel = request.getParameter("tel");

				String company = request.getParameter("company");
				String date = request.getParameter("regdate");java.util.Date utilDate=null;
				try {
					utilDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(date);
				}
				catch (ParseException e) {}
				System.out.printf("[updateShinetech] cid(%s)%n", cid);

			    java.sql.Date regdate = new java.sql.Date(utilDate.getTime());
				if(cid != null && cid.isEmpty() != true) {
					ShinetechVO shinetech = new ShinetechVO(cid, cname, pwd, email, tel, company, regdate);
					shinetechDAO.updateCustomer(shinetech);
				}
			}
		}
		

	}
	
	
}
