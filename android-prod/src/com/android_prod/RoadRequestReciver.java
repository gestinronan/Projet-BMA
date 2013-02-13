package com.android_prod;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.overlay.PathOverlay;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * 
 * @author ronan
 *use to display the road send by the server
 */

public class RoadRequestReciver extends BroadcastReceiver {
	
	
	JSONArray  roadArray;
	

	@Override
	public void onReceive(Context mcontext, Intent road) {
		

			Log.i("RESULT", road.getStringExtra("road"));
			
			 try {
				roadArray = new JSONArray(road.getStringExtra("road"));
				
				//MapViewClass.drawRoad(roadArray);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		
	}

}
