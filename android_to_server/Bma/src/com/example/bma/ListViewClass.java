package com.example.bma;

import java.util.ArrayList;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.bma.R;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

public class ListViewClass  extends Activity {

	// Variable
	String data;
	JSONObject jArray;
	private ListView maListViewPerso; 

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.list_view);

		// We get the layout element
		maListViewPerso = (ListView) findViewById(R.id.listviewperso);

		// We get the data to display
		Intent intent = getIntent();
		data = intent.getStringExtra("data");

		// We parse the String to JSON
		try{
			jArray = new JSONObject(data);
		}catch(JSONException e){
			System.out.println("Error parsing data " + e.toString());
		}

		// Define the list
		ArrayList<HashMap<String, String>> mylist = new ArrayList<HashMap<String, String>>();

		// Fill the table for the list
		try{
			//Get the element that holds the earthquakes ( JSONArray )
			JSONArray  station = jArray.getJSONArray("station");
			//Loop the Array
			for(int i=0;i < station.length();i++){                      
				HashMap<String, String> map = new HashMap<String, String>();
				JSONObject e = station.getJSONObject(i);
				map.put("id",  String.valueOf(i));
				map.put("name", "Station name:" + e.getString("name"));
				map.put("longitude", "Longitude: " +  e.getString("longitude"));
				map.put("latitude", "Latitude: " +  e.getString("latitude"));
				map.put("bikesavailable", "Bikes available: " +  e.getString("bikesavailable"));
				mylist.add(map);
			}
		}catch(JSONException e)        {
			Log.e("log_tag", "Error parsing data " + e.toString());
		}


		// Display the list
		ListAdapter adapter = new SimpleAdapter(this, mylist , R.layout.list_view_item,
				new String[] { "name", "longitude", "latitude", "bikesavailable" },
				new int[] { R.id.item_title, R.id.item_lng, R.id.item_lat, R.id.item_bike });
		maListViewPerso.setAdapter(adapter);
		
		maListViewPerso.setOnItemClickListener(new OnItemClickListener() {
			
			@SuppressWarnings("unchecked")
			public void onItemClick(AdapterView<?> arg0, View arg1, int id, long arg3) {
				
				//on récupère la HashMap contenant les infos de notre item (titre, description, img)
        		HashMap<String, String> map = (HashMap<String, String>) maListViewPerso.getItemAtPosition(id);
        		
        		//on créer une boite de dialogue
        		AlertDialog.Builder adb = new AlertDialog.Builder(ListViewClass.this);
        		
        		//on attribut un titre à notre boite de dialogue
        		adb.setTitle("Sélection Item");
        		
        		//on insère un message à notre boite de dialogue, et ici on affiche le titre de l'item cliqué
        		adb.setMessage("Votre choix : "+map.get("titre"));
        		
        		//on indique que l'on veut le bouton ok à notre boite de dialogue
        		adb.setPositiveButton("Ok", null);
        		
        		//on affiche la boite de dialogue
        		adb.show();				
			}
         });
		

	}
}
