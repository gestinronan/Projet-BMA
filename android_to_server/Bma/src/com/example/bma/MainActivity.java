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
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity implements LocationListener{
	
	/************** Global Variable Declaration *********************/
	// Layout Variables
	TextView lng, lat;
	static TextView log;
	TextView alt;
	Button locateMe, sendPosition, getRequest, viewResult, mapView;

	// Final variable
	public final int INVISIBLE = 1;
	public final int VISIBLE = 0;

	// Geolocation Variables
	static String myLng;
	static String myLat;
	static String myAlt;
	
	// Location listener
	private LocationManager lm;

	// Http request Variable
	static String respFromServer;
	static String url;
	static HttpResponse response;
	static URI uri = null;
	static JSONObject dataFromServer, jArray;

	// Progress bar variable
	protected ProgressDialog mProgressDialog;
	public static final int MSG_ERR = 0;
	public static final int MSG_CNF = 1;
	public static final int MSG_IND = 2;
	public static final String TAG = "ProgressBarActivity";
	private Context mContext;
	private Handler mHandler;
	/*****************************************************/
	/**************** First Fonction call ****************/
	@Override
	public void onCreate(Bundle savedInstanceState) {

		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		// Location listner
		lm = (LocationManager) this.getSystemService(LOCATION_SERVICE);
		if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER))
			lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 0,
					this);
		lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 10000, 0,
				this);

		mContext = this;
		
		
		// Get the layout element
		lng = (TextView) findViewById(R.id.longitude);
		lat = (TextView) findViewById(R.id.lattitude);
		alt = (TextView) findViewById(R.id.altitude);
		locateMe = (Button) findViewById(R.id.getPosition);
		log = (TextView) findViewById(R.id.logTextView);
		sendPosition = (Button) findViewById(R.id.httpRequest);
		getRequest = (Button) findViewById(R.id.httpGet);
		viewResult = (Button) findViewById(R.id.viewResult);
		mapView = (Button) findViewById(R.id.viewMap);

		// We hide the viewResult button
		viewResult.setVisibility(View.INVISIBLE);
		
		/*****Add a listener to the Locate Me Button *******/
		locateMe.setOnClickListener(new Button.OnClickListener() {

			// Action when clicking the button
			public void onClick(View v) {
				getPosition();	
				lng.setText("Longitude: " + myLng);
				lat.setText("Latitude: " + myLat);
				alt.setText("Altitude: " + myAlt);

			}
		});
		/*****************************************************/
		/*****Add a Listener to the Send Position Button******/
		sendPosition.setOnClickListener(new Button.OnClickListener() {

			// Action when clicking the button
			public void onClick(View arg0) {

				// Url use for the request
				url = "http://192.168.1.12:8080/android"; // set the url for the call
				log.setText("Making request.");
				// Call the server
				postHttp(url);

				// Display the response
				log.setText(respFromServer);
			}});
		/*****************************************************/
		/*****add a listener to the Get Data button***********/
		getRequest.setOnClickListener(new Button.OnClickListener(){

			public void onClick(View arg0) {

				// We call the GET function
				getHttpResponse("http://192.168.1.12:3000/android");
				System.out.println("Here is what we get from the server: " + dataFromServer);

			}

		});
		/*****************************************************/
		/*******Add a listener on the View Result button******/
		viewResult.setOnClickListener(new Button.OnClickListener(){

			public void onClick(View v) {

				// This call an intent in order to change view
				Intent intent = new Intent(MainActivity.this, ListViewClass.class); 
				String jsonToString = dataFromServer.toString();
				intent.putExtra("data", jsonToString);
				startActivity(intent);

			}

		});
		/*****************************************************/
		/*******Add a listener to the Map View button ********/
		mapView.setOnClickListener(new Button.OnClickListener(){

			@Override
			public void onClick(View arg0) {

				// This call an intent in order to change view
				Intent intent = new Intent(MainActivity.this, MapViewClass.class); 
				intent.putExtra("latitude", myLat);
				intent.putExtra("longitude", myLng);
				startActivity(intent);

			}

		});
		/*****************************************************/
		/******Handler which manage the progress dialog************/ 
		mHandler = new Handler() {
			public void handleMessage(Message msg) {
				String text2display = null;
				switch (msg.what) {
				case MSG_IND:
					if (mProgressDialog.isShowing()) {
						mProgressDialog.setMessage(((String) msg.obj));
					}
					break;
				case MSG_ERR:
					text2display = (String) msg.obj;
					Toast.makeText(mContext, "Error: " + text2display,
							Toast.LENGTH_LONG).show();
					if (mProgressDialog.isShowing()) {
						mProgressDialog.dismiss();
					}
					break;
				case MSG_CNF:
					text2display = (String) msg.obj;
					Toast.makeText(mContext, "Info: " + text2display,
							Toast.LENGTH_LONG).show();
					if (mProgressDialog.isShowing()) {
						mProgressDialog.dismiss();
					}

					break;
				default: // should never happen
					break;
				}
			}
		};
		/*****************************************************/
	}
	/*****************************************************/
	/****** Method which creat the action bar ************/
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}
	/*****************************************************/
	/************* Get GPS position *********************/
	private void getPosition(){


	}
	/*****************************************************/
	/********* GET method for Http request ***************/
	private void getHttpResponse(final String url) {

		// Launch the progress dialog
		mProgressDialog = ProgressDialog.show(this, "Please wait", "Long operation starts...", true);

		// Create a new thread for the GET request
		new Thread(new Runnable(){

			public void run() {

				// Launch the progress bar
				Message msg = null;
				String progressBarData = "Calling the server...";
				msg = mHandler.obtainMessage(MSG_IND, (Object) progressBarData); // populates the message
				mHandler.sendMessage(msg); // sends the message to our handler

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

				// Dispaly an other message in the progress bar
				progressBarData = "Parsing the Result...";
				msg = mHandler.obtainMessage(MSG_IND, (Object) progressBarData);  // populates the message
				mHandler.sendMessage(msg);  // sends the message to our handler

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

				// Dispaly an other message in the progress bar
				progressBarData = "Building the json...";
				msg = mHandler.obtainMessage(MSG_IND, (Object) progressBarData);  // populates the message
				mHandler.sendMessage(msg);  // sends the message to our handler


				// And we convert the String into a Json
				try{
					jArray = new JSONObject(result);
				}catch(JSONException e){
					System.out.println("Error parsing data " + e.toString());
				}
				// Copy the data into the local variable
				dataFromServer = jArray;

				// Close the progress Dialog.
				msg = mHandler.obtainMessage(MSG_CNF, "Parsing and computing ended successfully !");
				mHandler.sendMessage(msg); // sends the message to our handler
			}
		}).start();

		// Display the view data button
		viewResult.setVisibility(View.VISIBLE);
	}
	/*****************************************************/
	/****** POST method for Http Request *****************/
	private void postHttp(String url){

		// Launch the progress dialog
		mProgressDialog = ProgressDialog.show(this, "Please wait", "Long operation starts...", true);

		// Create a new thread for the POST request
		new Thread(new Runnable(){
			public void run() {

				// Launch the progress bar
				Message msg = null;
				String progressBarData = "Sending data to the server";
				msg = mHandler.obtainMessage(MSG_IND, (Object) progressBarData); // populates the message
				mHandler.sendMessage(msg); // sends the message to our handler

				// First we create the variable for the call
				InputStream is = null;
				String result = "";

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
					HttpResponse response = httpclient.execute(httppost);
					HttpEntity entity = response.getEntity();
					is = entity.getContent();

				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (ClientProtocolException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				// Dispaly an other message in the progress bar
				progressBarData = "Parsing the Result...";
				msg = mHandler.obtainMessage(MSG_IND, (Object) progressBarData);  // populates the message
				mHandler.sendMessage(msg);  // sends the message to our handler

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

					// And we convert the String into a Json
					jArray = new JSONObject(result);
					System.out.println(jArray);
				}catch(JSONException e){
					System.out.println("Error parsing data " + e.toString());

				}catch(Exception e){
					System.out.println("Error converting result " + e.toString());
				}
				// Copy the data into the local variable
				dataFromServer = jArray;

				// Close the progress Dialog.
				msg = mHandler.obtainMessage(MSG_CNF, "Parsing and computing ended successfully !");
				mHandler.sendMessage(msg); // sends the message to our handler
			}
		}).start();

		// Display the view data button
		viewResult.setVisibility(View.VISIBLE);
	}
	/*****************************************************/
	
	/**************Location Listener********************/
	
	/******** Called when the location change***********/
	public void onLocationChanged(Location location) {
		
		// Copy the longitude and latitude in global variable
		double lat = location.getLatitude();
		double lng = location.getLongitude();
		myLat = String.valueOf(lat);
		myLng = String.valueOf(lng);

	}
	/*****************************************************/
	/***********Called when the GPS is Disable************/
	@Override
	public void onProviderDisabled(String arg0) {
		// TODO Auto-generated method stub

	}
	/*****************************************************/
	/***********Called when the GPS is Enable ************/
	public void onProviderEnabled(String arg0) {
		// TODO Auto-generated method stub

	}
	/*****************************************************/
	/*******Called when the GPS status change ************/
	public void onStatusChanged(String arg0, int arg1, Bundle arg2) {
		// TODO Auto-generated method stub

	}
	/*****************************************************/
}
