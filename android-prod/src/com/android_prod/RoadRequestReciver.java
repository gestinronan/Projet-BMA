package com.android_prod;

import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osmdroid.bonuspack.routing.Road;
import org.osmdroid.bonuspack.routing.RoadManager;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.overlay.PathOverlay;

import working.RoadGetter;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;

/**
 * 
 * @author ronan
 *use to display the road send by the server
 */

public class RoadRequestReciver extends BroadcastReceiver {


	// List to save roads
	private ArrayList<PathOverlay> roadList = new ArrayList<PathOverlay>(); 
	private static ArrayList<GeoPoint>  GeoRoad = new ArrayList<GeoPoint>();

	JSONArray  roadArray;

	/** ************************************************* */

	@Override
	public void onReceive(Context mcontext, Intent road) {


		Log.i("RESULT", road.getStringExtra("road"));

		try {
			JSONObject test = new JSONObject(road.getStringExtra("road"));
			roadArray = test.getJSONArray("relations");

			JSONObject tmpRela;

			for (int i = 0; i < roadArray.length(); i++) {
				tmpRela=roadArray.getJSONObject(i);

				GeoRoad.add(MapViewClass.roadtrip.get(tmpRela.getString("Start_Stop_id")));			// Get the start point
				GeoRoad.add(MapViewClass.roadtrip.get(tmpRela.getString("End_Stop_id"))); 			// Get the endpoint
				//GeoRoad.add(MapViewClass.roadtrip.get(tmpRela.getString("type")));					// Get the type 

				RoadGetter testroad = new RoadGetter();
				Object [] param = new Object[1];
				param[0] = GeoRoad;
				
				// appel asycnhrone de creation des route 
				testroad.execute(param);
				
				Road road1;

				road1 = (Road) testroad.get();


				PathOverlay roadOverlay = RoadManager.buildRoadOverlay(road1, MapViewClass.mapView.getContext());
				
				// Set the road color depending of the type
				if(tmpRela.getString("type").equals("Bike")){
					roadOverlay.setColor(Color.GREEN);
				} else if(tmpRela.getString("type").equals("Metro")){
					roadOverlay.setColor(Color.RED);
				} else if(tmpRela.getString("type").equals("Foot")){
					roadOverlay.setColor(Color.YELLOW);
				} else if(tmpRela.getString("type").equals("Bus")){
					roadOverlay.setColor(Color.BLUE);
				}
				
				roadList.add(roadOverlay);


			}

			MapViewClass.drawRoad(roadList);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


	}

}
