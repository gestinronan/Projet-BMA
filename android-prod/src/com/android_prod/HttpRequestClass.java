package com.android_prod;

//~--- non-JDK imports --------------------------------------------------------

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;

import android.os.AsyncTask;
import android.os.Bundle;
import android.os.CountDownTimer;

import android.util.Log;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

//~--- JDK imports ------------------------------------------------------------

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;

import java.net.URI;

public class HttpRequestClass extends IntentService {

	Context mContext= this;
    public String  dataBike;    // dataBike;
    public String  dataBus;    // dataBus;
    public String  dataMetro;    // datametro;
    public String  dataBorne;    // datametro;

	 String FILENAME_BIKE = "bike.json";
	 String FILENAME_BUS = "bus.json";
	 String FILENAME_METRO = "metro.json";
	 String FILENAME_BORNE = "borne.json";
    
    FileOutputStream fos;
    FileInputStream fis;
    boolean fristExe= true;
    public static String BROADCAST_ACTION = "com.android_prod.MapViewClass.event";
    // Constuctor
    public HttpRequestClass() {
    	super("myservices");
       
    }


  




@Override
protected void onHandleIntent(Intent intent) {
	// TODO Auto-generated method stub
	
	Log.i("TEST", "in the class");
	// Mise � jour donn�
	
	/*FOR Bike*/
		
	dataBike =callServer("http://data.keolis-rennes.com/json/?version=2.0&key=FR6UMKCXT1TY5GJ&cmd=getbikestations",FILENAME_BIKE,5000);
		/*For Metro*/

		dataMetro =callServer("http://148.60.11.208:3000/android/data/metro",FILENAME_METRO,50);
		
		/*For bus*/

		dataBus =callServer("http://148.60.11.208:3000/android/data/bus",FILENAME_BUS,50);
	
		dataBorne =callServer("http://148.60.11.208:3000/android/data/borneelec",FILENAME_BORNE,50);
		
		
		Intent activityIntent= new Intent(HttpRequestClass.this, MapViewClass.class);
		Intent BrIntent= new Intent(BROADCAST_ACTION);
        // Then put data in the intent
		BrIntent.putExtra("bikeData", dataBike);
		BrIntent.putExtra("metroData", dataMetro);
		BrIntent.putExtra("busData", dataBus);
		BrIntent.putExtra("borneData", dataBorne);
        // Start the other Activity
       	activityIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
   
       	
        mContext.startActivity(activityIntent);
       
        
        sendBroadcast(BrIntent);
        Log.i("TEST", "SENT");
	
}





/** method use to do serveur call*/
public String callServer(String URL, String nameCacheFile, int timeUpdate)
{
	
  String result = "";
		
		
try {
			
// First we create the variable for the call
	InputStream is         = null;

	
			File file = mContext.getFileStreamPath(nameCacheFile);
			if(!file.exists() || (file.lastModified() < timeUpdate && timeUpdate!=-1)) // if the file do not excite 
			{
				
				 
		

    /** *** Get data *** */

   

    // First get
    try {
        HttpClient httpclient = new DefaultHttpClient();
        HttpGet request = new HttpGet();
        request.setURI(new URI(URL));
        HttpResponse response = httpclient.execute(request);
        HttpEntity   entity   = response.getEntity();

        is = entity.getContent();
    } catch (Exception e) {
    	Log.i("Error in http connection " , e.getMessage());
    }

    // Now we convert the response into a String
    try {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is, "iso-8859-1"), 8);
        StringBuilder  sb     = new StringBuilder();
        String         line   = null;

        while ((line = reader.readLine()) != null) {
            sb.append(line + "\n");
        }

       
        result = sb.toString();
        is.close();
        Log.i("download info" , result); // log info
       
    } catch (Exception e) {
    	Log.i("Error converting result " , e.getMessage());
    }
  
    // wirte in data cache file
    fos = mContext.openFileOutput(nameCacheFile, Context.MODE_PRIVATE);
	fos.write(result.getBytes());	
	
	
	 // return result;
	fos.close();

			}
			else
			{	
			
				// read in the data cache file
				fis=mContext.openFileInput(nameCacheFile);
				InputStreamReader isr = new InputStreamReader(fis);
		        BufferedReader br = new BufferedReader(isr);
		       StringBuilder  sbtmp     = new StringBuilder();
		        String tmp=null;
		       while ((tmp = br.readLine()) != null) {
	                sbtmp.append(tmp + "\n");
	            }
	    
	           
	            result = sbtmp.toString();
				fis.close();
				
				Log.i("Reading file" , result); // log info
				
				//return result;
			}
    
		} catch (Exception e) {
			Log.i(" Exception :", e.getMessage()); // Exception traces
		}

return result;
}


}






//~ Formatted by Jindent --- http://www.jindent.com
