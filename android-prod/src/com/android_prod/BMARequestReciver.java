package com.android_prod;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.util.Log;




/**
 * reciver for information comming to the intent service and he call static method inside the activity
 * @author ronan
 *
 */
public  class BMARequestReciver extends BroadcastReceiver {

private String bike;
private String bus;
private String Train;
private String Borne;
private String metro;
private static boolean waitMap= false;
private static boolean internaGarde=false;

			public BMARequestReciver()
			{
				
			}
	

			public void onReceive(Context context, Intent intent) {
				
			
				
			     bike=intent.getStringExtra("bikeData");
			     bus=intent.getStringExtra("busData");
			     metro=intent.getStringExtra("metroData");
			    Borne= intent.getStringExtra("borneData");
			    Train= intent.getStringExtra("trainData");
			    internaGarde=true;
			    Log.i("DATA READY", "END WAIT DATA");
			    display();
						
			}

			// When map is ready
			public void isReady(){
				
			Log.i("MAP READY", "END WAIT MAP");
			waitMap=true;
			display();
			}
			
			private void display()
			{
				
				Log.i(" READY", "D"+internaGarde+"M"+waitMap);
					// to garde to be sure allez data can be acces
				if(waitMap && internaGarde){
					Log.i("READY", "NICE");
				MapViewClass.majData(bike, bus, metro, Borne, Train);
				internaGarde=false;
				waitMap=false;
				}
			}
	    

}
