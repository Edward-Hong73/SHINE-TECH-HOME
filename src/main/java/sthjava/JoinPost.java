package sthjava;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class Login
 */

@WebServlet("/joinpost")
public class JoinPost extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public JoinPost() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("[/join] GET");
		
		HttpSession session = request.getSession();;
		
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		ShinetechVO customers = (ShinetechVO)request.getAttribute("customers");
		ShinetechDAO shinetechDAO = new ShinetechDAO();
		
		if(customers != null) {
			String cid = customers.getCid();
			String cname = customers.getCname();
			String company = customers.getCompany();
			
			System.out.println("*cid : " + cid);
			System.out.println("cname : " + cname);					
			System.out.println("customer : " + customers);

			
			response.getWriter().append("<h3>Welcome to Shine-Tech!!!<h3>");
			response.getWriter().append("<hr>");
			response.getWriter().append("<p>환영합니다.!! "+ cname + "님 회원 가입을 축하드립니다...!!</p>");
			response.getWriter().append("<a href='shine-tech-home.html'>확인</a>");
		} else {
			
			response.getWriter().append("<h3>회원 가입에 실패하셨습니다.<h3>");
			response.getWriter().append("<hr>");
			response.getWriter().append("<p>가입 실패..</p>");
			
			response.getWriter().append("<a href='customerinsert.html'>가입 화면으로 돌아가기</a>");
		}
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		// response.getWriter().append("Served at: ").append(request.getContextPath());
		System.out.println("[/join] POST");
		
		HttpSession session = request.getSession();
		
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		ShinetechVO customers = (ShinetechVO)request.getAttribute("customers");
		ShinetechDAO shinetechDAO = new ShinetechDAO();
		
		if(customers != null) {
			String cid = customers.getCid();
			String pwd = customers.getPwd();
			String cname = customers.getCname();
			String company = customers.getCompany();
			
			System.out.println("*cid : " + cid);
			System.out.println("cname : " + cname);					
			System.out.println("customer : " + customers);

			
			response.getWriter().append("<h3>Welcome to Shine-Tech!!!<h3>");
			response.getWriter().append("<hr>");
			response.getWriter().append("<p>환영합니다.!! "+ cname + "님 회원 가입을 축하드립니다...!!</p>");
			response.getWriter().append("<a href='login-post.jsp?cid=" + cid + "&pwd="+pwd+"'>확인(로그인 화면으로 이동합니다.)</a>");
		} else {
			
			response.getWriter().append("<h3>회원 가입에 실패하셨습니다.<h3>");
			response.getWriter().append("<hr>");
			response.getWriter().append("<p>가입 실패..</p>");
			
			response.getWriter().append("<a href='customerinsert.html'>가입 화면으로 돌아가기</a>");
		}
	}

}
