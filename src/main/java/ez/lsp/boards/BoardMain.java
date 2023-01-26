/*
 * BoardMain : Test Sample Code
 */
package ez.lsp.boards;

import java.sql.Connection;
import java.sql.PreparedStatement;

import ez.lsp.databases.DBConnectionMgr;

public class BoardMain {
	private DBConnectionMgr pool;

	public BoardMain() {
		try {
			pool = DBConnectionMgr.getInstance();
		} 
		catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	// 페이징 및 블럭 테스트를 위한 게시물 저장 메소드 
	public void post1000() {
		Connection con = null;
		PreparedStatement pstmt = null;
		String sql = null;
		try {
			con  = pool.getConnection();
			sql  = "insert into ezlspboards (num,name,content,subject,ref,pos,depth,regdate,pass,count,ip,filename,filesize) ";
			sql += "values(ezlspboards_seq.nextval, 'aaa', 'bbb', 'ccc', 0, 0, 0, sysdate, '1111', 0, '127.0.0.1', null, 0)";
			
			pstmt = con.prepareStatement(sql);
			for (int i = 0; i < 1000; i++) {
				pstmt.executeUpdate();
			}
		} 
		catch (Exception e) {
			e.printStackTrace();
		} 
		finally {
			pool.freeConnection(con, pstmt);
		}
	}
	
	// main
	public static void main(String[] args) {
		new BoardMain().post1000();
		System.out.println("SUCCESS");
	}
}