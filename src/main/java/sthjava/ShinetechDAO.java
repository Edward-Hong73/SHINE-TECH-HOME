/*
 * MemberDAO: Data Access Object
 */
package sthjava;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import soldb.OracleConnector;

public class ShinetechDAO {
	
	public void updateCustomer(ShinetechVO customersVO) {
		
		String sql = "UPDATE professors SET cname=?, pwd=?, email=?, mname=? tel=? WHERE cid=?";
		
		System.out.println("[Processors Table UPDATE]");
		
		try {
			Connection conn = OracleConnector.getConnection();
			PreparedStatement stmt = conn.prepareStatement(sql);
			
			
			stmt.setString(1, customersVO.getCname());
			stmt.setString(2, customersVO.getPwd());
			stmt.setString(3, customersVO.getEmail());
			stmt.setString(4, customersVO.getCname());
			stmt.setString(5, customersVO.getTel());			
			stmt.setString(6, customersVO.getCid());
			
			System.out.println(customersVO.getCid());
			
			int success = stmt.executeUpdate();
			if(success > 0) { // 처리한 갯수를 리턴
				System.out.printf("UPDATE: succeed(%d)\n", success);
			}
			else {
				System.out.printf("UPDATE: failed(%d)\n", success);
			}
			stmt.close();
			OracleConnector.closeConnection();
		}
		catch(SQLException e) {
			System.out.println("UPDATE: SQLException: " + e.toString());
		}		
	}
	
	public ShinetechVO getCustomer(String id) {
		String sql = "SELECT * FROM customer WHERE cid=?";

		ShinetechVO customer = null;
		
		try {
			Connection conn = OracleConnector.getConnection();
			PreparedStatement stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, id);
			System.out.printf("*********id: %s\n", id);
			ResultSet rs = stmt.executeQuery();
			
			if(rs.next()) {
				customer = new ShinetechVO();
				System.out.printf("**cid: %s\n", id);
				String cid  = rs.getString("cid");
				String pwd   = rs.getString("pwd");
				String cname = rs.getString("cname");
				String email = rs.getString("email");
				String tel = rs.getString("tel");
				String company = rs.getString("company");
//				Date regdate = rs.getDate("regdate");
				

				
				customer.setCid(cid);
				customer.setPwd(pwd);
				customer.setCname(cname);
				customer.setEmail(email);
				customer.setTel(tel);
				customer.setCompany(company);
//				customer.setRegdate(regdate);
			}
			
			rs.close();
			stmt.close();
			OracleConnector.closeConnection();

		}
		catch(SQLException e) {
			System.out.println("[getCustomer] SQLException : " + e.toString());
		}
		
		return customer;
	}
	
	public boolean insertCustomer(ShinetechVO customer) {
		String sql = "INSERT INTO customer (cid, cname, pwd, email, tel, company) VALUES (?, ?, ?, ?, ?, ?)";
		
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			System.out.println("[insertCustomer] try success!! ");
			conn = OracleConnector.getConnection();
			stmt = conn.prepareStatement(sql);
			System.out.println("stmt " + stmt);
			
			stmt.setString(1, customer.getCid());;
			stmt.setString(2, customer.getCname());
			stmt.setString(3, customer.getPwd());
			stmt.setString(4, customer.getEmail());
			stmt.setString(5, customer.getTel());
			stmt.setString(6, customer.getCompany());
			//stmt.setDate(7, customer.getRegdate());
			
			stmt.executeUpdate();
			System.out.println("stmt set " + stmt);

//			stmt.close();
//			OracleConnector.closeConnection();
		}
		catch(SQLException e) {
			System.out.println("[insertProfessor] SQLException : " + e.toString());
			return false;
		}
		finally {
			try {
				if(stmt != null) {
					stmt.close();
					OracleConnector.closeConnection();
				}
			} 
			catch(SQLException e) {}
			
			//OracleConnector.closeConnection();
		}
		
		return true;
	}

	
	public void deleteCustomer(String cid) {
		String sql = "DELETE FROM customer WHERE cid = ?";
		System.out.println("deleteCustomer: " + cid);
		
		try {
			Connection conn = OracleConnector.getConnection();
			PreparedStatement stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, cid);
			stmt.executeUpdate();
			stmt.close();
			
			OracleConnector.closeConnection();
		}
		catch(SQLException e) {
			System.out.println("[deleteProfessor] SQLException : " + e.toString());
		}
	}
	

	
	
	public List<ShinetechVO> getCustomers() {
		List<ShinetechVO> listCustomer = new ArrayList<ShinetechVO>();
		
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;

		try {
			String sql = "SELECT * FROM customer ORDER BY cid";
			
			conn = OracleConnector.getConnection();
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
			
			while(rs.next()) {
				String cid = rs.getString("cid");
				String pwd = rs.getString("pwd");
				String cname = rs.getString("cname");
				String email = rs.getString("email");
				String tel = rs.getString("tel");
				String company = rs.getString("company");
				Date regdate = rs.getDate("regdate");
				
				ShinetechVO customer = new ShinetechVO();
				customer.setCid(cid);
				customer.setPwd(pwd);
				customer.setCname(cname);
				customer.setEmail(email);
				customer.setTel(tel);
				customer.setEmail(email);
//				customer.setRegdate(regdate);
				
				listCustomer.add(customer);
			}
		}
		catch(SQLException e) {
			System.out.println("[getMembers] SQLException : " + e.toString());
		}
		finally {
			try {
				if(rs != null) {
					rs.close();
				}
				
				if(stmt != null) {
					stmt.close();
				}
			}
			catch(Exception e) {
				System.out.println("[getMembers] finally SQLException : " + e.toString());
			}
			
			OracleConnector.closeConnection();
		}
		
		return listCustomer;
	}
	
	public List<ShinetechVO> getCustomers(String name) {
		List<ShinetechVO> listCustomer = new ArrayList<ShinetechVO>();
		
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;

		try {
			String sql = "SELECT * FROM customer WHERE cname = ?  ORDER BY cid";
			

			conn = OracleConnector.getConnection();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, name);
			rs = stmt.executeQuery();
			
			while(rs.next()) {
				String cid = rs.getString("cid");
				String pwd = rs.getString("pwd");
				String cname = rs.getString("name");
				String email = rs.getString("email");
				String tel = rs.getString("tel");
				String company = rs.getString("company");
				Date regdate = rs.getDate("regdate");

				
				ShinetechVO customer = new ShinetechVO();
				customer.setCid(cid);
				customer.setPwd(pwd);
				customer.setCname(cname);
				customer.setEmail(email);
				customer.setTel(tel);
				customer.setEmail(email);
				customer.setTel(tel);
				
				listCustomer.add(customer);
			}
		}
		catch(SQLException e) {
			System.out.println("[getMembers] SQLException : " + e.toString());
		}
		finally {
			try {
				if(rs != null) {
					rs.close();
				}
				
				if(stmt != null) {
					stmt.close();
				}
			}
			catch(Exception e) {
				System.out.println("[getMembers] finally SQLException : " + e.toString());
			}
			
			OracleConnector.closeConnection();
		}
		
		return listCustomer;
	}
	
//	public void deleteProfessor(String pro_cd) {
//		String sql = String.format("DELETE FROM professors WHERE pro_cd = '%s'", pro_cd);
//		
//		Connection conn = null;
//		Statement  stmt = null;
//		
//		System.out.printf("[professors Table DELETE] pro_cd = %s\n", pro_cd);
//		
//		try {
//			conn = OracleConnector.getConnection();
//			stmt = conn.createStatement();
//			
//			int success = stmt.executeUpdate(sql);
//			System.out.println("deleteProfessor: " + pro_cd);
//			
//			if(success > 0) { // 처리한 갯수를 리턴
//				System.out.printf("DELETE: succeed(%d)\n", success);
//			}
//			else {
//				System.out.printf("DELETE: failed(%d)\n", success);
//			}
//		}
//		catch(SQLException e) {
//			System.out.println("DELETE: SQLException: " + e.toString());
//		}
//		finally {
//			try {
//				if(stmt != null) {
//					stmt.close();
//				}
//				
//			}
//			catch(Exception e) {
//				System.out.println("DELETE:finally:Exception: " + e.toString());
//			}
//			
//			OracleConnector.closeConnection();
//		}
//	}
}
