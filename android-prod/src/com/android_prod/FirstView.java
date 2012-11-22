package com.android_prod;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class FirstView extends Activity {
	
	/************** This is the local Variable declaration *******************/
	
	/*************************************************************************/

	/************* This is the first Class call when the app start **********/
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_first_view);
	}
	/*************************************************************************/
	
	
	/********* This create the Action. For this View we don't need it*******/
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_first_view, menu);
		
		// For the first view, we don't need the Action Bar so we hide it
		ActionBar actionBar = getActionBar();
		actionBar.hide();
		
		return true;
	}
	/*************************************************************************/
	
}
