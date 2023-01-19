/*
 * JDBC Connection
 * DBCP : Database Connection Pool
 */
package soldb;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

public class OracleConnectorDBCP {
	private DataSource _datasource = null;
	private Connection _conn = null;
	
	public OracleConnectorDBCP() {
		System.out.println("OracleConnectorDBCP");
		
		try {
			Context ctx = new InitialContext();
			Context env = (Context)ctx.lookup("java:/comp/env");
			_datasource = (DataSource)env.lookup("jdbc/oracle");
		}
		catch(Exception e) {
			System.out.println("[OracleConnectorDBCP] datasource: " + e.getMessage());
		}
	}
	
	public Connection getConnection() {
		System.out.println("[OracleConnectorDBCP] getConnection...");
		
		try {
			if(_conn == null) {
				_conn = _datasource.getConnection();
			}
		}
		catch(SQLException e) {
			System.out.println("[OracleConnectorDBCP] getConnection: " + e.getMessage());
		}
		
		return _conn;
	}

	public void closeConnection() {
		System.out.println("[OracleConnectorDBCP] closeConnection...");
		
		try {
			if(_conn != null && _conn.isClosed() != true) {
				_conn.close();
			}
			
			_conn = null;
		}
		catch(SQLException e) {
			System.out.println("[MemberDBCP] closeConnection: " + e.getMessage());
		}
	}
	
	
	public static void main(String[] args) {
		System.out.println(">>> Oracle Connection DBCP Test <<<");
		OracleConnectorDBCP dbcp = new OracleConnectorDBCP();
		Connection conn = dbcp.getConnection();
		dbcp.closeConnection();
	}

}
