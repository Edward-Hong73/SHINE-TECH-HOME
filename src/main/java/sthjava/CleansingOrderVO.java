/*
 * MemberVO : Value Object
 * TABLE : MEMBER
 */
package sthjava;

import java.sql.Date;

public class CleansingOrderVO {
	private String cid;
	private String shape;
	private String color;
	private String thickness;
	private int quantity;
	private String packing;
	private String delivery;
	
	CleansingOrderVO() {}

	public CleansingOrderVO(String cid, String shape, String color, String thickness, int quantity, String packing, String delivery) {
		super();
		this.cid = cid;
		this.shape = shape;
		this.color = color;
		this.thickness = thickness;
		this.quantity = quantity;
		this.packing = packing;
		this.delivery = delivery;
	}

//	public CleansingOrderVO(String cid, String cname, String pwd, String email, String tel, String company, Date regdate) {
//		super();
//		this.cid = cid;
//		this.cname = cname;
//		this.pwd = pwd;
//		this.email = email;
//		this.tel = tel;
//		this.company = company;
//		this.regdate = regdate;
//		
//	}

	public String getCid() {
		return cid;
	}

	public void setCid(String cid) {
		this.cid = cid;
	}

//	public String getOrderNumber() {
//		return order_number;
//	}
//
//	public void setOrderNumber(String order_number) {
//		this.order_number = order_number;
//	}

	public String getShape() {
		return shape;
	}

	public void setShape(String shape) {
		this.shape = shape;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getThickness() {
		return thickness;
	}

	public void setThickness(String thickness) {
		this.thickness = thickness;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public String getPacking() {
		return packing;
	}

	public void setPacking(String packing) {
		this.packing = packing;
	}

	public String getDelivery() {
		return delivery;
	}

	public void setDelivery(String delivery) {
		this.delivery = delivery;
	}


//	public Date getOrderDate() {
//		return order_date;
//	}
//
//	public void setOrderDate(Date order_date) {
//		this.order_date = order_date;
//	}

}
