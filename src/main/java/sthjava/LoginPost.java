package sthjava;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class Login
 */

@WebServlet("/loginpost")
public class LoginPost extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginPost() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		// response.getWriter().append("Served at: ").append(request.getContextPath());
		System.out.println("[/login] POST");
		
		HttpSession session = request.getSession();;
		
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		
		String cid = request.getParameter("cid");
		String pwd = request.getParameter("pwd");
		//String cname = request.getParameter("cname");
		System.out.println("*cid : " + cid);
		System.out.println("pwd : " + pwd);
		//System.out.println("cname : " + cname);

		ShinetechDAO shinetechDAO = new ShinetechDAO();
		ShinetechVO customer = shinetechDAO.getCustomer(cid);
		System.out.println("customer: " + customer);
		
		if(customer == null) {
			response.getWriter().append("<h3>Welcome to Shine-Tech!!!<h3>");
			response.getWriter().append("<hr>");
			response.getWriter().append("<p>고객정보가 존재하지 않습니다. 고객 회원 가입이 필요합니다.</p>");
			response.getWriter().append("<a href='customerinsert.html'>고객 회원 가입하기</a>");
		} else {
//			String id = (String)session.getAttribute("idKey");    
//			String sessionId = session.getId();
//			int intervalTime = session.getMaxInactiveInterval();
			
		    session.setAttribute("cid", customer.getCid());
			session.setMaxInactiveInterval(60*5);
			
			System.out.println("cid : " + customer.getCid());
			System.out.println("pwd : " + customer.getPwd());
			System.out.println("cname : " + customer.getCname());
			System.out.println("company : " + customer.getCompany());
			
			response.getWriter().append("<h3>Welcome to Shine-Tech!!!<h3>");
			response.getWriter().append("<hr>");
			response.getWriter().append("<p>로그인 성공</p>");
			response.getWriter().append("<p>"+ customer.getCompany()+"에서 오신 "+customer.getCname() +"님 환영합니다.!!</p>");
			response.getWriter().append("<a href='shine-tech-cleansing.html'>견적요청 및 주문하기</a>");
		}
	}

}
