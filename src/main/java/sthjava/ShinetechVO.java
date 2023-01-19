/*
 * MemberVO : Value Object
 * TABLE : MEMBER
 */
package sthjava;

import java.sql.Date;

public class ShinetechVO {
	private String cid;
	private String cname;
	private String pwd;
	private String email;
	private String tel;
	private String company;
	private Date regdate;
	
	ShinetechVO() {}

	public ShinetechVO(String pro_cd, String mname, String pwd, String email) {
		super();
		this.cid = pro_cd;
		this.cname = mname;
		this.pwd = pwd;
		this.email = email;
	}

	public ShinetechVO(String cid, String cname, String pwd, String email, String tel, String company, Date regdate) {
		super();
		this.cid = cid;
		this.cname = cname;
		this.pwd = pwd;
		this.email = email;
		this.tel = tel;
		this.company = company;
		this.regdate = regdate;
		
	}

	public String getCid() {
		return cid;
	}

	public void setCid(String cid) {
		this.cid = cid;
	}

	public String getCname() {
		return cname;
	}

	public void setCname(String cname) {
		this.cname = cname;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

//	public Date getRegdate() {
//		return regdate;
//	}
//
//	public void setRegdate(Date regdate) {
//		this.regdate = regdate;
//	}

}
