
/******
 * This is the first view.
 * THis will get the data from the server and then go the the map view.
 * **************/


package com.esir.bmaandroidonly;

import com.esir.bmaandroidonly.HttpRequestClass;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;

public class MainActivity extends Activity {

	// Thread variable
	Boolean busEnded, bikeEnded;
	String busResult, bikeResult;
	Context context;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		//
		context = this;
		
		// Create an intent
		Intent intent = new Intent(MainActivity.this, MapViewClass.class); 
		
		
		/******** Get raid of the http request ****/
		
		String dataBus = "";
		String dataBike = "";
		intent.putExtra("busData", dataBus);
		intent.putExtra("bikeData", dataBike);
		
		// Start the other Activity
		startActivity(intent);
		/*******************************************/
		
		// Create an object of the call HttpRequest
		//HttpRequestClass request = new HttpRequestClass(context, intent);
		//request.execute();

	}


	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}

}
