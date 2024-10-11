package com.trustping.domain;


public class PedalLog {
	private int carId;
	private int aclPedal;
	private int brkPedal;
	private String createdAt;
	private String driveState;
	
	public PedalLog() {
		super();
	}

	public int getCarId() {
		return carId;
	}

	public void setCarId(int carId) {
		this.carId = carId;
	}

	public int getAclPedal() {
		return aclPedal;
	}

	public void setAclPedal(int aclPedal) {
		this.aclPedal = aclPedal;
	}

	public int getBrkPedal() {
		return brkPedal;
	}

	public void setBrkPedal(int brkPedal) {
		this.brkPedal = brkPedal;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}

	public String getDriveState() {
		return driveState;
	}

	public void setDriveState(String driveState) {
		this.driveState = driveState;
	}
	
}
