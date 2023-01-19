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

public class CleansingOrderDAO {
	
	public void updateCleansingOrder(CleansingOrderVO cleansingOrderVO) {
		
		String sql = "UPDATE order_cleansing SET shape=?, color=?, thickness=?, quantity=?, packing=?, delivery=?, order_date=? WHERE order_number=?";
		
		System.out.println("[Order_Cleansing Table UPDATE]");
		
		try {
			Connection conn = OracleConnector.getConnection();
			PreparedStatement stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, cleansingOrderVO.getShape());
			stmt.setString(2, cleansingOrderVO.getColor());
			stmt.setString(3, cleansingOrderVO.getThickness());
			stmt.setInt(4, cleansingOrderVO.getQuantity());
			stmt.setString(5, cleansingOrderVO.getPacking());
			stmt.setString(6, cleansingOrderVO.getDelivery());
			
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
	
	public CleansingOrderVO getCleansingOrder(String order_number) {
		String sql = "SELECT * FROM order_cleansing WHERE order_number=?";
		CleansingOrderVO cleansingOrderVO = new CleansingOrderVO();
		
		try {
			Connection conn = OracleConnector.getConnection();
			PreparedStatement stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, order_number);
			System.out.printf("*********order_number: %s\n", order_number);
			ResultSet rs = stmt.executeQuery();
			
			if(rs.next()) {
				System.out.printf("**order_number: %s\n", order_number);
				String cid  = rs.getString("cid");
				String shape = rs.getString("shape");
				String color   = rs.getString("color");
				String thickness = rs.getString("thickness");
				int quantity = rs.getInt("quantity");
				String packing = rs.getString("packing");
				String delivery = rs.getString("delivery");
				Date order_date = rs.getDate("order_date");

				cleansingOrderVO.setCid(cid);
				cleansingOrderVO.setColor(shape);
				cleansingOrderVO.setColor(color);
				cleansingOrderVO.setThickness(thickness);
				cleansingOrderVO.setQuantity(quantity);
				cleansingOrderVO.setPacking(packing);
				cleansingOrderVO.setDelivery(delivery);
			}
			
			rs.close();
			stmt.close();
			OracleConnector.closeConnection();
		}
		catch(SQLException e) {
			System.out.println("[getCleansingOrder] SQLException : " + e.toString());
		}
		
		return cleansingOrderVO;
	}
	
	public boolean insertCleansingOrder(CleansingOrderVO cleansingOrderVO) {
		String sql = "INSERT INTO order_cleansing (cid, shape, color, thickness, quantity, packing, delivery, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, sysdate)";
		
		try {
			Connection conn = OracleConnector.getConnection();
			PreparedStatement stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, cleansingOrderVO.getCid());
			stmt.setString(2, cleansingOrderVO.getShape());
			stmt.setString(3, cleansingOrderVO.getColor());
			stmt.setString(4, cleansingOrderVO.getThickness());
			stmt.setInt(5, cleansingOrderVO.getQuantity());
			stmt.setString(6, cleansingOrderVO.getPacking());
			stmt.setString(7, cleansingOrderVO.getDelivery());
			
			stmt.executeUpdate();

			stmt.close();
			OracleConnector.closeConnection();
		}
		catch(SQLException e) {
			System.out.println("[insertCleansingOrder] SQLException : " + e.toString());
			return false;
		}
		return true;
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
	
	public void deleteCleansingOrder(String order_number) {
		String sql = "DELETE FROM order_cleansing WHERE order_number = ?";
		System.out.println("deleteCleansingOrder: " + order_number);
		
		try {
			Connection conn = OracleConnector.getConnection();
			PreparedStatement stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, order_number);
			stmt.executeUpdate();
			stmt.close();
			
			OracleConnector.closeConnection();
		}
		catch(SQLException e) {
			System.out.println("[deleteCleansingOrder] SQLException : " + e.toString());
		}
	}
	

	
	
	public List<CleansingOrderVO> getCleansingOrders() {
		List<CleansingOrderVO> listCleansingOrder = new ArrayList<CleansingOrderVO>();
		
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;

		try {
			String sql = "SELECT * FROM order_cleansing ORDER BY order_number";
			
			conn = OracleConnector.getConnection();
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
			
			while(rs.next()) {
				String cid = rs.getString("cid");
				String order_number = rs.getString("order_number");
				String shape = rs.getString("shape");
				String color = rs.getString("color");
				String thickness = rs.getString("thickness");
				int quantity = rs.getInt("quantity");
				String packing = rs.getString("packing");
				String delivery = rs.getString("delivery");
				Date order_date = rs.getDate("order_date");
				
				CleansingOrderVO cleansingOrderVO = new CleansingOrderVO();
				cleansingOrderVO.setCid(cid);
				cleansingOrderVO.setColor(shape);
				cleansingOrderVO.setColor(color);
				cleansingOrderVO.setThickness(thickness);
				cleansingOrderVO.setQuantity(quantity);
				cleansingOrderVO.setPacking(packing);
				cleansingOrderVO.setDelivery(delivery);
				
				listCleansingOrder.add(cleansingOrderVO);
			}
		}
		catch(SQLException e) {
			System.out.println("[getCleansingOrders] SQLException : " + e.toString());
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
				System.out.println("[getCleansingOrders] finally SQLException : " + e.toString());
			}
			
			OracleConnector.closeConnection();
		}
		
		return listCleansingOrder;
	}
	
	public List<CleansingOrderVO> getCleansingOrders(String name) {
		List<CleansingOrderVO> listCleansingOrder = new ArrayList<CleansingOrderVO>();
		
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;

		try {
			String sql = "SELECT * FROM order_cleansing WHERE order_number = ?";
			

			conn = OracleConnector.getConnection();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, name);
			rs = stmt.executeQuery();
			
			while(rs.next()) {
				String cid = rs.getString("cid");
				String order_number = rs.getString("order_number");
				String shape = rs.getString("shape");
				String color = rs.getString("color");
				String thickness = rs.getString("thickness");
				int quantity = rs.getInt("quantity");
				String packing = rs.getString("packing");
				String delivery = rs.getString("delivery");
				Date order_date = rs.getDate("order_date");

				
				CleansingOrderVO cleansingOrderVO = new CleansingOrderVO();
				cleansingOrderVO.setCid(cid);
				cleansingOrderVO.setColor(shape);
				cleansingOrderVO.setColor(color);
				cleansingOrderVO.setThickness(thickness);
				cleansingOrderVO.setQuantity(quantity);
				cleansingOrderVO.setPacking(packing);
				cleansingOrderVO.setDelivery(delivery);
				
				listCleansingOrder.add(cleansingOrderVO);
			}
		}
		catch(SQLException e) {
			System.out.println("[getCleansingOrders] SQLException : " + e.toString());
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
				System.out.println("[getCleansingOrders] finally SQLException : " + e.toString());
			}
			
			OracleConnector.closeConnection();
		}
		
		return listCleansingOrder;
	}
}
