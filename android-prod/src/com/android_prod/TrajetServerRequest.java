package com.android_prod;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

/**
 * server POST to get information
 * @author ronan
 *
 */
public class TrajetServerRequest extends IntentService {
	
    // to see if it's the good intent
    public static String BROADCAST_ACTION_SEND = "com.android_prod.MapViewClass.sender";
    private String result;
	public TrajetServerRequest() {
		super("trajet");
		
	}

	@Override
	protected void onHandleIntent(Intent intent) {
		
	    /** *** post data *** */
// First we create the variable for the call
		InputStream is         = null;

	 // First post
	    try {
	        HttpClient httpclient = new DefaultHttpClient();
	        HttpPost request = new HttpPost();
	        request.setURI(new URI("http://148.60.11.208:3000/android/data/getroutes"));
	        HttpParams params = new BasicHttpParams();
	        params.setParameter("dep", intent.getStringExtra("Dep"));
	        params.setParameter("Arr", intent.getStringExtra("Arr"));
	        request.setParams(params);
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
		
		Intent road=new Intent(TrajetServerRequest.BROADCAST_ACTION_SEND);
		road.putExtra("road", result);
		  // send this information
        sendBroadcast(road);
	}

}
