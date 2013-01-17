package com.android_prod;

//~--- non-JDK imports --------------------------------------------------------

import android.content.Context;
import android.content.Intent;

import android.os.AsyncTask;

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

public class HttpRequestClass extends AsyncTask<Void, Integer, Void> {

    // Variable
    Context mContext;
    Intent  intent;
    String  dataBike;    // dataBike;
    String  dataBus;    // dataBus;
    String  dataMetro;    // datametro;

	 String FILENAME_BIKE = "bike.json";
	 String FILENAME_BUS = "bus.json";
	 String FILENAME_METRO = "metro.json";
    
    FileOutputStream fos;
    FileInputStream fis;
   

    // Constuctor
    public HttpRequestClass(Context context, Intent i) {
        mContext = context;
        intent   = i;
    }

    @SuppressWarnings("null")
    protected Void doInBackground(Void... arg0) {
    	
    	/**FOR Bike*/
 		
 		dataBike =callServer("http://data.keolis-rennes.com/json/?version=2.0&key=FR6UMKCXT1TY5GJ&cmd=getbikestations",FILENAME_BIKE,5000);
 		/**For Metro*/
 		dataMetro =callServer("http://148.60.11.208:3000/android/data/metro",FILENAME_METRO,5000);
 		//Log.i("ERROR", dataBus);
 		
        return null;
    }

    // Executed once the calls are done
    protected void onPostExecute(Void result) {
    	
        // Then put data in the intent
        intent.putExtra("bikeData", dataBike);
       intent.putExtra("metroData", dataMetro);
        // Start the other Activity
        mContext.startActivity(intent);
    }
    
  
    @Override
	protected void onProgressUpdate(Integer... values){
		super.onProgressUpdate(values);
		// Mise à jour donné
		
		/*FOR Bike*/
 		
		dataBike =callServer("http://data.keolis-rennes.com/json/?version=2.0&key=FR6UMKCXT1TY5GJ&cmd=getbikestations",FILENAME_BIKE,5000);
 		/*For Metro*/

 		dataMetro =callServer("http://148.60.11.208:3000/android/data/metro",FILENAME_METRO,5000);
		
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
          /*  if(sb.charAt(0) == '[')
            {
            	
            	sb.replace(0, 1, "{\"opendata:\"");
            }
            int lastchar=sb.length()-1;	
           if(sb.charAt(lastchar) == ']')
           {
        	   sb.replace(lastchar-1, lastchar, "}");
           }*/
           
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
