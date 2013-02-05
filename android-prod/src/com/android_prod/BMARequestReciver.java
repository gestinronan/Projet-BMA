package com.android_prod;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class BMARequestReciver extends BroadcastReceiver {
	
	public BMARequestReciver()
	{
		
	}
	
			public void onReceive(Context context, Intent intent) {
				
				Log.d("BACK DATA", "TEST ");
			
			       
			      MapViewClass. majData(intent.getStringExtra("bikeData"),intent.getStringExtra("busData"),intent.getStringExtra("metroData"),intent.getStringExtra("borneData"));
			}
			

		
	    

}
