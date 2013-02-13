package Reciver;

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
	ArrayList<GeoPoint>  GeoRoad = new ArrayList<GeoPoint>();

	@Override
	public void onReceive(Context mcontext, Intent road) {
		

			Log.i("RESULT", road.getStringExtra("road"));
			
			
			try {
				 roadArray = new JSONArray(road.getStringExtra("road"));
		
			JSONArray relation;
	
				relation=roadArray.getJSONArray(1);
				JSONObject tmpRela;
				
				   for (int i = 0; i < relation.length(); i++) {
					   tmpRela=relation.getJSONObject(i);
					   
					//   GeoRoad.add(new GeoPoint(tmpRela.getString("start_node_id")));
					   
					   
				   }
			
				
			
		    /** GeoPoint gPt0 = new GeoPoint(51500000, -150000);
		       // GeoPoint gPt1 = new GeoPoint(gPt0.getLatitudeE6()+ mIncr, gPt0.getLongitudeE6());
		        //GeoPoint gPt2 = new GeoPoint(gPt0.getLatitudeE6()+ mIncr, gPt0.getLongitudeE6() + mIncr);
		        //GeoPoint gPt3 = new GeoPoint(gPt0.getLatitudeE6(), gPt0.getLongitudeE6() + mIncr);
		       // mMapController.setCenter(gPt0);
		        PathOverlay myPath = new PathOverlay(Color.RED, this);
		        myPath.addPoint(gPt0);
		        myPath.addPoint(gPt1);
		        myPath.addPoint(gPt2);
		        myPath.addPoint(gPt3);
		        myPath.addPoint(gPt0);
		       // mMapView.getOverlays().add(myPath);*/
				
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		
	}

}
