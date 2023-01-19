package soldb;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class OracleSQL2 {

	public static void main(String[] args) {
		System.out.println(">>> PreparedStatement <<<");
		
		OracleSQL2 hello = new OracleSQL2();
		
		
		hello.insert("7979", "권철주", "010-7979-7979");
		// hello.select();
		
		hello.insert("3000", "사미자", "010-3000-3000");
		hello.update("3000", "김영우", "010-5454-5252");
		// hello.select();
		
		// hello.delete("3000");
		// hello.select();
		
		hello.select("%");	// 전체 검색
		// hello.select("구%");
		// hello.select("%수%");
	}
	
	public void select(String hnamelike) {
		final String sql = "SELECT * FROM hello WHERE hname LIKE ? ORDER BY hname";

		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rset = null;
		
		System.out.printf("[Hello Table Select] LIKE %s \n", hnamelike);
		
		try {
			conn = OracleConnector.getConnection();
			stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, hnamelike);
			
			rset = stmt.executeQuery();

			System.out.printf("-----------------------------%n");
			System.out.printf("[NO] [HID] [HNAME]     [HTEL]%n");
			System.out.printf("-----------------------------%n");
			
			int no = 0;
			while(rset.next() ) {
				String hid   = rset.getString(1);
				String hname = rset.getString(2);
				String htel  = rset.getString(3);
				
				System.out.printf(" %02d  %s  %s  %s %n", ++no, hid, hname, htel);
			}
		}
		catch(SQLException e) {
			System.out.println("select: SQLException: " + e.toString());
		}
		finally {
			try {
				if(rset != null) {
					rset.close();
				}
				
				if(stmt != null) {
					stmt.close();
				}
				
			}
			catch(Exception e) {
				System.out.println("select:finally:Exception: " + e.toString());
			}
			
			OracleConnector.closeConnection();
		}
	}	
	
	public void delete(String hid) {
		String sql = String.format("DELETE FROM hello WHERE hid = ?");
		
		Connection conn = null;
		PreparedStatement stmt = null;
		
		System.out.printf("[Hello Table DELETE] hid=(%s)\n", hid);
		
		try {
			conn = OracleConnector.getConnection();
			stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, hid);
			
			int success = stmt.executeUpdate();
			if(success > 0) { // 처리한 갯수를 리턴
				System.out.printf("DELETE: succeed(%d)\n", success);
			}
			else {
				System.out.printf("DELETE: failed(%d)\n", success);
			}
		}
		catch(SQLException e) {
			System.out.println("DELETE: SQLException: " + e.toString());
		}
		finally {
			try {
				if(stmt != null) {
					stmt.close();
				}
				
			}
			catch(Exception e) {
				System.out.println("DELETE:finally:Exception: " + e.toString());
			}
			
			OracleConnector.closeConnection();
		}
	}
	
	public void update(String hid, String hname, String htel) {
		String sql = String.format("UPDATE hello SET hname=?, htel=? WHERE hid=?");
		
		Connection conn = null;
		PreparedStatement stmt = null;
		
		System.out.println("[Hello Table UPDATE]");
		
		try {
			conn = OracleConnector.getConnection();
			stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, hname);
			stmt.setString(2, htel);
			stmt.setString(3, hid);
			
			int success = stmt.executeUpdate();
			if(success > 0) { // 처리한 갯수를 리턴
				System.out.printf("UPDATE: succeed(%d)\n", success);
			}
			else {
				System.out.printf("UPDATE: failed(%d)\n", success);
			}
		}
		catch(SQLException e) {
			System.out.println("UPDATE: SQLException: " + e.toString());
		}
		finally {
			try {
				if(stmt != null) {
					stmt.close();
				}
				
			}
			catch(Exception e) {
				System.out.println("UPDATE:finally:Exception: " + e.toString());
			}
			
			OracleConnector.closeConnection();
		}
	}

	public void insert(String hid, String hname, String htel) {
		String sql = String.format("INSERT INTO hello VALUES(?, ?, ?)");
		
		Connection conn = null;
		PreparedStatement stmt = null;
		
		System.out.println("[Hello Table Insert]");
		
		try {
			conn = OracleConnector.getConnection();
			stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, hid);
			stmt.setString(2, hname);
			stmt.setString(3, htel);
			
			int success = stmt.executeUpdate();
			if(success > 0) { // 처리한 갯수를 리턴
				System.out.printf("INSERT: succeed(%d)\n", success);
			}
			else {
				System.out.println("INSERT: failed!!!");
			}
		}
		catch(SQLException e) {
			System.out.println("INSERT: SQLException: " + e.toString());
		}
		finally {
			try {
				if(stmt != null) {
					stmt.close();
				}
				
			}
			catch(Exception e) {
				System.out.println("INSERT: " + e.toString());
			}
			
			OracleConnector.closeConnection();
		}
	}
}
