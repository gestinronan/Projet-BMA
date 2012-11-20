package com.example.bma;

import org.osmdroid.tileprovider.tilesource.TileSourceFactory;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapController;
import org.osmdroid.views.MapView;

import android.app.Activity;
import android.content.Intent;
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


public class MapViewClass extends Activity{

	/************** Global variable declaration *********/
	
	// Map Variable
	private MapController mapController;
	private MapView mapView;

	// Layout element
	ImageButton locateMe;
	Button valider, handle;
	SlidingDrawer slidingMenu;

	// Geolocation variable
	double myLat, myLng;
	
	/*****************************************************/
	/********* On create Mehtod First launch *************/
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.map_view);

		// We get the data from the intent
		Intent intent = getIntent();
		String lng = intent.getStringExtra("longitude");
		String lat = intent.getStringExtra("latitude");

		// We parse the String into double
		myLat = new Double(lat);
		myLng = new Double(lng);

		// We get the layout elements
		mapView = (MapView) findViewById(R.id.mapview);
		handle = (Button) findViewById(R.id.slideButton);
		slidingMenu = (SlidingDrawer) findViewById(R.id.drawer);
		locateMe = (ImageButton) findViewById(R.id.locateMe);

		// Set listener on the layout elements
		locateMe.setOnClickListener(locateMeListener);

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


		mapView.setTileSource(TileSourceFactory.MAPNIK);
		mapView.setBuiltInZoomControls(true);
		mapController = mapView.getController();
		mapController.setZoom(15);
		GeoPoint point2 = new GeoPoint(myLat, myLng);
		mapController.setCenter(point2);
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
}

