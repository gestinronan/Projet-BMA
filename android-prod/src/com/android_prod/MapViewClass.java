package com.android_prod;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osmdroid.tileprovider.tilesource.TileSourceFactory;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapController;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.ItemizedIconOverlay;
import org.osmdroid.views.overlay.OverlayItem;
import org.osmdroid.views.overlay.ScaleBarOverlay;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.SlidingDrawer;
import android.widget.SlidingDrawer.OnDrawerCloseListener;
import android.widget.SlidingDrawer.OnDrawerOpenListener;

public class MapViewClass extends Activity {


	/************** Global variable declaration *********/
	
	// 
	Context mcontext;  

	// Map Variable
	private MapController mapController;
	private MapView mapView;

	// Layout element
	ImageButton locateMe;
	Button valider, handle;
	SlidingDrawer slidingMenu;

	// Geolocation variable
	double myLat, myLng;

	// Marker variable
	ArrayList<OverlayItem> anotherOverlayItemArray;
	ArrayList<OverlayItem> bikeOverlayItemArray;
	ItemizedIconOverlay<OverlayItem> bikeItemizedIconOverlay;
	Drawable bikeMarker;

	// Intent value
	JSONObject bikeData;
	String bikeIntent;

	/*****************************************************/
	/********* On create Mehtod First launch *************/
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.map_view);
		
		// Initiate the mcontext variable
		mcontext = this;
		
		// We get the data from the intent
		Intent intent = getIntent();
		String lng = intent.getStringExtra("longitude");
		String lat = intent.getStringExtra("latitude");
		bikeIntent = intent.getStringExtra("bikedata");
		
		// We parse the String into double
//		if (!lat.equals(null) && !lng.equals(null))
//		{
//		myLat = new Double(lat);
//		myLng = new Double(lng);
//		}

		// And the String into Json 
		try{
			bikeData = new JSONObject(bikeIntent);
		}catch(JSONException e){
			System.out.println("Error parsing data " + e.toString());
		}

		// We get the layout elements
		mapView = (MapView) findViewById(R.id.mapview);
		handle = (Button) findViewById(R.id.slideButton);
		slidingMenu = (SlidingDrawer) findViewById(R.id.drawer);
		locateMe = (ImageButton) findViewById(R.id.locateMe);
		valider = (Button) findViewById(R.id.valider);
		
		// Define the marker
		bikeMarker = this.getResources().getDrawable(R.drawable.greenpoint);

		// Set listener on the layout elements
		locateMe.setOnClickListener(locateMeListener);
		valider.setOnClickListener(validerListener);

		/*************** Sliding Drawer Listener ***************/
		// Set the sliding drawer
		handle.setBackgroundResource(R.drawable.downarrow);

		// Listener on open event of sliding drawer
		slidingMenu.setOnDrawerOpenListener(new OnDrawerOpenListener() {
			@Override
			public void onDrawerOpened() {
				handle.setBackgroundResource(R.drawable.uparrow);
			}
		});

		// Listener on Close event of Sliding drawer
		slidingMenu.setOnDrawerCloseListener(new OnDrawerCloseListener() {
			@Override
			public void onDrawerClosed() {
				handle.setBackgroundResource(R.drawable.downarrow);
			}
		});
		/*****************************************************/

		// Controle the map
		mapView.setTileSource(TileSourceFactory.MAPNIK);
		mapView.setBuiltInZoomControls(true);
		mapController = mapView.getController();
		mapController.setZoom(13);
		GeoPoint point2 = new GeoPoint(myLat, myLng);
		mapController.setCenter(point2);

		/*************** This is an example *******************/
		// Create a geopoint marker
		anotherOverlayItemArray = new ArrayList<OverlayItem>();
		anotherOverlayItemArray.add(new OverlayItem("Hello", "Here I am", new GeoPoint(myLat, myLng)));

		// Copy the marker array into another table
		ItemizedIconOverlay<OverlayItem> anotherItemizedIconOverlay 
		= new ItemizedIconOverlay<OverlayItem>(
				this, anotherOverlayItemArray, null);

		// Add the overlays on the map
	mapView.getOverlays().add(anotherItemizedIconOverlay);
		/*****************************************************/


		//Add Scale Bar
		ScaleBarOverlay myScaleBarOverlay = new ScaleBarOverlay(this);
		mapView.getOverlays().add(myScaleBarOverlay);
	}
	/*****************************************************/
	/************** Is route display method **************/
	protected boolean isRouteDisplayed() {
		// TODO Auto-generated method stub
		return false;
	}
	/*****************************************************/
	/*** Method launch on start. Create the action Bar ***/
	public boolean onCreateOptionsMenu(Menu menu) {

		getMenuInflater().inflate(R.menu.activity_main, menu); // Get the action Bar from the menu
		getActionBar().setDisplayShowTitleEnabled(false); // Hide the Title of the app in the action bar
		getActionBar().setDisplayShowHomeEnabled(false); // Hide the Icon of the app in the action bar
		return true;
	}
	/*****************************************************/
	/*** Manage the Tap on buttons of the Action Bar *****/
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case R.id.menu_search:

			// Comportement du bouton "Recherche"
			return true;
		case R.id.menu_settings:

			// Change activity to settings menu
			return true;
		default:
			return super.onOptionsItemSelected(item);
		}
	}
	/*****************************************************/

	/******************** Listener ************************/

	/********* Listener for the Locate me Button **********/
	private OnClickListener locateMeListener = new OnClickListener() {

		@Override
		public void onClick(View arg0) {

			// Create the GeoPoint
			GeoPoint p = new GeoPoint((int) (myLat * 1E6), (int) (myLng * 1E6));

			// If there already is a marker we remove it
			/*if(myPosition != null){
				mapView.getOverlays().remove(myPosition);
			}

			// Create the marker
			myPosition = new OverlayItem(p, "Position Actuel", "Where you are");

			// Add it to the map 
			myPositionOverlay.addOverlay(myPosition);
			mapOverlays.add(myPositionOverlay);

			mc.animateTo(p);
			mc.setCenter(p);*/

		}
	};
	/******************************************************/

	/************Listener fir the valider button************/
	private OnClickListener validerListener= new OnClickListener() {

		@Override
		public void onClick(View v) {
			
			// Close the sliding drawer
			slidingMenu.close();
			
			/********* This display all the bike station *********/
			// Call the method that create a item array
			bikeOverlayItemArray = displayPoint(bikeData);

			// Add the array into another array with some parameters
			bikeItemizedIconOverlay = new ItemizedIconOverlay<OverlayItem>(mcontext, bikeOverlayItemArray, null);

			// Add the overlays into the map
			mapView.getOverlays().add(bikeItemizedIconOverlay);
			/******************************************************/
			
		}

	};
	/******************************************************/
	/********** Display a list of point into marker *******/
	public ArrayList<OverlayItem> displayPoint(JSONObject dataJson){

		// Declare variables
		JSONObject openData;
		JSONArray  station = null;

		// Then we get the part of the JSON that we want
		try {
			openData = dataJson.getJSONObject("opendata");
			JSONObject answer = openData.getJSONObject("answer");
			JSONObject data = answer.getJSONObject("data");
			station = data.getJSONArray("station");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		//Loop the Array
		for(int i=0;i < station.length();i++){  

			// We get the data we want 
			JSONObject e;
			String name = null, bikeAvailable = null;
			double lng = 0, lat = 0;

			// Initiate the variable we need
			try {
				e = station.getJSONObject(i);
				// get the value
				lng = e.getDouble("longitude");
				lat = e.getDouble("latitude");
				name = e.getString("name");
				bikeAvailable = String.valueOf(e.getDouble("bikesavailable"));
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

			//Create the overlay and add it to the array
			anotherOverlayItemArray = new ArrayList<OverlayItem>();
			
			// Create a overlay for a special position
			OverlayItem marker = new OverlayItem(name, bikeAvailable, new GeoPoint(lat, lng));
			
			// Add the graphics to the marker
			marker.setMarker(bikeMarker);
			
			// Add the marker into the list
			anotherOverlayItemArray.add(marker);
		}
		return anotherOverlayItemArray;

	}

	/*******************************************************/

}
