package com.example.bma;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.bma.R;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends Activity {

	// Layout Variables
	TextView lng, lat;
	static TextView log;
	TextView alt;
	Button locateMe, sendPosition, getRequest;

	// Geolocation Variables
	static String myLng;
	static String myLat;
	static String myAlt;
	protected LocationManager locationManager;
	private static final long MINIMUM_TIME_BETWEEN_UPDATES = 1; // In meters
	private static final long MINIMUM_DISTANCE_CHANGE_FOR_UPDATES = 1000; // In Millisecondes

	// Http request Variable
	static String respFromServer;
	static String url;
	static HttpResponse response;
	static URI uri = null;
	static JSONObject dataFromServer, jArray;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		// Create the GPSlistenner
		locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		locationManager.requestLocationUpdates (LocationManager.GPS_PROVIDER,
				MINIMUM_TIME_BETWEEN_UPDATES,
				MINIMUM_DISTANCE_CHANGE_FOR_UPDATES,
				new MyLocationListener());

		// Get the layout element
		lng = (TextView) findViewById(R.id.longitude);
		lat = (TextView) findViewById(R.id.lattitude);
		alt = (TextView) findViewById(R.id.altitude);
		locateMe = (Button) findViewById(R.id.getPosition);
		log = (TextView) findViewById(R.id.logTextView);
		sendPosition = (Button) findViewById(R.id.httpRequest);
		getRequest = (Button) findViewById(R.id.httpGet);

		// Add a listener to the Locate Me Button
		locateMe.setOnClickListener(new Button.OnClickListener() {

			// Action when clicking the button
			public void onClick(View v) {
				getPosition();
				lng.setText("Longitude: " + myLng);
				lat.setText("Latitude: " + myLat);
				alt.setText("Altitude: " + myAlt);
			}
		});

		// Add a Listener to the Send Position Button
		sendPosition.setOnClickListener(new Button.OnClickListener() {

			// Action when clicking the button
			public void onClick(View arg0) {

				// Url use for the request
				url = "http://192.168.1.12:3000/android"; // set the url for the call
				log.setText("Making request.");
				// Call the server
				postHttp(url);

				// Display the response
				log.setText(respFromServer);
			}});

		// add a listener to the Get Data button
		getRequest.setOnClickListener(new Button.OnClickListener(){

			public void onClick(View arg0) {
				
				// We call the GET function
				dataFromServer = getHttpResponse("http://192.168.1.12:3000/android");
				System.out.println("Here is what we get from the server: " + dataFromServer);
				
				// Then we go to the list View
				Intent intent = new Intent(MainActivity.this, ListViewClass.class); 
				String jsonToString = dataFromServer.toString();
				intent.putExtra("data", jsonToString);
				startActivity(intent);
				
			}

		});

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}

	// Get GPS position
	private void getPosition(){

		Location location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
		double longitude = location.getLongitude();
		double latitude = location.getLatitude();
		double altitude = location.getAltitude();
		myLat = "" + latitude;
		myLng = "" + longitude;
		myAlt = "" + altitude;

	}

	// GET method for Http request
	public static JSONObject getHttpResponse(final String url) {

		// Create a new thread for the GET request
		new Thread(new Runnable(){

			public void run() {

				// First we create the variable for the call
				InputStream is = null;
				String result = "";

				// Then we make the reqest
				try{

					HttpClient httpclient = new DefaultHttpClient();

					HttpPost httppost = new HttpPost(url);
					HttpResponse response = httpclient.execute(httppost);
					HttpEntity entity = response.getEntity();
					is = entity.getContent();
				}catch(Exception e){
					System.out.println("Error in http connection " + e.toString());
				}

				// Now we convert the response into a String
				try{
					BufferedReader reader = new BufferedReader(new InputStreamReader(is,"iso-8859-1"),8);
					StringBuilder sb = new StringBuilder();
					String line = null;
					while ((line = reader.readLine()) != null) {
						sb.append(line + "\n");
					}
					is.close();
					result=sb.toString();
					//System.out.println("Here is the server result: " + result);
					
				}catch(Exception e){
					System.out.println("Error converting result " + e.toString());
				}

				// And we convert the String into a Json
				try{
					jArray = new JSONObject(result);
				}catch(JSONException e){
					System.out.println("Error parsing data " + e.toString());
				}
					
			}

		}).start();

		return jArray;
	}

	// POST method for Http Request
	public static void postHttp(String url){

		// Create a new thread for the POST request
		new Thread(new Runnable(){
			public void run() {

				// Create the request
				HttpPost httppost = new HttpPost("http://192.168.1.12:3000/android/data");

				// Add the parameter
				List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(); 
				nameValuePairs.add(new BasicNameValuePair("latitude", myLat));
				nameValuePairs.add(new BasicNameValuePair("longitude", myLng));
				try {
					httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

					// Then we send the request
					HttpClient httpclient = new DefaultHttpClient();
					httpclient.execute(httppost);

					// We get the server response
					ResponseHandler<String> responseHandler = new BasicResponseHandler();
					String response = httpclient.execute(httppost, responseHandler);
					System.out.println("Server response : " + response);

				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					log.setText("UnsupportedEncodingException: " + e.toString());

				} catch (ClientProtocolException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					log.setText("ClientProtocolException: " + e.toString());
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					log.setText("IOException: " + e.toString());
				}
			}
		}).start();

	}
}
