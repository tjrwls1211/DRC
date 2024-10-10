package com.trustping.domain;

public class PedalLog {
	private int car_id;
	private int acl_pedal;
	private int brk_pedal;
	private String createAt;
	
	public PedalLog() {
		super();
	}

	public int getCar_id() {
		return car_id;
	}

	public void setCar_id(int car_id) {
		this.car_id = car_id;
	}

	public int getAcl_pedal() {
		return acl_pedal;
	}

	public void setAcl_pedal(int acl_pedal) {
		this.acl_pedal = acl_pedal;
	}

	public int getBrk_pedal() {
		return brk_pedal;
	}

	public void setBrk_pedal(int brk_pedal) {
		this.brk_pedal = brk_pedal;
	}

	public String getCreateAt() {
		return createAt;
	}

	public void setCreateAt(String createAt) {
		this.createAt = createAt;
	}
	
	
	
	
}
