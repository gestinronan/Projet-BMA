package com.esir.bmaandroidonly;

// This Class Create marker on the map


import java.util.ArrayList;

import android.app.AlertDialog;
import android.content.Context;
import android.graphics.drawable.Drawable;

import com.google.android.maps.ItemizedOverlay;
import com.google.android.maps.OverlayItem;

public class MapOverlayBma extends ItemizedOverlay {
	
	// Variable
	private ArrayList<OverlayItem> mOverlays = new ArrayList<OverlayItem>();
	private Context mContext;
	
	// Constructor of the method
	public MapOverlayBma(Drawable arg0, Context context) {
		super(boundCenterBottom(arg0));
		mContext = context;
	}
	
	// This populate the overlay
	public void addOverlay(OverlayItem overlay) {
	    mOverlays.add(overlay);
	    populate();
	}

	// This create an overlay item
	protected OverlayItem createItem(int i) {
		return mOverlays.get(i);
	}

	// Return the size of the list
	public int size() {
		return mOverlays.size();
	}
	
	// This manage the tap action
	protected boolean onTap(int index) {
		  OverlayItem item = mOverlays.get(index);
		  AlertDialog.Builder dialog = new AlertDialog.Builder(mContext);
		  dialog.setTitle(item.getTitle());
		  dialog.setMessage(item.getSnippet());
		  dialog.show();
		  return true;
	}
	
	// This remove the current marker
	public void removePoint(){
        this.mOverlays.clear();
        populate();
    }
	
}
