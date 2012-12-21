package com.android_prod;

//~--- non-JDK imports --------------------------------------------------------

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import android.app.Activity;

import android.content.Context;
import android.content.Intent;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

public class FirstView extends Activity {
    private Context context;

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_first_view);

        //
        context = this;

        // Create an intent
        Intent intent = new Intent(FirstView.this, MapViewClass.class);

        // Create an object of the call HttpRequest
        HttpRequestClass request = new HttpRequestClass(context, intent);

       request.execute();
        
        
    
    }
}


//~ Formatted by Jindent --- http://www.jindent.com
