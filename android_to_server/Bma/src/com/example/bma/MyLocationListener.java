package com.example.bma;

import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;

public class MyLocationListener implements LocationListener{

	public double longitude;
	public double latitude;

	@Override
	public void onLocationChanged(Location location) {

		longitude = location.getLongitude();
		latitude = location.getLatitude();

	}

	@Override
	public void onProviderDisabled(String provider) {
		System.out.println("Provider disabled");		
	}

	@Override
	public void onProviderEnabled(String provider) {
		System.out.println("Provider Enabled");		
	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		System.out.println("Status changed");

	}

}
