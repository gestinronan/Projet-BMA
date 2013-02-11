package com.android_prod;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;


/**
 * reciver for information comming to the intent service and he call static method inside the activity
 * @author ronan
 *
 */
public class BMARequestReciver extends BroadcastReceiver {
	
	
	private String Bike;
	private String Bus;
	private String Metro;
	private String Borne;
	
	public BMARequestReciver()
	{
		
	}
	
			public void onReceive(Context context, Intent intent) {
				
				Log.d("BACK DATA", "TEST ");
			
			       
			      //MapViewClass. majData(intent.getStringExtra("bikeData"),intent.getStringExtra("busData"),intent.getStringExtra("metroData"),intent.getStringExtra("borneData"));
						Bike=intent.getStringExtra("bikeData");
						Bus=intent.getStringExtra("busData");
						Metro=intent.getStringExtra("metroData");
						Borne=intent.getStringExtra("borneData");
			}
			
			public String getBus(){
				return Bus;
			}
			public String getBike(){
				return Bike;
			}
			public String getMetro(){
				return Metro;
			}
			public String getBorne(){
				return Borne;
			}

		
	    

}
