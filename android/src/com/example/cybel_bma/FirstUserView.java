package com.example.cybel_bma;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.text.Editable;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TimePicker;
import android.widget.Toast;


public class FirstUserView extends Activity{
// plublic variable creation
public	Editable adressDep;
public	Editable adressArriv;

@SuppressWarnings("null")
public void onCreate(Bundle savedInstanceState){
	super.onCreate(savedInstanceState);
	setContentView(R.layout.firstuserview);
	
	//take hour informations
	TimePicker hourPicker= (TimePicker) findViewById(R.id.HourPicker);
	hourPicker.setIs24HourView(true);
	int hour=hourPicker.getCurrentHour();
	int minut=hourPicker.getCurrentMinute();
	
	// take Date informations
	
	DatePicker datePicker = (DatePicker) findViewById(R.id.datePicker);
	int day = datePicker.getDayOfMonth();
	int month= datePicker.getMonth();
	int year = datePicker.getYear();
	
	// take Departure
	EditText departure= (EditText) findViewById(R.id.adressDepart);
	adressDep= departure.getText();
	
	// take arrival
	EditText arrival= (EditText) findViewById(R.id.adressDepart);
	adressArriv= arrival.getText();
	
	// get Type de parcours
	
//	RadioGroup parcours= (RadioGroup) findViewById(R.id.choixTrajet);
//	int buttonChoice=parcours.getCheckedRadioButtonId();
	
	
	/// get moyen transport
	
	CheckBox velo=(CheckBox) findViewById(R.id.checkBox3);
	CheckBox train=(CheckBox) findViewById(R.id.checkBox2);
	CheckBox bus=(CheckBox) findViewById(R.id.checkBox1);
			
	/// validation Listener
			ImageButton validate=(ImageButton) findViewById( R.id.imageButton1);
			validate.setOnClickListener(myListener);
	

	
}

// Listener creation
private OnClickListener myListener = new OnClickListener() {
    public void onClick(View v) {
        
    	if( adressArriv.length() != 0 && adressDep.length() != 0)
    	{

Intent intent = new Intent(FirstUserView.this,com.example.cybel_bma.PosibilityForUser.class);
//Next create the bundle and initialize it
Bundle bundle = new Bundle();
//Add the parameters to bundle as
bundle.putString("adDep", adressDep.toString());
bundle.putString("adArr", adressArriv.toString());
//Add this bundle to the intent
intent.putExtras(bundle);
//Start next activity
FirstUserView.this.startActivity(intent);
    		
    		
    	}
    	else
    	{
    		Toast WarrningInformationNoComplet=Toast.makeText(getApplicationContext(), "Information manquantes", Toast.LENGTH_LONG);
    		WarrningInformationNoComplet.show();
    	}
      }
  };
}
