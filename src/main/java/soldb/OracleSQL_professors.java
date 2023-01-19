package soldb;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class OracleSQL_professors {

	public static void main(String[] args) {
		OracleSQL_professors professors = new OracleSQL_professors();
		
		//professors.select();

		
//		professors.insert("030", "이박사", "건축과");
//		professors.insert("040", "정박사", "토목과");
//		professors.insert("050", "최박사", "체육과");
		//professors.select();
		
				
		
//		professors.update("020", "서박사", "전자과");
//		
		professors.select("050");
//		professors.delete("040");
	}
	
	public void delete(String pro_cd) {
		String sql = String.format("DELETE FROM professors WHERE pro_cd = '%s'", pro_cd);
		
		Connection conn = null;
		Statement  stmt = null;
		
		System.out.printf("[Professors Table DELETE] pro_cd=%s\n", pro_cd);
		
		try {
			conn = OracleConnector.getConnection();
			stmt = conn.createStatement();
			
			int success = stmt.executeUpdate(sql);
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
	
	public void update(String pro_cd, String pro_name, String mname) {
		String sql = String.format("UPDATE professors SET pro_name='%s', mname='%s' WHERE pro_cd = '%s'", pro_name, mname, pro_cd);
		
		Connection conn = null;
		Statement  stmt = null;
		
		System.out.println("[Professors Table UPDATE]");
		
		try {
			conn = OracleConnector.getConnection();
			stmt = conn.createStatement();
			int success = stmt.executeUpdate(sql);
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

	public void insert(String pro_cd, String pro_name, String mname) {
		String sql = String.format("INSERT INTO professors VALUES('%s', '%s', '%s')", pro_cd, pro_name, mname);
		
		Connection conn = null;
		Statement  stmt = null;
		
		System.out.println("[Professors Table Insert]");
		
		try {
			conn = OracleConnector.getConnection();
			stmt = conn.createStatement();
			int success = stmt.executeUpdate(sql);
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
	
	public void select(String pro_cd) {
		// final String sql = "SELECT * FROM hello ORDER BY hid";
		// final String sql = "SELECT hid as id, hname as name, htel as tel FROM hello ORDER BY hid";
		String sql = String.format("SELECT * FROM professors WHERE pro_cd='%s'", pro_cd);
				
		Connection conn = null; // 접속 객체
		Statement  stmt = null; // 쿼리 수행
//		ResultSet  rset = null; // 쿼리 결과
		
		System.out.println("[Professors Table Select]");
		
		try {
			conn = OracleConnector.getConnection();
			stmt = conn.createStatement();
			int success = stmt.executeUpdate(sql);
			if(success > 0) { // 처리한 갯수를 리턴
				System.out.printf("INSERT: succeed(%d)\n", success);
			}
			else {
				System.out.println("INSERT: failed!!!");
			}
//			rset = stmt.executeQuery(sql);

//			System.out.printf("[pro_cd] [pro_name]     [mname]%n");
//			System.out.printf("---------------------------%n");
			
//			while(rset.next() ) {
//				/*
//				String hid   = rset.getString(1);
//				String hname = rset.getString(2);
//				String htel  = rset.getString(3);
//				*/
//				/*
//				String hid   = rset.getString("hid");
//				String hname = rset.getString("hname");
//				String htel  = rset.getString("htel");
//				*/
//				String hid   = rset.getString("id");
//				String hname = rset.getString("name");
//				String htel  = rset.getString("tel");
//				
//				System.out.printf("%s  %s  %s %n", hid, hname, htel);
//			}
		}
		catch(SQLException e) {
			System.out.println("select: SQLException: " + e.toString());
		}
//		finally {
//			try {
//				if(rset != null) {
//					rset.close();
//				}
//				
//				if(stmt != null) {
//					stmt.close();
//				}
//				
//			}
//			catch(Exception e) {
//				System.out.println("select:finally:Exception: " + e.toString());
//			}
//			
//			OracleConnector.closeConnection();
//		}
	}
}
