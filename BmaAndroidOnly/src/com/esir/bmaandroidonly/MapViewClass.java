package com.esir.bmaandroidonly;

// This class create the map and place the marker. 

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.OverlayItem;

public class MapViewClass extends MapActivity implements LocationListener{

	// Data variable
	String busResult, bikeResult;
	JSONObject bikeData, busData;

	// Map variable
	private MapController mc; 
	MapView mapView;

	// Location listener
	private LocationManager lm;

	// Geolocation variable
	double myLat, myLng;

	// Marker variable
	MapOverlayBma itemizedoverlay, myPositionOverlay = null;
	List<Overlay> mapOverlays;            // List that contains only the current position
	List<Overlay> bikeOverlays = null;    // List that contains all the bike station
	List<Overlay> busOverlays = null;     // List that contains all the bus stop
	Drawable drawable, myPositionLogo;
	OverlayItem myPosition = null;

	// Layout element
	ImageButton locateMe;
	Button busStop, bikeStop;
	LinearLayout settingLayout;

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_map);

		// Location listner
		lm = (LocationManager) this.getSystemService(LOCATION_SERVICE);
		if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER))
			lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 0,
					this);
		lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 10000, 0,
				this);

		// We get the layout element
		mapView = (MapView) findViewById(R.id.mapview);
		locateMe = (ImageButton) findViewById(R.id.locateMe);
		busStop = (Button) findViewById(R.id.busButton);
		bikeStop = (Button) findViewById(R.id.bikeButton);

		// Add the Listener to the Button
		locateMe.setOnClickListener(locateMeListener);
		busStop.setOnClickListener(busStopListener);
		bikeStop.setOnClickListener(bikeStopListener);

		// Marker on the map
		mapOverlays = mapView.getOverlays();
		drawable = this.getResources().getDrawable(R.drawable.androidmarker);     // This is the picture for all other points
		myPositionLogo = this.getResources().getDrawable(R.drawable.mylocation);  // This is the picture for the current location


		// Pass the context to the other class
		itemizedoverlay = new MapOverlayBma(drawable, this);         // This instance of the marker class is made for bus & bike
		myPositionOverlay = new MapOverlayBma(myPositionLogo, this); // This instance of the marker class is made for the current position

		// Set the Map
		mapView.setBuiltInZoomControls(true);
		mc = mapView.getController();
		mc.setZoom(13);

		// First we get the data back from the intent
		Intent intent = getIntent();
		busResult = intent.getStringExtra("busData");
		bikeResult = intent.getStringExtra("bikeData");

	}

	@Override
	protected boolean isRouteDisplayed() {
		// TODO Auto-generated method stub
		return false;
	}

	/************* Geolocation methods *********/

	@Override
	public void onLocationChanged(Location location) {

		// Copy the longitude and latitude in global variable
		myLat = location.getLatitude();
		myLng = location.getLongitude();

	}

	@Override
	public void onProviderDisabled(String provider) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onProviderEnabled(String provider) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		// TODO Auto-generated method stub

	}

	/************* Listener methods ************/

	// Listener for the locate me button
	private OnClickListener locateMeListener = new OnClickListener() {

		@Override
		public void onClick(View arg0) {

			// Create the GeoPoint
			GeoPoint p = new GeoPoint((int) (myLat * 1E6), (int) (myLng * 1E6));

			// If there already is a marker we remove it
			if(myPosition != null){
				mapView.getOverlays().remove(myPosition);
			}

			// Create the marker
			myPosition = new OverlayItem(p, "Position Actuel", "Where you are");

			// Add it to the map 
			myPositionOverlay.addOverlay(myPosition);
			mapOverlays.add(myPositionOverlay);

			mc.animateTo(p);
			mc.setCenter(p);

		}

	};

	// Listener for the bus Stop button
	private OnClickListener busStopListener = new OnClickListener() {

		@Override
		public void onClick(View arg0) {

			// If the bike list is display, we remove it
			/*if(bikeOverlays != null){
				Iterator i = bikeOverlays.iterator();

				// Go over the list
				while(i.hasNext()){

					// Get each element
					OverlayItem overlay = (OverlayItem) i.next();
					mapView.getOverlays().remove(overlay);
				}
				bikeOverlays = null;
			}*/


			// First we convert the data into a JSON Object
			try{
				busData = new JSONObject(busResult);
			}catch(JSONException e){
				System.out.println("Error parsing data " + e.toString());
			}
			
			// Check if the data are convert
			System.out.println("JSONObject: " + busData);

			// Then we create a marker list
			JSONObject openData;
			JSONArray  station = null;
			try {
				openData = busData.getJSONObject("opendata");
				JSONObject answer = openData.getJSONObject("answer");
				JSONObject data = answer.getJSONObject("data");
				station = data.getJSONArray("station");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			//Loop the Array
			for(int i=0;i < station.length();i++){

				JSONObject e;
				try {
					e = station.getJSONObject(i);

					// We get the geolocation and convert it into double
					double lng = e.getDouble("longitude");
					double lat= e.getDouble("latitude");

					// Create the Geopoint of each stop
					GeoPoint p = new GeoPoint((int) (lat * 1E6), (int) (lng * 1E6));

					// Create the overlay
					OverlayItem busPosition = new OverlayItem(p, e.getString("name"), "");
					itemizedoverlay.addOverlay(busPosition);

					// Copy the point into the list
					busOverlays.add(itemizedoverlay);

					// And Display the marker on the map
					mc.animateTo(p);
					mc.setCenter(p);


				} catch (JSONException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}	
			}


		}

	};

	// Listener for the Bike stop button
	private OnClickListener bikeStopListener = new OnClickListener() {

		@Override
		public void onClick(View arg0) {

			// If the bus list is display, we remove it
			/*if(busOverlays != null){
				Iterator i = busOverlays.iterator();

				// Go over the list
				while(i.hasNext()){

					// Get each element
					OverlayItem overlay = (OverlayItem) i.next();
					mapView.getOverlays().remove(overlay);
				}
				busOverlays = null;
			}*/


			// First we convert the data into a JSON Object
			try{
				bikeData = new JSONObject(bikeResult);
			}catch(JSONException e){
				System.out.println("Error parsing data " + e.toString());
			}

			// Then we create a marker list
			JSONObject openData;
			JSONArray  station = null;
			try {
				openData = bikeData.getJSONObject("opendata");
				JSONObject answer = openData.getJSONObject("answer");
				JSONObject data = answer.getJSONObject("data");
				station = data.getJSONArray("station");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			//Loop the Array
			for(int i=0;i < station.length();i++){

				JSONObject e;
				try {
					e = station.getJSONObject(i);

					// We get the geolocation and convert it into double
					double lng = e.getDouble("longitude");
					double lat= e.getDouble("latitude");

					// Create the Geopoint of each stop
					GeoPoint p = new GeoPoint((int) (lat * 1E6), (int) (lng * 1E6));

					// Create the overlay
					OverlayItem bikePosition = new OverlayItem(p, e.getString("name"), "Bikes Available: " + e.getString("bikesavailable"));
					itemizedoverlay.addOverlay(bikePosition);

					// Copy the point into the list
					bikeOverlays.add(itemizedoverlay);

					// And Display the marker on the map
					mc.animateTo(p);
					mc.setCenter(p);


				} catch (JSONException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}	
			}

		}
	};
}

