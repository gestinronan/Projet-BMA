package com.example.cybel_bma;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.text.Editable;
import android.view.Menu;
import android.widget.CheckBox;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TimePicker;


public class FirstUserView extends Activity{

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
	Editable adressDep= departure.getText();
	
	// take arrival
	EditText arrival= (EditText) findViewById(R.id.adressDepart);
	Editable adressArriv= arrival.getText();
	
	// get Type de parcours
	
	RadioGroup parcours= (RadioGroup) findViewById(R.id.choixTrajet);
	int buttonChoice=parcours.getCheckedRadioButtonId();
	
	
	/// get moyen transport
	
	CheckBox velo=(CheckBox) findViewById(R.id.checkBox3);
	CheckBox train=(CheckBox) findViewById(R.id.checkBox2);
	CheckBox bus=(CheckBox) findViewById(R.id.checkBox1);
	
	 if()
		
	
}
}
