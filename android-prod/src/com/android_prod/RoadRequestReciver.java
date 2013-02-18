package com.android_prod;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osmdroid.bonuspack.routing.Road;
import org.osmdroid.bonuspack.routing.RoadManager;
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
	
	   /** ************************************************* */
	   private static ArrayList<GeoPoint>  GeoRoad = new ArrayList<GeoPoint>();
	@Override
	public void onReceive(Context mcontext, Intent road) {
		

			Log.i("RESULT", road.getStringExtra("road"));
			
			 try {
				 JSONObject test = new JSONObject(road.getStringExtra("road"));
				roadArray = test.getJSONArray("relations");
					
					JSONObject tmpRela;
					
					   for (int i = 0; i < roadArray.length(); i++) {
						   tmpRela=roadArray.getJSONObject(i);
						  
						 GeoRoad.add(MapViewClass.roadtrip.get(tmpRela.getString("Start_Stop_id")));
						 GeoRoad.add(MapViewClass.roadtrip.get(tmpRela.getString("End_Stop_id"))); 
						   
					   }

					   
					   Road road1 = MapViewClass.roadManager.getRoad(GeoRoad);
				        PathOverlay roadOverlay = RoadManager.buildRoadOverlay(road1, MapViewClass.mapView.getContext());
				
				MapViewClass.drawRoad(roadOverlay);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		
	}

}
