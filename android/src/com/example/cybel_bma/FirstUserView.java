package com.example.cybel_bma;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.widget.TimePicker;


public class FirstUserView extends Activity{

@SuppressWarnings("null")
public void onCreate(Bundle savedInstanceState){
	super.onCreate(savedInstanceState);
	setContentView(R.layout.firstuserview);
	
	TimePicker hourPicker= (TimePicker) findViewById(R.id.HourPicker);
	hourPicker.setIs24HourView(true);
	int hour=hourPicker.getCurrentHour();
	int minut=hourPicker.getCurrentMinute();
	
		
		
		
	
}
}
