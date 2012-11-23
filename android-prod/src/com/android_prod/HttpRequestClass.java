package com.android_prod;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.widget.Toast;

import java.lang.Object;
import java.nio.Buffer;

public class HttpRequestClass extends AsyncTask<Void, Integer, Void>{

	// Variable
	Context mContext;
	Intent intent;
	String dataBike, dataBus;

	// Constuctor
	public HttpRequestClass(Context context, Intent i){
		mContext = context;
		intent = i;
	}

	@SuppressWarnings("null")
	protected Void doInBackground(Void... arg0) {

		
		
		/***** Get the bike data *****/

		// First we create the variable for the call
		InputStream is = null;
		String resultBike = "";
		String resultBus = "";

		// First let's get the bus
		try{

			HttpClient httpclient = new DefaultHttpClient();

			HttpPost httppost = new HttpPost("http://data.keolis-rennes.com/json/?version=2.0&key=FR6UMKCXT1TY5GJ&cmd=getbikestations");
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
			resultBike=sb.toString();
			//System.out.println("Here is the server result: " + result);

		}catch(Exception e){
			System.out.println("Error converting result " + e.toString());
		}
		dataBike = resultBike;
		
		/*********** Get the bus Data ********/
		// Creation of the file to took it in the internal storage
		String FILENAME = "Bus_Metro_data.json";
		Context  fileContext = null;
		FileOutputStream WriteStream = null;
		@SuppressWarnings("unused")
		FileInputStream ReadStream=null;
		
		try {
			//if the file found
			ReadStream=fileContext.openFileInput(FILENAME);
			byte[] buffer = null;
			ReadStream.read(buffer);
			dataBus=buffer.toString();
			
		} catch (FileNotFoundException e1) {
			
	
		// If File Not found

		try{
			
			HttpClient httpclient = new DefaultHttpClient();

			HttpPost httppost = new HttpPost("http://data.keolis-rennes.com/json/?version=1.0&key=FR6UMKCXT1TY5GJ&cmd=getstation&param[request]=all");
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
			resultBus=sb.toString();
			//System.out.println("Here is the server result: " + result);

		}catch(Exception e){
			System.out.println("Error converting result " + e.toString());
		}
		
		dataBus = resultBus;
		
		try {
			WriteStream = fileContext.getApplicationContext().openFileOutput(FILENAME, Context.MODE_WORLD_WRITEABLE);
			WriteStream.write(dataBus.getBytes());
			WriteStream.close();
		} catch (IOException e) {
			// Error during wrinting File
			Toast error=Toast.makeText(fileContext, "File Bus information Not Write", Toast.LENGTH_LONG);
			error.show();
		}
		

				} catch (Exception e) {
			// Error during reading file
					Toast error=Toast.makeText(fileContext, "Erreur a la lecture du fichier", Toast.LENGTH_LONG);
					error.show();
		}
		
		
		return null;
		
	}

	
	// Executed once the calls are done
	protected void onPostExecute(Void result) {

		// Diplay the data 
		System.out.println("Data before intent: " + dataBus);
		System.out.println("Data before intent: " + dataBike);
		
		// Then put data in the intent
		intent.putExtra("busData", dataBus);
		intent.putExtra("bikeData", dataBike);

		// Start the other Activity
		mContext.startActivity(intent);

	}

}