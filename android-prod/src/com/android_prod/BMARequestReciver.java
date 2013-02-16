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

private static String bike="";
private static  String bus="";
private static String Train="";
private static String Borne="";
private static String metro="";
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
			    display();
						
			}

			// When map is ready
			public void isReady(){
			waitMap=true;
			display();
			}
			
			private void display()
			{
				
				Log.i(" READY", "D"+internaGarde+"M"+waitMap);
					// to garde to be sure allez data can be acces
				if(waitMap && internaGarde){
				MapViewClass.majData(bike, bus, metro, Borne, Train);
				internaGarde=false;
				waitMap=false;
				}
			}
	    

}
